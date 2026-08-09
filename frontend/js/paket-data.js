// paket-data.js — Data paket servis MyAstore60
// Sumber: daftar_harga_service_motor_ringkas

const PAKET_DATA = [
  {
    id: "pro",
    group: "Paket Service Lengkap Pro",
    type: "lengkap",
    emoji: "⭐",
    variants: [
      { motor: "bebek", cc: "besar", label: "Bebek ≤250cc", normal: 250000, promo: 165000 },
      { motor: "bebek", cc: "kecil", label: "Bebek ≤135cc", normal: 180000, promo: 135000 },
      { motor: "matic", cc: "besar", label: "Matic ≤250cc", normal: 250000, promo: 165000 },
      { motor: "matic", cc: "kecil", label: "Matic ≤125cc", normal: 180000, promo: 135000 },
      { motor: "kopling", cc: "besar", label: "Kopling ≤250cc", normal: 250000, promo: 165000 },
      { motor: "kopling", cc: "kecil", label: "Kopling ≤135cc", normal: 180000, promo: 135000 },
    ],
    items: {
      bebek: ["Pembersihan filter udara","Service + bersihkan TB/Karbu","Bersihkan busi","Cek packing mesin","Penambahan grease","Cek pendingin mesin","Cek + stel kampas rem depan & belakang","Cek shock depan & belakang","Cek bearing roda","Cek tekanan & kondisi ban","Pembersihan + lumasi + stel rantai"],
      matic: ["Service + bersihkan CVT","Service + bersihkan throttle body","Infus injeksi + cairan injeksi","Pembersihan filter udara","Penambahan grease","Full scan kerusakan JDIAG"],
      kopling: ["Pembersihan filter udara","Service + bersihkan TB/Karbu","Bersihkan busi","Cek packing mesin","Penambahan grease","Cek pendingin mesin","Cek + stel kabel kopling","Cek kampas + plat + per + rumah kopling","Cek + stel kampas rem depan & belakang","Cek shock depan & belakang","Cek bearing roda","Cek tekanan & kondisi ban"],
    },
    free: "Bensin untuk service, Karbu Cleaner, Refil Air Radiator"
  },
  {
    id: "promax",
    group: "Paket Service Lengkap Pro Max",
    type: "lengkap",
    emoji: "🏆",
    variants: [
      { motor: "bebek", cc: "besar", label: "Bebek ≤250cc", normal: 315000, promo: 245000 },
      { motor: "bebek", cc: "kecil", label: "Bebek ≤135cc", normal: 265000, promo: 199000 },
      { motor: "matic", cc: "besar", label: "Matic ≤250cc", normal: 315000, promo: 245000 },
      { motor: "matic", cc: "kecil", label: "Matic ≤125cc", normal: 265000, promo: 199000 },
      { motor: "kopling", cc: "besar", label: "Kopling ≤250cc", normal: 315000, promo: 245000 },
      { motor: "kopling", cc: "kecil", label: "Kopling ≤135cc", normal: 265000, promo: 199000 },
    ],
    items: {
      bebek: ["Semua item Paket Pro","+ Cek + lumasi + stel kabel gas","+ Cek + lumasi + stel kabel rem","+ Cek baut rangka"],
      matic: ["Semua item Paket Pro","+ Cek tekanan fuel pump","+ Cek tegangan aki","+ Pengecekan rem depan & belakang","+ Regrease komponen kaki-kaki"],
      kopling: ["Semua item Paket Pro","+ Pembersihan + lumasi + stel rantai","+ Cek + lumasi + stel kabel gas","+ Cek + lumasi + stel kabel rem","+ Cek baut rangka"],
    },
    free: "Bensin untuk service, Karbu Cleaner, Refil Air Radiator"
  },
  {
    id: "lengkap",
    group: "Paket Service Lengkap",
    type: "lengkap",
    emoji: "✅",
    variants: [
      { motor: "bebek", cc: "besar", label: "Bebek ≤250cc", normal: 180000, promo: 90000 },
      { motor: "bebek", cc: "kecil", label: "Bebek ≤135cc", normal: 180000, promo: 70000 },
      { motor: "matic", cc: "besar", label: "Matic ≤250cc", normal: 180000, promo: 90000 },
      { motor: "matic", cc: "kecil", label: "Matic ≤125cc", normal: 120000, promo: 70000 },
      { motor: "kopling", cc: "besar", label: "Kopling ≤250cc", normal: 180000, promo: 90000 },
      { motor: "kopling", cc: "kecil", label: "Kopling ≤135cc", normal: 180000, promo: 70000 },
    ],
    items: { all: [] },
    free: ""
  },
  {
    id: "mesin",
    group: "Paket Service Mesin",
    type: "satuan",
    emoji: "🔧",
    variants: [
      { motor: "bebek", cc: "besar", label: "Bebek ≤250cc", normal: 95000, promo: 65000 },
      { motor: "bebek", cc: "kecil", label: "Bebek ≤135cc", normal: 85000, promo: 50000 },
      { motor: "kopling", cc: "besar", label: "Kopling ≤250cc", normal: 95000, promo: 65000 },
      { motor: "kopling", cc: "kecil", label: "Kopling ≤135cc", normal: 85000, promo: 50000 },
    ],
    items: { all: ["Bersihkan filter udara","Bersihkan busi","Cek kompresi mesin","Cek packing mesin","Cek pendingin mesin"] },
    free: "Bensin untuk service"
  },
  {
    id: "karbu",
    group: "Paket Service TB / Karbu",
    type: "satuan",
    emoji: "⚙️",
    variants: [
      { motor: "bebek", cc: "besar", label: "Bebek ≤250cc", normal: 100000, promo: 50000 },
      { motor: "bebek", cc: "kecil", label: "Bebek ≤135cc", normal: 95000, promo: 40000 },
      { motor: "kopling", cc: "besar", label: "Kopling ≤250cc", normal: 100000, promo: 50000 },
      { motor: "kopling", cc: "kecil", label: "Kopling ≤135cc", normal: 95000, promo: 40000 },
    ],
    items: { all: ["Service TB/Karbu","Pengecekan TB/Karbu","Pembersihan TB/Karbu"] },
    free: "Bensin untuk service, Karbu Cleaner"
  },
  {
    id: "kakikaki",
    group: "Paket Service Kaki-Kaki",
    type: "satuan",
    emoji: "🛞",
    variants: [
      { motor: "bebek", cc: "besar", label: "Bebek ≤250cc", normal: 95000, promo: 55000 },
      { motor: "bebek", cc: "kecil", label: "Bebek ≤135cc", normal: 85000, promo: 40000 },
    ],
    items: { all: ["Cek + stel kampas rem depan & belakang","Cek shock depan & belakang","Cek bearing roda","Cek tekanan & kondisi ban"] },
    free: ""
  },
  {
    id: "cvt",
    group: "Paket Service CVT",
    type: "satuan",
    emoji: "🔩",
    variants: [
      { motor: "matic", cc: "besar", label: "Matic ≤250cc", normal: 85000, promo: 50000 },
      { motor: "matic", cc: "kecil", label: "Matic ≤125cc", normal: 65000, promo: 40000 },
    ],
    items: { all: ["Service CVT","Pengecekan CVT","Pembersihan CVT","Pembersihan filter"] },
    free: "Bensin untuk service"
  },
  {
    id: "tb",
    group: "Paket Service Throttle Body",
    type: "satuan",
    emoji: "💨",
    variants: [
      { motor: "matic", cc: "besar", label: "Matic ≤250cc", normal: 95000, promo: 65000 },
      { motor: "matic", cc: "kecil", label: "Matic ≤125cc", normal: 75000, promo: 50000 },
    ],
    items: { all: ["Service throttle body","Pengecekan throttle body","Pembersihan throttle body"] },
    free: "Bensin untuk service, Karbu Cleaner"
  },
  {
    id: "injeksi",
    group: "Paket Infus Injeksi",
    type: "satuan",
    emoji: "💉",
    variants: [
      { motor: "matic", cc: "besar", label: "Matic ≤250cc", normal: 85000, promo: 65000 },
      { motor: "matic", cc: "kecil", label: "Matic ≤125cc", normal: 65000, promo: 50000 },
    ],
    items: { all: ["Pengecekan injeksi","Infus injeksi"] },
    free: "Cairan injeksi"
  },
  {
    id: "kopling",
    group: "Paket Service Kopling",
    type: "satuan",
    emoji: "🔗",
    variants: [
      { motor: "kopling", cc: "besar", label: "Kopling ≤250cc", normal: 95000, promo: 55000 },
      { motor: "kopling", cc: "kecil", label: "Kopling ≤135cc", normal: 85000, promo: 40000 },
    ],
    items: { all: ["Cek + stel kabel kopling","Cek kampas kopling","Cek plat kopling","Cek per kopling","Cek rumah kopling"] },
    free: ""
  },
];

function fmt(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function getVariant(paket, motor, cc) {
  // Cari variant yang paling cocok dengan filter
  return paket.variants.find(v =>
    (motor === "semua" || v.motor === motor) &&
    (cc === "semua" || v.cc === cc)
  ) || paket.variants.find(v =>
    (motor === "semua" || v.motor === motor)
  ) || paket.variants[0];
}

function getItems(paket, motor) {
  if (paket.items.all !== undefined) return paket.items.all;
  if (motor !== "semua" && paket.items[motor]) return paket.items[motor];
  return paket.items[Object.keys(paket.items)[0]] || [];
}