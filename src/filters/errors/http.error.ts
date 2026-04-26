import { HttpStatus } from '@nestjs/common';

export class HttpError extends Error {
  statusCode: HttpStatus;
  message: string;
  constructor(statusCode: HttpStatus, message = '') {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
  getMessage() {
    return this.message;
  }
  getStatus() {
    return this.statusCode;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not found error') {
    super(HttpStatus.NOT_FOUND, message);
  }
}

export class ValidationError extends HttpError {
  constructor(message = 'Validation error') {
    super(HttpStatus.BAD_REQUEST, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized error') {
    super(HttpStatus.UNAUTHORIZED, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden error') {
    super(HttpStatus.FORBIDDEN, message);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = 'UnprocessableEntity error') {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message);
  }
}
