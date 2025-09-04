import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const SettingsPage = () => {
    const navigate = useNavigate();
    const userId = 1; // Hardcoded user ID

    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editNumber, setEditNumber] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhoto, setEditPhoto] = useState(null);

    // New: Profile visibility state
    const [isPublic, setIsPublic] = useState(true);
    const [editIsPublic, setEditIsPublic] = useState(isPublic);

    // Fetch user data from backend
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_URL}/api/user/${userId}`);
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setName(`${data.first_name} ${data.last_name}`);
                setEditName(`${data.first_name} ${data.last_name}`);
                setEmail(data.email);
                setEditEmail(data.email);
                // Set other fields as needed
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, [userId]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setEditPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setName(editName);
        setNumber(editNumber);
        setEmail(editEmail);
        setProfilePhoto(editPhoto);
        setIsPublic(editIsPublic);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditName(name);
        setEditNumber(number);
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
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
                <div>
                    <div>
                        <label>Name:</label>
                        <input value={editName} onChange={e => setEditName(e.target.value)} />
                    </div>
                    <div>
                        <label>Number:</label>
                        <input value={editNumber} onChange={e => setEditNumber(e.target.value)} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                    </div>
                    <div>
                        <label>Photo:</label>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} />
                        {editPhoto && <img src={editPhoto} alt="Preview" style={{ width: 80, borderRadius: "50%" }} />}
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={editIsPublic}
                                onChange={e => setEditIsPublic(e.target.checked)}
                                style={{ marginRight: "8px" }}
                            />
                            Make my profile public (others can see your profile box and progress bars)
                        </label>
                    </div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
            <div style={{ marginTop: "20px" }}>
                <strong>Profile is currently: </strong>
                {isPublic ? "Public" : "Private"}
            </div>
        </div>
    );
};

export default SettingsPage;