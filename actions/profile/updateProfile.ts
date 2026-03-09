"use server";

import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { getUserId } from "@/lib/auth/checkSessionValid";
import { ActionState } from "@/lib/types/types";
import {
  updateAccountSchema,
  flattenFieldErrors,
} from "@/lib/validations/auth";

export async function updateAccountDetails(
  formData: FormData
): Promise<ActionState> {
  const userId = await getUserId();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const raw = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
  };

  const result = updateAccountSchema.safeParse(raw);

  if (!result.success) {
    return {
      error: "Validation failed",
      fieldErrors: flattenFieldErrors(result.error),
    };
  }

  const { email, username } = result.data;

  const emailTaken = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), ne(users.id, userId)))
    .limit(1);

  if (emailTaken.length > 0) {
    return {
      error: "Validation failed",
      fieldErrors: { email: "This email is already in use" },
    };
  }

  try {
    await db
      .update(users)
      .set({
        email,
        username: username || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { error: null, success: true };
  } catch {
    return { error: "Failed to update account details" };
  }
}
