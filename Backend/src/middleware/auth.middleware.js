import { verifyAccessToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Access denied. No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 'Access denied. Invalid token format', 401);
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      email: decoded.email,
      role: decoded.role || 'admin'
    };
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};
