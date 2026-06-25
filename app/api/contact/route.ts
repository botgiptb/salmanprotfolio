import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY ?? "984fae79-60da-409e-938d-10d2637bf65d";

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        subject: `[Portfolio Contact] ${subject} from ${name}`,
        message,
        from_name: "Salman Studio Portfolio",
      }),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json(
        { error: data.message || "Failed to transmit message." },
        { status: response.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
