// harga-manager.js — Manajemen Paket Harga MyAstore60

var allServices = [];
var activeHargaFilter = 'semua';
var editServiceId = null;

function loadHarga() {
  var grid = document.getElementById('hargaGrid');
  if (grid) grid.innerHTML = '<div class="harga-empty">Memuat data paket...</div>';

  var token = localStorage.getItem('admin_token');
  fetch('http://localhost:3000/api/services/all', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    allServices = data.services || [];
    renderHargaStats();
    renderHargaGrid();
  })
  .catch(function(err) {
    console.error('Load harga error:', err);
    var grid = document.getElementById('hargaGrid');
    if (grid) grid.innerHTML = '<div class="harga-empty">Gagal terhubung ke server.</div>';
  });
}

function renderHargaStats() {
  var aktif = allServices.filter(function(s) { return s.is_active; });
  var el1 = document.getElementById('hargaStatTotal');
  var el2 = document.getElementById('hargaStatLengkap');
  var el3 = document.getElementById('hargaStatSatuan');
  if (el1) el1.textContent = aktif.length;
  if (el2) el2.textContent = aktif.filter(function(s) { return s.tipe === 'lengkap'; }).length;
  if (el3) el3.textContent = aktif.filter(function(s) { return s.tipe === 'satuan'; }).length;
}

function filterHarga(filter, btn) {
  activeHargaFilter = filter;
  var btns = document.querySelectorAll('.htab');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
  btn.classList.add('active');
  renderHargaGrid();
}

function fmtRpH(n) { return 'Rp ' + (n || 0).toLocaleString('id-ID'); }

function renderHargaGrid() {
  var grid = document.getElementById('hargaGrid');
  if (!grid) return;

  var filtered = allServices;
  if (activeHargaFilter === 'lengkap') {
    filtered = allServices.filter(function(s) { return s.tipe === 'lengkap'; });
  } else if (activeHargaFilter === 'satuan') {
    filtered = allServices.filter(function(s) { return s.tipe === 'satuan'; });
  } else if (activeHargaFilter === 'bebek' || activeHargaFilter === 'matic' || activeHargaFilter === 'kopling') {
    filtered = allServices.filter(function(s) { return s.jenis_motor === activeHargaFilter; });
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="harga-empty">Tidak ada paket untuk filter ini</div>';
    return;
  }

  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var s = filtered[i];
    var diskon = Math.round((1 - s.harga_promo / s.harga_normal) * 100);
    var motorBadge = '<span class="hic-badge hib-' + s.jenis_motor + '">' + s.jenis_motor + '</span>';
    var tipeBadge  = '<span class="hic-badge hib-' + s.tipe + '">' + s.tipe + '</span>';
    var ccLabel    = s.cc === 'kecil' ? '&le;125/135cc' : s.cc === 'besar' ? '&le;250cc' : s.cc;
    var ccBadge    = '<span class="hic-badge hib-' + s.cc + '">' + ccLabel + '</span>';
    var deskripsi  = s.deskripsi ? '<div style="font-size:0.78rem;color:#9CA3AF;margin-top:6px">' + s.deskripsi + '</div>' : '';
    var nonaktif   = s.is_active ? '' : ' nonaktif';

    html += '<div class="harga-item-card' + nonaktif + '">';
    html += '<div class="hic-header">';
    html += '<div class="hic-name">' + s.nama_paket + '</div>';
    html += '<div class="hic-actions">';
    html += '<button class="btn-toggle-harga" onclick="toggleAktif(' + s.id + ',' + s.is_active + ')" title="' + (s.is_active ? 'Nonaktifkan' : 'Aktifkan') + '">' + (s.is_active ? '👁' : '🚫') + '</button>';
    html += '<button class="btn-edit-harga" onclick="bukaModalEdit(' + s.id + ')">✏️ Edit</button>';
    html += '<button class="btn-del-harga" onclick="hapusPaket(' + s.id + ',\'' + s.nama_paket.replace(/'/g, "\\'") + '\')">🗑</button>';
    html += '</div></div>';
    html += '<div class="hic-badges">' + motorBadge + tipeBadge + ccBadge + '</div>';
    html += '<div class="hic-prices">';
    html += '<span class="hic-normal">' + fmtRpH(s.harga_normal) + '</span>';
    html += '<span class="hic-promo">' + fmtRpH(s.harga_promo) + '</span>';
    html += '<span class="hic-diskon">-' + diskon + '%</span>';
    html += '</div>';
    html += deskripsi;
    html += '</div>';
  }
  grid.innerHTML = html;
}

