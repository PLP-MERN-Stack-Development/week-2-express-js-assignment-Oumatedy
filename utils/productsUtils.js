const Joi = require('joi');

// 1. Validation logic
exports.validateProductInput = (data, isUpdate = false) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    category: Joi.string().min(2).max(255).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().max(1000).optional().allow(''),
    inStock: Joi.boolean().optional()
  });

  return schema.validate(data, { abortEarly: false });
};


// 1. Validation logic
exports.validateProductUpdateInput = (data, isUpdate = false) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    category: Joi.string().min(2).max(255).optional(),
    price: Joi.number().min(0).optional(),
    description: Joi.string().max(1000).optional().allow(''),
    inStock: Joi.boolean().optional()
  });

  return schema.validate(data, { abortEarly: false });
};

// 2. Filter, search, and pagination
exports.buildQueryFilters = (query) => {
  const { name, category, inStock, search, page = 1, limit = 10 } = query;

  const filter = {};
  if (category) filter.category = category;
  if (name) filter.name = name;
  if (inStock !== undefined) filter.inStock = inStock === 'true';

  const searchQuery = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const pagination = {
    page: parseInt(page),
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
  };

  return { filter, search: searchQuery, pagination };
};
