import React, { useState } from 'react';

const GoalTracker = () => {

    const [goals, setGoals] = useState([]);
    const [newGoalText, setNewGoalText] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');

    const addGoal = () => {
        if (newGoalText.trim() !== '' && newGoalTarget > 0) {
            const newGoalItem = {
                id: Date.now(),
                text: newGoalText,
                completions: 0,
                target: parseInt(newGoalTarget),
            };
            setGoals([...goals, newGoalItem]);
            setNewGoalText('');
            setNewGoalTarget('');
        }
    };

    const completeGoal = (id) => {
        const updatedGoals = goals.map(goal => {
            if (goal.id === id) {
                // Increment completions, but don't exceed the target.
                const newCompletions = Math.min(goal.completions + 1, goal.target);
                return { ...goal, completions: newCompletions };
            }
            return goal;
        });
        setGoals(updatedGoals);
    };

    // Function to delete a goal from the list.
    const deleteGoal = (id) => {
        const updatedGoals = goals.filter(goal => goal.id !== id);
        setGoals(updatedGoals);
    };

    return (
        // Main container with full screen height and centered content.
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
                {/* Title and description section. */}
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

                {/* Goal list section. */}
                <div className="space-y-4">
                    {goals.length === 0 ? (
                        <div className="text-center text-gray-400 p-8">
                            <p>No goals added yet. Let's get started!</p>
                        </div>
                    ) : (
                        goals.map(goal => {
                            // percentage.
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

                                    {/* Progress bar and buttons container - I'm crying */}
                                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                                        <div className="w-40 bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 w-12 text-right">{goal.completions}/{goal.target}</span>

                                        {/* Buttons for interaction */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => completeGoal(goal.id)}
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