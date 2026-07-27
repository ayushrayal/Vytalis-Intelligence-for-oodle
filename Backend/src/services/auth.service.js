import bcrypt from 'bcryptjs';
import { envConfig } from '../config/env.config.js';
import { generateAccessToken } from '../utils/jwt.js';

export const authenticateUser = async (email, password) => {
  const { adminEmail, adminPasswordHash } = envConfig;

  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const user = { email: adminEmail, role: 'admin' };
  const token = generateAccessToken(user);

  return { user, token };
};

export const verifyTokenPayload = (payload) => {
  if (!payload || !payload.email) {
    return null;
  }
  return { email: payload.email, role: payload.role || 'admin' };
};
