import { useState, useEffect } from 'react';
import './styles.css';

const apiUrl = "http://localhost:3004/api";

function Customer() {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${apiUrl}/products`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
  
        const result = await response.json();
  
        // Log the entire response to inspect its structure
        console.log('Fetched Products:', result);
        
        // Check if the data object exists and contains products
        if (result.data && result.data.products) {
          setProducts(result.data.products);
        } else {
          console.error("No product data found");
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);
  
  const handleQuantityChange = (productId, value) => {
    setOrderItems(prevItems => {
      const newItems = [...prevItems];
      const index = newItems.findIndex(item => item.productId === productId);
      if (index > -1) {
        newItems[index].quantity = value;
      } else {
        newItems.push({ productId, quantity: value });
      }
      return newItems;
    });
  };

  const handleModalOpen = () => {
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

    if (orderItems.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    if (!customerData.name || !customerData.phone || !customerData.address) {
      alert("All customer details are required.");
      return;
    }

    const order = {
      customer: customerData,
      items: orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: products.find(product => product._id === item.productId)?.price || 0
      }))
    };

    try {
      const response = await fetch(`${apiUrl}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      alert('Order placed successfully!');
      setOrderItems([]);
      setCustomerData({
        name: '',
        phone: '',
        address: ''
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error submitting order. Please try again.");
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
                  value={orderItems.find(item => item.productId === product._id)?.quantity || 0}
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

      {/* Modal for customer info */}
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
