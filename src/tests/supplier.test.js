const request = require('supertest');
const app = require('../app');

describe('Supplier API', () => {
  it('should return all suppliers', async () => {
    const res = await request(app).get('/api/suppliers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid supplier creation', async () => {
    const res = await request(app)
      .post('/api/suppliers')
      .send({}); // missing required fields
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});