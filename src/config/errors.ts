const Errors = {
  ValidationDataError: 'ValidationDataError',
  InvalidQuerySource: 'InvalidQuerySource',
  RecordAlreadyExists: 'RecordAlreadyExists',
  InvalidTokenOrEntryNotFound: 'InvalidTokenOrEntryNotFound',
  InvalidDeleteTokenOrNotFound: 'InvalidDeleteTokenOrNotFound',
};

export const ErrorDictionary = {
  InvalidQuerySource: {
    message: 'Must provide query Source. Received: undefined',
    statusCode: 422,
  },
  InvalidDeleteTokenOrNotFound: {
    message: 'Invalid delete token or not found record!',
    statusCode: 422,
  },
  InvalidTokenOrEntryNotFound: {
    message: 'Invalid token or entry not found!',
    statusCode: 422,
  },
};

export default Errors;
