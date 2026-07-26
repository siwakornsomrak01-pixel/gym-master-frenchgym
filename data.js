// Gym Master - Data Store & LocalStorage Controller
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config.js';

// เริ่มต้นเชื่อมต่อ Firebase Firestore (ตรวจเช็ก Config)
let db = null;
let isFirebaseConnected = false;

if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== "") {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseConnected = true;
    console.log('🔥 [Firebase] เชื่อมต่อระบบคลาวด์สำเร็จแล้ว');
  } catch (err) {
    console.error('❌ [Firebase] เกิดข้อผิดพลาดในการเชื่อมต่อเริ่มต้น:', err);
  }
} else {
  console.warn('⚠️ [Firebase] ยังไม่ได้ระบุ Firebase Config ใน firebase-config.js กำลังรันโหมดออฟไลน์ (LocalStorage) เท่านั้น');
}

// ฟังก์ชันส่งกระจายข้อมูลจาก LocalStorage ขึ้น Cloud Firestore
async function syncToCloud(collectionName, data) {
  if (!isFirebaseConnected || !db) return;
  try {
    const docRef = doc(db, 'gym_data', collectionName);
    await setDoc(docRef, { data: data, updatedAt: new Date().toISOString() });
    console.log(`☁️ [Firebase] ซิงก์สำเร็จ: คอลเลกชัน ${collectionName}`);
  } catch (err) {
    console.error(`❌ [Firebase] ซิงก์ล้มเหลว: คอลเลกชัน ${collectionName}:`, err);
  }
}

// ฟังก์ชันดึงข้อมูลจาก Cloud Firestore ลงมาเขียนทับ LocalStorage
export async function syncFromCloud() {
  if (!isFirebaseConnected || !db) return;
  console.log('🔄 [Firebase] กำลังดึงข้อมูลจาก Cloud Firestore...');
  const collections = [
    { name: 'plans', storageKey: 'gm_plans' },
    { name: 'products', storageKey: 'gm_products' },
    { name: 'members', storageKey: 'gm_members' },
    { name: 'transactions', storageKey: 'gm_transactions' },
    { name: 'shop_sales', storageKey: 'gm_shop_sales' },
    { name: 'checkins', storageKey: 'gm_checkins' },
    { name: 'daily_archives', storageKey: 'gm_daily_archives' },
    { name: 'users', storageKey: 'gm_users' },
    { name: 'audit_logs', storageKey: 'gm_audit_logs' }
  ];

  for (const col of collections) {
    try {
      const docRef = doc(db, 'gym_data', col.name);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data().data;
        if (cloudData && Array.isArray(cloudData)) {
          localStorage.setItem(col.storageKey, JSON.stringify(cloudData));
          console.log(`📥 [Firebase] ซิงก์ลงสำเร็จ: ${col.name} (${cloudData.length} รายการ)`);
        }
      } else {
        // ถ้าบนคลาวด์ยังไม่มีข้อมูล ให้อัปโหลดข้อมูลปัจจุบันใน LocalStorage ขึ้นไปแทน
        const localVal = localStorage.getItem(col.storageKey);
        if (localVal) {
          await setDoc(docRef, { data: JSON.parse(localVal), updatedAt: new Date().toISOString() });
          console.log(`📤 [Firebase] อัปโหลดข้อมูลเริ่มต้นไปคลาวด์: ${col.name}`);
        }
      }
    } catch (err) {
      console.error(`❌ [Firebase] ซิงก์ลงล้มเหลวสำหรับ ${col.name}:`, err);
    }
  }
}

// รายการบัญชีและรหัส PIN พนักงานหน้าร้านตั้งต้น
const INITIAL_USERS = [
  { id: 'user-owner', name: 'คุณนพกร (Owner)', pin: '1111', role: 'owner' },
  { id: 'user-staff1', name: 'สมชาย (Staff)', pin: '2222', role: 'staff' },
  { id: 'user-staff2', name: 'สมหญิง (Staff)', pin: '3333', role: 'staff' }
];

// รายการบันทึกกิจกรรมประวัติระบบตั้งต้น
const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-1000',
    timestamp: '2026-07-25 08:00:00',
    userId: 'user-owner',
    userName: 'คุณนพกร (Owner)',
    action: 'เริ่มต้นระบบ',
    details: 'เปิดใช้งานแอปพลิเคชัน Gym Master คลาวด์ซิงก์เรียบร้อยแล้ว'
  }
];

