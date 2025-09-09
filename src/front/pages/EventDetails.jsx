import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import { useParams } from "react-router-dom";


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
  const { eventId } = useParams();
  async function fetchevent() {
    const response = await fetch(`${API_URL}api/events/${eventId}`)
    const data = await response.json();
    console.log("event: ", data)
    setEvent(data.returned_event)
  }
  useEffect(() => {
    fetchevent()
  }, []);

  // MAKE SURE TO ADD COLOR TO THE BOOK- HALEY 



 return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-20 pb-24 px-4">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">Event Details</h1>

    {/* Loading Spinner */}
    {!loaded ? (
      <div className="flex flex-col items-center justify-center my-10">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
      /* Event Card */
      <div
        className="w-full max-w-2xl p-6 rounded-2xl shadow-lg border bg-white"
        style={{ backgroundColor: event.color }}
      >
        <div>
          {/* Title + Host */}
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{event.name}</h1>
          <p className="text-gray-600 text-sm mb-4">
            👤 Hosted by{" "}
            <Link
              to={!loaded ? `/` : `/profile/${event.host.id}`}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {!loaded ? "Loading" : event.host.username}
            </Link>
          </p>

          {/* Event Info */}
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              📅 <strong>Date:</strong>{" "}
              {event.date === "" ? "None" : event.date}
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
                {event.repeat == {} ? (
                  <li>This event doesn't repeat</li>
                ) : (event.repeat === null) ? (<li>This event doesn't repeat</li>): (
                  Object.keys(event.repeat).map((day, index) => (
                    <li key={index}>{day}</li>
                  ))
                )}
              </ul>
            </div>

            <div>
              🧑‍🤝‍🧑 <strong>Attendees:</strong>
              <ul className="list-disc list-inside ml-5 mt-1">
                {event.attendees.map((person, i) => (
                  <li key={i}>
                    <Link
                      to={!loaded ? `/` : `/profile/${person.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {person.username}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              📝 <strong>Description:</strong>
              <p className="text-gray-600 mt-1">{event.description}</p>
            </div>

            <div>
              ⏳ <strong>Timer:</strong>
              <div className="mt-2">
                <Timer key={seconds} initialTime={seconds} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="bg-indigo-500 text-white font-medium py-2 px-4 rounded-xl shadow-md hover:bg-indigo-600 transition">
              Start Timer
            </button>

            {!loaded ? (
              ""
            ) : event.attendees
                .map((attendee) => attendee.id)
                .find((element) => userID == element) === undefined ? (
              <button
                onClick={() => joinLeaveEvent("join")}
                className="bg-green-500 text-white font-medium py-2 px-4 rounded-xl shadow-md hover:bg-green-600 transition"
              >
                Join Event
              </button>
            ) : (
              <button
                onClick={() => joinLeaveEvent("leave")}
                className="bg-red-500 text-white font-medium py-2 px-4 rounded-xl shadow-md hover:bg-red-600 transition"
              >
                Leave Event
              </button>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
}
