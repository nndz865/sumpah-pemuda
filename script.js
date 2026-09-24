const divisions = ['Lapangan', 'Perlengkapan', 'Humas', 'Dekorasi', 'Dokumentasi', 'Konsumsi', 'Lomba', 'Sponsorship', 'Acara', 'Keamanan'];
const teamRoles = ['Ketua Pelaksana', 'Wakil Pelaksana', 'Sekretaris', 'Bendahara', ...divisions.map((d) => `Divisi ${d}`)];

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
  { id: 10, name: 'Pengamanan dan kebersihan', division: 'Keamanan', volume: 1, unit: 'paket', price: 2900000, status: 'Lunas', note: 'Petugas keamanan' },
];

const defaultFunding = [
  { id: 1, title: 'Pembelian dekorasi utama', division: 'Dekorasi', nominal: 4500000, category: 'Operasional', status: 'Disetujui', purpose: 'Backdrop, lampu, dan tata ruang' },
  { id: 2, title: 'Biaya konsumsi peserta', division: 'Konsumsi', nominal: 14000000, category: 'Logistik', status: 'Menunggu', purpose: 'Snack dan makanan peserta utama' },
  { id: 3, title: 'Perawatan alat musik', division: 'Perlengkapan', nominal: 3200000, category: 'Peralatan', status: 'Disetujui', purpose: 'Pemeliharaan sound system dan panggung' },
  { id: 4, title: 'Publikasi media sosial', division: 'Humas', nominal: 2700000, category: 'Publikasi', status: 'Ditolak', purpose: 'Iklan dan promosi acara' },
];

const defaultTeam = [
  { id: 1, role: 'Ketua Pelaksana', name: 'Nama Ketua Pelaksana', icon: '★', type: 'lead' },
  { id: 2, role: 'Wakil Pelaksana', name: 'Nama Wakil Pelaksana', icon: '◆', type: 'lead' },
  { id: 3, role: 'Sekretaris', name: 'Nama Sekretaris', icon: '✎', type: 'lead' },
  { id: 4, role: 'Bendahara', name: 'Nama Bendahara', icon: '◉', type: 'lead' },
  ...divisions.map((d, i) => ({
    id: i + 100,
    role: `Divisi ${d}`,
    name: `Koordinator ${d}`,
    icon: ['⌂', '▣', '✉', '✦', '◉', '♨', '🏆', '◌', '⚑', '♜'][i],
    type: 'division',
  })),
];

const adminUser = { username: 'admin', password: 'sumpahpemuda2024' };
let items = JSON.parse(localStorage.getItem('sumpahPemudaBudget') || 'null') || defaultItems;
let fundingRequests = JSON.parse(localStorage.getItem('sumpahPemudaFunding') || 'null') || defaultFunding;
let team = JSON.parse(localStorage.getItem('sumpahPemudaTeam') || 'null') || defaultTeam;

const $ = (selector) => document.getElementById(selector);
const rupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n || 0));
const totalItem = (item) => Number(item.volume) * Number(item.price);
const saveBudget = () => localStorage.setItem('sumpahPemudaBudget', JSON.stringify(items));
const saveFunding = () => localStorage.setItem('sumpahPemudaFunding', JSON.stringify(fundingRequests));
const saveTeam = () => localStorage.setItem('sumpahPemudaTeam', JSON.stringify(team));

function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function ensureLogin() {
  const isLogged = localStorage.getItem('spmAdminLoggedIn') === 'true';
  if (!isLogged) $('loginModalBackdrop').classList.add('show');
  else $('loginModalBackdrop').classList.remove('show');
}

function renderStats() {
  const totalBudget = items.reduce((sum, i) => sum + totalItem(i), 0);
  const totalSpent = items.filter((i) => i.status !== 'Belum dibayar').reduce((sum, i) => sum + totalItem(i), 0);
  const usedPercent = totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0;

  $('totalBudget').textContent = rupiah(totalBudget);
  $('totalSpent').textContent = rupiah(totalSpent);
  $('totalRemaining').textContent = rupiah(totalBudget - totalSpent);
  $('spentPercent').textContent = `${usedPercent}%`;
  $('remainingPercent').textContent = `${100 - usedPercent}%`;
  $('overallProgress').style.width = `${Math.min(usedPercent, 100)}%`;
  $('donutPercent').textContent = `${usedPercent}%`;
}

