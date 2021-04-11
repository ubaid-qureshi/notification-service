/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */
const {
  NOTIFICATION_MODES: {
    SMS, ALL,
  },
  DEFAULT_MESSAGE,
  DEFAULT_RETRY,
} = require('config');
const { AppError } = require('../utils/requestHandlers/errorHandler');

class Notify {
  constructor() {
    this.userController = require('./User');
    this.messaging = require('./Messaging');
  }

  getIdentifiersFromUsers(users, identifier) {
    return users.reduce((acc, user) => {
      acc.push(user[identifier]);
      return acc;
    }, []);
  }

  async notify(mode, message, numbers, retryLimit = DEFAULT_RETRY) {
    let attemptCount = 0;
    while (true) {
      attemptCount += 1;
      if (attemptCount >= retryLimit) throw new AppError(400, 'Max retries limit reached');
      let response;
      if (mode === SMS) {
        response = await this.messaging.sendSms(message, numbers);
      } else if (mode === ALL) {
        response = await this.messaging.sendToAllModes({
          message, numbers,
        });
      } else {
        throw new AppError(400, 'Please select correct notification  mode');
      }
      return response;
    }
  }

  async notifyAllUsers({ mode, message = DEFAULT_MESSAGE }) {
    try {
      const users = await this.userController.getAllByQuery(
        { isDeleted: false },
        { _id: 0, phoneNumber: 1 },
      );
      const numbers = this.getIdentifiersFromUsers(users, 'phoneNumber');
      return this.notify(mode, message, numbers);
    } catch (error) {
      throw new AppError(error.code || 400, error.message);
    }
  }

  async notifyUsers({ emails, mode, message = DEFAULT_MESSAGE }) {
    try {
      const users = await this.userController.getAllByQuery(
        {
          isDeleted: false,
          email: {
            $in: emails,
          },
        },
        { _id: 0, phoneNumber: 1 },
      );

      if (!users.length) throw new AppError(400, 'users doesn\'t exist');
      const numbers = this.getIdentifiersFromUsers(users, 'phoneNumber');
      return this.notify(mode, message, numbers);
    } catch (error) {
      throw new AppError(error.code || 400, error.message);
    }
  }
}

module.exports = new Notify();
