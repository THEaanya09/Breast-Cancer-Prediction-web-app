import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = [
  "#ff85a1","#ff6b8a","#f94f73","#e8395a",
  "#ffaec0","#ffc8d5","#ff99b4","#ff4d72",
  "#c9184a","#ff758f","#ffb3c1","#e63462",
  "#ff4081","#f06292","#ec407a","#d81b60",
];

function sampleEmojiPoints(emoji, size, desiredCount) {
  const oc = document.createElement("canvas");
  oc.width  = size;
  oc.height = size;
  const ctx = oc.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  ctx.font      = `${size * 0.40}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, size / 2, size / 2);

  const data = ctx.getImageData(0, 0, size, size).data;

  const candidates = [];
  const step = 2;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const idx = (y * size + x) * 4;
      if (data[idx + 3] > 60) {
        candidates.push([x, y]);
      }
    }
  }

  if (candidates.length < 50) {
    return fallbackHeartPoints(size, desiredCount);
  }

  const result = [];
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(desiredCount, shuffled.length); i++) {
    result.push(shuffled[i]);
  }
  return result;
}

function fallbackHeartPoints(size, count) {
  const pts = [];
  const cx = size / 2, cy = size / 2;
  const r  = size * 0.36;

  for (let i = 0; i < count * 6; i++) {
    const t = (i / (count * 6)) * Math.PI * 2;
    const x = cx + r * 0.0625 * 16 * Math.pow(Math.sin(t), 3);
    const y = cy - r * 0.0625 * (
      13 * Math.cos(t)
      - 5  * Math.cos(2 * t)
      - 2  * Math.cos(3 * t)
      -      Math.cos(4 * t)
    );
    pts.push([x, y]);
  }

  for (let i = 0; i < count * 2; i++) {
    const t = Math.random() * Math.PI * 2;
    const s = Math.random();
    const x = cx + r * 0.0625 * 16 * Math.pow(Math.sin(t), 3) * s;
    const y = cy - r * 0.0625 * (
      13 * Math.cos(t)
      - 5  * Math.cos(2 * t)
      - 2  * Math.cos(3 * t)
      -      Math.cos(4 * t)
    ) * s;
    pts.push([x, y]);
  }

  return pts.sort(() => Math.random() - 0.5).slice(0, count);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
}

const PARTICLE_COUNT = 4500;
const EMOJI_RENDER_SIZE = 120;
const SCATTER_PHASE_MS  = 900;
const GATHER_PHASE_MS   = 2000;
const TEXT_DELAY_MS     = SCATTER_PHASE_MS + GATHER_PHASE_MS + 300;

export default function LandingPage() {
  const canvasRef   = useRef(null);
  const stateRef    = useRef({ particles: [], startTime: 0, animId: null });
  const [showText, setShowText]   = useState(false);
  const [textReady, setTextReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initTimer = setTimeout(init, 120);
    return () => {
      clearTimeout(initTimer);
      if (stateRef.current.animId) cancelAnimationFrame(stateRef.current.animId);
    };
  // eslint-disable-next-line
  }, []);

  function init() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const rawPts = sampleEmojiPoints("CARE", 320, PARTICLE_COUNT);

    const displaySize = Math.min(W(), H()) * 0.72;
    const scaleF = displaySize / 320;
    const offY = (H() * 0.40) - displaySize / 2;
    const offX   = (W() - displaySize) / 2;

    const targets = rawPts.map(([px, py]) => [
      offX + px * scaleF,
      offY + py * scaleF,
    ]);

    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const [tx, ty] = targets[i % targets.length];
      return {
        sx: Math.random() * W(),
        sy: Math.random() * H(),
        tx, ty,
        r: 1.5 + Math.random() * 2.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        baseAlpha: 0.55 + Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        delay: Math.random() * 0.35,
      };
    });

    stateRef.current.particles  = particles;
    stateRef.current.startTime  = performance.now();

    function draw(now) {
      const elapsed = now - stateRef.current.startTime;
      ctx.clearRect(0, 0, W(), H());

      stateRef.current.particles.forEach((p) => {
        let x, y, alpha;

        if (elapsed < SCATTER_PHASE_MS) {
          p.sx += p.vx;
          p.sy += p.vy;
          if (p.sx < 0 || p.sx > W()) p.vx *= -1;
          if (p.sy < 0 || p.sy > H()) p.vy *= -1;
          x = p.sx; y = p.sy; alpha = p.baseAlpha * 0.7;

        } else {
          const gElapsed = elapsed - SCATTER_PHASE_MS;
          const pDelay   = p.delay * GATHER_PHASE_MS;
          const rawT     = Math.max(0, (gElapsed - pDelay) / (GATHER_PHASE_MS * (1 - p.delay * 0.5)));
          const t        = Math.min(1, rawT);
          const et       = easeInOutCubic(t);

          x = p.sx + (p.tx - p.sx) * et;
          y = p.sy + (p.ty - p.sy) * et;
          alpha = p.baseAlpha * (0.5 + et * 0.5);
        }

        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (elapsed >= TEXT_DELAY_MS) {
        setShowText(true);
      }

      stateRef.current.animId = requestAnimationFrame(draw);
    }

    stateRef.current.animId = requestAnimationFrame(draw);
    setTextReady(true);

    return () => window.removeEventListener("resize", resize);
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#fff0f5 0%,#ffe4ec 40%,#ffd6e7 70%,#ffcce3 100%)",
        fontFamily: "'Nunito',system-ui,sans-serif",
      }}
    >
      {/* ── Ambient blobs ── */}
      <div style={{
        position:"absolute", top:"-80px", left:"-80px",
        width:"320px", height:"320px", borderRadius:"50%",
        background:"radial-gradient(circle,rgba(255,182,207,0.45) 0%,transparent 70%)",
        filter:"blur(40px)", pointerEvents:"none",
      }}/>
      <div style={{
        position:"absolute", bottom:"-60px", right:"-60px",
        width:"260px", height:"260px", borderRadius:"50%",
        background:"radial-gradient(circle,rgba(249,100,130,0.32) 0%,transparent 70%)",
        filter:"blur(50px)", pointerEvents:"none",
      }}/>

      {/* ── Particle canvas ── */}
      <canvas
        ref={canvasRef}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", display:"block" }}
      />

      {/* ── Text UI — fades in after particles settle ── */}
      {textReady && (
        <div
          style={{
            position:"relative", zIndex:10,
            display:"flex", flexDirection:"column",
            alignItems:"center", textAlign:"center",
            padding:"0 1.5rem",
            marginTop:"52vh",
            opacity: showText ? 1 : 0,
            transform: showText ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1.2s ease, transform 1.2s ease",
            pointerEvents: showText ? "auto" : "none",
          }}
        >
          
          {/* App name */}
          <h1 style={{
            fontSize:"clamp(1.9rem,7vw,2.8rem)",
            fontWeight:900,
            color:"#c9184a",
            letterSpacing:"-0.02em",
            lineHeight:1.15,
            margin:"0 0 0.3rem 0",
            textShadow:"0 2px 16px rgba(201,24,74,0.20)",
            opacity: showText ? 1 : 0,
            transform: showText ? "translateY(0)" : "translateY(12px)",
            transition:"opacity 1s ease 0.1s, transform 1s ease 0.1s",
          }}>
            HerHealth <span style={{marginLeft:"0.1em"}}></span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize:"clamp(0.92rem,3.5vw,1.1rem)",
            color:"#e05578",
            fontWeight:600,
            margin:"0 0 0.85rem 0",
            letterSpacing:"0.01em",
            opacity: showText ? 1 : 0,
            transform: showText ? "translateY(0)" : "translateY(10px)",
            transition:"opacity 1s ease 0.28s, transform 1s ease 0.28s",
          }}>
            First step to Self Care
          </p>

          {/* Privacy pill */}
          <div style={{
            display:"inline-flex", alignItems:"center",
            padding:"0.28rem 1rem",
            background:"rgba(255,182,207,0.45)",
            borderRadius:"999px",
            fontSize:"0.72rem", fontWeight:700,
            color:"#c9184a", letterSpacing:"0.06em",
            textTransform:"uppercase",
            border:"1px solid rgba(249,100,130,0.26)",
            backdropFilter:"blur(6px)",
            marginBottom:"1.5rem",
            opacity: showText ? 1 : 0,
            transition:"opacity 1s ease 0.48s",
          }}>
            Free and AI-Powered
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/language")}
            style={{
              padding:"0.95rem 2.8rem",
              background:"linear-gradient(135deg,#f94f73 0%,#c9184a 100%)",
              color:"#fff", fontWeight:800,
              fontSize:"clamp(0.95rem,3.5vw,1.1rem)",
              borderRadius:"999px", border:"none",
              boxShadow:"0 8px 28px rgba(201,24,74,0.38),0 2px 8px rgba(201,24,74,0.22)",
              cursor:"pointer", letterSpacing:"0.01em",
              fontFamily:"inherit", marginBottom:"1.2rem",
              opacity: showText ? 1 : 0,
              transform: showText ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
              transition:"opacity 1s ease 0.70s, transform 1s ease 0.70s, box-shadow 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 12px 36px rgba(201,24,74,0.50),0 4px 12px rgba(201,24,74,0.30)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(201,24,74,0.38),0 2px 8px rgba(201,24,74,0.22)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Let's Get Started
          </button>

          {/* Secondary links */}
          <div style={{
            display:"flex", gap:"1.5rem",
            opacity: showText ? 0.78 : 0,
            transition:"opacity 1s ease 0.92s",
          }}>
            {[
              { label:"📚 Awareness", path:"/awareness" },
              { label:"💬 Ask AI",    path:"/chatbot"   },
              { label:"📞 Help",      path:"/contact"   },
            ].map(item => (
              <button key={item.path} onClick={() => navigate(item.path)} style={{
                background:"none", border:"none",
                color:"#e05578", fontSize:"0.8rem",
                fontWeight:700, cursor:"pointer",
                textDecoration:"underline",
                textUnderlineOffset:"3px",
                fontFamily:"inherit",
              }}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Disclaimer */}
          <p style={{
            marginTop:"1.5rem", fontSize:"0.7rem",
            color:"rgba(200,50,90,0.45)",
            opacity: showText ? 1 : 0,
            transition:"opacity 1s ease 1.1s",
          }}>
            ⚠️ For awareness only. Not a medical diagnosis.
          </p>
        </div>
      )}

      {/* ── Inject Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}