import React, { useState, useEffect, useContext } from "react";
import { NavbarContext } from "../hooks/NavbarContext";

export default function Timer({ initialTime }) {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const { timerStart } = useContext(NavbarContext);

    useEffect(() => {
        const interval = setInterval(() => {

            setTimeLeft(prevTime => {
                if (timerStart) {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        return 0;
                    }
                } else {
                    return prevTime
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timerStart]);
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor(timeLeft / 60) % 60;
    const seconds = timeLeft % 60;
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    return <span>{formattedTime}</span>;
}
