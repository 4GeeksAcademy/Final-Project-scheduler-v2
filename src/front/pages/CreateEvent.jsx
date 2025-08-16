import { useEffect, useState } from "react";

export const CreateEvent = () => {

    const [repeatType,setRepeatType] = useState("No Repeat");

    useEffect(() => {

    }, [])

    return (
        <div className="container-fluid bg-success">
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-4 my-5">
                        <h1 className="text-light">Create Event:</h1>
                        <div className="dropdown">
                                <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Recurrence
                                </button>
                                <ul className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={()=>setRepeatType("Daily")}>Daily</button></li>
                                    <li><button className="dropdown-item" onClick={()=>setRepeatType("Date Specific")}>Date Specific</button></li>
                                    <li><button className="dropdown-item" onClick={()=>setRepeatType("No Repeat")}>No Repeat</button></li>
                                </ul>
                            </div>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input type="email" className="form-control" aria-describedby="emailHelp" />
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
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