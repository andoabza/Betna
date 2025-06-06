import { registerUser, loginUser, showUser } from '../controllers/userController.js';
import authenticateUser from '../middleware/authMiddleware.js';
import express from 'express';
import { validateUser } from '../middleware/validationMiddleware.js';

const router = express.Router();

//router.use(authenticateUser);

// Register a new user
router.post('/register', validateUser, registerUser, authenticateUser);
// Login a user
router.post('/login', loginUser, authenticateUser);

router.get('/:id', showUser)

export default router;