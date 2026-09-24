const divisions = ['Lapangan','Perlengkapan','Humas','Dekorasi','Dokumentasi','Konsumsi','Lomba','Sponsorship','Acara','Keamanan'];
const defaultTeam = [
  { role: 'Ketua Pelaksana', name: 'Nama Ketua Pelaksana', type: 'lead', icon: '★' },
  { role: 'Wakil Pelaksana', name: 'Nama Wakil Pelaksana', type: 'lead', icon: '◆' },
  { role: 'Sekretaris', name: 'Nama Sekretaris', type: 'lead', icon: '✎' },
  { role: 'Bendahara', name: 'Nama Bendahara', type: 'lead', icon: '◉' },
  ...divisions.map((d, i) => ({ role: 'Divisi ' + d, name: 'Koordinator ' + d, type: 'division', icon: ['⌂','▣','✉','✦','◉','♨','🏆','◌','⚑','♜'][i] }))
];
const defaultItems = [
  { id: 1, name: 'Sewa gedung kegiatan', division: 'Acara', volume: 1, unit: 'hari', price: 12500000, status: 'Lunas', note: 'Gedung Pemuda Nusantara' },
  { id: 2, name: 'Sound system dan panggung', division: 'Perlengkapan', volume: 1, unit: 'paket', price: 8500000, status: 'DP', note: 'Termasuk operator' },
  { id: 3, name: 'Konsumsi peserta', division: 'Konsumsi', volume: 350, unit: 'kotak', price: 35000, status: 'Belum dibayar', note: 'Makan siang dan snack' },
  { id: 4, name: 'Dekorasi dan backdrop', division: 'Dekorasi', volume: 1, unit: 'paket', price: 6750000, status: 'Lunas', note: 'Tema merah putih' },
  { id: 5, name: 'Dokumentasi foto & video', division: 'Dokumentasi', volume: 1, unit: 'paket', price: 5500000, status: 'DP', note: 'Dokumentasi acara' },
  { id: 6, name: 'Publikasi dan desain', division: 'Humas', volume: 1, unit: 'paket', price: 3800000, status: 'Lunas', note: 'Poster dan media sosial' },
  { id: 7, name: 'Hadiah perlombaan', division: 'Lomba', volume: 1, unit: 'paket', price: 6000000, status: 'Belum dibayar', note: 'Piala dan hadiah peserta' },
  { id: 8, name: 'Transportasi operasional', division: 'Lapangan', volume: 1, unit: 'paket', price: 4200000, status: 'Belum dibayar', note: 'Mobilisasi perlengkapan' },
  { id: 9, name: 'Paket sponsor dan relasi', division: 'Sponsorship', volume: 1, unit: 'paket', price: 2500000, status: 'Lunas', note: 'Proposal dan jamuan mitra' },
  { id: 10, name: 'Pengamanan dan kebersihan', division: 'Keamanan', volume: 1, unit: 'paket', price: 2900000, status: 'Lunas', note: 'Petugas keamanan' }
];
const defaultFunding = [
  { id: 1, title: 'Pembelian dekorasi utama', division: 'Dekorasi', nominal: 4500000, category: 'Operasional', status: 'Disetujui', purpose: 'Backdrop, lampu, dan tata ruang' },
  { id: 2, title: 'Biaya konsumsi peserta', division: 'Konsumsi', nominal: 14000000, category: 'Logistik', status: 'Menunggu', purpose: 'Snack dan makanan peserta utama' },
  { id: 3, title: 'Perawatan alat musik', division: 'Perlengkapan', nominal: 3200000, category: 'Peralatan', status: 'Disetujui', purpose: 'Pemeliharaan sound system dan panggung' },
  { id: 4, title: 'Publikasi media sosial', division: 'Humas', nominal: 2700000, category: 'Publikasi', status: 'Ditolak', purpose: 'Iklan dan promosi acara' }
];
const adminUser = { username: 'admin', password: 'sumpahpemuda2024' };

let items = JSON.parse(localStorage.getItem('sumpahPemudaBudget') || 'null') || defaultItems;
let fundingRequests = JSON.parse(localStorage.getItem('sumpahPemudaFunding') || 'null') || defaultFunding;
let team = JSON.parse(localStorage.getItem('sumpahPemudaTeam') || 'null') || defaultTeam;

const $ = (id) => document.getElementById(id);
const rupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n || 0));
const totalItem = (item) => Number(item.volume) * Number(item.price);
const saveBudget = () => localStorage.setItem('sumpahPemudaBudget', JSON.stringify(items));
const saveFunding = () => localStorage.setItem('sumpahPemudaFunding', JSON.stringify(fundingRequests));
const saveTeam = () => localStorage.setItem('sumpahPemudaTeam', JSON.stringify(team));

