const request = require('supertest');
const app = require('../app');

describe('Expense API', () => {
  it('should return all expenses', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid expense creation', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({}); // missing required fields
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});