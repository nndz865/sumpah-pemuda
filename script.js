const divisions = [
  'Lapangan', 'Perlengkapan', 'Humas', 'Dekorasi', 'Dokumentasi', 'Konsumsi', 'Lomba', 'Sponsorship', 'Acara', 'Keamanan'
];

const defaultTeam = [
  { id: 1, role: 'Ketua Pelaksana', name: 'Nama Ketua Pelaksana', type: 'lead', icon: '★' },
  { id: 2, role: 'Wakil Pelaksana', name: 'Nama Wakil Pelaksana', type: 'lead', icon: '◆' },
  { id: 3, role: 'Sekretaris', name: 'Nama Sekretaris', type: 'lead', icon: '✎' },
  { id: 4, role: 'Bendahara', name: 'Nama Bendahara', type: 'lead', icon: '◉' },
  ...divisions.map((division, index) => ({
    id: index + 101,
    role: `Divisi ${division}`,
    name: `Koordinator ${division}`,
    type: 'division',
    icon: ['⌂', '▣', '✉', '✦', '◉', '♨', '🏆', '◌', '⚑', '♜'][index]
  }))
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
  const loggedIn = localStorage.getItem('spmAdminLoggedIn') === 'true';
  if (!loggedIn) {
    $('loginModalBackdrop').classList.add('show');
  } else {
    $('loginModalBackdrop').classList.remove('show');
    $('currentUserName').textContent = 'Admin Panitia';
  }
}

function render() {
  const totalBudget = items.reduce((sum, item) => sum + totalItem(item), 0);
  const totalSpent = items.filter((item) => item.status !== 'Belum dibayar').reduce((sum, item) => sum + totalItem(item), 0);
  const totalRemaining = totalBudget - totalSpent;
  const percent = totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0;

  $('totalBudget').textContent = rupiah(totalBudget);
  $('totalSpent').textContent = rupiah(totalSpent);
  $('totalRemaining').textContent = rupiah(totalRemaining);
  $('spentPercent').textContent = `${percent}%`;
  $('remainingPercent').textContent = `${100 - percent}%`;
  $('overallProgress').style.width = `${Math.min(percent, 100)}%`;
  $('donutPercent').textContent = `${percent}%`;

  renderSelects();
  renderTable();
  renderDivisions();
  renderChart();
  renderTeam();
  renderFunding();
  renderReport();
}

function renderSelects() {
  const selectedDivision = $('divisionFilter') ? $('divisionFilter').value : 'all';
  $('divisionFilter').innerHTML = '<option value="all">Semua divisi</option>' + divisions.map((d) => `<option value="${d}" ${d === selectedDivision ? 'selected' : ''}>${d}</option>`).join('');
  $('itemDivision').innerHTML = divisions.map((d) => `<option value="${d}">${d}</option>`).join('');
  if ($('requestDivision')) {
    $('requestDivision').innerHTML = divisions.map((d) => `<option value="${d}">${d}</option>`).join('');
  }
}

