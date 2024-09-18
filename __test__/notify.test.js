require('../src/utils/logger/logConfig.js');
require('../src/utils/requestHandlers/responseHandler');
require('../src/utils/db/mongo')();
require('dotenv').config();
const mongoose = require('mongoose');

const user = require('../src/controller/User');
const notify = require('../src/controller/Notify');
const messaging = require('../src/controller/Messaging');

jest.mock('../src/controller/Messaging');

describe('Test suit for user', () => {
  beforeAll(async () => {
    await user.create({
      email: 'u.qureshi006@gmail.com',
      firstName: 'Ubaid',
      lastName: 'Qureshi',
      phoneNumber: '1234567890',
      city: 'mumbai',
      country: 'india',
    });
  });

  it('Notify should pass', async () => {
    messaging.sendToAllModes.mockResolvedValue({
      status: 'sent',
    });
    const response = await notify.notify(
      'all',
      'this is message',
      ['123456789'],
    );

    expect(response).toMatchSnapshot();
  });

  it('Notify should fail', async () => {
    try {
      messaging.sendToAllModes.mockResolvedValue({
        status: 'sent',
      });
      await notify.notify(
        undefined,
        'this is message',
        ['123456789'],
      );
    } catch (error) {
      expect(error.message).toBe('Please select correct notification mode');
    }
  });

  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });
});
