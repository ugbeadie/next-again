import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/lib/models/post";
import { Types } from "mongoose";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const payload = verifyToken(token);
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = await getUserId();

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const posts = await Post.find({ userId }).sort({ createdAt: -1 });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const userId = await getUserId();

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content } = await req.json();

  await connectDB();

  const post = await Post.create({
    title,
    content,
    userId,
  });

  return NextResponse.json(post, { status: 201 });
}

export async function PUT(req: Request) {
  const userId = await getUserId();

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, content } = await req.json();

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await connectDB();

  const post = await Post.findOneAndUpdate(
    { _id: id, userId },
    { title, content },
    { new: true },
  );

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function DELETE(req: Request) {
  const userId = await getUserId();

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  await connectDB();

  const deleted = await Post.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!deleted)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
