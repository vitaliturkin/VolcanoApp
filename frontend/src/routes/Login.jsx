// importing necessary modules and components
import React, { useState } from "react";
import { loginInAccount } from "../api";
import { useNavigate } from "react-router-dom";

// Login component definition
export default function Login({ setAuthData, isAuthenticated }) {
    // hooks for managing form inputs and error state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // to handle form submission for user login
    const handleLogin = (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        // calling loginInAccount API function with email, password, and setAuthData function
        loginInAccount(email, password, setAuthData)
            .then((data) => {
                console.log("Login successful!", data);
                // redirecting to homepage upon successful login
                navigate("/");
            })
            .catch((error) => {
                console.error("Login error:", error.message);
                setError("Login failed. Please check your credentials.");
            });
    };
   // if user is already authenticated, render nothing
    if (isAuthenticated) {
        return null;
    }

    // the login form
    return (
        <div className="login">
            <img src="/img/loginBack.jpg" alt="Main Login" className="login__img" />
            <div className="container">
                <form className="login__form" onSubmit={handleLogin}>
                    <h1 className="login__title">Login</h1>
                    {error && <p className="form-msg-error">{error}</p>}
                    <label htmlFor="email" className="login__form-label">
                        Email:
                    </label>
                    <input className="login__form-input" id="email" name="email" type="email" placeholder="Email" value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <label htmlFor="password" className="login__form-label">
                        Password:
                    </label>
                    <input className="login__form-input" id="password" name="password" type="password" placeholder="Password" value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <button className="login__button" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
