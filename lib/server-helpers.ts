import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getUserId = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token?.value) return null;
     
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_TOKEN!);
    return decoded as { userId: string };
  } catch (error) {
    return null;
  }
}
