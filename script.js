/* ====================================================
   PORTFOLIO SCRIPT — Animations & Interactions
   ==================================================== */



// ─── Cursor Glow ────────────────────────────────────
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// ─── Particle Canvas ────────────────────────────────
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    // Mix of purple and cyan
    const colors = ['124,58,237', '6,182,212', '167,139,250', '34,211,238'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.floor((W * H) / 10000);
  particles = Array.from({ length: Math.min(count, 130) }, () => new Particle());
}
initParticles();

// Draw connecting lines between nearby particles
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124, 58, 237, ${0.05 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── Typewriter Effect ──────────────────────────────
const roles = [
  'Data Science Enthusiast 📊',
];
let roleIdx = 0, charIdx = 0, deleting = false;
const twEl = document.getElementById('typewriterText');

function typewrite() {
  if (!twEl) return;
  const current = roles[roleIdx];
  if (deleting) {
    twEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(typewrite, 500);
      return;
    }
    setTimeout(typewrite, 40);
  } else {
    twEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typewrite, 2000);
      return;
    }
    setTimeout(typewrite, 80);
  }
}
setTimeout(typewrite, 800);

// ─── Navbar Scroll ──────────────────────────────────
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Back to top
  const backBtn = document.getElementById('backToTop');
  backBtn.classList.toggle('visible', window.scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ─── Hamburger Menu ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinksEl.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = navLinksEl.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinksEl.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
});
navLinks.forEach(link => link.addEventListener('click', () => navLinksEl.classList.remove('open')));

// ─── Back To Top ────────────────────────────────────
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Scroll Reveal with IntersectionObserver ───────
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('revealed'), delay);



      // Trigger stat counters
      el.querySelectorAll('.stat-number').forEach(num => {
        animateCounter(num);
      });

      observer.unobserve(el);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));



// ─── Animated Counters ──────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1500;
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  tick();
}

// ─── Contact Form ────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const successEl = document.getElementById('formSuccess');

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    successEl.style.display = 'flex';
    e.target.reset();

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
      successEl.style.display = 'none';
    }, 4000);
  }, 1800);
}

// ─── Resume Download Toast ───────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

document.querySelectorAll('a[download]').forEach(a => {
  a.addEventListener('click', () => {
    setTimeout(() => showToast('📄 Resume download started!'), 300);
  });
});

// ─── Project Card Glow on Mousemove ─────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const glow = card.querySelector('.project-card-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(124,58,237,0.12), transparent 60%)`;
    }
  });
});

// ─── Smooth active state on nav click ───────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ─── Stagger reveal for cert/project cards ──────────
document.querySelectorAll('.cert-card').forEach((card, i) => {
  card.dataset.delay = i * 100;
});

// ─── Add rainbow shimmer to skill bubbles on load ───
document.querySelectorAll('.skill-bubble').forEach((sb, i) => {
  sb.style.animationDelay = `${i * 0.1}s`;
});

// ─── Floating badges parallax ────────────────────────
document.addEventListener('mousemove', (e) => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 2;
  const my = (e.clientY / window.innerHeight - 0.5) * 2;
  document.querySelectorAll('.floating-badge').forEach((badge, i) => {
    const depth = (i + 1) * 6;
    badge.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
  });
  document.querySelectorAll('.hero-image-ring').forEach((ring, i) => {
    const depth = (i + 1) * 3;
    ring.style.transform = `translate(${mx * depth}px, ${my * depth}px) rotate(${Date.now() / (5000 + i * 3000) * 360}deg)`;
  });
});

// ─── Page load animation ────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
