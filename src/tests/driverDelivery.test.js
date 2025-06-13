const request = require('supertest');
const app = require('../app');

describe('Driver Delivery API', () => {
  it('should return all driver deliveries', async () => {
    const res = await request(app).get('/api/driver-deliveries');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid driver delivery creation', async () => {
    const res = await request(app)
      .post('/api/driver-deliveries')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});