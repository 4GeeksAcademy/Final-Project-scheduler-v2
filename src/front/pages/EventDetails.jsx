import { useContext, useEffect, useState } from "react";
import Timer from "../components/Timer";
import { Link, useParams } from "react-router-dom";
import { NavbarContext } from "../hooks/NavbarContext";


const API_URL = import.meta.env.VITE_BACKEND_URL

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
    timer: ""
  });
  const [loaded, setLoaded] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const { userID, timerStart, setTimerStart } = useContext(NavbarContext)
  const { eventId } = useParams();

  async function fetchevent() {
    const response = await fetch(`${API_URL}api/events/${eventId}`)
    const data = await response.json();
    console.log("event: ", data)
    setEvent(data.returned_event)
    setLoaded(true)
  }

  async function joinLeaveEvent(action) {
    setLoaded(false)
    const response = await fetch(`${API_URL}api/attendee/${action}/${userID}/${eventId}`, {
      method: "PUT"
    });
    const data = await response.json();
    setEvent(data.event)
    setLoaded(true)
  }

  useEffect(() => {
    setTimerStart(false)
    fetchevent()
  }, []);

  useEffect(() => {
    setSeconds(event.timer.hours * 3600 + event.timer.minutes * 60 + event.timer.seconds)
    console.log("host: ", event.host)
  }, [event]);
  // MAKE SURE TO ADD COLOR TO THE BOOK- HALEY 



  return (
    <div className="d-flex flex-column items-center justify-center min-h-screen bg-gray-100 pt-16">
      <h1 className="fs-1 mb-3">Event Details:</h1>
      {/* Event Card */}
      {
        (!loaded) ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (<div
          className="w-full max-w-lg p-6 rounded-lg shadow-md border"
          style={{ backgroundColor: event.color }}
        >
          <div className="card container">
            {/* Title + Host */}
            <h1 className="text-2xl font-bold mb-1">{event.name}</h1>
            <p className="text-gray-500 text-sm mb-4">
              👤 Hosted by <Link to={(!loaded) ? `/` : `/profile/${event.host.id}`}><strong>{(!loaded) ? "Loading" : event.host.username}</strong></Link>
            </p>

            {/* Event Info */}
            <div className="space-y-3 text-sm">
              <p>📅 <strong>Date:</strong> {(event.date == "") ? "None" : event.date}</p>
              <p>⏰ <strong>Time:</strong> {event.time} {event.timezone}</p>
              <p>🌍 <strong>Visibility:</strong> {event.visibility}</p>
              <p>🔁 <strong>Repeat:</strong> </p>
              <ul className="list-disc list-inside ml-5 text-gray-700">
                {event.repeat == {} ? (<li>This event doesn't repeat</li>) : (event.repeat === null) ? (<li>This event doesn't repeat</li>) : Object.keys(event.repeat).map((day, index) => (
                  <li key={index}>{day}</li>
                ))}
              </ul>

              <div>
                🧑‍🤝‍🧑 <strong>Attendees:</strong>
                <ul className="list-disc list-inside ml-5 text-gray-700">
                  {event.attendees.map((person, i) => (
                    <li key={i}><Link to={(!loaded) ? `/` : `/profile/${person.id}`}>{person.username}</Link></li>
                  ))}
                </ul>
              </div>

              <div>
                📝 <strong>Description:</strong>
                <p className="text-gray-600">{event.description}</p>
              </div>

              <div>
                ⏳ <strong>Timer:</strong> <Timer key={seconds} initialTime={seconds} />
              </div>
              <div className="mb-3">
                <button onClick={() => setTimerStart(!timerStart)} className="ms-3 bg-gray-300 text-gray-800 font-semibold py-2 px-3 rounded-xl shadow-lg hover:bg-gray-400 transition-colors duration-200">
                  {(!timerStart) ? "Start Timer" : "Pause Timer"}
                </button>
                {(!loaded) ? `` :
                  (event.attendees.map((attendee) => attendee.id).find((element) => userID == element) === undefined) ?
                    (<button onClick={() => joinLeaveEvent("join")} className="ms-3 bg-gray-300 text-gray-800 font-semibold py-2 px-3 rounded-xl shadow-lg hover:bg-gray-400 transition-colors duration-200">
                      Join Event
                    </button>) : (<button onClick={() => joinLeaveEvent("leave")} className="ms-3 bg-gray-300 text-gray-800 font-semibold py-2 px-3 rounded-xl shadow-lg hover:bg-gray-400 transition-colors duration-200">
                      Leave Event
                    </button>)}

              </div>
            </div>
          </div>

        </div>)
      }
    </div>
  );
}
