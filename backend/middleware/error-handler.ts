import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (
    err: any, // Accepts any error type (or you can create a custom type)
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Internal Server Error',
    };

    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors)
            .map((item: any) => item.message)
            .join(', ');
        customError.statusCode = 400;
    }

    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        customError.statusCode = 400;
    }

    if (err.name === 'CastError') {
        customError.message = `No item found with id: ${err.value}`;
        customError.statusCode = 404;
    }

    res.status(customError.statusCode).json({ message: customError.message });
};

export default errorHandlerMiddleware;
