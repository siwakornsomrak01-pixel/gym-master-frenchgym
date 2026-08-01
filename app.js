// Gym Master - Core Application Controller
import * as DB from './data.js';

// ช่วยดาวน์โหลดรายงานออกเป็นไฟล์ CSV (รองรับภาษาไทยผ่าน UTF-8 BOM)
function downloadCSV(filename, headers, rows) {
  const csvContent = "\uFEFF" + [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// เก็บ Instance ของ Chart.js เพื่อรีเซ็ตเวลาอัปเดตข้อมูล
let revenueChartInstance = null;

// บทบาทผู้ใช้ปัจจุบัน: 'owner' (เจ้าของยิม) หรือ 'staff' (พนักงานเคาน์เตอร์)
let currentRole = 'owner';

// ตัวกรองการชำระเงินสำหรับแดชบอร์ดหลัก: 'all', 'โอนผ่านธนาคาร', 'เงินสด', 'บัตรเครดิต'
let currentChartFilter = 'all';

// ตะกร้าสินค้าสำหรับ Beverage POS
let shopCart = [];

// เก็บสถานะฟิลเตอร์การค้นหาสมาชิก
const memberFilterState = {
  searchQuery: '',
  statusFilter: 'all' // all, active, warning, expired
};

// เก็บสถานะเลขหน้าสำหรับการทำ Pagination ตาราง
let membersCurrentPage = 1;
let auditCurrentPage = 1;
const ITEMS_PER_PAGE = 15;

// สังเคราะห์เสียงประกอบด้วย Web Audio API เพื่อแจ้งเตือนการเช็กอินด่วน
function playCheckinSound(status) {
  if (!document.getElementById('sound-checkbox').checked) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();

    if (status === 'active') {
      // เสียง ติ๊ง-ต่อง สูงๆ แสดงความสำเร็จ (Active)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.12); // E5
      
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } else if (status === 'warning') {
      // เสียง ติ๊ง-ติ๊ง แบบระวัง (Warning)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.frequency.setValueAtTime(392.00, audioCtx.currentTime); // G4
      osc.frequency.setValueAtTime(392.00, audioCtx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } else {
      // เสียง ตื๊ด ต่ำ แสดงการปฏิเสธ/หมดอายุ (Expired / Error)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.frequency.setValueAtTime(130.81, audioCtx.currentTime); // C3
      
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.55);
    }
  } catch (err) {
    console.warn('ไม่สามารถเล่นเสียงแจ้งเตือนได้เนื่องจากเบราว์เซอร์บล็อก:', err);
  }
}

// โหลดและเรนเดอร์ไอคอน Lucide ทั่วหน้าเว็บ
function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// ----------------- CONTROL ROLE-BASED SYSTEM -----------------
// ----------------- CONTROL ROLE-BASED SYSTEM -----------------
function updateRoleViews() {
  const user = DB.getCurrentUser();
  if (!user) return;

  currentRole = user.role;

  const navDashboard = document.getElementById('nav-item-dashboard');
  const navBilling = document.getElementById('nav-item-billing');
  const navTraffic = document.getElementById('nav-item-traffic');
  const navAudit = document.getElementById('nav-item-audit');
  
  // แผงควบคุมสมุดบัญชีปิดยอดของเจ้าของยิม
  const dailyReportSection = document.getElementById('owner-daily-report-section');
  const qrPortalSection = document.getElementById('owner-qr-portal-section');
  const userWrapper = document.getElementById('header-user-wrapper');
  
  if (userWrapper) {
    const userIcon = userWrapper.querySelector('.lucide') || userWrapper.querySelector('i');
    if (currentRole === 'staff') {
      userWrapper.style.borderColor = 'var(--accent-orange)';
      if (userIcon) userIcon.style.color = 'var(--accent-orange)';
    } else {
      userWrapper.style.borderColor = 'var(--accent-gold)';
      if (userIcon) userIcon.style.color = 'var(--accent-gold)';
    }
  }

  if (currentRole === 'staff') {
    if (navDashboard) navDashboard.style.display = 'none';
    if (navBilling) navBilling.style.display = 'none';
    if (navAudit) navAudit.style.display = 'none';
    if (navTraffic) navTraffic.style.display = 'block';
    
    if (dailyReportSection) dailyReportSection.style.display = 'none';
    if (qrPortalSection) qrPortalSection.style.display = 'none';

    // ซ่อนปุ่มลบประวัติความเสี่ยงสำหรับพนักงาน
    document.querySelectorAll('.delete-btn').forEach(btn => btn.style.display = 'none');

    const activeLink = document.querySelector('.sidebar .nav-link.active');
    if (activeLink) {
      const activeView = activeLink.dataset.view;
      if (activeView === 'dashboard' || activeView === 'billing' || activeView === 'audit') {
        navigateToView('checkin');
      }
    }
  } else {
    if (navDashboard) navDashboard.style.display = 'block';
    if (navBilling) navBilling.style.display = 'block';
    if (navAudit) navAudit.style.display = 'block';
    if (navTraffic) navTraffic.style.display = 'block';
    
    if (dailyReportSection) dailyReportSection.style.display = 'block';
    if (qrPortalSection) qrPortalSection.style.display = 'block';
    
    // แสดงปุ่มลบสำหรับเจ้าของยิม
    document.querySelectorAll('.delete-btn').forEach(btn => btn.style.display = 'flex');
  }
}

function navigateToView(viewId) {
  const links = document.querySelectorAll('.sidebar .nav-link');
  const targetLink = Array.from(links).find(l => l.dataset.view === viewId);
  
  if (targetLink) {
    links.forEach(l => l.classList.remove('active'));
    targetLink.classList.add('active');

    document.querySelectorAll('.views-container .view-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    const panel = document.getElementById(`${viewId}-view`);
    if (panel) {
      panel.classList.add('active');
    }

    const titleText = targetLink.querySelector('span').textContent;
    document.getElementById('current-view-title').textContent = titleText;

    loadViewData(viewId);
  }
}

function loadViewData(viewId) {
  if (viewId === 'dashboard') {
    renderDashboard();
  } else if (viewId === 'members') {
    renderMembersList();
  } else if (viewId === 'checkin') {
    renderCheckinLogToday();
    resetCheckinPanel();
  } else if (viewId === 'traffic') {
    renderTrafficView();
  } else if (viewId === 'shop') {
    renderShopView();
  } else if (viewId === 'billing') {
    renderBillingAndPlans();
  } else if (viewId === 'audit') {
    renderAuditLogs();
  }
}

// ----------------- AUDIT LOGS VIEW CONTROLLER -----------------
function renderAuditLogs() {
  const auditTableBody = document.getElementById('audit-table-body');
  if (!auditTableBody) return;

  const logs = DB.getAuditLogs() || [];
  const searchVal = document.getElementById('audit-search-input')?.value.toLowerCase() || '';
  const filterAction = document.getElementById('audit-filter-action')?.value || '';

  // อัปเดตข้อมูลวิเคราะห์ระบบเชื่อมต่อคลาวด์
  const connStatusEl = document.getElementById('diagnostic-conn-status');
  const localCountEl = document.getElementById('diagnostic-local-count');
  const cloudCountEl = document.getElementById('diagnostic-cloud-count');
  
  if (connStatusEl) {
    const isConnected = DB.getFirebaseConnectedStatus();
    const lastErr = DB.getLastSyncError();
    if (lastErr) {
      connStatusEl.innerHTML = `<span style="color: var(--color-danger); font-weight: 600;">❌ ล้มเหลว (${lastErr})</span>`;
    } else if (isConnected) {
      connStatusEl.innerHTML = `<span style="color: var(--color-success); font-weight: 600;">🟢 เชื่อมต่อคลาวด์สำเร็จ (Online)</span>`;
    } else {
      connStatusEl.innerHTML = `<span style="color: var(--accent-orange); font-weight: 600;">🟡 โหมดออฟไลน์ (Offline)</span>`;
    }
  }
  
  if (localCountEl) {
    localCountEl.textContent = logs.length;
  }
  
  if (cloudCountEl) {
    if (DB.getFirebaseConnectedStatus()) {
      DB.getCloudCollectionCount('audit_logs').then(count => {
        if (count !== null) {
          cloudCountEl.textContent = count;
        } else {
          cloudCountEl.textContent = 'ขัดข้อง';
        }
      });
    } else {
      cloudCountEl.textContent = 'ปิดการทำงาน';
    }
  }

  const filteredLogs = logs.filter(log => {
    if (!log) return false;
    const logId = (log.id || '').toLowerCase();
    const userName = (log.userName || '').toLowerCase();
    const action = (log.action || '').toLowerCase();
    const details = (log.details || '').toLowerCase();

    // 1. ค้นหาความตรงตามคำค้น
    const matchSearch = userName.includes(searchVal) ||
                        action.includes(searchVal) ||
                        details.includes(searchVal) ||
                        logId.includes(searchVal);
    
    // 2. คัดกรองตามหมวดหมู่กิจกรรม
    const matchAction = !filterAction || log.action === filterAction;

    return matchSearch && matchAction;
  });

  auditTableBody.innerHTML = '';

  const totalCount = filteredLogs.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
  if (auditCurrentPage > totalPages) auditCurrentPage = totalPages;
  if (auditCurrentPage < 1) auditCurrentPage = 1;

  const startIndex = (auditCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalCount);
  const pageLogs = filteredLogs.slice(startIndex, endIndex);

  // อัปเดตข้อมูลตัวเลขหน้า Pagination
  const pageStartEl = document.getElementById('audit-page-start');
  const pageEndEl = document.getElementById('audit-page-end');
  const totalCountEl = document.getElementById('audit-total-count');
  const currentPageNumEl = document.getElementById('audit-current-page-num');
  const prevBtn = document.getElementById('btn-audit-prev-page');
  const nextBtn = document.getElementById('btn-audit-next-page');

  if (pageStartEl) pageStartEl.textContent = totalCount === 0 ? 0 : startIndex + 1;
  if (pageEndEl) pageEndEl.textContent = endIndex;
  if (totalCountEl) totalCountEl.textContent = totalCount;
  if (currentPageNumEl) currentPageNumEl.textContent = auditCurrentPage;
  
  if (prevBtn) prevBtn.disabled = (auditCurrentPage === 1);
  if (nextBtn) nextBtn.disabled = (auditCurrentPage === totalPages);

  auditTableBody.innerHTML = '';

  if (pageLogs.length === 0) {
    auditTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 30px; color: var(--text-secondary);">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <i data-lucide="shield-alert" style="width: 32px; height: 32px; color: var(--text-secondary);"></i>
            <p>ไม่พบรายการประวัติประมวลผลที่ต้องการค้นหา</p>
          </div>
        </td>
      </tr>
    `;
    refreshIcons();
    return;
  }

  pageLogs.forEach(log => {
    const tr = document.createElement('tr');
    
    const userName = log.userName || 'ระบบหลัก';
    const logId = log.id || '';
    const timestamp = log.timestamp || '';
    const action = log.action || '';
    const details = log.details || '';

    // สร้าง Badge สำหรับผู้ปฏิบัติงานตามสิทธิ์
    let badgeClass = 'system';
    if (userName.includes('Owner')) {
      badgeClass = 'owner';
    } else if (userName.includes('Staff')) {
      badgeClass = 'staff';
    }

    tr.innerHTML = `
      <td style="font-family: var(--font-eng); font-weight: 600; color: var(--text-secondary);">${logId}</td>
      <td style="font-family: var(--font-eng); font-size: 13px;">${timestamp}</td>
      <td>
        <span class="audit-badge ${badgeClass}">${userName}</span>
      </td>
      <td style="font-weight: 500; color: var(--text-primary);">${action}</td>
      <td style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">${details}</td>
    `;
    auditTableBody.appendChild(tr);
  });

  refreshIcons();
}

// ----------------- 1. DASHBOARD VIEW CONTROLLER -----------------
function renderDashboard() {
  const members = DB.getMembers();
  const rawTxs = DB.getTransactions();
  const rawShopSales = DB.getShopSales();
  const checkins = DB.getCheckins();

  let txs = [...rawTxs];
  let shopSales = [...rawShopSales];

  if (currentChartFilter !== 'all') {
    txs = txs.filter(t => t.paymentMethod === currentChartFilter);
    shopSales = shopSales.filter(s => s.paymentMethod === currentChartFilter);
  }

  const totalCount = members.length;
  const activeCount = members.filter(m => m.status === 'active').length;
  const expiredCount = members.filter(m => m.status === 'expired').length;
  
  const membershipRev = txs.reduce((sum, tx) => sum + tx.amount, 0);
  const shopRev = shopSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalRevenue = membershipRev + shopRev;

  document.getElementById('kpi-total-members').textContent = totalCount;
  document.getElementById('kpi-active-members').textContent = activeCount;
  document.getElementById('kpi-expired-members').textContent = expiredCount;
  document.getElementById('kpi-total-revenue').textContent = `฿${totalRevenue.toLocaleString('th-TH')}`;

  const checkinsList = document.getElementById('dashboard-checkins-list');
  checkinsList.innerHTML = '';
  
  const todayDateStr = DB.formatDateString(DB.getGymTodayDate());
  const todayCheckins = checkins.filter(c => c.timestamp.startsWith(todayDateStr)).slice(0, 5);

  if (todayCheckins.length === 0) {
    checkinsList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;">
        ยังไม่มีการเช็กชื่อเข้าใช้งานในวันนี้
      </div>
    `;
  } else {
    todayCheckins.forEach(c => {
      const initials = c.memberName.substring(0, 2);
      const member = members.find(m => m.id === c.memberId);
      const gradient = member ? member.avatarGradient : 'linear-gradient(135deg, #A0A0A0, #626272)';
      
      let badgeThai = 'ปกติ';
      if (c.status === 'expired') badgeThai = 'หมดอายุ';
      if (c.status === 'warning') badgeThai = 'ใกล้หมด';

      const timeOnly = c.timestamp.split(' ')[1];

      const row = document.createElement('div');
      row.className = 'checkin-row';
      row.innerHTML = `
        <div class="checkin-user-info">
          <div class="checkin-avatar" style="background: ${gradient}">${initials}</div>
          <div class="checkin-detail">
            <span class="checkin-name">${c.memberName}</span>
            <span class="checkin-plan">${c.planName}</span>
          </div>
        </div>
        <div class="checkin-meta">
          <span class="checkin-time font-eng">${timeOnly} น.</span>
          <div><span class="badge ${c.status}">${badgeThai}</span></div>
        </div>
      `;
      checkinsList.appendChild(row);
    });
  }

  // ตั้งค่าแสดงผลลิงก์และ QR Code บนคอนโซล Owner
  const qrImg = document.getElementById('owner-portal-qr-img');
  const urlText = document.getElementById('owner-portal-url-text');
  
  if (qrImg && urlText) {
    const portalUrl = window.location.origin + window.location.pathname + '?portal=true';
    urlText.textContent = portalUrl;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(portalUrl)}`;
  }

  renderRevenueChart(membershipRev, shopRev);
  refreshIcons();
}

function renderRevenueChart(membershipRev, shopRev) {
  const ctx = document.getElementById('revenue-chart').getContext('2d');
  
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
  }

  revenueChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['ค่าสมัครสมาชิก (Membership)', 'ยอดขายเครื่องดื่ม (Beverage Sales)'],
      datasets: [{
        data: [membershipRev, shopRev],
        backgroundColor: [
          'rgba(255, 95, 31, 0.7)',
          'rgba(255, 215, 0, 0.7)'
        ],
        borderColor: [
          '#ff5f1f',
          '#ffd700'
        ],
        borderWidth: 1.5,
        borderRadius: 8,
        barPercentage: 0.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: { family: 'Prompt', size: 13 },
          bodyFont: { family: 'Prompt', size: 12 },
          callbacks: {
            label: function(context) {
              return ` ยอดรวม: ฿${context.parsed.y.toLocaleString('th-TH')}`;
            }
          }
        }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#a0a0b0',
            font: { family: 'Prompt', size: 11 },
            callback: function(value) { return '฿' + value.toLocaleString(); }
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#a0a0b0', font: { family: 'Prompt', size: 12 } }
        }
      }
    }
  });
}

// ----------------- 2. MEMBERS VIEW CONTROLLER -----------------
function renderMembersList() {
  const members = DB.getMembers();
  const plans = DB.getPlans();
  const tableBody = document.getElementById('members-table-body');
  tableBody.innerHTML = '';

  const query = memberFilterState.searchQuery.toLowerCase().trim();
  const statusFilter = memberFilterState.statusFilter;

  const filteredMembers = members.filter(m => {
    if (m.id.startsWith('GM-W-')) return false;

    const matchQuery = 
      m.id.toLowerCase().includes(query) ||
      m.fullname.toLowerCase().includes(query) ||
      m.phone.includes(query);

    let matchStatus = true;
    if (statusFilter !== 'all') {
      matchStatus = (m.status === statusFilter);
    }

    return matchQuery && matchStatus;
  });

  const totalCount = filteredMembers.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
  if (membersCurrentPage > totalPages) membersCurrentPage = totalPages;
  if (membersCurrentPage < 1) membersCurrentPage = 1;

  const startIndex = (membersCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalCount);
  const pageMembers = filteredMembers.slice(startIndex, endIndex);

  // อัปเดตตัวเลขหน้า Pagination ของสมาชิก
  const pageStartEl = document.getElementById('members-page-start');
  const pageEndEl = document.getElementById('members-page-end');
  const totalCountEl = document.getElementById('members-total-count');
  const currentPageNumEl = document.getElementById('members-current-page-num');
  const prevBtn = document.getElementById('btn-members-prev-page');
  const nextBtn = document.getElementById('btn-members-next-page');

  if (pageStartEl) pageStartEl.textContent = totalCount === 0 ? 0 : startIndex + 1;
  if (pageEndEl) pageEndEl.textContent = endIndex;
  if (totalCountEl) totalCountEl.textContent = totalCount;
  if (currentPageNumEl) currentPageNumEl.textContent = membersCurrentPage;

  if (prevBtn) prevBtn.disabled = (membersCurrentPage === 1);
  if (nextBtn) nextBtn.disabled = (membersCurrentPage === totalPages);

  if (pageMembers.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
          ไม่พบรายชื่อสมาชิกตามเงื่อนไขที่ระบุ
        </td>
      </tr>
    `;
    return;
  }

  pageMembers.forEach(m => {
    const initials = m.fullname.substring(0, 2);
    const plan = plans.find(p => p.id === m.planId);
    const planName = plan ? plan.name : 'ไม่ระบุ';
    
    let statusText = 'ปกติ';
    if (m.status === 'expired') statusText = 'หมดอายุ';
    if (m.status === 'warning') statusText = 'ใกล้หมด';

    const expDate = new Date(m.expiryDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const dateFormatted = expDate.toLocaleDateString('th-TH', options);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-eng" style="font-weight: 600;">${m.id}</td>
      <td>
        <div class="table-user-info">
          <div class="member-avatar" style="background: ${m.avatarGradient}">${initials}</div>
          <div>
            <div class="member-fullname">
              ${m.fullname}
              ${m.lineUserId ? `<span class="line-status-badge" title="LINE ID: ${m.lineUserId}"><i data-lucide="shield-check" style="width: 10px; height: 10px; display: inline-block; vertical-align: middle; margin-right: 2px;"></i>LINE ผูกแล้ว</span>` : ''}
            </div>
            <div class="member-subtext">เพศ: ${m.gender} | สมัครเมื่อ: ${m.joinDate}</div>
          </div>
        </div>
      </td>
      <td class="font-eng">${m.phone}</td>
      <td>${planName}</td>
      <td>
        <div class="font-eng">${m.expiryDate}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${dateFormatted}</div>
      </td>
      <td><span class="badge ${m.status}">${statusText}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn view" data-id="${m.id}" title="ดูรายละเอียด"><i data-lucide="eye"></i></button>
          <button class="action-btn edit" data-id="${m.id}" title="แก้ไขข้อมูล"><i data-lucide="edit-3"></i></button>
          ${currentRole === 'owner' ? `<button class="action-btn delete" data-id="${m.id}" title="ลบสมาชิก"><i data-lucide="trash-2"></i></button>` : ''}
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  tableBody.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', () => openDetailModal(btn.dataset.id));
  });
  tableBody.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', () => openMemberFormModal(btn.dataset.id));
  });
  tableBody.querySelectorAll('.action-btn.delete').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteMember(btn.dataset.id));
  });

  refreshIcons();
}

