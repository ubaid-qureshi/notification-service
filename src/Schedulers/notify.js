const cron = require('node-cron');
const {
  SCHEDULE: {
    EVERY_MINUTE,
  },
} = require('config');
const notify = require('../controller/Notify');

module.exports = async () => {
  const valid = cron.validate(EVERY_MINUTE);
  if (valid) {
    _logger.debug('cron is valid');
    cron.schedule(EVERY_MINUTE, async () => {
      _logger.info('Sending notifications');
      await notify.notifyAllUsers('all');
    });
  }
};
