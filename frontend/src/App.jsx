import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MenuManagement from "./components/MenuManagement";
import OrdersManagement from "./components/OrdersManagement";
import "./App.css";

function App() {
  const navigate = useNavigate();
  return (
    <div className="app">
      <nav className="navbar">
        <h1>Foodie Fusion Delivery Management</h1>
        <button className="navClick" onClick={() => navigate("/")}>
          Manage Menu
        </button>
        <button className="navClick" onClick={() => navigate("/orders")}>
          Manage Orders
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<MenuManagement />} />
        <Route path="/orders" element={<OrdersManagement />} />
      </Routes>
    </div>
  );
}

export default App;
