import { useState, useEffect, useCallback } from "react";

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0e0e0e;
    --surface: #161616;
    --surface2: #1e1e1e;
    --border: #2a2a2a;
    --border2: #333;
    --gold: #c9a84c;
    --gold2: #e8c97a;
    --gold-dim: rgba(201,168,76,0.12);
    --gold-glow: rgba(201,168,76,0.25);
    --text: #e8e4dc;
    --text2: #8a8078;
    --text3: #5a5450;
    --warm: #e85d3a;
    --warm-bg: rgba(232,93,58,0.1);
    --cold: #3a7ae8;
    --cold-bg: rgba(58,122,232,0.1);
    --green: #4caf6a;
    --green-bg: rgba(76,175,106,0.1);
    --radius: 3px;
    --font-mono: 'IBM Plex Mono', monospace;
    --font-serif: 'Cormorant Garamond', serif;
    --font-display: 'Bebas Neue', sans-serif;
  }

  html, body, #root { height: 100%; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.6;
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .app-wrap {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 60% 40% at 80% 0%, rgba(201,168,76,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 20% 100%, rgba(201,168,76,0.03) 0%, transparent 50%);
  }

  .header {
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(14,14,14,0.97);
    backdrop-filter: blur(10px);
  }
  .header-brand { display: flex; align-items: center; gap: 14px; }
  .header-icon {
    width: 32px; height: 32px;
    border: 1px solid var(--gold);
    border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; color: var(--gold);
  }
  .header-title { font-family: var(--font-display); font-size: 22px; letter-spacing: 3px; color: var(--text); }
  .header-sub { font-size: 10px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; }
  .header-stats { display: flex; gap: 28px; }
  .hstat { text-align: right; }
  .hstat-val { font-family: var(--font-display); font-size: 20px; color: var(--gold); line-height: 1; }
  .hstat-label { font-size: 9px; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; }

  .nav {
    display: flex;
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    background: var(--surface);
  }
  .nav-btn {
    background: none; border: none;
    border-bottom: 2px solid transparent;
    color: var(--text3);
    font-family: var(--font-mono);
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    padding: 14px 20px; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
  }
  .nav-btn:hover { color: var(--text2); }
  .nav-btn.active { color: var(--gold); border-bottom-color: var(--gold); }
  .nav-badge {
    background: var(--gold); color: #000;
    border-radius: 10px; padding: 1px 6px;
    font-size: 9px; font-weight: 500;
  }

  .main { padding: 28px 32px; max-width: 1400px; margin: 0 auto; }

  .btn {
    font-family: var(--font-mono);
    font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
    border: none; border-radius: var(--radius);
    cursor: pointer; transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px;
  }
  .btn-gold { background: var(--gold); color: #000; font-weight: 500; }
  .btn-gold:hover { background: var(--gold2); transform: translateY(-1px); }
  .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-outline { background: transparent; border: 1px solid var(--border2); color: var(--text2); }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
  .btn-ghost { background: transparent; color: var(--text3); padding: 6px 10px; }
  .btn-ghost:hover { color: var(--text); }
  .btn-sm { padding: 5px 10px; font-size: 10px; }
  .btn-danger { background: rgba(232,93,58,0.15); color: var(--warm); border: 1px solid rgba(232,93,58,0.3); }
  .btn-danger:hover { background: rgba(232,93,58,0.25); }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .card-title { font-family: var(--font-display); font-size: 16px; letter-spacing: 2px; color: var(--text); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .card-title span { color: var(--gold); }

  .input {
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: var(--radius); color: var(--text);
    font-family: var(--font-mono); font-size: 12px;
    padding: 9px 12px; width: 100%; transition: border-color 0.2s; outline: none;
  }
  .input:focus { border-color: var(--gold); }
  .input::placeholder { color: var(--text3); }
  textarea.input { resize: vertical; min-height: 80px; }
  select.input { cursor: pointer; }
  .label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); margin-bottom: 6px; display: block; }

  .lead-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px 18px; margin-bottom: 8px;
    cursor: pointer; transition: all 0.18s;
    position: relative; overflow: hidden;
  }
  .lead-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: var(--stage-color, var(--border)); transition: all 0.2s;
  }
  .lead-card:hover { border-color: var(--border2); transform: translateX(2px); }
  .lead-card.selected { border-color: var(--gold); background: var(--surface2); }
  .lead-card.selected::before { background: var(--gold); }

  .lead-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .lead-name { font-size: 14px; color: var(--text); font-weight: 500; }
  .lead-role { font-size: 11px; color: var(--text3); margin-top: 2px; }

  .stage-badge {
    font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 3px 8px; border-radius: 2px; white-space: nowrap; flex-shrink: 0;
  }

  .steps-wrap { display: flex; gap: 6px; align-items: center; margin-top: 12px; flex-wrap: wrap; }
  .step {
    display: flex; align-items: center; gap: 5px;
    font-size: 9px; letter-spacing: 1px; text-transform: uppercase;
    color: var(--text3); padding: 4px 8px;
    border: 1px solid var(--border); border-radius: 2px;
    cursor: pointer; transition: all 0.15s; user-select: none;
  }
  .step:hover { border-color: var(--border2); color: var(--text2); }
  .step.done { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
  @keyframes pulse-border { 0%,100% { border-color: var(--border2); } 50% { border-color: var(--text3); } }
  .step.current { border-color: var(--border2); color: var(--text2); animation: pulse-border 2s infinite; }
  .step-arrow { color: var(--text3); font-size: 8px; }

  .platform-tag { font-size: 9px; padding: 2px 6px; border-radius: 2px; letter-spacing: 1px; text-transform: uppercase; }
  .platform-li { background: rgba(10,102,194,0.15); color: #5a9fd4; border: 1px solid rgba(10,102,194,0.25); }
  .platform-ig { background: rgba(228,64,95,0.12); color: #e4405f; border: 1px solid rgba(228,64,95,0.25); }

  .detail-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius);
    height: calc(100vh - 160px); overflow-y: auto;
    position: sticky; top: 100px;
  }
  .panel-header {
    padding: 18px 20px; border-bottom: 1px solid var(--border);
    position: sticky; top: 0; background: var(--surface); z-index: 10;
  }
  .panel-body { padding: 20px; }
  .panel-section { margin-bottom: 24px; }
  .panel-section-title {
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--text3); margin-bottom: 12px; padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  .msg-box {
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: var(--radius); padding: 14px;
    font-size: 12px; line-height: 1.7; color: var(--text); position: relative;
  }
  .msg-option {
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: var(--radius); padding: 14px; margin-bottom: 10px;
    cursor: pointer; transition: all 0.15s;
    font-size: 12px; line-height: 1.7; color: var(--text); position: relative;
  }
  .msg-option:hover { border-color: var(--gold); }
  .msg-option-label { font-size: 9px; color: var(--gold); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
  .copy-btn {
    position: absolute; top: 8px; right: 8px;
    background: var(--gold-dim); border: 1px solid var(--gold);
    color: var(--gold); font-size: 9px; padding: 3px 8px; border-radius: 2px;
    cursor: pointer; font-family: var(--font-mono); letter-spacing: 1px; transition: all 0.15s;
  }
  .copy-btn:hover { background: var(--gold); color: #000; }

  .warm-chip { background: var(--warm-bg); color: var(--warm); border: 1px solid rgba(232,93,58,0.3); padding: 4px 10px; border-radius: 2px; font-size: 10px; letter-spacing: 1px; }
  .cold-chip { background: var(--cold-bg); color: var(--cold); border: 1px solid rgba(58,122,232,0.3); padding: 4px 10px; border-radius: 2px; font-size: 10px; letter-spacing: 1px; }
  .won-chip { background: var(--green-bg); color: var(--green); border: 1px solid rgba(76,175,106,0.3); padding: 4px 10px; border-radius: 2px; font-size: 10px; letter-spacing: 1px; }

  .add-form { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-bottom: 20px; }
  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-row { margin-bottom: 12px; }

  .filter-bar { display: flex; gap: 10px; margin-bottom: 18px; align-items: center; flex-wrap: wrap; }
  .filter-btn {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    background: transparent; border: 1px solid var(--border2); color: var(--text3);
    padding: 6px 12px; border-radius: 2px; cursor: pointer; transition: all 0.15s;
  }
  .filter-btn:hover { color: var(--text2); }
  .filter-btn.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }

  .finder-block { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 16px; }
  .finder-platform { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
  .finder-icon { width: 36px; height: 36px; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .finder-title { font-family: var(--font-display); font-size: 18px; letter-spacing: 2px; }
  .search-string { background: var(--surface2); border: 1px solid var(--gold); border-radius: var(--radius); padding: 12px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--gold2); margin: 10px 0; }
  .step-list { list-style: none; counter-reset: steps; }
  .step-list li {
    counter-increment: steps; padding: 10px 0 10px 36px; position: relative;
    border-bottom: 1px solid var(--border); font-size: 12px; color: var(--text2); line-height: 1.6;
  }
  .step-list li:last-child { border-bottom: none; }
  .step-list li::before {
    content: counter(steps); position: absolute; left: 0; top: 10px;
    width: 22px; height: 22px; background: var(--gold-dim); border: 1px solid var(--gold);
    color: var(--gold); border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 10px; font-weight: 500;
  }

  .analytics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; }
  .stat-val { font-family: var(--font-display); font-size: 36px; color: var(--gold); line-height: 1; margin-bottom: 4px; }
  .stat-label { font-size: 10px; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; }
  .stat-sub { font-size: 11px; color: var(--text2); margin-top: 4px; }

  .funnel-bar { display: flex; gap: 2px; height: 40px; border-radius: var(--radius); overflow: hidden; margin: 14px 0; }
  .funnel-seg { display: flex; align-items: center; justify-content: center; font-size: 9px; color: #000; font-weight: 500; letter-spacing: 1px; transition: flex 0.4s ease; min-width: 0; overflow: hidden; }
  .funnel-seg span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 4px; }

  .loader { display: flex; align-items: center; gap: 8px; color: var(--text3); font-size: 11px; padding: 12px; }
  .loader-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; animation: loader-pulse 1.2s ease-in-out infinite; }
  .loader-dot:nth-child(2) { animation-delay: 0.2s; }
  .loader-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes loader-pulse { 0%,80%,100% { opacity: 0.2; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }

  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--surface); border: 1px solid var(--gold);
    color: var(--gold); font-size: 11px; letter-spacing: 1px;
    padding: 10px 16px; border-radius: var(--radius); z-index: 9999;
    animation: toast-in 0.3s ease;
  }
  @keyframes toast-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .empty { text-align: center; padding: 48px 20px; color: var(--text3); }
  .empty-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.4; }
  .empty-text { font-size: 12px; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--surface); border: 1px solid var(--border2); border-radius: var(--radius); width: 100%; max-width: 560px; max-height: 85vh; overflow-y: auto; animation: modal-in 0.2s ease; }
  @keyframes modal-in { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
  .modal-header { padding: 18px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-family: var(--font-display); font-size: 18px; letter-spacing: 2px; }
  .modal-body { padding: 20px; }
  .modal-footer { padding: 16px 20px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; }

  .api-key-banner {
    background: var(--gold-dim); border: 1px solid var(--gold);
    border-radius: var(--radius); padding: 14px 18px;
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 20px; flex-wrap: wrap;
  }
  .api-key-banner p { font-size: 11px; color: var(--text2); line-height: 1.6; flex: 1; min-width: 200px; }

  .divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }

  @media (max-width: 900px) {
    .header { padding: 0 16px; }
    .header-stats { gap: 16px; }
    .nav { padding: 0 16px; }
    .main { padding: 16px; }
    .analytics-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const STAGE_COLORS = {
  invited:  "#8a8078",
  accepted: "#c9a84c",
  messaged: "#7a6fc9",
  replied:  "#4caf6a",
  warm:     "#e85d3a",
  cold:     "#3a7ae8",
  won:      "#4caf6a",
  lost:     "#5a5450",
};

const STAGE_LABELS = {
  invited:  "Invited",
  accepted: "Accepted",
  messaged: "Messaged",
  replied:  "Replied",
  warm:     "🔥 Warm",
  cold:     "🧊 Cold",
  won:      "✅ Won",
  lost:     "✗ Lost",
};

const SAMPLE_LEADS = [
  {
    id: "sample-1", name: "James Whitfield", role: "Founder & CEO", company: "Whitfield Digital",
    platform: "LinkedIn", notes: "Series A funded, posted about company culture last week",
    stage: "warm",
    outreachMessage: "James — most founders mark milestones with a dinner or a plaque. A handful commission something that'll still be on the wall in 30 years. Darren creates full-scale portraits built entirely from individual screws — no paint, no print, just metal. Each one takes weeks. Each one is one of a kind. Worth a look?",
    reply: "That sounds really intriguing actually. What does the process look like and roughly what kind of investment are we talking?",
    aiAnalysis: {
      classification: "warm",
      reason: "Asked about process AND pricing — high buying intent.",
      replies: [
        { label: "Option A: Process first", text: "Great question James. Darren starts from a single photo — from there it's 6–8 weeks of hand-placing thousands of individual screws, varying depth and angle to create light and shadow. Investment sits between £3k–£6k depending on size and complexity. Happy to send some examples across?" },
        { label: "Option B: Lead with examples", text: "I'll send some examples — they explain it better than words. Process is around 6–8 weeks start to finish, commission range £3–6k. Most founders use them as office statement pieces or personal legacy gifts. Which would resonate more for you?" },
        { label: "Option C: Qualify gently", text: "Brilliant — happy to walk you through it. Can I ask, are you thinking about this for yourself, for the office, or as a gift? Helps me point you to the most relevant pieces." }
      ]
    },
    addedAt: Date.now() - 86400000 * 3,
    steps: { invited: true, accepted: true, messaged: true, replied: true }
  },
  {
    id: "sample-2", name: "Sarah Okafor", role: "Managing Director", company: "Apex Recruitment Group",
    platform: "LinkedIn", notes: "Just moved into a new HQ, posted office photos",
    stage: "messaged", outreachMessage: "Sarah — new office. New chapter. Most MDs mark it with furniture. One or two commission something that defines the room for the next decade. Darren creates bespoke portraits built entirely from screws — no two the same. Curious what that looks like?",
    reply: "", aiAnalysis: null,
    addedAt: Date.now() - 86400000,
    steps: { invited: true, accepted: true, messaged: true, replied: false }
  },
  {
    id: "sample-3", name: "Marcus Blake", role: "Entrepreneur / Creator", company: "Self-employed",
    platform: "Instagram", notes: "300k followers, fitness & business niche, high-ticket coaching",
    stage: "accepted", outreachMessage: "",
    reply: "", aiAnalysis: null,
    addedAt: Date.now() - 3600000 * 5,
    steps: { invited: true, accepted: true, messaged: false, replied: false }
  },
  {
    id: "sample-4", name: "Tom Haughton", role: "Owner", company: "Haughton Bespoke Kitchens",
    platform: "LinkedIn", notes: "",
    stage: "invited", outreachMessage: "",
    reply: "", aiAnalysis: null,
    addedAt: Date.now() - 3600000 * 2,
    steps: { invited: true, accepted: false, messaged: false, replied: false }
  },
];

// ─── STORAGE (localStorage for real website) ──────────────────────────────────

const STORAGE_KEY = "screwart-leads-v1";
const API_KEY_STORAGE = "screwart-api-key";

function loadLeads() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return SAMPLE_LEADS;
}

