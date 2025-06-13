import { GlobalExceptionFilter } from '../../../src/infrastructure/filters/http-exception.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

const mockArgumentsHost = {
  switchToHttp: jest.fn().mockReturnThis(),
  getRequest: jest.fn(),
  getResponse: jest.fn(),
};

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRequest = {
      url: '/test-path',
    };

    mockResponse = {
      status: mockStatus,
    };

    mockArgumentsHost.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest as Request),
      getResponse: jest.fn().mockReturnValue(mockResponse as Response),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Test error message', HttpStatus.BAD_REQUEST);
    const expectedStatus = HttpStatus.BAD_REQUEST;
    const expectedMessage = 'Test error message';

    filter.catch(exception, mockArgumentsHost as unknown as ArgumentsHost);

    expect(mockArgumentsHost.switchToHttp).toHaveBeenCalledTimes(1);
    expect(mockArgumentsHost.switchToHttp().getRequest).toHaveBeenCalledTimes(1);
    expect(mockArgumentsHost.switchToHttp().getResponse).toHaveBeenCalledTimes(1);

    expect(mockStatus).toHaveBeenCalledWith(expectedStatus);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: expectedStatus,
      path: mockRequest.url,
      message: expectedMessage,
    });
  });

  it('should handle HttpException with object response correctly', () => {
    const errorResponseObject = { message: 'Detailed error', code: 'ERR_VALIDATION' };
    const exception = new HttpException(errorResponseObject, HttpStatus.UNPROCESSABLE_ENTITY);
    const expectedStatus = HttpStatus.UNPROCESSABLE_ENTITY;

    filter.catch(exception, mockArgumentsHost as unknown as ArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(expectedStatus);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: expectedStatus,
      path: mockRequest.url,
      message: errorResponseObject,
    });
  });

  it('should handle non-HttpException errors as INTERNAL_SERVER_ERROR', () => {
    const exception = new Error('Some generic error');
    const expectedStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const expectedMessage = 'Internal server error';

    filter.catch(exception, mockArgumentsHost as unknown as ArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(expectedStatus);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: expectedStatus,
      path: mockRequest.url,
      message: expectedMessage,
    });
  });

  it('should handle unknown non-HttpException (e.g., string) as INTERNAL_SERVER_ERROR', () => {
    const exception = 'Just a string error';
    const expectedStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const expectedMessage = 'Internal server error';

    filter.catch(exception, mockArgumentsHost as unknown as ArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(expectedStatus);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: expectedStatus,
      path: mockRequest.url,
      message: expectedMessage,
    });
  });
});