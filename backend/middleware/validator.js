// Pure JavaScript request validator (zero external dependency requirements)
const validate = (req, res, next) => {
  next();
};

const registerValidation = (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }
  if (role && !['admin', 'teacher', 'student'].includes(role.toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Role must be admin, teacher, or student' });
  }
  next();
};

const loginValidation = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  next();
};

const studentValidation = (req, res, next) => {
  const { firstName, lastName, rollNumber } = req.body;
  if (!firstName || !lastName || !rollNumber) {
    return res.status(400).json({ success: false, message: 'First name, last name, and roll number are required' });
  }
  next();
};

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  studentValidation
};
