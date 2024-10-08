/* eslint-disable no-unused-vars */
const express = require('express');

const { AppError, errorHandler } = require('../utils/requestHandlers/errorHandler');

module.exports = (app) => {
  const router = express.Router();

  router.use('/user', require('./v1/user'));
  router.use('/notify', require('./v1/notify'));

  app.use('/', require('./v1/config'));
  app.use('/api/v1', router);

  // Handle Errors
  app.use((req, res) => {
    throw new AppError(404, 'URL Not Found');
  });
  app.use((err, req, res, next) => {
    errorHandler(err, res);
  });
};
