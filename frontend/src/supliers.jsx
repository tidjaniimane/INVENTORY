import  { useState, useEffect } from 'react';
import './styles.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [updateSupplier, setUpdateSupplier] = useState(null);
  const [deleteSupplierName, setDeleteSupplierName] = useState('');
  const [message, setMessage] = useState('');
  const apiUrl = 'https://inventory-kwv2.onrender.com/api/suppliers';

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      setSuppliers(result.data?.suppliers || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Supplier added successfully');
        fetchSuppliers();
        setNewSupplier({ name: '', phone: '', address: '', email: '' });
      } else {
        setMessage('Failed to add supplier');
      }
    }  catch (error) {
      console.error('Error adding supplier', error);  // Log the error to the console
      setMessage('Error adding supplier');
    }
    
  };

  const handleSearchSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}?search=${encodeURIComponent(searchTerm)}`);
      const result = await response.json();
      if (result.success && result.data.suppliers.length > 0) {
        setUpdateSupplier(result.data.suppliers[0]);
        setMessage('Supplier found');
      } else {
        setUpdateSupplier(null);
        setMessage('Supplier not found');
      }
    } catch (error) {
      console.error('Error searching supplier:', error);
      setMessage('Error searching for supplier');
    }
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/update/${updateSupplier._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateSupplier),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Supplier updated successfully');
        fetchSuppliers();
        setUpdateSupplier(null);
      } else {
        setMessage('Failed to update supplier');
      }
    } catch (error) {
      console.error('Error adding supplier', error);  // Log the error to the console
      setMessage('Error adding supplier');
    }
    
  };

  const handleDeleteSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}?search=${encodeURIComponent(deleteSupplierName)}`);
      const result = await response.json();
      if (result.success && result.data.suppliers.length > 0) {
        const supplier = result.data.suppliers[0];
        await fetch(`${apiUrl}/delete/${supplier._id}`, { method: 'DELETE' });
        setMessage('Supplier deleted successfully');
        fetchSuppliers();
        setDeleteSupplierName('');
      } else {
        setMessage('Supplier not found');
      }
    } catch (error) {
      console.error('Error adding supplier', error);  // Log the error to the console
      setMessage('Error adding supplier');
    }
    
  };

  return (
    <div className="container">
      <h1>Manage Suppliers</h1>

      <h2>Add Supplier</h2>
      <form onSubmit={handleAddSupplier}>
        <input
          type="text"
          placeholder="Name"
          value={newSupplier.name}
          onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={newSupplier.phone}
          onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={newSupplier.address}
          onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newSupplier.email}
          onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
          required
        />
        <button type="submit">Add Supplier</button>
      </form>

      <h2>Search Supplier</h2>
      <form onSubmit={handleSearchSupplier}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {updateSupplier && (
        <form onSubmit={handleUpdateSupplier}>
          <h2>Update Supplier</h2>
          <input
            type="text"
            placeholder="Name"
            value={updateSupplier.name}
            onChange={(e) => setUpdateSupplier({ ...updateSupplier, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={updateSupplier.phone}
            onChange={(e) => setUpdateSupplier({ ...updateSupplier, phone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={updateSupplier.address}
            onChange={(e) => setUpdateSupplier({ ...updateSupplier, address: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={updateSupplier.email}
            onChange={(e) => setUpdateSupplier({ ...updateSupplier, email: e.target.value })}
            required
          />
          <button type="submit">Update Supplier</button>
        </form>
      )}

      <h2>Delete Supplier</h2>
      <form onSubmit={handleDeleteSupplier}>
        <input
          type="text"
          placeholder="Supplier Name"
          value={deleteSupplierName}
          onChange={(e) => setDeleteSupplierName(e.target.value)}
          required
        />
        <button type="submit">Delete Supplier</button>
      </form>

      <h2>Supplier List</h2>
<div className="supplier-list">
  {suppliers.length === 0 ? (
    <p>No suppliers found.</p>
  ) : (
    suppliers.map((supplier) => (
      <div key={supplier._id || supplier.name} className="supplier-item">
        <p><strong>Name:</strong> {supplier.name}</p>
        <p><strong>Phone:</strong> {supplier.phone}</p>
        <p><strong>Address:</strong> {supplier.address}</p>
        <p><strong>Email:</strong> {supplier.email}</p>
      </div>
    ))
  )}
</div>




      {message && <p>{message}</p>}
    </div>
  );
};

export default Suppliers;
