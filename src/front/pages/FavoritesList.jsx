import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const raw = import.meta.env.VITE_BACKEND_URL || "";
const API_URL = raw.replace(/\/$/, ""); // trim trailing slash

export const FavoritesList = () => {
  const [favoritesList, setFavoritesList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  async function loadFriends() {
    const token = localStorage.getItem("token");
    try {
      setErrMsg("");
      setLoaded(false);
      const res = await fetch(`${API_URL}/api/protected/followed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch favorites.");
      setFavoritesList(data.followed?.followed || []);
    } catch (e) {
      setErrMsg(e.message || "Failed to fetch favorites.");
      setFavoritesList([]);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    loadFriends();
  }, []);

  async function removeFriend(target_id) {
    const token = localStorage.getItem("token");
    try {
      setLoaded(false);
      const res = await fetch(`${API_URL}/api/protected/followed/remove/${target_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to remove favorite.");
      setFavoritesList(data.followed?.followed || []);
    } catch (e) {
      setErrMsg(e.message || "Failed to remove favorite.");
    } finally {
      setLoaded(true);
    }
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
      <div className="w-100" style={{ maxWidth: "1000px" }}>
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
              Favorite Friends
            </h1>
            <p className="text-gray-500 text-lg">People you’re following</p>
          </div>

          {/* Error */}
          {errMsg && (
            <div className="bg-red-500 text-white p-4 rounded-xl shadow-md text-center">
              {errMsg}
            </div>
          )}

          {/* Loading */}
          {!loaded ? (
            <div className="flex justify-center my-6">
              <div className="h-10 w-10 border-4 border-[#7FC1E0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : favoritesList.length === 0 ? (
            <div className="text-center text-gray-400 p-8">
              <p>No friends yet. Go follow some users!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favoritesList.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center text-center"
                >
                  {/* Avatar placeholder (optional) */}
                  <div className="h-16 w-16 rounded-full bg-[#7FC1E0] text-white flex items-center justify-center text-xl font-bold mb-3">
                    {friend.first_name?.[0] || "?"}
                  </div>

                  {/* Name */}
                  <span className="text-lg font-semibold text-gray-800 mb-2">
                    {(friend.first_name || friend.FirstName) +
                      " " +
                      (friend.last_name || friend.LastName || "")}
                  </span>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 w-full">
                    <Link to={`/profile/${friend.id}`}>
                      <button className="w-full border border-[#7FC1E0] text-[#28779a] font-semibold py-2 px-4 rounded-full hover:bg-[#e9f5fb] transition-colors duration-200">
                        View
                      </button>
                    </Link>
                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="w-full bg-[#7FC1E0] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#5fa9cb] transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
