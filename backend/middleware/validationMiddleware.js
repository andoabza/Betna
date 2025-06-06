// validationMiddleware.js
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import House from '../models/House.js';
import User from '../models/User.js';

// Middleware to validate house data
const validateHouse = [
    body('title').notEmpty().withMessage('Title is required'),
    body('discription').notEmpty().withMessage('Content is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('houseType').notEmpty().withMessage('House type is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('numberOfRooms').notEmpty().withMessage('Number of rooms is required'),
    body('categoryId').notEmpty().withMessage('CategoryId is required'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
];

const validateUser = [
    body('name').notEmpty().withMessage('Title is required'),
    body('email').notEmpty().withMessage('Content is required'),
    body('phoneNumber').notEmpty().withMessage('Category is required'),
    body('password').notEmpty().withMessage('password is required'),
];


// Middleware to check for validation errors
const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
// Middleware to check if user exists
const checkUserExists = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    next();
});
// Middleware to check if category exists
const checkCategoryExists = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }
    req.category = category;
    next();
});
// Middleware to check if user is author of the house
const checkUserIsAuthor = asyncHandler(async (req, res, next) => {
    const house = await House.findById(req.params.id);
    if (house.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User is not the author of this house' });
    }
    next();
});


export {
    validateHouse,
    validateUser,
    checkValidationErrors,
    checkUserExists,
    checkCategoryExists,
    checkUserIsAuthor,
};