function handleDeleteMember(id) {
  const members = DB.getMembers();
  const member = members.find(m => m.id === id);
  if (!member) return;

  if (confirm(`คุณต้องการลบข้อมูลของ "${member.fullname}" หรือไม่? ข้อมูลทั้งหมดจะสูญหาย`)) {
    DB.deleteMember(id);
    renderMembersList();
  }
}

function openMemberFormModal(id = null) {
  const modal = document.getElementById('member-modal');
  const title = document.getElementById('member-modal-title');
  const form = document.getElementById('member-form');
  
  const plans = DB.getPlans();
  const planSelect = document.getElementById('form-plan');
  planSelect.innerHTML = plans.map(p => `<option value="${p.id}">${p.name} (฿${p.price.toLocaleString()})</option>`).join('');

  form.reset();
  
  document.getElementById('form-special-checkbox').checked = false;
  document.getElementById('form-special-input-wrapper').classList.remove('active');
  document.getElementById('form-special-price').required = false;

  const lineStatusContainer = document.getElementById('modal-line-status-container');
  const btnUnlinkLine = document.getElementById('btn-unlink-line');
  if (lineStatusContainer) lineStatusContainer.style.display = 'none';

  if (id) {
    title.textContent = 'แก้ไขข้อมูลสมาชิก';
    const members = DB.getMembers();
    const m = members.find(item => item.id === id);
    if (m) {
      document.getElementById('form-member-id').value = m.id;
      document.getElementById('form-fullname').value = m.fullname;
      document.getElementById('form-phone').value = m.phone;
      document.getElementById('form-email').value = m.email === '-' ? '' : m.email;
      document.getElementById('form-gender').value = m.gender;
      document.getElementById('form-plan').value = m.planId;
      document.getElementById('form-joindate').value = m.joinDate;
      document.getElementById('form-expirydate').value = m.expiryDate;

      if (m.lineUserId && lineStatusContainer && btnUnlinkLine) {
        lineStatusContainer.style.display = 'flex';
        const newUnlinkBtn = btnUnlinkLine.cloneNode(true);
        btnUnlinkLine.parentNode.replaceChild(newUnlinkBtn, btnUnlinkLine);
        newUnlinkBtn.addEventListener('click', () => {
          if (confirm(`คุณต้องการปลดล็อกการเชื่อมต่อ LINE ของ "${m.fullname}" ใช่หรือไม่?`)) {
            DB.unlinkMemberLine(m.id);
            lineStatusContainer.style.display = 'none';
            renderMembersList();
            alert('ปลดการเชื่อมต่อ LINE สำเร็จ!');
          }
        });
      }
    }
  } else {
    title.textContent = 'ลงทะเบียนสมาชิกใหม่';
    document.getElementById('form-member-id').value = '';
    const todayStr = DB.formatDateString(DB.getGymTodayDate());
    document.getElementById('form-joindate').value = todayStr;
    updateFormExpiryDate();
  }

  modal.classList.add('active');
}

