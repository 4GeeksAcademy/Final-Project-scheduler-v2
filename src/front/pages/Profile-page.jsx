import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultProfilePhoto from "../assets/img/profile-photo.jpg";

const getCurrentWeek = (weekOffset = 0) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);
    const week = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }
    return week;
};

const ProfilePage = () => {
    const { userId } = useParams();


    const [name, setName] = useState("Saul");
    const [number, setNumber] = useState("555-123-4567");
    const [email, setEmail] = useState("saul@email.com");
    const [profilePhoto, setProfilePhoto] = useState(defaultProfilePhoto);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(name);
    const [editNumber, setEditNumber] = useState(number);
    const [editEmail, setEditEmail] = useState(email);
    const [editPhoto, setEditPhoto] = useState(profilePhoto);

    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weekOffset, setWeekOffset] = useState(0); // 0 = current week
    const [year, setYear] = useState(new Date().getFullYear());

    const week = getCurrentWeek(weekOffset);

    useEffect(() => {
        const newYear = week[0].getFullYear();
        if (newYear !== year) setYear(newYear);
    }, [weekOffset]);

    useEffect(() => {
        const fetchHolidays = async () => {
            setLoading(true);
            setError(null);
            const apiKey = "gAwykI0JDFTe6Iw0HyvdaNmiYooQrPAb";
            const country = "US";

            try {
                const response = await fetch(
                    `https://calendarific.com/api/v2/holidays?&api_key=${apiKey}&country=${country}&year=${year}`
                );
                const data = await response.json();
                setHolidays(data.response.holidays);
            } catch (error) {
                setError("Failed to fetch holidays");
            } finally {
                setLoading(false);
            }
        };

        fetchHolidays();
    }, [year]);

    const holidaysByDate = {};
    holidays.forEach(holiday => {
        holidaysByDate[holiday.date.iso] = holidaysByDate[holiday.date.iso] || [];
        holidaysByDate[holiday.date.iso].push(holiday.name);
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setName(editName);
        setNumber(editNumber);
        setEmail(editEmail);
        setProfilePhoto(editPhoto);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditName(name);
        setEditNumber(number);
        setEditEmail(email);
        setEditPhoto(profilePhoto);
        setIsEditing(false);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                paddingTop: "80px"
            }}
        >
            {/* Row with profile and progress boxes */}
            <div style={{ display: "flex", flexDirection: "row", gap: "32px", width: "100%", justifyContent: "center" }}>
                {/* profile box */}
                <div>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    ) : (
                        <>
                            <button onClick={handleSave} style={{ marginRight: "8px" }}>Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </>
                    )}
                </div>
                <div
                    style={{
                        width: "50vw",
                        minHeight: "250px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        background: "#f5f5f5",
                        borderRadius: "16px",
                        margin: "32px 0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        padding: "32px"
                    }}
                >
                    {/* Heading above photo */}
                    {!isEditing ? (
                        <h1 style={{ marginBottom: "24px" }}>{name}'s Page</h1>
                    ) : (
                        <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            style={{ marginBottom: "24px", fontSize: "2rem", textAlign: "center" }}
                        />
                    )}
                    {/* Circular photo placeholder - larger size */}
                    <div
                        style={{
                            width: "200px",
                            height: "200px",
                            borderRadius: "50%",
                            background: "#ddd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2rem",
                            color: "#888",
                            marginBottom: "24px",
                            overflow: "hidden"
                        }}
                    >
                        <img
                            src={isEditing ? editPhoto : profilePhoto}
                            alt="Profile"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                objectFit: "cover"
                            }}
                        />
                    </div>
                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ marginBottom: "16px" }}
                        />
                    )}
                    {/* Profile info section */}
                    <div>
                        <p>
                            Number:{" "}
                            {!isEditing ? (
                                number
                            ) : (
                                <input
                                    type="text"
                                    value={editNumber}
                                    onChange={e => setEditNumber(e.target.value)}
                                    style={{ fontSize: "1rem", width: "100px" }}
                                />
                            )}
                        </p>
                        <p>
                            Email:{" "}
                            {!isEditing ? (
                                email
                            ) : (
                                <input
                                    type="email"
                                    value={editEmail}
                                    onChange={e => setEditEmail(e.target.value)}
                                    style={{ fontSize: "1rem", width: "200px" }}
                                />
                            )}
                        </p>
                    </div>
                </div>
                {/* profile box */}

                {/* progress box */}
                <div
                    style={{
                        width: "50vw",
                        background: "#fff",
                        borderRadius: "16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        padding: "24px",
                        marginBottom: "32px"
                    }}
                >
                    <h2>Progress</h2>
                    {/* Progress Bar 1 */}
                    <div style={{ marginBottom: "16px" }}>
                        <span>Read 6 books</span>
                        <div style={{
                            background: "#eee",
                            borderRadius: "8px",
                            overflow: "hidden",
                            height: "20px",
                            marginTop: "4px"
                        }}>
                            <div style={{
                                width: "70%",
                                background: "#4caf50",
                                height: "100%"
                            }} />
                        </div>
                    </div>
                    {/* Progress Bar 2 */}
                    <div style={{ marginBottom: "16px" }}>
                        <span>Go for 2 walks</span>
                        <div style={{
                            background: "#eee",
                            borderRadius: "8px",
                            overflow: "hidden",
                            height: "20px",
                            marginTop: "4px"
                        }}>
                            <div style={{
                                width: "40%",
                                background: "#2196f3",
                                height: "100%"
                            }} />
                        </div>
                    </div>
                    {/* Progress Bar 3 */}
                    <div style={{ marginBottom: "16px" }}>
                        <span>Take my dog to the park 7 times</span>
                        <div style={{
                            background: "#eee",
                            borderRadius: "8px",
                            overflow: "hidden",
                            height: "20px",
                            marginTop: "4px"
                        }}>
                            <div style={{
                                width: "55%",
                                background: "#ff9800",
                                height: "100%"
                            }} />
                        </div>
                    </div>
                    {/* Progress Bar 4 */}
                    <div>
                        <span>Complete daily journal 7 times</span>
                        <div style={{
                            background: "#eee",
                            borderRadius: "8px",
                            overflow: "hidden",
                            height: "20px",
                            marginTop: "4px"
                        }}>
                            <div style={{
                                width: "25%",
                                background: "#9c27b0",
                                height: "100%"
                            }} />
                        </div>
                    </div>
                </div>
                {/* progress box */}
            </div>

            {/* Week at a Glance */}
            <div style={{ width: "80vw", maxWidth: "900px", marginTop: "32px" }}>
                <h2>Week at a Glance</h2>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                    <button onClick={() => setWeekOffset(weekOffset - 1)}>Previous</button>
                    <button onClick={() => setWeekOffset(0)} style={{ margin: "0 12px" }}>Current Week</button>
                    <button onClick={() => setWeekOffset(weekOffset + 1)}>Next</button>
                    <span style={{ alignSelf: "center", marginLeft: "16px" }}>
                        {week[0].toLocaleDateString()} - {week[6].toLocaleDateString()}
                    </span>
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    {week.map(day => {
                        const iso = day.toISOString().split("T")[0];
                        return (
                            <div
                                key={iso}
                                style={{
                                    padding: "16px",
                                    borderRadius: "8px",
                                    background: holidaysByDate[iso] ? "#e8f5e9" : "#fff",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    flex: "1 1 calc(14.28% - 8px)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <div style={{ fontSize: "1.2rem", fontWeight: "500" }}>{day.getDate()}</div>
                                <div style={{ fontSize: "0.9rem", color: "#666" }}>{day.toLocaleString("default", { weekday: "short" })}</div>
                                {holidaysByDate[iso] && (
                                    <div style={{ marginTop: "4px", fontSize: "0.8rem", color: "#2e7d32" }}>
                                        {holidaysByDate[iso].join(", ")}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;


