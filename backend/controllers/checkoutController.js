// controllers\checkoutController.js
const pool = require('../config/dbConfig');
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

const checkout = async (req, res) => {
  const {userid, email} = req.user;
  const { paymentMethodId, amount, username } = req.body;

  try {
    // Retrieve the user's cart
    const cartUserQuery = await pool.query('SELECT userid FROM carts WHERE userid = $1', [userid]);
    if (cartUserQuery.rows.length === 0 || parseInt(cartUserQuery.rows[0].userid) !== parseInt(userid)) {
      return res.status(403).send("Not authorized to view other users' carts");
    }

    const cartQuery = await pool.query('SELECT * FROM carts WHERE userid = $1', [userid]);
    if (cartQuery.rows.length === 0) {
      return res.status(400).send('Invalid cart');
    }
    const cartId = cartQuery.rows[0].cartid;

    // Create a PaymentIntent using Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert amount to cents
      currency: 'gbp',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.REACT_APP_FRONTEND_URL}`,
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: email,
       description: `Order for user ${userid}`,
    });

    // Create an order in the database
    const userQuery = await pool.query('SELECT address FROM users WHERE userid = $1', [userid]);
    const shippingAddress = userQuery.rows[0].address;

    const orderQuery = await pool.query('INSERT INTO orders (userid, orderdate, totalprice, shippingaddress) VALUES ($1, NOW(), $2, $3) RETURNING *', [userid, amount, shippingAddress]);
    const orderId = orderQuery.rows[0].orderid;

    // Add order details
    const cartItemsQuery = await pool.query('SELECT productid, quantity FROM cartitems WHERE cartid = $1', [cartId]);
    for (const item of cartItemsQuery.rows) {
      const itemTotalPrice = item.quantity * (await getProductPrice(item.productid));
      await pool.query('INSERT INTO orderdetails (orderid, productid, quantity, price) VALUES ($1, $2, $3, $4)', [orderId, item.productid, item.quantity, itemTotalPrice]);
    }

    // Clear the cart
    await pool.query('DELETE FROM cartitems WHERE cartid = $1', [cartId]);
    await pool.query('UPDATE carts SET totalprice = 0 WHERE cartid = $1', [cartId]);

    res.status(201).json({
      success: true,
      orderId: orderId,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString()  // Corrected to use client_secret
    });
     } catch (err) {
    res.status(500).send(err.message);
  }
};

async function getProductPrice(productid) {
  const productQuery = await pool.query('SELECT price FROM products WHERE productid = $1', [productid]);
  if (productQuery.rows.length > 0) {
    return productQuery.rows[0].price;
  } else {
    throw new Error('Product not found');
  }
}

function getUKDateTime() {
  const options = { timeZone: 'Europe/London', hour12: false };
  return new Date().toLocaleString('en-UK', options);
}

module.exports = {
  checkout
};
