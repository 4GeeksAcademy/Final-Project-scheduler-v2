import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NavbarContext } from "../hooks/NavbarContext";

const API_URL = import.meta.env.VITE_BACKEND_URL

export default function ListViewer() {
    const { userID } = useContext(NavbarContext)
    const { userId } = useParams();
    const [event, setEvent] = useState([])
    const navigate = useNavigate();

    async function fetchUserEvents() {
        const response = await fetch(`${API_URL}api/listview/${userId}`)
        const data = await response.json();
        console.log("event: ", data)
        setEvent(data.returned_event)
    }

    useEffect(() => {
        if (userID == userId) {
            navigate(`/eventlist/${userId}`)
        }
        fetchUserEvents()
    }, []);



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
            <div className="w-100" style={{ maxWidth: "900px" }}>
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3">
                        <h3 className="m-0" style={{ fontWeight: 800, color: "#1f2937", fontSize: "1.5rem" }}>
                            List of Events
                        </h3>

                    </div>

                    {event.length === 0 ? (
                        <div className="text-center text-muted p-4">
                            No events planned.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {event.map((ev, i) => (
                                <div
                                    key={i}
                                    className="d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm"
                                    style={{
                                        backgroundColor: ev.color || "#f9fafb",
                                        transition: "transform .12s ease",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                                >
                                    <div
                                        className="fw-semibold"
                                        style={{
                                            fontSize: "1rem",
                                            color: "#111827",
                                            background: "rgba(255,255,255,.75)",
                                            padding: "6px 10px",
                                            borderRadius: "10px",
                                            boxShadow: "0 1px 2px rgba(0,0,0,.06)",
                                        }}
                                    >
                                        {ev.name}
                                    </div>

                                    <div className="d-flex flex-wrap">
                                        <Link to={`/events/${ev.id}`}>
                                            <button
                                                type="button"
                                                className="rounded-pill fw-semibold px-3 py-2 me-2 mb-2 bg-gray-200 text-gray-800 shadow hover:bg-gray-300 transition"
                                            >
                                                More Details
                                            </button>
                                        </Link>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
