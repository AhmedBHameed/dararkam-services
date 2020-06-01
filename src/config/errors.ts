const Errors = {
  ValidationDataError: 'ValidationDataError',
  InvalidQuerySource: 'InvalidQuerySource',
};

export const ErrorDictionary = {
  ValidationDataError: {
    message: 'Data did not match validation schema!',
    statusCode: 400,
  },
  InvalidQuerySource: {
    message: 'Must provide query Source. Received: undefined',
    statusCode: 422,
  },
};

export default Errors;
