import { ObjectId, type Collection } from "mongodb";
import { getDb } from "./mongo";
import type { BillFacts, Finding } from "@/lib/audit/schema";

export type AuditStatus = "active" | "drafting" | "resolved";

export type AuditDoc = {
  _id: ObjectId;
  userId: ObjectId;
  auditId: string; // human-readable RCS-XXXXX
  facts: BillFacts;
  findings: Finding[];
  letterBody: string;
  status: AuditStatus;
  recoverableAmount: number;
  totalBalance: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicAudit = {
  id: string;
  auditId: string;
  provider: string;
  facility?: string;
  dateOfService: string;
  totalBalance: number;
  recoverableAmount: number;
  status: AuditStatus;
  findingsCount: number;
  citations: string[];
  createdAt: string;
};

async function audits(): Promise<Collection<AuditDoc>> {
  const db = await getDb();
  const col = db.collection<AuditDoc>("audits");
  await col.createIndex({ userId: 1, createdAt: -1 });
  await col.createIndex({ auditId: 1 }, { unique: true });
  return col;
}

export function toPublicAudit(doc: AuditDoc): PublicAudit {
  return {
    id: doc._id.toString(),
    auditId: doc.auditId,
    provider: doc.facts.provider.name,
    facility: doc.facts.provider.facility,
    dateOfService: doc.facts.dateOfService,
    totalBalance: doc.totalBalance,
    recoverableAmount: doc.recoverableAmount,
    status: doc.status,
    findingsCount: doc.findings.length,
    citations: doc.findings.map((f) => f.statuteCode),
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function saveAudit(input: {
  userId: string;
  auditId: string;
  facts: BillFacts;
  findings: Finding[];
  letterBody: string;
  status?: AuditStatus;
}): Promise<AuditDoc> {
  if (!ObjectId.isValid(input.userId)) {
    throw new Error("Invalid userId");
  }
  const col = await audits();
  const now = new Date();
  const recoverable = input.findings.reduce(
    (sum, f) => sum + f.recoverableAmount,
    0
  );
  const doc: AuditDoc = {
    _id: new ObjectId(),
    userId: new ObjectId(input.userId),
    auditId: input.auditId,
    facts: input.facts,
    findings: input.findings,
    letterBody: input.letterBody,
    status:
      input.status ??
      (input.findings.length === 0 ? "resolved" : "drafting"),
    recoverableAmount: recoverable,
    totalBalance: input.facts.totalBalance,
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne(doc);
  return doc;
}

export async function listAuditsForUser(
  userId: string,
  opts: { status?: AuditStatus; limit?: number } = {}
): Promise<PublicAudit[]> {
  if (!ObjectId.isValid(userId)) return [];
  const col = await audits();
  const filter: Record<string, unknown> = { userId: new ObjectId(userId) };
  if (opts.status) filter.status = opts.status;
  const docs = await col
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(opts.limit ?? 50)
    .toArray();
  return docs.map(toPublicAudit);
}

export async function auditStatsForUser(userId: string): Promise<{
  totalAudits: number;
  activeCount: number;
  draftingCount: number;
  resolvedCount: number;
  totalRecoverable: number;
  totalRecovered: number;
}> {
  const empty = {
    totalAudits: 0,
    activeCount: 0,
    draftingCount: 0,
    resolvedCount: 0,
    totalRecoverable: 0,
    totalRecovered: 0,
  };
  if (!ObjectId.isValid(userId)) return empty;
  const col = await audits();
  const docs = await col
    .find({ userId: new ObjectId(userId) })
    .toArray();
  const stats = { ...empty, totalAudits: docs.length };
  for (const d of docs) {
    if (d.status === "active") stats.activeCount++;
    else if (d.status === "drafting") stats.draftingCount++;
    else if (d.status === "resolved") {
      stats.resolvedCount++;
      stats.totalRecovered += d.recoverableAmount;
    }
    if (d.status !== "resolved") stats.totalRecoverable += d.recoverableAmount;
  }
  return stats;
}
