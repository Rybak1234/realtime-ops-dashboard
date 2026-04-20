import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") || "unknown";
  const { allowed, resetIn } = checkRateLimit(`login:${ip}`, 5, 60000);
  if (!allowed) {
    const seconds = Math.ceil(resetIn / 1000);
    return NextResponse.json(
      { error: `Demasiados intentos. Intente de nuevo en ${seconds} segundos.` },
      { status: 429 }
    );
  }

  await dbConnect();
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
  const user = await User.findOne({ email });
  if (!user || !user.active) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  const token = signToken({ id: user._id.toString(), email: user.email, name: user.name, role: user.role });
  const res = NextResponse.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  res.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60, path: "/" });
  return res;
}
