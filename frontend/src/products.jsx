import { useState, useEffect } from 'react';
import './styles.css';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '' });
  const [updateProduct, setUpdateProduct] = useState({ id: '', quantity: '' });
  const [deleteProductId, setDeleteProductId] = useState('');

  const apiUrl = 'https://inventory-kwv2.onrender.com/api/products';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      const result = await response.json();
      setProducts(result.data?.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products. Please try again later.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error('Error adding product');
      }
      const data = await response.json();
      if (data.data?.product) {
        alert('Product added successfully');
        setNewProduct({ name: '', price: '', quantity: '' });
        fetchProducts();
      } else {
        alert('Failed to add product. Please check your input.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again later.');
    }
  };

  const handleUpdateQuantity = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${apiUrl}/${updateProduct.id}/update_quantity?number=${updateProduct.quantity}`,
        { method: 'POST' }
      );
      if (!response.ok) {
        throw new Error('Error updating quantity');
      }
      const data = await response.json();
      if (data.data?.product) {
        alert('Quantity updated successfully');
        setUpdateProduct({ id: '', quantity: '' });
        fetchProducts();
      } else {
        alert('Failed to update quantity. Please check your input.');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity. Please try again later.');
    }
  };

  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/${deleteProductId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Error deleting product');
      }
      const data = await response.json();
      if (data.data?.message === 'Product deleted successfully') {
        alert('Product deleted successfully');
        setDeleteProductId('');
        fetchProducts();
      } else {
        alert('Failed to delete product. Please check the product ID.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1>Product Inventory</h1>

      <div className="form-section">
        <h2>Add Product</h2>
        <form onSubmit={handleAddProduct}>
          <div className="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
              required
            />
          </div>
          <button type="submit">Add Product</button>
        </form>
      </div>

      <div className="product-list">
        <h2>All Products</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-item">
              <p><strong>Product ID:</strong> {product._id}</p>
              <p><strong>Name:</strong> {product.name}</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
            </div>
          ))
        )}
      </div>

      <div className="form-section">
        <h2>Update Product Quantity</h2>
        <form onSubmit={handleUpdateQuantity}>
          <div className="form-group">
            <label>Product ID:</label>
            <input
              type="text"
              value={updateProduct.id}
              onChange={(e) => setUpdateProduct({ ...updateProduct, id: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>New Quantity:</label>
            <input
              type="number"
              value={updateProduct.quantity}
              onChange={(e) => setUpdateProduct({ ...updateProduct, quantity: e.target.value })}
              required
            />
          </div>
          <button type="submit">Update Quantity</button>
        </form>
      </div>

      <div className="form-section">
        <h2>Delete Product</h2>
        <form onSubmit={handleDeleteProduct}>
          <div className="form-group">
            <label>Product ID:</label>
            <input
              type="text"
              value={deleteProductId}
              onChange={(e) => setDeleteProductId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="delete-button">Delete Product</button>
        </form>
      </div>
    </div>
  );
};

export default Products;
