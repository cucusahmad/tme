import { getProfessions } from "@/services/profession.service";

import { success, failed } from "@/lib/response";
import { serialize } from "@/lib/serializer";

export async function GET() {
  try {
    const professions =
      await getProfessions();

    return success(
      serialize(professions),
      "Berhasil mengambil data profesi."
    );
  } catch (error) {
    console.error(error);

    return failed(
      "Terjadi kesalahan server.",
      500
    );
  }
}