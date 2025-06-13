const request = require('supertest');
const app = require('../app');

describe('GRV API', () => {
  it('should return all GRVs', async () => {
    const res = await request(app).get('/api/grvs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid GRV creation', async () => {
    const res = await request(app)
      .post('/api/grvs')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});