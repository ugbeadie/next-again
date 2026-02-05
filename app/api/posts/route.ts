import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/lib/models/post";
import { Types } from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find().sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("GET /posts error:", error);

    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const post = await Post.create({
      title,
      content,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("POST /posts error:", error);

    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, content } = await req.json();

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
    }

    await connectDB();

    const updated = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /posts error:", error);

    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
    }

    await connectDB();

    const deleted = await Post.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /posts error:", error);

    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
