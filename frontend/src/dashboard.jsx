// dashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in when component mounts
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/warehouse', label: 'Warehouse', icon: '🏭' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/stock', label: 'Stock', icon: '📊' },
    { path: '/suppliers', label: 'Suppliers', icon: '🚚' },
    { path: '/orders', label: 'Orders', icon: '📝' },
    { path: '/categories', label: 'Categories', icon: '📝' },
    
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Inventory Management System</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="menu-grid">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="menu-item"
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="welcome-section">
          <h2>Welcome, {localStorage.getItem('user')}!</h2>
          <p>Select a menu item above to manage your inventory system.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;