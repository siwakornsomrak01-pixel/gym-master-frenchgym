(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&e(o)}).observe(document,{childList:!0,subtree:!0});function n(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(t){if(t.ep)return;t.ep=!0;const i=n(t);fetch(t.href,i)}})();const Q=[{id:"plan-daily",name:"รายวัน (Daily)",price:150,durationDays:1},{id:"plan-monthly",name:"รายเดือน (Monthly)",price:1500,durationDays:30},{id:"plan-3months",name:"3 เดือน (Quarterly)",price:4e3,durationDays:90},{id:"plan-6months",name:"6 เดือน (6-Months)",price:7500,durationDays:180},{id:"plan-yearly",name:"รายปี (Yearly)",price:12e3,durationDays:365}],re=[{id:"prod-water",name:"น้ำดื่มสะอาด",price:10,icon:"droplet"},{id:"prod-sports",name:"เครื่องดื่มเกลือแร่",price:25,icon:"zap"},{id:"prod-whey",name:"เวย์โปรตีนเชก",price:60,icon:"cup-soda"},{id:"prod-lcarnitine",name:"แอล-คาร์นิทีน",price:40,icon:"flame"}],de=[{id:"GM-001",fullname:"สมชาย รักเรียน",phone:"0812345678",email:"somchai@email.com",gender:"ชาย",status:"active",planId:"plan-monthly",joinDate:"2026-07-01",expiryDate:"2026-08-01",avatarGradient:"linear-gradient(135deg, #FF5F1F, #FFD700)"},{id:"GM-002",fullname:"สมศรี มีดี",phone:"0823456789",email:"somsri@email.com",gender:"หญิง",status:"expired",planId:"plan-daily",joinDate:"2026-07-10",expiryDate:"2026-07-11",avatarGradient:"linear-gradient(135deg, #EF4444, #FF5F1F)"},{id:"GM-003",fullname:"กิตติพงษ์ แก้วดี",phone:"0834567890",email:"kittipong@email.com",gender:"ชาย",status:"active",planId:"plan-3months",joinDate:"2026-05-15",expiryDate:"2026-08-13",avatarGradient:"linear-gradient(135deg, #3B82F6, #10B981)"},{id:"GM-004",fullname:"อารียา สุขสันต์",phone:"0845678901",email:"areeya@email.com",gender:"หญิง",status:"warning",planId:"plan-monthly",joinDate:"2026-06-28",expiryDate:"2026-07-28",avatarGradient:"linear-gradient(135deg, #F59E0B, #FFD700)"},{id:"GM-005",fullname:"มานะ ขยันเพียร",phone:"0856789012",email:"mana@email.com",gender:"ชาย",status:"active",planId:"plan-yearly",joinDate:"2026-01-10",expiryDate:"2027-01-10",avatarGradient:"linear-gradient(135deg, #8B5CF6, #EC4899)"}],ce=[{id:"TX-1001",memberId:"GM-005",memberName:"มานะ ขยันเพียร",planId:"plan-yearly",planName:"รายปี (Yearly)",amount:12e3,paymentMethod:"โอนผ่านธนาคาร",date:"2026-01-10 10:30"},{id:"TX-1002",memberId:"GM-003",memberName:"กิตติพงษ์ แก้วดี",planId:"plan-3months",planName:"3 เดือน (Quarterly)",amount:4e3,paymentMethod:"บัตรเครดิต",date:"2026-05-15 14:15"},{id:"TX-1003",memberId:"GM-004",memberName:"อารียา สุขสันต์",planId:"plan-monthly",planName:"รายเดือน (Monthly)",amount:1500,paymentMethod:"เงินสด",date:"2026-06-28 09:00"},{id:"TX-1004",memberId:"GM-001",memberName:"สมชาย รักเรียน",planId:"plan-monthly",planName:"รายเดือน (Monthly)",amount:1500,paymentMethod:"โอนผ่านธนาคาร",date:"2026-07-01 17:45"},{id:"TX-1005",memberId:"GM-002",memberName:"สมศรี มีดี",planId:"plan-daily",planName:"รายวัน (Daily)",amount:150,paymentMethod:"เงินสด",date:"2026-07-10 11:20"}],le=[{id:"SL-1001",items:[{productId:"prod-water",name:"น้ำดื่มสะอาด",qty:2,price:10},{productId:"prod-whey",name:"เวย์โปรตีนเชก",qty:1,price:60}],total:80,paymentMethod:"เงินสด",date:"2026-07-24 14:20"},{id:"SL-1002",items:[{productId:"prod-sports",name:"เครื่องดื่มเกลือแร่",qty:1,price:25}],total:25,paymentMethod:"โอนผ่านธนาคาร",date:"2026-07-25 08:35"}],me=[{id:"CK-1001",memberId:"GM-005",memberName:"มานะ ขยันเพียร",timestamp:"2026-07-24 08:30:12",status:"active",planName:"รายปี (Yearly)"},{id:"CK-1002",memberId:"GM-001",memberName:"สมชาย รักเรียน",timestamp:"2026-07-24 18:15:45",status:"active",planName:"รายเดือน (Monthly)"},{id:"CK-1003",memberId:"GM-004",memberName:"อารียา สุขสันต์",timestamp:"2026-07-24 19:00:22",status:"warning",planName:"รายเดือน (Monthly)"},{id:"CK-1004",memberId:"GM-003",memberName:"กิตติพงษ์ แก้วดี",timestamp:"2026-07-25 06:45:00",status:"active",planName:"3 เดือน (Quarterly)"},{id:"CK-1005",memberId:"GM-005",memberName:"มานะ ขยันเพียร",timestamp:"2026-07-25 08:12:10",status:"active",planName:"รายปี (Yearly)"}],ue=[{date:"2026-07-24",membershipSales:1500,shopSales:80,dailyPasses:0,checkinsCount:3,totalRevenue:1580,status:"closed"}];function v(){return new Date("2026-07-25T07:35:08")}function I(a){const s=a.getFullYear(),n=String(a.getMonth()+1).padStart(2,"0"),e=String(a.getDate()).padStart(2,"0");return`${s}-${n}-${e}`}function M(a){const s=v();s.setHours(0,0,0,0);const n=new Date(a);n.setHours(0,0,0,0);const e=n-s,t=Math.ceil(e/(1e3*60*60*24));return t<0?"expired":t<=7?"warning":"active"}function E(){if(!localStorage.getItem("gm_plans"))localStorage.setItem("gm_plans",JSON.stringify(Q));else{const a=JSON.parse(localStorage.getItem("gm_plans"));if(!a.some(n=>n.id==="plan-6months")){const n=a.findIndex(t=>t.id==="plan-3months"),e=Q.find(t=>t.id==="plan-6months");e&&(n!==-1?a.splice(n+1,0,e):a.push(e),localStorage.setItem("gm_plans",JSON.stringify(a)))}}if(localStorage.getItem("gm_products")||localStorage.setItem("gm_products",JSON.stringify(re)),!localStorage.getItem("gm_members")){const a=de.map(s=>({...s,status:M(s.expiryDate)}));localStorage.setItem("gm_members",JSON.stringify(a))}localStorage.getItem("gm_transactions")||localStorage.setItem("gm_transactions",JSON.stringify(ce)),localStorage.getItem("gm_shop_sales")||localStorage.setItem("gm_shop_sales",JSON.stringify(le)),localStorage.getItem("gm_checkins")||localStorage.setItem("gm_checkins",JSON.stringify(me)),localStorage.getItem("gm_daily_archives")||localStorage.setItem("gm_daily_archives",JSON.stringify(ue))}function b(){return E(),JSON.parse(localStorage.getItem("gm_plans"))}function pe(a){localStorage.setItem("gm_plans",JSON.stringify(a))}function ge(a,s){const n=b(),e=n.findIndex(t=>t.id===a);return e!==-1?(n[e].price=Number(s),pe(n),!0):!1}function S(){return E(),JSON.parse(localStorage.getItem("gm_products"))}function fe(a,s,n){const e=S(),i={id:"prod-"+Date.now(),name:a,price:Number(s),icon:n||"droplet"};return e.push(i),localStorage.setItem("gm_products",JSON.stringify(e)),i}function ye(a,s,n,e){const t=S(),i=t.findIndex(o=>o.id===a);return i!==-1?(t[i]={...t[i],name:s,price:Number(n),icon:e||"droplet"},localStorage.setItem("gm_products",JSON.stringify(t)),!0):!1}function ve(a){const s=S(),n=s.filter(e=>e.id!==a);return s.length!==n.length?(localStorage.setItem("gm_products",JSON.stringify(n)),!0):!1}function h(){E();const a=JSON.parse(localStorage.getItem("gm_members"));let s=!1;return a.forEach(n=>{const e=M(n.expiryDate);n.status!==e&&(n.status=e,s=!0)}),s&&T(a),a}function T(a){localStorage.setItem("gm_members",JSON.stringify(a))}function he(){const s=h().filter(t=>!t.id.startsWith("GM-W-"));if(s.length===0)return"GM-001";const n=s.map(t=>{const i=parseInt(t.id.replace("GM-",""));return isNaN(i)?0:i}),e=Math.max(...n);return`GM-${String(e+1).padStart(3,"0")}`}function be(a){const s=h(),n=he(),e=["linear-gradient(135deg, #FF5F1F, #FFD700)","linear-gradient(135deg, #EF4444, #FF5F1F)","linear-gradient(135deg, #3B82F6, #10B981)","linear-gradient(135deg, #F59E0B, #FFD700)","linear-gradient(135deg, #8B5CF6, #EC4899)","linear-gradient(135deg, #06B6D4, #3B82F6)","linear-gradient(135deg, #10B981, #6EE7B7)"],t=e[Math.floor(Math.random()*e.length)],i=M(a.expiryDate),o={id:n,fullname:a.fullname,phone:a.phone,email:a.email||"-",gender:a.gender,status:i,planId:a.planId,joinDate:a.joinDate,expiryDate:a.expiryDate,avatarGradient:t};return s.push(o),T(s),o}function K(a){const s=h(),n=s.findIndex(e=>e.id===a.id);if(n!==-1){const e=M(a.expiryDate);return s[n]={...s[n],...a,status:e},T(s),!0}return!1}function Ie(a){const s=h(),n=s.filter(e=>e.id!==a);return s.length!==n.length?(T(n),!0):!1}function k(){return E(),JSON.parse(localStorage.getItem("gm_transactions"))}function R(a){localStorage.setItem("gm_transactions",JSON.stringify(a))}function P(){return E(),JSON.parse(localStorage.getItem("gm_shop_sales"))}function xe(a){localStorage.setItem("gm_shop_sales",JSON.stringify(a))}function Ee(a,s,n){const e=P(),t=v(),i=t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")+" "+String(t.getHours()).padStart(2,"0")+":"+String(t.getMinutes()).padStart(2,"0"),r={id:"SL-"+(1e3+e.length+1),items:a,total:Number(s),paymentMethod:n,date:i};return e.unshift(r),xe(e),r}function w(){return E(),JSON.parse(localStorage.getItem("gm_checkins"))}function Se(a){localStorage.setItem("gm_checkins",JSON.stringify(a))}function X(a){const s=h(),n=b(),e=s.find(l=>l.id.toLowerCase()===a.trim().toLowerCase()||l.phone===a.trim());if(!e)return{success:!1,reason:"ไม่พบรหัสสมาชิกนี้ในระบบ"};const t=M(e.expiryDate),i=n.find(l=>l.id===e.planId),o=w(),r=v(),d=r.getFullYear()+"-"+String(r.getMonth()+1).padStart(2,"0")+"-"+String(r.getDate()).padStart(2,"0")+" "+String(r.getHours()).padStart(2,"0")+":"+String(r.getMinutes()).padStart(2,"0")+":"+String(r.getSeconds()).padStart(2,"0"),c={id:"CK-"+(1e3+o.length+1),memberId:e.id,memberName:e.fullname,timestamp:d,status:t,planName:i?i.name:"ไม่ระบุแพ็กเกจ"};return o.unshift(c),Se(o),{success:!0,member:e,checkin:c,status:t,planName:i?i.name:"ไม่ระบุแพ็กเกจ"}}function Be(a,s,n){const e=h(),t=k(),i=v(),o=I(i),r="GM-W-"+(100+e.filter(f=>f.id.startsWith("GM-W-")).length+1),d=a.trim()||"ลูกค้า Walk-in",c={id:r,fullname:d,phone:"-",email:"-",gender:"อื่นๆ",status:"active",planId:"plan-daily",joinDate:o,expiryDate:o,avatarGradient:"linear-gradient(135deg, #10B981, #06B6D4)"};e.push(c),T(e);const l="TX-"+(1e3+t.length+1),m=i.getFullYear()+"-"+String(i.getMonth()+1).padStart(2,"0")+"-"+String(i.getDate()).padStart(2,"0")+" "+String(i.getHours()).padStart(2,"0")+":"+String(i.getMinutes()).padStart(2,"0"),g={id:l,memberId:r,memberName:d,planId:"plan-daily",planName:"ตั๋วรายวัน (Walk-in Daily)",amount:Number(s),paymentMethod:n,date:m};t.unshift(g),R(t);const u=X(r);return{member:c,checkin:u.checkin,amount:Number(s)}}function j(a){const s=k().filter(r=>r.date.startsWith(a)),n=P().filter(r=>r.date.startsWith(a)),e=w().filter(r=>r.timestamp.startsWith(a)),t=s.reduce((r,d)=>r+d.amount,0),i=n.reduce((r,d)=>r+d.total,0),o=s.filter(r=>r.planId==="plan-daily"||r.memberId.startsWith("GM-W-")).length;return{date:a,membershipSales:t,shopSales:i,dailyPasses:o,checkinsCount:e.length,totalRevenue:t+i}}function U(){return E(),JSON.parse(localStorage.getItem("gm_daily_archives"))}function Le(a){const s=U(),n=s.findIndex(i=>i.date===a),t={...j(a),status:"closed"};return n!==-1?s[n]=t:s.push(t),localStorage.setItem("gm_daily_archives",JSON.stringify(s)),t}let z=null,A="owner",N="all",y=[];const F={searchQuery:"",statusFilter:"all"};function q(a){if(document.getElementById("sound-checkbox").checked)try{const s=window.AudioContext||window.webkitAudioContext;if(!s)return;const n=new s;if(a==="active"){const e=n.createOscillator(),t=n.createGain();e.type="sine",e.connect(t),t.connect(n.destination),e.frequency.setValueAtTime(523.25,n.currentTime),e.frequency.setValueAtTime(659.25,n.currentTime+.12),t.gain.setValueAtTime(.1,n.currentTime),t.gain.exponentialRampToValueAtTime(.01,n.currentTime+.4),e.start(),e.stop(n.currentTime+.45)}else if(a==="warning"){const e=n.createOscillator(),t=n.createGain();e.type="triangle",e.connect(t),t.connect(n.destination),e.frequency.setValueAtTime(392,n.currentTime),e.frequency.setValueAtTime(392,n.currentTime+.15),t.gain.setValueAtTime(.12,n.currentTime),t.gain.setValueAtTime(.01,n.currentTime+.1),t.gain.setValueAtTime(.12,n.currentTime+.15),t.gain.exponentialRampToValueAtTime(.01,n.currentTime+.4),e.start(),e.stop(n.currentTime+.45)}else{const e=n.createOscillator(),t=n.createGain();e.type="sawtooth",e.connect(t),t.connect(n.destination),e.frequency.setValueAtTime(130.81,n.currentTime),t.gain.setValueAtTime(.15,n.currentTime),t.gain.exponentialRampToValueAtTime(.01,n.currentTime+.5),e.start(),e.stop(n.currentTime+.55)}}catch(s){console.warn("ไม่สามารถเล่นเสียงแจ้งเตือนได้เนื่องจากเบราว์เซอร์บล็อก:",s)}}function x(){window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons()}function Y(){A=document.getElementById("role-toggle-select").value;const s=document.getElementById("nav-item-dashboard"),n=document.getElementById("nav-item-billing"),e=document.getElementById("nav-item-traffic"),t=document.getElementById("owner-daily-report-section"),i=document.querySelector(".role-selector-wrapper");if(A==="staff"){i.style.borderColor="var(--accent-orange)",i.querySelector("i").style.color="var(--accent-orange)",s.style.display="none",n.style.display="none",e.style.display="block",t&&(t.style.display="none");const o=document.querySelector(".sidebar .nav-link.active");if(o){const r=o.dataset.view;(r==="dashboard"||r==="billing")&&H("checkin")}}else i.style.borderColor="var(--accent-gold)",i.querySelector("i").style.color="var(--accent-gold)",s.style.display="block",n.style.display="block",e.style.display="block",t&&(t.style.display="block")}function H(a){const s=document.querySelectorAll(".sidebar .nav-link"),n=Array.from(s).find(e=>e.dataset.view===a);if(n){s.forEach(i=>i.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".views-container .view-panel").forEach(i=>{i.classList.remove("active")});const e=document.getElementById(`${a}-view`);e&&e.classList.add("active");const t=n.querySelector("span").textContent;document.getElementById("current-view-title").textContent=t,Z(a)}}function Z(a){a==="dashboard"?ee():a==="members"?L():a==="checkin"?(V(),_()):a==="traffic"?ne():a==="shop"?De():a==="billing"&&D()}function ee(){const a=h(),s=k(),n=P(),e=w();let t=[...s],i=[...n];N!=="all"&&(t=t.filter(p=>p.paymentMethod===N),i=i.filter(p=>p.paymentMethod===N));const o=a.length,r=a.filter(p=>p.status==="active").length,d=a.filter(p=>p.status==="expired").length,c=t.reduce((p,B)=>p+B.amount,0),l=i.reduce((p,B)=>p+B.total,0),m=c+l;document.getElementById("kpi-total-members").textContent=o,document.getElementById("kpi-active-members").textContent=r,document.getElementById("kpi-expired-members").textContent=d,document.getElementById("kpi-total-revenue").textContent=`฿${m.toLocaleString("th-TH")}`;const g=document.getElementById("dashboard-checkins-list");g.innerHTML="";const u=I(v()),f=e.filter(p=>p.timestamp.startsWith(u)).slice(0,5);f.length===0?g.innerHTML=`
      <div style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;">
        ยังไม่มีการเช็กชื่อเข้าใช้งานในวันนี้
      </div>
    `:f.forEach(p=>{const B=p.memberName.substring(0,2),C=a.find(oe=>oe.id===p.memberId),se=C?C.avatarGradient:"linear-gradient(135deg, #A0A0A0, #626272)";let G="ปกติ";p.status==="expired"&&(G="หมดอายุ"),p.status==="warning"&&(G="ใกล้หมด");const ie=p.timestamp.split(" ")[1],O=document.createElement("div");O.className="checkin-row",O.innerHTML=`
        <div class="checkin-user-info">
          <div class="checkin-avatar" style="background: ${se}">${B}</div>
          <div class="checkin-detail">
            <span class="checkin-name">${p.memberName}</span>
            <span class="checkin-plan">${p.planName}</span>
          </div>
        </div>
        <div class="checkin-meta">
          <span class="checkin-time font-eng">${ie} น.</span>
          <div><span class="badge ${p.status}">${G}</span></div>
        </div>
      `,g.appendChild(O)}),ke(c,l),x()}function ke(a,s){const n=document.getElementById("revenue-chart").getContext("2d");z&&z.destroy(),z=new Chart(n,{type:"bar",data:{labels:["ค่าสมัครสมาชิก (Membership)","ยอดขายเครื่องดื่ม (Beverage Sales)"],datasets:[{data:[a,s],backgroundColor:["rgba(255, 95, 31, 0.7)","rgba(255, 215, 0, 0.7)"],borderColor:["#ff5f1f","#ffd700"],borderWidth:1.5,borderRadius:8,barPercentage:.5}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{titleFont:{family:"Prompt",size:13},bodyFont:{family:"Prompt",size:12},callbacks:{label:function(e){return` ยอดรวม: ฿${e.parsed.y.toLocaleString("th-TH")}`}}}},scales:{y:{grid:{color:"rgba(255, 255, 255, 0.05)"},ticks:{color:"#a0a0b0",font:{family:"Prompt",size:11},callback:function(e){return"฿"+e.toLocaleString()}}},x:{grid:{display:!1},ticks:{color:"#a0a0b0",font:{family:"Prompt",size:12}}}}}})}function L(){const a=h(),s=b(),n=document.getElementById("members-table-body");n.innerHTML="";const e=F.searchQuery.toLowerCase().trim(),t=F.statusFilter,i=a.filter(o=>{if(o.id.startsWith("GM-W-"))return!1;const r=o.id.toLowerCase().includes(e)||o.fullname.toLowerCase().includes(e)||o.phone.includes(e);let d=!0;return t!=="all"&&(d=o.status===t),r&&d});if(i.length===0){n.innerHTML=`
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
          ไม่พบรายชื่อสมาชิกตามเงื่อนไขที่ระบุ
        </td>
      </tr>
    `;return}i.forEach(o=>{const r=o.fullname.substring(0,2),d=s.find(p=>p.id===o.planId),c=d?d.name:"ไม่ระบุ";let l="ปกติ";o.status==="expired"&&(l="หมดอายุ"),o.status==="warning"&&(l="ใกล้หมด");const m=new Date(o.expiryDate),g={year:"numeric",month:"short",day:"numeric"},u=m.toLocaleDateString("th-TH",g),f=document.createElement("tr");f.innerHTML=`
      <td class="font-eng" style="font-weight: 600;">${o.id}</td>
      <td>
        <div class="table-user-info">
          <div class="member-avatar" style="background: ${o.avatarGradient}">${r}</div>
          <div>
            <div class="member-fullname">${o.fullname}</div>
            <div class="member-subtext">เพศ: ${o.gender} | สมัครเมื่อ: ${o.joinDate}</div>
          </div>
        </div>
      </td>
      <td class="font-eng">${o.phone}</td>
      <td>${c}</td>
      <td>
        <div class="font-eng">${o.expiryDate}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${u}</div>
      </td>
      <td><span class="badge ${o.status}">${l}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn view" data-id="${o.id}" title="ดูรายละเอียด"><i data-lucide="eye"></i></button>
          <button class="action-btn edit" data-id="${o.id}" title="แก้ไขข้อมูล"><i data-lucide="edit-3"></i></button>
          <button class="action-btn delete" data-id="${o.id}" title="ลบสมาชิก"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    `,n.appendChild(f)}),n.querySelectorAll(".action-btn.view").forEach(o=>{o.addEventListener("click",()=>Oe(o.dataset.id))}),n.querySelectorAll(".action-btn.edit").forEach(o=>{o.addEventListener("click",()=>te(o.dataset.id))}),n.querySelectorAll(".action-btn.delete").forEach(o=>{o.addEventListener("click",()=>we(o.dataset.id))}),x()}function we(a){const n=h().find(e=>e.id===a);n&&confirm(`คุณต้องการลบข้อมูลของ "${n.fullname}" หรือไม่? ข้อมูลทั้งหมดจะสูญหาย`)&&(Ie(a),L())}function te(a=null){const s=document.getElementById("member-modal"),n=document.getElementById("member-modal-title"),e=document.getElementById("member-form"),t=b(),i=document.getElementById("form-plan");if(i.innerHTML=t.map(o=>`<option value="${o.id}">${o.name} (฿${o.price.toLocaleString()})</option>`).join(""),e.reset(),document.getElementById("form-special-checkbox").checked=!1,document.getElementById("form-special-input-wrapper").classList.remove("active"),document.getElementById("form-special-price").required=!1,a){n.textContent="แก้ไขข้อมูลสมาชิก";const r=h().find(d=>d.id===a);r&&(document.getElementById("form-member-id").value=r.id,document.getElementById("form-fullname").value=r.fullname,document.getElementById("form-phone").value=r.phone,document.getElementById("form-email").value=r.email==="-"?"":r.email,document.getElementById("form-gender").value=r.gender,document.getElementById("form-plan").value=r.planId,document.getElementById("form-joindate").value=r.joinDate,document.getElementById("form-expirydate").value=r.expiryDate)}else{n.textContent="ลงทะเบียนสมาชิกใหม่",document.getElementById("form-member-id").value="";const o=I(v());document.getElementById("form-joindate").value=o,J()}s.classList.add("active")}function J(){const a=document.getElementById("form-joindate").value,s=document.getElementById("form-plan").value;if(!a||!s)return;const e=b().find(o=>o.id===s);if(!e)return;const t=new Date(a),i=new Date(t);i.setDate(t.getDate()+e.durationDays),document.getElementById("form-expirydate").value=I(i),document.getElementById("form-special-price").value=e.price}function $e(a){a.preventDefault();const s=document.getElementById("form-member-id").value,n={fullname:document.getElementById("form-fullname").value,phone:document.getElementById("form-phone").value,email:document.getElementById("form-email").value,gender:document.getElementById("form-gender").value,planId:document.getElementById("form-plan").value,joinDate:document.getElementById("form-joindate").value,expiryDate:document.getElementById("form-expirydate").value},t=b().find(r=>r.id===n.planId),i=document.getElementById("form-special-checkbox").checked;let o=t?t.price:0;if(i&&(o=Number(document.getElementById("form-special-price").value)),s)K({id:s,...n})&&alert("แก้ไขข้อมูลสมาชิกเรียบร้อยแล้ว");else{const r=be(n);if(t&&r){const d=i?`${t.name} (เรตพิเศษ)`:t.name,c=k(),l=v(),m=l.getFullYear()+"-"+String(l.getMonth()+1).padStart(2,"0")+"-"+String(l.getDate()).padStart(2,"0")+" "+String(l.getHours()).padStart(2,"0")+":"+String(l.getMinutes()).padStart(2,"0"),u={id:"TX-"+(1e3+c.length+1),memberId:r.id,memberName:r.fullname,planId:t.id,planName:d,amount:o,paymentMethod:"เงินสด",date:m};c.unshift(u),R(c)}alert(`ลงทะเบียนสำเร็จ! รหัสสมาชิกคือ: ${r.id} ยอดเงินชำระ: ฿${o}`)}document.getElementById("member-modal").classList.remove("active"),L()}function V(){const a=w(),s=document.getElementById("today-checkin-log-list");s.innerHTML="";const n=I(v()),e=a.filter(t=>t.timestamp.startsWith(n));if(e.length===0){s.innerHTML=`
      <div style="text-align: center; color: var(--text-muted); padding: 15px; font-size: 13px;">
        ยังไม่มีประวัติการเช็กชื่อในวันนี้
      </div>
    `;return}e.forEach(t=>{const i=t.timestamp.split(" ")[1];let o="ปกติ";t.status==="expired"&&(o="หมดอายุ"),t.status==="warning"&&(o="ใกล้หมด");const r=document.createElement("div");r.className="checkin-row",r.style.padding="8px 12px",r.innerHTML=`
      <div>
        <div style="font-size: 13px; font-weight: 500;">${t.memberName} (${t.memberId})</div>
        <div style="font-size: 10px; color: var(--text-muted);">${t.planName}</div>
      </div>
      <div class="text-right">
        <div style="font-size: 11px;" class="font-eng">${i}</div>
        <span class="badge ${t.status}" style="font-size: 9px; padding: 2px 4px;">${o}</span>
      </div>
    `,s.appendChild(r)})}function _(){const a=document.getElementById("checkin-result-panel");a&&(a.className="checkin-status-panel empty",a.innerHTML=`
      <div class="status-display">
        <div class="status-icon"><i data-lucide="info"></i></div>
        <div class="status-message">กรุณาระบุรหัสสมาชิกเพื่อตรวจสอบ</div>
        <p style="color: var(--text-secondary); font-size: 14px;">พิมพ์รหัสและกดปุ่มยืนยันเช็กอินด้านซ้ายเพื่อดูสิทธิ์</p>
      </div>
    `,x())}function Me(a){a.preventDefault();const s=document.getElementById("checkin-member-id"),n=s.value.trim();if(!n)return;const e=X(n),t=document.getElementById("checkin-result-panel");if(t.className="checkin-status-panel",!e.success)t.classList.add("expired"),t.innerHTML=`
      <div class="status-display">
        <div class="status-icon"><i data-lucide="x-circle"></i></div>
        <div class="status-message">ไม่พบสมาชิก</div>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">ไม่พบบัญชีสมาชิกหรือหมายเลขโทรศัพท์ "${n}" ในยิมนี้</p>
        <button class="secondary-btn" id="checkin-retry-btn" style="width: auto; padding: 8px 20px;">ลองใหม่อีกครั้ง</button>
      </div>
    `,q("expired");else{const r=e.member,d=r.fullname.substring(0,2),c=v();c.setHours(0,0,0,0);const l=new Date(r.expiryDate);l.setHours(0,0,0,0);const m=Math.ceil((l-c)/(1e3*60*60*24));let g="อนุญาตให้เข้ายิมได้",u=`สมาชิกสถานะปกติ (เหลืออายุการใช้งานอีก ${m} วัน)`;e.status==="expired"?(g="ระงับสิทธิ์เข้าใช้งาน!",u="แพ็กเกจสมาชิกของคุณหมดอายุแล้ว กรุณาติดต่อต่ออายุที่เคาน์เตอร์",t.classList.add("expired")):e.status==="warning"?(g="ผ่าน (สิทธิ์ใกล้หมดอายุ)",u=`สมาชิกจะหมดอายุในอีก ${m} วันโปรดชำระค่าบริการล่วงหน้า`,t.classList.add("warning")):t.classList.add("active");let f="ปกติ";e.status==="expired"&&(f="หมดอายุ"),e.status==="warning"&&(f="ใกล้หมด"),t.innerHTML=`
      <div class="status-display" style="width: 100%;">
        <div class="status-icon">
          ${e.status==="active"?'<i data-lucide="check-circle-2"></i>':""}
          ${e.status==="warning"?'<i data-lucide="alert-triangle"></i>':""}
          ${e.status==="expired"?'<i data-lucide="shield-alert"></i>':""}
        </div>
        <div class="status-message">${g}</div>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">${u}</p>
        
        <div class="status-member-card">
          <div class="status-member-avatar" style="background: ${r.avatarGradient}">${d}</div>
          <div class="status-member-details">
            <span class="status-member-name">${r.fullname}</span>
            <span class="status-member-id">${r.id} | เบอร์: ${r.phone}</span>
            <span class="status-member-expiry">แพ็กเกจ: ${e.planName}</span>
            <span style="font-size: 11px; margin-top: 4px; display: inline-block;">
              วันหมดอายุ: <strong class="font-eng" style="color: #fff;">${r.expiryDate}</strong> 
              (<span class="badge ${e.status}" style="font-size: 9px; padding: 1px 4px;">${f}</span>)
            </span>
          </div>
        </div>
        
        <button class="secondary-btn" id="checkin-clear-btn" style="width: auto; padding: 8px 20px; margin-top: 24px;">ถัดไป</button>
      </div>
    `,q(e.status)}s.value="",s.focus(),V(),x();const i=document.getElementById("checkin-clear-btn");i&&i.addEventListener("click",_);const o=document.getElementById("checkin-retry-btn");o&&o.addEventListener("click",_)}function Te(a){a.preventDefault();const s=document.getElementById("daily-pass-name"),n=document.getElementById("daily-pass-price"),e=document.getElementById("daily-pass-payment"),t=s.value.trim()||"ลูกค้า Walk-in",i=Number(n.value),o=e.value,r=Be(t,i,o),d=document.getElementById("checkin-result-panel");d.className="checkin-status-panel active";const c=r.member,l=c.fullname.substring(0,2);d.innerHTML=`
    <div class="status-display" style="width: 100%;">
      <div class="status-icon"><i data-lucide="check-circle-2" style="color: var(--color-success);"></i></div>
      <div class="status-message" style="color: var(--color-success);">ซื้อตั๋วรายวันสำเร็จ! (เช็กอินทันที)</div>
      <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">ชำระเงินค่าบริการ ฿${r.amount} เรียบร้อยแล้ว (สิทธิ์ใช้งานถึงเวลาปิดบริการวันนี้)</p>
      
      <div class="status-member-card" style="border-color: rgba(16, 185, 129, 0.3); background-color: rgba(16, 185, 129, 0.05);">
        <div class="status-member-avatar" style="background: ${c.avatarGradient}">${l}</div>
        <div class="status-member-details">
          <span class="status-member-name">${c.fullname}</span>
          <span class="status-member-id">${c.id} (ตั๋วรายวันชั่วคราว)</span>
          <span class="status-member-expiry">จ่ายโดย: ${o}</span>
          <span style="font-size: 11px; margin-top: 4px; display: inline-block;">
            วันหมดอายุ: <strong class="font-eng" style="color: #fff;">${c.expiryDate}</strong>
          </span>
        </div>
      </div>
      
      <button class="secondary-btn" id="checkin-clear-btn" style="width: auto; padding: 8px 20px; margin-top: 24px;">ถัดไป</button>
    </div>
  `,q("active"),s.value="",n.value="150",e.value="เงินสด",V(),x();const m=document.getElementById("checkin-clear-btn");m&&m.addEventListener("click",_)}function ne(){const a=w(),s=document.getElementById("traffic-table-body");s.innerHTML="";const n=document.getElementById("traffic-date-picker");if(!n.value){const i=I(v());n.value=i}const e=n.value,t=a.filter(i=>i.timestamp.startsWith(e));if(t.length===0){s.innerHTML=`
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">
          ยังไม่มีทราฟฟิกประวัติคนเข้ายิมในวันที่เลือก
        </td>
      </tr>
    `;return}t.forEach(i=>{let o="ปกติ";i.status==="expired"&&(o="หมดอายุ"),i.status==="warning"&&(o="ใกล้หมด");const r=document.createElement("tr");r.innerHTML=`
      <td class="font-eng" style="color: var(--text-secondary);">${i.timestamp.split(" ")[1]} น.</td>
      <td class="font-eng" style="font-weight: 600;">${i.memberId}</td>
      <td style="font-weight: 500;">${i.memberName}</td>
      <td>${i.planName}</td>
      <td><span class="badge ${i.status}">${o}</span></td>
    `,s.appendChild(r)}),x()}function De(){const a=S(),s=document.getElementById("shop-products-grid");if(s.innerHTML="",a.length===0){s.innerHTML=`
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px; border: 1px dashed var(--border-color); border-radius: var(--border-radius);">
        ยังไม่มีสินค้าเครื่องดื่มในร้านค้าขณะนี้ (เจ้าของยิมสามารถตั้งค่าและเพิ่มรายการสินค้าได้ที่หน้าการเงิน)
      </div>
    `,$();return}a.forEach(n=>{const e=document.createElement("div");e.className="product-card",e.onclick=()=>Ce(n.id),e.innerHTML=`
      <div class="product-icon-wrapper">
        <i data-lucide="${n.icon||"droplet"}"></i>
      </div>
      <div class="product-name-txt">${n.name}</div>
      <div class="product-price-txt">฿${n.price}</div>
    `,s.appendChild(e)}),$(),x()}function Ce(a){const n=S().find(t=>t.id===a);if(!n)return;const e=y.findIndex(t=>t.product.id===a);e!==-1?y[e].qty++:y.push({product:n,qty:1}),$()}function Ne(a,s){const n=y.findIndex(e=>e.product.id===a);n!==-1&&(y[n].qty+=s,y[n].qty<=0&&y.splice(n,1),$())}function $(){const a=document.getElementById("cart-items-list");a.innerHTML="";let s=0;if(y.length===0){a.innerHTML=`
      <div class="cart-empty-message">ไม่มีสินค้าในตะกร้า เลือกสินค้าทางด้านซ้าย</div>
    `,document.getElementById("cart-total-value").textContent="฿0";return}y.forEach(n=>{const e=n.product.price*n.qty;s+=e;const t=document.createElement("div");t.className="cart-item-row",t.innerHTML=`
      <div class="cart-item-info">
        <span class="cart-item-name">${n.product.name}</span>
        <span class="cart-item-price font-eng">฿${n.product.price} x ${n.qty}</span>
      </div>
      <div class="cart-item-actions">
        <button class="cart-qty-btn font-eng" onclick="event.stopPropagation(); window.updateCartQty('${n.product.id}', -1)">-</button>
        <span class="cart-item-qty">${n.qty}</span>
        <button class="cart-qty-btn font-eng" onclick="event.stopPropagation(); window.updateCartQty('${n.product.id}', 1)">+</button>
      </div>
    `,a.appendChild(t)}),document.getElementById("cart-total-value").textContent=`฿${s.toLocaleString()}`}function He(a){if(a.preventDefault(),y.length===0){alert("ไม่มีสินค้าในตะกร้าเพื่อทำรายการชำระเงิน");return}const s=document.getElementById("shop-payment-method").value,n=y.map(i=>({productId:i.product.id,name:i.product.name,qty:i.qty,price:i.product.price})),e=y.reduce((i,o)=>i+o.product.price*o.qty,0),t=Ee(n,e,s);t&&(q("active"),alert(`บันทึกการขายน้ำสำเร็จ! เลขใบเสร็จ: ${t.id} ยอดรวม ฿${e}`),y=[],$())}function D(){const a=b(),s=k(),n=P(),e=S(),t=document.getElementById("plans-container");t.innerHTML="",a.forEach(d=>{const c=document.createElement("div");c.className="plan-card",c.innerHTML=`
      <h4 class="plan-name">${d.name}</h4>
      <div class="plan-price-display">
        <span class="plan-price-num">${d.price.toLocaleString()}</span>
        <span class="plan-price-currency">บาท</span>
      </div>
      <div class="plan-duration">มีผลครอบคลุมนาน ${d.durationDays} วัน</div>
      <button class="secondary-btn edit-plan-btn" data-id="${d.id}">
        <i data-lucide="edit-2" style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
        แก้ไขค่าบริการ
      </button>
    `,t.appendChild(c)}),t.querySelectorAll(".edit-plan-btn").forEach(d=>{d.addEventListener("click",()=>Ae(d.dataset.id))});const i=document.getElementById("drink-manager-table-body");i.innerHTML="",e.length===0?i.innerHTML=`
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px;">
          ยังไม่มีรายการสินค้าเครื่องดื่มขายหน้าร้าน กดปุ่มเพื่อเพิ่ม
        </td>
      </tr>
    `:(e.forEach(d=>{const c=document.createElement("tr");c.innerHTML=`
        <td>
          <div class="kpi-icon-wrapper" style="width: 32px; height: 32px; border-radius: 6px; font-size: 14px; background-color: rgba(255, 95, 31, 0.08);">
            <i data-lucide="${d.icon||"droplet"}"></i>
          </div>
        </td>
        <td style="font-weight: 500;">${d.name}</td>
        <td class="font-eng" style="font-weight: 600;">฿${d.price}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn edit product-edit-btn" data-id="${d.id}" title="แก้ไข"><i data-lucide="edit-2"></i></button>
            <button class="action-btn delete product-delete-btn" data-id="${d.id}" title="ลบ"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      `,i.appendChild(c)}),i.querySelectorAll(".product-edit-btn").forEach(d=>{d.addEventListener("click",()=>ae(d.dataset.id))}),i.querySelectorAll(".product-delete-btn").forEach(d=>{d.addEventListener("click",()=>_e(d.dataset.id))}));const o=document.getElementById("billing-table-body");o.innerHTML="",s.length===0?o.innerHTML=`
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
          ยังไม่พบรายการชำระเงินในระบบ
        </td>
      </tr>
    `:s.forEach(d=>{const c=document.createElement("tr");c.innerHTML=`
        <td class="font-eng" style="font-weight: 600; color: var(--accent-orange);">${d.id}</td>
        <td>
          <div style="font-weight: 500;">${d.memberName}</div>
          <div style="font-size: 11px; color: var(--text-muted);">รหัส: ${d.memberId}</div>
        </td>
        <td>${d.planName}</td>
        <td class="font-eng" style="font-weight: 600;">฿${d.amount.toLocaleString()}</td>
        <td>
          <span style="background-color: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 4px 8px; border-radius: 4px; font-size: 12px;">
            ${d.paymentMethod}
          </span>
        </td>
        <td class="font-eng" style="color: var(--text-secondary);">${d.date}</td>
      `,o.appendChild(c)});const r=document.getElementById("shop-sales-table-body");r.innerHTML="",n.length===0?r.innerHTML=`
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">
          ยังไม่พบประวัติการขายสินค้าเครื่องดื่มในยิม
        </td>
      </tr>
    `:n.forEach(d=>{const c=d.items.map(m=>`${m.name} (x${m.qty})`).join(", "),l=document.createElement("tr");l.innerHTML=`
        <td class="font-eng" style="font-weight: 600; color: var(--accent-gold);">${d.id}</td>
        <td style="font-size: 13px;">${c}</td>
        <td class="font-eng" style="font-weight: 600;">฿${d.total.toLocaleString()}</td>
        <td>
          <span style="background-color: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 4px 8px; border-radius: 4px; font-size: 12px;">
            ${d.paymentMethod}
          </span>
        </td>
        <td class="font-eng" style="color: var(--text-secondary);">${d.date}</td>
      `,r.appendChild(l)}),W(),x()}function Ae(a){const s=document.getElementById("edit-plan-modal"),e=b().find(t=>t.id===a);e&&(document.getElementById("edit-plan-id").value=e.id,document.getElementById("edit-plan-name").value=e.name,document.getElementById("edit-plan-price").value=e.price,s.classList.add("active"))}function Fe(a){a.preventDefault();const s=document.getElementById("edit-plan-id").value,n=document.getElementById("edit-plan-price").value;ge(s,n)&&(alert("บันทึกปรับราคาแพ็กเกจเรียบร้อยแล้ว"),document.getElementById("edit-plan-modal").classList.remove("active"),D())}function ae(a=null){const s=document.getElementById("product-modal"),n=document.getElementById("product-modal-title");if(document.getElementById("product-form").reset(),a){n.textContent="แก้ไขข้อมูลสินค้าเครื่องดื่ม";const i=S().find(o=>o.id===a);i&&(document.getElementById("form-product-id").value=i.id,document.getElementById("form-product-name").value=i.name,document.getElementById("form-product-price").value=i.price,document.getElementById("form-product-icon").value=i.icon)}else n.textContent="เพิ่มเครื่องดื่มขายหน้าร้าน",document.getElementById("form-product-id").value="";s.classList.add("active")}function qe(a){a.preventDefault();const s=document.getElementById("form-product-id").value,n=document.getElementById("form-product-name").value,e=document.getElementById("form-product-price").value,t=document.getElementById("form-product-icon").value;s?(ye(s,n,e,t),alert("แก้ไขรายละเอียดสินค้าเครื่องดื่มเรียบร้อย")):(fe(n,e,t),alert("เพิ่มสินค้าใหม่เข้าร้านค้าเรียบร้อย")),document.getElementById("product-modal").classList.remove("active"),D()}function _e(a){confirm("คุณต้องการลบเครื่องดื่มรายการนี้ออกจากร้านขายหน้าร้านหรือไม่?")&&(ve(a),D())}function W(){const a=document.getElementById("archive-date-picker");if(!a.value){const e=I(v());a.value=e}const s=a.value,n=j(s);document.getElementById("daily-sum-members").textContent=`฿${n.membershipSales.toLocaleString()}`,document.getElementById("daily-sum-beverages").textContent=`฿${n.shopSales.toLocaleString()}`,document.getElementById("daily-sum-passes").textContent=`${n.dailyPasses} ใบ`,document.getElementById("daily-sum-users").textContent=`${n.checkinsCount} คน`,document.getElementById("daily-sum-total").textContent=`฿${n.totalRevenue.toLocaleString()}`,Pe()}function Pe(){const a=U(),s=document.getElementById("daily-archives-table-body");if(s.innerHTML="",a.length===0){s.innerHTML=`
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">
          ยังไม่ประวัติบันทึกการปิดยอดบัญชีรายวัน
        </td>
      </tr>
    `;return}[...a].sort((e,t)=>new Date(t.date)-new Date(e.date)).forEach(e=>{const t=document.createElement("tr");t.innerHTML=`
      <td class="font-eng" style="font-weight: 600;">${e.date}</td>
      <td class="font-eng">฿${e.membershipSales.toLocaleString()}</td>
      <td class="font-eng">฿${e.shopSales.toLocaleString()}</td>
      <td class="font-eng">${e.dailyPasses} ใบ</td>
      <td class="font-eng">${e.checkinsCount} คน</td>
      <td class="font-eng" style="font-weight: 600; color: var(--accent-gold);">฿${e.totalRevenue.toLocaleString()}</td>
      <td><span class="badge active" style="font-size: 10px; padding: 2px 6px; background-color: rgba(16, 185, 129, 0.1); color: var(--color-success); border: 1px solid rgba(16, 185, 129, 0.2);">ปิดยอดเสร็จ</span></td>
    `,s.appendChild(t)})}function Ge(){const a=document.getElementById("archive-date-picker").value;if(!a)return;const s=j(a);confirm(`คุณต้องการปิดยอดบัญชีรายวันของวันที่ "${a}" ใช่หรือไม่? ยอดรวมรายรับที่จะปิดสรุปคือ ฿${s.totalRevenue.toLocaleString()}`)&&(Le(a),alert(`ปิดยอดบัญชีรายวันของวันที่ ${a} เรียบร้อยแล้ว!`),W())}function Oe(a){const s=h(),n=b(),e=w(),t=s.find(u=>u.id===a);if(!t)return;const i=n.find(u=>u.id===t.planId),o=i?i.name:"ไม่ระบุ",r=document.getElementById("detail-avatar");r.style.background=t.avatarGradient,r.textContent=t.fullname.substring(0,2),document.getElementById("detail-name").textContent=t.fullname,document.getElementById("detail-id").textContent=t.id,document.getElementById("detail-phone").textContent=t.phone,document.getElementById("detail-email").textContent=t.email,document.getElementById("detail-gender").textContent=t.gender,document.getElementById("detail-plan").textContent=o,document.getElementById("detail-joindate").textContent=t.joinDate,document.getElementById("detail-expirydate").textContent=t.expiryDate;const d=document.getElementById("detail-status");d.className=`badge ${t.status}`;let c="กำลังใช้งาน";t.status==="expired"&&(c="หมดอายุ"),t.status==="warning"&&(c="ใกล้หมด"),d.textContent=c;const l=e.filter(u=>u.memberId===t.id),m=document.getElementById("detail-checkins-list");m.innerHTML="",l.length===0?m.innerHTML=`
      <div style="text-align: center; color: var(--text-muted); padding: 12px; font-size: 12px;">
        ยังไม่มีประวัติการเช็กเข้าใช้งานสำหรับสมาชิกรายนี้
      </div>
    `:l.forEach(u=>{const f=document.createElement("div");f.className="checkin-row",f.style.padding="8px 12px";let p="ผ่าน";u.status==="expired"&&(p="ระงับ (หมดอายุ)"),u.status==="warning"&&(p="แจ้งเตือนใกล้หมด"),f.innerHTML=`
        <span class="font-eng" style="font-size: 13px;">${u.timestamp}</span>
        <span class="badge ${u.status}" style="font-size: 9px; padding: 2px 4px;">${p}</span>
      `,m.appendChild(f)});const g=document.getElementById("detail-renew-btn");g.onclick=()=>{document.getElementById("detail-modal").classList.remove("active"),ze(t.id)},document.getElementById("detail-modal").classList.add("active"),x()}function ze(a){const s=h(),n=b(),e=s.find(d=>d.id===a);if(!e)return;document.getElementById("renew-member-id").value=e.id,document.getElementById("renew-member-name").textContent=`${e.fullname} (${e.id})`;const t=document.getElementById("renew-plan-select");t.innerHTML=n.map(d=>`<option value="${d.id}">${d.name}</option>`).join("");const i=document.getElementById("renew-special-checkbox"),o=document.getElementById("renew-price-input");i.checked=!1,o.disabled=!0;const r=()=>{const d=n.find(c=>c.id===t.value);d&&!i.checked&&(o.value=d.price)};t.onchange=r,i.onchange=()=>{i.checked?(o.disabled=!1,o.focus()):(o.disabled=!0,r())},r(),document.getElementById("renew-modal").classList.add("active")}function Je(a){a.preventDefault();const s=document.getElementById("renew-member-id").value,n=document.getElementById("renew-plan-select").value,e=document.getElementById("renew-price-input").value,t=document.getElementById("renew-payment-method").value,i=h(),o=b(),r=i.find(c=>c.id===s),d=o.find(c=>c.id===n);if(r&&d){const c=v();let l=new Date(r.expiryDate);r.status==="expired"&&(l=c),l.setDate(l.getDate()+d.durationDays);const m=I(l);r.planId=n,r.expiryDate=m,K(r);const u=document.getElementById("renew-special-checkbox").checked?`${d.name} (เรตพิเศษ)`:d.name,f=k(),p=c.getFullYear()+"-"+String(c.getMonth()+1).padStart(2,"0")+"-"+String(c.getDate()).padStart(2,"0")+" "+String(c.getHours()).padStart(2,"0")+":"+String(c.getMinutes()).padStart(2,"0"),C={id:"TX-"+(1e3+f.length+1),memberId:s,memberName:r.fullname,planId:n,planName:u,amount:Number(e),paymentMethod:t,date:p};f.unshift(C),R(f),alert(`ต่ออายุเรียบร้อย! วันหมดอายุใหม่คือ ${m} ชำระเงิน ฿${e}`),document.getElementById("renew-modal").classList.remove("active"),L(),D()}}document.addEventListener("DOMContentLoaded",()=>{window.updateCartQty=Ne,E(),document.getElementById("role-toggle-select").addEventListener("change",()=>{Y(),H(A==="staff"?"checkin":"dashboard")}),Y(),document.querySelectorAll(".chart-filter-btn").forEach(c=>{c.addEventListener("click",()=>{document.querySelectorAll(".chart-filter-btn").forEach(l=>l.classList.remove("active")),c.classList.add("active"),N=c.dataset.filter,ee()})});const s=document.getElementById("form-special-checkbox"),n=document.getElementById("form-special-input-wrapper"),e=document.getElementById("form-special-price");s.addEventListener("change",()=>{if(s.checked)n.classList.add("active"),e.required=!0,e.focus();else{n.classList.remove("active"),e.required=!1;const c=b(),l=document.getElementById("form-plan").value,m=c.find(g=>g.id===l);m&&(e.value=m.price)}}),document.getElementById("archive-date-picker").addEventListener("change",W),document.getElementById("close-today-ledger-btn").addEventListener("click",Ge);const i=document.getElementById("traffic-date-picker");i.addEventListener("change",ne);const o=I(v());i.value=o,document.querySelectorAll(".sidebar .nav-link").forEach(c=>{c.addEventListener("click",l=>{l.preventDefault();const m=c.dataset.view;if(!m||A==="staff"&&(m==="dashboard"||m==="billing"))return;document.querySelectorAll(".sidebar .nav-link").forEach(u=>u.classList.remove("active")),c.classList.add("active"),document.querySelectorAll(".views-container .view-panel").forEach(u=>{u.classList.remove("active")}),document.getElementById(`${m}-view`).classList.add("active");const g=c.querySelector("span").textContent;document.getElementById("current-view-title").textContent=g,Z(m)})}),document.getElementById("member-search").addEventListener("input",c=>{F.searchQuery=c.target.value,L()}),document.querySelectorAll(".filter-btn").forEach(c=>{c.addEventListener("click",()=>{document.querySelectorAll(".filter-btn").forEach(l=>l.classList.remove("active")),c.classList.add("active"),F.statusFilter=c.dataset.filter,L()})}),document.getElementById("add-member-trigger").addEventListener("click",()=>te()),document.getElementById("member-form").addEventListener("submit",$e),document.getElementById("form-plan").addEventListener("change",J),document.getElementById("form-joindate").addEventListener("change",J),document.getElementById("add-product-trigger").addEventListener("click",()=>ae()),document.getElementById("product-form").addEventListener("submit",qe),document.getElementById("checkin-submit-form").addEventListener("submit",Me),document.getElementById("quick-daily-pass-form").addEventListener("submit",Te),document.getElementById("shop-checkout-form").addEventListener("submit",He),document.getElementById("edit-plan-form").addEventListener("submit",Fe),document.getElementById("renew-form").addEventListener("submit",Je);const d=(c,l,m)=>{const g=document.getElementById(m),u=()=>g.classList.remove("active");document.getElementById(c).addEventListener("click",u),l&&document.getElementById(l).addEventListener("click",u)};d("close-member-modal","cancel-member-modal","member-modal"),d("close-detail-modal",null,"detail-modal"),d("close-renew-modal","cancel-renew-modal","renew-modal"),d("close-edit-plan-modal","cancel-edit-plan-modal","edit-plan-modal"),d("close-product-modal","cancel-product-modal","product-modal"),H("checkin")});
