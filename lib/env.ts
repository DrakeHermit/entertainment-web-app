import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRATION_TIME: z.string().min(1, "JWT_EXPIRATION_TIME is required"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  ${String(i.path.join("."))}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Missing or invalid environment variables:\n${formatted}`
    );
  }
  return {
    JWT_SECRET: result.data.JWT_SECRET,
    JWT_EXPIRATION_TIME: parseInt(result.data.JWT_EXPIRATION_TIME, 10),
    CLOUDINARY_CLOUD_NAME: result.data.CLOUDINARY_CLOUD_NAME,
  };
}

export const env = validateEnv();