function saveLeads(leads) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); } catch {}
}

function loadApiKey() {
  try { return localStorage.getItem(API_KEY_STORAGE) || ""; } catch { return ""; }
}

function saveApiKey(key) {
  try { localStorage.setItem(API_KEY_STORAGE, key); } catch {}
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function StageBadge({ stage }) {
  const color = STAGE_COLORS[stage] || "#5a5450";
  return (
    <span className="stage-badge" style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}>
      {STAGE_LABELS[stage] || stage}
    </span>
  );
}

function PlatformTag({ platform }) {
  return (
    <span className={`platform-tag ${platform === "LinkedIn" ? "platform-li" : "platform-ig"}`}>
      {platform === "LinkedIn" ? "🔗 LinkedIn" : "📷 Instagram"}
    </span>
  );
}

function Loader({ text = "AI is thinking..." }) {
  return (
    <div className="loader">
      <div className="loader-dot" /><div className="loader-dot" /><div className="loader-dot" />
      <span>{text}</span>
    </div>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast">✓ {msg}</div>;
}

function copy(text, cb) {
  navigator.clipboard?.writeText(text).then(() => cb?.());
}

function dedupeLeads(leads) {
  const seen = new Set();
  const out = [];

  for (const l of leads) {
    const url = (l.profileUrl || "").trim().toLowerCase();
    const name = (l.name || "").trim().toLowerCase();
    const company = (l.company || "").trim().toLowerCase();

    const key = url ? `url:${url}` : `nc:${name}|${company}`;

    if (!seen.has(key)) {
      seen.add(key);
      out.push(l);
    }
  }
  return out;
}

function needsFollowUp(lead) {
  // Uses either lastContact or (fallback) addedAt
  const base = lead.lastContact || lead.addedAt;
  if (!base) return false;

  const days = (Date.now() - new Date(base).getTime()) / (1000 * 60 * 60 * 24);

  // If they've replied and are warm -> follow up quicker
  if (lead.stage === "warm" && days >= 2) return true;

  // If messaged but no reply -> follow up after 3 days
  const messaged = lead.steps?.messaged || lead.stage === "messaged";
  const replied = lead.steps?.replied || lead.stage === "replied" || lead.reply?.trim();
  if (messaged && !replied && days >= 3) return true;

  return false;
}

// ─── AI CALLS ─────────────────────────────────────────────────────────────────

async function callServer(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `API error ${response.status}`);
  return data;
}


