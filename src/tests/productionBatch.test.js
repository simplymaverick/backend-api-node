const request = require('supertest');
const app = require('../app');

describe('Production Batch API', () => {
  it('should return all production batches', async () => {
    const res = await request(app).get('/api/production-batches');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid production batch creation', async () => {
    const res = await request(app)
      .post('/api/production-batches')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});