// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./homepage.jsx";
import RegisterPage from "./registerpage.jsx";
import LoginPage from "./loginpage.jsx";
import CreateProject from "./CreateProject.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/createproject" element={<CreateProject />} />
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
