import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NavbarContext } from "../hooks/NavbarContext";

const API_URL = import.meta.env.VITE_BACKEND_URL

export default function ListViewer() {
    const { userID } = useContext(NavbarContext)
    const { userId } = useParams();
    const [event, setEvent] = useState([])
    const navigate = useNavigate();

    async function fetchUserEvents() {
        const response = await fetch(`${API_URL}api/listview/${userId}`)
        const data = await response.json();
        console.log("event: ", data)
        setEvent(data.returned_event)
    }

    useEffect(() => {
        if (userID == userId) {
            navigate(`/eventlist/${userId}`)
        }
        fetchUserEvents()
    }, []);



    return (
        <div>
            <div style={{ marginTop: "80px" }}>
                <h3 className="fs-3">List of events:</h3>
                {
                    (event.length === 0) ? (<div className="mt-2">No public events planned.</div>) : event.map((event, i) => (
                        <div className="mt-2 p-3 card d-flex flex-row" key={i} style={{ backgroundColor: event.color }}>
                            <div className="card container fs-4 m-0" style={{ maxWidth: "400px" }}>{event.name} </div>
                            <Link to={`/events/${event.id}`}>
                                <button className="ms-3 bg-gray-300 text-gray-800 font-semibold py-2 px-3 rounded-xl shadow-lg hover:bg-gray-400 transition-colors duration-200">
                                    more
                                </button>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
