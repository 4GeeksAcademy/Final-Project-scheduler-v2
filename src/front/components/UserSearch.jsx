import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavbarContext } from "../hooks/NavbarContext";

const API_URL = import.meta.env.VITE_BACKEND_URL

export function UserSearch() {

    const { fromNavbar, setFromNavbar, searchbar } = useContext(NavbarContext);
    const [input, setInput] = useState("");
    const [result, setResult] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    async function searchFunction(e) {
        e.preventDefault();
        setLoading(true)
        const rawResponse = await fetch(`${API_URL}api/search/${input}`);
        let data = await rawResponse.json();
        setResult(data["search_results"]);
        setLoading(false)
        setSearched(true)
    }

    async function navbarSearchFunction() {
        setFromNavbar(false)
        setLoading(true)
        const rawResponse = await fetch(`${API_URL}api/search/${searchbar}`);
        let data = await rawResponse.json();
        setResult(data["search_results"]);
        setLoading(false)
        setSearched(true)
    }

    async function followButton(target_id) {
        if (!localStorage.getItem('token')) {
            alert("Log in to Follow users!")
        } else {
            const rawResponse = await fetch(`${API_URL}api/protected/followed/add/${target_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            const data = await rawResponse.json()
            console.log("processed fetch response: ", data)
            if (data.status === "dupe") {
                alert("You have already followed this user! (remove followed users from your Following page)")
            } else {
                alert("User Followed!")
            }
        }
    }

    useEffect(() => {
        console.log("fromNavbar = ", fromNavbar, " && !searched = ", !searched)
        if (fromNavbar && !searched) {
            navbarSearchFunction();
        }

    }, [result]);

    let resultWindow = result.map((user, index) => (
        <div key={index} className="card p-5 shadow-sm rounded-3 mb-3" style={{ maxWidth: "500px" }}>
            <div className="row">
                <div className="col d-flex flex-column">
                    <span>Username:</span>
                    <span className="p-2 fs-5">{user.username}</span>
                </div>
                <div className="col d-flex flex-column">
                    <span>Name:</span>
                    <span className="p-2 fs-5">{user.first_name + " " + user.last_name}</span>
                </div>

            </div>
            <span className="text-center">
                <Link to={`/profile/${user.id}`}><button className="mt-3 btn btn-secondary rounded-pill me-2">Profile</button></Link>
                <button className="mt-3 btn btn-dark rounded-pill" onClick={() => followButton(user.id)}>Follow</button>
            </span>
        </div>
    ));

    return (
        <div className="mt-5 d-flex align-items-center justify-content-center min-vh-100 bg-light p-3 flex-column">
            <div className="card p-5 shadow-sm rounded-3" style={{ maxWidth: "500px", width: "100%" }}>
                <div className="text-center">
                    <h2 className="fw-bold mb-5">User Search</h2>
                </div>

                <form onSubmit={searchFunction}>
                    <label className="form-label">Username:</label>
                    <div className="mb-4 d-flex flex-row">

                        <input
                            id="searchInput"
                            type="text"
                            className="form-control rounded-pill"
                            autoComplete="username"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                        />
                        <button type="submit" className="ms-3 btn btn-dark rounded-pill">
                            Search
                        </button>
                    </div>

                </form>



            </div>
            {(!searched) ? (<span></span>) : (
                <div className="container d-flex justify-content-center min-vh-100 bg-light p-3">
                    <div className="card p-5 shadow-sm rounded-3" style={{ maxWidth: "500px", width: "100%" }}>
                        {(loading) ? (
                            <div className="text-center my-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : resultWindow}
                    </div>
                </div>)}

        </div>
    );
};
