import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateSignedUploadParams } from "@/lib/cloudinary";

export async function GET(req: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const signedParams = generateSignedUploadParams("mysteryscoop/reviews");

    return NextResponse.json({ success: true, ...signedParams });
  } catch (error: any) {
    console.error("[Upload Signature API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
