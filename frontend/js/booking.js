// booking.js — MyAstore60 (Terhubung ke Backend API)

const API_URL = 'https://myastore60-production.up.railway.app/api';

let currentStep = 1;
let selectedJam  = '';
let bookingData  = {};
let activeMotor  = 'semua';
let activeCC     = 'semua';

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  const tanggalInput = document.getElementById('tanggal');
  const besok = new Date();
  besok.setDate(besok.getDate() + 1);
  tanggalInput.min = besok.toISOString().split('T')[0];
  renderPaket();
});

// ===== FILTER MOTOR =====
function filterMotor(motor, btn) {
  activeMotor = motor;
  document.querySelectorAll('.mf-btn:not(.cc)').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderPaket();
}

function filterCC(cc, btn) {
  activeCC = cc;
  document.querySelectorAll('.mf-btn.cc').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderPaket();
}

// ===== RENDER PAKET =====
function renderPaket() {
  const container = document.getElementById('paketList');
  if (!container) return;

  const filtered = PAKET_DATA.filter(p =>
    p.variants.some(v =>
      (activeMotor === 'semua' || v.motor === activeMotor) &&
      (activeCC === 'semua' || v.cc === activeCC)
    )
  );

  if (filtered.length === 0) {
    container.innerHTML = '<div class="paket-empty">Tidak ada paket untuk filter ini</div>';
    return;
  }

  const lengkap = filtered.filter(p => p.type === 'lengkap');
  const satuan  = filtered.filter(p => p.type === 'satuan');
  let html = '';

  if (lengkap.length > 0) {
    html += `<div class="paket-group-label">Paket Lengkap</div>`;
    lengkap.forEach(p => html += buildPaketCard(p));
  }
  if (satuan.length > 0) {
    html += `<div class="paket-group-label" style="margin-top:12px">Paket Satuan</div>`;
    satuan.forEach(p => html += buildPaketCard(p));
  }

  container.innerHTML = html;
  container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => { updateEstimasi(); updateSummary(); });
  });
  updateEstimasi();
}

function buildPaketCard(p) {
  const variant = getVariant(p, activeMotor, activeCC);
  if (!variant) return '';
  const items       = getItems(p, activeMotor);
  const previewItems = items.slice(0, 3);
  const extraItems   = items.slice(3);
  const itemsHTML = previewItems.map(i => `<span class="pi-tag">${i}</span>`).join('');
  const extraHTML = extraItems.length > 0
    ? `<span class="pi-tag pi-more" onclick="toggleExtraItems('extra-${p.id}', this)">+${extraItems.length} lainnya</span>
       <div class="pi-extra hidden" id="extra-${p.id}">${extraItems.map(i => `<span class="pi-tag">${i}</span>`).join('')}</div>`
    : '';
  const freeHTML = p.free ? `<div class="pi-free">🎁 Gratis: ${p.free}</div>` : '';
  const diskon = Math.round((1 - variant.promo / variant.normal) * 100);

  return `
    <label class="paket-card-check">
      <div class="pcc-header">
        <input type="checkbox" name="layanan" value="${p.group}" data-normal="${variant.normal}" data-promo="${variant.promo}" />
        <div class="pcc-title">
          <span class="pcc-emoji">${p.emoji}</span>
          <span class="pcc-name">${p.group}</span>
          ${p.type === 'lengkap' ? '<span class="pcc-badge-lengkap">Lengkap</span>' : ''}
        </div>
        <div class="pcc-price">
          <span class="pcc-normal">${fmt(variant.normal)}</span>
          <span class="pcc-promo">${fmt(variant.promo)}</span>
          <span class="pcc-diskon">-${diskon}%</span>
        </div>
      </div>
      <div class="pcc-variant">${variant.label}</div>
      ${items.length > 0 ? `<div class="pcc-items">${itemsHTML}${extraHTML}</div>` : ''}
      ${freeHTML}
    </label>`;
}

function toggleExtraItems(id, btn) {
  event.preventDefault(); event.stopPropagation();
  const el = document.getElementById(id);
  const isOpen = !el.classList.contains('hidden');
  el.classList.toggle('hidden');
  btn.textContent = isOpen ? `+${el.children.length} lainnya` : 'Sembunyikan';
}

