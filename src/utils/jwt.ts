import jwt, { type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

function requireJwtSecret(secret: unknown, name: string): Secret {
  if (typeof secret !== "string" || !secret.trim()) {
    throw new Error(`${name} is not set`);
  }
  return secret;
}

function toExpiresIn(value: unknown): SignOptions["expiresIn"] {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    // runtime accepts "15m", "7d", etc. typings are stricter, so we cast
    return value as unknown as SignOptions["expiresIn"];
  }
  return undefined;
}

// example
export function signRefreshToken(payload: object) {
  return jwt.sign(payload, requireJwtSecret(env.jwtRefreshSecret, "JWT_REFRESH_SECRET"), {
    expiresIn: toExpiresIn(env.jwtRefreshExpiresIn),
  });
}

export function signAccessToken(payload: object) {
  return jwt.sign(payload, requireJwtSecret(env.jwtAccessSecret, "JWT_ACCESS_SECRET"), {
    expiresIn: toExpiresIn(env.jwtAccessExpiresIn),
  });
}


export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(
    token,
    requireJwtSecret(env.jwtAccessSecret, "JWT_ACCESS_SECRET")
  );

  if (typeof decoded === "string") {
    throw new Error("Invalid access token payload");
  }

  return decoded;
}

export function verifyRefreshToken(token: string): JwtPayload {
  const decoded = jwt.verify(
    token,
    requireJwtSecret(env.jwtRefreshSecret, "JWT_REFRESH_SECRET")
  );

  if (typeof decoded === "string") {
    throw new Error("Invalid refresh token payload");
  }

  return decoded;
}