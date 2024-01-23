// isAuthenticated.js
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // If the user is not authenticated, you can redirect or send an appropriate response
    res.status(401).send('User not authenticated');
};

module.exports = isAuthenticated;
