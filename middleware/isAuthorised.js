const express = require('express');

// Middleware for authorization
const isAuthorised = (req, res, next) => {
  const { email } = req.params;
  // Assuming req.user.email  is the id of the currently logged-in user
  if (req.user.email === email) {
    next();
  } else {
    res.status(403).send('Not authorized');
  }
};

module.exports = isAuthorised
