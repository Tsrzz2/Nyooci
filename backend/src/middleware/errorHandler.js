const errorHandler = (err, req, res, next) => {
  console.error('--- API Error ---');
  console.error('Path:', req.path);
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: messages
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} sudah digunakan`
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID tidak valid'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error'
  });
};

module.exports = errorHandler;