function renderSelects() {
  const selectedDivision = $('divisionFilter') ? $('divisionFilter').value : 'all';
  $('divisionFilter').innerHTML = '<option value="all">Semua divisi</option>' + divisions.map((d) => `<option value="${d}" ${d === selectedDivision ? 'selected' : ''}>${d}</option>`).join('');

  if ($('itemDivision')) {
    $('itemDivision').innerHTML = divisions.map((d) => `<option value="${d}">${d}</option>`).join('');
  }

  if ($('requestDivision')) {
    const selectedReq = $('requestDivision').value || divisions[0];
    $('requestDivision').innerHTML = divisions.map((d) => `<option value="${d}" ${d === selectedReq ? 'selected' : ''}>${d}</option>`).join('');
  }

  if ($('teamRole')) {
    $('teamRole').innerHTML = teamRoles.map((role) => `<option value="${role}">${role}</option>`).join('');
  }
}

function renderTable() {
  const keyword = ($('searchInput')?.value || '').toLowerCase();
  const selectedDivision = $('divisionFilter')?.value || 'all';
  const selectedStatus = $('statusFilter')?.value || 'all';

  const filtered = items.filter((item) => {
    const matchText = (item.name + ' ' + (item.note || '')).toLowerCase().includes(keyword);
    const matchDivision = selectedDivision === 'all' || item.division === selectedDivision;
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchText && matchDivision && matchStatus;
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
    : '<tr><td colspan="7" style="text-align:center; color:#7a879c;">Tidak ada data yang cocok.</td></tr>';

  $('tableCount').textContent = `Menampilkan ${filtered.length} dari ${items.length} item`;
}

function renderCategoryLegend() {
  const totals = divisions
    .map((division) => ({ division, total: items.filter((item) => item.division === division).reduce((sum, item) => sum + totalItem(item), 0) }))
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total);

  const grandTotal = totals.reduce((sum, item) => sum + item.total, 0) || 1;
  const colors = ['#3569ee', '#f28b39', '#1ca677', '#7d6ad9', '#e15d79'];

  $('categoryLegend').innerHTML = totals.slice(0, 5).map((item, index) => `
    <div class="legend-row">
      <i style="background:${colors[index] || '#a5b4cf'"></i>
      <span>${item.division}</span>
      <b>${Math.round((item.total / grandTotal) * 100)}%</b>
    </div>
  `).join('');
}

function renderChart() {
  const monthly = Array(12).fill(0);
  items.forEach((item) => {
    const idx = (new Date().getMonth() + 1) % 12; // fallback simple distribution
    monthly[(idx + (Math.round(item.price / 1000000) % 12)) % 12] += totalItem(item);
  });

  const max = Math.max(...monthly, 60000000);
  $('chartBars').innerHTML = monthly.map((value, index) => `
    <div class="bar-pair">
      <i class="bar budget" style="height:${Math.max(8, (value / max) * 100)}%"></i>
      <i class="bar realization" style="height:${Math.max(4, (value / max) * 72)}%"></i>
    </div>
  `).join('');
}

function renderFunding() {
  const summary = [
    { label: 'Total diajukan', value: fundingRequests.reduce((sum, req) => sum + Number(req.nominal), 0) },
    { label: 'Disetujui', value: fundingRequests.filter((req) => req.status === 'Disetujui').reduce((sum, req) => sum + Number(req.nominal), 0) },
    { label: 'Diproses', value: fundingRequests.filter((req) => req.status === 'Menunggu').length },
    { label: 'Ditolak', value: fundingRequests.filter((req) => req.status === 'Ditolak').length },
  ];

  $('approvalSummary').innerHTML = summary.map((item) => `
    <div class="mini-stat">
      <span>${item.label}</span>
      <strong>${item.label.includes('Total') || item.label.includes('Disetujui') ? rupiah(item.value) : item.value}</strong>
    </div>
  `).join('');

  $('fundingTable').innerHTML = fundingRequests.map((req) => `
    <tr>
      <td>${req.title}</td>
      <td>${req.division}</td>
      <td>${rupiah(req.nominal)}</td>
      <td>${req.category}</td>
      <td><span class="status ${req.status === 'Disetujui' ? 'lunas' : req.status === 'Ditolak' ? 'belum' : 'dp'}">${req.status}</span></td>
      <td>${req.purpose}</td>
      <td>
        <button class="action-small approve" data-action="approve" data-id="${req.id}">Setujui</button>
        <button class="action-small reject" data-action="reject" data-id="${req.id}">Tolak</button>
      </td>
    </tr>
  `).join('');
}

function renderTeam() {
  $('teamGrid').innerHTML = team.map((person) => `
    <div class="team-card ${person.type}">
      <div class="team-icon">${person.icon}</div>
      <strong>${person.role}</strong>
      <span>${person.name}</span>
      <small class="team-edit" onclick="editTeam(${person.id})" style="display:block; margin-top:8px; color:#3569ee; cursor:pointer;">Edit</small>
    </div>
  `).join('');
}

function renderReportSummary() {
  const totalBudget = items.reduce((sum, item) => sum + totalItem(item), 0);
  const totalSpent = items.filter((item) => item.status !== 'Belum dibayar').reduce((sum, item) => sum + totalItem(item), 0);
  const activeRequests = fundingRequests.filter((req) => req.status === 'Menunggu').length;
  const totalMembers = team.length;

  const rows = [
    { label: 'Total anggaran', value: rupiah(totalBudget) },
    { label: 'Total realisasi', value: rupiah(totalSpent) },
    { label: 'Permintaan aktif', value: `${activeRequests} item` },
    { label: 'Jumlah panitia', value: `${totalMembers} orang` },
  ];

  $('reportSummary').innerHTML = rows.map((row) => `
    <div class="report-card">
      <span>${row.label}</span>
      <strong>${row.value}</strong>
    </div>
  `).join('');
}

function openBudgetModal(item = null) {
  $('budgetModalBackdrop').classList.add('show');
  $('budgetModalTitle').textContent = item ? 'Edit anggaran' : 'Tambah anggaran';
  $('editId').value = item ? item.id : '';
  $('itemName').value = item ? item.name : '';
  $('itemDivision').value = item ? item.division : divisions[0];
  $('itemStatus').value = item ? item.status : 'Belum dibayar';
  $('itemVolume').value = item ? item.volume : 1;
  $('itemUnit').value = item ? item.unit : 'paket';
  $('itemPrice').value = item ? item.price : '';
  $('itemNote').value = item ? item.note : '';
}

function closeBudgetModal() { $('budgetModalBackdrop').classList.remove('show'); }
function openFundingModal() { $('fundingModalBackdrop').classList.add('show'); }
function closeFundingModal() { $('fundingModalBackdrop').classList.remove('show'); }
function openTeamModal(item = null) {
  $('teamModalBackdrop').classList.add('show');
  $('teamModalTitle').textContent = item ? 'Edit panitia' : 'Tambah panitia';
  $('teamEditId').value = item ? item.id : '';
  $('teamRole').value = item ? item.role : teamRoles[0];
  $('teamName').value = item ? item.name : '';
  $('teamIcon').value = item ? item.icon : '★';
}
function closeTeamModal() { $('teamModalBackdrop').classList.remove('show'); }

window.editItem = (id) => openBudgetModal(items.find((item) => item.id === id));
window.editTeam = (id) => openTeamModal(team.find((person) => person.id === id));

$('budgetForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const id = Number($('editId').value);
  const payload = {
    id: id || Date.now(),
    name: $('itemName').value,
    division: $('itemDivision').value,
    status: $('itemStatus').value,
    volume: Number($('itemVolume').value),
    unit: $('itemUnit').value,
    price: Number($('itemPrice').value),
    note: $('itemNote').value,
  };

  if (id) {
    items = items.map((item) => item.id === id ? payload : item);
  } else {
    items = [payload, ...items];
  }

  saveBudget();
  render();
  closeBudgetModal();
  toast(id ? 'Anggaran berhasil diperbarui' : 'Anggaran berhasil ditambahkan');
});

