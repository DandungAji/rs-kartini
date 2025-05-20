import { Service } from "./types";

// Mock Services Data
export const services: Service[] = [
  {
    id: "1",
    name: "Rawat Jalan",
    description: "Perawatan medis cepat dan nyaman tanpa perlu menginap, cocok untuk konsultasi dan pemeriksaan rutin.",
    icon: "Stethoscope",
    detailedDescription: "Layanan Rawat Jalan di RS Kartini memberikan solusi kesehatan praktis untuk Anda yang membutuhkan konsultasi dokter, pemeriksaan rutin, atau tindakan medis ringan tanpa harus menginap. Tim medis kami siap mendampingi dengan pelayanan yang cepat dan ramah.",
    benefits: [
      "Proses cepat tanpa perlu menginap",
      "Dokter spesialis yang berpengalaman",
      "Pelayanan ramah dan personal"
    ],
    procedures: [
      "Konsultasi dengan dokter umum atau spesialis",
      "Pemeriksaan fisik dan vital sign",
      "Rujukan tindakan lanjutan jika diperlukan"
    ]
  },
  {
    id: "2",
    name: "IGD",
    description: "Layanan darurat 24/7 untuk penanganan cepat dan profesional di saat kritis.",
    icon: "Siren",
    detailedDescription: "Unit Instalasi Gawat Darurat (IGD) RS Kartini siap melayani Anda 24 jam sehari, 7 hari seminggu. Dengan tim medis terlatih dan peralatan canggih, kami memastikan penanganan cepat untuk kondisi darurat seperti kecelakaan, serangan jantung, atau keadaan kritis lainnya.",
    benefits: [
      "Respon cepat dalam situasi darurat",
      "Tim medis ahli yang siaga 24/7",
      "Fasilitas darurat lengkap"
    ],
    procedures: [
      "Penilaian awal kondisi pasien",
      "Tindakan medis darurat",
      "Perawatan stabilisasi sebelum rawat inap"
    ]
  },
  {
    id: "3",
    name: "Rawat Inap",
    description: "Perawatan intensif dengan fasilitas nyaman untuk pemulihan optimal Anda.",
    icon: "Bed",
    detailedDescription: "Layanan Rawat Inap RS Kartini menawarkan perawatan intensif dengan kamar yang nyaman dan fasilitas modern. Kami mendampingi pasien selama proses pemulihan, baik pascaoperasi maupun untuk kondisi yang membutuhkan pengawasan medis lebih lanjut.",
    benefits: [
      "Kamar rawat inap yang nyaman",
      "Pengawasan medis 24 jam",
      "Pelayanan perawat yang peduli"
    ],
    procedures: [
      "Pemeriksaan harian oleh dokter",
      "Perawatan keperawatan berkala",
      "Terapi dan pemantauan sesuai kebutuhan"
    ]
  },
  {
    id: "4",
    name: "Laboratorium",
    description: "Tes laboratorium akurat untuk diagnosis yang tepat dan cepat.",
    icon: "Microscope",
    detailedDescription: "Layanan Laboratorium RS Kartini menyediakan berbagai tes medis, mulai dari pemeriksaan darah, urin, hingga analisis khusus. Dengan teknologi modern, kami memastikan hasil yang akurat untuk mendukung diagnosis dan perawatan Anda.",
    benefits: [
      "Hasil tes yang cepat dan akurat",
      "Beragam jenis pemeriksaan laboratorium",
      "Dukungan diagnosis yang terpercaya"
    ],
    procedures: [
      "Pengambilan sampel oleh tenaga ahli",
      "Analisis dengan peralatan modern",
      "Laporan hasil yang jelas dan rinci"
    ]
  },
  {
    id: "5",
    name: "Radiologi",
    description: "Pencitraan medis canggih untuk mendeteksi kondisi Anda secara mendalam.",
    icon: "ScanHeart",
    detailedDescription: "Layanan Radiologi RS Kartini menggunakan teknologi pencitraan terkini seperti X-ray, USG untuk membantu dokter mendiagnosis kondisi Anda dengan akurat. Prosedur dilakukan oleh tim radiologi profesional untuk hasil yang optimal.",
    benefits: [
      "Teknologi pencitraan mutakhir",
      "Proses aman dan nyaman",
      "Hasil akurat untuk diagnosis tepat"
    ],
    procedures: [
      "Pemeriksaan dengan alat radiologi",
      "Interpretasi hasil oleh radiologi",
      "Konsultasi hasil dengan dokter"
    ]
  },
  {
    id: "6",
    name: "Farmasi",
    description: "Obat berkualitas dan edukasi kesehatan untuk mendukung penyembuhan Anda.",
    icon: "Pill",
    detailedDescription: "Layanan Farmasi RS Kartini menyediakan obat-obatan berkualitas tinggi yang diresepkan dokter, lengkap dengan edukasi penggunaan yang tepat. Apoteker kami siap memberikan informasi untuk memastikan pengobatan Anda berjalan efektif.",
    benefits: [
      "Obat asli dan terjamin kualitasnya",
      "Konsultasi gratis dengan apoteker",
      "Edukasi penggunaan obat yang aman"
    ],
    procedures: [
      "Penyediaan obat sesuai resep",
      "Konsultasi dosis dan efek samping",
      "Pemantauan penggunaan obat"
    ]
  }
];