import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import { Link, useParams } from "react-router-dom";
import { HslColorPicker } from "react-colorful";

const API_URL = import.meta.env.VITE_BACKEND_URL

export default function EventList() {
  const { userId } = useParams();
  const [event, setEvent] = useState([])
  const [attendingevent, setAttendingEvent] = useState([])
  const [selectedeventtype, setSelectedEventType] = useState({})
  const [color, setColor] = useState({ h: 0, s: 100, l: 50 });

  async function fetchUserEvents() {
    const response = await fetch(`${API_URL}api/eventlist/${userId}`)
    const data = await response.json();
    console.log("event: ", data)
    setEvent(data.returned_event)
  }
  //length
  async function deleteEvent(event_id) {
    const response = await fetch(`${API_URL}api/delete/event/${event_id}`, {
      method: "DELETE"
    })
    const data = await response.json();
    console.log("event: ", data)
    setEvent(data.remaining_events)
  }

  async function saveEventColor(targetId) {
    if (!selectedeventtype) {
      alert("Please select an event type first!");
      return;
    }

    const payload = {
      "eventId": targetId,
      "color": `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
    };
    console.log("eventId", targetId)
    const response = await fetch(
      `${API_URL}api/eventtype/color`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const fetchresponse = await response.json()

    if (response.ok) {
      console.log(`Saved color for ${fetchresponse.name}`);
      fetchUserEvents();
    }
  }


  // async function fetchUserAttendingEvents() {
  //   const response = await fetch(`${API_URL}api/attendingeventlist/${userId}`)
  //   const data = await response.json();
  //   console.log("event: ", data)
  //   setAttendingEvent(data.returned_event)
  // }
  useEffect(() => {
    fetchUserEvents()
    // fetchUserAttendingEvents()
  }, []);



  return (
    <div className="max-w-4xl mx-auto mt-24 px-4 pb-24">
      {/* This div is for containing the list of events */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-800">List of Events</h3>
        {/*This huge thing gets either a mapped list of events or tells user there's no events */}
        {
          (event.length === 0) ? (<div className="mt-2 text-gray-600">No events planned. Please add an event.</div>) : (event.map((event, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl shadow mb-3 transition-transform hover:scale-[1.01]" style={{ backgroundColor: event.color }}>
              <div className="text-lg font-medium text-gray-900 bg-light rounded p-2 border-dark border-1 border-opacity-25 shadow">{event.name}</div>
              <div className="flex">
                <Link to={`/events/${event.id}`}>
                  <button className="ml-3 bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-xl shadow hover:bg-gray-300 transition">
                    More Details
                  </button>
                </Link>
                <Link to={`/edit/event/${event.id}`}>
                  <button className="ml-3 bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-xl shadow hover:bg-gray-300 transition">
                    Edit Event
                  </button>
                </Link>
                <button onClick={() => deleteEvent(event.id)} className="ml-3 bg-red-200 text-red-700 font-medium py-2 px-4 rounded-xl shadow hover:bg-red-300 transition">
                  Delete
                </button>
              </div>
            </div>
          ))
          )
        }
        {/*Mapped listed events ends here */}
      </div>
      {/* The list of events div ends here */}

      {/* Bottom Section Box */}
      <div className="mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <Link to={"/create/event"}>
          <button className="w-full bg-indigo-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-indigo-600 transition">
            Create a New Event
          </button>
        </Link>

        <div className="mt-8">
          <p className="font-medium text-gray-700 mb-2">Select an event to highlight:</p>
          <div className="relative inline-block">
            <button
              className="bg-indigo-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-indigo-600 transition dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedeventtype.name || "Choose Event"}
            </button>
            <ul className="dropdown-menu mt-2 rounded-xl shadow-md">
              {event.map((event, i) => (
                <button
                  key={i}
                  className="dropdown-item hover:bg-gray-100 px-4 py-2 rounded-lg"
                  onClick={() => setSelectedEventType(event)}
                >
                  {event.name}
                </button>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <HslColorPicker color={color} onChange={setColor} />

          <p className="mt-4 font-medium text-gray-700">
            Selected Highlight Color:
            <span
              className="inline-block w-10 h-10 ml-2 rounded-full border border-gray-300"
              style={{
                backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
              }}
            />
          </p>

          <button
            className="mt-4 w-full bg-indigo-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-indigo-600 transition"
            onClick={() => saveEventColor(selectedeventtype.id)}
          >
            Save Highlight Color for {selectedeventtype.name || "event type"}
          </button>
        </div>
      </div>
    </div>
  )
}
