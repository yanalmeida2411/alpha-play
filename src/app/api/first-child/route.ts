import { getChildren } from "@/src/actions/profileAction";
import { NextResponse } from "next/server";

export async function GET() {
  const children = await getChildren();
  if (children && children.length > 0 && children[0]?._id) {
    return NextResponse.json({ childId: children[0]._id });
  }
  return NextResponse.json({ childId: null });
}