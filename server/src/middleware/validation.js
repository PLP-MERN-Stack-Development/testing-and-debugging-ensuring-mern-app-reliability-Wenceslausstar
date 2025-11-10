const validateContactForm = (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  next();
};

module.exports = { validateContactForm };
