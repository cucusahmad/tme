import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { failed, success } from "@/lib/response";
import { MAX_PROFILE_PHOTO_SIZE, PROFILE_PHOTO_TYPES, matchesPhotoType } from "@/lib/profile-photo";

export async function POST(request: NextRequest) {
  let userId: bigint;
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return failed("Silakan masuk terlebih dahulu.", 401);
    userId = BigInt(verifyToken(token).user_id);
  } catch {
    return failed("Sesi tidak valid. Silakan masuk kembali.", 401);
  }

  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: { is_active: true },
    });
    if (!user?.is_active) return failed("Akun tidak aktif.", 401);

    if (Number(request.headers.get("content-length")) > MAX_PROFILE_PHOTO_SIZE + 64 * 1024) {
      return failed("Ukuran foto maksimal 2 MB.", 413);
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return failed("Data unggahan tidak valid.", 400);
    }
    const file = form.get("foto");
    if (!(file instanceof File) || file.size === 0) {
      return failed("Pilih file foto terlebih dahulu.", 400);
    }
    if (file.size > MAX_PROFILE_PHOTO_SIZE) return failed("Ukuran foto maksimal 2 MB.", 413);
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!PROFILE_PHOTO_TYPES.includes(file.type) || !matchesPhotoType(bytes, file.type)) {
      return failed("Gunakan foto JPG, PNG, atau WebP yang valid.", 400);
    }

    // Keep the small image in the existing text column so it persists across deployments.
    const foto = `data:${file.type};base64,${bytes.toString("base64")}`;
    await prisma.biodata.upsert({
      where: { user_id: userId },
      create: { user_id: userId, foto },
      update: { foto },
    });
    return success({ foto }, "Foto profil berhasil disimpan.");
  } catch (error) {
    console.error("Profile photo upload failed:", error);
    return failed("Gagal menyimpan foto profil. Silakan coba lagi.", 500);
  }
}
