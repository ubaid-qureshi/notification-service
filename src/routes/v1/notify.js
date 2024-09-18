const express = require('express');

const router = express.Router();
const notify = require('../../controller/Notify');

router.post('/all',
  async (req, res, next) => {
    notify.notifyAllUsers(req.body)
      .then((response) => {
        _handleResponse({
          res,
          statusCode: 200,
          ...(response && { response }),
        });
      })
      .catch((err) => next(err));
  });
router.post('/',
  async (req, res, next) => {
    notify.notifyUsers(req.body)
      .then((response) => {
        _handleResponse({
          res,
          statusCode: 200,
          ...(response && { response }),
        });
      })
      .catch((err) => next(err));
  });

module.exports = router;
