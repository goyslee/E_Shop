// controllers/authController.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const pool = require('../config/dbConfig');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const FACEBOOK_APP_ID = 'Your-Facebook-App-ID';
// const FACEBOOK_APP_SECRET = 'Your-Facebook-App-Secret';

const initializePassport = (passport) => {
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
                if (res.rows.length === 0) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

                const user = res.rows[0];
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    return done (null, { ...user, userid: user.userid, email: user.email });
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      let user = userResult.rows[0];

      if (!user) {
        // User does not exist, create a new user
        const newUserResult = await pool.query(
          'INSERT INTO users (name, email, refresh_token, phonenumber, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [profile.displayName, email, refreshToken, null, null]
        );
        user = newUserResult.rows[0];
      }

      // Include userid in the user object
      if (user) {
        return done(null, { ...user, userid: user.userid, email: user.email });
        
      } else {
        return done(null, false, { message: 'Unable to retrieve user id.' });
      }
    } catch (error) {
      return done(error);
    }
    
  }
));



    // passport.use(new FacebookStrategy({
    //     clientID: process.env.FACEBOOK_APP_ID,
    //     clientSecret: process.env.FACEBOOK_APP_SECRET,
    //     callbackURL: '/auth/facebook/callback',
    //     profileFields: ['id', 'emails', 'name']
    // },
    // async (accessToken, refreshToken, profile, done) => {
    //     const email = profile.emails[0].value;
    //     const user = (await pool.query('SELECT * FROM Users WHERE email = $1', [email])).rows[0];

    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         // Create new user with Facebook profile info
    //         const newUser = (await pool.query(
    //             'INSERT INTO Users (name, email, refresh_token) VALUES ($1, $2, $3) RETURNING *',
    //             [`${profile.name.givenName} ${profile.name.familyName}`, email, profile.id]
    //         )).rows[0];

    //         return done(null, newUser);
    //     }
    // }));

   passport.serializeUser((user, done) => {
  done(null, user.userid);
});

passport.deserializeUser((userid, done) => {
  pool.query('SELECT * FROM users WHERE userid = $1', [userid], (err, results) => {
    if (err) {
      return done(err);
    }
    done(null, results.rows[0]);
  });
});

};

const login = (passport) => (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(400).send('You are already logged in.');
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send('Authentication failed');
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.status(200).json({ message: 'Authentication successful', user: { name: user.name, email: user.email, userid: user.userid } });
        });
    })(req, res, next);
};

const logout = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(400).send('No user to log out.');
    }

    req.logout((err) => {
        if (err) { 
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user; // Set the authenticated user in the request object
    next();
  });
};


const logoutPage = (req, res) => {
    res.send('logout page');
};

module.exports = {
    initializePassport,
    login,
    logout,
    logoutPage,
    authenticateToken
};
