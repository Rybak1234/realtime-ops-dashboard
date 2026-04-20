import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Incident from "@/models/Incident";

export const dynamic = "force-dynamic";

const SLA_TARGETS: Record<string, { responseHours: number; resolveHours: number }> = {
  critical: { responseHours: 1, resolveHours: 4 },
  high: { responseHours: 4, resolveHours: 24 },
  medium: { responseHours: 8, resolveHours: 48 },
  low: { responseHours: 24, resolveHours: 72 },
};

export async function GET() {
  await dbConnect();
  const incidents = await Incident.find().lean();

  const resolvedIncidents = incidents.filter((i) => i.resolvedAt);
  const breaches: Record<string, unknown>[] = [];
  let totalMet = 0;
  let totalChecked = 0;

  const bySeverity: Record<string, { count: number; avgResolutionH: number; breachCount: number; metSLA: number }> = {};

  for (const sev of ["critical", "high", "medium", "low"]) {
    const sevIncidents = resolvedIncidents.filter((i) => i.severity === sev);
    const target = SLA_TARGETS[sev];
    let totalResH = 0;
    let sevBreaches = 0;
    let sevMet = 0;

    for (const inc of sevIncidents) {
      const resolutionMs = new Date(inc.resolvedAt!).getTime() - new Date(inc.createdAt).getTime();
      const resolutionH = resolutionMs / (1000 * 60 * 60);
      totalResH += resolutionH;

      if (resolutionH <= target.resolveHours) {
        sevMet++;
        totalMet++;
      } else {
        sevBreaches++;
        breaches.push({
          _id: inc._id,
          title: inc.title,
          severity: inc.severity,
          area: inc.area,
          targetHours: target.resolveHours,
          actualHours: Math.round(resolutionH * 10) / 10,
          createdAt: inc.createdAt,
          resolvedAt: inc.resolvedAt,
        });
      }
      totalChecked++;
    }

    bySeverity[sev] = {
      count: sevIncidents.length,
      avgResolutionH: sevIncidents.length > 0 ? Math.round((totalResH / sevIncidents.length) * 10) / 10 : 0,
      breachCount: sevBreaches,
      metSLA: sevMet,
    };
  }

  const compliancePercent = totalChecked > 0 ? Math.round((totalMet / totalChecked) * 1000) / 10 : 100;

  // Response time compliance (simulated - based on resolution data)
  const avgResponseH = resolvedIncidents.length > 0
    ? resolvedIncidents.reduce((sum, i) => {
        // Simulate response time as 20% of resolution time
        const resMs = new Date(i.resolvedAt!).getTime() - new Date(i.createdAt).getTime();
        return sum + (resMs * 0.2) / (1000 * 60 * 60);
      }, 0) / resolvedIncidents.length
    : 0;

  return NextResponse.json({
    compliancePercent,
    totalChecked,
    totalMet,
    totalBreaches: totalChecked - totalMet,
    avgResponseHours: Math.round(avgResponseH * 10) / 10,
    bySeverity,
    breaches: breaches.slice(0, 20),
    targets: SLA_TARGETS,
  });
}