function toast(message) {
  const t = $('toast');
  t.textContent = message;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function ensureLogin() {
  const logged = localStorage.getItem('spmAdminLoggedIn') === 'true';
  if (!logged) $('loginModalBackdrop').classList.add('show');
  else $('loginModalBackdrop').classList.remove('show');
}

function renderSummary() {
  const budget = items.reduce((sum, item) => sum + totalItem(item), 0);
  const spent = items.filter((item) => item.status !== 'Belum dibayar').reduce((sum, item) => sum + totalItem(item), 0);
  const remaining = budget - spent;
  const percent = budget ? Math.round((spent / budget) * 100) : 0;

  $('totalBudget').textContent = rupiah(budget);
  $('totalSpent').textContent = rupiah(spent);
  $('totalRemaining').textContent = rupiah(remaining);
  $('spentPercent').textContent = percent + '%';
  $('remainingPercent').textContent = (100 - percent) + '%';
  $('overallProgress').style.width = Math.min(percent, 100) + '%';
  $('donutPercent').textContent = percent + '%';
}

function renderSelects() {
  const selected = $('divisionFilter') ? $('divisionFilter').value : 'all';
  $('divisionFilter').innerHTML = '<option value="all">Semua divisi</option>' +
    divisions.map((d) => `<option value="${d}" ${d === selected ? 'selected' : ''}>${d}</option>`).join('');

  if ($('itemDivision')) {
    $('itemDivision').innerHTML = divisions.map((d) => `<option>${d}</option>`).join('');
  }
  if ($('requestDivision')) {
    $('requestDivision').innerHTML = divisions.map((d) => `<option value="${d}">${d}</option>`).join('');
  }
}

function renderTable() {
  const query = ($('searchInput').value || '').toLowerCase();
  const division = $('divisionFilter').value;
  const status = $('statusFilter').value;

  const filtered = items.filter((item) => {
    const text = `${item.name} ${item.note}`.toLowerCase();
    return text.includes(query) && (division === 'all' || item.division === division) && (status === 'all' || item.status === status);
  });

  $('budgetTable').innerHTML = filtered.length
    ? filtered.map((item) => `
      <tr>
        <td>${item.name}<small>${item.note || ''}</small></td>
        <td>${item.division}</td>
        <td>${item.volume} ${item.unit}</td>
        <td>${rupiah(item.price)}</td>
        <td>${rupiah(totalItem(item))}</td>
        <td><span class="status ${item.status === 'Lunas' ? 'lunas' : item.status === 'DP' ? 'dp' : 'belum'}">${item.status}</span></td>
        <td><button class="row-action" onclick="editItem(${item.id})">⋮</button></td>
      </tr>
    `).join('')
    : '<tr><td colspan="7">Tidak ada data yang cocok.</td></tr>';

  $('tableCount').textContent = `Menampilkan ${filtered.length} dari ${items.length} item`;
}

function renderDivisionBreakdown() {
  const totals = divisions
    .map((d) => [d, items.filter((item) => item.division === d).reduce((sum, item) => sum + totalItem(item), 0)])
    .filter(([, total]) => total > 0)
    .sort((a, b) => b[1] - a[1]);

  const totalAll = totals.reduce((sum, [, v]) => sum + v, 0) || 1;
  const colors = ['#3569ee', '#f28b39', '#1ca677', '#7d6ad9', '#e15d79'];

  $('categoryLegend').innerHTML = totals.slice(0, 5).map(([division, value], index) => `
    <div class="legend-row">
      <i style="background:${colors[index % colors.length]};"></i>
      <span>${division}</span>
      <b>${Math.round((value / totalAll) * 100)}%</b>
    </div>
  `).join('');
}

function renderChart() {
  const monthly = Array(12).fill(0);
  items.forEach((item, index) => {
    monthly[index % 12] += totalItem(item);
  });

  const max = Math.max(...monthly, 60000000);
  $('chartBars').innerHTML = monthly.map((v, index) => `
    <div class="bar-pair">
      <i class="bar budget" style="height:${Math.max(8, ((v / max) * 100))}%"></i>
      <i class="bar realization" style="height:${Math.max(4, ((v / max) * (index < 9 ? 68 : 35)))%"></i>
    </div>
  `).join('');
}

function renderTeam() {
  $('teamGrid').innerHTML = team.map((member) => `
    <div class="team-card ${member.type}">
      <div class="team-icon">${member.icon}</div>
      <strong>${member.role}</strong>
      <span>${member.name}</span>
    </div>
  `).join('');
}

function renderFunding() {
  const summary = [
    { label: 'Total diajukan', value: fundingRequests.reduce((sum, r) => sum + r.nominal, 0) },
    { label: 'Disetujui', value: fundingRequests.filter((r) => r.status === 'Disetujui').reduce((sum, r) => sum + r.nominal, 0) },
    { label: 'Diproses', value: fundingRequests.filter((r) => r.status === 'Menunggu').length },
    { label: 'Ditolak', value: fundingRequests.filter((r) => r.status === 'Ditolak').length }
  ];

  $('approvalSummary').innerHTML = summary.map((item) => `
    <div class="mini-stat">
      <span>${item.label}</span>
      <strong>${item.label.includes('Total') || item.label.includes('Disetujui') ? rupiah(item.value) : item.value}</strong>
    </div>
  `).join('');

  $('fundingTable').innerHTML = fundingRequests.map((request) => `
    <tr>
      <td>${request.title}</td>
      <td>${request.division}</td>
      <td>${rupiah(request.nominal)}</td>
      <td>${request.category}</td>
      <td><span class="status ${request.status === 'Disetujui' ? 'lunas' : request.status === 'Ditolak' ? 'belum' : 'dp'}">${request.status}</span></td>
      <td>${request.purpose}</td>
      <td>
        <button class="action-small approve" data-action="approve" data-id="${request.id}">Setujui</button>
        <button class="action-small reject" data-action="reject" data-id="${request.id}">Tolak</button>
      </td>
    </tr>
  `).join('');
}

function renderReportCards() {
  const budgetsByStatus = {
    Lunas: items.filter((i) => i.status === 'Lunas').reduce((sum, i) => sum + totalItem(i), 0),
    DP: items.filter((i) => i.status === 'DP').reduce((sum, i) => sum + totalItem(i), 0),
    'Belum dibayar': items.filter((i) => i.status === 'Belum dibayar').reduce((sum, i) => sum + totalItem(i), 0),
  };

  const allTotal = items.reduce((sum, item) => sum + totalItem(item), 0);
  const topDiv = divisions
    .map((d) => ({ d, v: items.filter((i) => i.division === d).reduce((sum, i) => sum + totalItem(i), 0) }))
    .sort((a, b) => b.v - a.v)[0];

  const cards = [
    { title: 'Total penggunaan', body: `${rupiah(allTotal)}` },
    { title: 'Status pembayaran', body: `Lunas ${rupiah(budgetsByStatus.Lunas)} / DP ${rupiah(budgetsByStatus.DP)} / Belum bayar ${rupiah(budgetsByStatus['Belum dibayar'])}` },
    { title: 'Divisi paling besar', body: `${topDiv.d} (${rupiah(topDiv.v)})` },
    { title: 'Catatan penting', body: 'Realisasi masih berada dalam target, pengajuan dana perlu dipantau tiap divisi secara berkala.' },
    { title: 'Pencairan kebutuhan', body: `${fundingRequests.filter((r) => r.status === 'Disetujui').length} pengajuan disetujui` },
    { title: 'Kondisi terakhir', body: 'Semua divisi telah menyiapkan kebutuhan dan data pelaksanaan event sudah siap dipertanggungjawabkan.' }
  ];

  $('reportGrid').innerHTML = cards.map((card) => `
    <article class="report-card">
      <h3>${card.title}</h3>
      <p>${card.body}</p>
    </article>
  `).join('');
}

function openBudgetModal(item = null) {
  $('modalBackdrop').classList.add('show');
  $('modalTitle').textContent = item ? 'Edit anggaran' : 'Tambah anggaran';
  $('editId').value = item ? item.id : '';
  $('itemName').value = item ? item.name : '';
  $('itemDivision').value = item ? item.division : divisions[0];
  $('itemStatus').value = item ? item.status : 'Belum dibayar';
  $('itemVolume').value = item ? item.volume : 1;
  $('itemUnit').value = item ? item.unit : 'paket';
  $('itemPrice').value = item ? item.price : '';
  $('itemNote').value = item ? item.note : '';
  $('itemName').focus();
}

function closeBudgetModal() {
  $('modalBackdrop').classList.remove('show');
}

function openFundingModal() {
  $('fundingModalBackdrop').classList.add('show');
}

function closeFundingModal() {
  $('fundingModalBackdrop').classList.remove('show');
}

window.editItem = (id) => {
  const item = items.find((entry) => entry.id === Number(id));
  if (item) openBudgetModal(item);
};

$('budgetForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const id = Number($('editId').value);
  const data = {
    id: id || Date.now(),
    name: $('itemName').value,
    division: $('itemDivision').value,
    volume: Number($('itemVolume').value),
    unit: $('itemUnit').value,
    price: Number($('itemPrice').value),
    status: $('itemStatus').value,
    note: $('itemNote').value
  };

  if (id) {
    items = items.map((item) => (item.id === id ? data : item));
  } else {
    items = [...items, data];
  }

  saveBudget();
  renderSummary();
  renderTable();
  renderDivisionBreakdown();
  renderChart();
  renderReportCards();
  closeBudgetModal();
  toast(id ? 'Anggaran berhasil diperbarui' : 'Anggaran berhasil ditambahkan');
});