function updateFormExpiryDate() {
  const joinDateVal = document.getElementById('form-joindate').value;
  const planId = document.getElementById('form-plan').value;
  if (!joinDateVal || !planId) return;

  const plans = DB.getPlans();
  const plan = plans.find(p => p.id === planId);
  if (!plan) return;

  const joinDate = new Date(joinDateVal);
  const expiryDate = new Date(joinDate);
  expiryDate.setDate(joinDate.getDate() + plan.durationDays);

  document.getElementById('form-expirydate').value = DB.formatDateString(expiryDate);
  document.getElementById('form-special-price').value = plan.price;
}

function handleMemberFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('form-member-id').value;
  
  const memberData = {
    fullname: document.getElementById('form-fullname').value,
    phone: document.getElementById('form-phone').value,
    email: document.getElementById('form-email').value,
    gender: document.getElementById('form-gender').value,
    planId: document.getElementById('form-plan').value,
    joinDate: document.getElementById('form-joindate').value,
    expiryDate: document.getElementById('form-expirydate').value
  };

  const plans = DB.getPlans();
  const selectedPlan = plans.find(p => p.id === memberData.planId);

  const isSpecial = document.getElementById('form-special-checkbox').checked;
  let paymentAmount = selectedPlan ? selectedPlan.price : 0;
  
  if (isSpecial) {
    paymentAmount = Number(document.getElementById('form-special-price').value);
    if (isNaN(paymentAmount) || paymentAmount < 0) {
      alert('❌ กรุณากรอกราคาพิเศษที่ถูกต้อง (ห้ามติดลบ)');
      return;
    }
  }

  if (id) {
    const success = DB.updateMember({ id, ...memberData });
    if (success) {
      alert('แก้ไขข้อมูลสมาชิกเรียบร้อยแล้ว');
    }
  } else {
    const newMember = DB.addMember(memberData);
    if (selectedPlan && newMember) {
      const planNameNote = isSpecial ? `${selectedPlan.name} (เรตพิเศษ)` : selectedPlan.name;
      const transactions = DB.getTransactions();
      
      const now = DB.getGymTodayDate();
      const dateStr = now.getFullYear() + '-' + 
                      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(now.getDate()).padStart(2, '0') + ' ' + 
                      String(now.getHours()).padStart(2, '0') + ':' + 
                      String(now.getMinutes()).padStart(2, '0');

      const txId = 'TX-' + (1000 + transactions.length + 1);
      
      const newTx = {
        id: txId,
        memberId: newMember.id,
        memberName: newMember.fullname,
        planId: selectedPlan.id,
        planName: planNameNote,
        amount: paymentAmount,
        paymentMethod: 'เงินสด',
        date: dateStr
      };
      
      transactions.unshift(newTx);
      DB.saveTransactions(transactions);
    }
    alert(`ลงทะเบียนสำเร็จ! รหัสสมาชิกคือ: ${newMember.id} ยอดเงินชำระ: ฿${paymentAmount}`);
  }

  document.getElementById('member-modal').classList.remove('active');
  renderMembersList();
}

// ----------------- 3. QUICK CHECK-IN VIEW CONTROLLER -----------------
function renderCheckinLogToday() {
  const checkins = DB.getCheckins();
  const logList = document.getElementById('today-checkin-log-list');
  logList.innerHTML = '';

  const todayDateStr = DB.formatDateString(DB.getGymTodayDate());
  const todayLogs = checkins.filter(c => c.timestamp.startsWith(todayDateStr));

  if (todayLogs.length === 0) {
    logList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 15px; font-size: 13px;">
        ยังไม่มีประวัติการเช็กชื่อในวันนี้
      </div>
    `;
    return;
  }

  todayLogs.forEach(log => {
    const time = log.timestamp.split(' ')[1];
    let badgeText = 'ปกติ';
    if (log.status === 'expired') badgeText = 'หมดอายุ';
    if (log.status === 'warning') badgeText = 'ใกล้หมด';

    const div = document.createElement('div');
    div.className = 'checkin-row';
    div.style.padding = '8px 12px';
    div.innerHTML = `
      <div>
        <div style="font-size: 13px; font-weight: 500;">${log.memberName} (${log.memberId})</div>
        <div style="font-size: 10px; color: var(--text-muted);">${log.planName}</div>
      </div>
      <div class="text-right">
        <div style="font-size: 11px;" class="font-eng">${time}</div>
        <span class="badge ${log.status}" style="font-size: 9px; padding: 2px 4px;">${badgeText}</span>
      </div>
    `;
    logList.appendChild(div);
  });
}

function resetCheckinPanel() {
  const panel = document.getElementById('checkin-result-panel');
  if (panel) {
    panel.className = 'checkin-status-panel empty';
    panel.innerHTML = `
      <div class="status-display">
        <div class="status-icon"><i data-lucide="info"></i></div>
        <div class="status-message">กรุณาระบุรหัสสมาชิกเพื่อตรวจสอบ</div>
        <p style="color: var(--text-secondary); font-size: 14px;">พิมพ์รหัสและกดปุ่มยืนยันเช็กอินด้านซ้ายเพื่อดูสิทธิ์</p>
      </div>
    `;
    refreshIcons();
  }
}

function handleQuickCheckin(e) {
  e.preventDefault();
  const inputField = document.getElementById('checkin-member-id');
  const code = inputField.value.trim();
  if (!code) return;

  const result = DB.checkInMember(code);
  const panel = document.getElementById('checkin-result-panel');
  panel.className = 'checkin-status-panel';

  if (!result.success) {
    panel.classList.add('expired');
    panel.innerHTML = `
      <div class="status-display">
        <div class="status-icon"><i data-lucide="x-circle"></i></div>
        <div class="status-message">ไม่พบสมาชิก</div>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">ไม่พบบัญชีสมาชิกหรือหมายเลขโทรศัพท์ "${code}" ในยิมนี้</p>
        <button class="secondary-btn" id="checkin-retry-btn" style="width: auto; padding: 8px 20px;">ลองใหม่อีกครั้ง</button>
      </div>
    `;
    playCheckinSound('expired');
  } else {
    const m = result.member;
    const initials = m.fullname.substring(0, 2);
    
    const today = DB.getGymTodayDate();
    today.setHours(0,0,0,0);
    const expiry = new Date(m.expiryDate);
    expiry.setHours(0,0,0,0);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    let statusHeader = 'อนุญาตให้เข้ายิมได้';
    let statusDesc = `สมาชิกสถานะปกติ (เหลืออายุการใช้งานอีก ${diffDays} วัน)`;
    
    if (result.status === 'expired') {
      statusHeader = 'ระงับสิทธิ์เข้าใช้งาน!';
      statusDesc = 'แพ็กเกจสมาชิกของคุณหมดอายุแล้ว กรุณาติดต่อต่ออายุที่เคาน์เตอร์';
      panel.classList.add('expired');
    } else if (result.status === 'warning') {
      statusHeader = 'ผ่าน (สิทธิ์ใกล้หมดอายุ)';
      statusDesc = `สมาชิกจะหมดอายุในอีก ${diffDays} วันโปรดชำระค่าบริการล่วงหน้า`;
      panel.classList.add('warning');
    } else {
      panel.classList.add('active');
    }

    let statusText = 'ปกติ';
    if (result.status === 'expired') statusText = 'หมดอายุ';
    if (result.status === 'warning') statusText = 'ใกล้หมด';

    panel.innerHTML = `
      <div class="status-display" style="width: 100%;">
        <div class="status-icon">
          ${result.status === 'active' ? '<i data-lucide="check-circle-2"></i>' : ''}
          ${result.status === 'warning' ? '<i data-lucide="alert-triangle"></i>' : ''}
          ${result.status === 'expired' ? '<i data-lucide="shield-alert"></i>' : ''}
        </div>
        <div class="status-message">${statusHeader}</div>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">${statusDesc}</p>
        
        <div class="status-member-card">
          <div class="status-member-avatar" style="background: ${m.avatarGradient}">${initials}</div>
          <div class="status-member-details">
            <span class="status-member-name">${m.fullname}</span>
            <span class="status-member-id">${m.id} | เบอร์: ${m.phone}</span>
            <span class="status-member-expiry">แพ็กเกจ: ${result.planName}</span>
            <span style="font-size: 11px; margin-top: 4px; display: inline-block;">
              วันหมดอายุ: <strong class="font-eng" style="color: #fff;">${m.expiryDate}</strong> 
              (<span class="badge ${result.status}" style="font-size: 9px; padding: 1px 4px;">${statusText}</span>)
            </span>
          </div>
        </div>
        
        <button class="secondary-btn" id="checkin-clear-btn" style="width: auto; padding: 8px 20px; margin-top: 24px;">ถัดไป</button>
      </div>
    `;
    playCheckinSound(result.status);
  }

  inputField.value = '';
  inputField.focus();

  renderCheckinLogToday();
  refreshIcons();

  const clearBtn = document.getElementById('checkin-clear-btn');
  if (clearBtn) clearBtn.addEventListener('click', resetCheckinPanel);
  const retryBtn = document.getElementById('checkin-retry-btn');
  if (retryBtn) retryBtn.addEventListener('click', resetCheckinPanel);
}

function handleQuickDailyPassSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('daily-pass-name');
  const priceInput = document.getElementById('daily-pass-price');
  const paymentSelect = document.getElementById('daily-pass-payment');

  const fullname = nameInput.value.trim() || 'ลูกค้า Walk-in';
  const amount = Number(priceInput.value);
  if (isNaN(amount) || amount < 0) {
    alert('❌ กรุณากรอกราคากลางที่ถูกต้อง (ห้ามติดลบ)');
    return;
  }

  const result = DB.sellWalkInDaily(fullname, amount, paymentMethod);
  const panel = document.getElementById('checkin-result-panel');
  panel.className = 'checkin-status-panel active';

  const m = result.member;
  const initials = m.fullname.substring(0, 2);

  panel.innerHTML = `
    <div class="status-display" style="width: 100%;">
      <div class="status-icon"><i data-lucide="check-circle-2" style="color: var(--color-success);"></i></div>
      <div class="status-message" style="color: var(--color-success);">ซื้อตั๋วรายวันสำเร็จ! (เช็กอินทันที)</div>
      <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">ชำระเงินค่าบริการ ฿${result.amount} เรียบร้อยแล้ว (สิทธิ์ใช้งานถึงเวลาปิดบริการวันนี้)</p>
      
      <div class="status-member-card" style="border-color: rgba(16, 185, 129, 0.3); background-color: rgba(16, 185, 129, 0.05);">
        <div class="status-member-avatar" style="background: ${m.avatarGradient}">${initials}</div>
        <div class="status-member-details">
          <span class="status-member-name">${m.fullname}</span>
          <span class="status-member-id">${m.id} (ตั๋วรายวันชั่วคราว)</span>
          <span class="status-member-expiry">จ่ายโดย: ${paymentMethod}</span>
          <span style="font-size: 11px; margin-top: 4px; display: inline-block;">
            วันหมดอายุ: <strong class="font-eng" style="color: #fff;">${m.expiryDate}</strong>
          </span>
        </div>
      </div>
      
      <button class="secondary-btn" id="checkin-clear-btn" style="width: auto; padding: 8px 20px; margin-top: 24px;">ถัดไป</button>
    </div>
  `;

  playCheckinSound('active');

  nameInput.value = '';
  priceInput.value = '150';
  paymentSelect.value = 'เงินสด';

  renderCheckinLogToday();
  refreshIcons();

  const clearBtn = document.getElementById('checkin-clear-btn');
  if (clearBtn) clearBtn.addEventListener('click', resetCheckinPanel);
}

// ----------------- 4. TRAFFIC VIEW CONTROLLER -----------------
function renderTrafficView() {
  const checkins = DB.getCheckins();
  const tableBody = document.getElementById('traffic-table-body');
  tableBody.innerHTML = '';

  const datePicker = document.getElementById('traffic-date-picker');
  if (!datePicker.value) {
    const todayStr = DB.formatDateString(DB.getGymTodayDate());
    datePicker.value = todayStr;
  }

  const selectedDateStr = datePicker.value;
  const filteredLogs = checkins.filter(c => c.timestamp.startsWith(selectedDateStr));

  if (filteredLogs.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">
          ยังไม่มีทราฟฟิกประวัติคนเข้ายิมในวันที่เลือก
        </td>
      </tr>
    `;
    return;
  }

  filteredLogs.forEach(c => {
    let statusText = 'ปกติ';
    if (c.status === 'expired') statusText = 'หมดอายุ';
    if (c.status === 'warning') statusText = 'ใกล้หมด';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-eng" style="color: var(--text-secondary);">${c.timestamp.split(' ')[1]} น.</td>
      <td class="font-eng" style="font-weight: 600;">${c.memberId}</td>
      <td style="font-weight: 500;">${c.memberName}</td>
      <td>${c.planName}</td>
      <td><span class="badge ${c.status}">${statusText}</span></td>
    `;
    tableBody.appendChild(tr);
  });
  
  refreshIcons();
}

// ----------------- 5. BEVERAGE POS VIEW CONTROLLER -----------------
function renderShopView() {
  const products = DB.getProducts();
  const catalogGrid = document.getElementById('shop-products-grid');
  catalogGrid.innerHTML = '';

  if (products.length === 0) {
    catalogGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px; border: 1px dashed var(--border-color); border-radius: var(--border-radius);">
        ยังไม่มีสินค้าเครื่องดื่มในร้านค้าขณะนี้ (เจ้าของยิมสามารถตั้งค่าและเพิ่มรายการสินค้าได้ที่หน้าการเงิน)
      </div>
    `;
    renderCart();
    return;
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => addToCart(p.id);
    
    card.innerHTML = `
      <div class="product-icon-wrapper">
        <i data-lucide="${p.icon || 'droplet'}"></i>
      </div>
      <div class="product-name-txt">${p.name}</div>
      <div class="product-price-txt">฿${p.price}</div>
    `;
    catalogGrid.appendChild(card);
  });

  renderCart();
  refreshIcons();
}

