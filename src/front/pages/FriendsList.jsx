import { useEffect, useState } from "react";


export const FriendsList = () => {

    
    const [friendsList, setFriendsList] = useState([
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
    ]); // making fake friends objects

    useEffect(() => {
        //insert some bs about aking a fetch call to the Database for a list of user's friends (probably a protected view)
    }, [friendsList])

    function removeFriend(){
        // database fetch to remove friend
        alert("function works") // remove this when the actual fetch is made
    }

    function searchFriends(){
        
    }


    let listedFriends = friendsList.map((friend,index) => (
        <tr key={index}>
            <td>{`${friend["FirstName"]} ${friend["LastName"]}`}</td>
            <td>View Profile</td>
            <td><button onClick={()=>removeFriend()}>Remove</button></td>
        </tr>));

    return (
        <div className="container-fluid bg-success">
            <div className="row d-flex justify-content-center">
                <div className="col-5 mt-5">
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1"><span onClick={()=>searchFriends()}>Search <i className="mx-2 fa-solid fa-magnifying-glass"></i></span></span>
                        <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                    </div>
                </div>
            </div>
            <div className="row d-flex justify-content-center">
                <div className="col-4 mt-3 mb-5">
                    <table className="table table-secondary table-striped">
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