// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './loginpage';
import Dashboard from './dashboard';  
import Products from './products';
import Orders from './orders';
import Stock from './stock';
import Suppliers from './supliers';
import Users from './users';
import Warehouse from './warehouse';
import CategoriesManagement from './categories';
import Customer from './customer';
import './styles.css';




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />  {/* Add this route */}
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/users" element={<Users />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/categories" element={<CategoriesManagement />} />
        <Route path="/Customer" element={<Customer />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);