import mongoose from 'mongoose';

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.houseId)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid ID format' 
    });
  }
  next();
};

export default validateObjectId;