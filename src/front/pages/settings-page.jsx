import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    // userId from localStorage
    // const userId = localStorage.getItem("user_id");
    const [userId, setUserId] = useState(null);

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhoto, setEditPhoto] = useState(null);

    const [isPublic, setIsPublic] = useState(true);
    const [editIsPublic, setEditIsPublic] = useState(isPublic);

    const [errorMsg, setErrorMsg] = useState("");

    // User data from backend
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setUserId(data.id);
                setName(`${data.first_name}`);
                setEditName(`${data.first_name} ${data.last_name}`);
                setLastName(data.last_name);
                setEmail(data.email);
                setEditEmail(data.email);
                // Set other fields as needed
            } catch (err) {
                console.error(err);
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
            const [first_name, ...last_name] = editName.trim().split(" ");
            const updatedUser = {
                first_name: name,
                last_name: lastName,
                email: email,
                is_public: editIsPublic,
                // Does backend support photo?
                //...(editPhoto && { profile_photo: editPhoto }),
            };

            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/users/${userId}`, { // <-- plural 'users'
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify(updatedUser),
            });

            if (!res.ok) {
                const errData = await res.json();
                setErrorMsg(errData.msg || "Failed to update user");
                return;
            }
            console.log("name:", name);

            const data = await res.json();
            setName(`${data.first_name} ${data.last_name}`);
            setEmail(data.email);
            setIsPublic(data.is_public);
            setProfilePhoto(data.profile_photo || null);
            setIsEditing(false);

            navigate(`/profile/${userId}`);
        } catch (err) {
            setErrorMsg("Failed to update user");
            console.error(err);
        }
    };

    const handleCancel = () => {
        setEditName(name);
        setEditEmail(email);
        setEditPhoto(profilePhoto);
        setEditIsPublic(isPublic);
        setIsEditing(false);
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>Settings</h1>
            <button onClick={() => navigate(`/profile/${userId}`)} style={{ marginBottom: "20px" }}>
                Back to Profile
            </button>

            <div style={{ marginBottom: "20px" }}>
                <label>
                    <input
                        type="checkbox"
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
                        style={{ marginRight: "8px" }}
                    />
                    Make my profile public (others can see your profile box and progress bars)
                </label>
            </div>

            {!isEditing ? (
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
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
                    {/* ...edit boxes... */}
                    <div>
                        <label>Name:</label>
                        <input value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>Photo:</label>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} />
                        {editPhoto && <img src={editPhoto} alt="Preview" style={{ width: 80, borderRadius: "50%" }} />}
                    </div>
                    <div style={{ flex: 1 }} />

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                        <button onClick={() => handleSave()}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}
            <div style={{ marginTop: "20px" }}>
                <strong>Profile is currently: </strong>
                {isPublic ? "Public" : "Private"}
            </div>
            {errorMsg && (
                <div style={{ color: "red", marginTop: "10px" }}>{errorMsg}</div>
            )}
        </div>
    );
};

export default SettingsPage;