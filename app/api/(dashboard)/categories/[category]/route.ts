import { NextResponse } from "next/server";
import connect from "../../../../../lib/db";
import Category from "../../../../../lib/models/category";
import User from "../../../../../lib/models/users";
import { Types } from "mongoose";

export const GET = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.categoryId; // get categoryId from request
  try {
    const body = await request.json();
    const { title } = body;

    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userId" }), {
        status: 400,
      });
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid categoryId" }),
        {
          status: 400,
        }
      );
    }
    await connect();
  } catch (error: any) {
    return new NextResponse("Error fetching category" + error.message, {
      status: 500,
    });
  }
};