function updatePreviewDiskon() {
  var normal = parseInt(document.getElementById('fNormal').value) || 0;
  var promo  = parseInt(document.getElementById('fPromo').value) || 0;
  var wrap   = document.getElementById('previewDiskon');
  if (!wrap) return;
  if (normal > 0 && promo > 0 && promo < normal) {
    var diskon = Math.round((1 - promo / normal) * 100);
    var hemat  = normal - promo;
    document.getElementById('nilaiDiskon').textContent = diskon + '%';
    document.getElementById('nilaiHemat').textContent  = 'Rp ' + hemat.toLocaleString('id-ID');
    wrap.style.display = 'block';
  } else {
    wrap.style.display = 'none';
  }
}

function bukaModalTambah() {
  editServiceId = null;
  document.getElementById('modalHargaTitle').textContent = '+ Tambah Paket Baru';
  document.getElementById('fNama').value      = '';
  document.getElementById('fTipe').value      = 'lengkap';
  document.getElementById('fJenis').value     = 'bebek';
  document.getElementById('fCC').value        = 'kecil';
  document.getElementById('fNormal').value    = '';
  document.getElementById('fPromo').value     = '';
  document.getElementById('fDeskripsi').value = '';
  document.getElementById('previewDiskon').style.display = 'none';
  document.getElementById('fNormal').addEventListener('input', updatePreviewDiskon);
  document.getElementById('fPromo').addEventListener('input', updatePreviewDiskon);
  document.getElementById('modalHarga').classList.add('open');
}

function bukaModalEdit(id) {
  var s = null;
  for (var i = 0; i < allServices.length; i++) {
    if (allServices[i].id === id) { s = allServices[i]; break; }
  }
  if (!s) return;
  editServiceId = id;
  document.getElementById('modalHargaTitle').textContent = 'Edit Paket';
  document.getElementById('fNama').value      = s.nama_paket;
  document.getElementById('fTipe').value      = s.tipe;
  document.getElementById('fJenis').value     = s.jenis_motor;
  document.getElementById('fCC').value        = s.cc;
  document.getElementById('fNormal').value    = s.harga_normal;
  document.getElementById('fPromo').value     = s.harga_promo;
  document.getElementById('fDeskripsi').value = s.deskripsi || '';
  document.getElementById('fNormal').addEventListener('input', updatePreviewDiskon);
  document.getElementById('fPromo').addEventListener('input', updatePreviewDiskon);
  updatePreviewDiskon();
  document.getElementById('modalHarga').classList.add('open');
}

function simpanPaket() {
  var nama   = document.getElementById('fNama').value.trim();
  var tipe   = document.getElementById('fTipe').value;
  var jenis  = document.getElementById('fJenis').value;
  var cc     = document.getElementById('fCC').value;
  var normal = parseInt(document.getElementById('fNormal').value);
  var promo  = parseInt(document.getElementById('fPromo').value);
  var desk   = document.getElementById('fDeskripsi').value.trim();

  if (!nama || !normal || !promo) {
    alert('Nama paket, harga normal, dan harga promo wajib diisi!');
    return;
  }
  if (promo >= normal) {
    alert('Harga promo harus lebih kecil dari harga normal!');
    return;
  }

  var token   = localStorage.getItem('admin_token');
  var payload = { nama_paket: nama, tipe: tipe, jenis_motor: jenis, cc: cc, harga_normal: normal, harga_promo: promo, deskripsi: desk, is_active: 1 };
  var url     = editServiceId ? 'http://localhost:3000/api/services/' + editServiceId : 'http://localhost:3000/api/services';
  var method  = editServiceId ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify(payload)
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    tutupModalHarga();
    loadHarga();
    alert(editServiceId ? 'Paket berhasil diupdate!' : 'Paket baru berhasil ditambahkan!');
  })
  .catch(function() { alert('Gagal terhubung ke server'); });
}

function hapusPaket(id, nama) {
  if (!confirm('Hapus paket "' + nama + '"? Tindakan ini tidak bisa dibatalkan!')) return;
  var token = localStorage.getItem('admin_token');
  fetch('http://localhost:3000/api/services/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(function(res) { return res.json(); })
  .then(function() { loadHarga(); alert('Paket berhasil dihapus!'); })
  .catch(function() { alert('Gagal terhubung ke server'); });
}

function toggleAktif(id, isAktif) {
  var s = null;
  for (var i = 0; i < allServices.length; i++) {
    if (allServices[i].id === id) { s = allServices[i]; break; }
  }
  if (!s) return;
  var token = localStorage.getItem('admin_token');
  fetch('http://localhost:3000/api/services/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({
      nama_paket: s.nama_paket, tipe: s.tipe, jenis_motor: s.jenis_motor,
      cc: s.cc, harga_normal: s.harga_normal, harga_promo: s.harga_promo,
      deskripsi: s.deskripsi, is_active: isAktif ? 0 : 1
    })
  })
  .then(function() { loadHarga(); })
  .catch(function() { alert('Gagal terhubung ke server'); });
}

function tutupModalHarga() {
  document.getElementById('modalHarga').classList.remove('open');
}

function closeModalHarga(e) {
  if (e.target === document.getElementById('modalHarga')) tutupModalHarga();
}