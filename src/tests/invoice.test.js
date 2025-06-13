const request = require('supertest');
const app = require('../app');

describe('Invoice API', () => {
  it('should return all invoices', async () => {
    const res = await request(app).get('/api/invoices');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid invoice creation', async () => {
    const res = await request(app)
      .post('/api/invoices')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});