"use server";

import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { getUserId } from "@/lib/auth/checkSessionValid";
import { ActionState } from "@/lib/types/types";
import {
  updatePasswordSchema,
  flattenFieldErrors,
} from "@/lib/validations/auth";

export async function updatePassword(
  formData: FormData
): Promise<ActionState> {
  const userId = await getUserId();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = updatePasswordSchema.safeParse(raw);

  if (!result.success) {
    return {
      error: "Validation failed",
      fieldErrors: flattenFieldErrors(result.error),
    };
  }

  const { currentPassword, newPassword } = result.data;

  const user = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]) {
    return { error: "User not found" };
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user[0].password);
  if (!passwordMatch) {
    return {
      error: "Validation failed",
      fieldErrors: { currentPassword: "Current password is incorrect" },
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { error: null, success: true };
  } catch {
    return { error: "Failed to update password" };
  }
}
