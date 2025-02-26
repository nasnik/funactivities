import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors';

interface AuthenticatedRequest extends Request {
    user?: { userId: string; name: string };
}

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; name: string };

        // Attach user info to request object
        req.user = { userId: payload.userId, name: payload.name };
        next();
    } catch (err) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

export default auth;
