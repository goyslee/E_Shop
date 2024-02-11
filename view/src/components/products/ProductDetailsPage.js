//view\src\components\products\ProductDetailsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CartQuantityButton from '../cart/CartQuantityButton';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const { userid, isAuthenticated } = useSelector(state => {
    console.log('Redux State in Cart:', state); // Add this line
    return state.auth;
  });
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { productid } = useParams();
  const numericProductId = Number(productid);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}products/${productid}`);
        if (response && response.data) {
          setProduct(response.data);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productid, isAuthenticated, userid]);

  if (isLoading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-details-container">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className="price">Price: ${product.price}</p>
      {product.image_url && <img src={product.image_url} alt={product.name} className="product-image" />}
      {/* CartQuantityButton component */}
      <div className="cart-button-wrapper">
        <CartQuantityButton userid={userid} productid={numericProductId} />
      </div>
    </div>
  );
}

export default ProductDetailsPage;
