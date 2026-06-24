import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const PASSWORD = (process.env.ADMIN_PASSWORD ?? "salman2024").trim();

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password?.trim() !== PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
    sameSite: "lax" as const,
  };

  cookieStore.set("admin_session", "authenticated", cookieOptions);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", "authenticated", cookieOptions);
  return res;
}

export async function GET() {
  const cookieStore = await cookies();
  const authed = cookieStore.get("admin_session")?.value === "authenticated";
  return NextResponse.json({ authed });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");

  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin_session");
  return res;
}
