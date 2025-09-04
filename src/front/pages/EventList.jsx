import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import { useParams } from "react-router-dom";


const API_URL = import.meta.env.VITE_BACKEND_URL

export default function EventList() {
  const { userId } = useParams();
  const [event, setEvent] = useState([])
  async function fetchUserEvents() {
    const response = await fetch(`${API_URL}api/eventlist/${userId}`)
    const data = await response.json();
    console.log("event: ", data)
    setEvent(data.returned_event)
  }

   useEffect(() => {
    fetchUserEvents()
  }, []);

  return (
    <div style={{ marginTop: "80px" }}>
      {
        event.map((event, i) => (
          <li key={i}>{event.name}</li>
        ))
      }
    </div>
  )
}