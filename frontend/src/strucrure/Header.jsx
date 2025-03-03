// importing necessary modules and components
import React from "react";
import { Link } from "react-router-dom";
import "../styles/structureCSS.css";
import { useNavigate } from "react-router-dom";

// the header
export default function Header({ authData, setAuthData }) {
    const isAuthenticated = !!authData.token; // checking if user is authenticated
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authData");
        setAuthData({ email: "", token: "" });
        navigate("/");
    };

    return (
        <header className="header">
            <div className="container">
                <nav className="header_nav">
                    <Link className="header_logo" to="/">
                        <img src="/img/icon.png" alt="Icon" className="header_logo-img"/>
                    </Link>
                    <ul className="header_links">
                        <li className="header_link">
                            <Link className="header_a" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="header_link">
                            <Link className="header_a" to="/volcanoes">
                                Volcano List
                            </Link>
                        </li>
                        {/* Conditional rendering based on authentication */}
                        {!isAuthenticated && (
                            <li className="header_link">
                                <Link className="header_a" to="/register">
                                    Register
                                </Link>
                            </li>
                        )}
                        {!isAuthenticated && (
                            <li className="header_link">
                                <Link className="header_a" to="/login">
                                    Login
                                </Link>
                            </li>
                        )}
                        {isAuthenticated && (
                            <li className="header_link">
                                <p className="login_welcome">
                                    Welcome - <span className="welcome__username">{authData.email}</span>
                                </p>
                            </li>
                        )}
                        {isAuthenticated && (
                            <li className="header_link">
                                <button className="logout__button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
