"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  BiodataSchema,
  BiodataInput,
} from "@/validations/biodata";

export default function BiodataForm() {

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [professions, setProfessions] =
    useState<any[]>([]);

  const [educations, setEducations] =
    useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<BiodataInput>({
    resolver:
      zodResolver(
        BiodataSchema
      ),
  });

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    try {

      const [
        profile,
        profession,
        education,
      ] = await Promise.all([

        api.get("/profile"),

        api.get("/profession"),

        api.get("/education-level"),

      ]);

      reset(profile.data.data);

      setProfessions(
        profession.data.data
      );

      setEducations(
        education.data.data
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Gagal mengambil data."
      );

    } finally {

      setLoading(false);

    }

  }

  async function onSubmit(
    data: BiodataInput
  ) {

    try {

      setSaving(true);

      await api.put(
        "/profile",
        data
      );

      toast.success(
        "Biodata berhasil disimpan."
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Gagal menyimpan biodata."
      );

    } finally {

      setSaving(false);

    }

  }

  if (loading) {

    return (

      <div className="rounded-3xl bg-white p-10 shadow">

        Memuat data...

      </div>

    );

  }

  return (

    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-8 rounded-3xl bg-white p-8 shadow"
    >
          {/* ===========================
          DATA PRIBADI
      =========================== */}

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Data Pribadi
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Lengkapi identitas diri Anda.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Nama */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Nama Lengkap
          </label>

          <input
            {...register("nama_lengkap")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.nama_lengkap?.message}
          </p>

        </div>

        {/* Gender */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Jenis Kelamin
          </label>

          <select
            {...register("jenis_kelamin")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          >

            <option value="">
              Pilih Jenis Kelamin
            </option>

            <option value="Laki-laki">
              Laki-laki
            </option>

            <option value="Perempuan">
              Perempuan
            </option>

          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.jenis_kelamin?.message}
          </p>

        </div>

        {/* Tempat Lahir */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Tempat Lahir
          </label>

          <input
            {...register("tempat_lahir")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.tempat_lahir?.message}
          </p>

        </div>

        {/* Tanggal Lahir */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Tanggal Lahir
          </label>

          <input
            type="date"
            {...register("tanggal_lahir")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.tanggal_lahir?.message}
          </p>

        </div>

        {/* No HP */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Nomor HP
          </label>

          <input
            {...register("no_hp")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.no_hp?.message}
          </p>

        </div>

        {/* Email */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            {...register("email")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.email?.message}
          </p>

        </div>

      </div>

      {/* ===========================
          ALAMAT
      =========================== */}

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Alamat
        </h2>

      </div>

      <div>

        <label className="mb-2 block font-medium text-slate-700">
          Alamat Lengkap
        </label>

        <textarea
          rows={4}
          {...register("alamat")}
          className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
        />

        <p className="mt-1 text-sm text-red-500">
          {errors.alamat?.message}
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Kabupaten / Kota
          </label>

          <input
            {...register("kabupaten_kota")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.kabupaten_kota?.message}
          </p>

        </div>

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Provinsi
          </label>

          <input
            {...register("provinsi")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.provinsi?.message}
          </p>

        </div>

      </div>
            {/* ===========================
          PENDIDIKAN
      =========================== */}

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Pendidikan
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Informasi pendidikan terakhir Anda.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Pendidikan */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Pendidikan Terakhir
          </label>

          <select
            {...register("education_level_id", {
              setValueAs: (value) =>
                value ? Number(value) : null,
            })}
            className="
w-fullh
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          >

            <option value="">
              Pilih Pendidikan
            </option>

            {educations.map((item) => (

              <option
                key={item.education_level_id}
                value={item.education_level_id.toString()}
              >
                {item.education_name}
              </option>

            ))}

          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.education_level_id?.message}
          </p>

        </div>

        {/* Jurusan */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Jurusan
          </label>

          <input
            {...register("jurusan")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.jurusan?.message}
          </p>

        </div>

      </div>

      {/* ===========================
          PEKERJAAN
      =========================== */}

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Informasi Pekerjaan
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Isi jika Anda sudah bekerja.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Status */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Status Pekerjaan
          </label>

          <select
            {...register("status_pekerjaan")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          >

            <option value="">
              Pilih Status
            </option>

            <option value="Belum Bekerja">
              Belum Bekerja
            </option>

            <option value="Mahasiswa">
              Mahasiswa
            </option>

            <option value="Pelajar">
              Pelajar
            </option>

            <option value="Bekerja">
              Bekerja
            </option>

            <option value="Wiraswasta">
              Wiraswasta
            </option>

          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.status_pekerjaan?.message}
          </p>

        </div>

        {/* Profesi */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Profesi yang Diminati
          </label>

          <select
            {...register("profession_id", {
              setValueAs: (value) =>
                value ? Number(value) : null,
            })}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          >

            <option value="">
              Pilih Profesi
            </option>

            {professions.map((item) => (

              <option
                key={item.profession_id}
                value={item.profession_id.toString()}
              >
                {item.profession_name}
              </option>

            ))}

          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.profession_id?.message}
          </p>

        </div>

        {/* Instansi */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Instansi
          </label>

          <input
            {...register("instansi")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.instansi?.message}
          </p>

        </div>

        {/* Unit Kerja */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Unit Kerja
          </label>

          <input
            {...register("unit_kerja")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.unit_kerja?.message}
          </p>

        </div>

        {/* Jabatan */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Jabatan
          </label>

          <input
            {...register("jabatan")}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.jabatan?.message}
          </p>

        </div>

        {/* Lama Pengalaman */}

        <div>

          <label className="mb-2 block font-medium text-slate-700">
            Lama Pengalaman Kerja (Tahun)
          </label>

          <input
            type="number"
            min={0}
            {...register("lama_pengalaman_kerja", {
              valueAsNumber: true,
            })}
            className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.lama_pengalaman_kerja?.message}
          </p>

        </div>

      </div>
            {/* ===========================
          FOTO
      =========================== */}

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          Foto Profil
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Upload foto profil Anda (opsional).
        </p>

      </div>

      <div>

        <label className="mb-2 block font-medium text-slate-700">
          Foto
        </label>

        <input
          type="text"
          placeholder="URL Foto atau path upload"
          {...register("foto")}
          className="
w-full
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-slate-900
placeholder:text-slate-400
outline-none
transition
focus:border-cyan-500
"
        />

        <p className="mt-1 text-sm text-red-500">
          {errors.foto?.message}
        </p>

      </div>

      {/* ===========================
          BUTTON
      =========================== */}

      <div className="flex justify-end gap-4 border-t border-slate-200 pt-8">

        <button
          type="reset"
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold transition hover:bg-slate-100"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Menyimpan..."
            : "Simpan Biodata"}
        </button>

      </div>

    </form>

  );

}