const crypto = require('crypto');
const User = require('../models/user.model');

const verifyToken = token => {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = crypto.createHmac('sha256', process.env.AUTH_SECRET).update(payload).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  return data.exp > Date.now() ? data : null;
};

const requireAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const data = verifyToken(token);
    if (!data || data.role !== 'admin') return res.status(401).json({ message: 'Admin authentication required' });
    const user = await User.findById(data.sub).select('_id name email role');
    if (!user || user.role !== 'admin') return res.status(401).json({ message: 'Admin authentication required' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};

module.exports = { requireAdmin };