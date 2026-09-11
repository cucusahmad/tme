# Talent Match Ecosystem

`talent_match_ecosystem` adalah aplikasi untuk mengenali potensi individu, mencocokkan kompetensi dengan profesi, dan membantu pengembangan karier.

Pengguna melengkapi profil dan memilih bidang profesi, mengikuti asesmen, kemudian melihat peringkat kecocokan peran serta rekomendasi pengembangan. Pencocokan saat ini membandingkan peran dalam bidang yang dipilih menggunakan hasil dimensi asesmen dan bobot kompetensi pada katalog profesi. Skor merupakan alat bantu eksplorasi, bukan jaminan keberhasilan karier.

Pilihan profesi, dimensi, pertanyaan, dan bobot mengikuti data yang dikonfigurasi di database. Contoh profesi dan skor pada halaman depan hanya ilustrasi.

Aplikasi dibangun menggunakan Next.js, React, dan Prisma.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Untuk penggunaan lokal sehari-hari atau mengukur performa, gunakan mode production:

```bash
npm run build
npm run start
```

Hentikan server development terlebih dahulu dengan Ctrl+C. Build cukup diulang
setelah perubahan kode. `npm run dev` ditujukan untuk pengembangan: kompilasi
sesuai permintaan dan hot reload menambah penggunaan CPU/RAM pada komputer
yang juga menjalankan browser.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
