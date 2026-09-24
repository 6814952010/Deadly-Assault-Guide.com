const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const ensureAdminAccount = async () => {
  const admins = [
    ['ADMIN_NAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'],
    ['ADMIN_2_NAME', 'ADMIN_2_EMAIL', 'ADMIN_2_PASSWORD']
  ];

  for (const [nameKey, emailKey, passwordKey] of admins) {
    const name = process.env[nameKey];
    const emailValue = process.env[emailKey];
    const password = process.env[passwordKey];
    if (!name || !emailValue || !password) continue;

    const email = emailValue.trim().toLowerCase();
    const passwordHash = bcrypt.hashSync(password, 10);
    await User.findOneAndUpdate(
      { email },
      { $set: { name: name.trim(), passwordHash, role: 'admin' }, $setOnInsert: { email } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Admin account ready: ${email}`);
  }
};

module.exports = ensureAdminAccount;
