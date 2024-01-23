//view\src\components\products\ProductsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Product from './ProductDetails';
import './ProductList.css';

export default function ProductList() {
   const { userid, isAuthenticated } = useSelector(state => {
    console.log('Redux State in Cart:', state); // Add this line
    return state.auth;
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:${process.env.REACT_APP_LOCAL_PORT}/products`);
        setProducts(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [userid, isAuthenticated]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map(product => (
          <Link to={`/product/${product.productid}`} key={product.productid}>
            <Product product={product} />
          </Link>
        ))
      ) : (
        <div>No products found</div>
      )}
    </div>
  );
}
