import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!backendUrl) {
      setErrorMsg("Backend URL is missing in your .env file");
      return;
    }
    if (gender === "") {
      setErrorMsg("Please select a gender");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const apiUrl = `${backendUrl.replace(/\/$/, "")}/api/signup`;

    const bodyData = {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      gender,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then((result) => {
        if (!result.ok) {
          setErrorMsg(result.data.error || "Signup failed");
        } else {
          setSuccessMsg("Account created! Redirecting to login…");
          setUsername("");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setGender("");
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1500);
        }
      })
      .catch((err) => {
        setErrorMsg("Could not reach the server: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        background: "#f4f6f8",
        padding: "2rem 1rem",
        marginTop: "56px",
        minHeight: "100vh",
      }}
    >
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
              Sign Up
            </h1>
            <p className="text-gray-500 text-lg">
              Create your account to get started
            </p>
          </div>

          {/* Alerts */}
          {errorMsg !== "" && (
            <div className="bg-red-500 text-white p-4 rounded-xl shadow-md text-center">
              {errorMsg}
            </div>
          )}
          {successMsg !== "" && (
            <div className="bg-green-500 text-white p-4 rounded-xl shadow-md text-center">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 font-semibold text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FC1E0] transition-colors duration-200"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="block mb-2 font-semibold text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FC1E0] transition-colors duration-200"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block mb-2 font-semibold text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FC1E0] transition-colors duration-200"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-semibold text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FC1E0] transition-colors duration-200"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FC1E0] transition-colors duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block mb-2 font-semibold text-gray-700"
              >
                Gender
              </label>
              <select
                id="gender"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FC1E0] transition-colors duration-200"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#7FC1E0] text-white font-semibold py-3 rounded-xl shadow-md hover:bg-[#5fa9cb] transition-colors duration-200 disabled:opacity-50"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Signing up…" : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <span className="text-gray-500">Already have an account?</span>
            <Link
              to="/"
              className="inline-block ml-2 border border-[#7FC1E0] text-[#28779a] font-semibold py-2 px-4 rounded-full hover:bg-[#e9f5fb] transition-colors duration-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
