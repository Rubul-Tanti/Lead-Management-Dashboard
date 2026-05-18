import jwt from "jsonwebtoken";
import { env } from "../config/config.env";

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId },
    env.JWT_ACCESS_SECRET as string,
    {
      expiresIn:'15m',
    }
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET as string,
    {
      expiresIn:'30d',
    }
  );
};