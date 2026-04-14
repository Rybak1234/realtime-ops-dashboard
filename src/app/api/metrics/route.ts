import { NextResponse } from "next/server";
import { findAll } from "@/lib/store";

export async function GET() {
  const incidents = findAll();

  const total = incidents.length;
  const open = incidents.filter((i) => i.status === "open").length;
  const inProgress = incidents.filter((i) => i.status === "in_progress").length;
  const resolved = incidents.filter((i) => i.status === "resolved" || i.status === "closed").length;

  // By severity
  const bySeverity = {
    critical: incidents.filter((i) => i.severity === "critical").length,
    high: incidents.filter((i) => i.severity === "high").length,
    medium: incidents.filter((i) => i.severity === "medium").length,
    low: incidents.filter((i) => i.severity === "low").length,
  };

  // By area
  const areas = [...new Set(incidents.map((i) => i.area))];
  const byArea = areas.map((area) => ({
    area,
    total: incidents.filter((i) => i.area === area).length,
    open: incidents.filter((i) => i.area === area && i.status === "open").length,
  }));

  // By day (last 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().slice(0, 10);
    const dayIncidents = incidents.filter(
      (inc) => new Date(inc.createdAt).toISOString().slice(0, 10) === dayStr
    );
    last7Days.push({
      date: dayStr,
      label: date.toLocaleDateString("es", { weekday: "short", day: "numeric" }),
      count: dayIncidents.length,
    });
  }

  // Average resolution time (for resolved incidents with resolvedAt)
  const resolvedWithTime = incidents.filter((i) => i.resolvedAt);
  const avgResolutionHours =
    resolvedWithTime.length > 0
      ? resolvedWithTime.reduce((sum, i) => {
          const diff = new Date(i.resolvedAt!).getTime() - new Date(i.createdAt).getTime();
          return sum + diff / (1000 * 60 * 60);
        }, 0) / resolvedWithTime.length
      : 0;

  return NextResponse.json({
    total,
    open,
    inProgress,
    resolved,
    bySeverity,
    byArea,
    last7Days,
    avgResolutionHours: Math.round(avgResolutionHours * 10) / 10,
  });
}
