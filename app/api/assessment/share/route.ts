import { randomBytes } from "node:crypto";
import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { failed, success } from "@/lib/response";
import { verifyToken } from "@/lib/jwt";

function getUserId(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) throw new Error("UNAUTHORIZED");
  return BigInt(verifyToken(token).user_id);
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const biodata = await prisma.biodata.findUnique({ where: { user_id: userId } });

    if (!biodata) return failed("Lengkapi biodata terlebih dahulu.", 400);
    if (!biodata.profession_id) return failed("Pilih profesi pada biodata terlebih dahulu.", 400);

    const shareToken = biodata.assessment_share_token ?? randomBytes(24).toString("hex");
    if (!biodata.assessment_share_token) {
      await prisma.biodata.update({
        where: { biodata_id: biodata.biodata_id },
        data: { assessment_share_token: shareToken },
      });
    }

    const completed = await prisma.assessment.count({
      where: {
        biodata_id: biodata.biodata_id,
        assessment_type: "EXTERNAL",
        status: "COMPLETED",
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
    const shareUrl = new URL(`/nilai/${shareToken}`, appUrl).toString();
    return success({ shareUrl, completed }, "Tautan penilaian tersedia.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
    return failed(message === "UNAUTHORIZED" ? "Unauthorized" : message, message === "UNAUTHORIZED" ? 401 : 500);
  }
}
