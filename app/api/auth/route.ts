import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const PASSWORD = process.env.ADMIN_PASSWORD ?? "salman2024";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "authenticated", {
    httpOnly: true,
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ ok: true });
}
