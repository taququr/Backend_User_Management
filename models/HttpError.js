class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // add message property from Error model
    this.code = errorCode; // add code property
  }
}

module.exports = HttpError;
