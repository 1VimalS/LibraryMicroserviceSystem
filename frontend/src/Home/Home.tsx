import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../AuthContext.tsx";
import "./Home.css";
import Navbar from "../Navbar/Navbar.tsx";

const Home: React.FC = () => {
    const { username } = useAuth();
    
    return (
        <>
          <Navbar />
          <h1>
            Welcome to Home, {username}!
          </h1>
        </>
    );
};

export default Home;