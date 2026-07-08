import { getEducationLevels } from "@/services/education-level.service";

import { success, failed } from "@/lib/response";
import { serialize } from "@/lib/serializer";

export async function GET() {
  try {
    const educations =
      await getEducationLevels();

    return success(
      serialize(educations),
      "Berhasil mengambil data pendidikan."
    );
  } catch (error) {
    console.error(error);

    return failed(
      "Terjadi kesalahan server.",
      500
    );
  }
}