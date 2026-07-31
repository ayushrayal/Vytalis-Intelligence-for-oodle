export const envConfig = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  oodleApiKey: process.env.OODLE_API_KEY || '',
  oodleBaseUrl: process.env.OODLE_BASE_URL || '',
  frontendUrl: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173'),
  windsorApiKey: process.env.WINDSOR_API_KEY,
  windsorMetaAccountId: process.env.WINDSOR_META_ACCOUNT_ID,
  windsorConnector: process.env.WINDSOR_CONNECTOR,
};
