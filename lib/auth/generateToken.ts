import jwt from "jsonwebtoken";
import { env } from "@/lib/env";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRATION_TIME,
  });
};
