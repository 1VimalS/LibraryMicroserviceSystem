import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { useAuth } from "../AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const { setUsername: setGlobalUsername } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setUsernameError(false);
    setPasswordError(false);
    setErrorMessage(null);

    if (!username || !password) {
      setErrorMessage("Please fill in all fields");
      if (!username) setUsernameError(true);
      if (!password) setPasswordError(true);
      return;
    }

    try {
      const response: AxiosResponse = await axios.post("http://localhost:8080/user/login", {
        username,
        password
      });

      if (response.status === 200) {
        localStorage.setItem("username", username);
        setGlobalUsername(username);
        navigate("/home");
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          setErrorMessage("Username not found.");
          setUsernameError(true);
        } else if (error.response.status === 401) {
          setErrorMessage("Incorrect password.");
          setPasswordError(true);
        }
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      <div className="input-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={usernameError ? "error" : ""}
        />
      </div>

      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={passwordError ? "error" : ""}
        />
      </div>

      <button onClick={handleLogin} className="login-btn">
        Login
      </button>

      <button onClick={() => navigate("/signup")} className="create-account-btn">
        Create Account
      </button>
    </div>
  );
};

export default Login;
