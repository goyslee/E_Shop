
//controllers\userController.js
const Joi = require('joi');
const bcrypt = require('bcrypt');
const pool = require('../config/dbConfig'); // Adjusted path
const isAuthenticated = require('../middleware/isAuthenticated');

const userSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  address: Joi.string().required(),
  phonenumber: Joi.string().pattern(new RegExp('^[0-9+\\-\\s]+$')).required()
});

const register = async (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const { name, email, password, address, phonenumber } = value;
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).send("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, address, phonenumber) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
      [name, email, hashedPassword, address, phonenumber]
    );

    const userid = newUser.rows[0].userid;

    await pool.query(
      "INSERT INTO carts (userid, totalprice) VALUES ($1, 0)",
      [userid]
    );

    res.status(201).send("User registered successfully and cart created");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getUserById = async (req, res) => {
  console.log(`USERID: ${req.params.userid}`)
  const userid  = req.params.userid;
  try {
    // Check if req.user exists and if the userid matches the requested userid
    if (!req.params || parseInt(req.params.userid) !== parseInt(userid)) {
      return res.status(403).send("Not authorized to view other users' accounts");
    }
    const result = await pool.query('SELECT name, email, address, phonenumber, userid FROM users WHERE userid = $1', [userid]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('Error in getUserById:', err.message);
    res.status(500).send('Internal Server Error: ' + err.message);
  }
};


const updateUser = async (req, res) => {
  const userid  = req.params.userid;
  const { name, email, password, address, phonenumber } = req.body;

  if (!userid) {
    return res.status(401).send("User not authenticated");
  }

  try {
    if (!req.params || parseInt(req.params.userid) !== parseInt(userid)) {
      return res.status(403).send("Not authorized to change other users' accounts");
    }

    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    } else {
      // Fetch current password if not changing
      const currentUser = await pool.query('SELECT password FROM users WHERE userid = $1', [userid]);
      hashedPassword = currentUser.rows[0].password;
    }

    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3, address = $4, phonenumber = $5 WHERE userid = $6 RETURNING *',
      [name, email, hashedPassword, address, phonenumber, parseInt(userid)]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('Error in updateUser:', err.message);
    res.status(500).send('Internal Server Error');
  }
};


async function getUserCurrentPassword(userid) {
  // Function to get the current password from the database
  const result = await pool.query('SELECT password FROM users WHERE userid = $1', [userid]);
  return result.rows[0].password;
}

const deleteUser = async (req, res) => {
  const { userid } = req.params;
  try {
    if (!req.user || parseInt(req.user.userid) !== parseInt(userid)) {
      return res.status(403).send("Not authorized to delete other users' accounts");
    }
    await pool.query('DELETE FROM users WHERE userid = $1', [userid]);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    // Assuming req.user contains user details after authentication
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
};

module.exports = {
  register,
  getUserById,
  updateUser,
  deleteUser,
  checkAuth
};
