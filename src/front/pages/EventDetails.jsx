import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL

export default function EventDetails () {
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
  const { eventId } = useParams();
  async function fetchevent(){
    const response = await fetch(`${API_URL}api/events/${eventId}`)
    const data= await response.json();
     console.log("event: ", data)
    setEvent(data.returned_event)
  }
  useEffect ( () => {
    fetchevent()
  }, []);

  // MAKE SURE TO ADD COLOR TO THE BOOK- HALEY 


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-16">
      {/* Event Card */}
      <div
        className="w-full max-w-lg p-6 rounded-lg shadow-md border"
        style={{ backgroundColor: "red" }}
      >
        {/* Title + Host */}
        <h1 className="text-2xl font-bold mb-1">{event.name}</h1> 
        <p className="text-gray-500 text-sm mb-4">
          👤 Hosted by <strong>{event.host}</strong>
        </p>

        {/* Event Info */}
        <div className="space-y-3 text-sm">
          <p>📅 <strong>Date:</strong> {event.date}</p>
          <p>⏰ <strong>Time:</strong> {event.time} {event.timezone}</p>
          <p>🌍 <strong>Visibility:</strong> {event.visibility}</p>
          <p>🔁 <strong>Repeat:</strong> {event.repeat == {} ?(<span></span>):"yes"}</p>

          <div>
            🧑‍🤝‍🧑 <strong>Attendees:</strong>
            <ul className="list-disc list-inside ml-5 text-gray-700">
              {event.attendees.map((person, i) => (
                <li key={i}>{person.first_name}</li>
              ))}
            </ul>
          </div>

          <div>
            📝 <strong>Description:</strong>
            <p className="text-gray-600">{event.description}</p>
          </div>

          <div>
            ⏳ <strong>Timer:</strong> <Timer initialTime={1800} />
          </div>
        </div>
      </div>
    </div>
  );
}
