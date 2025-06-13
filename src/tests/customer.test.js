const request = require('supertest');
const app = require('../app');

describe('Customer API', () => {
  it('should return all customers', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid customer creation', async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({}); // missing required fields
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});