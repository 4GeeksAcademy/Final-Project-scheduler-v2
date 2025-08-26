import { useEffect, useState } from "react";

export const CreateEvent = () => {

    const [repeatType, setRepeatType] = useState("Daily");
    const [publicEvent, setPublicEvent] = useState(false);
    const [timer, setTimer] = useState(false);
    const [eventWeekdays, setEventWeekdays] = useState({});
    const [eventData, setEventData] = useState({
        "date": null,
        "name": null,
        "time": null,
        "timezone": null,
        "attendees": null,
        "visibility": null,
        "host": null,
        "repeat": null, //maybe have this look like an object? thinking it'll look like 
        "description": null,
        "goalAmount": null, // optional thinking it'll look like {goal1:{amount:X,total:Y},goal2:{amount:X,total:Y}}
        "timer": null //optional thinking it'll look like {hours:X,minutes:Y,seconds:Z}
    }); // This should be set up with how it is in the database, the current data here is just an example to work with the frame while rudy gets user database info set up

    useEffect(() => {

    }, [repeatType])

    function changeEventData(e) {
        setEventData((oldEventData) => {
            return {
                ...oldEventData,
                [e.target.name]: e.target.value,
            }
        });
    };

    function changeWeekdays(e) {
        //here to set up the weekdays of the event if applicable, maybe this is stored in the eventData object as another object
        console.log("TESTING:", e.target.value)
        // setEventWeekdays((oldEventWeekdays)=>{return{
        //     ...oldEventWeekdays,
        //     [e.target.id]: e.target.value,
        // }});
    }

    function sendEventData() {
        //the following 4 lines needs a bit more details on how the data is gonna be stored
        if (repeatType == "Daily") {
            setEventData((oldEventData) => { return { ...oldEventData, "repeat": eventWeekdays } })
        } else {
            setEventData((oldEventData) => { return { ...oldEventData, "repeat": null } })
        }
        //line about setting the visibility value in eventData to the publicEvent State
        //line about setting the timer value in eventData to the timer State
        //line about setting the description value in eventData to the description State
        console.log(eventData);
        //FETCH HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //fetch line doing a POST to database to creat event usign the eventData object

    }
    let weeklyCheckboxes = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"].map((days, index) => (
        <div className="mb-3 mx-2 form-check" key={index}>
            <input type="checkbox" className="form-check-input" id={days} onChange={changeWeekdays} />
            <label className="form-check-label">{days}</label>
        </div>));



    return (
        <div className="container-fluid bg-success my-5">
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-4">
                        <h1 className="text-light">Create Event:</h1>
                        <div className="mb-3">
                            <label className="form-label text-light">Event Name:</label>
                            <input type="text" className="form-control w-50" id="name" onChange={changeEventData} />
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-describedby="publicHelp">
                                {(publicEvent) ? "Public" : "Private"}
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={() => setPublicEvent(True)}>Public</button></li>
                                <li><button className="dropdown-item" onClick={() => setPublicEvent(False)}>Private</button></li>
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
                            <div className="mb-3 mt-2 form-check p-0">
                                <label className="form-label text-light">Description:</label>
                                <textarea className="form-control" rows="3" id="description" onChange={changeEventData}></textarea>
                                <div className="form-text mb-3">Write details you want to note down about this event here.</div>
                            </div>
                            {(repeatType == "No Repeat") ?
                                (<span></span>) :
                                (repeatType == "Date Specific") ?
                                    (<div className="mb-3">
                                        <label className="form-label text-light">Date:</label>
                                        <input type="date" className="form-control" name="date" value={eventData.date} onChange={changeEventData} />
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
                                <input type="time" className="form-control w-50" id="time" onChange={changeEventData} />
                            </div>

                            <div className="mb-3 mt-5 form-check">
                                <input type="checkbox" className="form-check-input" value={timer} onChange={() => setTimer(!timer)} />
                                <label className="form-label text-light">Set event duration Timer:</label>
                            </div>
                            {(timer) ? (<div className="mb-3">
                                <div className="d-flex flex-row">
                                    <div className="mb-3 mx-2 form-check">
                                        <input type="number" className="form-control" id="Hours" />
                                        <label className="form-check-label text-light">Hours</label>
                                    </div>
                                    <div className="mb-3 mx-2 form-check">
                                        <input type="number" className="form-control" id="Minutes" />
                                        <label className="form-check-label text-light">Minutes</label>
                                    </div>
                                    <div className="mb-3 mx-2 form-check">
                                        <input type="number" className="form-control" id="Seconds" />
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













