const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('../config/dbConfig'); // Adjust the path as needed

const initializePassport = (passport) => {
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const res = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
                if (res.rows.length === 0) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

                const user = res.rows[0];
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.userid);
    });

    passport.deserializeUser((userid, done) => {
        pool.query('SELECT * FROM Users WHERE userid = $1', [userid], (err, results) => {
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
    return res.status(200).json({ message: 'Authentication successful', user: { name: user.name, email: user.email } });
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




const logoutPage = (req, res) => {
    res.send('logout page')
}

module.exports = {
    initializePassport,
    login,
    logout,
    logoutPage
};
