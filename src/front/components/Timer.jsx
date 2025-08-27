import React, { useState, useEffect } from "react";

export default function Timer({ initialTime }) {
    const [timeLeft, setTimeLeft] = useState(initialTime)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    return 0;
                }
            });
        }, 1000);


        return () => clearInterval(interval);
    }, []);
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    
    return <span>{formattedTime}</span>;
}
