const { AppError } = require('../utils/requestHandlers/errorHandler');

class User {
  constructor() {
    this.devDao = require('../model/Dao/User');
  }

  // User Creation
  async create(userData) {
    try {
      return await this.devDao.create(userData);
    } catch (error) {
      throw new AppError(error.code || 400, error.message);
    }
  }

  async updateOne(id, {
    firstName,
    lastName,
    phoneNumber,
    country,
    city,
  }) {
    try {
      const user = await this.getOne(id);
      if (!user) throw new AppError(404, 'User doesn\'t exist');
      _logger.debug('user', user);

      const updateData = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phoneNumber && { phoneNumber }),
        ...(country && { country }),
        ...(city && { city }),
      };
      _logger.debug('updateData', updateData);
      return this.devDao.findOneAndUpdate(id, updateData);
    } catch (error) {
      throw new AppError(
        error.message.statusCode || error.code || 400,
        error.message.description || error.message,
      );
    }
  }

  // Getting Users
  async getOne(id) {
    return this.devDao.getOne(id);
  }

  async getOneByQuery(filter) {
    return this.devDao.getOneByQuery(filter);
  }

  async getAllByQuery() {
    return this.devDao.getAllByQuery({});
  }

  async deleteOne(id) {
    try {
      const updatedData = {
        isDeleted: true,
        deletedAt: new Date(),
      };
      const user = await this.devDao.updateOne(
        id, updatedData,
      );
      if (!user) throw new AppError(404, 'User doesn\'t exist');
      return user;
    } catch (error) {
      throw new AppError(error.code || 400, error.message);
    }
  }
}

module.exports = new User();
