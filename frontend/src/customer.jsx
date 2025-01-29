import { useState, useEffect } from 'react';
import './styles.css';

const apiUrl = "http://localhost:3004/api";

function Customer() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const result = await response.json();
      if (result.data && result.data.products) {
        const productsWithQuantity = result.data.products.map(product => ({
          ...product,
          quantity: 0
        }));
        setProducts(productsWithQuantity);
      } else {
        console.error("No product data found");
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleQuantityChange = (productId, value) => {
    const quantity = Math.max(0, parseInt(value) || 0);
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product._id === productId
          ? { ...product, quantity }
          : product
      )
    );
  };

  const handleModalOpen = () => {
    const hasSelectedProducts = products.some(product => product.quantity > 0);
    if (!hasSelectedProducts) {
      alert("Please select at least one product.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCustomerData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmitOrder = async (event) => {
    event.preventDefault();
  
    const selectedProducts = products.filter(product => product.quantity > 0);
  
    // Validate that at least one product is selected
    if (selectedProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }
  
    // Validate that all customer details are provided
    if (!customerData.name || !customerData.phone || !customerData.address) {
      alert("All customer details are required.");
      return;
    }
  
    // Prepare order data
    const orderData = {
      customer: {
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address
      },
      items: selectedProducts.map(product => ({
        productId: product._id,  // Ensure this is the correct field name for the product ID
        quantity: product.quantity,
        price: product.price
      }))
    };
  
    console.log('Order data being sent:', orderData);  // Debugging line
  
    try {
      const response = await fetch(`${apiUrl}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
  
      const responseData = await response.json();
      console.log('Response Data:', responseData);  // Debugging line
  
      if (!response.ok) {
        console.error('Error response from server:', responseData);  // Debugging line
        throw new Error(responseData.message || 'Failed to place order');
      }
  
      alert('Order placed successfully!');
      setProducts(prev => prev.map(product => ({ ...product, quantity: 0 })));
      setCustomerData({
        name: '',
        phone: '',
        address: ''
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert(error.message || "Error submitting order. Please try again.");
    }
  };
  
  

  return (
    <div className="container">
      <h1>Welcome to the Customer Dashboard</h1>
      <p>Here you can view all products and make an order.</p>

      <div className="product-list">
        <h2>Select Products</h2>
        <div id="products">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map(product => (
              <div key={product._id} className="product-item">
                <label>{product.name} (${product.price})</label>
                <input
                  type="number"
                  min="0"
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={handleModalOpen}>Buy Now</button>
        <button onClick={() => window.location.href = 'login.html'}>Logout</button>
      </div>

      {isModalOpen && (
        <div>
          <div className="overlay" onClick={handleModalClose}></div>
          <div id="customer-info">
            <h2>Enter Your Information</h2>
            <form id="customer-info-form" onSubmit={handleSubmitOrder}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={customerData.name}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                value={customerData.phone}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="address">Address:</label>
              <textarea
                id="address"
                value={customerData.address}
                onChange={handleInputChange}
                required
                rows="3"
              ></textarea>

              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <button type="submit">Submit Order</button>
                <button type="button" onClick={handleModalClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customer;
