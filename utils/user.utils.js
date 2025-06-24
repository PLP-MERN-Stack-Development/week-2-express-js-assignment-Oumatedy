const Joi = require('joi');

exports.validateRegister = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data, { abortEarly: false });
};

exports.validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

exports.validatePasswordChange = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  });

  return schema.validate(data, { abortEarly: false });
};
