import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState } from "react";

export const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "", // 👈 added gender
  });

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // TODO: send to backend (fetch POST /signup)
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: "#f4f6f8" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12" style={{ maxWidth: "45rem" }}>
            <div
              className="card shadow-lg border-0"
              style={{ borderRadius: "1rem", overflow: "hidden" }}
            >
              <div className="card-header bg-white text-center py-4 border-0">
                <h1 className="card-title fw-bold text-primary mb-1">Sign Up</h1>
                <p className="card-text text-muted mb-0">
                  Create your account to get started
                </p>
              </div>

              <div className="card-body p-4 p-md-5 bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className="form-control"
                      placeholder="Enter your username"
                      value={form.username}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">First Name</label>
                    <input
                      name="firstName"
                      type="text"
                      className="form-control"
                      placeholder="Enter your first name"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input
                      name="lastName"
                      type="text"
                      className="form-control"
                      placeholder="Enter your last name"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email address</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>

                  {/* 👇 Gender Select */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Gender</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg fw-semibold"
                      style={{
                        borderRadius: "50px",
                        transition: "0.3s ease-in-out",
                      }}
                      onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                      onMouseOut={(e) => (e.target.style.opacity = "1")}
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer bg-light border-0 text-center py-3">
                <span className="text-muted">Already have an account?</span>
                <a
                  href="/login"
                  className="btn btn-outline-primary btn-sm ms-2 rounded-pill"
                >
                  Sign in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



