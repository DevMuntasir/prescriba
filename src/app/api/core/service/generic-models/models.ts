export interface ApiBaseResponse {
  message?: string;
  status?: string;
  status_code: number;
  is_success: boolean;
}

export interface Response<T> extends ApiBaseResponse {
  results: T;
}
