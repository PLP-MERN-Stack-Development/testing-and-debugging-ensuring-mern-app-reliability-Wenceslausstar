const validateContactForm = (name, email, message) => {
  if (!name || !email || !message) {
    return { valid: false, message: 'All fields are required' };
  }

  if (!email.includes('@')) {
    return { valid: false, message: 'Invalid email' };
  }

  return { valid: true };
};

module.exports = { validateContactForm };
