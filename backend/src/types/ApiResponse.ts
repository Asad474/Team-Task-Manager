import { httpStatusCode } from "../constants/httpStatusCode.constants";

export interface ApiResponse {
  success: boolean;
  statusCode: httpStatusCode;
  message: string;
  data?: unknown;
}