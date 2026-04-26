"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createUser, verifyPassword } from "@/lib/db/users";
import { setSession, clearSession } from "@/lib/auth/server";

export type AuthState = { error?: string } | undefined;

const SignupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/\d/, "Include at least one number")
    .regex(/[A-Za-z]/, "Include at least one letter"),
});

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function signupAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  let createdId: string;
  let createdEmail: string;
  try {
    const user = await createUser(parsed.data);
    createdId = user._id.toString();
    createdEmail = user.email;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create account";
    return { error: message };
  }

  await setSession(createdId, createdEmail);
  redirect("/workspace");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await verifyPassword(parsed.data.email, parsed.data.password);
  if (!user) {
    return { error: "Email or password is incorrect." };
  }

  await setSession(user._id.toString(), user.email);
  redirect("/workspace");
}

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
