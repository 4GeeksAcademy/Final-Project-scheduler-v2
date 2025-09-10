import { useContext, useEffect, useState } from "react";
import Timer from "../components/Timer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NavbarContext } from "../hooks/NavbarContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function EventDetails() {
  const [event, setEvent] = useState({
    id: 1,
    title: "",
    date: "",
    name: "",
    time: "",
    timezone: "",
    attendees: [],
    visibility: "",
    description: "",
    timer: {},
  });
  const [loaded, setLoaded] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();

  const { userID, timerStart, setTimerStart } = useContext(NavbarContext);
  const { eventId } = useParams();

  async function fetchevent() {
    const response = await fetch(`${API_URL}api/events/${eventId}`);
    const data = await response.json();
    setEvent(data.returned_event);
    setLoaded(true);
  }

  async function joinLeaveEvent(action) {
    setLoaded(false);
    const response = await fetch(
      `${API_URL}api/attendee/${action}/${userID}/${eventId}`,
      {
        method: "PUT",
      }
    );
    const data = await response.json();
    setEvent(data.event);
    setLoaded(true);
  }

  useEffect(() => {
    setTimerStart(false);
    fetchevent();
  }, []);

  useEffect(() => {
    if (event.timer) {
      setSeconds(
        (event.timer.hours || 0) * 3600 +
        (event.timer.minutes || 0) * 60 +
        (event.timer.seconds || 0)
      );
    }
  }, [event]);

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
      <div className="w-100" style={{ maxWidth: "680px" }}>
        <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">Event Details</h1>

        {!loaded ? (
          <div className="flex flex-col items-center justify-center my-10">
            <div className="w-10 h-10 border-4 border-[#7FC1E0] border-t-transparent rounded-full animate-spin"></div>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div
            className="w-full p-6 rounded-2xl shadow-xl bg-white"
            style={{ backgroundColor: event.color || "#ffffff" }}
          >
            <div>
              {/* Title + Host */}
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{event.name}</h1>
              <p className="text-gray-600 text-sm mb-4">
                👤 Hosted by{" "}
                <Link
                  to={!loaded ? `/` : `/profile/${event.host?.id}`}
                  className="fw-semibold"
                  style={{ color: "#28779a" }}
                >
                  {!loaded ? "Loading" : event.host?.username}
                </Link>
              </p>

              {/* Event Info */}
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  📅 <strong>Date:</strong> {event.date === "" ? "None" : event.date}
                </p>
                <p>
                  ⏰ <strong>Time:</strong> {event.time} {event.timezone}
                </p>
                <p>
                  🌍 <strong>Visibility:</strong> {event.visibility}
                </p>
                <div>
                  🔁 <strong>Repeat:</strong>
                  <ul className="list-disc list-inside ml-5 mt-1">
                    {event.repeat && Object.keys(event.repeat).length === 0 ? (
                      <li>This event doesn't repeat</li>
                    ) : (
                      Object.keys(event.repeat).map((day, index) => <li key={index}>{day}</li>)
                    )}
                  </ul>
                </div>

                <div>
                  🧑‍🤝‍🧑 <strong>Attendees:</strong>
                  <ul className="list-disc list-inside ml-5 mt-1 text-gray-700">
                    {event.attendees.map((person, i) => (
                      <li key={i}>
                        <Link
                          to={!loaded ? `/` : `/profile/${person.id}`}
                          className="fw-semibold"
                          style={{ color: "#28779a" }}
                        >
                          {person.username}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  📝 <strong>Description:</strong>
                  <p className="text-gray-600">{event.description}</p>
                </div>

                <div>
                  ⏳ <strong>Timer:</strong>
                  <div className="mt-2">
                    <Timer key={seconds} initialTime={seconds} />
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <div className="mt-4 d-flex flex-wrap gap-2">
                    <button
                      onClick={() => setTimerStart(!timerStart)}
                      className="rounded-pill fw-semibold px-4 py-2"
                      style={{ background: "#7FC1E0", color: "white" }}
                    >
                      {!timerStart ? "Start Timer" : "Pause Timer"}
                    </button>

                    {!loaded
                      ? ""
                      : event.attendees
                          .map((attendee) => attendee.id)
                          .find((element) => userID === element) === undefined ? (
                        <button
                          onClick={() => joinLeaveEvent("join")}
                          className="rounded-pill fw-semibold px-4 py-2"
                          style={{ background: "#22c55e", color: "white" }}
                        >
                          Join Event
                        </button>
                      ) : (
                        <button
                          onClick={() => joinLeaveEvent("leave")}
                          className="rounded-pill fw-semibold px-4 py-2"
                          style={{ background: "#ef4444", color: "white" }}
                        >
                          Leave Event
                        </button>
                      )}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => navigate(-1)}
                      className="rounded-pill fw-semibold px-4 py-2"
                      style={{ background: "#7FC1E0", color: "white" }}
                    >
                      Go Back
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
