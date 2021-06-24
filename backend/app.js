const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieSession  = require('cookie-session');
const cookieparser = require ('cookie-parser')
const Keygrip = require('keygrip');
require('dotenv').config()

const usersRoutes = require('./routes/users');
const publicationsRoutes = require('./routes/publications');
const commentsRoutes = require('./routes/comments');

const app = express();

app.use((req, res, next) => { // Headers pour accéder à notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Content-Security-Policy', 'script-src', 'self');
  next();
});

app.use(helmet());
app.use(express.json());
app.use(cookieparser());

const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
app.use(cookieSession({
  name: 'session',
  keys: new Keygrip([process.env.COOKIESECRET1, process.env.COOKIESECRET2], 'SHA256', 'base64'),
  cookie: {
    httpOnly: true,
    expires: expiryDate,
    sameSite: 'strict'
  }
}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', usersRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/comments', commentsRoutes);

const db = require("./models");
db.sequelize.sync();

module.exports = app;