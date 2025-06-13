const request = require('supertest');
const app = require('../app');

describe('Formula API', () => {
  it('should return all formulas', async () => {
    const res = await request(app).get('/api/formulas');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid formula creation', async () => {
    const res = await request(app)
      .post('/api/formulas')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});