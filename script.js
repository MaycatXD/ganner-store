// API Key dan URL (ganti dengan API key Anda)
const API_KEY = '864b707da7ac4f4eb45d8378397c2cbb';
const API_URL = `https://api.whoisfreaks.com/v1.0/domain/availability?apiKey=${API_KEY}&domain=`;

const hargaDomain = {
  '.com': 150000,    // Domain internasional
  '.net': 120000,    // Domain internasional
  '.org': 100000,    // Domain internasional
  '.id': 200000,     // Domain Indonesia (umum)
  '.co.id': 250000,  // Domain untuk perusahaan
  '.ac.id': 220000,  // Domain untuk akademik/perguruan tinggi
  '.sch.id': 180000, // Domain untuk sekolah
  '.or.id': 200000,  // Domain untuk organisasi
  '.web.id': 150000, // Domain untuk umum
  '.my.id': 10000,  // Domain untuk personal
  '.biz.id': 10000, // Domain untuk bisnis
  '.desa.id': 100000, // Domain untuk desa
  '.xyz': 90000,     // Domain internasional (umum)
  '.online': 110000, // Domain internasional (umum)
  '.site': 95000,    // Domain internasional (umum)
  '.store': 130000,  // Domain untuk toko online
  '.tech': 140000,   // Domain untuk teknologi
  '.blog': 120000,   // Domain untuk blog
  '.edu': 160000,    // Domain untuk pendidikan (internasional)
  '.gov': 180000,    // Domain untuk pemerintah (internasional)
  '.info': 80000,    // Domain informasi (internasional)
  '.club': 100000,   // Domain untuk komunitas
  '.design': 150000, // Domain untuk desain
  '.dev': 130000,    // Domain untuk pengembang
  '.app': 170000,    // Domain untuk aplikasi
  '.cloud': 140000,  // Domain untuk layanan cloud
  '.space': 90000,   // Domain untuk ruang kreatif
  '.tv': 200000,     // Domain untuk media/televisi
  '.io': 250000,     // Domain untuk teknologi/startup
  '.ai': 300000,     // Domain untuk kecerdasan buatan
  '.me': 120000,     // Domain untuk personal (internasional)
  '.name': 110000,   // Domain untuk nama pribadi
  '.pro': 150000,    // Domain untuk profesional
  '.shop': 160000,   // Domain untuk toko online
  '.news': 100000,   // Domain untuk berita
  '.health': 140000, // Domain untuk kesehatan
  '.travel': 180000, // Domain untuk pariwisata
  '.art': 130000,    // Domain untuk seni
  '.music': 150000,  // Domain untuk musik
  '.photo': 120000,  // Domain untuk fotografi
  '.game': 140000,   // Domain untuk gaming
  '.fit': 110000,    // Domain untuk kebugaran
  '.law': 190000,    // Domain untuk hukum
  '.edu.id': 210000, // Domain untuk pendidikan di Indonesia
  '.mil.id': 230000, // Domain untuk militer di Indonesia
  '.go.id': 240000,  // Domain untuk pemerintah Indonesia
};

// Keranjang Belanja
let keranjang = [];

// Fungsi untuk cek domain
document.getElementById('domainForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const domain = document.getElementById('domainInput').value.trim();
  const result = document.getElementById('domainResult');
  const domainDetails = document.getElementById('domainDetails');

  try {
    const response = await fetch(API_URL + domain);
    const data = await response.json();

    if (data.domain_availability === 'unavailable') {
      result.textContent = 'Maaf, domain sudah terdaftar.';
      result.style.color = 'red';
      domainDetails.style.display = 'none';
    } else {
      result.textContent = 'Selamat, domain tersedia!';
      result.style.color = 'green';

      // Tampilkan detail domain
      const ekstensi = domain.split('.').pop();
      const harga = hargaDomain[`.${ekstensi}`] || 100000; // Default harga
      document.getElementById('domainName').textContent = domain;
      document.getElementById('domainPrice').textContent = harga.toLocaleString();
      domainDetails.style.display = 'block';

      // Simpan data domain ke localStorage
      localStorage.setItem('domain', domain);
      localStorage.setItem('harga', harga);
    }
  } catch (error) {
    result.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
    result.style.color = 'red';
    domainDetails.style.display = 'none';
  }
});

// Tambahkan Domain ke Keranjang
document.getElementById('tambahDomain').addEventListener('click', function () {
  const domain = localStorage.getItem('domain');
  const harga = parseInt(localStorage.getItem('harga'));
  const sslBerbayar = document.getElementById('sslBerbayar').checked;
  const hargaSSL = sslBerbayar ? 28000 : 0;
  const total = harga + hargaSSL;

  keranjang.push({
    produk: 'Domain',
    nama: domain,
    harga: harga,
    ssl: sslBerbayar ? 'Berbayar (Rp 28.000)' : 'Gratis',
    total: total,
  });

  alert('Domain berhasil ditambahkan ke keranjang!');
});

// Tambahkan Nokos ke Keranjang
document.getElementById('nokosForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const provider = document.getElementById('provider').value;

  keranjang.push({
    produk: 'Nokos',
    provider: provider,
    harga: 5500,
    total: 5500,
  });

  alert('Nokos berhasil ditambahkan ke keranjang!');
});

// Halaman Verifikasi
if (window.location.pathname.includes('verifikasi.html')) {
  const detailPembelian = document.getElementById('detailPembelian');
  let totalHarga = 0;

  keranjang.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>Produk ${index + 1}:</strong> ${item.produk}</p>
      <p>Nama: ${item.nama || item.provider}</p>
      <p>Harga: Rp ${item.harga.toLocaleString()}</p>
      ${item.ssl ? `<p>SSL: ${item.ssl}</p>` : ''}
      <p>Total: Rp ${item.total.toLocaleString()}</p>
      <hr>
    `;
    detailPembelian.appendChild(div);
    totalHarga += item.total;
  });

  const ppn = totalHarga * 0.11;
  const total = totalHarga + ppn;

  const divTotal = document.createElement('div');
  divTotal.innerHTML = `
    <p><strong>PPN 11%:</strong> Rp ${ppn.toLocaleString()}</p>
    <p><strong>Total Pembayaran:</strong> Rp ${total.toLocaleString()}</p>
  `;
  detailPembelian.appendChild(divTotal);

  // Kirim via WhatsApp
  document.getElementById('verifikasiForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const nama = document.getElementById('nama').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const kupon = document.getElementById('kupon').value;
    const pembayaran = document.getElementById('pembayaran').value;

    let pesan = `Halo, saya ingin membeli:\n\n` +
      `Nama: ${nama}\n` +
      `Nomor WhatsApp: ${whatsapp}\n`;

    keranjang.forEach((item, index) => {
      pesan += `\nProduk ${index + 1}:\n` +
        `- Produk: ${item.produk}\n` +
        `- Nama: ${item.nama || item.provider}\n` +
        `- Harga: Rp ${item.harga.toLocaleString()}\n` +
        `${item.ssl ? `- SSL: ${item.ssl}\n` : ''}` +
        `- Total: Rp ${item.total.toLocaleString()}\n`;
    });

    pesan += `\nPPN 11%: Rp ${ppn.toLocaleString()}\n` +
      `Total Pembayaran: Rp ${total.toLocaleString()}\n` +
      `Kupon: ${kupon || 'Tidak ada'}\n` +
      `Metode Pembayaran: ${pembayaran}\n\n` +
      `Silakan konfirmasi pembayaran. Terima kasih!`;

    const url = `https://wa.me/6285950018968?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
  });
}