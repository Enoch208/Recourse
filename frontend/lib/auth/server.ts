import { cookies } from "next/headers";
import { findUserById, toPublicUser, type PublicUser } from "@/lib/db/users";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  signSession,
  verifySession,
} from "./session";

export async function getCurrentUser(): Promise<PublicUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySession(token);
  if (!payload) return null;
  const doc = await findUserById(payload.userId);
  if (!doc) return null;
  return toPublicUser(doc);
}

export async function setSession(userId: string, email: string): Promise<void> {
  const token = await signSession({ userId, email });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
