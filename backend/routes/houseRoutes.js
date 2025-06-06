import express from 'express';
import {
  createHouse,
  getAllHouses,
  getHouseBySlug,
  getHousesByCategoryId,
  updateHouse,
  deleteHouse,
  searchHouses,
  uploadHouseImages,
  errorHandler
} from '../controllers/houseController.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';
import { validateSearch } from '../middleware/validateSearch.js';

const router = express.Router();

// Image Upload Endpoint
router.post(
  '/multiple',
  authMiddleware,
  uploadMultiple,
  uploadHouseImages
);

// Create House (Authenticated)
router.post(
  '/',
  authMiddleware,
  createHouse
);

// Get All Houses
router.get('/', getAllHouses);

// Search Houses
router.get('/search', validateSearch, searchHouses);

router.get('/search:slug', validateSearch, searchHouses);


// Get Single House by Slug
router.get('/:slug', getHouseBySlug);

// Get Houses by Category
router.get('/category/:categoryId', validateObjectId, getHousesByCategoryId);

// Update House (Authenticated)
router.put(
  '/:houseId',
  authMiddleware,
  validateObjectId,
  updateHouse
);

// Delete House (Authenticated)
router.delete(
  '/:houseId',
  authMiddleware,
  validateObjectId,
  deleteHouse
);

// Error Handling Middleware
router.use(errorHandler);

export default router;