// รายการแพ็กเกจตั้งต้น
const INITIAL_PLANS = [
  { id: 'plan-daily', name: 'รายวัน (Daily)', price: 150, durationDays: 1 },
  { id: 'plan-monthly', name: 'รายเดือน (Monthly)', price: 1500, durationDays: 30 },
  { id: 'plan-3months', name: '3 เดือน (Quarterly)', price: 4000, durationDays: 90 },
  { id: 'plan-6months', name: '6 เดือน (6-Months)', price: 7500, durationDays: 180 },
  { id: 'plan-yearly', name: 'รายปี (Yearly)', price: 12000, durationDays: 365 }
];

// รายการสินค้าเครื่องดื่มและอาหารเสริมตั้งต้น
const INITIAL_PRODUCTS = [
  { id: 'prod-water', name: 'น้ำดื่มสะอาด', price: 10, icon: 'droplet' },
  { id: 'prod-sports', name: 'เครื่องดื่มเกลือแร่', price: 25, icon: 'zap' },
  { id: 'prod-whey', name: 'เวย์โปรตีนเชก', price: 60, icon: 'cup-soda' },
  { id: 'prod-lcarnitine', name: 'แอล-คาร์นิทีน', price: 40, icon: 'flame' }
];

// ข้อมูลสมาชิกตั้งต้น (คำนวณวันหมดอายุรอบตัวปัจจุบันเพื่อการสาธิตที่สมจริง - วันนี้คือ 2026-07-25)
const INITIAL_MEMBERS = [
  {
    id: 'GM-001',
    fullname: 'สมชาย รักเรียน',
    phone: '0812345678',
    email: 'somchai@email.com',
    gender: 'ชาย',
    status: 'active',
    planId: 'plan-monthly',
    joinDate: '2026-07-01',
    expiryDate: '2026-08-01',
    avatarGradient: 'linear-gradient(135deg, #FF5F1F, #FFD700)'
  },
  {
    id: 'GM-002',
    fullname: 'สมศรี มีดี',
    phone: '0823456789',
    email: 'somsri@email.com',
    gender: 'หญิง',
    status: 'expired',
    planId: 'plan-daily',
    joinDate: '2026-07-10',
    expiryDate: '2026-07-11',
    avatarGradient: 'linear-gradient(135deg, #EF4444, #FF5F1F)'
  },
  {
    id: 'GM-003',
    fullname: 'กิตติพงษ์ แก้วดี',
    phone: '0834567890',
    email: 'kittipong@email.com',
    gender: 'ชาย',
    status: 'active',
    planId: 'plan-3months',
    joinDate: '2026-05-15',
    expiryDate: '2026-08-13',
    avatarGradient: 'linear-gradient(135deg, #3B82F6, #10B981)'
  },
  {
    id: 'GM-004',
    fullname: 'อารียา สุขสันต์',
    phone: '0845678901',
    email: 'areeya@email.com',
    gender: 'หญิง',
    status: 'warning', // ใกล้หมดอายุ (วันนี้ 2026-07-25, หมดอายุ 2026-07-28)
    planId: 'plan-monthly',
    joinDate: '2026-06-28',
    expiryDate: '2026-07-28',
    avatarGradient: 'linear-gradient(135deg, #F59E0B, #FFD700)'
  },
  {
    id: 'GM-005',
    fullname: 'มานะ ขยันเพียร',
    phone: '0856789012',
    email: 'mana@email.com',
    gender: 'ชาย',
    status: 'active',
    planId: 'plan-yearly',
    joinDate: '2026-01-10',
    expiryDate: '2027-01-10',
    avatarGradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)'
  }
];

