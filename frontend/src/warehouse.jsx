// warehouse.jsx
import React, { useState, useEffect } from 'react';
import './styles.css';

const Warehouse = () => {
  // State for all warehouses
  const [warehouses, setWarehouses] = useState([]);
  
  // State for new warehouse form
  const [newWarehouse, setNewWarehouse] = useState({
    warehouseId: '',
    name: '',
    location: '',
    capacity: '',
    contact: ''
  });
  
  // State for update warehouse form
  const [updateWarehouse, setUpdateWarehouse] = useState({
    warehouseId: '',
    location: ''
  });
  
  // State for delete warehouse form
  const [deleteWarehouseId, setDeleteWarehouseId] = useState('');
  
  const apiUrl = 'http://localhost:3004/api/warehouses';

  // Fetch warehouses when component mounts
  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Function to fetch all warehouses
  const fetchWarehouses = async () => {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      setWarehouses(result.data || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      alert('Error fetching warehouses: ' + error.message);
    }
  };

  // Handle adding a new warehouse
  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newWarehouse)
      });

      const data = await response.json();
      if (data.success) {
        alert('Warehouse added successfully');
        fetchWarehouses();
        // Reset form
        setNewWarehouse({
          warehouseId: '',
          name: '',
          location: '',
          capacity: '',
          contact: ''
        });
      } else {
        alert('Error adding warehouse: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error adding warehouse: ' + error.message);
    }
  };

  // Handle updating a warehouse
  const handleUpdateWarehouse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/update/${updateWarehouse.warehouseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location: updateWarehouse.location })
      });

      const data = await response.json();
      if (data.success) {
        alert('Warehouse updated successfully');
        fetchWarehouses();
        // Reset form
        setUpdateWarehouse({ warehouseId: '', location: '' });
      } else {
        alert('Error updating warehouse: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error updating warehouse: ' + error.message);
    }
  };

  // Handle deleting a warehouse
  const handleDeleteWarehouse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/delete/${deleteWarehouseId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        alert('Warehouse deleted successfully');
        fetchWarehouses();
        // Reset form
        setDeleteWarehouseId('');
      } else {
        alert('Error deleting warehouse: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error deleting warehouse: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1>Warehouse Management</h1>
      
      {/* Add Warehouse Form */}
      <div className="form-section">
        <h2>Add Warehouse</h2>
        <form onSubmit={handleAddWarehouse}>
          <div className="form-group">
            <label htmlFor="warehouseId">Warehouse ID:</label>
            <input
              type="number"
              id="warehouseId"
              value={newWarehouse.warehouseId}
              onChange={(e) => setNewWarehouse({
                ...newWarehouse,
                warehouseId: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="warehouseName">Warehouse Name:</label>
            <input
              type="text"
              id="warehouseName"
              value={newWarehouse.name}
              onChange={(e) => setNewWarehouse({
                ...newWarehouse,
                name: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="warehouseLocation">Location:</label>
            <input
              type="text"
              id="warehouseLocation"
              value={newWarehouse.location}
              onChange={(e) => setNewWarehouse({
                ...newWarehouse,
                location: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="warehousesCapacity">Warehouse Capacity:</label>
            <input
              type="number"
              id="warehousesCapacity"
              value={newWarehouse.capacity}
              onChange={(e) => setNewWarehouse({
                ...newWarehouse,
                capacity: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="warehousesContact">Warehouse Contact:</label>
            <input
              type="text"
              id="warehousesContact"
              value={newWarehouse.contact}
              onChange={(e) => setNewWarehouse({
                ...newWarehouse,
                contact: e.target.value
              })}
              required
            />
          </div>

          <button type="submit">Add Warehouse</button>
        </form>
      </div>

      {/* Update Warehouse Form */}
      <div className="form-section">
        <h2>Update Warehouse</h2>
        <form onSubmit={handleUpdateWarehouse}>
          <div className="form-group">
            <label htmlFor="updateWarehouseId">Warehouse ID:</label>
            <input
              type="text"
              id="updateWarehouseId"
              value={updateWarehouse.warehouseId}
              onChange={(e) => setUpdateWarehouse({
                ...updateWarehouse,
                warehouseId: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="updateWarehouseLocation">New Location:</label>
            <input
              type="text"
              id="updateWarehouseLocation"
              value={updateWarehouse.location}
              onChange={(e) => setUpdateWarehouse({
                ...updateWarehouse,
                location: e.target.value
              })}
              required
            />
          </div>

          <button type="submit">Update Warehouse</button>
        </form>
      </div>

      {/* Delete Warehouse Form */}
      <div className="form-section">
        <h2>Delete Warehouse</h2>
        <form onSubmit={handleDeleteWarehouse}>
          <div className="form-group">
            <label htmlFor="deleteWarehouseId">Warehouse ID:</label>
            <input
              type="text"
              id="deleteWarehouseId"
              value={deleteWarehouseId}
              onChange={(e) => setDeleteWarehouseId(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="delete-button">Delete Warehouse</button>
        </form>
      </div>

      {/* Display Warehouse List */}
      <div className="warehouse-list">
        <h2>All Warehouses</h2>
        {warehouses.length === 0 ? (
          <p>No warehouses found.</p>
        ) : (
          warehouses.map((warehouse) => (
            <div key={warehouse._id} className="warehouse-item">
              <p><strong>Warehouse ID:</strong> {warehouse._id}</p>
              <p><strong>Name:</strong> {warehouse.name}</p>
              <p><strong>Location:</strong> {warehouse.location}</p>
              <p><strong>Capacity:</strong> {warehouse.capacity}</p>
              <p><strong>Contact:</strong> {warehouse.contact}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Warehouse;