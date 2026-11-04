import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

// Segunda senha, só para apagar votos. Fica guardado só o hash (SHA-256),
// pra a senha em si não aparecer no código público.
const RESET_PASSWORD_HASH = "d7211b77b53e8a3e99522c23ee3eca7eea9ce8868af9a15a5fc724bedc6cd6ae";

export async function POST(req: NextRequest) {
  const pwd = req.headers.get("x-team-password");
  if (!pwd || pwd !== process.env.TEAM_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const resetPwd = req.headers.get("x-reset-password") ?? "";
  if (createHash("sha256").update(resetPwd).digest("hex") !== RESET_PASSWORD_HASH) {
    return NextResponse.json({ error: "Senha de exclusão incorreta." }, { status: 403 });
  }

  const result = await prisma.vote.deleteMany({});

  return NextResponse.json({ success: true, deleted: result.count });
}
