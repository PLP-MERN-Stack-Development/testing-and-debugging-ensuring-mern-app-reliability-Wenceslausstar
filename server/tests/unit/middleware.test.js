const { validateContactForm } = require('../../src/middleware/validation');

describe('Middleware', () => {
  describe('validateContactForm', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = {
        body: {
          name: 'Test Name',
          email: 'test@example.com',
          message: 'Test message',
        },
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it('should call next() if all fields are provided', () => {
      validateContactForm(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if name is missing', () => {
      req.body.name = '';
      validateContactForm(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if email is missing', () => {
      req.body.email = '';
      validateContactForm(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if message is missing', () => {
      req.body.message = '';
      validateContactForm(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if email is invalid', () => {
      req.body.email = 'invalid-email';
      validateContactForm(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
