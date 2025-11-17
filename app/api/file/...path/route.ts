import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  const filePath = params.path.join("/");
  const url = `https://backend_spmb.smktibazma.sch.id/uploads/${filePath}`;

  const res = await fetch(url);
  if (!res.ok) return NextResponse.json({ error: "File not found" }, { status: 404 });

  const blob = await res.blob();
  return new NextResponse(blob, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
    },
  });
}
