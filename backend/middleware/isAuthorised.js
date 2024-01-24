const express = require('express');
const router = express.Router();
// Middleware for authorization
const isAuthorised = (req, res, next) => {
  const {userid}  = req.user.userid;
  // Assuming req.user.email  is the id of the currently logged-in user
  if (req.user.userid === userid) {
    next();
  } else {
    res.status(403).send('Not authorized');
  }
};

module.exports = isAuthorised
