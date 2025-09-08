import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import { Link, useParams } from "react-router-dom";


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

  const { eventId } = useParams();

  async function fetchevent() {
    const response = await fetch(`${API_URL}api/events/${eventId}`)
    const data = await response.json();
    console.log("event: ", data)
    setEvent(data.returned_event)
    setLoaded(true)
  }

  useEffect(() => {
    fetchevent()
  }, []);

  useEffect(() => {
    setSeconds(event.timer.hours * 3600 + event.timer.minutes * 60 + event.timer.seconds)
    console.log("host: ", event.host)
  }, [event]);
  // MAKE SURE TO ADD COLOR TO THE BOOK- HALEY 



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-16">
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
          {/* Title + Host */}
          <h1 className="text-2xl font-bold mb-1">{event.name}</h1>
          <p className="text-gray-500 text-sm mb-4">
            👤 Hosted by <Link to={(!loaded) ? `/` : `/profile/${event.host.id}`}><strong>{(!loaded) ? "Loading" : event.host.username}</strong></Link>
          </p>

          {/* Event Info */}
          <div className="space-y-3 text-sm">
            <p>📅 <strong>Date:</strong> {event.date}</p>
            <p>⏰ <strong>Time:</strong> {event.time} {event.timezone}</p>
            <p>🌍 <strong>Visibility:</strong> {event.visibility}</p>
            <p>🔁 <strong>Repeat:</strong> </p>
            <ul className="list-disc list-inside ml-5 text-gray-700">
              {event.repeat == {} ? (<li>This event doesn't repeat</li>) : Object.keys(event.repeat).map((day, index) => (
                <li key={index}>{day}</li>
              ))}
            </ul>

            <div>
              🧑‍🤝‍🧑 <strong>Attendees:</strong>
              <ul className="list-disc list-inside ml-5 text-gray-700">
                {event.attendees.map((person, i) => (
                  <li key={i}>{person.username}</li>
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
          </div>
        </div>)
      }
    </div>
  );
}
