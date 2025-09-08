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
    <div>
      <div style={{ marginTop: "80px" }}>
        <h3 className="fs-3">List of events:</h3>
        {
          (event.length === 0) ? (<div className="mt-2">No events planned. Please add an event.</div>) : event.map((event, i) => (
            <div className="mt-2" key={i} style={{ backgroundColor: event.color }}>{event.name}</div>
          ))
        }
        {/* THIS IS FOR ATTENDING EVENTS */}
        {/* {
        attendingevent.map((event, i) => (
          <li key={i}>{event.name}</li>
        ))
      } */}
      </div>
      <Link to={"/create/event"}><button className="btn btn-dark rounded-pill mt-2">
        Create a new event
      </button></Link>
      <div className="mt-4">
        <p>Select an event to highlight:</p>
        <div className="dropdown mb-3">
          <button
            className="btn btn-dark rounded-pill dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedeventtype.name || "Choose Event"}
          </button>
          <ul className="dropdown-menu">
            <li>
              {event.map((event, i) => (
                <button
                  key={i}
                  className="dropdown-item"
                  onClick={() => setSelectedEventType(event)}
                >
                  {event.name}
                </button>
              ))
              }
            </li>
          </ul>
        </div>

        <HslColorPicker color={color} onChange={setColor} />

        <p className="mt-4">
          Selected Highlight Color:{" "}
          <span
            style={{
              display: "inline-block",
              width: "40px",
              height: "40px",
              backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
              borderRadius: "50%",
            }}
          />
        </p>

        <button className="btn btn-dark rounded-pill mt-3" onClick={() => saveEventColor(selectedeventtype.id)}>
          Save Highlight Color for {selectedeventtype.name || "event type"}
        </button>
      </div>
    </div>
  )
}
