import crypto from 'crypto';

export function randomToken(len = 32) {
  return crypto.randomBytes(len).toString('hex');
}

export function generateOtp6(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}
