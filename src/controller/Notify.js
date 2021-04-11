/* eslint-disable class-methods-use-this */
const {
  NOTIFICATION_MODES,
  DEFAULT_MESSAGE,
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

  async notifyAllUsers({ mode, message = DEFAULT_MESSAGE }) {
    try {
      const users = await this.userController.getAllByQuery(
        { isDeleted: false },
        { _id: 0, phoneNumber: 1 },
      );

      const numbers = this.getIdentifiersFromUsers(users, 'phoneNumber');

      if (mode === NOTIFICATION_MODES.SMS) {
        return this.messaging.sendSms(message, numbers);
      } if (mode === NOTIFICATION_MODES.ALL) {
        return this.messaging.sendToAllModes({
          message, numbers,
        });
      }
      throw new AppError(400, 'Please select correct notification  mode');
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

      if (mode === NOTIFICATION_MODES.SMS) {
        this.messaging.sendSms(message, numbers);
      } else if (mode === NOTIFICATION_MODES.ALL) {
        this.messaging.sendToAllModes({
          message, numbers,
        });
      } else {
        throw new AppError(400, 'No Mode Selected');
      }
    } catch (error) {
      throw new AppError(error.code || 400, error.message);
    }
  }
}

module.exports = new Notify();
