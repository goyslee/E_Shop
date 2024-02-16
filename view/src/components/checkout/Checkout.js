// Checkout.js
import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import OrderHistory from '../orders/OrderHistory';
import './Checkout.css'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { userid } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.cart);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity * parseFloat(item.price), 0);
  }, [cartItems]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
    } else {
     try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL, {withCredentials: true}}/${userid}/checkout`, {
          paymentMethodId: paymentMethod.id,
          amount: totalAmount
          
        },{withCredentials: true});

     const { clientSecret } = response.data;
       if (clientSecret) { // Check if clientSecret exists before using it
         const result = await stripe.confirmCardPayment(clientSecret.toString());

         if (result.error) {
           console.error('Payment confirmation error', result.error);
         } else {
           setPaymentSuccessful(true); // Set the flag to true on successful payment
         }
       } else {
         console.error('Client secret is missing in the server response');
       }
      } catch (error) {
        console.error('Error processing payment', error);
      }
    }
  };

  if (paymentSuccessful) {
    return <OrderHistory />; // Render OrderHistory component on successful payment
  }


  return (
    <div className="checkout-container">
      <div className="checkout-section cart-summary">
        <h3>Cart Summary</h3>
        {cartItems.map(item => (
          <div key={item.productid} className="cart-item">
            <img src={item.image_url} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">  - <b>£{item.price}</b>  ({item.quantity})</span>
            </div>
          </div>
        ))}
        <p className="total-amount">Total: £{totalAmount.toFixed(2)}</p>
      </div>

      <div className="checkout-section payment-details">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Payment Details</h2>
          <CardElement />
          <button type="submit" disabled={!stripe} className="pay-button">
            Pay £{totalAmount.toFixed(2)}
          </button>
        </form>
      </div>
    </div>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;

