import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || '',

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '150m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:5000',
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:3000',

  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '',

  sessionSecret: process.env.SESSION_SECRET || ''
};

export function assertEnv() {
  const required: Array<[string, string]> = [
    ['MONGODB_URI', env.mongoUri],
    ['JWT_ACCESS_SECRET', env.jwtAccessSecret],
    ['JWT_REFRESH_SECRET', env.jwtRefreshSecret],
    ['SESSION_SECRET', env.sessionSecret]
  ];

  const missing = required.filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) throw new Error(`Missing required env vars: ${missing.join(', ')}`);
}
