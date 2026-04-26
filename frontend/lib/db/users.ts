import { ObjectId, type Collection } from "mongodb";
import bcrypt from "bcryptjs";
import { getDb } from "./mongo";

export type UserDoc = {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  mailingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  mailingAddress?: string;
  createdAt: string;
};

const BCRYPT_COST = 10;

async function users(): Promise<Collection<UserDoc>> {
  const db = await getDb();
  const col = db.collection<UserDoc>("users");
  await col.createIndex({ email: 1 }, { unique: true });
  return col;
}

export function toPublicUser(doc: UserDoc): PublicUser {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    phone: doc.phone,
    mailingAddress: doc.mailingAddress,
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<UserDoc | null> {
  const col = await users();
  return col.findOne({ email: email.toLowerCase().trim() });
}

export async function findUserById(id: string): Promise<UserDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await users();
  return col.findOne({ _id: new ObjectId(id) });
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<UserDoc> {
  const col = await users();
  const email = input.email.toLowerCase().trim();
  const existing = await col.findOne({ email });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);
  const now = new Date();
  const doc: UserDoc = {
    _id: new ObjectId(),
    email,
    passwordHash,
    name: input.name.trim(),
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne(doc);
  return doc;
}

export async function verifyPassword(
  email: string,
  password: string
): Promise<UserDoc | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function updateUserProfile(
  id: string,
  patch: { name?: string; phone?: string; mailingAddress?: string }
): Promise<UserDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await users();
  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.name !== undefined) update.name = patch.name.trim();
  if (patch.phone !== undefined) update.phone = patch.phone.trim();
  if (patch.mailingAddress !== undefined)
    update.mailingAddress = patch.mailingAddress.trim();
  await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
  return col.findOne({ _id: new ObjectId(id) });
}

export async function updateUserPassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await findUserById(id);
  if (!user) return { ok: false, error: "Account not found." };
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return { ok: false, error: "Current password is incorrect." };
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST);
  const col = await users();
  await col.updateOne(
    { _id: user._id },
    { $set: { passwordHash, updatedAt: new Date() } }
  );
  return { ok: true };
}
