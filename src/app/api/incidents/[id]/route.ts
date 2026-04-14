import { NextRequest, NextResponse } from "next/server";
import { findById, update, remove } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const incident = findById(params.id);
  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(incident);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();

  const incident = update(params.id, {
    title: body.title,
    description: body.description,
    area: body.area,
    severity: body.severity,
    status: body.status,
    assignedTo: body.assignedTo,
  });

  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(incident);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const deleted = remove(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
