const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get login page
exports.getLogin = (req, res) => {
    res.render('pages/login', {
        layout: false,
        error: req.query.error,
        success: req.query.success
    });
};

// Get register page
exports.getRegister = (req, res) => {
    res.render('pages/register', {
        layout: false,
        error: req.query.error,
        success: req.query.success || undefined
    });
};

// Get admin login page
exports.getAdminLogin = (req, res) => {
    res.render('pages/admin-login', {
        layout: false,
        error: req.query.error
    });
};

// Handle login
exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('pages/login', {
                layout: false,
                error: 'Invalid email or password',
                success: undefined
            });
        }

        // Check if user is approved
        if (user.status !== 'accepted') {
            return res.render('pages/login', {
                layout: false,
                error: 'Your account is pending approval. Please wait for admin approval.',
                success: undefined
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('pages/login', {
                layout: false,
                error: 'Invalid email or password',
                success: undefined
            });
        }

        // Set user session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        // Redirect based on role
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.render('pages/login', {
            layout: false,
            error: 'An error occurred during login',
            success: undefined
        });
    }
};

// Handle register
exports.postRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.render('pages/register', {
                layout: false,
                error: 'Email or username already exists',
                success: undefined
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            status: 'pending'
        });

        await user.save();

        res.redirect('/auth/login?success=Registration successful. Please wait for admin approval.');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('pages/register', {
            layout: false,
            error: 'An error occurred during registration',
            success: undefined
        });
    }
};

// Handle admin login
exports.postAdminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin user
        const admin = await User.findOne({ username, role: 'admin' });
        if (!admin) {
            return res.render('pages/admin-login', {
                layout: false,
                error: 'Invalid username or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('pages/admin-login', {
                layout: false,
                error: 'Invalid username or password'
            });
        }

        // Set admin session
        req.session.user = {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role
        };

        res.redirect('/admin');
    } catch (error) {
        console.error('Admin login error:', error);
        res.render('pages/admin-login', {
            layout: false,
            error: 'An error occurred during login'
        });
    }
};

// Handle logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
};

// Middleware: Check if user is logged in
exports.isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

// Middleware: Check if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.session.role === 'admin') {
        return next();
    }
    res.redirect('/auth/admin-login');
}; 