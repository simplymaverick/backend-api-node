const request = require('supertest');
const app = require('../app');

describe('Truck API', () => {
  it('should return all trucks', async () => {
    const res = await request(app).get('/api/trucks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid truck creation', async () => {
    const res = await request(app)
      .post('/api/trucks')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});