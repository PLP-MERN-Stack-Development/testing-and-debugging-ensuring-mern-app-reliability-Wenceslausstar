const { validateContactForm } = require('../../src/utils/validation');

describe('Validation', () => {
  describe('validateContactForm', () => {
    it('should return valid if all fields are provided', () => {
      const result = validateContactForm('Test Name', 'test@example.com', 'Test message');
      expect(result.valid).toBe(true);
    });

    it('should return invalid if name is missing', () => {
      const result = validateContactForm('', 'test@example.com', 'Test message');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('All fields are required');
    });

    it('should return invalid if email is missing', () => {
      const result = validateContactForm('Test Name', '', 'Test message');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('All fields are required');
    });

    it('should return invalid if message is missing', () => {
      const result = validateContactForm('Test Name', 'test@example.com', '');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('All fields are required');
    });

    it('should return invalid if email is invalid', () => {
      const result = validateContactForm('Test Name', 'invalid-email', 'Test message');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid email');
    });
  });
});
