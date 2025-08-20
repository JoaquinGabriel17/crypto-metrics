export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`No encontrado - ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Error de servidor',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
