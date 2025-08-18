import { useState } from "react";

const LoginForm = ({ username, password, onUsernameChange, onPasswordChange, onSubmit, isSubmitting }) => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Sign In</h2>
            <p className="text-center text-gray-500 text-sm mb-6">Sign in to continue</p>
            <form onSubmit={onSubmit} className="space-y-4">

                <div className="from-group">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={onUsernameChange}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={onPasswordChange}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md font-bold text-white shadow-sm ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>

            </form>
        </div>
    )
};

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitted] = useState(false);

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitted(true);

        console.log('Attempting to sign in with:', { username, password });

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Login successful!');
        }
        catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Check your credentials');
        }
        finally {
            setIsSubmitted(false);
        }
    };

    
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans antialiased">
            <div className="w-full max-w-md bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex justify-between items-center mb-8">

                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                    <span className="ml-4 font-bold text-gray-800 text-lg">Time Tidy</span>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="text-gray-600 hover:text-gray-900">🔔</button>
                    <button className="text-gray-600 hover:text-gray-900 font-medium">Sign Up</button>
                </div>

            </div>

            <LoginForm
                username={username}
                password={password}
                onUsernameChange={(e) => setUsername(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onSubmit={handleLoginSubmit}
                isSubmitting={isSubmitting}
            />

        </div>



    );


};

export default App;