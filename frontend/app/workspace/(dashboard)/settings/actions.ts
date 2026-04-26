"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/server";
import { updateUserPassword, updateUserProfile } from "@/lib/db/users";

export type SettingsState =
  | { ok: true; message: string }
  | { ok: false; error: string }
  | undefined;

const ProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().max(40).optional(),
  mailingAddress: z.string().trim().max(240).optional(),
});

const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(/\d/, "New password must include a number")
    .regex(/[A-Za-z]/, "New password must include a letter"),
});

export async function updateProfileAction(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "You must be signed in." };

  const parsed = ProfileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") ?? undefined,
    mailingAddress: formData.get("mailingAddress") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await updateUserProfile(me.id, parsed.data);
  revalidatePath("/workspace");
  revalidatePath("/workspace/settings");
  return { ok: true, message: "Profile updated." };
}

export async function changePasswordAction(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "You must be signed in." };

  const parsed = PasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await updateUserPassword(
    me.id,
    parsed.data.currentPassword,
    parsed.data.newPassword
  );
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, message: "Password changed." };
}
