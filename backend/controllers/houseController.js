import House from "../models/House.js";
import cloudinary from "cloudinary";
import Category from "../models/Category.js";
import { logError, logSuccess, logWarning } from '../lib/logger.js';
import slugify from 'slugify';
import User from "../models/User.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createHouse = async (req, res) => {
  try {
    const { title, description, address, price, houseType, numberOfRooms, image } = req.body;
    const userId = req.user.id;

    // Validation
    const requiredFields = ['title', 'description', 'address', 'price', 'houseType', 'image'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Find or create category
    let category = await Category.findOne({ name: houseType });
    if (!category) {
      category = await Category.create({ name: houseType });
      logSuccess(`New category created: ${category._id}`);
    }

    // Create slug
    const slug = slugify(title, { lower: true, strict: true });

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create house with image from multiple upload
    const house = await House.create({
      title,
      description,
      address,
      price: Number(price),
      houseType,
      numberOfRooms: Number(numberOfRooms),
      slug,
      image,
      user: userId,
      categoryId: category._id,
    });

    logSuccess(`House created: ${house._id}`);
    res.status(201).json({
      success: true,
      data: await house.populate('user', 'name email')
    });

  } catch (error) {
    logError(`Create House Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Failed to create house listing'
    });
  }
};

export const uploadHouseImages = (req, res) => {
  try {
    if (!req.cloudinaryResults) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    res.status(200).json({
      success: true,
      results: req.cloudinaryResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Image upload failed'
    });
  }
};

// Get all House posts
export const getAllHouses = async (req, res) => {
  try {
    const houses = await House.find()
      .populate("user", "name email")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: houses.length,
      data: houses
    });
    logWarning(`Fetched ${houses.length} houses`);

  } catch (error) {
    logError(`Get All Houses Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch house listings'
    });
  }
};

// Get a single House post by slug
export const getHouseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const house = await House.findOne({ slug })
      .populate("user", "name email")
      .populate("categoryId", "name");

    if (!house) {
      logWarning(`House not found: ${slug}`);
      return res.status(404).json({
        success: false,
        message: "House listing not found"
      });
    }

    res.status(200).json({
      success: true,
      data: house
    });
    logWarning(`Fetched house: ${house._id}`);

  } catch (error) {
    logError(`Get House By Slug Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch house listing'
    });
  }
};

// Get Houses by category ID
export const getHousesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const houses = await House.find({ categoryId })
      .populate("user", "name email")
      .populate("categoryId", "name");

    if (houses.length === 0) {
      logWarning(`No houses found for category: ${categoryId}`);
      return res.status(404).json({
        success: false,
        message: "No houses found in this category"
      });
    }

    res.status(200).json({
      success: true,
      count: houses.length,
      data: houses
    });
    logWarning(`Fetched ${houses.length} houses for category ${categoryId}`);

  } catch (error) {
    logError(`Get Houses By Category Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch houses by category'
    });
  }
};

// Update a House post
export const updateHouse = async (req, res) => {
  try {
    const { houseId } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    // Find house
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found"
      });
    }

    // Check ownership
    if (house.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this listing"
      });
    }

    // Handle image update
    if (req.file) {
      // Delete old image
      await cloudinary.v2.uploader.destroy(house.image.public_id);

      // Upload new image
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "Houses",
        width: 500,
        crop: "scale",
      });

      updates.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // Update slug if title changes
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    const updatedHouse = await House.findByIdAndUpdate(
      houseId,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    logSuccess(`House updated: ${updatedHouse._id}`);
    res.status(200).json({
      success: true,
      data: updatedHouse
    });

  } catch (error) {
    logError(`Update House Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update house listing'
    });
  }
};

// Delete a House post
export const deleteHouse = async (req, res) => {
  try {
    const { houseId } = req.params;
    const userId = req.user.id;

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found"
      });
    }

    // Check ownership
    if (house.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this listing"
      });
    }

    // Delete image from Cloudinary
    await cloudinary.v2.uploader.destroy(house.image.public_id);

    await House.findByIdAndDelete(houseId);

    logSuccess(`House deleted: ${houseId}`);
    res.status(200).json({
      success: true,
      message: "House listing deleted successfully"
    });

  } catch (error) {
    logError(`Delete House Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete house listing'
    });
  }
};

// @desc    Search and filter houses
// @route   GET /api/houses/search
// @access  Public
export const searchHouses = async (req, res) => {
  try {
    const { 
      keyword, 
      minPrice, 
      maxPrice, 
      rooms, 
      houseType, 
      sort,  // Default to frontend's sort option
      page = 1,
      limit = 12
    } = req.query;
    
  const query = {
    price: { $gte: minPrice, $lte: maxPrice },
    numberOfRooms: { $gte: rooms },
    rented: false, // Only show available houses
  };

  // Keyword search
  if (keyword.trim()) {
    const regex = { $regex: keyword.trim(), $options: 'i' };
    query.$or = [
      { title: regex },
      { description: regex },
      { address: regex }
    ];
  }

  // House type filter
  if (houseType !== 'all') {
    query.houseType = houseType;
  }
   

    // Execute query
    const result = await House.searchHouses(query, sort, page, limit);
    res.status(200).json({
      success: true,
      data: result.data,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalHouses: result.total
    });

  } catch (error) {
    logError(`Search Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || 'Search failed'
    });
  }
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  logError(`Middleware Error: ${err.message}`);
  console.error(err.stack);
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error'
  });
};