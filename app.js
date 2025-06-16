require('dotenv').config();
const cors = require('cors');


const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { setUserLocals } = require('./server/middleware/auth');

const app = express();

// Port configuration
const PORT = process.env.PORT || 3000; // Default to 3000 for local development
console.log('Environment:', process.env.NODE_ENV);
console.log('Configured PORT:', PORT);
console.log('Actual PORT from env:', process.env.PORT);

// Enable CORS with specific options
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup with more options
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
        httpOnly: true
    }
}));

// Make user data available to all views
app.use(setUserLocals);

// templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Test route for EJS
//app.get('/test-ejs', (req, res) => {
   // res.render('pages/test', {
     //   title: 'EJS Test Page',
     //   message: 'If you can see this, EJS is working!',
      ///  currentTime: new Date().toLocaleString(),
    //    path: '/test-ejs'
  //  });
//});

app.use('/', require('./server/routes/main'));
app.use('/auth', require('./server/routes/auth'));
app.use('/join-requests', require('./server/routes/joinRequest'));
app.use('/admin', require('./server/routes/admin'));

// Basic health check route
app.get('/health', (req, res) => {
    try {
        res.status(200).json({ 
            status: 'ok',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV,
            port: PORT,
            session: req.session ? 'active' : 'none'
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test route
app.get('/test', (req, res) => {
    try {
        res.send('Test route working!');
    } catch (error) {
        console.error('Test route error:', error);
        res.status(500).send('Internal server error');
    }
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, '0.0.0.0', () => {
        console.log('=================================');
        console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode`);
        console.log(`App listening on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
        console.log(`Session Secret: ${process.env.SESSION_SECRET ? 'Set' : 'Not set'}`);
        console.log('=================================');
    });
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('pages/error', {
        title: 'Error',
        message: 'An error occurred',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
