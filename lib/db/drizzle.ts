import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";

let _db: NeonHttpDatabase | undefined;

function getDb(): NeonHttpDatabase {
  if (!_db) {
    _db = drizzle(process.env.DATABASE_URL!);
  }
  return _db;
}

export const db = new Proxy({} as NeonHttpDatabase, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
