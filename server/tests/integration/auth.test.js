const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/login', () => {
  it('should return a 200 status code and a "Login successful" message for valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
  });

  it('should return a 401 status code and an "Invalid credentials" message for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
