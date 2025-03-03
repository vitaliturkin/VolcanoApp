// importing necessary modules and components
import React, { useState } from "react";
import { registerAccount } from "../api";
import { useNavigate } from "react-router-dom";

// Register component definition
export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        // calling registerAccount API function with email and password
        registerAccount(email, password)
            .then((data) => {
                console.log("Registration response:", data);
                // checking for registration success or failure
                if (data.error) {
                    setError(data.message || "Registration failed. Please try again.");
                } else {
                    // redirecting to login page upon successful registration
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.error("Registration error:", error.message);
                setError("Registration failed. Please try again."); // Update error state
            });
    };

    // the registration form
    return (
        <div className="register">
            <img src="/img/registerBack.jpg" alt="Main Register" className="register__img" />
            <div className="container">
                <form className="register__form" onSubmit={handleRegister}>
                    <h1 className="register__form-title">Register</h1>
                    {error && <p className="form-msg-error">{error}</p>}
                    <label className="register__form-label" htmlFor="email">Email:</label>
                    <input className="register__form-input" id="email" name="email" type="email" placeholder="Email" value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <label className="register__form-label" htmlFor="password">Password:</label>
                    <input className="register__form-input" id="password" name="password" type="password" placeholder="Password" value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <button className="register__button" type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}