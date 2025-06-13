const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid user creation', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({}); // missing required fields
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});