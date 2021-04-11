const { AppError } = require('../../utils/requestHandlers/errorHandler');

class SMS {
  constructor(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SERVICE_SID) {
    this.client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    this.SERVICE_SID = SERVICE_SID;
  }

  async sendSms(message, numbers) {
    try {
      const bindings = numbers.map((number) => JSON.stringify({
        binding_type: 'sms',
        address: number,
      }));

      const notificationOpts = {
        toBinding: bindings,
        body: message,
      };

      return await this.client.notify
        .services(this.SERVICE_SID)
        .notifications.create(notificationOpts);
    } catch (error) {
      throw new AppError(
        error.code || 400, error.message,
      );
    }
  }
}

module.exports = SMS;
