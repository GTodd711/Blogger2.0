const express = require('express');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/db');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('./models');

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', require('express-handlebars')({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Session setup
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

sessionStore.sync(); // Sync session store with Sequelize models

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
