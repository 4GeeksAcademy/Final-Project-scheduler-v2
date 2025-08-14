import { useEffect, useState } from "react";


export const FriendsList = () => {

    //insert some bs about aking a fetch call to the Database for a list of user's friends (probably a protected view)
    const [friendsList, setFriendsList] = useState([
        {
            "FirstName": "Bob",
            "LastName": "The Builder"
        },
        {
            "FirstName": "Barney",
            "LastName": "The Purple Dinosaur"
        }
    ]); // making fake friends objects

    useEffect(() => {

    }, [])

    let listedFriends = friendsList.map((friend) => (
        <tr>
            <td>{`${friend["FirstName"]} ${friend["LastName"]}`}</td>
            <td>View Profile</td>
            <td>Remove</td>
        </tr>));

    return (
        <div className="container-fluid bg-success">
            <div className="row d-flex justify-content-center">
                <div className="col-5 mt-5">
                    <div className="input-group mb-3 mx-5">
                        <span className="input-group-text" id="basic-addon1">Search</span>
                        <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                </div>
            </div>
            <div className="row d-flex justify-content-center">
                <div className="col-4 mt-3 mb-5">
                    <table className="table table-dark table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">View</th>
                                <th scope="col">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listedFriends}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}; 