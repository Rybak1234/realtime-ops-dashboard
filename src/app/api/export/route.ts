import { NextResponse } from "next/server";
import { findAll } from "@/lib/store";

export async function GET() {
  const incidents = findAll();

  const severityLabel: Record<string, string> = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
    critical: "Crítica",
  };

  const statusLabel: Record<string, string> = {
    open: "Abierta",
    in_progress: "En progreso",
    resolved: "Resuelta",
    closed: "Cerrada",
  };

  const header = "ID,Título,Área,Severidad,Estado,Asignado,Creada,Resuelta\n";
  const rows = incidents
    .map((i) =>
      [
        i._id,
        `"${(i.title || "").replace(/"/g, '""')}"`,
        i.area,
        severityLabel[i.severity] || i.severity,
        statusLabel[i.status] || i.status,
        i.assignedTo || "—",
        new Date(i.createdAt).toLocaleString("es"),
        i.resolvedAt ? new Date(i.resolvedAt).toLocaleString("es") : "—",
      ].join(",")
    )
    .join("\n");

  const csv = header + rows;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=incidencias-${new Date().toISOString().slice(0, 10)}.csv`,
    },
  });
}