async function generateOutreachMessage(lead) {
  const data = await callServer("/api/generate", {
    lead,
    context: lead?.notes || "",
  });

  // Your server returns { messages: [...] } OR { messages: ["..",".."] }
  const msgs = data.messages || [];
  // Normalize into your UI’s expected shape if needed
  return msgs.map((m, i) =>
    typeof m === "string"
      ? { label: `Option ${i + 1}`, text: m }
      : m
  );
}


async function analyseReply(lead, reply, yourLastMessage = "") {
  const data = await callServer("/api/reply", {
    lead,
    theirReply: reply,
    yourLastMessage,
  });

  // Convert server format into your existing UI format (classification + replies)
  const classification = data.temperature || "neutral";

  return {
    classification: classification === "warm" ? "warm" : "cold",
    reason: data.intent ? `Intent: ${data.intent}` : "",
    replies: [
      { label: "Best reply", text: data.best_reply || "" },
      { label: "Follow-up (3 days)", text: data.follow_up_if_no_reply_3_days || "" },
    ].filter(r => r.text),
  };
}


// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("pipeline");
  const [leads, setLeads] = useState(() => loadLeads());
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [stageFilter, setStageFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKey, setApiKey] = useState(() => loadApiKey());

  const updateAndSave = useCallback((updated) => {
    setLeads(updated);
    saveLeads(updated);
  }, []);

  const updateLead = useCallback((id, patch) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, ...patch } : l);
      saveLeads(updated);
      return updated;
    });
  }, []);

  const showToast = (msg) => setToast(msg);
  const importCSV = useCallback((file) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const text = String(reader.result || "");
    const lines = text.split(/\r?\n/).filter(Boolean);

    // Expect headers like: name,role,company,platform,notes,profileUrl
    const header = lines.shift()?.split(",").map(h => h.trim().toLowerCase()) || [];
    const idx = (key) => header.indexOf(key);

    const newLeads = lines.map((line) => {
      const cols = line.split(",").map(c => c.trim());
      const name = cols[idx("name")] || cols[0] || "Unknown";
      const role = cols[idx("role")] || cols[1] || "";
      const company = cols[idx("company")] || cols[2] || "";
      const platform = (cols[idx("platform")] || cols[3] || "LinkedIn") || "LinkedIn";
      const notes = cols[idx("notes")] || cols[4] || "";
      const profileUrl = cols[idx("profileurl")] || cols[idx("url")] || cols[5] || "";

      return {
        id: `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name,
        role,
        company,
        platform: platform.includes("insta") ? "Instagram" : "LinkedIn",
        notes,
        profileUrl,
        stage: "new",
        outreachMessage: "",
        reply: "",
        aiAnalysis: null,
        addedAt: Date.now(),
        lastContact: null,
        steps: { invited: false, accepted: false, messaged: false, replied: false },
      };
    });

    updateAndSave(dedupeLeads([...newLeads, ...leads]));
    showToast(`Imported ${newLeads.length} leads`);
  };

  reader.readAsText(file);
}, [leads, updateAndSave]);

  const selectedLead = leads.find(l => l.id === selectedId);

  const stats = {
    total: leads.length,
    warm: leads.filter(l => l.stage === "warm").length,
    messaged: leads.filter(l => ["messaged","replied","warm","cold"].includes(l.stage)).length,
    won: leads.filter(l => l.stage === "won").length,
  };

  const filteredLeads = leads.filter(l => {
    if (stageFilter !== "all" && l.stage !== stageFilter) return false;
    if (platformFilter !== "all" && l.platform !== platformFilter) return false;
    return true;
  });

  const followUpsDue = leads.filter(needsFollowUp);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    saveApiKey(key);
    setShowApiModal(false);
    showToast("API key saved");
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="app-wrap">
        <header className="header">
          <div className="header-brand">
            <div className="header-icon">⚙</div>
            <div>
              <div className="header-title">SCREW ART — OUTREACH</div>
              <div className="header-sub">Commission Pipeline · Darren's Portraits</div>
            </div>
          </div>
          <div className="header-stats">
            <div className="hstat"><div className="hstat-val">{stats.total}</div><div className="hstat-label">Leads</div></div>
            <div className="hstat"><div className="hstat-val">{stats.messaged}</div><div className="hstat-label">Messaged</div></div>
            <div className="hstat"><div className="hstat-val" style={{color:"#e85d3a"}}>{stats.warm}</div><div className="hstat-label">🔥 Warm</div></div>
            <div className="hstat"><div className="hstat-val" style={{color:"#4caf6a"}}>{stats.won}</div><div className="hstat-label">Won</div></div>
            <button className="btn btn-outline btn-sm" onClick={() => setShowApiModal(true)} style={{marginLeft:8}}>
              {apiKey ? "⚙ API Key ✓" : "⚙ Set API Key"}
            </button>
          </div>
        </header>

        <nav className="nav">
          {[
            { id: "pipeline", label: "Pipeline", icon: "◈", badge: leads.filter(l=>l.stage==="warm").length||null },
            { id: "finder", label: "Lead Finder", icon: "⌖" },
            { id: "analytics", label: "Analytics", icon: "◎" },
          ].map(t => (
            <button key={t.id} className={`nav-btn ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span> {t.label}
              {t.badge ? <span className="nav-badge">{t.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="main">
          {!apiKey && (
            <div className="api-key-banner">
              <span style={{fontSize:20}}>⚙</span>
              <p><strong style={{color:"var(--gold)"}}>Add your Anthropic API key</strong> to unlock AI message generation and reply analysis. Click the button in the top right, or <button onClick={()=>setShowApiModal(true)} style={{background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontFamily:"var(--font-mono)",fontSize:11,textDecoration:"underline"}}>click here</button>.</p>
              <button className="btn btn-gold btn-sm" onClick={() => setShowApiModal(true)}>Add API Key →</button>
            </div>
          )}

          {tab === "pipeline" && (
            <PipelineTab
              leads={filteredLeads} allLeads={leads} followUpsDue={followUpsDue}
              selectedId={selectedId} importCSV={importCSV}
              setSelectedId={setSelectedId} selectedLead={selectedLead}
              stageFilter={stageFilter} setStageFilter={setStageFilter}
              platformFilter={platformFilter} setPlatformFilter={setPlatformFilter}
              updateLead={updateLead} updateAndSave={updateAndSave}
              showToast={showToast} setShowAddModal={setShowAddModal}
              apiKey={apiKey}
            />
          )}
          {tab === "finder" && <FinderTab showToast={showToast} />}
          {tab === "analytics" && <AnalyticsTab leads={leads} />}
        </div>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onSave={(lead) => {
            const updated = [lead, ...leads];
            updateAndSave(updated);
            setSelectedId(lead.id);
            setShowAddModal(false);
            showToast("Lead added");
          }}
        />
      )}
      {showApiModal && (
        <ApiKeyModal currentKey={apiKey} onSave={handleSaveApiKey} onClose={() => setShowApiModal(false)} />
      )}
    </>
  );
}

// ─── PIPELINE TAB ─────────────────────────────────────────────────────────────

function PipelineTab({ leads, allLeads, followUpsDue, selectedId, setSelectedId, selectedLead, stageFilter, setStageFilter, platformFilter, setPlatformFilter, updateLead, updateAndSave, showToast, setShowAddModal }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20 }}>
      <div>
        <div className="filter-bar">
          <button className={`filter-btn ${stageFilter==="all"?"active":""}`} onClick={() => setStageFilter("all")}>All</button>
          {Object.entries(STAGE_LABELS).map(([k,v]) => (
            <button key={k} className={`filter-btn ${stageFilter===k?"active":""}`} onClick={() => setStageFilter(k)}>{v}</button>
          ))}
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <button className={`filter-btn ${platformFilter==="all"?"active":""}`} onClick={() => setPlatformFilter("all")}>All</button>
            <button className={`filter-btn ${platformFilter==="LinkedIn"?"active":""}`} onClick={() => setPlatformFilter("LinkedIn")}>🔗 LI</button>
            <button className={`filter-btn ${platformFilter==="Instagram"?"active":""}`} onClick={() => setPlatformFilter("Instagram")}>📷 IG</button>
          </div>
          <input
            id="csvImport"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importCSV(f);
              e.target.value = "";
            }}
          />

          <button className="btn btn-outline" onClick={() => {
            updateAndSave(dedupeLeads(allLeads));
            showToast("Removed duplicates");
          }}>
            ✨ Dedupe
          </button>

          <button className="btn btn-outline" onClick={() => document.getElementById("csvImport").click()}>
            ⤓ Import CSV
          </button>

          <button className="btn btn-gold" onClick={() => setShowAddModal(true)}>
            + Add Lead
          </button>

        </div>

        {followUpsDue?.length ? (
          <>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-title"><span>🔥</span> Follow-ups Due</div>
              {followUpsDue.slice(0, 8).map(lead => (
                <LeadCard
                  key={`fu-${lead.id}`}
                  lead={lead}
                  selected={selectedId === lead.id}
                  onClick={() => setSelectedId(lead.id === selectedId ? null : lead.id)}
                  updateLead={updateLead}
                  showToast={showToast}
                />
              ))}
              {followUpsDue.length > 8 ? (
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>
                  + {followUpsDue.length - 8} more due…
                </div>
              ) : null}
            </div>
          </>
        ) : null}

        {leads.length === 0 ? (
          <div className="empty"><div className="empty-icon">◈</div><div className="empty-text">No leads match this filter.</div></div>
        ) : leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} selected={selectedId===lead.id}
            onClick={() => setSelectedId(lead.id===selectedId ? null : lead.id)}
            updateLead={updateLead} showToast={showToast} />
        ))}
      </div>
      <div>
        {selectedLead ? (
          <LeadDetail lead={selectedLead} updateLead={updateLead} showToast={showToast}
            allLeads={allLeads} updateAndSave={updateAndSave} apiKey={apiKey} />
        ) : (
          <div className="detail-panel" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div className="empty">
              <div className="empty-icon" style={{fontSize:40}}>◈</div>
              <div className="empty-text">Select a lead to view details,<br/>generate messages & track replies.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LEAD CARD ────────────────────────────────────────────────────────────────

function LeadCard({ lead, selected, onClick, updateLead, showToast }) {
  const stageColor = STAGE_COLORS[lead.stage] || "#5a5450";
  const steps = lead.steps || {};

  const tickStep = (e, stepKey, nextStage) => {
    e.stopPropagation();
    const newSteps = { ...steps, [stepKey]: !steps[stepKey] };
    const patch = { steps: newSteps };
    // If we just marked "messaged" as true, set lastContact timestamp
    if (stepKey === "messaged" && !steps[stepKey]) {
      patch.lastContact = new Date().toISOString();
    }
    if (!steps[stepKey] && nextStage) patch.stage = nextStage;
    updateLead(lead.id, patch);
    if (!steps[stepKey]) showToast(`${stepKey.charAt(0).toUpperCase()+stepKey.slice(1)} marked ✓`);
  };

  return (
    <div className={`lead-card ${selected?"selected":""}`} style={{"--stage-color": stageColor}} onClick={onClick}>
      <div className="lead-header">
        <div>
          <div className="lead-name">{lead.name}</div>
          <div className="lead-role">{lead.role} · {lead.company}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
          <StageBadge stage={lead.stage} />
          <PlatformTag platform={lead.platform} />
        </div>
      </div>
      <div className="steps-wrap">
        <StepTick label="Invited" done={steps.invited} onClick={e => tickStep(e,"invited","invited")} />
        <span className="step-arrow">›</span>
        <StepTick label="Accepted" done={steps.accepted} onClick={e => tickStep(e,"accepted","accepted")} disabled={!steps.invited} />
        <span className="step-arrow">›</span>
        <StepTick label="Messaged" done={steps.messaged} onClick={e => tickStep(e,"messaged","messaged")} disabled={!steps.accepted} />
        <span className="step-arrow">›</span>
        <StepTick label="Replied" done={steps.replied} onClick={e => tickStep(e,"replied","replied")} disabled={!steps.messaged} />
      </div>
    </div>
  );
}

function StepTick({ label, done, onClick, disabled }) {
  return (
    <div className={`step ${done?"done":disabled?"":"current"}`}
      onClick={disabled ? undefined : onClick}
      style={disabled ? {opacity:0.35,cursor:"default"} : {}}>
      <span>{done?"✓":"○"}</span>{label}
    </div>
  );
}

// ─── LEAD DETAIL ──────────────────────────────────────────────────────────────

function LeadDetail({ lead, updateLead, showToast, allLeads, updateAndSave, apiKey }) {
  const [genLoading, setGenLoading] = useState(false);
  const [messages, setMessages] = useState(null);
  const [replyText, setReplyText] = useState(lead.reply || "");
  const [analyseLoading, setAnalyseLoading] = useState(false);
  const [analysis, setAnalysis] = useState(lead.aiAnalysis || null);
  const [showCloseOptions, setShowCloseOptions] = useState(false);
  const [genError, setGenError] = useState("");

  useEffect(() => {
    setReplyText(lead.reply || "");
    setAnalysis(lead.aiAnalysis || null);
    setMessages(null);
    setGenError("");
  }, [lead.id]);

  const handleGenerateOutreach = async () => {
    if (!apiKey) { setGenError("Add your API key first (top right button)."); return; }
    setGenLoading(true); setMessages(null); setGenError("");
    try {
      const msgs = await generateOutreachMessage(lead, apiKey);
      setMessages(msgs);
    } catch (e) {
      setGenError("AI error: " + e.message + ". Check your API key is correct.");
    }
    setGenLoading(false);
  };

  const handleSelectMessage = (text) => {
    updateLead(lead.id, { outreachMessage: text, lastContact: new Date().toISOString() });
    showToast("Message saved");
    setMessages(null);
  };

  const handleAnalyseReply = async () => {
    if (!apiKey) { setGenError("Add your API key first."); return; }
    if (!replyText.trim()) return;
    setAnalyseLoading(true); setGenError("");
    try {
      const result = await analyseReply(lead, replyText, apiKey);
      setAnalysis(result);
      updateLead(lead.id, { reply: replyText, aiAnalysis: result, stage: result.classification, steps: { ...lead.steps, replied: true } });
    } catch (e) {
      setGenError("AI error: " + e.message);
    }
    setAnalyseLoading(false);
  };

  const handleClose = (outcome) => {
    updateLead(lead.id, { stage: outcome });
    setShowCloseOptions(false);
    showToast(outcome === "won" ? "🎉 Commission Won!" : "Lead marked as Lost");
  };

  const handleDelete = () => {
    const updated = allLeads.filter(l => l.id !== lead.id);
    updateAndSave(updated);
    showToast("Lead deleted");
  };

  return (
    <div className="detail-panel">
      <div className="panel-header">
        <div style={{marginBottom:6}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:18,letterSpacing:2,marginBottom:2}}>{lead.name}</div>
          <div style={{fontSize:11,color:"var(--text3)"}}>{lead.role} · {lead.company}</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <PlatformTag platform={lead.platform} />
          <StageBadge stage={lead.stage} />
        </div>
      </div>

      <div className="panel-body">
        {lead.notes && (
          <div className="panel-section">
            <div className="panel-section-title">Notes</div>
            <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.6}}>{lead.notes}</div>
          </div>
        )}

        {/* Step 1: Outreach */}
        <div className="panel-section">
          <div className="panel-section-title">Step 1 — Outreach Message</div>
          {lead.outreachMessage ? (
            <>
              <div className="msg-box" style={{marginBottom:10}}>
                <button className="copy-btn" onClick={() => copy(lead.outreachMessage, () => showToast("Copied!"))}>COPY</button>
                {lead.outreachMessage}
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <button className="btn btn-outline btn-sm" onClick={handleGenerateOutreach}>↺ Regenerate</button>
                {!lead.steps?.messaged ? (
                  <button className="btn btn-gold btn-sm" onClick={() => { updateLead(lead.id, { steps:{...lead.steps,messaged:true}, stage:"messaged" }); showToast("Marked as sent ✓"); }}>
                    ✓ Mark as Sent
                  </button>
                ) : (
                  <span style={{fontSize:11,color:"var(--green)",padding:"5px 0"}}>✓ Message sent</span>
                )}
              </div>
            </>
          ) : (
            <div>
              <p style={{fontSize:11,color:"var(--text3)",marginBottom:12,lineHeight:1.6}}>
                AI will generate 3 punchy, personalised messages for {lead.name}. Pick one, copy it, paste it.
              </p>
              <button className="btn btn-gold" onClick={handleGenerateOutreach} disabled={genLoading}>
                {genLoading ? "Generating..." : "⚡ Generate Messages"}
              </button>
            </div>
          )}
          {genLoading && <Loader text="Crafting personalised hooks..." />}
          {genError && <div style={{color:"var(--warm)",fontSize:11,marginTop:8,padding:"8px 12px",background:"var(--warm-bg)",borderRadius:"var(--radius)",border:"1px solid rgba(232,93,58,0.3)"}}>{genError}</div>}
          {messages && (
            <div style={{marginTop:14}}>
              <div style={{fontSize:10,color:"var(--text3)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Pick one:</div>
              {messages.map((m, i) => (
                <div key={i} className="msg-option" onClick={() => handleSelectMessage(m.text)}>
                  <div className="msg-option-label">{m.label}</div>
                  <button className="copy-btn" onClick={e => { e.stopPropagation(); copy(m.text, () => showToast("Copied!")); }}>COPY</button>
                  {m.text}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Reply */}
        {lead.steps?.messaged && (
          <div className="panel-section">
            <div className="panel-section-title">Step 2 — Paste Their Reply</div>
            {analysis ? (
              <>
                <div style={{marginBottom:12}}>
                  {analysis.classification === "warm"
                    ? <span className="warm-chip">🔥 WARM LEAD</span>
                    : <span className="cold-chip">🧊 COLD LEAD</span>}
                  <div style={{fontSize:11,color:"var(--text3)",marginTop:6}}>{analysis.reason}</div>
                </div>
                <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:12,fontSize:12,color:"var(--text2)",marginBottom:14,lineHeight:1.6,fontStyle:"italic"}}>
                  "{lead.reply}"
                </div>
                <div className="panel-section-title">Your 3 Reply Options</div>
                {analysis.replies?.map((r, i) => (
                  <div key={i} className="msg-option">
                    <div className="msg-option-label">{r.label}</div>
                    <button className="copy-btn" onClick={() => copy(r.text, () => showToast("Copied!"))}>COPY</button>
                    {r.text}
                  </div>
                ))}
                <button className="btn btn-outline btn-sm" style={{marginTop:8}} onClick={() => { setAnalysis(null); setReplyText(""); }}>↺ New Reply</button>
              </>
            ) : (
              <>
                <textarea className="input" placeholder="Paste their reply here..." value={replyText}
                  onChange={e => setReplyText(e.target.value)} style={{minHeight:100,marginBottom:10}} />
                <button className="btn btn-gold" onClick={handleAnalyseReply} disabled={analyseLoading||!replyText.trim()}>
                  {analyseLoading ? "Analysing..." : "⚡ Analyse Reply & Get Options"}
                </button>
                {analyseLoading && <div style={{marginTop:8}}><Loader text="Classifying & drafting replies..." /></div>}
              </>
            )}
          </div>
        )}

        {/* Step 3: Close */}
        {["warm","cold","replied"].includes(lead.stage) && (
          <div className="panel-section">
            <div className="panel-section-title">Step 3 — Close</div>
            {lead.stage === "won" ? <span className="won-chip">✅ COMMISSION WON</span>
              : lead.stage === "lost" ? <span style={{color:"var(--text3)",fontSize:12}}>✗ Marked as lost</span>
              : !showCloseOptions ? (
                <button className="btn btn-outline" onClick={() => setShowCloseOptions(true)}>Mark Outcome →</button>
              ) : (
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button className="btn btn-gold" onClick={() => handleClose("won")}>✅ Commission Won</button>
                  <button className="btn btn-danger" onClick={() => handleClose("lost")}>✗ Lost</button>
                  <button className="btn btn-ghost" onClick={() => setShowCloseOptions(false)}>Cancel</button>
                </div>
              )
            }
          </div>
        )}

        <hr className="divider" />
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>✕ Remove Lead</button>
      </div>
    </div>
  );
}

// ─── ADD LEAD MODAL ───────────────────────────────────────────────────────────

function AddLeadModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name:"", role:"", company:"", platform:"LinkedIn", notes:"" });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const valid = form.name.trim() && form.role.trim() && form.company.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">ADD LEAD</div>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid-2" style={{marginBottom:12}}>
            <div><label className="label">Full Name *</label><input className="input" placeholder="James Whitfield" value={form.name} onChange={e=>set("name",e.target.value)} /></div>
            <div><label className="label">Platform *</label>
              <select className="input" value={form.platform} onChange={e=>set("platform",e.target.value)}>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>
          </div>
          <div className="form-grid-2" style={{marginBottom:12}}>
            <div><label className="label">Role / Title *</label><input className="input" placeholder="Founder & CEO" value={form.role} onChange={e=>set("role",e.target.value)} /></div>
            <div><label className="label">Company *</label><input className="input" placeholder="Apex Digital Ltd" value={form.company} onChange={e=>set("company",e.target.value)} /></div>
          </div>
          <div><label className="label">Notes (helps AI personalise)</label>
            <textarea className="input" placeholder="e.g. Just opened a new office, recently raised Series A, posts about company culture..." value={form.notes} onChange={e=>set("notes",e.target.value)} style={{minHeight:80}} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" onClick={() => onSave({ id:Date.now().toString(), ...form, stage:"invited", steps:{invited:false,accepted:false,messaged:false,replied:false}, outreachMessage:"", reply:"", aiAnalysis:null, addedAt:Date.now() })} disabled={!valid}>Add to Pipeline →</button>
        </div>
      </div>
    </div>
  );
}

