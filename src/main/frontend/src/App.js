import "milligram";
import './App.css';
import {useEffect, useState} from "react";
import LoginForm from "./LoginForm";
import UserPanel from "./UserPanel";

function App() {
    const [loggedIn, setLoggedIn] = useState('');

    useEffect(() => {
        const username = localStorage.getItem("username")
        if (username) {
            setLoggedIn(username)
        }
    },[])

    function login(email) {
        if (email) {
            setLoggedIn(email);
            localStorage.setItem("username", email)
        }
    }

    function logout() {
        setLoggedIn('');
        localStorage.removeItem("username")
    }

    return (
        <div>
            <h1>System do zapisów na zajęcia</h1>
            {loggedIn ? <UserPanel username={loggedIn} onLogout={logout}/> : <LoginForm onLogin={login}/>}
        </div>
    );
}

export default App;
