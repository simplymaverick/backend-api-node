const request = require('supertest');
const app = require('../app');

describe('Customer Price List API', () => {
  it('should return all customer price lists', async () => {
    const res = await request(app).get('/api/customer-price-lists');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid customer price list creation', async () => {
    const res = await request(app)
      .post('/api/customer-price-lists')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});