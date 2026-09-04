const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};

module.exports = { errorHandler };
