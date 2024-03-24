const passport = require('passport');
const { User } = require('../models');

// Signup form rendering
exports.renderSignupForm = (req, res) => {
  res.render('signup');
};

// Signup form submission
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await User.register({ username }, password);
    req.login(newUser, err => {
      if (err) return next(err);
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.render('signup', { error: err.message });
  }
};

// Login form rendering
exports.renderLoginForm = (req, res) => {
  res.render('login');
};

// Login form submission
exports.login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
});

// Logout
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
