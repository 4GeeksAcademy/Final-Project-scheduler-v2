import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import defaultProfilePhoto from "../assets/img/profile-photo.jpg";

const API_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

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

    // empty by default so nothing flashes
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(defaultProfilePhoto);

    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weekOffset, setWeekOffset] = useState(0); // 0 = current week
    const [year, setYear] = useState(new Date().getFullYear());

    const [goals, setGoals] = useState([]);

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

    useEffect(() => {
        if (!userId) return;
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/users/${userId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                console.log("Fetched user data:", data);
                setName(data.first_name);
                setLastName(data.last_name);
                setEmail(data.email);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        const fetchGoals = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/goals?user_id=${userId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (!res.ok) throw new Error("Failed to fetch goals");
                const data = await res.json();
                setGoals(data.goals || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchGoals();
    }, [userId]);

    const holidaysByDate = {};
    holidays.forEach(holiday => {
        holidaysByDate[holiday.date.iso] = holidaysByDate[holiday.date.iso] || [];
        holidaysByDate[holiday.date.iso].push(holiday.name);
    });

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
                    <h1 className="fs-2" style={{ marginBottom: "24px" }}>
                        {name ? `${name} ${lastName}'s Page` : ""}
                    </h1>

                    {/* Circular photo placeholder - larger size? */}
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
                            src={profilePhoto}
                            alt="Profile"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                objectFit: "cover"
                            }}
                        />
                    </div>

                    {/* Profile info section */}
                    <div>
                        <p>Email: {email}</p>
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
                    <h2 className="fs-3">Goal Progress</h2>
                    {goals.length === 0 ? (
                        <div style={{ color: "#888", margin: "16px 0" }}>No goals yet.</div>
                    ) : (
                        goals.map(goal => {
                            const percent = Math.min(100, (goal.completions / goal.target) * 100);
                            return (
                                <div className="mt-2" key={goal.id} style={{ marginBottom: "16px" }}>
                                    <span>{goal.text}</span>
                                    <div style={{
                                        background: "#eee",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        height: "20px",
                                        marginTop: "4px"
                                    }}>
                                        <div style={{
                                            width: `${percent}%`,
                                            background: percent === 100 ? "#4caf50" : "#2196f3",
                                            height: "100%",
                                            transition: "width 0.3s"
                                        }} />
                                    </div>
                                    <span style={{ fontSize: "0.9em", color: "#555" }}>
                                        {goal.completions} / {goal.target}
                                    </span>
                                </div>
                            );
                        })
                    )}
                    <Link to={"/goals"}><button className="bg-gray-300 text-gray-800 font-semibold py-2 px-3 rounded-xl shadow-lg hover:bg-gray-400 transition-colors duration-200">more</button></Link>
                </div>
                {/* progress box */}
            </div>

            {/* Week at a Glance */}
            <div style={{ width: "80vw", maxWidth: "900px", marginTop: "32px" }}>
                <h2 className="mb-3 fs-3">Week at a Glance</h2>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
                    <button className="btn btn-dark rounded-pill" onClick={() => setWeekOffset(weekOffset - 1)}>Previous</button>
                    <button className="btn btn-dark rounded-pill" onClick={() => setWeekOffset(0)} style={{ margin: "0 12px" }}>Current Week</button>
                    <button className="btn btn-dark rounded-pill" onClick={() => setWeekOffset(weekOffset + 1)}>Next</button>
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





