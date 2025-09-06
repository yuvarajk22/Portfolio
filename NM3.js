// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Intersection Observer reveal
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target); }
  });
},{threshold: 0.15});
revealEls.forEach(el=>io.observe(el));

// Tilt effect for elements with .tilt
const maxTilt = 10; // degrees
function handleTilt(e){
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const px = (x / rect.width) - 0.5;
  const py = (y / rect.height) - 0.5;
  const rx = (+py * maxTilt);
  const ry = (-px * maxTilt);
  el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
}
function resetTilt(e){
  e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
}
document.querySelectorAll(".tilt").forEach(el=>{
  el.addEventListener("mousemove", handleTilt);
  el.addEventListener("mouseleave", resetTilt);
});

// Subtle animated background orbs (3D-ish parallax)
const canvas = document.getElementById("bg-orbs");
const ctx = canvas.getContext("2d");
let W, H, orbs;

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  createOrbs();
}
window.addEventListener("resize", resize);

function createOrbs(){
  const count = Math.floor((W*H)/50000);
  orbs = Array.from({length: count}, ()=>({
    x: Math.random()*W,
    y: Math.random()*H,
    r: 40 + Math.random()*120,
    vx: (-0.3 + Math.random()*0.6),
    vy: (-0.3 + Math.random()*0.6),
    a: 0.05 + Math.random()*0.15
  }));
}

function draw(){
  ctx.clearRect(0,0,W,H);
  for(const o of orbs){
    o.x += o.vx; o.y += o.vy;
    if(o.x < -o.r) o.x = W + o.r;
    if(o.x > W + o.r) o.x = -o.r;
    if(o.y < -o.r) o.y = H + o.r;
    if(o.y > H + o.r) o.y = -o.r;

    const gradient = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    gradient.addColorStop(0, `rgba(139,233,255,${o.a})`);
    gradient.addColorStop(1, `rgba(179,136,255,0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
resize();
draw();