function renderTable() {
  const q = $('searchInput').value.toLowerCase();
  const division = $('divisionFilter').value;
  const status = $('statusFilter').value;

  const filtered = items.filter((item) => {
    const matchesText = (item.name + ' ' + item.note).toLowerCase().includes(q);
    const matchesDivision = division === 'all' || item.division === division;
    const matchesStatus = status === 'all' || item.status === status;
    return matchesText && matchesDivision && matchesStatus;
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

function renderDivisions() {
  const totals = divisions
    .map((division) => [division, items.filter((item) => item.division === division).reduce((sum, item) => sum + totalItem(item), 0)])
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);

  const all = totals.reduce((sum, [, value]) => sum + value, 0) || 1;
  const colors = ['#3569ee', '#f28b39', '#21ad77', '#8b68dc', '#e15d79'];

  $('categoryLegend').innerHTML = totals.slice(0, 5).map(([name, value], index) => `
    <div class="legend-row">
      <i style="background:${colors[index] || '#3569ee'}"></i>
      <span>${name}</span>
      <b>${Math.round((value / all) * 100)}%</b>
    </div>
  `).join('');
}

function renderChart() {
  const monthly = Array(12).fill(0);
  items.forEach((item, index) => {
    monthly[index % 12] += totalItem(item);
  });

  const max = Math.max(...monthly, 60000000);
  $('chartBars').innerHTML = monthly.map((value, index) => `
    <div class="bar-pair">
      <i class="bar budget" style="height:${Math.max(8, (value / max) * 100)}%"></i>
      <i class="bar realization" style="height:${Math.max(4, (value / max) * (index < 9 ? 68 : 35))}%"></i>
    </div>
  `).join('');
}

function renderTeam() {
  $('teamGrid').innerHTML = team.map((member) => `
    <div class="team-card ${member.type}">
      <button class="team-edit" data-team-id="${member.id}">✎</button>
      <div class="team-icon">${member.icon}</div>
      <strong>${member.role}</strong>
      <span>${member.name}</span>
    </div>
  `).join('');
}

function renderFunding() {
  const totalApproved = fundingRequests.filter((req) => req.status === 'Disetujui').reduce((sum, req) => sum + req.nominal, 0);
  const totalPending = fundingRequests.filter((req) => req.status === 'Menunggu').length;
  const totalRejected = fundingRequests.filter((req) => req.status === 'Ditolak').length;

  $('approvalSummary').innerHTML = `
    <div class="mini-stat"><span>Total diajukan</span><strong>${rupiah(fundingRequests.reduce((sum, req) => sum + req.nominal, 0))}</strong></div>
    <div class="mini-stat"><span>Disetujui</span><strong>${rupiah(totalApproved)}</strong></div>
    <div class="mini-stat"><span>Menunggu</span><strong>${totalPending}</strong></div>
    <div class="mini-stat"><span>Ditolak</span><strong>${totalRejected}</strong></div>
  `;

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

function renderReport() {
  const totalBudget = items.reduce((sum, item) => sum + totalItem(item), 0);
  const totalSpent = items.filter((item) => item.status !== 'Belum dibayar').reduce((sum, item) => sum + totalItem(item), 0);
  const pending = fundingRequests.filter((req) => req.status === 'Menunggu').length;
  const largestDivision = divisions
    .map((division) => ({ division, total: items.filter((item) => item.division === division).reduce((sum, item) => sum + totalItem(item), 0) }))
    .sort((a, b) => b.total - a.total)[0];

  $('reportSummary').innerHTML = `
    <div class="report-box">
      <h3>Ikhtisar paling penting</h3>
      <ul>
        <li><span>Total anggaran</span><strong>${rupiah(totalBudget)}</strong></li>
        <li><span>Realisasi</span><strong>${rupiah(totalSpent)}</strong></li>
        <li><span>Sisa anggaran</span><strong>${rupiah(totalBudget - totalSpent)}</strong></li>
      </ul>
    </div>
    <div class="report-box">
      <h3>Prioritas divisi</h3>
      <ul>
        <li><span>Divisi terbanyak</span><strong>${largestDivision ? largestDivision.division : '-'}</strong></li>
        <li><span>Nilai divisi</span><strong>${largestDivision ? rupiah(largestDivision.total) : 'Rp0'}</strong></li>
        <li><span>Pengajuan pending</span><strong>${pending}</strong></li>
      </ul>
    </div>
    <div class="report-box">
      <h3>Catatan operasional</h3>
      <ul>
        <li><span>Anggaran terpakai</span><strong>${Math.round(totalBudget ? (totalSpent / totalBudget) * 100 : 0)}%</strong></li>
        <li><span>Item aktif</span><strong>${items.length}</strong></li>
        <li><span>Status keuangan</span><strong>${totalSpent >= totalBudget * 0.85 ? 'Tinggi' : 'Aman'}</strong></li>
      </ul>
    </div>
  `;
}

function openModal(item = null) {
  $('modalBackdrop').classList.add('show');
  $('modalTitle').textContent = item ? 'Edit anggaran' : 'Tambah anggaran';
  $('editId').value = item?.id || '';
  $('itemName').value = item?.name || '';
  $('itemDivision').value = item?.division || divisions[0];
  $('itemStatus').value = item?.status || 'Belum dibayar';
  $('itemVolume').value = item?.volume || 1;
  $('itemUnit').value = item?.unit || 'paket';
  $('itemPrice').value = item?.price || 0;
  $('itemNote').value = item?.note || '';
  $('itemName').focus();
}

function closeModal() {
  $('modalBackdrop').classList.remove('show');
}

function openFundingModal() {
  $('fundingModalBackdrop').classList.add('show');
}

function closeFundingModal() {
  $('fundingModalBackdrop').classList.remove('show');
}

function openTeamModal(memberId = null) {
  const member = team.find((item) => item.id === memberId) || team[0];
  $('teamId').value = member?.id || '';
  $('teamRole').value = member?.role || '';
  $('teamName').value = member?.name || '';
  $('teamIcon').value = member?.icon || '★';
  $('teamModalBackdrop').classList.add('show');
}

function closeTeamModal() { $('teamModalBackdrop').classList.remove('show'); }

window.editItem = (id) => openModal(items.find((item) => item.id === id));

$('budgetForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const id = Number($('editId').value);
  const payload = {
    id: id || Date.now(),
    name: $('itemName').value.trim(),
    division: $('itemDivision').value,
    status: $('itemStatus').value,
    volume: Number($('itemVolume').value),
    unit: $('itemUnit').value.trim(),
    price: Number($('itemPrice').value),
    note: $('itemNote').value.trim()
  };

  items = id ? items.map((item) => (item.id === id ? payload : item)) : [...items, payload];
  saveBudget();
  render();
  closeModal();
  toast(id ? 'Anggaran berhasil diperbarui' : 'Anggaran baru berhasil ditambahkan');
});

$('fundingForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const payload = {
    id: Date.now(),
    title: $('requestTitle').value.trim(),
    division: $('requestDivision').value,
    nominal: Number($('requestAmount').value),
    category: $('requestCategory').value,
    status: 'Menunggu',
    purpose: $('requestPurpose').value.trim()
  };

  fundingRequests = [payload, ...fundingRequests];
  saveFunding();
  render();
  closeFundingModal();
  $('fundingForm').reset();
  toast('Pengajuan dana berhasil dikirim');
});

