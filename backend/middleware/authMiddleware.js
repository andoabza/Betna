import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { console } from 'inspector';

const authMiddleware = async (req, res, next) => {
  try {
    const tokenPart = req.headers.authorization?.split(' ')[1];
    // Remove surrounding quotes if present
    const token = tokenPart ? tokenPart.replace(/^["']|["']$/g, '') : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization required'
      });
    }
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(JSON.stringify(decoded));
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Authentication error:', error);
    let message = 'Invalid or expired token';
    if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {
      message = 'Token expired';
    }
    res.status(401).json({
      success: false,
      message
    });
  }
};

export default authMiddleware;