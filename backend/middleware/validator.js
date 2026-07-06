const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .trim(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage('Password must contain at least one uppercase, one lowercase, and one number'),
  body('role')
    .isIn(['admin', 'teacher', 'student'])
    .withMessage('Invalid role')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const studentValidation = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim(),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Please provide a valid phone number (10-15 digits)'),
  body('rollNumber')
    .notEmpty()
    .withMessage('Roll number is required')
    .trim()
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  studentValidation
};
