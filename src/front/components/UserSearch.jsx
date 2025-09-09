import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavbarContext } from "../hooks/NavbarContext";

const raw = import.meta.env.VITE_BACKEND_URL || "";
const BACKEND = raw.replace(/\/$/, ""); // trim trailing slash

export function UserSearch() {
  const { fromNavbar, setFromNavbar, searchbar } = useContext(NavbarContext);
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  async function searchFunction(e) {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND}/api/search/${encodeURIComponent(input)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Search failed");
      setResult(data["search_results"] || []);
      setSearched(true);
    } catch (err) {
      setErrMsg(err.message || "Could not complete search");
      setResult([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  async function navbarSearchFunction() {
    setFromNavbar(false);
    setErrMsg("");
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND}/api/search/${encodeURIComponent(searchbar || "")}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Search failed");
      setResult(data["search_results"] || []);
      setSearched(true);
    } catch (err) {
      setErrMsg(err.message || "Could not complete search");
      setResult([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  async function followButton(target_id) {
    if (!localStorage.getItem("token")) {
      alert("Log in to Follow users!");
      return;
    }
    try {
      const res = await fetch(
        `${BACKEND}/api/protected/followed/add/${target_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Follow failed");
      if (data.status === "dupe") {
        alert("You have already followed this user! (remove on your Following page)");
      } else {
        alert("User Followed!");
      }
    } catch (err) {
      alert(err.message || "Could not follow user");
    }
  }

  useEffect(() => {
    if (fromNavbar) {
      navbarSearchFunction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromNavbar, searched]);

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
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
            User Search
          </h1>
          <p className="text-gray-500 text-lg">Find users by username</p>
        </div>

        {/* Error */}
        {errMsg && (
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-md text-center">
            {errMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={searchFunction} className="flex flex-col md:flex-row gap-4">
          <input
            id="searchInput"
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FC1E0] transition-colors duration-200"
            placeholder="Enter a username"
            autoComplete="username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#7FC1E0] text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-[#5fa9cb] transition-colors duration-200 disabled:opacity-50"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center my-4">
                <div className="h-8 w-8 border-4 border-[#7FC1E0] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : result.length === 0 ? (
              <div className="text-center text-gray-400 p-8">
                <p>No users found.</p>
              </div>
            ) : (
              result.map((user, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Username</span>
                      <span className="pt-1 text-lg font-semibold break-words text-gray-800">
                        {user.username}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Name</span>
                      <span className="pt-1 text-lg font-semibold break-words text-gray-800">
                        {user.first_name + " " + user.last_name}
                      </span>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <Link to={`/profile/${user.id}`}>
                      <button className="border border-[#7FC1E0] text-[#28779a] font-semibold py-2 px-4 rounded-full hover:bg-[#e9f5fb] transition-colors duration-200 mr-2">
                        Profile
                      </button>
                    </Link>
                    <button
                      className="bg-[#7FC1E0] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#5fa9cb] transition-colors duration-200"
                      onClick={() => followButton(user.id)}
                    >
                      Follow
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
