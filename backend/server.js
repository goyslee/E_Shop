//server.js
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const pool = require('./config/dbConfig');
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml'); 
const fs = require('fs');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authController = require('./controllers/authController');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ debug: true })
}
const app = express();

const port = process.env.PORT;
const swaggerDocument = YAML.load(fs.readFileSync('./swagger.yaml', 'utf8'));



app.use(session({
    store: new pgSession({
        pool : pool,                // Connection pool
        tableName : 'session'       // Use this table to store sessions
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  next();
});

// app.use(cors({
//   origin: [`${process.env.REACT_APP_FRONTEND_URL}`, `${process.env.REACT_APP_BACKEND_URL}` `${process.env.LOCALHOST}`, 'https://merchant-ui-api.stripe.com/elements/wallet-config','*'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin",
    `${process.env.REACT_APP_FRONTEND_URL}`,
    `${process.env.REACT_APP_BACKEND_URL}`,
    `${process.env.LOCALHOST}`,
    'https://merchant-ui-api.stripe.com/elements/wallet-config');
  res.header("Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  )
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  next()
})


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
authController.initializePassport(passport);

app.use(authRoutes);
app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(checkoutRoutes);
app.use(orderRoutes);

app.get('/', (req, res) => {
  res.send('Hello, this is the E-commerce API!');
});

app.get('/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: { name: req.user.name } });
    } else {
        res.json({ isAuthenticated: false });
    }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  if (req.user && req.user.address) {
    res.redirect(`${process.env.REACT_APP_FRONTEND_URL}/products`);
  } else {
    res.redirect(`${process.env.REACT_APP_FRONTEND_URL}/profilecompletion/${req.user.userid}`);
  }
});

app.get('/profilecompletion', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Profile Completion</title>
        <!-- Add your head content here -->
      </head>
      <body>
        <div id="root"></div>
        <!-- Include your client-side scripts here -->
        <!-- <script src="/server-bundle.js"></script> -->
        <!-- <script src="/client-bundle.js"></script> -->
        <script>
          // JavaScript code to render the ProfileCompletion component on the client-side
          // This code should be included in your client-side scripts
          // Example:
           const rootElement = document.getElementById('root');
           ReactDOM.render(<ProfileCompletion />, rootElement);
        </script>
      </body>
    </html>
  `;

  res.status(200).send(html);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/update-user-details', (req, res) => {
  const { userid, address, phonenumber } = req.body;
  
  // Update user details in the database
  pool.query(
    'UPDATE Users SET address = $1, phonenumber = $2 WHERE userid = $3',
    [address, phonenumber, userid],
    (error, results) => {
      if (error) {
        res.status(500).send('Error updating user details');
      } else {
        res.status(200).send('User details updated successfully');
      }
    }
  );
});



// Facebook OAuth routes
// app.get('/auth/facebook', passport.authenticate('facebook'));
// app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
//     res.redirect('/'); // Redirect after successful authentication
// });

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
