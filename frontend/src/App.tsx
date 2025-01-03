import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import Home from "./Home/Home";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/checkout" element={<Home />} />
            <Route path="/checkin" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
