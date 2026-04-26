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

export type DashboardData = {
  totalAudits: number;
  thisMonthRecovered: number;
  lastMonthRecovered: number;
  monthDelta: number; // percentage change vs last month
  byStatute: { code: string; count: number; percent: number }[];
  mostFlagged: { code: string; count: number; percent: number }[];
  recentAudit: {
    provider: string;
    filedISO: string;
    auditId: string;
    status: AuditStatus;
  } | null;
  topFacility: {
    name: string;
    thisMonth: number;
    lastMonth: number;
  } | null;
  weeklyTrend: number[]; // 7 daily totals (Sun..Sat)
};

function ymOf(d: Date): { year: number; month: number } {
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}

function sameYM(
  a: { year: number; month: number },
  b: { year: number; month: number }
) {
  return a.year === b.year && a.month === b.month;
}

function lastNDaysSums(docs: AuditDoc[], days: number): number[] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const out = new Array(days).fill(0);
  for (const d of docs) {
    const created = new Date(d.createdAt);
    created.setUTCHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays >= 0 && diffDays < days) {
      out[days - 1 - diffDays] += d.recoverableAmount;
    }
  }
  return out;
}

export async function statuteHitsForUser(
  userId: string
): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  if (!ObjectId.isValid(userId)) return out;
  const col = await audits();
  const docs = await col.find({ userId: new ObjectId(userId) }).toArray();
  for (const d of docs) {
    for (const f of d.findings) {
      out[f.statuteCode] = (out[f.statuteCode] ?? 0) + 1;
    }
  }
  return out;
}

export async function dashboardDataForUser(
  userId: string
): Promise<DashboardData> {
  const empty: DashboardData = {
    totalAudits: 0,
    thisMonthRecovered: 0,
    lastMonthRecovered: 0,
    monthDelta: 0,
    byStatute: [],
    mostFlagged: [],
    recentAudit: null,
    topFacility: null,
    weeklyTrend: [0, 0, 0, 0, 0, 0, 0],
  };
  if (!ObjectId.isValid(userId)) return empty;
  const col = await audits();
  const docs = await col
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
  if (docs.length === 0) return empty;

  const now = new Date();
  const thisYM = ymOf(now);
  const lastYMDate = new Date(now);
  lastYMDate.setUTCMonth(lastYMDate.getUTCMonth() - 1);
  const lastYM = ymOf(lastYMDate);

  let thisMonthRecovered = 0;
  let lastMonthRecovered = 0;

  // Statute & facility tallies
  const statuteCounts: Record<string, number> = {};
  const facilityThisMonth: Record<string, number> = {};
  const facilityLastMonth: Record<string, number> = {};

  for (const d of docs) {
    const dYM = ymOf(new Date(d.createdAt));
    const facility = d.facts.provider.facility ?? d.facts.provider.name;
    if (sameYM(dYM, thisYM)) {
      thisMonthRecovered += d.recoverableAmount;
      facilityThisMonth[facility] =
        (facilityThisMonth[facility] ?? 0) + d.recoverableAmount;
    } else if (sameYM(dYM, lastYM)) {
      lastMonthRecovered += d.recoverableAmount;
      facilityLastMonth[facility] =
        (facilityLastMonth[facility] ?? 0) + d.recoverableAmount;
    }
    for (const f of d.findings) {
      statuteCounts[f.statuteCode] = (statuteCounts[f.statuteCode] ?? 0) + 1;
    }
  }

  const totalFindings = Object.values(statuteCounts).reduce(
    (s, n) => s + n,
    0
  );

  const byStatute = Object.entries(statuteCounts)
    .map(([code, count]) => ({
      code,
      count,
      percent:
        totalFindings === 0 ? 0 : Math.round((count / totalFindings) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const monthDelta =
    lastMonthRecovered === 0
      ? thisMonthRecovered > 0
        ? 100
        : 0
      : Math.round(
          ((thisMonthRecovered - lastMonthRecovered) / lastMonthRecovered) *
            100
        );

  // Top facility — pick the largest this-month or fallback to last-month
  const allFacilities = new Set([
    ...Object.keys(facilityThisMonth),
    ...Object.keys(facilityLastMonth),
  ]);
  let topName: string | null = null;
  let topThis = 0;
  for (const f of allFacilities) {
    const t = facilityThisMonth[f] ?? 0;
    const l = facilityLastMonth[f] ?? 0;
    if (t + l > topThis) {
      topThis = t + l;
      topName = f;
    }
  }

  const recent = docs[0];

  return {
    totalAudits: docs.length,
    thisMonthRecovered,
    lastMonthRecovered,
    monthDelta,
    byStatute,
    mostFlagged: byStatute.slice(0, 2),
    recentAudit: {
      provider: recent.facts.provider.name,
      filedISO: new Date(recent.createdAt).toISOString(),
      auditId: recent.auditId,
      status: recent.status,
    },
    topFacility: topName
      ? {
          name: topName,
          thisMonth: facilityThisMonth[topName] ?? 0,
          lastMonth: facilityLastMonth[topName] ?? 0,
        }
      : null,
    weeklyTrend: lastNDaysSums(docs, 7),
  };
}
