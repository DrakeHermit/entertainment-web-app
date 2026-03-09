import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRATION_TIME: z.string().min(1, "JWT_EXPIRATION_TIME is required"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
});

type Env = {
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: number;
  CLOUDINARY_CLOUD_NAME: string;
};

let _env: Env | undefined;

function getEnv(): Env {
  if (!_env) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      const formatted = result.error.issues
        .map((i) => `  ${String(i.path.join("."))}: ${i.message}`)
        .join("\n");
      throw new Error(
        `Missing or invalid environment variables:\n${formatted}`
      );
    }
    _env = {
      JWT_SECRET: result.data.JWT_SECRET,
      JWT_EXPIRATION_TIME: parseInt(result.data.JWT_EXPIRATION_TIME, 10),
      CLOUDINARY_CLOUD_NAME: result.data.CLOUDINARY_CLOUD_NAME,
    };
  }
  return _env;
}

export const env = new Proxy({} as Env, {
  get(_target, prop) {
    return Reflect.get(getEnv(), prop);
  },
});