$('teamForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const id = Number($('teamId').value);
  const payload = {
    id: id || Date.now(),
    role: $('teamRole').value.trim(),
    name: $('teamName').value.trim(),
    type: 'division',
    icon: $('teamIcon').value.trim() || '★'
  };

  team = team.map((member) => (member.id === id ? { ...member, ...payload } : member));
  if (!team.some((member) => member.id === id)) team = [...team, payload];
  saveTeam();
  render();
  closeTeamModal();
  toast('Data panitia berhasil diperbarui');
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
  const actionBtn = event.target.closest('[data-action]');
  if (actionBtn) {
    const requestId = Number(actionBtn.dataset.id);
    const action = actionBtn.dataset.action;
    fundingRequests = fundingRequests.map((req) => req.id === requestId ? { ...req, status: action === 'approve' ? 'Disetujui' : 'Ditolak' } : req);
    saveFunding();
    render();
    toast(action === 'approve' ? 'Pengajuan disetujui' : 'Pengajuan ditolak');
    return;
  }

  const teamEditBtn = event.target.closest('[data-team-id]');
  if (teamEditBtn) {
    openTeamModal(Number(teamEditBtn.dataset.teamId));
  }
});

['addTopBtn', 'addTableBtn'].forEach((id) => $(id).addEventListener('click', () => openModal()));
['closeModal', 'cancelModal'].forEach((id) => $(id).addEventListener('click', closeModal));
$('modalBackdrop').addEventListener('click', (event) => {
  if (event.target.id === 'modalBackdrop') closeModal();
});
$('closeFundingModal').addEventListener('click', closeFundingModal);
$('cancelFundingModal').addEventListener('click', closeFundingModal);
$('fundingModalBackdrop').addEventListener('click', (event) => {
  if (event.target.id === 'fundingModalBackdrop') closeFundingModal();
});
$('closeTeamModal').addEventListener('click', closeTeamModal);
$('cancelTeamModal').addEventListener('click', closeTeamModal);
$('teamModalBackdrop').addEventListener('click', (event) => {
  if (event.target.id === 'teamModalBackdrop') closeTeamModal();
});
$('addRequestBtn').addEventListener('click', openFundingModal);
$('teamEditBtn').addEventListener('click', () => openTeamModal(team[0]?.id || 1));
$('reportBtn').addEventListener('click', () => {
  const summary = renderReport();
  toast('Laporan ringkas berhasil disiapkan');
  return summary;
});
$('printBtn').addEventListener('click', () => window.print());
$('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});
$('menuToggle').addEventListener('click', () => $('sidebar').classList.toggle('open'));
$('resetFilter').addEventListener('click', () => {
  $('searchInput').value = '';
  $('divisionFilter').value = 'all';
  $('statusFilter').value = 'all';
  renderTable();
});
$('searchInput').addEventListener('input', renderTable);
$('divisionFilter').addEventListener('input', renderTable);
$('statusFilter').addEventListener('input', renderTable);
$('exportBtn').addEventListener('click', () => {
  const rows = [
    ['Nama anggaran', 'Divisi', 'Volume', 'Satuan', 'Harga satuan', 'Total', 'Status', 'Keterangan'],
    ...items.map((item) => [item.name, item.division, item.volume, item.unit, item.price, totalItem(item), item.status, item.note])
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  link.download = 'rab-sumpah-pemuda.csv';
  link.click();
  toast('Data CSV berhasil diunduh');
});

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}

ensureLogin();
render();
