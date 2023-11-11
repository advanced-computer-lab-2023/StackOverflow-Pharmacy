import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const CheckoutPage = () => {
  const [addressList, setAddressList] = useState([
    '123 First Street',
    '456 Second Avenue',
    '789 Third Avenue',
  ]);
  const [newAddress, setNewAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');

  const handleAddAddress = () => {
    if (newAddress.trim() !== '') {
      setAddressList([...addressList, newAddress]);
      setNewAddress('');
    }
  };

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Perform any necessary actions based on the selected payment method and address
    switch (selectedPayment) {
      case 'wallet':
        // Handle wallet payment
        break;
      case 'card':
        // Handle card payment
        break;
      case 'cod':
        // Handle cash on delivery payment
        break;
      default:
        // Handle default case
        break;
    }
  };

  return (
    <div>
      <header>
        <h1>Checkout</h1>
      </header>
      <form onSubmit={handleFormSubmit}>
        <h2>Delivery Address</h2>
        <div>
          {addressList.map((address, index) => (
            <div key={index}>
              <input
                type="radio"
                id={`address-${index}`}
                name="address"
                value={address}
                checked={selectedAddress === address}
                onChange={handleAddressChange}
              />
              <label htmlFor={`address-${index}`}>{address}</label>
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={newAddress}
            placeholder="Enter new address"
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <button type="button" onClick={handleAddAddress}>
            Add
          </button>
        </div>
        <h2>Payment Method</h2>
        <div>
          <input
            type="radio"
            id="wallet-payment"
            name="payment-method"
            value="wallet"
            checked={selectedPayment === 'wallet'}
            onChange={handlePaymentChange}
          />
          <label htmlFor="wallet-payment">Wallet</label>
        </div>
        <div>
          <input
            type="radio"
            id="card-payment"
            name="payment-method"
            value="card"
            checked={selectedPayment === 'card'}
            onChange={handlePaymentChange}
          />
          <label htmlFor="card-payment">Credit Card</label>
        </div>
        <div>
          <input
            type="radio"
            id="cod-payment"
            name="payment-method"
            value="cod"
            checked={selectedPayment === 'cod'}
            onChange={handlePaymentChange}
          />
          <label htmlFor="cod-payment">Cash on Delivery</label>
        </div>
        <Link to="/viewOrderDetails">
        <button>Proceed to Pay</button>
      </Link>
      </form>
    </div>
  );
};

export default CheckoutPage;