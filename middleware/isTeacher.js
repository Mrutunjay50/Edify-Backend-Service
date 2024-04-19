const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const dotenv = require('dotenv')

dotenv.config();
// Middleware function to authenticate the user using JWT
const isTeacher = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    console.log(authHeader)
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1]; // Get the token from the request header

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
      // Verify the token
      jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            // console.log(err)
          return res.status(401).json({ message: 'Invalid token.' });
        }
        const user = await Teacher.findById(decoded.userId);
        if (!user) {
        return res.status(401).json({ message: 'User not found.' });
        // Attach the authenticated user to the request object
        req.user = user;
        }
        next();
      });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
  
};

module.exports = isTeacher;