function addToCart(productId) {
  const products = DB.getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cartItemIndex = shopCart.findIndex(item => item.product.id === productId);
  if (cartItemIndex !== -1) {
    shopCart[cartItemIndex].qty++;
  } else {
    shopCart.push({ product, qty: 1 });
  }

  renderCart();
}

function updateCartQty(productId, amount) {
  const cartItemIndex = shopCart.findIndex(item => item.product.id === productId);
  if (cartItemIndex === -1) return;

  shopCart[cartItemIndex].qty += amount;
  if (shopCart[cartItemIndex].qty <= 0) {
    shopCart.splice(cartItemIndex, 1);
  }

  renderCart();
}

function renderCart() {
  const cartList = document.getElementById('cart-items-list');
  cartList.innerHTML = '';

  let total = 0;

  if (shopCart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty-message">ไม่มีสินค้าในตะกร้า เลือกสินค้าทางด้านซ้าย</div>
    `;
    document.getElementById('cart-total-value').textContent = '฿0';
    return;
  }

  shopCart.forEach(item => {
    const itemTotal = item.product.price * item.qty;
    total += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.product.name}</span>
        <span class="cart-item-price font-eng">฿${item.product.price} x ${item.qty}</span>
      </div>
      <div class="cart-item-actions">
        <button class="cart-qty-btn font-eng" onclick="event.stopPropagation(); window.updateCartQty('${item.product.id}', -1)">-</button>
        <span class="cart-item-qty">${item.qty}</span>
        <button class="cart-qty-btn font-eng" onclick="event.stopPropagation(); window.updateCartQty('${item.product.id}', 1)">+</button>
      </div>
    `;
    cartList.appendChild(row);
  });

  document.getElementById('cart-total-value').textContent = `฿${total.toLocaleString()}`;
}

function handleShopCheckout(e) {
  e.preventDefault();
  if (shopCart.length === 0) {
    alert('ไม่มีสินค้าในตะกร้าเพื่อทำรายการชำระเงิน');
    return;
  }

  const paymentMethod = document.getElementById('shop-payment-method').value;
  const items = shopCart.map(item => ({
    productId: item.product.id,
    name: item.product.name,
    qty: item.qty,
    price: item.product.price
  }));

  const total = shopCart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  const sale = DB.addShopSale(items, total, paymentMethod);
  if (sale) {
    playCheckinSound('active');
    alert(`บันทึกการขายน้ำสำเร็จ! เลขใบเสร็จ: ${sale.id} ยอดรวม ฿${total}`);
    shopCart = [];
    renderCart();
  }
}

