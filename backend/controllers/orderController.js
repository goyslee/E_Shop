// controllers\orderController.js
const pool = require('../config/dbConfig');

async function getItemTotalPrice(productId, quantity) {
    const productQuery = await pool.query('SELECT price FROM products WHERE productid = $1', [productId]);
    if (productQuery.rows.length > 0) {
        const productPrice = productQuery.rows[0].price;
        return productPrice * quantity;
    }
    return 0;
}

const getAllOrders = async (req, res) => {
    const userid = req.user.userid;
    try {
        const ordersQuery = await pool.query('SELECT * FROM orders WHERE userid = $1', [userid]);

        const ordersWithDetails = await Promise.all(
            ordersQuery.rows.map(async (order) => {
                const orderDetailsQuery = await pool.query('SELECT * FROM orderdetails WHERE orderid = $1', [order.orderid]);
                const orderDetails = orderDetailsQuery.rows.map(async (detail) => {
                    const productQuery = await pool.query('SELECT * FROM products WHERE productid = $1', [detail.productid]);
                    return {
                        ...detail,
                        product: productQuery.rows[0]
                    };
                });

                return {
                    ...order,
                    orderdetails: await Promise.all(orderDetails)
                };
            })
        );

        res.json(ordersWithDetails);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


const getOrderById = async (req, res) => {
    const userid = req.user.userid;
    const orderId = req.params.orderId;
    try {
        const orderQuery = await pool.query('SELECT * FROM orders WHERE orderid = $1 AND userid = $2', [orderId, userid]);
        if (orderQuery.rows.length === 0) {
            return res.status(404).send('Order not found');
        }
        res.json(orderQuery.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


async function findNextAvailableOrderId() {
    const result = await pool.query('SELECT MAX(orderid) FROM orders');
    const maxId = result.rows[0].max;
    return maxId ? maxId + 1 : 1;
}


const createOrder = async (req, res) => {
    const userid = req.user.userid;
    const { totalprice, shippingaddress, orderdetails } = req.body;
    try {
        const nextAvailableOrderId = await findNextAvailableOrderId(); // Find the next available order ID
        const newOrderQuery = await pool.query(
            'INSERT INTO orders (orderid, userid, orderdate, totalprice, shippingaddress) VALUES ($1, $2, NOW(), $3, $4) RETURNING *',
            [nextAvailableOrderId, userid, totalprice, shippingaddress]
        );
        const newOrderId = newOrderQuery.rows[0].orderid;

        for (const item of orderdetails) {
            const itemTotalPrice = await getItemTotalPrice(item.productid, item.quantity);
            await pool.query(
                'INSERT INTO orderdetails (orderid, productid, quantity, price) VALUES ($1, $2, $3, $4)',
                [newOrderId, item.productid, item.quantity, itemTotalPrice]
            );
        }
        res.status(201).json(newOrderId);
    } catch (err) {
        console.error('Create Order error:', err); // Enhanced error logging
        res.status(500).send(err.message);
    }
};


const updateOrderDetails = async (req, res) => {
    const userid = req.user.userid;
    const orderId = req.params.orderId;
    const orderDetailId = req.params.orderDetailId;
    const quantity = parseFloat(req.body.quantity);

    if (isNaN(quantity)) {
        return res.status(400).send('Invalid quantity');
    }

    try {
        const orderDetailQuery = await pool.query(
            'SELECT quantity, price, productid FROM orderdetails WHERE orderid = $1 AND orderdetailid = $2',
            [orderId, orderDetailId]
        );

        if (orderDetailQuery.rows.length === 0) {
            return res.status(404).send('Order detail not found');
        }

        const { quantity: currentQuantity, price, productid } = orderDetailQuery.rows[0];
        const newQuantity = currentQuantity + quantity;
        const itemTotalPrice = price * Math.abs(quantity);

        if (newQuantity < 0) {
            return res.status(400).send('Quantity cannot be negative');
        }

        const newPrice = (price * newQuantity) / currentQuantity;

        await pool.query(
            'UPDATE orderdetails SET quantity = $1, price = $2 WHERE orderid = $3 AND orderdetailid = $4',
            [newQuantity, newPrice, orderId, orderDetailId]
        );

        await pool.query(
            'UPDATE products SET stockquantity = stockquantity - $1 WHERE productid = $2',
            [quantity, productid]
        );

        await pool.query(
            'UPDATE orders SET totalprice = totalprice + $1 WHERE orderid = $2 AND userid = $3 RETURNING *',
            [itemTotalPrice, orderId, userid]
        );

        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteOrder = async (req, res) => {
    const userid = req.user.userid;
    const orderId = req.params.orderId;
    try {
        const deleteOrderQuery = await pool.query('DELETE FROM orders WHERE orderid = $1 AND userid = $2', [orderId, userid]);
        if (deleteOrderQuery.rows.length === 0) {
            return res.status(404).send('Order not found');
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderDetails,
    deleteOrder
};
