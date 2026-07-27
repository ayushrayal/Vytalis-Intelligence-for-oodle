import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config.js';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, envConfig.jwtSecret, { expiresIn: '24h' });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, envConfig.jwtSecret);
};

export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;
