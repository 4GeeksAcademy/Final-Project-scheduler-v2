import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useParams } from "react-router-dom";

export default function EventDetails() {
    const { store, dispatch } = useGlobalReducer();
    const mockEvent = {
        id: 1,
        title: "Study Group Session",
        date: "8/22/25",
        time: "10am",
        timezone: "EST",
        attendees: ["Haley", "Connor", "Rudy"],
        visibility: "public",
        host: "Haley",
        repeat: "weekly",
        description: "Weekly study group for learning Python",
        timer: "00:30:00"
    }

    return (
        <div className="p-4 max-w-lg mx-auto border rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">{mockEvent.title}</h1>
            <p className="text-sm text-gray-500">Hosted by {mockEvent.host}</p>

            <div className="mt-4 space-y-2">
                <p><strong>Date:</strong> {mockEvent.date}</p>
                <p><strong>Time:</strong> {mockEvent.time} {mockEvent.timezone}</p>
                <p><strong>Visibility:</strong> {mockEvent.visibility}</p>
                <p><strong>Repeat:</strong> {mockEvent.repeat}</p>

                <div>
                    <strong>Attendees:</strong>
                    <ul className="list-disc list-inside">
                        {mockEvent.attendees.map((person, i) => (
                            <li key={i}>{person}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <strong>Description:</strong>
                    <p>{mockEvent.description}</p>
                </div>

                <div>
                    <strong>Timer:</strong> {mockEvent.timer}
                </div>
            </div>
        </div>
    )
}
