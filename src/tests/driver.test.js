const request = require('supertest');
const app = require('../app');

describe('Driver API', () => {
  it('should return all drivers', async () => {
    const res = await request(app).get('/api/drivers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid driver creation', async () => {
    const res = await request(app)
      .post('/api/drivers')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});