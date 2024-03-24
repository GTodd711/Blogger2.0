const { User } = require('../models');

// View user profile
exports.viewProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.render('profile', { user });
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    await User.update({ username }, { where: { id: req.user.id } });
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.render('profile', { error: err.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.user.id } });
    req.logout();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/profile');
  }
};
