import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL

export const EditEvent = () => {
    const { eventId } = useParams();

    const navigate = useNavigate();
    const [repeatType, setRepeatType] = useState("Daily");
    const [eventVisibility, setEventVisibility] = useState("Private");
    const [timerUsed, setTimerUsed] = useState(false);
    const [timer, setTimer] = useState({ "hours": 0, "minutes": 0, "seconds": 0 });
    const [eventWeekdays, setEventWeekdays] = useState({});
    const [loaded, setLoaded] = useState();
    const [eventData, setEventData] = useState({
        "date": "",
        "name": "",
        "time": "",
        "timezone": "",
        "attendees": [],
        "visibility": "Private",
        "repeat": {},
        "description": "",
        "timer": { "hours": 0, "minutes": 0, "seconds": 0 }
    });

    async function fetchevent() {
        const response = await fetch(`${API_URL}api/events/${eventId}`)
        const data = await response.json();
        setEventData(data.returned_event)
        setLoaded(true)
    }

    useEffect(() => {
        fetchevent()
    }, [repeatType])

    function changeEventData(e) {
        setEventData((oldEventData) => {
            return {
                ...oldEventData,
                [e.target.id]: e.target.value,
            }
        });
    };

    function changeWeekdays(e) {
        setEventWeekdays((oldEventWeekdays) => {
            return {
                ...oldEventWeekdays,
                [e.target.id]: e.target.checked,
            }
        });
    }

    function changeTimer(e) {
        setTimer((oldTimer) => {
            return {
                ...oldTimer,
                [e.target.id]: e.target.value,
            }
        });
    }

    async function sendEventData() {
        if (eventData.name === "") {
            alert("Please enter a name for the event.");
        } else if (eventData.time === "") {
            alert("Please enter a start time for the event.")
        } else {
            const sentData = {
                ...eventData,
                "repeat": repeatType === "Daily" ? eventWeekdays : null,
                "visibility": eventVisibility,
                "timer": timerUsed ? timer : { "hours": 0, "minutes": 0, "seconds": 0 }
            }

            const response = await fetch(`${API_URL}api/edit/event/${eventId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sentData)
            });
            const eventObj = await response.json();
            if (response.status === 401) {
                if (eventObj.msg == "Token has expired") {
                    alert("Your login session has expired, please log in again.")
                    navigate("/")
                } else {
                    alert("Something went wrong, please redo everything.")
                }
            } else {
                let user_id = eventObj["editedEvent"]["host_id"]
                navigate(`/eventlist/${user_id}`);
                alert("Event Edited!");
            }
        }
    }

    let weeklyCheckboxes = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"].map((days, index) => (
        <div className="mb-3 mx-2 form-check" key={index}>
            <input type="checkbox" className="form-check-input border-dark border-opacity-50" id={days} onChange={changeWeekdays} />
            <label className="form-check-label ">{days}</label>
        </div>));

    return (
        <div
            className="d-flex align-items-start justify-content-center"
            style={{
                background: "#f4f6f8",
                padding: "2rem 1rem",
                marginTop: "56px",
                minHeight: "100vh",
            }}
        >
            <div className="w-100" style={{ maxWidth: "900px" }}>
                <div className="py-3"><span></span></div>
                <div className="card shadow-lg border-0" style={{ borderRadius: "1rem", overflow: "hidden" }}>
                    <div className="row d-flex justify-content-center p-5">
                        <div className="mt-5 col-4">
                            <h1 className="fs-1 mb-3">Edit Event:</h1>
                            <div className="mb-3">
                                <label className="form-label">Event Name:</label>
                                <input type="text" className="form-control w-50 border-dark border-opacity-50" id="name" value={eventData.name} onChange={changeEventData} />
                            </div>
                            <div className="dropdown mb-2">
                                <button
                                    className="btn rounded-pill dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    aria-describedby="publicHelp"
                                    style={{ background: "#7FC1E0", color: "white" }}
                                >
                                    {(eventVisibility === "Public") ? "Public" : "Private"}
                                </button>
                                <ul className="dropdown-menu border-dark border-opacity-50">
                                    <li><button className="dropdown-item" onClick={() => setEventVisibility("Public")}>Public</button></li>
                                    <li><button className="dropdown-item" onClick={() => setEventVisibility("Private")}>Private</button></li>
                                </ul>
                            </div>
                            <div id="publicHelp" className="form-text mb-3">Switches if this event can be seen by others.</div>
                            <div className="dropdown mb-2">
                                <button
                                    className="btn rounded-pill dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    aria-describedby="repeatHelp"
                                    style={{ background: "#7FC1E0", color: "white" }}
                                >
                                    {repeatType}
                                </button>
                                <ul className="dropdown-menu border-dark border-opacity-50">
                                    <li><button className="dropdown-item" onClick={() => setRepeatType("Daily")}>Daily</button></li>
                                    <li><button className="dropdown-item" onClick={() => setRepeatType("Date Specific")}>Date Specific</button></li>
                                    <li><button className="dropdown-item" onClick={() => setRepeatType("No Repeat")}>No Repeat</button></li>
                                </ul>
                            </div>
                            <div id="repeatHelp" className="form-text mb-3">How often you'll want this event to repeat.</div>
                            <form>
                                {(repeatType == "No Repeat") ?
                                    (<span></span>) :
                                    (repeatType == "Date Specific") ?
                                        (<div className="mb-3">
                                            <label className="form-label">Date:</label>
                                            <input type="date" className="form-control border-dark border-opacity-50" id="date" value={eventData.date} onChange={changeEventData} />
                                        </div>) :
                                        (repeatType == "Daily") ?
                                            (<div className="mb-3">
                                                <label className="form-label">Days:</label>
                                                <div className="d-flex flex-row flex-wrap">
                                                    {weeklyCheckboxes}
                                                </div>
                                            </div>) : (<span></span>)}
                                <div className="mb-3">
                                    <label className="form-label">Start Time:</label>
                                    <input type="time" className="form-control w-50 border-dark border-opacity-50" id="time" value={eventData.time} onChange={changeEventData} />
                                </div>
                                <div className="mb-3 mt-2 form-check p-0">
                                    <label className="form-label">Description:</label>
                                    <textarea className="form-control border-dark border-opacity-50" rows="3" id="description" onChange={changeEventData} value={eventData.description}></textarea>
                                    <div className="form-text mb-3">Write details you want to note down about this event here.</div>
                                </div>
                                <div className="mb-3 mt-5 form-check">
                                    <input type="checkbox" className="form-check-input border-dark border-opacity-50" checked={timerUsed} onChange={() => setTimerUsed(!timerUsed)} />
                                    <label className="form-label">Set event duration Timer:</label>
                                </div>

                                {(timerUsed) ? (<div className="mb-3">
                                    <div className="d-flex flex-row">
                                        <div className="mb-3 mx-2 form-check">
                                            <input type="number" className="form-control border-dark border-opacity-50" id="hours" value={timer.hours} onChange={changeTimer} />
                                            <label className="form-check-label">Hours</label>
                                        </div>
                                        <div className="mb-3 mx-2 form-check">
                                            <input type="number" className="form-control border-dark border-opacity-50" id="minutes" value={timer.minutes} onChange={changeTimer} />
                                            <label className="form-check-label">Minutes</label>
                                        </div>
                                        <div className="mb-3 mx-2 form-check">
                                            <input type="number" className="form-control border-dark border-opacity-50" id="seconds" value={timer.seconds} onChange={changeTimer} />
                                            <label className="form-check-label">Seconds</label>
                                        </div>
                                    </div>
                                </div>) : (<span></span>)}

                            </form>
                            <div className="d-flex justify-content-between">
                                <button onClick={() => sendEventData()} className="btn rounded-pill px-4" style={{ background: "#7FC1E0", color: "white" }}>Submit</button>
                                <button onClick={() => navigate(-1)} className="btn rounded-pill px-4" style={{ background: "#7FC1E0", color: "white" }}>Go Back</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};







/*













*/













