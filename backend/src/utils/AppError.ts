export class AppError extends Error {
  statusCode: number;
  success: boolean;

  constructor(statusCode: number, message: string, success: boolean = false) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  }
}