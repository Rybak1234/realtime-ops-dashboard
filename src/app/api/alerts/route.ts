import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Alert from "@/models/Alert";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  const alerts = await Alert.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(alerts);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const alert = await Alert.create({
    name: body.name,
    condition: {
      metric: body.condition?.metric || "",
      operator: body.condition?.operator || ">",
      threshold: body.condition?.threshold ?? 0,
    },
    severity: body.severity || "medium",
    enabled: body.enabled !== false,
  });

  return NextResponse.json(alert, { status: 201 });
}