// ----------------- 6. BILLING & PLANS VIEW CONTROLLER -----------------
function renderBillingAndPlans() {
  const plans = DB.getPlans();
  const txs = DB.getTransactions();
  const shopSales = DB.getShopSales();
  const products = DB.getProducts();

  // 1. เรนเดอร์การ์ดแผนการบริการ
  const plansContainer = document.getElementById('plans-container');
  plansContainer.innerHTML = '';

  plans.forEach(p => {
    const card = document.createElement('div');
    card.className = 'plan-card';
    card.innerHTML = `
      <h4 class="plan-name">${p.name}</h4>
      <div class="plan-price-display">
        <span class="plan-price-num">${p.price.toLocaleString()}</span>
        <span class="plan-price-currency">บาท</span>
      </div>
      <div class="plan-duration">มีผลครอบคลุมนาน ${p.durationDays} วัน</div>
      <button class="secondary-btn edit-plan-btn" data-id="${p.id}">
        <i data-lucide="edit-2" style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
        แก้ไขค่าบริการ
      </button>
    `;
    plansContainer.appendChild(card);
  });

  plansContainer.querySelectorAll('.edit-plan-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditPlanModal(btn.dataset.id));
  });

  // 2. เรนเดอร์เครื่องดื่มสำหรับ CRUD (Owner view เท่านั้น)
  const productTableBody = document.getElementById('drink-manager-table-body');
  productTableBody.innerHTML = '';

  if (products.length === 0) {
    productTableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px;">
          ยังไม่มีรายการสินค้าเครื่องดื่มขายหน้าร้าน กดปุ่มเพื่อเพิ่ม
        </td>
      </tr>
    `;
  } else {
    products.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="kpi-icon-wrapper" style="width: 32px; height: 32px; border-radius: 6px; font-size: 14px; background-color: rgba(255, 95, 31, 0.08);">
            <i data-lucide="${p.icon || 'droplet'}"></i>
          </div>
        </td>
        <td style="font-weight: 500;">${p.name}</td>
        <td class="font-eng" style="font-weight: 600;">฿${p.price}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn edit product-edit-btn" data-id="${p.id}" title="แก้ไข"><i data-lucide="edit-2"></i></button>
            <button class="action-btn delete product-delete-btn" data-id="${p.id}" title="ลบ"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      `;
      productTableBody.appendChild(tr);
    });

    productTableBody.querySelectorAll('.product-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openProductModal(btn.dataset.id));
    });
    productTableBody.querySelectorAll('.product-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => handleDeleteProduct(btn.dataset.id));
    });
  }

  // 3. เรนเดอร์ประวัติการเงินค่าสมาชิก
  const tableBody = document.getElementById('billing-table-body');
  tableBody.innerHTML = '';

  if (txs.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
          ยังไม่พบรายการชำระเงินในระบบ
        </td>
      </tr>
    `;
  } else {
    txs.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-eng" style="font-weight: 600; color: var(--accent-orange);">${t.id}</td>
        <td>
          <div style="font-weight: 500;">${t.memberName}</div>
          <div style="font-size: 11px; color: var(--text-muted);">รหัส: ${t.memberId}</div>
        </td>
        <td>${t.planName}</td>
        <td class="font-eng" style="font-weight: 600;">฿${t.amount.toLocaleString()}</td>
        <td>
          <span style="background-color: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 4px 8px; border-radius: 4px; font-size: 12px;">
            ${t.paymentMethod}
          </span>
        </td>
        <td class="font-eng" style="color: var(--text-secondary);">${t.date}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // 4. เรนเดอร์ประวัติการเงินขายของร้านน้ำ
  const shopSalesBody = document.getElementById('shop-sales-table-body');
  shopSalesBody.innerHTML = '';

  if (shopSales.length === 0) {
    shopSalesBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">
          ยังไม่พบประวัติการขายสินค้าเครื่องดื่มในยิม
        </td>
      </tr>
    `;
  } else {
    shopSales.forEach(s => {
      const itemsList = s.items.map(item => `${item.name} (x${item.qty})`).join(', ');
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-eng" style="font-weight: 600; color: var(--accent-gold);">${s.id}</td>
        <td style="font-size: 13px;">${itemsList}</td>
        <td class="font-eng" style="font-weight: 600;">฿${s.total.toLocaleString()}</td>
        <td>
          <span style="background-color: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 4px 8px; border-radius: 4px; font-size: 12px;">
            ${s.paymentMethod}
          </span>
        </td>
        <td class="font-eng" style="color: var(--text-secondary);">${s.date}</td>
      `;
      shopSalesBody.appendChild(tr);
    });
  }

  loadSelectedDailyReport();
  refreshIcons();
}

function openEditPlanModal(id) {
  const modal = document.getElementById('edit-plan-modal');
  const plans = DB.getPlans();
  const plan = plans.find(p => p.id === id);

  if (plan) {
    document.getElementById('edit-plan-id').value = plan.id;
    document.getElementById('edit-plan-name').value = plan.name;
    document.getElementById('edit-plan-price').value = plan.price;
    modal.classList.add('active');
  }
}

function handleEditPlanSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('edit-plan-id').value;
  const newPrice = document.getElementById('edit-plan-price').value;

  const success = DB.updatePlanPrice(id, newPrice);
  if (success) {
    alert('บันทึกปรับราคาแพ็กเกจเรียบร้อยแล้ว');
    document.getElementById('edit-plan-modal').classList.remove('active');
    renderBillingAndPlans();
  }
}

// ----------------- CRUD PRODUCTS (BEVERAGES) CONTROLLERS -----------------
function openProductModal(id = null) {
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('product-modal-title');
  const form = document.getElementById('product-form');
  
  form.reset();

  if (id) {
    title.textContent = 'แก้ไขข้อมูลสินค้าเครื่องดื่ม';
    const products = DB.getProducts();
    const p = products.find(item => item.id === id);
    if (p) {
      document.getElementById('form-product-id').value = p.id;
      document.getElementById('form-product-name').value = p.name;
      document.getElementById('form-product-price').value = p.price;
      document.getElementById('form-product-icon').value = p.icon;
    }
  } else {
    title.textContent = 'เพิ่มเครื่องดื่มขายหน้าร้าน';
    document.getElementById('form-product-id').value = '';
  }

  modal.classList.add('active');
}

function handleProductFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('form-product-id').value;
  const name = document.getElementById('form-product-name').value;
  const price = document.getElementById('form-product-price').value;
  const icon = document.getElementById('form-product-icon').value;

  if (id) {
    DB.updateProduct(id, name, price, icon);
    alert('แก้ไขรายละเอียดสินค้าเครื่องดื่มเรียบร้อย');
  } else {
    DB.addProduct(name, price, icon);
    alert('เพิ่มสินค้าใหม่เข้าร้านค้าเรียบร้อย');
  }

  document.getElementById('product-modal').classList.remove('active');
  renderBillingAndPlans();
}

function handleDeleteProduct(id) {
  if (confirm('คุณต้องการลบเครื่องดื่มรายการนี้ออกจากร้านขายหน้าร้านหรือไม่?')) {
    DB.deleteProduct(id);
    renderBillingAndPlans();
  }
}

// ----------------- DAILY SUMMARY ARCHIVE RENDERS -----------------
function loadSelectedDailyReport() {
  const datePicker = document.getElementById('archive-date-picker');
  
  if (!datePicker.value) {
    const todayStr = DB.formatDateString(DB.getGymTodayDate());
    datePicker.value = todayStr;
  }

  const dateStr = datePicker.value;
  const summary = DB.getDailySummary(dateStr);

  document.getElementById('daily-sum-members').textContent = `฿${summary.membershipSales.toLocaleString()}`;
  document.getElementById('daily-sum-beverages').textContent = `฿${summary.shopSales.toLocaleString()}`;
  document.getElementById('daily-sum-passes').textContent = `${summary.dailyPasses} ใบ`;
  document.getElementById('daily-sum-users').textContent = `${summary.checkinsCount} คน`;
  document.getElementById('daily-sum-total').textContent = `฿${summary.totalRevenue.toLocaleString()}`;

  renderDailyArchivesTable();
}

function renderDailyArchivesTable() {
  const archives = DB.getArchivedSummaries();
  const tbody = document.getElementById('daily-archives-table-body');
  tbody.innerHTML = '';

  if (archives.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">
          ยังไม่ประวัติบันทึกการปิดยอดบัญชีรายวัน
        </td>
      </tr>
    `;
    return;
  }

  const sortedArchives = [...archives].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedArchives.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-eng" style="font-weight: 600;">${a.date}</td>
      <td class="font-eng">฿${a.membershipSales.toLocaleString()}</td>
      <td class="font-eng">฿${a.shopSales.toLocaleString()}</td>
      <td class="font-eng">${a.dailyPasses} ใบ</td>
      <td class="font-eng">${a.checkinsCount} คน</td>
      <td class="font-eng" style="font-weight: 600; color: var(--accent-gold);">฿${a.totalRevenue.toLocaleString()}</td>
      <td><span class="badge active" style="font-size: 10px; padding: 2px 6px; background-color: rgba(16, 185, 129, 0.1); color: var(--color-success); border: 1px solid rgba(16, 185, 129, 0.2);">ปิดยอดเสร็จ</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function handleCloseTodayLedger() {
  const dateStr = document.getElementById('archive-date-picker').value;
  if (!dateStr) return;

  const summary = DB.getDailySummary(dateStr);

  if (confirm(`คุณต้องการปิดยอดบัญชีรายวันของวันที่ "${dateStr}" ใช่หรือไม่? ยอดรวมรายรับที่จะปิดสรุปคือ ฿${summary.totalRevenue.toLocaleString()}`)) {
    DB.archiveDailySummary(dateStr);
    alert(`ปิดยอดบัญชีรายวันของวันที่ ${dateStr} เรียบร้อยแล้ว!`);
    loadSelectedDailyReport();
  }
}

// ----------------- 7. MEMBER DETAILS & RENEWAL MODALS -----------------
function openDetailModal(id) {
  const members = DB.getMembers();
  const plans = DB.getPlans();
  const checkins = DB.getCheckins();

  const m = members.find(item => item.id === id);
  if (!m) return;

  const plan = plans.find(p => p.id === m.planId);
  const planName = plan ? plan.name : 'ไม่ระบุ';

  const avatar = document.getElementById('detail-avatar');
  avatar.style.background = m.avatarGradient;
  avatar.textContent = m.fullname.substring(0, 2);

  document.getElementById('detail-name').textContent = m.fullname;
  document.getElementById('detail-id').textContent = m.id;
  document.getElementById('detail-phone').textContent = m.phone;
  document.getElementById('detail-email').textContent = m.email;
  document.getElementById('detail-gender').textContent = m.gender;
  document.getElementById('detail-plan').textContent = planName;
  document.getElementById('detail-joindate').textContent = m.joinDate;
  document.getElementById('detail-expirydate').textContent = m.expiryDate;

  const statusBadge = document.getElementById('detail-status');
  statusBadge.className = `badge ${m.status}`;
  
  let statusText = 'กำลังใช้งาน';
  if (m.status === 'expired') statusText = 'หมดอายุ';
  if (m.status === 'warning') statusText = 'ใกล้หมด';
  statusBadge.textContent = statusText;

  const specificCheckins = checkins.filter(c => c.memberId === m.id);
  const checkinList = document.getElementById('detail-checkins-list');
  checkinList.innerHTML = '';

  if (specificCheckins.length === 0) {
    checkinList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 12px; font-size: 12px;">
        ยังไม่มีประวัติการเช็กเข้าใช้งานสำหรับสมาชิกรายนี้
      </div>
    `;
  } else {
    specificCheckins.forEach(c => {
      const div = document.createElement('div');
      div.className = 'checkin-row';
      div.style.padding = '8px 12px';
      
      let badgeLabel = 'ผ่าน';
      if (c.status === 'expired') badgeLabel = 'ระงับ (หมดอายุ)';
      if (c.status === 'warning') badgeLabel = 'แจ้งเตือนใกล้หมด';

      div.innerHTML = `
        <span class="font-eng" style="font-size: 13px;">${c.timestamp}</span>
        <span class="badge ${c.status}" style="font-size: 9px; padding: 2px 4px;">${badgeLabel}</span>
      `;
      checkinList.appendChild(div);
    });
  }

  const renewBtn = document.getElementById('detail-renew-btn');
  renewBtn.onclick = () => {
    document.getElementById('detail-modal').classList.remove('active');
    openRenewalModal(m.id);
  };

  document.getElementById('detail-modal').classList.add('active');
  refreshIcons();
}

function openRenewalModal(memberId) {
  const members = DB.getMembers();
  const plans = DB.getPlans();
  const m = members.find(item => item.id === memberId);
  if (!m) return;

  document.getElementById('renew-member-id').value = m.id;
  document.getElementById('renew-member-name').textContent = `${m.fullname} (${m.id})`;

  const select = document.getElementById('renew-plan-select');
  select.innerHTML = plans.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

  const specialCheckbox = document.getElementById('renew-special-checkbox');
  const priceInput = document.getElementById('renew-price-input');
  
  specialCheckbox.checked = false;
  priceInput.disabled = true;

  const updatePrice = () => {
    const selectedPlan = plans.find(p => p.id === select.value);
    if (selectedPlan && !specialCheckbox.checked) {
      priceInput.value = selectedPlan.price;
    }
  };
  
  select.onchange = updatePrice;
  
  specialCheckbox.onchange = () => {
    if (specialCheckbox.checked) {
      priceInput.disabled = false;
      priceInput.focus();
    } else {
      priceInput.disabled = true;
      updatePrice();
    }
  };

  updatePrice();
  document.getElementById('renew-modal').classList.add('active');
}

function handleRenewalSubmit(e) {
  e.preventDefault();
  const memberId = document.getElementById('renew-member-id').value;
  const planId = document.getElementById('renew-plan-select').value;
  const amountVal = document.getElementById('renew-price-input').value;
  const amount = Number(amountVal);
  if (isNaN(amount) || amount < 0) {
    alert('❌ กรุณากรอกจำนวนเงินที่ถูกต้อง (ห้ามติดลบ)');
    return;
  }
  const paymentMethod = document.getElementById('renew-payment-method').value;

  const members = DB.getMembers();
  const plans = DB.getPlans();
  
  const m = members.find(item => item.id === memberId);
  const plan = plans.find(p => p.id === planId);

  if (m && plan) {
    const today = DB.getGymTodayDate();
    let baseDate = new Date(m.expiryDate);
    
    if (m.status === 'expired') {
      baseDate = today;
    }

    baseDate.setDate(baseDate.getDate() + plan.durationDays);
    const newExpiryStr = DB.formatDateString(baseDate);

    m.planId = planId;
    m.expiryDate = newExpiryStr;
    DB.updateMember(m);

    const isSpecial = document.getElementById('renew-special-checkbox').checked;
    const planNameNote = isSpecial ? `${plan.name} (เรตพิเศษ)` : plan.name;

    const transactions = DB.getTransactions();
    const dateStr = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(today.getDate()).padStart(2, '0') + ' ' + 
                    String(today.getHours()).padStart(2, '0') + ':' + 
                    String(today.getMinutes()).padStart(2, '0');

    const txId = 'TX-' + (1000 + transactions.length + 1);
    
    const newTx = {
      id: txId,
      memberId: memberId,
      memberName: m.fullname,
      planId: planId,
      planName: planNameNote,
      amount: Number(amount),
      paymentMethod: paymentMethod,
      date: dateStr
    };
    
    transactions.unshift(newTx);
    DB.saveTransactions(transactions);

    alert(`ต่ออายุเรียบร้อย! วันหมดอายุใหม่คือ ${newExpiryStr} ชำระเงิน ฿${amount}`);
    document.getElementById('renew-modal').classList.remove('active');
    
    renderMembersList();
    renderBillingAndPlans();
  }
}

// ----------------- 8. SPA ROTATION & MAIN SETUP -----------------
document.addEventListener('DOMContentLoaded', () => {
  window.updateCartQty = updateCartQty;

  DB.initializeData();

  // อัปเดตวันที่จริงของระบบที่ sidebar-footer
  const dateEl = document.getElementById('sidebar-current-date');
  if (dateEl) {
    const today = DB.getGymTodayDate();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = `วันที่: ${today.toLocaleDateString('th-TH', options)}`;
  }

  // ----------------- PIN LOGIN SYSTEM LOGIC -----------------
  const pinModal = document.getElementById('pin-login-modal');
  const pinMessage = document.getElementById('pin-login-message');
  const switchUserBtn = document.getElementById('header-switch-user-btn');
  const headerUserName = document.getElementById('header-user-name');
  
  let currentPinInput = '';
  let portalLineProfile = null;
  let autoCheckInMember = null;

  function showPortalView() {
    if (pinModal) pinModal.classList.remove('active');
    document.querySelectorAll('.views-container .view-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.querySelector('.app-container').classList.add('portal-mode');
    
    const portalPanel = document.getElementById('member-portal-view');
    if (portalPanel) {
      portalPanel.classList.add('active');
    }

    // โหลดและเชื่อมต่อ LINE LIFF ถ้ามีการตั้งค่า LIFF ID
    const config = DB.getSystemConfig();
    const liffId = config.liffId;
    const portalErrorMsg = document.getElementById('portal-error-msg');
    
    if (liffId && typeof liff !== 'undefined') {
      if (portalErrorMsg) {
        portalErrorMsg.innerHTML = '<span style="color: var(--accent-orange);">⏳ กำลังเชื่อมโยง LINE Secure Login...</span>';
      }
      
      liff.init({ liffId: liffId })
        .then(() => {
          if (!liff.isLoggedIn()) {
            liff.login();
          } else {
            liff.getProfile()
              .then(profile => {
                portalLineProfile = profile;
                
                // ตรวจสอบว่าโปรไฟล์ไลน์นี้เคยผูกกับสมาชิกรึยัง
                const matchedMember = DB.findMemberByLineUserId(profile.userId);
                if (matchedMember) {
                  autoCheckInMember = matchedMember;
                  
                  // เปิดหน้าเช็กอินอัตโนมัติซ่อนฟอร์มค้นหา
                  document.getElementById('portal-search-panel').style.display = 'none';
                  document.getElementById('portal-autocheckin-panel').style.display = 'block';
                  
                  // ใส่ชื่อสมาชิก
                  document.getElementById('autocheckin-member-name').textContent = matchedMember.fullname;
                  document.getElementById('autocheckin-res-plan').textContent = matchedMember.planName;
                  document.getElementById('autocheckin-res-expiry').textContent = matchedMember.expiryDate;
                  
                  const checkinBtn = document.getElementById('btn-portal-self-checkin');
                  const checkinSuccess = document.getElementById('portal-self-checkin-success');
                  if (checkinBtn) checkinBtn.style.display = 'flex';
                  if (checkinSuccess) checkinSuccess.style.display = 'none';
                  
                  if (portalErrorMsg) {
                    portalErrorMsg.innerHTML = `<span style="color: #2ecc71; font-weight: 600;"><i data-lucide="shield-check" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>ยินดีต้อนรับ LINE: ${profile.displayName}</span>`;
                  }
                  
                  if (matchedMember.status === 'expired') {
                    if (checkinBtn) {
                      checkinBtn.disabled = true;
                      checkinBtn.style.backgroundColor = 'var(--color-danger)';
                      checkinBtn.style.borderColor = 'var(--color-danger)';
                      checkinBtn.style.boxShadow = 'none';
                      checkinBtn.innerHTML = '<i data-lucide="x-circle" style="width: 22px; height: 22px;"></i><span>สมาชิกหมดอายุ (กรุณาติดต่อเคาน์เตอร์)</span>';
                    }
                  } else {
                    if (checkinBtn) {
                      checkinBtn.disabled = false;
                      checkinBtn.style.backgroundColor = 'var(--color-success)';
                      checkinBtn.style.borderColor = 'var(--color-success)';
                      checkinBtn.innerHTML = '<i data-lucide="scan-face" style="width: 22px; height: 22px;"></i><span>กดเพื่อเช็กอินเข้ายิม</span>';
                    }
                  }
                  refreshIcons();
                } else {
                  // ยังไม่มีการผูกบัญชี
                  document.getElementById('portal-search-panel').style.display = 'block';
                  document.getElementById('portal-autocheckin-panel').style.display = 'none';
                  if (portalErrorMsg) {
                    portalErrorMsg.innerHTML = `<span style="color: var(--accent-orange); font-weight: 500;"><i data-lucide="info" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>ไลน์เชื่อมโยงสำเร็จ กรุณากรอกรหัสสมาชิกด้านล่างเพื่อผูกบัญชีในครั้งแรก</span>`;
                    refreshIcons();
                  }
                }
              })
              .catch(err => {
                console.error('Error fetching LINE profile:', err);
                if (portalErrorMsg) {
                  portalErrorMsg.textContent = '❌ ไม่สามารถดึงโปรไฟล์ LINE: ' + err.message;
                }
              });
          }
        })
        .catch(err => {
          console.error('LIFF initialization failed:', err);
          if (portalErrorMsg) {
            portalErrorMsg.textContent = '❌ โหลดระบบล็อก LINE ล้มเหลว (ตรวจสอบ LIFF ID)';
          }
        });
    } else {
      if (portalErrorMsg) {
        portalErrorMsg.innerHTML = '<span style="color: var(--text-muted);"><i data-lucide="info" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>โหมดสาธารณะ (ยังไม่ได้ตั้งค่าเชื่อมต่อ LINE)</span>';
        refreshIcons();
      }
    }
  }

  function checkLoginState() {
    const urlParams = new URLSearchParams(window.location.search);
    const isPortalMode = urlParams.get('portal') === 'true';

    if (isPortalMode) {
      showPortalView();
      return;
    }

    const user = DB.getCurrentUser();
    if (user) {
      if (pinModal) pinModal.classList.remove('active');
      if (headerUserName) headerUserName.textContent = user.name;
      updateRoleViews();
      
      const activeLink = document.querySelector('.sidebar .nav-link.active');
      if (!activeLink) {
        if (user.role === 'owner') {
          navigateToView('dashboard');
        } else {
          navigateToView('checkin');
        }
      } else {
        navigateToView(activeLink.dataset.view);
      }
    } else {
      if (pinModal) pinModal.classList.add('active');
      if (headerUserName) headerUserName.textContent = '-';
      resetPinInput();
    }
  }

  function resetPinInput() {
    currentPinInput = '';
    updatePinDots();
    if (pinMessage) {
      pinMessage.textContent = '';
      pinMessage.style.color = 'var(--text-secondary)';
    }
    const modalContent = pinModal?.querySelector('.modal-content');
    if (modalContent) {
      modalContent.classList.remove('pin-shake');
    }
  }

  function updatePinDots() {
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`pin-dot-${i}`);
      if (dot) {
        dot.className = 'pin-dot';
        if (i <= currentPinInput.length) {
          dot.classList.add('active');
        }
      }
    }
  }

  document.querySelectorAll('.numpad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;
      const modalContent = pinModal?.querySelector('.modal-content');

      if (val === 'C') {
        resetPinInput();
      } else if (val === 'B') {
        if (currentPinInput.length > 0) {
          currentPinInput = currentPinInput.slice(0, -1);
          updatePinDots();
        }
      } else if (currentPinInput.length < 4) {
        currentPinInput += val;
        updatePinDots();

        if (currentPinInput.length === 4) {
          const matchedUser = DB.verifyPin(currentPinInput);
          if (matchedUser) {
            if (pinMessage) {
              pinMessage.textContent = '🎉 เข้าสู่ระบบสำเร็จ...';
              pinMessage.style.color = 'var(--color-success)';
            }
            setTimeout(() => {
              if (pinModal) pinModal.classList.remove('active');
              if (headerUserName) headerUserName.textContent = matchedUser.name;
              updateRoleViews();
              if (matchedUser.role === 'owner') {
                navigateToView('dashboard');
              } else {
                navigateToView('checkin');
              }
              resetPinInput();
            }, 600);
          } else {
            if (pinMessage) {
              pinMessage.textContent = '❌ รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่';
              pinMessage.style.color = 'var(--color-danger)';
            }
            if (modalContent) {
              modalContent.classList.add('pin-shake');
            }
            for (let i = 1; i <= 4; i++) {
              document.getElementById(`pin-dot-${i}`)?.classList.add('error');
            }
            setTimeout(() => {
              resetPinInput();
            }, 800);
          }
        }
      }
    });
  });

  if (switchUserBtn) {
    switchUserBtn.addEventListener('click', () => {
      DB.logoutUser();
      checkLoginState();
    });
  }

  const auditSearchInput = document.getElementById('audit-search-input');
  const auditFilterAction = document.getElementById('audit-filter-action');

  if (auditSearchInput) {
    auditSearchInput.addEventListener('input', () => {
      auditCurrentPage = 1;
      renderAuditLogs();
    });
  }
  if (auditFilterAction) {
    auditFilterAction.addEventListener('change', () => {
      auditCurrentPage = 1;
      renderAuditLogs();
    });
  }

  const syncBtn = document.getElementById('diagnostic-sync-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      syncBtn.disabled = true;
      syncBtn.innerHTML = '<i data-lucide="refresh-cw" style="width: 12px; height: 12px; margin-right: 4px; display: inline-block; vertical-align: middle;"></i>กำลังซิงก์...';
      refreshIcons();
      
      DB.clearLastSyncError();
      await DB.syncFromCloud();
      
      renderAuditLogs();
      
      syncBtn.disabled = false;
      syncBtn.innerHTML = '<i data-lucide="refresh-cw" style="width: 12px; height: 12px; margin-right: 4px; display: inline-block; vertical-align: middle;"></i>ซิงก์ด่วน';
      refreshIcons();
    });
  }

  // เรียกใช้ตรวจจับตอนหน้าเว็บโหลด
  checkLoginState();

  // ดักฟิลเตอร์การแสดงผลกราฟแดชบอร์ดการเงิน
  document.querySelectorAll('.chart-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentChartFilter = btn.dataset.filter;
      renderDashboard();
    });
  });

  // ตัวตรวจจับกล่อง "กรณีพิเศษ" ในฟอร์มสมัครสมาชิก
  const specialCheckbox = document.getElementById('form-special-checkbox');
  const specialInputWrapper = document.getElementById('form-special-input-wrapper');
  const specialPriceInput = document.getElementById('form-special-price');
  
  specialCheckbox.addEventListener('change', () => {
    if (specialCheckbox.checked) {
      specialInputWrapper.classList.add('active');
      specialPriceInput.required = true;
      specialPriceInput.focus();
    } else {
      specialInputWrapper.classList.remove('active');
      specialPriceInput.required = false;
      
      const plans = DB.getPlans();
      const planId = document.getElementById('form-plan').value;
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        specialPriceInput.value = plan.price;
      }
    }
  });

  // ดักการเปลี่ยนปฏิทิน และการคลิกปิดยอดรายวัน
  const archiveDatePicker = document.getElementById('archive-date-picker');
  archiveDatePicker.addEventListener('change', loadSelectedDailyReport);
  document.getElementById('close-today-ledger-btn').addEventListener('click', handleCloseTodayLedger);

  // ดักการเปลี่ยนปฏิทินในหน้า Traffic View
  const trafficDatePicker = document.getElementById('traffic-date-picker');
  trafficDatePicker.addEventListener('change', renderTrafficView);
  
  // กำหนดเป็นวันปัจจุบันเป็นค่าตั้งต้นสำหรับหน้า Traffic
  const todayStr = DB.formatDateString(DB.getGymTodayDate());
  trafficDatePicker.value = todayStr;

  // ดักเหตุการณ์นำทางสลับหน้าจอ (Sidebar Menu Navigation)
  document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetView = link.dataset.view;
      if (!targetView) return;

      if (currentRole === 'staff' && (targetView === 'dashboard' || targetView === 'billing')) {
        return;
      }

      document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      document.querySelectorAll('.views-container .view-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      document.getElementById(`${targetView}-view`).classList.add('active');

      const titleText = link.querySelector('span').textContent;
      document.getElementById('current-view-title').textContent = titleText;

      loadViewData(targetView);
    });
  });

  // ค้นหาและตัวกรองสถานะสมาชิก
  const searchInput = document.getElementById('member-search');
  searchInput.addEventListener('input', (e) => {
    memberFilterState.searchQuery = e.target.value;
    membersCurrentPage = 1;
    renderMembersList();
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      memberFilterState.statusFilter = btn.dataset.filter;
      membersCurrentPage = 1;
      renderMembersList();
    });
  });

  // จัดการฟอร์มสมาชิก
  document.getElementById('add-member-trigger').addEventListener('click', () => openMemberFormModal());
  document.getElementById('member-form').addEventListener('submit', handleMemberFormSubmit);
  document.getElementById('form-plan').addEventListener('change', updateFormExpiryDate);
  document.getElementById('form-joindate').addEventListener('change', updateFormExpiryDate);

  // จัดการรายการของเครื่องดื่ม (CRUD)
  document.getElementById('add-product-trigger').addEventListener('click', () => openProductModal());
  document.getElementById('product-form').addEventListener('submit', handleProductFormSubmit);

  // ดักการส่งเช็กชื่อด่วน (สมาชิกธรรมดา)
  document.getElementById('checkin-submit-form').addEventListener('submit', handleQuickCheckin);
  
  // ดักการส่งเช็กตั๋วรายวันด่วน Walk-in
  document.getElementById('quick-daily-pass-form').addEventListener('submit', handleQuickDailyPassSubmit);

  // ดักสั่งซื้อของ POS ร้านน้ำ
  document.getElementById('shop-checkout-form').addEventListener('submit', handleShopCheckout);

  // จัดการราคาแพ็กเกจและต่ออายุใช้งาน
  document.getElementById('edit-plan-form').addEventListener('submit', handleEditPlanSubmit);
  document.getElementById('renew-form').addEventListener('submit', handleRenewalSubmit);

  // ปุ่มเปิด/ปิดโมดอลอเนกประสงค์
  const setupModalCloser = (closeBtnId, cancelBtnId, modalId) => {
    const modal = document.getElementById(modalId);
    const close = () => modal.classList.remove('active');
    
    document.getElementById(closeBtnId).addEventListener('click', close);
    if (cancelBtnId) {
      document.getElementById(cancelBtnId).addEventListener('click', close);
    }
  };

  setupModalCloser('close-member-modal', 'cancel-member-modal', 'member-modal');
  setupModalCloser('close-detail-modal', null, 'detail-modal');
  setupModalCloser('close-renew-modal', 'cancel-renew-modal', 'renew-modal');
  setupModalCloser('close-edit-plan-modal', 'cancel-edit-plan-modal', 'edit-plan-modal');
  setupModalCloser('close-product-modal', 'cancel-product-modal', 'product-modal');

  window.addEventListener('gym-master-cloud-synced', () => {
    console.log('🔄 [Firebase] ข้อมูลซิงก์เรียบร้อย กำลังรีเฟรชหน้าจอ...');
    const activeLink = document.querySelector('.sidebar .nav-link.active');
    if (activeLink) {
      const activeView = activeLink.dataset.view;
      loadViewData(activeView);
    }
  });

  // ----------------- MEMBER SELF-SERVICE PORTAL CONTROLLER -----------------
  const portalQueryForm = document.getElementById('portal-query-form');
  const portalMemberQuery = document.getElementById('portal-member-query');
  const portalErrorMsg = document.getElementById('portal-error-msg');
  const portalSearchPanel = document.getElementById('portal-search-panel');
  const portalResultPanel = document.getElementById('portal-result-panel');
  
  if (portalQueryForm) {
    portalQueryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (portalErrorMsg) portalErrorMsg.textContent = '';
      
      const query = portalMemberQuery.value;
      const res = DB.findMemberForPortal(query);
      
      if (!res) {
        if (portalErrorMsg) {
          portalErrorMsg.textContent = '❌ ไม่พบข้อมูลสมาชิก หรือหมายเลขโทรศัพท์นี้ในระบบ';
        }
        return;
      }

      // ตรวจเช็กความปลอดภัย LINE LIFF
      if (portalLineProfile) {
        const currentLineId = portalLineProfile.userId;
        
        if (!res.lineUserId) {
          // กระบวนการผูกบัญชีครั้งแรก (Binding)
          const confirmBind = confirm(`คุณต้องการผูกบัญชี LINE (${portalLineProfile.displayName}) เข้ากับโปรไฟล์สมาชิก ${res.fullname} หรือไม่?\n\n*หมายเหตุ: เมื่อผูกแล้ว บัญชี LINE นี้จะถูกล็อกไว้กับประวัตินี้เพื่อความปลอดภัย ป้องกันคนอื่นสวมสิทธิ์ด้วยเบอร์โทรของคุณ`);
          if (confirmBind) {
            DB.linkMemberLine(res.id, currentLineId);
            res.lineUserId = currentLineId;
          } else {
            if (portalErrorMsg) {
              portalErrorMsg.textContent = '❌ การดำเนินการถูกยกเลิก (ต้องผูกบัญชี LINE ก่อนตรวจสถานะ)';
            }
            return;
          }
        } else if (res.lineUserId !== currentLineId) {
          // บล็อกการเข้าถึงเนื่องจาก LINE ไม่ตรงกัน (Security Blocked)
          if (portalErrorMsg) {
            portalErrorMsg.innerHTML = '<span style="color: var(--color-danger); font-weight: bold;">❌ ตรวจสอบความปลอดภัยล้มเหลว: ข้อมูลสมาชิกนี้ผูกไว้กับบัญชี LINE อื่นแล้ว ไม่สามารถใช้เบอร์เพื่อนได้!</span>';
          }
          return;
        }
      }
      
      // Populate results
      document.getElementById('portal-res-name').textContent = res.fullname;
      document.getElementById('portal-res-id').textContent = res.id;
      document.getElementById('portal-res-phone').textContent = res.phone;
      document.getElementById('portal-res-plan').textContent = res.planName;
      
      // Update status indicators
      const statusCard = document.getElementById('portal-status-card');
      const statusIcon = document.getElementById('portal-status-icon');
      const statusTitle = document.getElementById('portal-status-title');
      const statusSubtitle = document.getElementById('portal-status-subtitle');
      
      // Clean previous classes
      statusCard.className = 'status-indicator-card';
      
      let iconName = 'check-circle';
      let title = 'ใช้งานได้ปกติ (Active)';
      let subtitle = '';
      
      if (res.status === 'active') {
        statusCard.classList.add('active');
        iconName = 'check-circle';
        title = '🟢 ใช้งานได้ปกติ (Active)';
        subtitle = `สามารถเข้าใช้บริการยิมได้ตามปกติ (เหลืออีก ${res.daysRemaining} วัน)`;
      } else if (res.status === 'warning') {
        statusCard.classList.add('warning');
        iconName = 'alert-triangle';
        title = '🟡 ใกล้หมดอายุ (Warning)';
        subtitle = `สมาชิกของท่านเหลือเวลาอีก ${res.daysRemaining} วัน กรุณาติดต่อเคาน์เตอร์`;
      } else {
        statusCard.classList.add('expired');
        iconName = 'x-circle';
        title = '🔴 หมดอายุแล้ว (Expired)';
        subtitle = `หมดอายุเมื่อวันที่ ${res.expiryDate} กรุณาติดต่อชำระเงินที่เคาน์เตอร์`;
      }
      
      statusTitle.textContent = title;
      statusSubtitle.textContent = subtitle;
      statusIcon.innerHTML = `<i data-lucide="${iconName}" style="width: 36px; height: 36px;"></i>`;
      
      // Switch panels
      portalSearchPanel.style.display = 'none';
      portalResultPanel.style.display = 'block';
      refreshIcons();
    });
  }
  
  const portalBackBtn = document.getElementById('portal-back-btn');
  if (portalBackBtn) {
    portalBackBtn.addEventListener('click', () => {
      portalMemberQuery.value = '';
      if (portalErrorMsg) portalErrorMsg.textContent = '';
      portalResultPanel.style.display = 'none';
      portalSearchPanel.style.display = 'block';
    });
  }

  // ----------------- OWNER PRINT QR CODE CONTROLLER -----------------
  const printQrBtn = document.getElementById('print-qr-btn');
  const downloadQrBtn = document.getElementById('download-qr-btn');
  
  if (printQrBtn) {
    printQrBtn.addEventListener('click', () => {
      const portalUrl = window.location.origin + window.location.pathname + '?portal=true';
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(portalUrl)}`;
      
      const printWindow = window.open('', '_blank', 'width=800,height=900');
      printWindow.document.write(`
        <html>
          <head>
            <title>พิมพ์ QR Code สมาชิก - Gym Master</title>
            <style>
              body {
                font-family: 'Inter', 'Prompt', sans-serif;
                text-align: center;
                padding: 40px;
                background-color: #ffffff;
                color: #1a1a1a;
              }
              .poster-card {
                border: 15px solid #ff5f1f;
                border-radius: 24px;
                padding: 40px 20px;
                max-width: 550px;
                margin: 0 auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              }
              .logo {
                font-size: 32px;
                font-weight: 800;
                color: #ff5f1f;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .subtitle {
                font-size: 16px;
                color: #555555;
                margin-bottom: 30px;
                font-weight: 500;
              }
              .qr-container {
                background: #ffffff;
                padding: 20px;
                border-radius: 16px;
                display: inline-block;
                border: 3px solid #ff5f1f;
                margin-bottom: 30px;
              }
              .qr-image {
                width: 280px;
                height: 280px;
                display: block;
              }
              .instruction {
                font-size: 20px;
                font-weight: 700;
                color: #ff5f1f;
                margin-bottom: 8px;
              }
              .url-hint {
                font-size: 13px;
                color: #777777;
                font-family: monospace;
              }
            </style>
          </head>
          <body>
            <div class="poster-card">
              <div class="logo">🏋️ Gym Master</div>
              <div class="subtitle">ระบบบริการตรวจสถานะสมาชิกหน้าร้าน</div>
              <div class="qr-container">
                <img class="qr-image" src="\${qrApiUrl}" alt="QR Code">
              </div>
              <div class="instruction">สแกนตรวจสอบวันหมดอายุสมาชิกของท่านได้ที่นี่!</div>
              <div class="url-hint">\${portalUrl}</div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 500);
              }
            <\/script>
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  }

  if (downloadQrBtn) {
    downloadQrBtn.addEventListener('click', () => {
      const portalUrl = window.location.origin + window.location.pathname + '?portal=true';
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(portalUrl)}`;
      window.open(qrApiUrl, '_blank');
    });
  }

  // ----------------- PORTAL SELF CHECK-IN BUTTONS CONTROLLER -----------------
  const selfCheckinBtn = document.getElementById('btn-portal-self-checkin');
  const selfCheckinSuccess = document.getElementById('portal-self-checkin-success');
  const selfCheckinTime = document.getElementById('portal-self-checkin-time');
  const portalRelinkBtn = document.getElementById('portal-relink-btn');

  if (selfCheckinBtn) {
    selfCheckinBtn.addEventListener('click', () => {
      if (!autoCheckInMember) return;
      
      selfCheckinBtn.disabled = true;
      selfCheckinBtn.innerHTML = '<span style="color: var(--text-muted);">⏳ กำลังบันทึกประวัติ...</span>';
      
      const checkinResult = DB.checkInMember(autoCheckInMember.id);
      
      if (checkinResult && checkinResult.success) {
        selfCheckinBtn.style.display = 'none';
        selfCheckinSuccess.style.display = 'block';
        
        const now = DB.getGymTodayDate();
        const timeStr = String(now.getHours()).padStart(2, '0') + ':' + 
                        String(now.getMinutes()).padStart(2, '0') + ':' +
                        String(now.getSeconds()).padStart(2, '0');
        selfCheckinTime.textContent = `เวลาเช็กอิน: ${timeStr} น.`;
        
        refreshIcons();
        alert('🟢 เช็กอินสำเร็จ! ยินดีต้อนรับเข้าใช้งานครับ');
      } else {
        selfCheckinBtn.disabled = false;
        selfCheckinBtn.innerHTML = '<i data-lucide="scan-face" style="width: 22px; height: 22px;"></i><span>กดเพื่อเช็กอินเข้ายิม</span>';
        alert('❌ เช็กอินล้มเหลว: ' + (checkinResult.reason || 'กรุณาลองใหม่อีกครั้ง'));
        refreshIcons();
      }
    });
  }

  if (portalRelinkBtn) {
    portalRelinkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      autoCheckInMember = null;
      document.getElementById('portal-autocheckin-panel').style.display = 'none';
      document.getElementById('portal-search-panel').style.display = 'block';
      const portalErrorMsg = document.getElementById('portal-error-msg');
      if (portalErrorMsg) {
        portalErrorMsg.innerHTML = '<span style="color: var(--text-muted);"><i data-lucide="info" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>พิมพ์รหัสหรือเบอร์โทรศัพท์เพื่อสลับเปลี่ยนบัญชีผูกสิทธิ์ LINE</span>';
        refreshIcons();
      }
    });
  }

  // ----------------- OWNER LINE CONFIG CONTROLLER -----------------
  const lineConfigForm = document.getElementById('owner-line-config-form');
  const liffIdInput = document.getElementById('owner-liff-id');
  
  if (liffIdInput) {
    const config = DB.getSystemConfig();
    liffIdInput.value = config.liffId || '';
  }
  
  if (lineConfigForm) {
    lineConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const liffId = liffIdInput.value.trim();
      DB.saveSystemConfig({ liffId });
      alert('บันทึกการตั้งค่า LINE LIFF ID เรียบร้อยแล้ว!');
      
      // Re-render dashboard QR text/link as well
      const urlText = document.getElementById('owner-portal-url-text');
      const qrImg = document.getElementById('owner-portal-qr-img');
      if (urlText && qrImg) {
        const portalUrl = window.location.origin + window.location.pathname + '?portal=true';
        urlText.textContent = portalUrl;
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(portalUrl)}`;
      }
    });
  }

  // ----------------- PAGINATION BUTTONS CLICK HANDLERS -----------------
  document.getElementById('btn-members-prev-page')?.addEventListener('click', () => {
    if (membersCurrentPage > 1) {
      membersCurrentPage--;
      renderMembersList();
    }
  });
  document.getElementById('btn-members-next-page')?.addEventListener('click', () => {
    const query = memberFilterState.searchQuery.toLowerCase().trim();
    const statusFilter = memberFilterState.statusFilter;
    const totalCount = DB.getMembers().filter(m => {
      if (m.id.startsWith('GM-W-')) return false;
      const matchQuery = m.id.toLowerCase().includes(query) ||
                          m.fullname.toLowerCase().includes(query) ||
                          m.phone.includes(query);
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchQuery && matchStatus;
    }).length;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
    if (membersCurrentPage < totalPages) {
      membersCurrentPage++;
      renderMembersList();
    }
  });

  document.getElementById('btn-audit-prev-page')?.addEventListener('click', () => {
    if (auditCurrentPage > 1) {
      auditCurrentPage--;
      renderAuditLogs();
    }
  });
  document.getElementById('btn-audit-next-page')?.addEventListener('click', () => {
    const searchVal = document.getElementById('audit-search-input')?.value.toLowerCase() || '';
    const filterAction = document.getElementById('audit-filter-action')?.value || '';
    const totalCount = DB.getAuditLogs().filter(log => {
      if (!log) return false;
      const matchSearch = (log.userName || '').toLowerCase().includes(searchVal) ||
                          (log.action || '').toLowerCase().includes(searchVal) ||
                          (log.details || '').toLowerCase().includes(searchVal) ||
                          (log.id || '').toLowerCase().includes(searchVal);
      const matchAction = !filterAction || log.action === filterAction;
      return matchSearch && matchAction;
    }).length;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
    if (auditCurrentPage < totalPages) {
      auditCurrentPage++;
      renderAuditLogs();
    }
  });

  // ----------------- CSV EXPORT BUTTONS CLICK HANDLERS -----------------
  document.getElementById('export-billing-csv')?.addEventListener('click', () => {
    const transactions = DB.getTransactions() || [];
    const headers = ['เลขที่ใบเสร็จ', 'รหัสสมาชิก', 'ชื่อสมาชิก', 'แพ็กเกจ', 'จำนวนเงิน', 'ช่องทางชำระ', 'วันที่รับเงิน'];
    const rows = transactions.map(tx => [
      tx.id,
      tx.memberId,
      tx.memberName,
      tx.planName,
      tx.amount,
      tx.paymentMethod,
      tx.date
    ]);
    downloadCSV('membership_payment_history.csv', headers, rows);
  });

  document.getElementById('export-shop-csv')?.addEventListener('click', () => {
    const sales = DB.getShopSales() || [];
    const headers = ['เลขที่ใบเสร็จ', 'รายการสินค้า', 'ยอดรวม', 'ช่องทางชำระ', 'วันที่ขาย'];
    const rows = sales.map(sale => [
      sale.id,
      sale.items.map(it => `${it.name} x ${it.qty}`).join('; '),
      sale.total,
      sale.paymentMethod,
      sale.date
    ]);
    downloadCSV('beverage_sales_history.csv', headers, rows);
  });

  document.getElementById('export-audit-csv')?.addEventListener('click', () => {
    const logs = DB.getAuditLogs() || [];
    const headers = ['รหัสบันทึก', 'วัน-เวลา', 'ผู้ปฏิบัติงาน', 'กิจกรรม', 'รายละเอียด'];
    const rows = logs.map(log => [
      log.id,
      log.timestamp,
      log.userName,
      log.action,
      log.details
    ]);
    downloadCSV('system_audit_logs.csv', headers, rows);
  });

});
