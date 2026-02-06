import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/lib/models/users";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = verifyToken(token);
    await connectDB();
    const user = await User.findById(payload.userId).select("email");

    if (!user)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
