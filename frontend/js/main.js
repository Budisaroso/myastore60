// main.js — MyAstore60

function toggleMenu() {
  const nav = document.getElementById('navMobile');
  if (nav) nav.classList.toggle('open');
}

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 4px 24px rgba(10,45,110,0.4)'
    : '0 2px 16px rgba(10,45,110,0.3)';
});

// ===== RENDER LAYANAN DI INDEX.HTML =====
let activeLayananFilter = 'semua';

function filterLayanan(filter, btn) {
  activeLayananFilter = filter;
  document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderLayanan();
}

function renderLayanan() {
  const grid = document.getElementById('layananGrid');
  if (!grid || typeof PAKET_DATA === 'undefined') return;

  // Ambil paket unik (group by nama_paket) yang cocok dengan filter
  const seen = new Set();
  const filtered = PAKET_DATA.filter(p => {
    if (seen.has(p.group)) return false;
    const matchType = activeLayananFilter === 'semua' ||
      (activeLayananFilter === 'lengkap' && p.type === 'lengkap') ||
      (activeLayananFilter === 'satuan'  && p.type === 'satuan');
    const matchMotor = activeLayananFilter === 'semua' ||
      activeLayananFilter === 'lengkap' || activeLayananFilter === 'satuan' ||
      p.variants.some(v => v.motor === activeLayananFilter);
    if (matchType && matchMotor) {
      seen.add(p.group);
      return true;
    }
    return false;
  });

  grid.className = 'layanan-grid';
  grid.innerHTML = filtered.map((p, idx) => {
    // Cari harga minimum dari semua variant
    const minPromo  = Math.min(...p.variants.map(v => v.promo));
    const minNormal = Math.min(...p.variants.map(v => v.normal));
    const diskon    = Math.round((1 - minPromo / minNormal) * 100);

    // Badge motor unik
    const motors = [...new Set(p.variants.map(v => v.motor))];
    const badges = motors.map(m =>
      `<span class="lbadge lbadge-${m}">${m.charAt(0).toUpperCase()+m.slice(1)}</span>`
    ).join('');

    // Deskripsi singkat dari items
    const items = p.items?.all || p.items?.[motors[0]] || [];
    const desc = items.length > 0
      ? items.slice(0, 2).join(', ') + (items.length > 2 ? `, +${items.length-2} lainnya` : '')
      : `Tersedia untuk ${motors.join(', ')}`;

    const isFeatured = p.type === 'lengkap' && idx === 0;
    const freeHTML = p.free
      ? `<div style="font-size:11px;color:#0a6644;margin-top:6px">🎁 ${p.free}</div>`
      : '';

    return `
      <div class="layanan-card ${isFeatured ? 'featured' : ''}">
        ${isFeatured ? '<div class="featured-badge">Terpopuler</div>' : ''}
        <div class="layanan-icon">${p.emoji}</div>
        <div class="layanan-motor-badges">${badges}</div>
        <h3>${p.group}</h3>
        <p>${desc}</p>
        ${freeHTML}
        <div class="layanan-price-wrap">
          <span class="layanan-price-normal">Rp ${minNormal.toLocaleString('id-ID')}</span>
          <span class="layanan-price-promo">Mulai Rp ${minPromo.toLocaleString('id-ID')}</span>
          <span class="layanan-diskon">-${diskon}%</span>
        </div>
      </div>`;
  }).join('');
}

// Animasi scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

window.addEventListener('DOMContentLoaded', () => {
  // Render layanan dari data paket
  renderLayanan();

  // Animasi kartu
  setTimeout(() => {
    document.querySelectorAll('.kenapa-item, .kv-box').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }, 100);
});