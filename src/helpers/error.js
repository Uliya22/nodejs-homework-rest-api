function tryCatchWrapper(enpointFn) {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

class WrongParametersError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
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

module.exports = {
  WrongParametersError,
  NotAuthorizedError,
  RepetParametersError,
  Unauthorized,
    tryCatchWrapper
};