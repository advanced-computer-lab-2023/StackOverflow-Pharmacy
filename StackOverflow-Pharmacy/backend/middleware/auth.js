const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const  secretKey  = process.env.SECRET_KEY; // Ensure you have the correct environment variable name

const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        console.log('Received JWT token:', token);

        if (!token) {
            console.log('No token provided; Unauthorized');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        console.log('Decoded token:', decoded);

        if (!decoded || !decoded.name) {
            console.log('Invalid token');
            return res.status(401).json({ error: 'Invalid token' });
        }

        const { name } = decoded;

        console.log('User name from token:', name);

        // You should find the user based on their name
        const user = await User.findOne({ username: name });

        console.log('User found:', user);

        if (!user) {
            console.log('User not found for name:', name);
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user;
        console.log('User authenticated:', user);

        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

  

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
  
    if (token) {
      jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {
          console.log('Invalid token:', err.message);
          res.status(401).redirect('/login'); // Redirect to the login page or handle it as needed
        } else {
          // Token is valid, attach user information to the request
          req.user = decodedToken;
          next();
        }
      });
    } else {
      // No token found
      return res.status(401).redirect('/login'); // Redirect to the login page or handle it as needed
    }
  };
  

module.exports = { isLoggedIn, requireAuth };
