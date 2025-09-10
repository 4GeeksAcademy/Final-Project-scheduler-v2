import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import defaultProfilePhoto from "../assets/img/profile-photo.jpg";
import { NavbarContext } from "../hooks/NavbarContext";

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
  const { userID } = useContext(NavbarContext);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(defaultProfilePhoto);
  const [username, setUsername] = useState("");

  const [goals, setGoals] = useState([]);

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [weekOffset, setWeekOffset] = useState(0);

  const week = getCurrentWeek(weekOffset);

  useEffect(() => {
    const newYear = week[0].getFullYear();
    if (newYear !== year) setYear(newYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset]);

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      const apiKey = "3CRFaZmG1Jgk2FfIxOQBEfPhznPP7ckL";
      const country = "US";
      try {
        const res = await fetch(
          `https://calendarific.com/api/v2/holidays?&api_key=${apiKey}&country=${country}&year=${year}`
        );
        const data = await res.json();
        setHolidays(data.response?.holidays || []);
      } catch {
        // silent fail; keep UI stable
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
        setName(data.first_name || "");
        setLastName(data.last_name || "");
        setEmail(data.email || "");
        setUsername(data.username || "");
        // if API returns a profile photo url, use it:
        if (data.profile_photo_url) setProfilePhoto(data.profile_photo_url);
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
        const res = await fetch(`${API_URL}/api/profile/goals/${userId}`, {
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

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/");
  };

  const holidaysByDate = {};
  holidays.forEach((h) => {
    holidaysByDate[h.date.iso] = holidaysByDate[h.date.iso] || [];
    holidaysByDate[h.date.iso].push(h.name);
  });

  if (loading) {
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
            <span className="visually-hidden">Loading...</span>
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
      <div className="w-100" style={{ maxWidth: "1100px" }}>
        {/* Top: Profile + Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-4">
                {name ? `${name} ${lastName}` : "Profile"}
              </h1>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden shadow-sm">
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-5 w-full text-center space-y-2">
                {email && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span> {email}
                  </p>
                )}
                {username && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Username:</span> {username}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Link to={`/listview/${userId}`}>
                  <button className="border border-[#7FC1E0] text-[#28779a] font-semibold py-2 px-4 rounded-full hover:bg-[#e9f5fb] transition-colors duration-200">
                    {`View ${name ? name + " " + lastName : "user"}'s Events`}
                  </button>
                </Link>

                {String(userID) === String(userId) && (
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-200"
                    title="Sign out"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Goals Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                Goal Progress
              </h2>
              {String(userID) === String(userId) && (
                <Link to="/goals">
                  <button className="bg-[#7FC1E0] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#5fa9cb] transition-colors duration-200">
                    Manage
                  </button>
                </Link>
              )}
            </div>

            {goals.length === 0 ? (
              <div className="text-center text-gray-400 p-8">
                <p>No goals yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => {
                  const percent = Math.min(
                    100,
                    (goal.completions / goal.target) * 100
                  );
                  const complete = percent >= 100;
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${complete ? "line-through text-green-600" : "text-gray-800"}`}>
                          {goal.text}
                        </span>
                        <span className="text-sm text-gray-600">
                          {goal.completions}/{goal.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            complete ? "bg-green-500" : "bg-[#7FC1E0]"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Week at a Glance */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
              Week at a Glance
            </h2>
            <div className="flex items-center gap-2">
              <button
                className="border border-[#7FC1E0] text-[#28779a] font-semibold py-2 px-4 rounded-full hover:bg-[#e9f5fb] transition-colors duration-200"
                onClick={() => setWeekOffset((s) => s - 1)}
              >
                Previous
              </button>
              <button
                className="bg-[#7FC1E0] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#5fa9cb] transition-colors duration-200"
                onClick={() => setWeekOffset(0)}
              >
                Current Week
              </button>
              <button
                className="border border-[#7FC1E0] text-[#28779a] font-semibold py-2 px-4 rounded-full hover:bg-[#e9f5fb] transition-colors duration-200"
                onClick={() => setWeekOffset((s) => s + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div className="text-gray-600">
            {week[0].toLocaleDateString()} – {week[6].toLocaleDateString()}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {week.map((day) => {
              const iso = day.toISOString().split("T")[0];
              const isHoliday = !!holidaysByDate[iso];
              return (
                <div
                  key={iso}
                  className={`rounded-xl p-3 text-center shadow-sm ${
                    isHoliday ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  <div className="text-lg font-semibold text-gray-800">
                    {day.getDate()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {day.toLocaleString("default", { weekday: "short" })}
                  </div>
                  {isHoliday && (
                    <div className="mt-1 text-xs text-green-700">
                      {holidaysByDate[iso].join(", ")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;





