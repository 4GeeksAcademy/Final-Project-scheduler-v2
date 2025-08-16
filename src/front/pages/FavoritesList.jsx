import { useEffect, useState } from "react";


export const FavoritesList = () => {

    
    const [favoritesList, setFavoritesList] = useState([
        {
            "id":1,
            "FirstName": "Bob",
            "LastName": "The Builder"
        },
        {
            "id":2,
            "FirstName": "Barney",
            "LastName": "The Purple Dinosaur"
        }
    ]); // making fake Favorites objects

    useEffect(() => {
        //insert some bs about aking a fetch call to the Database for a list of user's Favorites (probably a protected view)
    }, [favoritesList])

    function removeFriend(){
        // database fetch to remove friend
        alert("function works") // remove this when the actual fetch is made
    }

    function searchFavorites(){
        // is placed here in case we do actually want to search through favorited users
    }


    let listedFavorites = favoritesList.map((friend,index) => (
        <tr key={index}>
            <td>{`${friend["FirstName"]} ${friend["LastName"]}`}</td>
            <td><button>View Profile</button></td>
            <td><button onClick={()=>removeFriend()}>Remove</button></td>
        </tr>));

    return (
        <div className="container-fluid bg-success">
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
                            {listedFavorites}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}; 