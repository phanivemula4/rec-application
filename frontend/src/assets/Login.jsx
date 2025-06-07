import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Dashboard from './Dashboard';
import './Login.css'; 
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const fetchLoginDetails = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please fill in all fields!");
            return;
        }
        try {
            const response = await axios.post(
                "https://rec-application.onrender.com/log",
                { email, password },
                { withCredentials: true }
            );
            console.log("Login response:", response.data);
            navigate('/dor'); 
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed: " + (error.response?.data?.message || "Server error"));
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form className="login-form" onSubmit={fetchLoginDetails}>
                Email: <input type='text' onChange={handleEmailChange} /><br />
                Password: <input type='password' onChange={handlePasswordChange} /><br />
                <button type='submit'>Login</button>
            </form>
        </div>
    );
};

export default Login;
