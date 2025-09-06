import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL

export const CreateEvent = () => {

    const navigate = useNavigate();
    const [repeatType, setRepeatType] = useState("Daily");
    const [eventVisibility, setEventVisibility] = useState(false);
    const [timerUsed, setTimerUsed] = useState(false);
    const [timer, setTimer] = useState({ "hours": 0, "minutes": 0, "seconds": 0 });
    const [eventWeekdays, setEventWeekdays] = useState({});
    const [eventData, setEventData] = useState({
        "date": "",
        "name": "",
        "time": "",
        "timezone": "",
        "attendees": [],
        "visibility": "Private",
        "repeat": {}, //maybe have this look like an object? thinking it'll look like 
        "description": "",
        "timer": { "hours": 0, "minutes": 0, "seconds": 0 }
    }); // This should be set up with how it is in the database, the current data here is just an example to work with the frame while rudy gets user database info set up

    useEffect(() => {

    }, [repeatType])

    function changeEventData(e) {
        setEventData((oldEventData) => {
            console.log("event target id: ", e.target.id)
            return {
                ...oldEventData,
                [e.target.id]: e.target.value,
            }
        });
    };

    function changeWeekdays(e) {
        //here to set up the weekdays of the event if applicable, maybe this is stored in the eventData object as another object
        // console.log("TESTING:", e.target.checked)
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
        //the following 4 lines needs a bit more details on how the data is gonna be stored
        if (eventData.name === null) {
            alert("Please enter a name for the event.");
        } else if (eventData.time === null) {
            alert("Please enter a start time for the event.")
        } else {
            const sentData = {
                ...eventData,
                "repeat": repeatType === "Daily" ? eventWeekdays : null,
                "visibility": eventVisibility,
                "timer": timerUsed ? timer : { "hours": 0, "minutes": 0, "seconds": 0 }

            }
            console.log("sentData: ", sentData)

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}api/create/event`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(sentData)
            });
            const eventObj = await response.json();
            let user_id = eventObj["createdEvent"]["host_id"]
            console.log(eventObj)
            navigate(`/profile/${user_id}`);
            alert("Event Created!");
        }

    }
    let weeklyCheckboxes = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"].map((days, index) => (
        <div className="mb-3 mx-2 form-check" key={index}>
            <input type="checkbox" className="form-check-input" id={days} onChange={changeWeekdays} />
            <label className="form-check-label">{days}</label>
        </div>));



    return (
        <div className="container-fluid bg-success mt-5">
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="mt-5 col-4">
                        <h1 className="text-light">Create Event:</h1>
                        <div className="mb-3">
                            <label className="form-label text-light">Event Name:</label>
                            <input type="text" className="form-control w-50" id="name" value={eventData.name} onChange={changeEventData} />
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-describedby="publicHelp">
                                {(eventVisibility === "Public") ? "Public" : "Private"}
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={() => setEventVisibility("Public")}>Public</button></li>
                                <li><button className="dropdown-item" onClick={() => setEventVisibility("Private")}>Private</button></li>
                            </ul>
                        </div>
                        <div id="publicHelp" className="form-text mb-3">Switches if this event can be seen by others.</div>
                        <div className="dropdown">
                            <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-describedby="repeatHelp">
                                {repeatType}
                            </button>
                            <ul className="dropdown-menu">
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
                                        <label className="form-label text-light">Date:</label>
                                        <input type="date" className="form-control" id="date" value={eventData.date} onChange={changeEventData} />
                                    </div>) :
                                    (repeatType == "Daily") ?
                                        (<div className="mb-3">
                                            <label className="form-label text-light">Days:</label>
                                            <div className="d-flex flex-row flex-wrap">
                                                {weeklyCheckboxes}
                                            </div>
                                        </div>) : (<span></span>)}
                            <div className="mb-3">
                                <label className="form-label text-light">Start Time:</label>
                                <input type="time" className="form-control w-50" id="time" value={eventData.time} onChange={changeEventData} />
                            </div>
                            <div className="mb-3 mt-2 form-check p-0">
                                <label className="form-label text-light">Description:</label>
                                <textarea className="form-control" rows="3" id="description" onChange={changeEventData} value={eventData.description}></textarea>
                                <div className="form-text mb-3">Write details you want to note down about this event here.</div>
                            </div>
                            <div className="mb-3 mt-5 form-check">
                                <input type="checkbox" className="form-check-input" checked={timerUsed} onChange={() => setTimerUsed(!timerUsed)} />
                                <label className="form-label text-light">Set event duration Timer:</label>
                            </div>

                            {(timerUsed) ? (<div className="mb-3">
                                <div className="d-flex flex-row">
                                    <div className="mb-3 mx-2 form-check">
                                        <input type="number" className="form-control" id="hours" value={timer.hours} onChange={changeTimer} />
                                        <label className="form-check-label text-light">Hours</label>
                                    </div>
                                    <div className="mb-3 mx-2 form-check">
                                        <input type="number" className="form-control" id="minutes" value={timer.minutes} onChange={changeTimer} />
                                        <label className="form-check-label text-light">Minutes</label>
                                    </div>
                                    <div className="mb-3 mx-2 form-check">
                                        <input type="number" className="form-control" id="seconds" value={timer.seconds} onChange={changeTimer} />
                                        <label className="form-check-label text-light">Seconds</label>
                                    </div>
                                </div>
                            </div>) : (<span></span>)}

                        </form>
                        <button onClick={() => sendEventData()} className="btn btn-primary">Submit</button>

                    </div>
                </div>
            </div>
        </div>
    );
};







/*













*/













