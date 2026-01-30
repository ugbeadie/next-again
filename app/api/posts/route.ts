import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Post from "../../../lib/models/post";
import { Types } from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch posts", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }
    await connectDB();
    const newPost = await Post.create({ title, content });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create post", details: error.message },
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
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true },
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update post", details: error.message },
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
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete post", details: error.message },
      { status: 500 },
    );
  }
}
