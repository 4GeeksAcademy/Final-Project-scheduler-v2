import { useEffect, useState } from "react";

export const CreateEvent = () => {

    const [repeatType, setRepeatType] = useState("Daily");
    const [publicEvent, setPublicEvent] = useState(false);
    const [eventData, setEventData] = useState({}) // This should be set up with how

    useEffect(() => {

    }, [repeatType])

    function changeEventData() {

    }


    return (
        <div className="container-fluid bg-success">
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-4 my-5">
                        <h1 className="text-light">Create Event:</h1>
                        <div className="dropdown">
                            <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-describedby="publicHelp">
                                {(publicEvent) ? "Public" : "Private"}
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={() => setPublicEvent(True)}>Public</button></li>
                                <li><button className="dropdown-item" onClick={() => setPublicEvent(False)}>Private</button></li>
                            </ul>
                        </div>
                        <div id="publicHelp" class="form-text mb-3">Switches if this event can be seen by others.</div>
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
                        <div id="repeatHelp" class="form-text mb-3">How often you'll want this event to repeat.</div>
                        <form>
                            {(repeatType == "Date Specific") ? (<div className="mb-3">
                                <label className="form-label">Date:</label>
                                <input type="date" className="form-control" />
                            </div>) : (<span></span>)}
                            <div className="mb-3">
                                <label className="form-label">Otherinfo</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                <label className="form-check-label">Check me out</label>
                            </div>

                        </form>
                        <button type="submit" className="btn btn-primary">Submit</button>

                    </div>
                </div>
            </div>
        </div>
    );
}; 