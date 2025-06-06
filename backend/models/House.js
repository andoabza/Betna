import slugify from "slugify";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import User from "./User.js";
import Category from "./Category.js";

const houseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    unique: true,
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  houseType: {
    type: String,
    required: [true, "House type is required"],
  },
  numberOfRooms: {
    type: Number,
    required: [true, "Number of rooms is required"],
    min: [1, "At least 1 room required"]
  },
  rented: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {  // Fixed spelling from 'discription'
    type: String,
    required: [true, "Description is required"],
  },
  image: {
      type: Array,
      required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Slug generation middleware
houseSchema.pre("save", function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g 
    });
  }
  next();
});

// Add to static methods
houseSchema.statics.getAllHouses = async function({ 
  page = 1, 
  limit = 10, 
  sort = '-createdAt', 
  filter = {} 
}) {
  const skip = (page - 1) * limit;
  
  const [houses, total] = await Promise.all([
    this.find(filter)
      .populate("user", "name email")
      .populate("categoryId", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(filter)
  ]);

  return {
    houses,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  };
};

// Static methods
houseSchema.statics = {
  // Get paginated houses
  async getAllHouses({ page = 1, limit = 10, sort = '-createdAt', filter = {} }) {
    const skip = (page - 1) * limit;
    
    const [houses, total] = await Promise.all([
      this.find(filter)
        .populate("user", "name email phoneNumber")
        .populate("categoryId", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.countDocuments(filter)
    ]);

    return {
      houses,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    };
  },

  // Get single house by slug
  async getHouseBySlug(slug) {
    const house = await this.findOne({ slug })
      .populate("user", "name email")
      .populate("categoryId", "name")
      .lean();
      
    if (!house) throw new Error('House not found');
    return house;
  },

  // Update house
  async updateHouse(id, updates, userId) {
    const house = await this.findById(id);
    if (!house) throw new Error('House not found');
    
    // Check ownership
    if (house.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized to update this listing');
    }

    const updatedHouse = await this.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).lean();

    return updatedHouse;
  },

  // Delete house
  async deleteHouse(id, userId) {
    const house = await this.findById(id);
    if (!house) throw new Error('House not found');

    // Check ownership
    if (house.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized to delete this listing');
    }

    // Delete image from Cloudinary
    await cloudinary.v2.uploader.destroy(house.image.public_id);

    await this.deleteOne({ _id: id });
    return house;
  },

  // Get houses by user ID
  async getHousesByUserId(userId) {
    return this.find({ user: userId })
      .populate("categoryId", "name")
      .sort('-createdAt')
      .lean();
  },

  // Get houses by category ID
  async getHousesByCategoryId(categoryId) {
    return this.find({ categoryId })
      .populate("user", "name email")
      .sort('-createdAt')
      .lean();
  },

  // Filtered house search
  async searchHouses(query, sort, page, limit) {
  

  // Sorting logic
  let sortOption = { createdAt: -1 };
  switch (sort) {
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'priceAsc':
      sortOption = { price: 1 };
      break;
    case 'priceDesc':
      sortOption = { price: -1 };
      break;
  }

  const skip = (page - 1) * limit;

  const [houses, total] = await Promise.all([
    this.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query)
  ]);

  return {
    success: true,
    data: houses,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  };
}


};

// Query middleware for automatic population
houseSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  }).populate({
    path: 'categoryId',
    select: 'name'
  });
  next();
});

// Remove image from Cloudinary when house is deleted
houseSchema.pre('remove', async function(next) {
  await cloudinary.v2.uploader.destroy(this.image.public_id);
  next();
});


houseSchema.index({ price: 1 });
houseSchema.index({ numberOfRooms: 1 });
houseSchema.index({ houseType: 1 });
houseSchema.index({ address: 'text', title: 'text', description: 'text' });

const House = mongoose.model("House", houseSchema);
export default House;