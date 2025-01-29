import React, { useState, useEffect } from 'react';
import './styles.css';

const Stock = () => {
  const [stockList, setStockList] = useState([]);
  const [addForm, setAddForm] = useState({
    productId: '',
    productName: '',
    category: '',
    warehouse: '',
    quantity: '',
    supplier: '',
    price: '',
  });
  const [updateForm, setUpdateForm] = useState({ stockName: '', newQuantity: '' });
  const [deleteStockId, setDeleteStockId] = useState('');
  const [message, setMessage] = useState('');
  const apiUrl = 'https://inventory-kwv2.onrender.com/api/stock';

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      if (result.success) {
        setStockList(result.data?.stock || []);
      } else {
        setMessage('Error loading stock.');
      }
    } catch (error) {
      setMessage(`Error fetching stock: ${error.message}`);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Stock added successfully!');
        fetchStock();
        setAddForm({
          productId: '',
          productName: '',
          category: '',
          warehouse: '',
          quantity: '',
          supplier: '',
          price: '',
        });
      } else {
        setMessage('Failed to add stock.');
      }
    } catch (error) {
      setMessage(`Error adding stock: ${error.message}`);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/update/${updateForm.stockName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: updateForm.newQuantity }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Stock updated successfully!');
        fetchStock();
        setUpdateForm({ stockName: '', newQuantity: '' });
      } else {
        setMessage('Failed to update stock.');
      }
    } catch (error) {
      setMessage(`Error updating stock: ${error.message}`);
    }
  };

  const handleDeleteStock = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/delete/${deleteStockId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Stock deleted successfully!');
        fetchStock();
        setDeleteStockId('');
      } else {
        setMessage('Failed to delete stock.');
      }
    } catch (error) {
      setMessage(`Error deleting stock: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h1>Stock Management</h1>

      <h2>Add Stock</h2>
      <form onSubmit={handleAddStock}>
        {['productId', 'productName', 'category', 'warehouse', 'quantity', 'supplier', 'price'].map((field) => (
          <div key={field} className="form-group">
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === 'quantity' || field === 'price' ? 'number' : 'text'}
              value={addForm[field]}
              onChange={(e) => setAddForm({ ...addForm, [field]: e.target.value })}
              required
            />
          </div>
        ))}
        <button type="submit">Add Stock</button>
      </form>

      <h2>Update Stock Quantity</h2>
      <form onSubmit={handleUpdateStock}>
        <div className="form-group">
          <label>Stock Name:</label>
          <input
            type="text"
            value={updateForm.stockName}
            onChange={(e) => setUpdateForm({ ...updateForm, stockName: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>New Quantity:</label>
          <input
            type="number"
            value={updateForm.newQuantity}
            onChange={(e) => setUpdateForm({ ...updateForm, newQuantity: e.target.value })}
            required
          />
        </div>
        <button type="submit">Update Stock</button>
      </form>

      <h2>Delete Stock</h2>
      <form onSubmit={handleDeleteStock}>
        <div className="form-group">
          <label>Stock ID:</label>
          <input
            type="text"
            value={deleteStockId}
            onChange={(e) => setDeleteStockId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="delete-button">Delete Stock</button>
      </form>

      <h2>Current Stock</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Warehouse</th>
            <th>Quantity</th>
            <th>Supplier</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {stockList.length === 0 ? (
            <tr>
              <td colSpan="7">No stock found.</td>
            </tr>
          ) : (
            stockList.map((stock) => (
              <tr key={stock.productId}>
                <td>{stock.productId}</td>
                <td>{stock.productName}</td>
                <td>{stock.category}</td>
                <td>{stock.warehouse}</td>
                <td>{stock.quantity}</td>
                <td>{stock.supplier}</td>
                <td>{stock.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {message && <p className="response-message">{message}</p>}
    </div>
  );
};

export default Stock;
