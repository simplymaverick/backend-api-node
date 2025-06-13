const request = require('supertest');
const app = require('../app');

describe('Ingredient API', () => {
  it('should return all ingredients', async () => {
    const res = await request(app).get('/api/ingredients');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid ingredient creation', async () => {
    const res = await request(app)
      .post('/api/ingredients')
      .send({}); // missing required fields
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});