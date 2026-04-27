import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("dataset") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dir = join(process.cwd(), "python-backend", "data");
  await mkdir(dir, { recursive: true });
  const filePath = join(dir, file.name);
  await writeFile(filePath, buffer);

  await prisma.dataset.create({ data: { fileName: file.name } });
  return NextResponse.json({ success: true, fileName: file.name });
}
