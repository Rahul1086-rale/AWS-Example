import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) handleLogout();
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
      </Routes>
    </Router>
  );
};

export default App;
