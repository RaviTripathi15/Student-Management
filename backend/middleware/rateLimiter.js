// In-memory rate limiter with zero external dependency requirements
const requests = new Map();

const apiLimiter = (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 300;

  if (!requests.has(ip)) {
    requests.set(ip, []);
  }

  const timestamps = requests.get(ip).filter(time => now - time < windowMs);
  timestamps.push(now);
  requests.set(ip, timestamps);

  if (timestamps.length > max) {
    return res.status(429).json({ message: 'Too many requests from this IP, please try again later' });
  }

  next();
};

const authLimiter = (req, res, next) => {
  next();
};

module.exports = { apiLimiter, authLimiter };
