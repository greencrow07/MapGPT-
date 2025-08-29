import Login from "../../login-logout";
import { useEffect, useState } from "react";
import axios from "axios";





export default function TabBar(){
    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    const [displayMessage, setDisplayMessage] = useState("user is not logged in yet");

    useEffect(() => {
        axios.get(`${baseUrl}/auth/user`, { withCredentials: true })
            .then(res => {
                if (res.status !== 401 && typeof res.data === "object" && res.data !== null) {
                    setDisplayMessage("Hurray user is logged in");
                }
            })
            .catch(() => {
                setDisplayMessage("user is not logged in yet");
            });
    }, []);

    return (
        <div className="flex text-white items-center justify-between  align-center p-2 pt-3">
            <h1>{displayMessage}</h1>
            {/* <Login/> */}
        </div>
    )
}