// ===== ESTIMASI HARGA =====
function updateEstimasi() {
  const checked = document.querySelectorAll('input[name="layanan"]:checked');
  const wrap    = document.getElementById('estimasiWrap');
  if (!wrap) return;
  if (checked.length === 0) { wrap.style.display = 'none'; return; }
  let totalNormal = 0, totalPromo = 0;
  checked.forEach(cb => {
    totalNormal += parseInt(cb.dataset.normal || 0);
    totalPromo  += parseInt(cb.dataset.promo  || 0);
  });
  wrap.style.display = 'block';
  document.getElementById('estimasiNormal').textContent = fmt(totalNormal);
  document.getElementById('estimasiPromo').textContent  = fmt(totalPromo);
}

// ===== STEP NAVIGATION =====
function nextStep(step) {
  if (!validateStep(currentStep)) return;
  saveStep(currentStep);
  document.getElementById('formStep' + currentStep).classList.add('hidden');
  document.getElementById('formStep' + step).classList.remove('hidden');
  document.getElementById('step' + currentStep + 'dot').classList.remove('active');
  document.getElementById('step' + currentStep + 'dot').classList.add('done');
  document.getElementById('step' + step + 'dot').classList.add('active');
  const lines = document.querySelectorAll('.step-line');
  if (step === 3) { lines[0].classList.add('active'); lines[1].classList.add('active'); }
  else if (step === 2) { lines[0].classList.add('active'); }
  currentStep = step;
  updateSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
  document.getElementById('formStep' + currentStep).classList.add('hidden');
  document.getElementById('formStep' + step).classList.remove('hidden');
  document.getElementById('step' + currentStep + 'dot').classList.remove('active');
  document.getElementById('step' + currentStep + 'dot').classList.remove('done');
  document.getElementById('step' + step + 'dot').classList.remove('done');
  document.getElementById('step' + step + 'dot').classList.add('active');
  const lines = document.querySelectorAll('.step-line');
  if (step === 1) lines[0].classList.remove('active');
  if (step === 2) lines[1].classList.remove('active');
  currentStep = step;
}

// ===== VALIDASI =====
function validateStep(step) {
  let valid = true;
  clearErrors();
  if (step === 1) {
    const nama = document.getElementById('nama').value.trim();
    const hp   = document.getElementById('hp').value.trim();
    if (!nama) { showError('nama', 'Nama lengkap wajib diisi'); valid = false; }
    if (!hp)   { showError('hp', 'Nomor HP wajib diisi'); valid = false; }
    else if (!/^08\d{8,11}$/.test(hp)) { showError('hp', 'Format tidak valid (contoh: 08123456789)'); valid = false; }
  }
  if (step === 2) {
    const merek   = document.getElementById('merek').value.trim();
    const nopol   = document.getElementById('nopol').value.trim();
    const checked = document.querySelectorAll('input[name="layanan"]:checked');
    if (!merek)          { showError('merek', 'Merek & tipe wajib diisi'); valid = false; }
    if (!nopol)          { showError('nopol', 'Nomor polisi wajib diisi'); valid = false; }
    if (checked.length === 0) { showError('layanan', 'Pilih minimal 1 paket layanan'); valid = false; }
  }
  if (step === 3) {
    const tanggal = document.getElementById('tanggal').value;
    if (!tanggal)     { showError('tanggal', 'Tanggal servis wajib dipilih'); valid = false; }
    if (!selectedJam) { showError('jam', 'Pilih jam servis'); valid = false; }
  }
  return valid;
}

