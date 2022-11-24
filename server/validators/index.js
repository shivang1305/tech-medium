const { validationResult } = require("express-validator");

// this is a middleware function and each middleware function has 3 components to handle i.e. request, response and a callback function.
exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  next(); // `next()` is the callback function which is executed after the errors are thrown and application will continue, It will not come to halt
};
