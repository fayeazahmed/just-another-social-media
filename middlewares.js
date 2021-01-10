const notFound = (req, res, next) => {
  const error = new Error("path not found: " + req.originalUrl);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.log(error);
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "cake" : error.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
