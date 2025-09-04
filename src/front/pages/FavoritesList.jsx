import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL

export const FavoritesList = () => {


    const [favoritesList, setFavoritesList] = useState([
        {
            "id": 1,
            "FirstName": "Bob",
            "LastName": "The Builder"
        },
        {
            "id": 2,
            "FirstName": "Barney",
            "LastName": "The Purple Dinosaur"
        }
    ]); // making fake Favorites objects
    const [loaded, setLoaded] = useState(false);

    async function loadFriends() {
        const token = localStorage.getItem('token');
        const rawData = await fetch(`${API_URL}api/protected/followed`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        });
        const userdata = await rawData.json()
        console.log("userdata from fetch", userdata.followed.followed)
        setLoaded(true);
        setFavoritesList(userdata.followed.followed);
    }

    useEffect(() => {
        //insert some bs about aking a fetch call to the Database for a list of user's Favorites (probably a protected view)
        // Retrieve token from localStorage
        loadFriends();

    }, []);

    async function removeFriend(target_id) {
        // database fetch to remove friend
        setLoaded(false);
        const token = localStorage.getItem('token');
        const rawData = await fetch(`${API_URL}api/protected/followed/remove/${target_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        });
        const userdata = await rawData.json()
        setLoaded(true);
        setFavoritesList(userdata.followed.followed);
    }

    function searchFavorites() {
        // is placed here in case we do actually want to search through favorited users
    }


    let listedFavorites = favoritesList.map((friend, index) => (
        <tr key={index}>
            <td>{`${friend["first_name"]} ${friend["last_name"]}`}</td>
            <td><Link to={`/profile/${friend["id"]}`}><button className="btn btn-dark rounded-pill">View Profile</button></Link></td>
            <td><button className="btn btn-dark rounded-pill" onClick={() => removeFriend(friend.id)}>Remove</button></td>
        </tr>));

    return (
        <div className="container-fluid bg-success mt-5">
            {/* <div className="row d-flex justify-content-center">
                <div className="col-5 mt-5">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1"><span onClick={()=>searchFavorites()}>Search <i className="mx-2 fa-solid fa-magnifying-glass"></i></span></span>
                        <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
                    </div>
                </div>
            </div> */}
            <div className="row d-flex justify-content-center">
                <div className="col-4 my-5">
                    <h1 className="text-light">Favorite Users:</h1>
                    <table className="table table-secondary table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">View</th>
                                <th scope="col">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loaded ? listedFavorites : (
                                <div className="text-center my-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>

                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}; 