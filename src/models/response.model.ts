export interface SuccessResponse {
  status: string;
  code: number;
  message: string;
  data: object | Array<any> | any;
  request?: {
    url: string;
    method: string;
  };
}

export interface ErrorResponse {
  status: string;
  code: number;
  message: string;
  error: object | Array<any> | any;
  errorName: string;
  request?: {
    url: string;
    method: string;
  };
}
