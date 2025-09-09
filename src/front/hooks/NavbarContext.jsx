import React, { useContext, createContext, useState } from "react";

export const NavbarContext = createContext();

export function NavbarProvider({ children }) {
    const [userID, setUserID] = useState(-1);
    const [fromNavbar, setFromNavbar] = useState(false);
    const [searchbar, setSearchbar] = useState("");
    const [timerStart, setTimerStart] = useState(false);

    return (
        <NavbarContext.Provider value={{ userID, setUserID, fromNavbar, setFromNavbar, searchbar, setSearchbar, timerStart, setTimerStart }}>
            {children}
        </NavbarContext.Provider>
    )
}
