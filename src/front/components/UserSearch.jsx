import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL

export function UserSearch() {

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

    useEffect(() => { if (input === "") { setSearched(false) } }, [result]);

    let resultWindow = result.map((user, index) => (
        <div key={index} className="card p-5 shadow-sm rounded-3 mb-3" style={{ maxWidth: "500px", width: "70%" }}>
            <Link to={`/profile/${user.id}`}><span>{user.username}</span></Link>

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
