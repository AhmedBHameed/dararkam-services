import {ValidationError, ValidationResult} from '@hapi/joi';

export interface ValidationDataResult<T> {
  error?: ValidationError;
  errors?: ValidationError;
  warning?: ValidationError;
  value: T;
}

function checkValidationData(data: ValidationResult): Error | undefined {
  if (typeof data === 'object' && !data.value) {
    return new Error(
      'Invalid validation result! data did not pass through validation schema! It might be a risky operation!'
    );
  }
  return undefined;
}

export default checkValidationData;