// ประวัติการชำระเงินค่าสมาชิกตั้งต้น
const INITIAL_TRANSACTIONS = [
  { id: 'TX-1001', memberId: 'GM-005', memberName: 'มานะ ขยันเพียร', planId: 'plan-yearly', planName: 'รายปี (Yearly)', amount: 12000, paymentMethod: 'โอนผ่านธนาคาร', date: '2026-01-10 10:30' },
  { id: 'TX-1002', memberId: 'GM-003', memberName: 'กิตติพงษ์ แก้วดี', planId: 'plan-3months', planName: '3 เดือน (Quarterly)', amount: 4000, paymentMethod: 'บัตรเครดิต', date: '2026-05-15 14:15' },
  { id: 'TX-1003', memberId: 'GM-004', memberName: 'อารียา สุขสันต์', planId: 'plan-monthly', planName: 'รายเดือน (Monthly)', amount: 1500, paymentMethod: 'เงินสด', date: '2026-06-28 09:00' },
  { id: 'TX-1004', memberId: 'GM-001', memberName: 'สมชาย รักเรียน', planId: 'plan-monthly', planName: 'รายเดือน (Monthly)', amount: 1500, paymentMethod: 'โอนผ่านธนาคาร', date: '2026-07-01 17:45' },
  { id: 'TX-1005', memberId: 'GM-002', memberName: 'สมศรี มีดี', planId: 'plan-daily', planName: 'รายวัน (Daily)', amount: 150, paymentMethod: 'เงินสด', date: '2026-07-10 11:20' }
];

// ประวัติการขายเครื่องดื่มจำลอง
const INITIAL_SHOP_SALES = [
  { id: 'SL-1001', items: [{ productId: 'prod-water', name: 'น้ำดื่มสะอาด', qty: 2, price: 10 }, { productId: 'prod-whey', name: 'เวย์โปรตีนเชก', qty: 1, price: 60 }], total: 80, paymentMethod: 'เงินสด', date: '2026-07-24 14:20' },
  { id: 'SL-1002', items: [{ productId: 'prod-sports', name: 'เครื่องดื่มเกลือแร่', qty: 1, price: 25 }], total: 25, paymentMethod: 'โอนผ่านธนาคาร', date: '2026-07-25 08:35' }
];

// ประวัติการเช็กอินย้อนหลัง (วันนี้คือ 2026-07-25)
const INITIAL_CHECKINS = [
  { id: 'CK-1001', memberId: 'GM-005', memberName: 'มานะ ขยันเพียร', timestamp: '2026-07-24 08:30:12', status: 'active', planName: 'รายปี (Yearly)' },
  { id: 'CK-1002', memberId: 'GM-001', memberName: 'สมชาย รักเรียน', timestamp: '2026-07-24 18:15:45', status: 'active', planName: 'รายเดือน (Monthly)' },
  { id: 'CK-1003', memberId: 'GM-004', memberName: 'อารียา สุขสันต์', timestamp: '2026-07-24 19:00:22', status: 'warning', planName: 'รายเดือน (Monthly)' },
  { id: 'CK-1004', memberId: 'GM-003', memberName: 'กิตติพงษ์ แก้วดี', timestamp: '2026-07-25 06:45:00', status: 'active', planName: '3 เดือน (Quarterly)' },
  { id: 'CK-1005', memberId: 'GM-005', memberName: 'มานะ ขยันเพียร', timestamp: '2026-07-25 08:12:10', status: 'active', planName: 'รายปี (Yearly)' }
];

// รายงานประวัติปิดยอดรายวันตั้งต้น (ของเมื่อวาน 24 กรกฎาคม 2026)
const INITIAL_DAILY_ARCHIVES = [
  {
    date: '2026-07-24',
    membershipSales: 1500,
    shopSales: 80,
    dailyPasses: 0,
    checkinsCount: 3,
    totalRevenue: 1580,
    status: 'closed'
  }
];

// ฟังก์ชันดึงวันที่ปัจจุบันในยิม (เวลาปัจจุบันของระบบ)
export function getGymTodayDate() {
  return new Date();
}

// ช่วยจัดรูปแบบวันที่เป็น YYYY-MM-DD
export function formatDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// เช็กสถานะของสมาชิกตามวันหมดอายุเทียบกับวันนี้ (2026-07-25)
export function calculateMemberStatus(expiryDateStr) {
  const today = getGymTodayDate();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'expired'; // หมดอายุ
  } else if (diffDays <= 7) {
    return 'warning'; // ใกล้หมดอายุภายใน 7 วัน
  } else {
    return 'active'; // กำลังใช้งาน
  }
}