$('fundingForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const payload = {
    id: Date.now(),
    title: $('requestTitle').value,
    division: $('requestDivision').value,
    nominal: Number($('requestAmount').value),
    category: $('requestCategory').value,
    status: 'Menunggu',
    purpose: $('requestPurpose').value,
  };

  fundingRequests = [payload, ...fundingRequests];
  saveFunding();
  renderFunding();
  renderReportSummary();
  closeFundingModal();
  $('fundingForm').reset();
  toast('Pengajuan dana berhasil dikirim');
});

$('teamForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const id = Number($('teamEditId').value);
  const payload = {
    id: id || Date.now(),
    role: $('teamRole').value,
    name: $('teamName').value,
    icon: $('teamIcon').value,
    type: $('teamRole').value.includes('Divisi') ? 'division' : 'lead',
  };

  if (id) {
    team = team.map((person) => person.id === id ? payload : person);
  } else {
    team = [payload, ...team];
  }

  saveTeam();
  renderTeam();
  closeTeamModal();
  toast(id ? 'Data panitia diperbarui' : 'Panitia berhasil ditambahkan');
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

$('addTopBtn').addEventListener('click', () => openBudgetModal());
$('addTableBtn').addEventListener('click', () => openBudgetModal());
$('addRequestBtn').addEventListener('click', () => openFundingModal());
$('addTeamBtn').addEventListener('click', () => openTeamModal());
$('closeBudgetModal').addEventListener('click', closeBudgetModal);
$('cancelBudgetModal').addEventListener('click', closeBudgetModal);
$('closeFundingModal').addEventListener('click', closeFundingModal);
$('cancelFundingModal').addEventListener('click', closeFundingModal);
$('closeTeamModal').addEventListener('click', closeTeamModal);
$('cancelTeamModal').addEventListener('click', closeTeamModal);
$('budgetModalBackdrop').addEventListener('click', (event) => { if (event.target.id === 'budgetModalBackdrop') closeBudgetModal(); });
$('fundingModalBackdrop').addEventListener('click', (event) => { if (event.target.id === 'fundingModalBackdrop') closeFundingModal(); });
$('teamModalBackdrop').addEventListener('click', (event) => { if (event.target.id === 'teamModalBackdrop') closeTeamModal(); });

$('searchInput').addEventListener('input', renderTable);
$('divisionFilter').addEventListener('input', renderTable);
$('statusFilter').addEventListener('input', renderTable);
$('resetFilter').addEventListener('click', () => {
  $('searchInput').value = '';
  $('divisionFilter').value = 'all';
  $('statusFilter').value = 'all';
  renderTable();
});

$('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

$('menuToggle').addEventListener('click', () => $('sidebar').classList.toggle('open'));
$('printBtn').addEventListener('click', () => window.print());
$('reportBtn').addEventListener('click', () => toast('Laporan siap dicetak'));

$('exportBtn').addEventListener('click', () => {
  const rows = [
    ['Nama anggaran', 'Divisi', 'Volume', 'Satuan', 'Harga satuan', 'Total', 'Status', 'Keterangan'],
    ...items.map((item) => [item.name, item.division, item.volume, item.unit, item.price, totalItem(item), item.status, item.note]),
  ];

  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'rab-sumpah-pemuda.csv';
  link.click();
  toast('File CSV berhasil diunduh');
});

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const id = Number(target.dataset.id);
  const action = target.dataset.action;

  fundingRequests = fundingRequests.map((req) => req.id === id ? { ...req, status: action === 'approve' ? 'Disetujui' : 'Ditolak' } : req);
  saveFunding();
  renderFunding();
  renderReportSummary();
  toast(action === 'approve' ? 'Pengajuan disetujui' : 'Pengajuan ditolak');
});

if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');
renderSelects();
renderStats();
renderTable();
renderCategoryLegend();
renderChart();
renderFunding();
renderTeam();
renderReportSummary();
ensureLogin();
