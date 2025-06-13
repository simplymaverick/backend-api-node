const request = require('supertest');
const app = require('../app');

describe('Diesel Log API', () => {
  it('should return all diesel logs', async () => {
    const res = await request(app).get('/api/diesel-logs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid diesel log creation', async () => {
    const res = await request(app)
      .post('/api/diesel-logs')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});