// โหลดข้อมูลหรือกำหนดค่าเริ่มต้นใน LocalStorage
export function initializeData() {
  if (!localStorage.getItem('gm_plans')) {
    localStorage.setItem('gm_plans', JSON.stringify(INITIAL_PLANS));
  } else {
    // ป้องกันกรณีผู้ใช้เดิมที่ LocalStorage เคยจำเฉพาะ 4 แพ็กเกจ ให้ตรวจสอบและเพิ่มแพ็กเกจ 6 เดือนลงไปในตำแหน่งที่ถูกต้อง
    const currentPlans = JSON.parse(localStorage.getItem('gm_plans'));
    const has6Months = currentPlans.some(p => p.id === 'plan-6months');
    if (!has6Months) {
      const index3m = currentPlans.findIndex(p => p.id === 'plan-3months');
      const plan6m = INITIAL_PLANS.find(p => p.id === 'plan-6months');
      if (plan6m) {
        if (index3m !== -1) {
          currentPlans.splice(index3m + 1, 0, plan6m);
        } else {
          currentPlans.push(plan6m);
        }
        localStorage.setItem('gm_plans', JSON.stringify(currentPlans));
      }
    }
  }
  if (!localStorage.getItem('gm_products')) {
    localStorage.setItem('gm_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('gm_members')) {
    const members = INITIAL_MEMBERS.map(m => ({
      ...m,
      status: calculateMemberStatus(m.expiryDate)
    }));
    localStorage.setItem('gm_members', JSON.stringify(members));
  }
  if (!localStorage.getItem('gm_transactions')) {
    localStorage.setItem('gm_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
  }
  if (!localStorage.getItem('gm_shop_sales')) {
    localStorage.setItem('gm_shop_sales', JSON.stringify(INITIAL_SHOP_SALES));
  }
  if (!localStorage.getItem('gm_checkins')) {
    localStorage.setItem('gm_checkins', JSON.stringify(INITIAL_CHECKINS));
  }
  if (!localStorage.getItem('gm_daily_archives')) {
    localStorage.setItem('gm_daily_archives', JSON.stringify(INITIAL_DAILY_ARCHIVES));
  }
  if (!localStorage.getItem('gm_users')) {
    localStorage.setItem('gm_users', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('gm_audit_logs')) {
    localStorage.setItem('gm_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));
  }

  // ถ้าต่อ Firebase สำเร็จ ให้ดึงข้อมูลมาเขียนทับ LocalStorage ในเบื้องหลัง (รันครั้งเดียวต่อเซสชัน)
  if (isFirebaseConnected && !window._isFirebaseSyncingStarted) {
    window._isFirebaseSyncingStarted = true;
    syncFromCloud().then(() => {
      window.dispatchEvent(new CustomEvent('gym-master-cloud-synced'));
    });
  }
}

// ฟังก์ชัน CRUD สำหรับ Plans
export function getPlans() {
  initializeData();
  return JSON.parse(localStorage.getItem('gm_plans'));
}

export function savePlans(plans) {
  localStorage.setItem('gm_plans', JSON.stringify(plans));
  syncToCloud('plans', plans);
}

export function updatePlanPrice(planId, newPrice) {
  const plans = getPlans();
  const planIndex = plans.findIndex(p => p.id === planId);
  if (planIndex !== -1) {
    const oldPrice = plans[planIndex].price;
    plans[planIndex].price = Number(newPrice);
    savePlans(plans);
    addAuditLog('แก้ไขราคาแผนบริการ', `แก้ไขราคาของแผน ${plans[planIndex].name} จาก ฿${oldPrice.toLocaleString()} เป็น ฿${Number(newPrice).toLocaleString()}`);
    return true;
  }
  return false;
}

// ฟังก์ชันดึงสินค้าเครื่องดื่ม
export function getProducts() {
  initializeData();
  return JSON.parse(localStorage.getItem('gm_products'));
}

// ฟังก์ชัน CRUD สำหรับจัดการเครื่องดื่ม (Beverage Manager CRUD)
export function saveProducts(products) {
  localStorage.setItem('gm_products', JSON.stringify(products));
  syncToCloud('products', products);
}

export function addProduct(name, price, icon) {
  const products = getProducts();
  const newId = 'prod-' + Date.now();
  const newProduct = {
    id: newId,
    name: name,
    price: Number(price),
    icon: icon || 'droplet'
  };
  products.push(newProduct);
  saveProducts(products);
  addAuditLog('เพิ่มเครื่องดื่ม', `เพิ่มสินค้าใหม่: ${name} ราคา ฿${Number(price).toLocaleString()}`);
  return newProduct;
}

export function updateProduct(id, name, price, icon) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    const oldProduct = products[index];
    products[index] = {
      ...products[index],
      name: name,
      price: Number(price),
      icon: icon || 'droplet'
    };
    saveProducts(products);
    addAuditLog('แก้ไขเครื่องดื่ม', `แก้ไขสินค้า: ${oldProduct.name} -> ${name} ราคา ฿${Number(price).toLocaleString()}`);
    return true;
  }
  return false;
}

export function deleteProduct(id) {
  const products = getProducts();
  const deleted = products.find(p => p.id === id);
  const filtered = products.filter(p => p.id !== id);
  if (products.length !== filtered.length) {
    saveProducts(filtered);
    if (deleted) {
      addAuditLog('ลบเครื่องดื่ม', `ทำการลบสินค้าเครื่องดื่มออกจากระบบ: ${deleted.name}`);
    }
    return true;
  }
  return false;
}

// ฟังก์ชัน CRUD สำหรับ Members
export function getMembers() {
  initializeData();
  const members = JSON.parse(localStorage.getItem('gm_members'));
  let changed = false;
  members.forEach(m => {
    const computedStatus = calculateMemberStatus(m.expiryDate);
    if (m.status !== computedStatus) {
      m.status = computedStatus;
      changed = true;
    }
  });
  if (changed) {
    saveMembers(members);
  }
  return members;
}

export function saveMembers(members) {
  localStorage.setItem('gm_members', JSON.stringify(members));
  syncToCloud('members', members);
}

// รันรหัสสมาชิกใหม่ (อัตโนมัติเช่น GM-006, GM-007)
export function generateMemberId() {
  const members = getMembers();
  // คัดเฉพาะสมาชิกธรรมดาที่ไม่ใช่ Walk-inชั่วคราว
  const regularMembers = members.filter(m => !m.id.startsWith('GM-W-'));
  if (regularMembers.length === 0) return 'GM-001';
  
  const ids = regularMembers.map(m => {
    const num = parseInt(m.id.replace('GM-', ''));
    return isNaN(num) ? 0 : num;
  });
  const maxId = Math.max(...ids);
  return `GM-${String(maxId + 1).padStart(3, '0')}`;
}

export function addMember(memberData) {
  const members = getMembers();
  const newId = generateMemberId();
  
  const gradients = [
    'linear-gradient(135deg, #FF5F1F, #FFD700)',
    'linear-gradient(135deg, #EF4444, #FF5F1F)',
    'linear-gradient(135deg, #3B82F6, #10B981)',
    'linear-gradient(135deg, #F59E0B, #FFD700)',
    'linear-gradient(135deg, #8B5CF6, #EC4899)',
    'linear-gradient(135deg, #06B6D4, #3B82F6)',
    'linear-gradient(135deg, #10B981, #6EE7B7)'
  ];
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  const status = calculateMemberStatus(memberData.expiryDate);

  const newMember = {
    id: newId,
    fullname: memberData.fullname,
    phone: memberData.phone,
    email: memberData.email || '-',
    gender: memberData.gender,
    status: status,
    planId: memberData.planId,
    joinDate: memberData.joinDate,
    expiryDate: memberData.expiryDate,
    avatarGradient: randomGradient
  };

  members.push(newMember);
  saveMembers(members);
  addAuditLog('สมัครสมาชิก', `ลงทะเบียนสมาชิกใหม่ รหัส ${newId} ชื่อ ${memberData.fullname}`);
  return newMember;
}

export function updateMember(updatedMember) {
  const members = getMembers();
  const index = members.findIndex(m => m.id === updatedMember.id);
  if (index !== -1) {
    const status = calculateMemberStatus(updatedMember.expiryDate);
    const oldMember = members[index];
    members[index] = {
      ...members[index],
      ...updatedMember,
      status: status
    };
    saveMembers(members);
    addAuditLog('แก้ไขสมาชิก', `แก้ไขข้อมูลสมาชิก รหัส ${updatedMember.id} จากชื่อ ${oldMember.fullname} -> ${updatedMember.fullname} และวันหมดอายุ ${oldMember.expiryDate} -> ${updatedMember.expiryDate}`);
    return true;
  }
  return false;
}

export function deleteMember(id) {
  const members = getMembers();
  const deleted = members.find(m => m.id === id);
  const filtered = members.filter(m => m.id !== id);
  if (members.length !== filtered.length) {
    saveMembers(filtered);
    if (deleted) {
      addAuditLog('ลบสมาชิก', `ทำการลบประวัติสมาชิก รหัส ${id} ชื่อ ${deleted.fullname} ออกจากระบบ`);
    }
    return true;
  }
  return false;
}

// ฟังก์ชันจัดการ Transactions
export function getTransactions() {
  initializeData();
  return JSON.parse(localStorage.getItem('gm_transactions'));
}

export function saveTransactions(txs) {
  localStorage.setItem('gm_transactions', JSON.stringify(txs));
  syncToCloud('transactions', txs);
}

export function addTransaction(memberId, planId, amount, paymentMethod) {
  const transactions = getTransactions();
  const members = getMembers();
  const plans = getPlans();
  
  const member = members.find(m => m.id === memberId);
  const plan = plans.find(p => p.id === planId);
  
  const now = getGymTodayDate();
  const dateStr = now.getFullYear() + '-' + 
                  String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(now.getDate()).padStart(2, '0') + ' ' + 
                  String(now.getHours()).padStart(2, '0') + ':' + 
                  String(now.getMinutes()).padStart(2, '0');

  const txId = 'TX-' + (1000 + transactions.length + 1);
  
  const newTx = {
    id: txId,
    memberId: memberId,
    memberName: member ? member.fullname : 'ไม่ระบุชื่อ',
    planId: planId,
    planName: plan ? plan.name : 'แพ็กเกจทั่วไป',
    amount: Number(amount),
    paymentMethod: paymentMethod,
    date: dateStr
  };
  
  transactions.unshift(newTx);
  saveTransactions(transactions);
  if (member && plan) {
    addAuditLog('ต่ออายุสมาชิก', `ทำธุรกรรมต่ออายุสมาชิก รหัส ${memberId} (${member.fullname}) ด้วยแผน ${plan.name} ยอดชำระ ฿${Number(amount).toLocaleString()} (${paymentMethod})`);
  }
  return newTx;
}

// ฟังก์ชันจัดการธุรกรรมร้านน้ำ (Shop Sales)
export function getShopSales() {
  initializeData();
  return JSON.parse(localStorage.getItem('gm_shop_sales'));
}

export function saveShopSales(sales) {
  localStorage.setItem('gm_shop_sales', JSON.stringify(sales));
  syncToCloud('shop_sales', sales);
}

export function addShopSale(items, total, paymentMethod) {
  const sales = getShopSales();
  const now = getGymTodayDate();
  const dateStr = now.getFullYear() + '-' + 
                  String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(now.getDate()).padStart(2, '0') + ' ' + 
                  String(now.getHours()).padStart(2, '0') + ':' + 
                  String(now.getMinutes()).padStart(2, '0');

  const saleId = 'SL-' + (1000 + sales.length + 1);
  
  const newSale = {
    id: saleId,
    items: items,
    total: Number(total),
    paymentMethod: paymentMethod,
    date: dateStr
  };

  sales.unshift(newSale);
  saveShopSales(sales);
  const itemsSummary = items.map(it => `${it.name} x ${it.qty}`).join(', ');
  addAuditLog('ขายเครื่องดื่ม', `ขายสินค้าหน้าร้าน: ${itemsSummary} ยอดชำระ ฿${Number(total).toLocaleString()} (${paymentMethod})`);
  return newSale;
}

// ฟังก์ชันจัดการ Check-ins
export function getCheckins() {
  initializeData();
  return JSON.parse(localStorage.getItem('gm_checkins'));
}

export function saveCheckins(checkins) {
  localStorage.setItem('gm_checkins', JSON.stringify(checkins));
  syncToCloud('checkins', checkins);
}

// ทำการเช็กอินสมาชิก
export function checkInMember(memberIdOrCode) {
  const members = getMembers();
  const plans = getPlans();
  
  const member = members.find(m => 
    m.id.toLowerCase() === memberIdOrCode.trim().toLowerCase() ||
    m.phone === memberIdOrCode.trim()
  );
  
  if (!member) {
    return { success: false, reason: 'ไม่พบรหัสสมาชิกนี้ในระบบ' };
  }

  const status = calculateMemberStatus(member.expiryDate);
  const plan = plans.find(p => p.id === member.planId);
  
  const checkins = getCheckins();
  const now = getGymTodayDate();
  const timestampStr = now.getFullYear() + '-' + 
                       String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(now.getDate()).padStart(2, '0') + ' ' + 
                       String(now.getHours()).padStart(2, '0') + ':' + 
                       String(now.getMinutes()).padStart(2, '0') + ':' +
                       String(now.getSeconds()).padStart(2, '0');

  const newCheckin = {
    id: 'CK-' + (1000 + checkins.length + 1),
    memberId: member.id,
    memberName: member.fullname,
    timestamp: timestampStr,
    status: status,
    planName: plan ? plan.name : 'ไม่ระบุแพ็กเกจ'
  };

  checkins.unshift(newCheckin);
  saveCheckins(checkins);
  addAuditLog('เช็กอินเข้ายิม', `เช็กอินสมาชิก รหัส ${member.id} ชื่อ ${member.fullname} (สถานะ: ${status === 'active' ? 'ผ่าน' : status === 'warning' ? 'ใกล้หมดอายุ' : 'หมดอายุ'})`);

  return {
    success: true,
    member: member,
    checkin: newCheckin,
    status: status,
    planName: plan ? plan.name : 'ไม่ระบุแพ็กเกจ'
  };
}

// ----------------- WALK-IN DAILY QUICK PURCHASE -----------------
export function sellWalkInDaily(fullname, amount, paymentMethod) {
  const members = getMembers();
  const transactions = getTransactions();
  const now = getGymTodayDate();
  const dateStr = formatDateString(now);

  // สร้างรหัส Walk-in ชั่วคราวเฉพาะกิจ
  const walkinId = 'GM-W-' + (100 + members.filter(m => m.id.startsWith('GM-W-')).length + 1);
  const name = fullname.trim() || 'ลูกค้า Walk-in';

  // 1. ลงทะเบียนเป็นสมาชิกชั่วคราววันเดียว
  const newMember = {
    id: walkinId,
    fullname: name,
    phone: '-',
    email: '-',
    gender: 'อื่นๆ',
    status: 'active',
    planId: 'plan-daily',
    joinDate: dateStr,
    expiryDate: dateStr, // หมดอายุวันนี้
    avatarGradient: 'linear-gradient(135deg, #10B981, #06B6D4)' // Gradient เขียว-ฟ้า
  };

  members.push(newMember);
  saveMembers(members);

  // 2. บันทึกประวัติการรับเงิน
  const txId = 'TX-' + (1000 + transactions.length + 1);
  const timeStr = now.getFullYear() + '-' + 
                  String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(now.getDate()).padStart(2, '0') + ' ' + 
                  String(now.getHours()).padStart(2, '0') + ':' + 
                  String(now.getMinutes()).padStart(2, '0');
  
  const newTx = {
    id: txId,
    memberId: walkinId,
    memberName: name,
    planId: 'plan-daily',
    planName: 'ตั๋วรายวัน (Walk-in Daily)',
    amount: Number(amount),
    paymentMethod: paymentMethod,
    date: timeStr
  };
  transactions.unshift(newTx);
  saveTransactions(transactions);

  // 3. ทำการเช็กอินเข้าใช้ยิมทันที
  const checkinResult = checkInMember(walkinId);
  addAuditLog('ออกตั๋วรายวัน', `ออกตั๋ว Walk-in รายวัน ให้กับคุณ ${name} ยอดชำระ ฿${Number(amount).toLocaleString()} (${paymentMethod})`);

  return {
    member: newMember,
    checkin: checkinResult.checkin,
    amount: Number(amount)
  };
}

// ----------------- DAILY SUMMARY & LEDGER ARCHIVE -----------------
export function getDailySummary(dateStr) {
  const txs = getTransactions().filter(t => t.date.startsWith(dateStr));
  const shopSales = getShopSales().filter(s => s.date.startsWith(dateStr));
  const checkins = getCheckins().filter(c => c.timestamp.startsWith(dateStr));

  const membershipSales = txs.reduce((sum, t) => sum + t.amount, 0);
  const shopSalesSum = shopSales.reduce((sum, s) => sum + s.total, 0);
  
  // จำนวนตั๋วรายวัน = ทุกบิลที่รหัสขึ้นต้นด้วย GM-W หรือ PlanId = plan-daily
  const dailyPassesCount = txs.filter(t => t.planId === 'plan-daily' || t.memberId.startsWith('GM-W-')).length;

  return {
    date: dateStr,
    membershipSales: membershipSales,
    shopSales: shopSalesSum,
    dailyPasses: dailyPassesCount,
    checkinsCount: checkins.length,
    totalRevenue: membershipSales + shopSalesSum
  };
}

export function getArchivedSummaries() {
  initializeData();
  return JSON.parse(localStorage.getItem('gm_daily_archives'));
}

export function saveDailyArchives(archives) {
  localStorage.setItem('gm_daily_archives', JSON.stringify(archives));
  syncToCloud('daily_archives', archives);
}

export function archiveDailySummary(dateStr) {
  const archives = getArchivedSummaries();
  
  // ตรวจสอบว่าเคยปิดยอดของวันนี้ไปหรือยัง หากเคยปิดแล้วให้ทับข้อมูลล่าสุด
  const index = archives.findIndex(a => a.date === dateStr);
  const summary = getDailySummary(dateStr);
  const closedData = {
    ...summary,
    status: 'closed'
  };

  if (index !== -1) {
    archives[index] = closedData;
  } else {
    archives.push(closedData);
  }

  saveDailyArchives(archives);
  addAuditLog('ปิดยอดบัญชี', `ทำการปิดยอดบัญชีสรุปประจำวันสำหรับวันที่ ${dateStr} ยอดรวมรายรับ ฿${closedData.totalRevenue.toLocaleString()}`);
  return closedData;
}

// ----------------- USER AUTHENTICATION & AUDIT LOGS -----------------
let activeUser = null; // เซสชันผู้ใช้ปัจจุบันในตัวแอป

export function getCurrentUser() {
  if (!activeUser) {
    const cached = sessionStorage.getItem('gm_current_user');
    if (cached) {
      activeUser = JSON.parse(cached);
    }
  }
  return activeUser;
}

export function setCurrentUser(user) {
  activeUser = user;
  if (user) {
    sessionStorage.setItem('gm_current_user', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('gm_current_user');
  }
}

export function logoutUser() {
  if (activeUser) {
    addAuditLog('ออกจากระบบ', `ผู้ใช้ ${activeUser.name} ลงชื่อออกจากระบบการทำงาน`);
  }
  setCurrentUser(null);
}

export function verifyPin(pin) {
  const users = JSON.parse(localStorage.getItem('gm_users')) || INITIAL_USERS;
  const user = users.find(u => u.pin === pin);
  if (user) {
    setCurrentUser(user);
    addAuditLog('เข้าสู่ระบบ', `ผู้ใช้ ${user.name} ลงชื่อเข้าทำงานในเครื่องด้วยรหัส PIN สำเร็จ`);
    return user;
  }
  return null;
}

export function getAuditLogs() {
  initializeData();
  return JSON.parse(localStorage.getItem('gm_audit_logs')) || [];
}

export function saveAuditLogs(logs) {
  localStorage.setItem('gm_audit_logs', JSON.stringify(logs));
  syncToCloud('audit_logs', logs);
}

export function addAuditLog(action, details) {
  const logs = getAuditLogs();
  const user = getCurrentUser();
  const now = getGymTodayDate();
  
  const timeStr = now.getFullYear() + '-' + 
                  String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(now.getDate()).padStart(2, '0') + ' ' + 
                  String(now.getHours()).padStart(2, '0') + ':' + 
                  String(now.getMinutes()).padStart(2, '0') + ':' + 
                  String(now.getSeconds()).padStart(2, '0');

  const logId = 'LOG-' + (1000 + logs.length + 1);
  const newLog = {
    id: logId,
    timestamp: timeStr,
    userId: user ? user.id : 'system',
    userName: user ? user.name : 'ระบบหลัก',
    action: action,
    details: details
  };

  logs.unshift(newLog); // เอาเหตุการณ์ล่าสุดขึ้นก่อน
  saveAuditLogs(logs);
  return newLog;
}
