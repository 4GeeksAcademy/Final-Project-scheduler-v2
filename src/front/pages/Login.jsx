import React, { useState } from "react";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = (e) => {
        e.preventDefault();

        console.log('Sign-in button clicked!');
        console.log('Username:', username);
        console.log('Password:', password);
    };

    const handleSignUp = () => {

        console.log('Sign-up button clicked!');
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
            <div className="card p-5 shadow-sm rounded-3" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center">
                    <h2 className="fw-bold">Sign In</h2>
                    <p className="text-muted">Sign in to continue</p>
                    <hr className="my-4" />
                </div>
                <form onSubmit={handleSignIn}>
                    <div className="mb-4">
                        <label htmlFor="usernameInput" className="form-label">Username:</label>
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            id="usernameInput"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="passwordInput" className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control rounded-pill"
                            id="passwordInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-grid gap-2">
                        <button
                            type="submit"
                            className="btn btn-dark btn-lg rounded-pill"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <div className="text-center mt-5">
                    <p className="text-muted mb-0">Don't have an account yet?</p>
                    <button
                        onClick={handleSignUp}
                        className="btn btn-link text-dark text-decoration-none fw-bold"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;