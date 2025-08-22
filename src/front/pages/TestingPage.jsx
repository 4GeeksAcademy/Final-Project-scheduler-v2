import { useEffect, useState } from "react";

export const TestingPage = () => {

    const [publicEvent, setPublicEvent] = useState(false);
    const [goalData, setGoalData] = useState({
        "user": null,
        "public": null,
        "events": null,
        "description": null
    }); // This should be set up with how it is in the database, the current data here is just an example to work with the frame while rudy gets user database info set up

    useEffect(() => {

    }, [])

    function changeEventData(e) {
        setGoalData({
            ...FormData,
            [e.target.name]: e.target.value,
        });
    };

    function sendGoalData() {
        console.log(goalData);
        //fetch line doing a POST to database to creat event usign the goalData object

    }



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
                                <textarea className="form-control" rows="3" id="description" onChange={changeEventData}></textarea>
                                <div class="form-text mb-3">Write details you want to note down about this goal here.</div>
                            </div>

                            <div className="btn-group">
                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </button>
                                <ul className="dropdown-menu">
                                    <form className="px-4 py-3">
                                        <div className="mb-3">
                                            <label for="exampleDropdownFormEmail1" className="form-label">Email address</label>
                                            <input type="email" className="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
                                        </div>
                                        <div className="mb-3">
                                            <label for="exampleDropdownFormPassword1" className="form-label">Password</label>
                                            <input type="password" className="form-control" id="exampleDropdownFormPassword1" placeholder="Password" />
                                        </div>
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="dropdownCheck" />
                                                <label className="form-check-label" for="dropdownCheck">
                                                    Remember me
                                                </label>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Sign in</button>
                                    </form>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="#">New around here? Sign up</a>
                                    <a className="dropdown-item" href="#">Forgot password?</a>
                                </ul>
                            </div>
                        </form>
                        <button onClick={() => sendEventData()} className="btn btn-primary">Submit</button>

                    </div>
                </div>
            </div>
        </div>
    );
};
