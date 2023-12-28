//view\src\components\products\ProductDetails.js
import React from 'react';

export default function ProductDetails({ product }) {
  if (!product) {
    return <div>Product information is loading...</div>;
  }

  return (
    <div className="product">
      {product.image_url ? (
        <img src={product.image_url} alt={product.name} />
      ) : (
        <div>No image available</div>
      )}
      <h3>{product.name}</h3>
      <p>{product.description}</p>
    </div>
  );
}