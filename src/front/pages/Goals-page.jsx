import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL

const GoalTracker = () => {
    const [goals, setGoals] = useState([]);
    const [newGoalText, setNewGoalText] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');
    // New state for handling messages and errors
    const [message, setMessage] = useState(null);

    // Function to display a message for a few seconds
    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => {
            setMessage(null);
        }, 5000); // Hide the message after 5 seconds
    };

    const fetchGoals = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/goals`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch goals.');
            }
            const data = await response.json();
            setGoals(data.goals);
        } catch (error) {
            console.error('Error fetching goals:', error);
            showMessage('Failed to fetch goals. Please try again.');
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const addGoal = async () => {
        if (newGoalText.trim() !== '' && newGoalTarget > 0) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_URL}/api/goals`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        text: newGoalText,
                        target: parseInt(newGoalTarget),
                        completions: 0,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to add goal.');
                }
                setNewGoalText('');
                setNewGoalTarget('');
                await fetchGoals();
            } catch (error) {
                console.error('Error adding goal:', error);
                showMessage('Failed to add goal. Please try again.');
            }
        }
    };

    const completeGoal = async (goalToUpdate) => {
        const token = localStorage.getItem('token');
        const newCompletions = Math.min(goalToUpdate.completions + 1, goalToUpdate.target);

        try {
            const response = await fetch(`${API_URL}/api/goals/${goalToUpdate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completions: newCompletions }),
            });
            if (!response.ok) {
                throw new Error('Failed to update goal.');
            }
            await fetchGoals();
        } catch (error) {
            console.error('Error updating goal:', error);
            showMessage('Failed to update goal. Please try again.');
        }
    };

    const deleteGoal = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/goals/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete goal.');
            }
            await fetchGoals();
        } catch (error) {
            console.error('Error deleting goal:', error);
            showMessage('Failed to delete goal. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">Weekly Goals</h1>
                    <p className="text-gray-500 text-lg">Set a target and track your progress!</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        placeholder="Enter a new goal..."
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                addGoal();
                            }
                        }}
                    />
                    <input
                        type="number"
                        min="1"
                        className="w-24 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center transition-colors duration-200"
                        placeholder="Target"
                        value={newGoalTarget}
                        onChange={(e) => setNewGoalTarget(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                addGoal();
                            }
                        }}
                    />
                    <button
                        onClick={addGoal}
                        className="bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                        Add Goal
                    </button>
                </div>
                {/* Message box for displaying errors or confirmations */}
                {message && (
                    <div className="bg-red-500 text-white p-4 rounded-xl shadow-md text-center">
                        {message}
                    </div>
                )}
                <div className="space-y-4">
                    {goals.length === 0 ? (
                        <div className="text-center text-gray-400 p-8">
                            <p>No goals added yet. Let's get started!</p>
                        </div>
                    ) : (
                        goals.map(goal => {
                            const progressPercentage = (goal.completions / goal.target) * 100;
                            const isComplete = goal.completions >= goal.target;

                            return (
                                <div
                                    key={goal.id}
                                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm"
                                >
                                    <div className="flex-1 min-w-0 pr-4">
                                        <span className={`text-xl font-semibold break-words ${isComplete ? 'text-green-600 line-through' : 'text-gray-800'}`}>
                                            {goal.text}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                                        <div className="w-40 bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 w-12 text-right">{goal.completions}/{goal.target}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => completeGoal(goal)}
                                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isComplete}
                                            >
                                                Add
                                            </button>
                                            <button
                                                onClick={() => deleteGoal(goal.id)}
                                                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoalTracker;