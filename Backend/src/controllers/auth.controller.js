import { authenticateUser } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const { user, token } = await authenticateUser(email, password);
    return sendSuccess(res, { user, token }, 'Login successful', 200);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return sendError(res, error.message || 'Authentication failed', statusCode);
  }
};

export const logout = async (req, res, next) => {
  return sendSuccess(res, null, 'Logged out successfully', 200);
};

export const getMe = async (req, res, next) => {
  if (!req.user) {
    return sendError(res, 'Unauthorized access', 401);
  }
  return sendSuccess(res, { user: req.user }, 'Authenticated user retrieved', 200);
};
