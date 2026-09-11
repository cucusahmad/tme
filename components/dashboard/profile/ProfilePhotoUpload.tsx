"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { isAxiosError } from "axios";
import { Camera, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { MAX_PROFILE_PHOTO_SIZE, PROFILE_PHOTO_TYPES } from "@/lib/profile-photo";

export default function ProfilePhotoUpload({ initialPhoto }: { initialPhoto: string | null }) {
  const [photo, setPhoto] = useState(initialPhoto);
  const [uploading, setUploading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!PROFILE_PHOTO_TYPES.includes(file.type)) {
      toast.error("Gunakan foto JPG, PNG, atau WebP.");
      return;
    }
    if (!file.size || file.size > MAX_PROFILE_PHOTO_SIZE) {
      toast.error("Pilih foto berukuran maksimal 2 MB dan tidak kosong.");
      return;
    }
    setUploading(true);
    try {
      // Decode before uploading to reject unreadable images.
      const bitmap = await createImageBitmap(file);
      bitmap.close();
      const form = new FormData();
      form.append("foto", file);
      const response = await api.post<{ data: { foto: string } }>("/profile/photo", form);
      setPhoto(response.data.data.foto);
      setImageFailed(false);
      toast.success("Foto profil berhasil disimpan.");
    } catch (error) {
      toast.error(isAxiosError(error)
        ? error.response?.data?.message || "Gagal mengunggah foto. Silakan coba lagi."
        : "Foto tidak dapat dibaca. Pilih gambar lain.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-center" aria-busy={uploading}>
      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-emerald-50">
        {photo && !imageFailed ? (
          <Image src={photo} alt="Foto profil Anda" fill unoptimized className="object-cover" onError={() => setImageFailed(true)} />
        ) : <UserRound className="h-12 w-12 text-slate-400" aria-label="Belum ada foto profil" />}
      </div>
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Foto Profil</h2>
        <p id="profile-photo-help" className="text-sm text-slate-500">JPG, PNG, atau WebP, maksimal 2 MB. Foto otomatis disimpan setelah dipilih.</p>
        <input ref={inputRef} type="file" accept={PROFILE_PHOTO_TYPES.join(",")} onChange={uploadPhoto} disabled={uploading} className="hidden" aria-label="Pilih foto profil" aria-describedby="profile-photo-help" />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">
          <Camera className="h-4 w-4" aria-hidden="true" />
          <span aria-live="polite">{uploading ? "Mengunggah..." : photo ? "Ganti Foto" : "Unggah Foto"}</span>
        </button>
      </div>
    </section>
  );
}
