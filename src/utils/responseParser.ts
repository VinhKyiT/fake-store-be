import { ErrorResponse, SuccessResponse } from '@models/response.model';

function responseParser(response): SuccessResponse | ErrorResponse {
  if (response.errorMessage) {
    return {
      status: 'error',
      code: response.errorCode ?? 400,
      errorName: response.errorName ?? '',
      message: response.errorMessage,
      data: null,
    };
  }
  return {
    status: 'success',
    code: 200,
    message: 'Success',
    data: response,
  };
}

export default responseParser;