function showError(field, msg) {
  const el = document.getElementById('err-' + field);
  if (el) el.textContent = msg;
  const input = document.getElementById(field);
  if (input) input.classList.add('error');
}
function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// ===== SIMPAN DATA =====
function saveStep(step) {
  if (step === 1) {
    bookingData.nama  = document.getElementById('nama').value.trim();
    bookingData.hp    = document.getElementById('hp').value.trim();
    bookingData.email = document.getElementById('email').value.trim();
  }
  if (step === 2) {
    bookingData.merek  = document.getElementById('merek').value.trim();
    bookingData.nopol  = document.getElementById('nopol').value.trim().toUpperCase();
    bookingData.jenis  = activeMotor !== 'semua' ? activeMotor : 'Motor';
    const checked = document.querySelectorAll('input[name="layanan"]:checked');
    bookingData.layanan      = Array.from(checked).map(cb => cb.value);
    bookingData.hargaPromo   = Array.from(checked).reduce((s, cb) => s + parseInt(cb.dataset.promo   || 0), 0);
    bookingData.hargaNormal  = Array.from(checked).reduce((s, cb) => s + parseInt(cb.dataset.normal  || 0), 0);
    bookingData.keluhan      = document.getElementById('keluhan').value.trim();
  }
  if (step === 3) {
    bookingData.tanggal = document.getElementById('tanggal').value;
    bookingData.jam     = selectedJam;
    bookingData.catatan = document.getElementById('catatan').value.trim();
  }
}

// ===== JAM =====
function pilihJam(btn, jam) {
  document.querySelectorAll('.jam-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedJam = jam;
}

// ===== RINGKASAN SIDEBAR =====
function updateSummary() {
  const list  = document.getElementById('summaryList');
  const items = [];
  if (bookingData.nama)   items.push(['Nama', bookingData.nama]);
  if (bookingData.hp)     items.push(['HP', bookingData.hp]);
  if (bookingData.jenis)  items.push(['Jenis', bookingData.jenis]);
  if (bookingData.merek)  items.push(['Tipe', bookingData.merek]);
  if (bookingData.nopol)  items.push(['No. Pol', bookingData.nopol]);
  if (bookingData.layanan && bookingData.layanan.length > 0) {
    bookingData.layanan.forEach((l, i) => items.push([`Paket ${i+1}`, l]));
    if (bookingData.hargaPromo) items.push(['💰 Total', fmt(bookingData.hargaPromo)]);
  }
  if (bookingData.tanggal) items.push(['Tanggal', formatTanggal(bookingData.tanggal)]);
  if (bookingData.jam)     items.push(['Jam', bookingData.jam + ' WIB']);
  if (items.length === 0) {
    list.innerHTML = '<div class="summary-item empty">Isi form untuk melihat ringkasan</div>';
    return;
  }
  list.innerHTML = items.map(([key, val]) =>
    `<div class="summary-item"><span>${key}</span><strong>${val}</strong></div>`
  ).join('');
}

function formatTanggal(str) {
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function fmt(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

// ===== SUBMIT KE API =====
async function submitBooking() {
  if (!validateStep(3)) return;
  saveStep(3);

  // Tampilkan loading
  const btnSubmit = document.querySelector('#formStep3 .btn-primary');
  btnSubmit.textContent = '⏳ Memproses...';
  btnSubmit.disabled = true;

  try {
    const payload = {
      nama_pelanggan:  bookingData.nama,
      no_hp:           bookingData.hp,
      email:           bookingData.email || '',
      merek_kendaraan: bookingData.merek,
      nopol:           bookingData.nopol,
      jenis_motor:     bookingData.jenis,
      layanan:         bookingData.layanan,
      keluhan:         bookingData.keluhan || '',
      tanggal_servis:  bookingData.tanggal,
      jam_servis:      bookingData.jam + ':00',
      harga_normal:    bookingData.hargaNormal,
      harga_total:     bookingData.hargaPromo,
      catatan:         bookingData.catatan || ''
    };

    const response = await fetch(`${API_URL}/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      // Berhasil — tampilkan nomor booking dari server
      document.getElementById('formStep3').classList.add('hidden');
      document.getElementById('formSuccess').classList.remove('hidden');
      document.getElementById('bookingNumber').textContent = result.nomor_booking;
      updateSummary();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Gagal: ' + result.message);
      btnSubmit.textContent = '✔ Konfirmasi Booking';
      btnSubmit.disabled = false;
    }

  } catch (err) {
    console.error('Submit error:', err);
    alert('Terjadi kesalahan koneksi. Pastikan server berjalan.');
    btnSubmit.textContent = '✔ Konfirmasi Booking';
    btnSubmit.disabled = false;
  }
}