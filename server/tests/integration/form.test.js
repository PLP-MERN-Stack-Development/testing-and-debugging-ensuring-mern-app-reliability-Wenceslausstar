const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/contact', () => {
  it('should return a 200 status code and a success message for a valid form submission', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test User', email: 'test@example.com', message: 'This is a test message' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Form submitted successfully');
  });

  it('should return a 400 status code and an error message if a field is missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test User', email: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('All fields are required');
  });

  it('should return a 400 status code and an error message for an invalid email', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test User', email: 'invalid-email', message: 'This is a test message' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid email');
  });
});
