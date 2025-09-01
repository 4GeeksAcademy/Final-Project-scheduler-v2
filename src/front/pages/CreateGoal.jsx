import { useEffect, useState } from "react";
import { CreateEvent } from "./CreateEvent";

export const CreateGoal = () => {

    const [publicEvent, setPublicEvent] = useState(false);
    const [eventList, setEventList] = useState([]);
    const [goalData, setGoalData] = useState({
        "user": null,
        "public": null,
        "events": null,
        "description": null
    }); // This should be set up with how it is in the database, the current data here is just an example to work with the frame while rudy gets user database info set up

    useEffect(() => {

    }, [eventList])

    function changeGoalData(e) {
        setGoalData({
            ...goalData,
            [e.target.name]: e.target.value,
        });
    };

    function sendGoalData() {
        console.log(goalData);
        //fetch line doing a POST to database to creat event usign the goalData object

    }

    function updateEventList() {
        //fetch line getting events from server
    }
    let listOfEvents = eventList.map((ev, index) => (
        <li key={index}><button className="dropdown-item" type="button">{ev.name}</button></li>
    ));

    return (
        <div className="container-fluid bg-success my-5">
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-4">
                        <h1 className="text-light">Create Goal:</h1>
                        <div className="dropdown">
                            <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-describedby="publicHelp">
                                {(publicEvent) ? "Public" : "Private"}
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={() => setPublicEvent(True)}>Public</button></li>
                                <li><button className="dropdown-item" onClick={() => setPublicEvent(False)}>Private</button></li>
                            </ul>
                        </div>
                        <div id="publicHelp" class="form-text mb-3">Switches if this goal can be seen by others.</div>
                        {/* <div className="dropdown">
                            <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-describedby="repeatHelp">
                                {repeatType}
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={() => setRepeatType("Daily")}>Daily</button></li>
                                <li><button className="dropdown-item" onClick={() => setRepeatType("Date Specific")}>Date Specific</button></li>
                                <li><button className="dropdown-item" onClick={() => setRepeatType("No Repeat")}>No Repeat</button></li>
                            </ul>
                        </div>
                        <div id="repeatHelp" class="form-text mb-3">How often you'll want this event to repeat.</div> */}

                        <form>

                            <div className="mb-3 mt-2 form-check p-0">
                                <label className="form-label text-light">Description:</label>
                                <textarea className="form-control" rows="3" id="description" onChange={changeGoalData}></textarea>
                                <div class="form-text mb-3">Write details you want to note down about this goal here.</div>
                            </div>
                        </form>
                        <div className="btn-group">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
                                Add events
                            </button>
                            <ul className="dropdown-menu">

                            </ul>
                        </div>

                        <div className="btn-group">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false" onClick={() => updateEventList()}>
                                Create event
                            </button>
                            <ul className="dropdown-menu overflow-auto" style={{ width: "700px", height: "500px" }}>
                                <CreateEvent />
                            </ul>
                        </div>

                        <button onClick={() => sendGoalData()} className="btn btn-primary">Submit</button>

                    </div>
                </div>
            </div >
        </div >
    );
};