$('fundingForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const request = {
    id: Date.now(),
    title: $('requestTitle').value,
    division: $('requestDivision').value,
    nominal: Number($('requestAmount').value),
    category: $('requestCategory').value,
    status: 'Menunggu',
    purpose: $('requestPurpose').value,
  };

  fundingRequests = [request, ...fundingRequests];
  saveFunding();
  renderFunding();
  renderReportCards();
  $('fundingForm').reset();
  closeFundingModal();
  toast('Pengajuan dana berhasil dikirim');
});

$('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const username = $('loginUsername').value.trim();
  const password = $('loginPassword').value.trim();

  if (username === adminUser.username && password === adminUser.password) {
    localStorage.setItem('spmAdminLoggedIn', 'true');
    $('loginModalBackdrop').classList.remove('show');
    $('currentUserName').textContent = 'Admin Panitia';
    toast('Login berhasil');
  } else {
    toast('Username atau password salah');
  }
});

document.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  const id = Number(actionButton.dataset.id);
  fundingRequests = fundingRequests.map((request) => {
    if (request.id !== id) return request;
    return { ...request, status: action === 'approve' ? 'Disetujui' : 'Ditolak' };
  });

  saveFunding();
  renderFunding();
  renderReportCards();
  toast(action === 'approve' ? 'Pengajuan disetujui' : 'Pengajuan ditolak');
});

