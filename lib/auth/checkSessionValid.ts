import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function checkSessionValid() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token?.value) {
      return null;
    }
    try {
      const decoded = jwt.verify(token.value, process.env.JWT_TOKEN!);
      return decoded;
    } catch (error) {
      console.error(error);
      return null;
    }
}

export async function getSessionUser() {
    const decoded = await checkSessionValid();
    if (!decoded) {
        return null;
    }
    return decoded as { userId: string };
}