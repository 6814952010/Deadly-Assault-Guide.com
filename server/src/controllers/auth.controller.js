const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user.model');

const createToken = user => {
  const payload = Buffer.from(JSON.stringify({ sub: user._id.toString(), role: user.role, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', process.env.AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ $or: [{ email: email.toLowerCase().trim() }, { name: name.trim() }] });
    if (existing) return res.status(409).json({ message: 'Username or email already registered' });
    console.log('Register request body:', { name, email })
    const hash = bcrypt.hashSync(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });
    const out = { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
    res.status(201).json(out);
  } catch (error) {
    console.error('Register error:', error && (error.stack || error.message || error))
    if (error && error.code === 11000) {
      return res.status(409).json({ message: 'Username or email already registered' });
    }
    // return more detail in dev for easier debugging
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;
    const loginIdentifier = (identifier || email || '').trim();
    const escapedIdentifier = loginIdentifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = loginIdentifier && await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { name: { $regex: `^${escapedIdentifier}$`, $options: 'i' } }
      ]
    });
    if (!user || !password || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }
    res.json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