$('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', String(document.body.classList.contains('dark')));
});

$('menuToggle').addEventListener('click', () => $('sidebar').classList.toggle('open'));
$('resetFilter').addEventListener('click', () => {
  $('searchInput').value = '';
  $('divisionFilter').value = 'all';
  $('statusFilter').value = 'all';
  renderTable();
});
$('addTopBtn').addEventListener('click', () => openBudgetModal());
$('addTableBtn').addEventListener('click', () => openBudgetModal());
$('addRequestBtn').addEventListener('click', () => openFundingModal());
$('closeModal').addEventListener('click', closeBudgetModal);
$('cancelModal').addEventListener('click', closeBudgetModal);
$('modalBackdrop').addEventListener('click', (event) => {
  if (event.target.id === 'modalBackdrop') closeBudgetModal();
});
$('closeFundingModal').addEventListener('click', closeFundingModal);
$('cancelFundingModal').addEventListener('click', closeFundingModal);
$('fundingModalBackdrop').addEventListener('click', (event) => {
  if (event.target.id === 'fundingModalBackdrop') closeFundingModal();
});
$('searchInput').addEventListener('input', renderTable);
$('divisionFilter').addEventListener('change', renderTable);
$('statusFilter').addEventListener('change', renderTable);
$('printBtn').addEventListener('click', () => window.print());
$('teamPrintBtn').addEventListener('click', () => window.print());
$('reportBtn').addEventListener('click', () => toast('Laporan pertanggungjawaban siap dicetak'));
$('reportBtn2').addEventListener('click', () => toast('Laporan pertanggungjawaban siap dicetak'));
$('exportBtn').addEventListener('click', () => {
  const rows = [['Nama anggaran', 'Divisi', 'Volume', 'Satuan', 'Harga satuan', 'Total', 'Status', 'Keterangan'], ...items.map((row) => [row.name, row.division, row.volume, row.unit, row.price, totalItem(row), row.status, row.note])];
  const csv = rows.map((r) => r.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'rab-sumpah-pemuda.csv';
  a.click();
  toast('Data berhasil diekspor ke CSV');
});

if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');
renderSelects();
renderSummary();
renderTable();
renderDivisionBreakdown();
renderChart();
renderTeam();
renderFunding();
renderReportCards();
ensureLogin();
