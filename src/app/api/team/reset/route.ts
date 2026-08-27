import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const pwd = req.headers.get("x-team-password");
  if (!pwd || pwd !== process.env.TEAM_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const result = await prisma.vote.deleteMany({});

  return NextResponse.json({ success: true, deleted: result.count });
}
