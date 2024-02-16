// controllers\productController.js 
const pool = require('../config/dbConfig');

// This function finds the next available product ID by finding the maximum existing ID and adding 1.
async function findNextAvailableProductId() {
    const result = await pool.query('SELECT MAX(productid) FROM products');
    const maxId = result.rows[0].max; // This will be null if there are no entries
    return maxId ? maxId + 1 : 1; // Start from 1 if there are no existing products
}


const addProduct = async (req, res) => {
    const { name, description, price, stockquantity, category } = req.body;
    try {
        const nextAvailableProductId = await findNextAvailableProductId(); // Find the next available product ID
        const newProduct = await pool.query(
            'INSERT INTO products (productid, name, description, price, stockquantity, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nextAvailableProductId, name, description, price, stockquantity, category]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        console.error('Add Product error:', err); // Enhanced error logging
        res.status(500).send(err.message);
    }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getProductById = async (req, res) => {
  const { productid } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE productid = $1', [productid]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateProduct = async (req, res) => {
  const { productid } = req.params;
  const { name, description, price, stockquantity, category } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stockquantity = $4, category = $5 WHERE productid = $6 RETURNING *',
      [name, description, price, stockquantity, category, productid]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteProduct = async (req, res) => {
  const { productid } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE productid = $1 RETURNING *', [productid]);
    if (result.rows.length > 0) {
      res.send('Product deleted successfully');
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
