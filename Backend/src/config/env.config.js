export const envConfig = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  oodleApiKey: process.env.OODLE_API_KEY || '',
  oodleBaseUrl: process.env.OODLE_BASE_URL || ''
};
