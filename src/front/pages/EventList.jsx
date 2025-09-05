import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import { useParams } from "react-router-dom";
import { HslColorPicker } from "react-colorful";

const API_URL = import.meta.env.VITE_BACKEND_URL

export default function EventList() {
  const { userId } = useParams();
  const [event, setEvent] = useState([])
  const [attendingevent, setAttendingEvent] = useState([])
  const [selectedeventtype, setSelectedEventType] = useState('')
  const [color, setColor] = useState({ h: 0, s: 100, l: 50 });

  async function fetchUserEvents() {
    const response = await fetch(`${API_URL}api/eventlist/${userId}`)
    const data = await response.json();
    console.log("event: ", data)
    setEvent(data.returned_event)
  }

  // async function saveEventTypeColor() {
  //   if (!selectedeventtype) {
  //     alert("Please select an event type first!");
  //     return;
  //   }

  //   const payload = {
  //     color: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
  //   };

  //   const response = await fetch(
  //     `${API_URL}api/eventtype/${selectedeventtype}/color`,
  //     {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     }
  //   );

  //   if (response.ok) {
  //     console.log(`Saved color for ${selectedeventtype}`);
  //     fetchUserEvents(); 
  //   }
  // }


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

  //hosted events

  //events attending

  return (
    <div>
      <div style={{ marginTop: "80px" }}>
        {
          event.map((event, i) => (
            <div key={i} style={{ backgroundColor: "cyan" }}>{event.name}</div>
          ))
        }
        {/* THIS IS FOR ATTENDING EVENTS */}
        {/* {
        attendingevent.map((event, i) => (
          <li key={i}>{event.name}</li>
        ))
      } */}
      </div>
      <div className="mt-4">
        <p>Select event type:</p>
        <div className="dropdown mb-3">
          <button
            className="btn btn-light dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedeventtype || "Choose type"}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSelectedEventType("study")}
              >
                Study
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSelectedEventType("appointment")}
              >
                Appointment
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSelectedEventType("group gathering")}
              >
                Group Gathering
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setSelectedEventType("self care")}
              >
                Self Care
              </button>
            </li>
          </ul>
        </div>

        <HslColorPicker color={color} onChange={setColor} />

        <p className="mt-4">
          Selected Color:{" "}
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

        <button className="btn btn-primary mt-3" onClick={saveEventTypeColor}>
          Save Color for {selectedeventtype || "event type"}
        </button>
      </div>
    </div>
  )
}
