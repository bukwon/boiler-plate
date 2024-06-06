import React from "react";
import {
  Route,
  Routes,
  BrowserRouter
} from "react-router-dom";

import LandingPage from "./compoents/views/LandingPage/LandingPage";
import LoginPage from "./compoents/views/LoginPage/LoginPage";
import RegisterPage from "./compoents/views/RegisterPage/RegisterPage";
import { Router } from "express";


function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Routes>
          <Route exact path="/" element={LandingPage()}/>
           
          <Route exact path="/login" element={LoginPage()}/>
          
          <Route exact path="/register" element={RegisterPage()}/>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;