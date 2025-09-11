import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import { Link, useParams } from "react-router-dom";
import { HslColorPicker } from "react-colorful";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function EventList() {
  const { userId } = useParams();
  const [event, setEvent] = useState([]);
  const [attendingevent, setAttendingEvent] = useState([]);
  const [selectedeventtype, setSelectedEventType] = useState({});
  const [color, setColor] = useState({ h: 0, s: 100, l: 50 });

  async function fetchUserEvents() {
    const response = await fetch(`${API_URL}api/eventlist/${userId}`);
    const data = await response.json();
    setEvent(data.returned_event);
  }

  async function deleteEvent(event_id) {
    const response = await fetch(`${API_URL}api/delete/event/${event_id}/${userId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    setEvent(data.remaining_events);
  }

  async function saveEventColor(targetId) {
    if (!selectedeventtype || !targetId) {
      alert("Please select an event first!");
      return;
    }
    const payload = {
      eventId: targetId,
      color: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
    };
    const response = await fetch(`${API_URL}api/eventtype/color`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const fetchresponse = await response.json();
    if (response.ok) {
      fetchUserEvents();
    }
  }

  useEffect(() => {
    fetchUserEvents();
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
            <Link to={"/create/event"}>
              <button
                type="button"
                className="rounded-full fw-semibold px-4 py-2"
                style={{ background: "#7FC1E0", color: "white" }}
              >
                Create a New Event
              </button>
            </Link>
          </div>

          {event.length === 0 ? (
            <div className="text-center text-muted p-4">
              No events planned. Please add an event.
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

                    <Link to={`/edit/event/${ev.id}`}>
                      <button
                        type="button"
                        className="rounded-pill fw-semibold px-3 py-2 me-2 mb-2 bg-gray-200 text-gray-800 shadow hover:bg-gray-300 transition"
                      >
                        Edit Event
                      </button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => deleteEvent(ev.id)}
                      className="rounded-pill fw-semibold px-3 py-2 mb-2"
                      style={{ background: "#fecaca", color: "#991b1b" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6 mt-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3">
            <h4 className="m-0" style={{ fontWeight: 800, color: "#1f2937", fontSize: "1.25rem" }}>
              Highlight an Event
            </h4>
            <div className="dropdown">
              <button
                className="btn rounded-pill fw-semibold px-4 py-2 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ background: "#7FC1E0", color: "white" }}
              >
                {selectedeventtype.name || "Choose Event"}
              </button>
              <ul className="dropdown-menu shadow-sm rounded-3 border-0">
                {event.map((ev, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className="dropdown-item py-2"
                      onClick={() => setSelectedEventType(ev)}
                    >
                      {ev.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-2">
            <HslColorPicker color={color} onChange={setColor} />
            <p className="mt-3 fw-semibold" style={{ color: "#374151" }}>
              Selected Highlight Color:
              <span
                className="d-inline-block ms-2"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9999px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 2px rgba(0,0,0,.06)",
                  backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
                  verticalAlign: "middle",
                }}
              />
            </p>
            <button
              type="button"
              className="w-100 rounded-pill fw-semibold px-4 py-2 mt-2"
              style={{ background: "#7FC1E0", color: "white" }}
              onClick={() => saveEventColor(selectedeventtype.id)}
            >
              Save Highlight Color{selectedeventtype.name ? ` for ${selectedeventtype.name}` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
