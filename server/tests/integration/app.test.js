const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/hello', () => {
  it('should return a 200 status code and a "Hello, world!" message', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hello, world!');
  });
});
