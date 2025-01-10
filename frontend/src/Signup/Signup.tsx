import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/signup`, { username, password }, {
        headers: {
          'ngrok-skip-browser-warning': '1'
        },
      });
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="input-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="signup-btn" onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