// ─── API KEY MODAL ────────────────────────────────────────────────────────────

function ApiKeyModal({ currentKey, onSave, onClose }) {
  const [key, setKey] = useState(currentKey);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">ANTHROPIC API KEY</div>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{fontSize:12,color:"var(--text2)",marginBottom:16,lineHeight:1.7}}>
            Your API key is needed to power the AI message generation and reply analysis. It's stored only in your browser — never sent anywhere except Anthropic's servers.
          </p>
          <p style={{fontSize:11,color:"var(--text3)",marginBottom:16,lineHeight:1.6}}>
            Get your key at <strong style={{color:"var(--gold)"}}>console.anthropic.com</strong> → API Keys → Create Key.
          </p>
          <label className="label">API Key</label>
          <input className="input" type="password" placeholder="sk-ant-api03-..." value={key} onChange={e=>setKey(e.target.value)} />
          <p style={{fontSize:10,color:"var(--text3)",marginTop:8}}>Starts with "sk-ant-"</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" onClick={() => onSave(key)} disabled={!key.trim()}>Save Key →</button>
        </div>
      </div>
    </div>
  );
}

// ─── LEAD FINDER ─────────────────────────────────────────────────────────────

function FinderTab({ showToast }) {
  const [liRoles, setLiRoles] = useState("Founder, CEO, Owner, MD, Managing Director, Entrepreneur");
  const [liLocation, setLiLocation] = useState("United Kingdom, Ireland");
  const [liKeywords, setLiKeywords] = useState("");
  const [igHashtags, setIgHashtags] = useState("#entrepreneur #founderlife #smallbusiness #ukbusiness #businessowner #ukfounder");

  const searchStr = `(Founder OR CEO OR Owner OR "Managing Director" OR Entrepreneur OR MD) AND (${liLocation.split(",")[0].trim()})${liKeywords ? ` AND ${liKeywords}` : ""}`;

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      {/* LinkedIn */}
      <div className="finder-block">
        <div className="finder-platform">
          <div className="finder-icon" style={{background:"rgba(10,102,194,0.15)",color:"#5a9fd4"}}>🔗</div>
          <div>
            <div className="finder-title" style={{color:"#5a9fd4"}}>LINKEDIN</div>
            <div style={{fontSize:10,color:"var(--text3)",letterSpacing:1}}>FOUNDERS · CEOs · MDs · OWNERS</div>
          </div>
        </div>
        <div style={{marginBottom:10,fontSize:11,color:"var(--text3)",lineHeight:1.6}}>Paste this into LinkedIn search, filter by "People":</div>
        <div className="search-string">{searchStr}</div>
        <button className="copy-btn" style={{position:"static",display:"inline-flex",marginBottom:16}}
          onClick={() => copy(searchStr, () => showToast("Search string copied!"))}>COPY STRING</button>

        <div style={{marginBottom:12}}>
          <label className="label">Location</label>
          <input className="input" value={liLocation} onChange={e=>setLiLocation(e.target.value)} />
        </div>
        <div style={{marginBottom:12}}>
          <label className="label">Extra Keywords</label>
          <input className="input" placeholder="e.g. bespoke, luxury, award..." value={liKeywords} onChange={e=>setLiKeywords(e.target.value)} />
        </div>

        <div style={{fontSize:10,color:"var(--text3)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,paddingBottom:8,borderBottom:"1px solid var(--border)"}}>Step-by-Step</div>
        <ol className="step-list">
          <li>Go to <strong style={{color:"var(--text)"}}>linkedin.com/search/results/people</strong></li>
          <li>Paste the search string into the search bar</li>
          <li>Filter: <strong style={{color:"var(--text)"}}>Connections → 2nd degree</strong></li>
          <li>Filter: <strong style={{color:"var(--text)"}}>Location → United Kingdom</strong></li>
          <li>Look for recent posts, professional photos, signs of success</li>
          <li>Send connection request — no note needed (higher acceptance rate)</li>
          <li>Add them to Pipeline with "Invited" ticked</li>
        </ol>
        <div style={{background:"var(--gold-dim)",border:"1px solid var(--gold)",borderRadius:"var(--radius)",padding:"12px 14px",marginTop:16,fontSize:11,color:"var(--gold2)",lineHeight:1.7}}>
          <strong>⚡ Rule:</strong> Max 15–20 connection requests per day. LinkedIn flags accounts over 50/day.
        </div>
      </div>

      {/* Instagram */}
      <div className="finder-block">
        <div className="finder-platform">
          <div className="finder-icon" style={{background:"rgba(228,64,95,0.12)",color:"#e4405f"}}>📷</div>
          <div>
            <div className="finder-title" style={{color:"#e4405f"}}>INSTAGRAM</div>
            <div style={{fontSize:10,color:"var(--text3)",letterSpacing:1}}>ENTREPRENEURS · PERSONAL BRANDS</div>
          </div>
        </div>
        <div style={{marginBottom:10,fontSize:11,color:"var(--text3)",lineHeight:1.6}}>Search these hashtags in Instagram explore → Recent posts:</div>
        <div className="search-string">{igHashtags}</div>
        <button className="copy-btn" style={{position:"static",display:"inline-flex",marginBottom:16}}
          onClick={() => copy(igHashtags, () => showToast("Hashtags copied!"))}>COPY</button>

        <div style={{marginBottom:12}}>
          <label className="label">Hashtags to Use</label>
          <textarea className="input" style={{minHeight:70}} value={igHashtags} onChange={e=>setIgHashtags(e.target.value)} />
        </div>

        <div style={{fontSize:10,color:"var(--text3)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,paddingBottom:8,borderBottom:"1px solid var(--border)"}}>Step-by-Step</div>
        <ol className="step-list">
          <li>Search hashtags above in Instagram's explore tab</li>
          <li>Open <strong style={{color:"var(--text)"}}>Recent</strong> posts (not "Top" — those are brands)</li>
          <li>Check bio: look for founder, CEO, owner, built, scaling, 📍UK</li>
          <li>Ideal follower range: <strong style={{color:"var(--text)"}}>5k–500k</strong></li>
          <li>Follow them — don't DM cold yet</li>
          <li>Like or comment on 1–2 of their posts genuinely</li>
          <li>After 24–48hrs, DM with the AI message from Pipeline</li>
          <li>Add to Pipeline with "Invited" ticked</li>
        </ol>
        <div style={{background:"rgba(228,64,95,0.08)",border:"1px solid rgba(228,64,95,0.25)",borderRadius:"var(--radius)",padding:"12px 14px",marginTop:16,fontSize:11,color:"#e4405f",lineHeight:1.7}}>
          <strong>⚡ Rule:</strong> Engage before you DM. That one comment makes you a familiar name, not a stranger.
        </div>
      </div>

      {/* What to look for */}
      <div style={{gridColumn:"1 / -1"}}>
        <div className="finder-block">
          <div className="card-title">⚙ <span>WHAT MAKES A GREAT LEAD</span></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:16}}>
            {[
              { icon:"👤", title:"Role", body:"Founder, Owner, CEO, MD, Entrepreneur, Investor. They have the budget and the ego invested in their brand." },
              { icon:"🏢", title:"Company", body:"2–200 people. They're the face of the business. A portrait of them IS a business statement." },
              { icon:"📍", title:"Location", body:"UK & Ireland. London, Manchester, Birmingham, Dublin. High-value areas and business hubs." },
              { icon:"✨", title:"Trigger Moments", body:"New office, funding round, award win, company anniversary, personal rebrand. Peak commission windows." },
            ].map((item, i) => (
              <div key={i} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:16}}>
                <div style={{fontSize:24,marginBottom:8}}>{item.icon}</div>
                <div style={{fontFamily:"var(--font-display)",fontSize:14,letterSpacing:2,color:"var(--gold)",marginBottom:8}}>{item.title}</div>
                <div style={{fontSize:11,color:"var(--text2)",lineHeight:1.6}}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

function AnalyticsTab({ leads }) {
  const total = leads.length;
  const invited = leads.filter(l=>l.steps?.invited).length;
  const accepted = leads.filter(l=>l.steps?.accepted).length;
  const messaged = leads.filter(l=>l.steps?.messaged).length;
  const replied = leads.filter(l=>l.steps?.replied).length;
  const warm = leads.filter(l=>l.stage==="warm").length;
  const won = leads.filter(l=>l.stage==="won").length;

  const pct = (a,b) => b > 0 ? Math.round((a/b)*100)+"%" : "—";
  const value = won * 4500;

  return (
    <div>
      <div className="analytics-grid">
        {[
          { val:total, label:"Total Leads", sub:`${leads.filter(l=>l.platform==="LinkedIn").length} LinkedIn · ${leads.filter(l=>l.platform==="Instagram").length} Instagram` },
          { val:pct(accepted,invited), label:"Accept Rate", sub:`${accepted} of ${invited} invites accepted` },
          { val:pct(replied,messaged), label:"Reply Rate", sub:`${replied} replies from ${messaged} messages` },
          { val:warm, label:"🔥 Warm Leads", sub:`${pct(warm,replied)} of replies`, color:"#e85d3a" },
          { val:won, label:"Commissions Won", sub:`from ${warm} warm leads`, color:"#4caf6a" },
          { val:pct(won,warm), label:"Close Rate", sub:"warm → commission", color:"#4caf6a" },
          { val:`£${value.toLocaleString()}`, label:"Est. Revenue", sub:"at avg £4,500/commission", color:"#c9a84c" },
          { val:total-won, label:"Still in Pipeline", sub:"leads yet to convert" },
        ].map((s,i) => (
          <div key={i} className="stat-card">
            <div className="stat-val" style={s.color?{color:s.color}:{}}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:20}}>
        <div className="card-title">◎ <span>CONVERSION FUNNEL</span></div>
        <div className="funnel-bar">
          {[
            {label:"Invited",val:invited,color:"#8a8078"},
            {label:"Accepted",val:accepted,color:"#c9a84c"},
            {label:"Messaged",val:messaged,color:"#7a6fc9"},
            {label:"Replied",val:replied,color:"#4caf6a"},
            {label:"Warm",val:warm,color:"#e85d3a"},
            {label:"Won",val:won,color:"#2d8a4a"},
          ].map((seg,i) => (
            <div key={i} className="funnel-seg" style={{flex:Math.max(seg.val,0.5),background:seg.color}}>
              <span>{seg.val>0?`${seg.label} ${seg.val}`:""}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">◈ <span>ALL LEADS</span></div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:"1px solid var(--border)"}}>
                {["Name","Role","Company","Platform","Stage","Added"].map(h => (
                  <th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:9,color:"var(--text3)",letterSpacing:1.5,textTransform:"uppercase",fontWeight:400}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...leads].sort((a,b)=>b.addedAt-a.addedAt).map(lead => (
                <tr key={lead.id} style={{borderBottom:"1px solid var(--border)"}}>
                  <td style={{padding:"10px 12px",color:"var(--text)"}}>{lead.name}</td>
                  <td style={{padding:"10px 12px",color:"var(--text3)"}}>{lead.role}</td>
                  <td style={{padding:"10px 12px",color:"var(--text2)"}}>{lead.company}</td>
                  <td style={{padding:"10px 12px"}}><PlatformTag platform={lead.platform} /></td>
                  <td style={{padding:"10px 12px"}}><StageBadge stage={lead.stage} /></td>
                  <td style={{padding:"10px 12px",color:"var(--text3)"}}>{new Date(lead.addedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
