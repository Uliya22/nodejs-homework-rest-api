function tryCatchWrapper(enpointFn) {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

class RequestError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}
class WrongParametersError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class RepetParametersError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

class NotverificatiomEmail extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
  }
}

module.exports = {
  RequestError,
  WrongParametersError,
  RepetParametersError,
  Unauthorized,
  NotverificatiomEmail,
  tryCatchWrapper,
};
