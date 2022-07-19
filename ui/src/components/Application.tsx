import { useState } from "react";
import { Dashboard } from "./Dashboard";
import { Login } from "./login/Login";



export const Application = () =>{

// ********** Constants and variables **********
// Hooks
const [token, setToken] = useState(localStorage.loggedIn);

console.log("token: ", token);
    
// Waiting for login token
if(!token) return <Login setToken={setToken} />;

return(

        <h1 className="text-5xl text-center py-10">APPLICATION</h1>
    )
}