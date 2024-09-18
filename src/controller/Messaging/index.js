const { AppError } = require('../../utils/requestHandlers/errorHandler');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  SERVICE_SID,
} = process.env;

const SMS = require('./SMS');

class Notification {
  constructor() {
    this.userController = require('../User');
    // this.init();
  }

  init() {
    this.sms = new SMS(
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      SERVICE_SID,
    );
  }

  async sendToAllModes({ message, numbers }) {
    // New modes of messaging will come here
    return this.sendSms(message, numbers);
  }

  async sendSms(message, numbers) {
    try {
      return this.sms.sendSms(message, numbers);
    } catch (error) {
      throw new AppError(
        error.code || 400, error.message,
      );
    }
  }
}

module.exports = new Notification();
