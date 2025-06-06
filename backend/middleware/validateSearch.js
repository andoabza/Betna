export const validateSearch = (req, res, next) => {
  const { minPrice, maxPrice, rooms, houseType } = req.query;
  const errors = {};

  if (minPrice && isNaN(minPrice)) {
    errors.minPrice = 'Minimum price must be a number';
  }

  if (maxPrice && isNaN(maxPrice)) {
    errors.maxPrice = 'Maximum price must be a number';
  }

  if (rooms && (isNaN(rooms))) {
    errors.rooms = 'Number of rooms must be a positive integer';
  }

  if (houseType && !['all', 'apartment', 'house', 'villa'].includes(houseType)) {
    errors.houseType = 'Type must be one of: apartment, house, villa';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};