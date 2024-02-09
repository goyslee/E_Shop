//services\paymentService.js
const transactionId = '123456789'
async function simulatePayment(userid, cartId, totalPrice) {
    try {
        console.log(`Payment processed successfully for User ID: ${userid}, Cart ID: ${cartId}, Total Price: ${totalPrice}`);
        return {
            success: true,
            transactionId: transactionId
        };
    } catch (error) {
        console.error('Payment processing error:', error);
        return {
            success: false,
            error: 'Payment processing error'
        };
    }
}

module.exports = {
    simulatePayment
};
