import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

const SettingsPage = () => {
    const navigate = useNavigate();

    const [authed, setAuthed] = useState(null);
    const [userId, setUserId] = useState(null);

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editPhoto, setEditPhoto] = useState(null);

    const [isPublic, setIsPublic] = useState(true);

    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setAuthed(false);
            return;
        }
        setAuthed(true);

        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_URL}/api/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setUserId(data.id);
                setName(`${data.first_name}`);
                setLastName(data.last_name);
                setEmail(data.email);
                setIsPublic(!!data.is_public);
            } catch (err) {
                console.error(err);
                setAuthed(false);
            }
        };
        fetchUser();
    }, []);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setEditPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setErrorMsg("");
        try {
            const updatedUser = {
                first_name: name,
                last_name: lastName,
                email: email,
                is_public: isPublic
            };

            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify(updatedUser)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                setErrorMsg(errData.msg || "Failed to update user");
                return;
            }

            const data = await res.json();
            setName(`${data.first_name}`);
            setLastName(data.last_name);
            setEmail(data.email);
            setIsPublic(!!data.is_public);
            setProfilePhoto(data.profile_photo || null);
            setIsEditing(false);

            navigate(`/profile/${userId}`);
        } catch (err) {
            setErrorMsg("Failed to update user");
            console.error(err);
        }
    };

    const handleCancel = () => {
        setEditPhoto(profilePhoto);
        setIsEditing(false);
    };

    if (authed === false) {
        return (
            <div
                className="d-flex align-items-start justify-content-center"
                style={{
                    background: "#f4f6f8",
                    padding: "2rem 1rem",
                    marginTop: "56px",
                    minHeight: "100vh",
                }}
            >
                <div className="w-100" style={{ maxWidth: "720px" }}>
                    <div className="card shadow-lg border-0" style={{ borderRadius: "1rem", overflow: "hidden" }}>
                        <div className="card-header bg-white border-0 text-center py-4">
                            <h1 className="fw-bold mb-0 fs-2" style={{ color: "#28779a" }}>Settings</h1>
                        </div>
                        <div className="card-body p-4 p-md-5 bg-white text-center">
                            <p className="text-muted mb-4">You need an account to access Settings.</p>
                            <div className="d-flex justify-content-center gap-2">
                                <Link to="/">
                                    <button className="btn rounded-pill px-4" style={{ background: "#7FC1E0", color: "white" }}>
                                        Sign In
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="btn rounded-pill px-4" style={{ border: "1px solid #7FC1E0", color: "#28779a", background: "transparent" }}>
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (authed === null) {
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
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading…</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="d-flex align-items-start justify-content-center"
            style={{
                background: "#f4f6f8",
                padding: "2rem 1rem",
                marginTop: "56px",
                minHeight: "100vh",
            }}
        >
            <div className="w-100" style={{ maxWidth: "720px" }}>
                <div className="card shadow-lg border-0" style={{ borderRadius: "1rem", overflow: "hidden" }}>
                    <div className="card-header bg-white border-0 text-center py-4">
                        <h1 className="fw-bold mb-0 fs-2" style={{ color: "#28779a" }}>Settings</h1>
                    </div>

                    <div className="card-body p-4 p-md-5 bg-white">
                        <div className="d-flex justify-content-start mb-3">
                            <button
                                className="btn rounded-pill px-4"
                                onClick={() => navigate(`/profile/${userId}`)}
                                style={{ border: "1px solid #7FC1E0", color: "#28779a", background: "transparent" }}
                            >
                                Back to Profile
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="publicSwitch"
                                    checked={isPublic}
                                    onChange={async (e) => {
                                        const newValue = e.target.checked;
                                        setIsPublic(newValue);
                                        try {
                                            const token = localStorage.getItem("token");
                                            await fetch(`${API_URL}/api/users/${userId}`, {
                                                method: "PATCH",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    ...(token && { Authorization: `Bearer ${token}` })
                                                },
                                                body: JSON.stringify({ is_public: newValue }),
                                            });
                                        } catch (err) {
                                            console.error(err);
                                        }
                                    }}
                                />
                                <label className="form-check-label ms-2" htmlFor="publicSwitch">
                                    Make my profile public (others can see your profile box and progress bars)
                                </label>
                            </div>
                        </div>

                        {!isEditing ? (
                            <button
                                className="btn rounded-pill px-4"
                                onClick={() => setIsEditing(true)}
                                style={{ background: "#7FC1E0", color: "white" }}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minHeight: "400px",
                                    height: "60vh",
                                    justifyContent: "flex-start",
                                    position: "relative"
                                }}
                            >
                                <div className="mb-3">
                                    <label className="form-label">First Name</label>
                                    <input
                                        className="form-control rounded-pill"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="First name"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        className="form-control rounded-pill"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        placeholder="Last name"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control rounded-pill"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className="form-label me-3">Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                        onChange={handlePhotoChange}
                                    />
                                    {editPhoto && (
                                        <img
                                            src={editPhoto}
                                            alt="Preview"
                                            style={{ width: 80, borderRadius: "50%", marginTop: 10 }}
                                        />
                                    )}
                                </div>

                                <div style={{ flex: 1 }} />

                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button
                                        className="btn rounded-pill px-4"
                                        onClick={handleSave}
                                        style={{ background: "#7FC1E0", color: "white" }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn rounded-pill px-4"
                                        onClick={handleCancel}
                                        style={{ border: "1px solid #7FC1E0", color: "#28779a", background: "transparent" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <strong>Profile is currently: </strong>
                            {isPublic ? "Public" : "Private"}
                        </div>

                        {errorMsg && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {errorMsg}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
