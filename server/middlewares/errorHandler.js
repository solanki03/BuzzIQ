module.exports = (err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
};
