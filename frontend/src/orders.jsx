import { useState, useEffect } from 'react';
import './styles.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const apiUrl = 'https://inventory-kwv2.onrender.com/api/orders';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.success) {
        setOrders(result.data || []);
      } else {
        setMessage('Failed to load orders.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('Error fetching orders. Please try again later.');
    }
  };

  const renderOrders = () => {
    if (orders.length === 0) {
      return (
        <tr>
          <td colSpan="5">No orders found.</td>
        </tr>
      );
    }

    return orders.map((order) => {
      const customerName = order.customerId ? order.customerId.name : 'Unknown Customer';
      const customerPhone = order.customerId ? order.customerId.phone : 'Unknown Phone';
      const customerAddress = order.customerId ? order.customerId.address : 'Unknown Address';

      const items = order.items && order.items.length > 0
        ? order.items.map((item) => {
            const productName = item.productId ? item.productId.name : 'Unknown Product';
            const quantity = item.quantity || 0;
            return `${productName} (x${quantity})`;
          }).join(', ')
        : 'No items available';

      return (
        <tr key={order._id}>
          <td>{order._id}</td>
          <td>{customerName}</td>
          <td>{customerPhone}</td>
          <td>{customerAddress}</td>
          <td>{items}</td>
        </tr>
      );
    });
  };

  return (
    <div className="container">
      <h1>Orders Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {renderOrders()}
        </tbody>
      </table>
      {message && <p className="response-message">{message}</p>}
    </div>
  );
};

export default Orders;
 