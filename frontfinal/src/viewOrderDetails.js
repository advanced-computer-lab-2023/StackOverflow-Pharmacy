import React, { useState } from 'react';

const ViewOrderDetails = () => {
  // Sample order data, replace with your actual data
  const orderDetails = {
    orderId: '123456',
    items: [
      { id: '1', name: 'Item 1', quantity: 2, price: 10 },
      { id: '2', name: 'Item 2', quantity: 1, price: 15 },
    ],
    total: 35,
    status: 'Processing',
  };

  // State to track whether the order is canceled
  const [isOrderCanceled, setOrderCanceled] = useState(false);

  // Function to handle order cancellation
  const cancelOrder = () => {
    // Perform cancellation logic here
    // For now, just set the state to indicate cancellation
    setOrderCanceled(true);
  };

  return (
    <div>
      <h1>Order Details</h1>

      {/* Order Details Section */}
      <section style={orderDetailsSectionStyle}>
        <h2>Order #{orderDetails.orderId}</h2>
        <ul>
          {orderDetails.items.map((item) => (
            <li key={item.id}>
              {item.name} - Quantity: {item.quantity} - Price: ${item.price}
            </li>
          ))}
        </ul>
        <p>Total: ${orderDetails.total}</p>
        <p>Status: {isOrderCanceled ? 'Canceled' : orderDetails.status}</p>
      </section>

      {/* Cancel Order Button */}
      {!isOrderCanceled && (
        <button style={cancelButtonStyle} onClick={cancelOrder}>
          Cancel Order
        </button>
      )}
    </div>
  );
};

const orderDetailsSectionStyle = {
  border: '1px solid #ccc',
  padding: '15px',
  marginBottom: '20px',
};

const cancelButtonStyle = {
  backgroundColor: '#ff0000',
  color: '#fff',
  padding: '10px',
  cursor: 'pointer',
};

export default ViewOrderDetails;
