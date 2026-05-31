export interface ApiResponse<T = unknown> {
  code: number;
  status: string;
  entry: string;
  exit: string;
  error: string;
  data: T;
}
