// ============================
// SecureVault — app.js
// ============================

// ---- Live clock ----
function updateClock() {
  const el = document.getElementById('timeDisplay');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toUTCString().replace('GMT', 'UTC');
}
setInterval(updateClock, 1000);
updateClock();

// ---- Counter animation ----
document.querySelectorAll('.stat-value[data-target]').forEach(el => {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 30);
});

// ---- Alert button toggle ----
document.getElementById('alertBtn').addEventListener('click', () => {
  const banner = document.getElementById('alertBanner');
  banner.style.display = banner.style.display === 'none' ? 'flex' : 'none';
});

// ---- IAM Activity Chart (Canvas) ----
(function drawIAMChart() {
  const canvas = document.getElementById('iamChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth * 2;
  canvas.height = 160 * 2;
  ctx.scale(2, 2);

  const W = canvas.offsetWidth / 2;
  const H = 80;
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const logins =   [23, 41, 38, 55, 47, 12, 8];
  const failures = [4,  12,  7, 18,  9,  3, 2];
  const barW = (W - 60) / days.length;

  ctx.clearRect(0, 0, W, 160);

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = 10 + (H / 4) * i;
    ctx.beginPath();
    ctx.strokeStyle = '#1e2d3d';
    ctx.lineWidth = 0.5;
    ctx.moveTo(40, y);
    ctx.lineTo(W - 10, y);
    ctx.stroke();
    ctx.fillStyle = '#586069';
    ctx.font = '9px Space Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(60 - (60/4)*i), 36, y + 3);
  }

  const maxVal = 60;
  days.forEach((day, i) => {
    const x = 44 + i * (barW + 4);
    const loginH = (logins[i] / maxVal) * H;
    const failH  = (failures[i] / maxVal) * H;

    // Login bar
    ctx.fillStyle = 'rgba(0,229,255,0.7)';
    ctx.beginPath();
    ctx.roundRect(x, H - loginH + 10, barW * 0.55, loginH, [2]);
    ctx.fill();

    // Failure bar
    ctx.fillStyle = 'rgba(255,68,68,0.7)';
    ctx.beginPath();
    ctx.roundRect(x + barW * 0.55, H - failH + 10, barW * 0.4, failH, [2]);
    ctx.fill();

    // Day label
    ctx.fillStyle = '#586069';
    ctx.font = '9px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(day, x + barW / 2, H + 22);
  });

  // Legend
  const legY = H + 36;
  ctx.fillStyle = 'rgba(0,229,255,0.7)';
  ctx.fillRect(44, legY, 10, 8);
  ctx.fillStyle = '#c9d1d9';
  ctx.font = '9px Space Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Successful logins', 58, legY + 7);

  ctx.fillStyle = 'rgba(255,68,68,0.7)';
  ctx.fillRect(180, legY, 10, 8);
  ctx.fillStyle = '#c9d1d9';
  ctx.fillText('Failed attempts', 194, legY + 7);
})();

// ---- Simulated live feed injection ----
const feedEvents = [
  { type: 'warning', icon: '⚠', title: 'Port Scan Detected', meta: '94.102.49.x → us-east-1 · just now', severity: 'HIGH' },
  { type: 'critical', icon: '◈', title: 'Root Login Without MFA', meta: 'Root account · ap-southeast-1 · just now', severity: 'CRIT' },
  { type: 'info',    icon: '≡', title: 'New EC2 Instance Launched', meta: 'i-0a2b3c4d5e6f · t3.large · just now', severity: 'MED' },
  { type: 'good',    icon: '✓', title: 'Patch Applied Successfully', meta: 'ec2-prod-02 · AMI updated · just now', severity: 'INFO' },
];

let feedIdx = 0;
function injectFeedItem() {
  const feed = document.getElementById('threatFeed');
  if (!feed) return;
  const ev = feedEvents[feedIdx % feedEvents.length];
  feedIdx++;

  const item = document.createElement('div');
  item.className = `feed-item ${ev.type}`;
  item.innerHTML = `
    <div class="feed-icon">${ev.icon}</div>
    <div class="feed-content">
      <div class="feed-title">${ev.title}</div>
      <div class="feed-meta">${ev.meta}</div>
    </div>
    <span class="severity-badge ${ev.type}">${ev.severity}</span>
  `;
  feed.prepend(item);
  if (feed.children.length > 10) feed.removeChild(feed.lastChild);
}
setInterval(injectFeedItem, 8000);

// ---- Nav page switching (UI only) ----
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

// ---- Tooltip on attack dots ----
document.querySelectorAll('.attack-dot').forEach(dot => {
  dot.title = dot.dataset.origin || 'Unknown origin';
});

console.log('%c🛡 SecureVault loaded', 'color:#00e5ff;font-weight:bold;font-size:14px');
