import { Link } from "react-router-dom";

export function UserSearch() {
    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
            <div className="card p-5 shadow-sm rounded-3" style={{ maxWidth: "400px", width: "100%" }}>
                <div className="text-center">
                    <h2 className="fw-bold">Sign In</h2>
                    <p className="text-muted">Sign in to continue</p>
                    <hr className="my-4" />
                </div>

                <form>
                    <div className="mb-4">
                        <label htmlFor="usernameInput" className="form-label">Username:</label>
                        <input
                            id="usernameInput"
                            type="text"
                            className="form-control rounded-pill"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="passwordInput" className="form-label">Password:</label>
                        <input
                            id="passwordInput"
                            type="password"
                            className="form-control rounded-pill"
                            autoComplete="current-password"
                            required
                        />
                    </div>


                </form>


            </div>
        </div>
    );
};
