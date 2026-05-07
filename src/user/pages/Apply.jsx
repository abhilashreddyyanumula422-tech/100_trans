import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import digilockerLogo from "../../assets/digilocker_logo.png";
import transcriptsIcon from "../../assets/transcript.png"; // Assuming there's a transcript or generic icon
// NOTE: Replace this import with your actual image path
// import flowImage from "../../assets/flow1.png";
const flowImage = null; // placeholder — swap with your import

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

html, body, #root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #fff;
  min-height: 100vh;
}

/* ══ Keyframes ══ */
@keyframes fadeDown  { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeUp    { from{opacity:0;transform:translateY(24px)}  to{opacity:1;transform:translateY(0)} }
@keyframes cardIn    { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
@keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.8)} }
@keyframes pop       { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }
@keyframes slideUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
@keyframes float     { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-9px)} }
@keyframes drawRoad  { from{stroke-dashoffset:var(--road-len,2000)} to{stroke-dashoffset:0} }
@keyframes nodeIn    { from{opacity:0;transform:scale(0) rotate(-20deg)} to{opacity:1;transform:scale(1) rotate(0)} }
@keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes modalIn   { from{opacity:0;transform:scale(0.92) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes overlayIn { from{opacity:0} to{opacity:1} }
@keyframes spin      { to{transform:rotate(360deg)} }
@keyframes stepPulse { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0.45)} 50%{box-shadow:0 0 0 8px rgba(59,130,246,0)} }
@keyframes lineGrow  { from{height:0} to{height:100%} }
@keyframes checkPop  { 0%{transform:scale(0) rotate(-30deg);opacity:0} 70%{transform:scale(1.2) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
@keyframes iconBounce { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} 60%{transform:translateY(-1px)} }
@keyframes dashMove  { to{stroke-dashoffset:-20} }

/* Active traveler pulse */
.active-traveler-pulse {
  pointer-events: none;
}

/* ══ Layout ══ */
.app-shell {
  display: flex;
  min-height: 100vh;
  background: #fff;
}

/* ══ LEFT PANEL — White Roadmap (matches original UI) ══ */
.image-panel {
  width: 30%;
  min-width: 320px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: #ffffff;
  border-right: 1.5px solid #eef2f6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.panel-glow-bottom { display: none; }

.image-panel-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 28px 22px 22px;
  overflow-y: auto;
  scrollbar-width: none;
}
.image-panel-inner::-webkit-scrollbar { display: none; }

/* Brand */
.panel-brand {
  margin-bottom: 26px;
  padding-bottom: 20px;
  border-bottom: 1.5px solid #f1f5f9;
}
.panel-brand-badge { display: none; }
.live-dot { display: none; }
.panel-brand h2 {
  font-size: 19px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.4px;
  line-height: 1.25;
}
.panel-brand p {
  font-size: 12px;
  color: #3b82f6;
  margin-top: 5px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

/* ══ Roadmap ══ */
.roadmap {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0;
}

.rm-step {
  display: flex;
  gap: 18px;
  position: relative;
}

/* Left column: icon circle + connector */
.rm-line-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 44px;
}

/* Dashed vertical connector */
.rm-connector {
  width: 2px;
  flex: 1;
  min-height: 10vh;
  position: relative;
  overflow: hidden;
  /* dashed look via repeating gradient */
  background: repeating-linear-gradient(
    to bottom,
    #cbd5e1 0px, #cbd5e1 5px,
    transparent 5px, transparent 10px
  );
  border-radius: 1px;
  margin: 2px 0;
}

/* Fill overlay that grows when step is done */
.rm-connector-fill {
  position: absolute;
  top: 0; left: 0; right: 0;
  background: linear-gradient(to bottom, #3b82f6, #60a5fa);
  border-radius: 1px;
}

/* ── Step icon circle (matches colored circles in screenshot) ── */
.rm-node {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  position: relative;
  transition: all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
  border: 2px solid #e2e8f0;
  background: #f8fafc;
}

/* Number badge on top-left of circle */
.rm-node-num {
  position: absolute;
  top: -4px; left: -4px;
  width: 17px; height: 17px;
  border-radius: 50%;
  background: #1e3a8a;
  color: #fff;
  font-size: 9px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  line-height: 1;
  transition: background 0.3s;
}

/* Done state */
.rm-step.is-done .rm-node {
  background: #f0f9ff;
  border-color: #7dd3fc;
}
.rm-step.is-done .rm-node-num {
  background: #0284c7;
  animation: checkPop 0.4s cubic-bezier(.34,1.7,.64,1) both;
}

/* Active state */
.rm-step.is-active .rm-node {
  border-color: #93c5fd;
  background: #eff6ff;
  animation: stepPulse 2.2s ease-in-out infinite;
}
.rm-step.is-active .rm-node-num {
  background: #2563eb;
}
.rm-step.is-active .step-emoji {
  animation: iconBounce 2s ease-in-out infinite;
  display: inline-block;
}

/* Upcoming state */
.rm-step.is-upcoming .rm-node {
  opacity: 0.5;
}
.rm-step.is-upcoming .rm-node-num {
  background: #94a3b8;
}

/* Step content */
.rm-content {
  flex: 1;
  padding: 8px 0 22px;
  transition: opacity 0.4s;
}
.rm-step.is-upcoming .rm-content {
  opacity: 0.45;
}

.rm-step-label {
  font-size: 11.5px;
  font-weight: 800;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
  margin-bottom: 3px;
  transition: color 0.3s;
}
.rm-step.is-active .rm-step-label { color: #1d4ed8; }
.rm-step.is-done   .rm-step-label { color: #15803d; }
.rm-step.is-upcoming .rm-step-label { color: #64748b; }

.rm-step-hint {
  font-size: 10.5px;
  color: #94a3b8;
  line-height: 1.45;
}
.rm-step.is-active .rm-step-hint { color: #3b82f6; }
.rm-step.is-done   .rm-step-hint { color: #38bdf8; }

/* Active pill */
.rm-active-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 100px;
  padding: 2px 9px;
  font-size: 9.5px;
  font-weight: 700;
  color: #2563eb;
  animation: fadeUp 0.4s ease both;
}
.rm-active-pill::before {
  content: '';
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #3b82f6;
  animation: pulse 1.5s infinite;
  flex-shrink: 0;
}

/* Stats */
.panel-stats {
  display: flex;
  gap: 8px;
  margin-top: 6px;
  padding-top: 16px;
  border-top: 1.5px solid #f1f5f9;
  flex-shrink: 0;
}
.panel-stat {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 6px;
  text-align: center;
}
.panel-stat-num {
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
  line-height: 1;
}
.panel-stat-lbl {
  font-size: 9px;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-top: 3px;
}

/* SVG road nodes */
.rnode { opacity: 0; animation: nodeIn .55s cubic-bezier(.34,1.56,.64,1) forwards; }
.image-panel::before, .image-panel::after { display: none; }

/* ══ RIGHT PORTAL PANEL ══ */
.portal-panel {
  flex: 1;
  background: #f0f4ff;
  min-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* ══ Portal wrap ══ */
.portal-wrap { max-width: 1100px; margin: 0 auto; padding: 60px 24px 72px; flex: 1; }

/* ══ Hero ══ */
.hero-header { text-align:center; padding: 8px 0 6px; animation:fadeDown .7s ease both; }
.hero-header h1 {
  font-size: clamp(24px,4vw,38px); font-weight:900;
  color:#0f172a; letter-spacing:-1px; line-height:1.15;
}
.hero-header h1 em { font-style:normal; color:#3b82f6; }
.hero-header p { color:#64748b; font-size:14px; margin-top:8px; }

/* ══ Track bar ══ */
.track-bar {
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 8px;
  border-radius: 50px;
  box-shadow: 0 12px 36px rgba(15, 52, 120, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.track-bar:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.4);
}
.track-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 16px;
  font-size: 13px;
  border-radius: 50px;
  background: #f8fafc;
  color: #0f172a;
  font-family: inherit;
}
.track-input::placeholder { color: #94a3b8; }
.track-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 11px 20px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  white-space: nowrap;
}
.track-btn:hover { transform: scale(1.04); box-shadow: 0 4px 16px rgba(59,130,246,0.4); }

/* ══ Process ribbon ══ */
.process-section { margin: 20px 0 10px; animation:fadeUp .8s .2s ease both; }
.proc-ribbon {
  display:flex; align-items:stretch;
  background:#fff; border:1.5px solid #e2e8f0;
  border-radius:20px; overflow:hidden;
  box-shadow: 0 4px 20px rgba(15,52,120,0.06);
}
.proc-cell {
  flex:1; padding:18px 8px 16px; text-align:center; position:relative;
  border-right:1px solid #f1f5f9;
  transition:background .4s;
}
.proc-cell:last-child { border-right:none; }
.proc-cell.pc-done   { background:rgba(34,197,94,.06); }
.proc-cell.pc-active { background:rgba(59,130,246,.07); }
.proc-orb {
  width:46px; height:46px; border-radius:50%; margin:0 auto 9px;
  display:flex; align-items:center; justify-content:center; font-size:20px;
  background:#f8fafc; border:2px solid #e2e8f0;
  position:relative; transition:border-color .4s, background .4s;
}
.proc-cell.pc-done   .proc-orb { background:rgba(34,197,94,.1); border-color:#7dd3fc; }
.proc-cell.pc-active .proc-orb { background:rgba(59,130,246,.1); border-color:#93c5fd; animation:float 2.4s ease-in-out infinite; }
.proc-cell.pc-done .proc-orb::after {
  content:'✓'; position:absolute; top:-4px; right:-4px;
  width:18px; height:18px; border-radius:50%;
  background:#0ea5e9; color:#fff; font-size:10px; font-weight:800;
  display:flex; align-items:center; justify-content:center;
  animation:pop .35s cubic-bezier(.34,1.7,.64,1) both;
}
.proc-name { font-size:10px; font-weight:700; letter-spacing:.4px; text-transform:uppercase; color:#94a3b8; margin-bottom:2px; }
.proc-cell.pc-done .proc-name, .proc-cell.pc-active .proc-name { color:#1e293b; }
.proc-hint { font-size:9.5px; color:#cbd5e1; line-height:1.4; }
.proc-cell.pc-active .proc-hint { color:#64748b; }

.flow-track { height:4px; background:#f1f5f9; border-radius:100px; margin:0 0 14px; overflow:hidden; }
.flow-fill   { height:100%; border-radius:100px; background:linear-gradient(90deg,#0ea5e9,#3b82f6,#a855f7); transition:width .65s cubic-bezier(.4,0,.2,1); }

/* ══ Main card ══ */
.main-card { background:#fff; border-radius:26px; padding:34px 30px; box-shadow:0 8px 48px rgba(15,52,120,0.10); border:1px solid #e8edf5; margin-top:20px; }
.card-anim { animation:cardIn .5s cubic-bezier(.34,1.2,.64,1) both; }

.step-header { display:flex; align-items:center; gap:16px; margin-bottom:28px; padding-bottom:20px; border-bottom:2px solid #f1f5f9; }
.step-icon { width:52px; height:52px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
.icon-blue   { background:linear-gradient(135deg,#eff6ff,#dbeafe); }
.icon-sky  { background:linear-gradient(135deg,#f0f9ff,#e0f2fe); }
.icon-purple { background:linear-gradient(135deg,#faf5ff,#ede9fe); }
.icon-amber  { background:linear-gradient(135deg,#fffbeb,#fef3c7); }
.step-title    { font-size:21px; font-weight:800; color:#0f172a; }
.step-subtitle { font-size:13px; color:#64748b; margin-top:3px; }

/* ══ Form ══ */
.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.field { display:flex; flex-direction:column; gap:6px; }
.field label { font-size:12.5px; font-weight:700; color:#374151; }
.field input, .field select {
  padding:11px 13px; border:1.5px solid #e2e8f0; border-radius:10px;
  font-size:14px; font-family:inherit; outline:none; color:#1e293b; background:#fff;
  transition:border .2s,box-shadow .2s;
  -webkit-appearance: none;
}
.field input:focus,.field select:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.1); }
.req { color:#ef4444; }

.sec-title { font-size:15px; font-weight:800; color:#1e293b; margin:24px 0 12px; display:flex; align-items:center; gap:10px; }
.sec-title::before { content:''; width:4px; height:18px; background:linear-gradient(180deg,#3b82f6,#2563eb); border-radius:2px; display:inline-block; }

.degree-card { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px; margin-bottom:12px; transition:border .2s; }
.degree-card:hover { border-color:#bfdbfe; }
.deg-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.deg-num { font-size:12px; font-weight:700; color:#3b82f6; background:#eff6ff; padding:3px 10px; border-radius:6px; }
.btn-rm { background:none; border:none; color:#ef4444; cursor:pointer; font-size:12px; font-weight:700; padding:4px 8px; border-radius:6px; transition:background .2s; font-family:inherit; }
.btn-rm:hover { background:#fef2f2; }

/* ══ Upload box ══ */
.upload-box { background:linear-gradient(135deg,#eff6ff,#f8fafc); border:2px dashed #bfdbfe; border-radius:14px; padding:18px; margin-bottom:14px; transition:border .2s; }
.upload-box:hover { border-color:#3b82f6; }
.upload-lbl { font-size:12.5px; font-weight:700; color:#1e40af; margin-bottom:10px; display:flex; align-items:center; gap:7px; }
.upload-row { display:flex; gap:8px; flex-wrap:wrap; }
.upload-row input[type=file] { flex:1; min-width:160px; padding:7px 10px; border:1.5px solid #dbeafe; border-radius:8px; font-size:12px; font-family:inherit; background:#fff; cursor:pointer; }
.upload-row select { padding:7px 10px; border:1.5px solid #dbeafe; border-radius:8px; font-size:12px; font-family:inherit; background:#fff; color:#1e293b; cursor:pointer; }
.prog-wrap { margin-top:9px; }
.prog-bar  { height:5px; background:#e2e8f0; border-radius:100px; overflow:hidden; margin-bottom:3px; }
.prog-fill { height:100%; border-radius:100px; transition:width .25s,background .4s; background:linear-gradient(90deg,#3b82f6,#60a5fa); }
.prog-fill.pdone { background:linear-gradient(90deg,#0ea5e9,#38bdf8); }
.prog-text  { font-size:11px; color:#64748b; }
.upload-actions { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; align-items:center; }
.btn-attach { background:linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff; border:none; border-radius:8px; padding:7px 16px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; transition:transform .15s; }
.btn-attach:hover { transform:scale(1.04); }
.btn-del { background:#fee2e2; color:#dc2626; border:none; border-radius:8px; padding:7px 14px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; transition:background .2s; }
.btn-del:hover { background:#fecaca; }

/* DigiLocker button */
.btn-digilocker {
  display:inline-flex; align-items:center; gap:6px;
  background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; border:none;
  border-radius:8px; padding:7px 14px; font-size:12px; font-weight:700;
  cursor:pointer; font-family:inherit; transition:transform .15s,box-shadow .15s;
}
.btn-digilocker:hover { transform:scale(1.04); box-shadow:0 4px 14px rgba(79,70,229,0.4); }
.btn-digilocker svg { width:14px; height:14px; flex-shrink:0; }

.file-nm { font-size:11px; color:#64748b; margin-top:5px; }
.file-compressed { font-size:10.5px; color:#0284c7; font-weight:600; margin-top:2px; }

.check-list { display:flex; flex-direction:column; gap:10px; margin-top:18px; }
.check-item { display:flex; align-items:flex-start; gap:10px; cursor:pointer; padding:12px 14px; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; transition:border .2s,background .2s; }
.check-item:hover { border-color:#bfdbfe; background:#eff6ff; }
.check-item input { margin-top:2px; accent-color:#3b82f6; width:15px; height:15px; flex-shrink:0; cursor:pointer; }
.check-item span  { font-size:12.5px; color:#374151; line-height:1.5; }

/* ══ Buttons ══ */
.btn-primary {
  background:linear-gradient(135deg,#3b82f6,#2563eb); color:#fff; border:none;
  border-radius:12px; padding:13px 32px; font-size:14px; font-weight:800;
  cursor:pointer; font-family:inherit; transition:transform .15s,box-shadow .2s;
  display:inline-flex; align-items:center; gap:5px;
}
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(59,130,246,.4); }
.btn-primary:active { transform:scale(.98); }
.btn-primary.sky { background:linear-gradient(135deg,#0ea5e9,#0284c7); }
.btn-primary.sky:hover { box-shadow:0 8px 24px rgba(34,197,94,.4); }
.btn-secondary { background:#f1f5f9; color:#374151; border:none; border-radius:12px; padding:12px 24px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; transition:background .2s; }
.btn-secondary:hover { background:#e2e8f0; }
.btn-add { background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff; border:none; border-radius:9px; padding:9px 20px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; transition:transform .15s; }
.btn-add:hover { transform:scale(1.04); }
.btn-add-mini {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.15s;
}
.btn-add-mini:hover { transform: scale(1.05); }

.optional-deg-box {
  background: #f8fafc;
  border: 1.5px dashed #e2e8f0;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
}
.optional-deg-box:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
}
.opt-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.opt-text { flex: 1; display: flex; flex-direction: column; }
.opt-text strong { font-size: 13.5px; color: #1e293b; }
.opt-text span { font-size: 11px; color: #64748b; margin-top: 1px; }

.actions { display:flex; justify-content:center; gap:10px; margin-top:28px; flex-wrap:wrap; }

/* ══ Info panels ══ */
.info-panel { border-radius:18px; padding:28px; text-align:center; margin:10px 0 22px; }
.info-panel.amber  { background:linear-gradient(135deg,#fffbeb,#fef3c7); border:2px solid #fde68a; }
.info-panel.blue   { background:linear-gradient(135deg,#eff6ff,#dbeafe); border:2px solid #bfdbfe; }
.info-panel.indigo { background:linear-gradient(135deg,#eef2ff,#e0e7ff); border:2px solid #c7d2fe; }
.info-panel.sky  { background:linear-gradient(135deg,#f0f9ff,#e0f2fe); border:2px solid #7dd3fc; }
.info-icon  { font-size:46px; display:block; margin-bottom:11px; }
.info-panel h3 { font-size:19px; font-weight:800; margin-bottom:7px; color:#1e293b; }
.info-panel p  { font-size:13px; color:#475569; line-height:1.65; }
.amount { font-size:34px; font-weight:900; color:#1e293b; margin:10px 0 5px; }
.info-chip { display:inline-block; margin-top:10px; background:rgba(255,255,255,.8); border-radius:10px; padding:8px 16px; font-size:12px; color:#374151; }

/* ══ Timeline ══ */
.timeline { display:flex; flex-direction:column; }
.tl-item  { display:flex; gap:10px; padding:0 0 20px; }
.tl-item:last-child { padding-bottom:0; }
.tl-left  { display:flex; flex-direction:column; align-items:center; }
.tl-dot   { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }
.tl-line  { width:2px; background:#f1f5f9; flex:1; margin-top:5px; }
.tl-content    { flex:1; padding-top:5px; }
.tl-content h4 { font-size:14px; font-weight:700; color:#1e293b; margin-bottom:3px; }
.tl-content p  { font-size:12px; color:#64748b; line-height:1.5; }
.tl-badge { display:inline-block; font-size:10.5px; font-weight:700; padding:2px 9px; border-radius:100px; margin-top:5px; }
.bdone { background:#e0f2fe; color:#166534; }
.bprog { background:#dbeafe; color:#1e40af; }
.bwait { background:#f1f5f9; color:#64748b; }

.star-burst { font-size:64px; display:block; text-align:center; margin-bottom:10px; animation:pop .55s cubic-bezier(.34,1.7,.64,1) both; }
.success-wrap { animation:slideUp .55s cubic-bezier(.34,1.2,.64,1) both; }

/* ══ DigiLocker Modal ══ */
.modal-overlay {
  position: fixed; inset:0; background:rgba(0,0,0,0.55);
  display:flex; align-items:center; justify-content:center; z-index:1000;
  animation: overlayIn .2s ease;
  padding: 16px;
}
.modal-box {
  background:#fff; border-radius:24px; padding:36px 30px;
  width:100%; max-width:440px;
  box-shadow:0 24px 80px rgba(0,0,0,0.25);
  animation: modalIn .3s cubic-bezier(.34,1.2,.64,1);
}
.modal-header { display:flex; align-items:center; gap:14px; margin-bottom:24px; }
.modal-icon { width:52px; height:52px; border-radius:16px; background:linear-gradient(135deg,#4f46e5,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
.modal-title { font-size:20px; font-weight:800; color:#0f172a; }
.modal-sub   { font-size:13px; color:#64748b; margin-top:2px; }
.modal-field { margin-bottom:14px; }
.modal-field label { display:block; font-size:12px; font-weight:700; color:#374151; margin-bottom:5px; }
.modal-field input {
  width:100%; padding:11px 13px; border:1.5px solid #e2e8f0; border-radius:10px;
  font-size:14px; font-family:inherit; outline:none; color:#1e293b;
  transition:border .2s;
}
.modal-field input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.12); }
.modal-hint { font-size:11.5px; color:#94a3b8; margin-top:10px; line-height:1.5; }
.modal-actions { display:flex; gap:10px; margin-top:20px; }
.modal-actions .btn-primary { flex:1; justify-content:center; background:linear-gradient(135deg,#4f46e5,#7c3aed); }
.modal-actions .btn-primary:hover { box-shadow:0 8px 24px rgba(99,102,241,.4); }
.modal-actions .btn-secondary { flex:1; }
.digilocker-docs-list { margin-top:14px; display:flex; flex-direction:column; gap:8px; }
.dl-doc-item {
  display:flex; align-items:center; gap:10px; padding:10px 13px;
  background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px;
  cursor:pointer; transition:border .2s, background .2s;
}
.dl-doc-item:hover { border-color:#a5b4fc; background:#eef2ff; }
.dl-doc-item.selected { border-color:#6366f1; background:#eef2ff; }
.dl-doc-icon { font-size:22px; flex-shrink:0; }
.dl-doc-name { font-size:13px; font-weight:700; color:#1e293b; }
.dl-doc-meta { font-size:11px; color:#94a3b8; }
.dl-doc-check { margin-left:auto; width:20px; height:20px; border-radius:50%; border:2px solid #e2e8f0; display:flex; align-items:center; justify-content:center; font-size:10px; transition:all .2s; }
.dl-doc-item.selected .dl-doc-check { background:#6366f1; border-color:#6366f1; color:#fff; }
.spinner { width:18px; height:18px; border:2.5px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }

/* ══ Responsive ══ */
@media (max-width: 860px) {
  .app-shell { flex-direction: column; }
  .image-panel {
    width: 100%;
    min-width: 100%;
    height: auto;
    position: relative;
    padding: 24px 20px;
    min-height: unset;
  }
  .image-panel-inner { flex-direction: row; flex-wrap: wrap; padding: 0; gap: 16px; }
  .panel-brand { margin-bottom: 0; text-align: left; }
  .roadmap { display: none; }
  .panel-stats { margin-top: 0; }
  .portal-wrap { padding: 32px 16px 60px; }
  .main-card { padding: 18px 14px; border-radius: 18px; }
  .form-grid { grid-template-columns: 1fr; }
  .proc-ribbon { flex-direction: column; }
  .proc-cell { border-right:none; border-bottom:1px solid #f1f5f9; }
  .proc-cell:last-child { border-bottom:none; }
  .track-bar { flex-direction: row; }
}
@media (max-width: 480px) {
  .track-bar { flex-direction: column; border-radius: 20px; padding: 12px; gap: 10px; }
  .track-input, .track-btn { width: 100%; border-radius: 12px !important; }
  .track-btn { padding: 14px; }
  .optional-deg-box { flex-direction: column; text-align: center; gap: 12px; padding: 20px; }
  .opt-icon { margin: 0 auto; }
  .btn-add-mini { width: 100%; }
  .hero-header h1 { font-size: 28px; }
  .main-card { padding: 20px 16px; margin-top: 10px; }
  .step-header { flex-direction: column; text-align: center; gap: 12px; }
  .step-icon { margin: 0 auto; }
}

/* ══ Selection Panel Refined (Matches Image) ══ */
.selection-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}
.selection-header {
  text-align: center;
  margin-bottom: 60px;
}
.selection-header h1 {
  font-size: 42px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -1.5px;
  margin-bottom: 12px;
}
.selection-header p {
  font-size: 16px;
  color: #64748b;
  position: relative;
  display: inline-block;
}
.selection-header p::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: #3b82f6;
  border-radius: 2px;
}

.selection-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0;
  position: relative;
}
.selection-card {
  flex: 1;
  max-width: 420px;
  background: #fff;
  border-radius: 24px;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 50px rgba(0,0,0,0.08);
}
.card-manual {
  border-bottom: 4px solid #3b82f6;
}
.card-digi {
  border-bottom: 4px solid #6d28d9;
}

.selection-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 30px 60px rgba(0,0,0,0.12);
}

.card-illustration {
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 50%;
}
.card-illustration img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.card-title {
  font-size: 26px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 10px;
}
.card-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 24px;
  height: 42px;
}

.card-features {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 35px;
  text-align: left;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}
.feature-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  border: 1.5px solid currentColor;
}
.card-manual .feature-icon { color: #3b82f6; }
.card-digi .feature-icon { color: #8b5cf6; }

.card-btn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-manual { background: #2563eb; color: #fff; }
.btn-digi { background: #6d28d9; color: #fff; }

.card-footer {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.or-separator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
}
.or-line { width: 1px; background: #e2e8f0; flex: 1; }
.or-circle {
  width: 48px; height: 48px; border-radius: 50%;
  background: #fff; border: 1px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; color: #1e293b;
  z-index: 1;
}

.selection-trust-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 60px;
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 15px 40px rgba(0,0,0,0.05);
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.trust-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: #f0f7ff; color: #3b82f6;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
.trust-text h4 { font-size: 14px; font-weight: 800; color: #1e293b; margin: 0; }
.trust-text p { font-size: 11px; color: #64748b; margin: 2px 0 0; }

@media (max-width: 960px) {
  .selection-row { flex-direction: column; align-items: center; }
  .or-separator { height: 60px; flex-direction: row; width: 100%; }
  .or-line { height: 1px; width: 100%; }
  .selection-trust-bar { grid-template-columns: repeat(2, 1fr); }
}

/* Sidebar Security Box */
.sidebar-security {
  margin-top: auto;
  background: #eff6ff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.security-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: #fff; color: #3b82f6;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(59,130,246,0.1);
}
.security-text h4 { font-size: 13px; font-weight: 800; color: #1e293b; margin: 0; }
.security-text p { font-size: 10.5px; color: #64748b; line-height: 1.4; margin-top: 4px; }

/* ══ Guideline Images ══ */
.guideline-section { margin: 24px 0; padding: 22px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 20px; }
.guideline-title { font-size: 15px; font-weight: 800; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
.guideline-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.guideline-item { text-align: center; }
.guideline-img-wrap { position: relative; border-radius: 14px; overflow: hidden; border: 3px solid #fff; box-shadow: 0 8px 24px rgba(15,52,120,0.12); margin-bottom: 10px; aspect-ratio: 1/1; background: #e2e8f0; }
.guideline-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.guideline-badge { position: absolute; top: 10px; right: 10px; padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.badge-ok { background: #0ea5e9; color: #fff; }
.badge-no { background: #ef4444; color: #fff; }
.guideline-label { font-size: 12px; font-weight: 700; color: #475569; line-height: 1.3; }

/* ══ Dual Upload Panels ══ */
.dual-upload-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 10px;
}
.upload-side {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
}
.side-title {
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.manual-side .side-title { color: #3b82f6; }
.digilocker-side .side-title { color: #6d28d9; }

@media (max-width: 960px) {
  .dual-upload-container { grid-template-columns: 1fr; }
}
`;

/* ─────────────────────────────────────────
   IMAGE COMPRESSION UTILITY
───────────────────────────────────────── */
async function compressImage(file, maxSizeMB = 1, maxDimension = 1920) {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve({ file, compressed: false });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) { height = Math.round((height * maxDimension) / width); width = maxDimension; }
          else { width = Math.round((width * maxDimension) / height); height = maxDimension; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve({ file, compressed: false }); return; }
            const compressedFile = new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() });
            const savedKB = Math.max(0, Math.round((file.size - compressedFile.size) / 1024));
            resolve({ file: compressedFile, compressed: file.size > compressedFile.size, savedKB, originalKB: Math.round(file.size / 1024), newKB: Math.round(compressedFile.size / 1024) });
          },
          "image/jpeg", 0.82
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ─────────────────────────────────────────
   DIGILOCKER MODAL
───────────────────────────────────────── */
const MOCK_DIGILOCKER_DOCS = [
  { id: "degree", icon: "🎓", name: "B.Tech Degree Certificate", meta: "JNTU Hyderabad • 2021" },
  { id: "marksheet", icon: "📋", name: "Consolidated Marksheet", meta: "JNTU Hyderabad • 2021" },
  { id: "provisional", icon: "📜", name: "Provisional Certificate", meta: "JNTU Hyderabad • 2021" },
  { id: "migration", icon: "📑", name: "Migration Certificate", meta: "JNTU Hyderabad • 2021" },
];

function DigiLockerModal({ onClose, onFetch, targetLabel }) {
  const [phase, setPhase] = useState("login");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendOtp = () => {
    if (aadhaar.length < 12) { alert("Please enter a valid 12-digit Aadhaar number"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setOtpSent(true); }, 1200);
  };

  const verifyOtp = () => {
    if (otp.length < 6) { alert("Please enter the 6-digit OTP"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setPhase("docs"); }, 1400);
  };

  const fetchDocs = () => {
    if (!selected.length) { alert("Please select at least one document"); return; }
    setPhase("fetching");
    setTimeout(() => {
      const docs = MOCK_DIGILOCKER_DOCS.filter(d => selected.includes(d.id));
      onFetch(docs);
      onClose();
    }, 2000);
  };

  const toggleDoc = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-icon">🔐</div>
          <div>
            <div className="modal-title">DigiLocker</div>
            <div className="modal-sub">{phase === "docs" ? `Select documents for: ${targetLabel}` : "Securely fetch your documents"}</div>
          </div>
        </div>

        {phase === "login" && (
          <>
            <div className="modal-field">
              <label>Aadhaar Number</label>
              <input type="tel" inputMode="numeric" maxLength={12} placeholder="Enter 12-digit Aadhaar" value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} />
            </div>
            {!otpSent ? (
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={sendOtp} disabled={loading}>
                {loading ? <><span className="spinner" /> &nbsp;Sending OTP...</> : "Send OTP →"}
              </button>
            ) : (
              <>
                <div className="modal-field" style={{ marginTop: 12 }}>
                  <label>Enter OTP</label>
                  <input type="tel" inputMode="numeric" maxLength={6} placeholder="6-digit OTP" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} />
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={onClose}>Cancel</button>
                  <button className="btn-primary" onClick={verifyOtp} disabled={loading}>
                    {loading ? <><span className="spinner" /> &nbsp;Verifying...</> : "Verify & Continue →"}
                  </button>
                </div>
              </>
            )}
            <p className="modal-hint">🔒 This is a simulated DigiLocker flow. No real data is accessed.</p>
          </>
        )}

        {phase === "docs" && (
          <>
            <div className="digilocker-docs-list">
              {MOCK_DIGILOCKER_DOCS.map(doc => (
                <div key={doc.id} className={`dl-doc-item ${selected.includes(doc.id) ? "selected" : ""}`} onClick={() => toggleDoc(doc.id)}>
                  <span className="dl-doc-icon">{doc.icon}</span>
                  <div>
                    <div className="dl-doc-name">{doc.name}</div>
                    <div className="dl-doc-meta">{doc.meta}</div>
                  </div>
                  <div className="dl-doc-check">{selected.includes(doc.id) ? "✓" : ""}</div>
                </div>
              ))}
            </div>
            <div className="modal-actions" style={{ marginTop: 18 }}>
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn-primary" onClick={fetchDocs} disabled={!selected.length}>
                Fetch {selected.length > 0 ? `(${selected.length})` : ""} →
              </button>
            </div>
          </>
        )}

        {phase === "fetching" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>📥</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Fetching from DigiLocker…</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>Securely retrieving your documents</div>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const PROC = [

  { icon: "📤", label: "Upload Documents", hint: "Fill form & upload docs" },
  { icon: "🔍", label: "Admin Verification", hint: "Our team checks your docs" },
  { icon: "💳", label: "Secure Payment", hint: "Secure one-time service fee" },
  { icon: "🚚", label: "Delivery Successful", hint: "Certified docs delivered!" },
];

const PROC_FULL = [

  { icon: "📤", label: "Upload Documents", hint: "Submitting digital paperwork", narrative: "Uploading my docs... 📤" },
  { icon: "🔍", label: "Admin Verification", hint: "Team checks for authenticity", narrative: "Admin is reviewing! 🔍" },
  { icon: "💳", label: "Secure Payment", hint: "Processing application fees", narrative: "Paying for service... 💳" },
  { icon: "🚚", label: "Delivery Successful", hint: "Documents delivered safely", narrative: "Successfully Completed! 🎉" },
];

const STEP_COLORS6 = [
  { bg: "#e8f0fe", color: "#2563eb" },
  { bg: "#e8f5e9", color: "#2e7d32" },
  { bg: "#fce4ec", color: "#c2185b" },
  { bg: "#fff3e0", color: "#e65100" },
  { bg: "#e3f2fd", color: "#0277bd" },
  { bg: "#f3e5f5", color: "#6a1b9a" },
];

function RoadmapPanel({ activeStep }) {
  const [loopIndex, setLoopIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoopIndex(prev => (prev + 1) % (PROC_FULL.length + 1));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const isVideoState = (i) => i < loopIndex;
  const isActiveVideo = (i) => i === loopIndex;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariant = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <div className="image-panel" style={{ background: "#ffffff", boxShadow: "inset -1px 0 0 #f1f5f9" }}>
      <div className="image-panel-inner" style={{ padding: "8vh 24px 40px" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="panel-brand">
          <h2 style={{ fontSize: 18, color: "#0f172a", marginBottom: 4 }}>Processing Roadmap</h2>
          <p style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700 }}>Visual Guide • Step-by-Step</p>
        </motion.div>

        <motion.div className="roadmap" variants={container} initial="hidden" animate="show" style={{ marginBottom: 40 }}>
          {PROC_FULL.map((step, i) => {
            const isDone = isVideoState(i);
            const isActive = isActiveVideo(i);
            const col = STEP_COLORS6[i];
            const isLast = i === PROC_FULL.length - 1;

            return (
              <motion.div key={i} className="rm-step" variants={itemVariant}>
                <div className="rm-line-col">
                  <motion.div
                    className="rm-node"
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      borderColor: isActive || isDone ? col.color : "#e2e8f0",
                      background: isActive ? col.bg : isDone ? "#f0f9ff" : "#ffffff",
                      boxShadow: isActive ? `0 0 15px ${col.color}44` : "none"
                    }}
                    transition={{ duration: 0.5 }}
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    <motion.div
                      className="rm-node-num"
                      animate={{ background: isDone ? "#0284c7" : isActive ? col.color : "#94a3b8" }}
                    >
                      {isDone ? "✓" : i + 1}
                    </motion.div>
                    <span style={{ fontSize: 18, filter: !isActive && !isDone ? "grayscale(1) opacity(0.4)" : "none" }}>
                      {step.icon}
                    </span>
                  </motion.div>

                  {!isLast && (
                    <div className="rm-connector" style={{ background: "#f1f5f9", overflow: "visible", width: 2 }}>
                      <motion.div
                        className="rm-connector-fill"
                        animate={{ height: isDone ? "100%" : "0%" }}
                        transition={{ duration: 0.8 }}
                        style={{
                          background: `linear-gradient(to bottom, ${col.color}, ${STEP_COLORS6[i + 1].color})`,
                          width: "100%",
                          position: "absolute",
                          top: 0
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="rm-content" style={{ paddingBottom: isLast ? 0 : "4vh" }}>
                  <motion.div
                    animate={{
                      color: isDone ? "#15803d" : isActive ? col.color : "#94a3b8",
                      opacity: isActive || isDone ? 1 : 0.4,
                      x: isActive ? 4 : 0
                    }}
                    style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }}
                  >
                    {step.label}
                  </motion.div>
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0.4 }}
                    style={{ fontSize: 10, color: "#64748b", lineHeight: 1.4 }}
                  >
                    {step.hint}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="sidebar-security">
          <div className="security-icon">🛡️</div>
          <div className="security-text">
            <h4>Your Data is Secure</h4>
            <p>We use advanced encryption to protect your information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SMALL HELPERS
───────────────────────────────────────── */
const TlItem = ({ icon, bg, title, desc, badge, last }) => (
  <div className="tl-item">
    <div className="tl-left">
      <div className="tl-dot" style={{ background: bg }}>{icon}</div>
      {!last && <div className="tl-line" />}
    </div>
    <div className="tl-content">
      <h4>{title}</h4>
      {desc && <p>{desc}</p>}
      <span className={`tl-badge ${badge}`}>
        {badge === "bdone" ? "Done" : badge === "bprog" ? "In Progress" : "Upcoming"}
      </span>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   UPLOAD BLOCK
───────────────────────────────────────── */
const UpBlock = ({ type, label, options, upProg, upNames, upCompressed, onFile, onDelFile, onDigiLocker, flowType }) => {
  const prog = upProg[type];
  const nm = upNames[type];
  const comprInfo = upCompressed[type];
  const isDigiFlow = flowType === 'digilocker';

  return (
    <div className={`upload-box ${isDigiFlow ? 'digi-mode' : ''}`} style={isDigiFlow ? { borderStyle: 'solid', borderColor: '#e0e7ff', background: '#f5f7ff' } : {}}>
      <div className="upload-lbl">
        {isDigiFlow ? '🔐' : '📎'} {label}
      </div>
      
      {!isDigiFlow && (
        <div className="upload-row">
          <input type="file" accept="application/pdf,image/*" onChange={onFile(type)} />
          <select>{options.map(o => <option key={o}>{o}</option>)}</select>
        </div>
      )}

      {prog > 0 && (
        <div className="prog-wrap">
          <div className="prog-bar">
            <div className={`prog-fill${prog === 100 ? " pdone" : ""}`} style={{ width: `${prog}%` }} />
          </div>
          <div className="prog-text">{prog === 100 ? "✅ Fetched successfully" : isDigiFlow ? `Fetching… ${prog}%` : `Uploading… ${prog}%`}</div>
        </div>
      )}
      
      {nm && <div className="file-nm" style={isDigiFlow ? { color: '#4f46e5', fontWeight: 600 } : {}}>📄 {nm}</div>}
      
      {comprInfo && comprInfo.compressed && !isDigiFlow && (
        <div className="file-compressed">
          🗜 Compressed: {comprInfo.originalKB}KB → {comprInfo.newKB}KB (saved {comprInfo.savedKB}KB)
        </div>
      )}

      <div className="upload-actions">
        {!isDigiFlow && <button className="btn-attach" type="button" onClick={() => alert(`${label} attached!`)}>Attach</button>}
        {nm && <button className="btn-del" type="button" onClick={() => onDelFile(type)}>Delete</button>}
        {onDigiLocker && (
          <button className="btn-digilocker" type="button" onClick={() => onDigiLocker(type, label)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2" /><line x1="12" y1="12" x2="12" y2="16" />
            </svg>
            {isDigiFlow ? 'Fetch from DigiLocker' : 'DigiLocker'}
          </button>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   STEP COMPONENTS
───────────────────────────────────────── */
const Step0 = ({ form, onChange, degrees, addDeg, rmDeg, chDeg, upProg, upNames, upCompressed, onFile, delFile, onDigiLocker, onSubmit, adminMessage }) => (
  <form onSubmit={onSubmit}>
    {adminMessage && (
      <div className="info-panel amber" style={{ marginBottom: 24, border: "2px solid #fbbf24" }}>
        <span className="info-icon">⚠️</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: "#92400e", marginBottom: 4 }}>Action Required / Rejection Message</h3>
          <p style={{ color: "#b45309", fontSize: "14px", fontWeight: 500 }}>{adminMessage}</p>
        </div>
      </div>
    )}

    <div className="step-header">
      <div className="step-icon icon-blue">📄</div>
      <div>
        <div className="step-title">Transcript Application Form</div>
        <div className="step-subtitle">Fill in your details and provide document copies to begin</div>
      </div>
    </div>

    <div className="sec-title">Personal Information</div>
    <div className="form-grid">
      {[
        { id: "fullName", label: "Full Name", type: "text", ph: "e.g. Ravi Kumar", req: true },
        { id: "email", label: "Email Address", type: "email", ph: "email@example.com", req: true },
        { id: "phone", label: "Phone Number", type: "tel", ph: "+91 98765 43210", req: true },
        { id: "altPhone", label: "Alternative Number", type: "tel", ph: "+91 98765 43210", req: true },
      ].map(({ id, label, type, ph, req }) => (
        <div className="field" key={id}>
          <label>{label} {req && <span className="req">*</span>}</label>
          <input
            type={type}
            name={id}
            value={form[id]}
            onChange={onChange}
            placeholder={ph}
            autoComplete="off"
            inputMode={type === "tel" ? "numeric" : undefined}
          />
        </div>
      ))}
      <div className="field">
        <label>Select Requirement <span className="req">*</span></label>
        <select name="requirement" value={form.requirement} onChange={onChange}>
          <option value="">— Choose Service —</option>
          <option value="Transcripts">Transcripts</option>
          <option value="WES">WES</option>
          <option value="Genuineness">Genuineness</option>
        </select>
      </div>
      <div className="field">
        <label>Reference Number</label>
        <input type="text" name="referenceNumber" value={form.referenceNumber} onChange={onChange} placeholder="If you have one" />
      </div>
    </div>

    <div className="sec-title">Academic Degrees (Optional)</div>
    {degrees.length === 0 ? (
      <div className="optional-deg-box" onClick={addDeg}>
        <div className="opt-icon">🎓</div>
        <div className="opt-text">
          <strong>Add Degree Details</strong>
          <span>Click to add your university and course information if applicable</span>
        </div>
        <button type="button" className="btn-add-mini">+ Add</button>
      </div>
    ) : (
      <>
        {degrees.map(d => (
          <div className="degree-card" key={d.id}>
            <div className="deg-header">
              <span className="deg-num">Degree {d.id}</span>
              <button type="button" className="btn-rm" onClick={() => rmDeg(d.id)}>✕ Remove</button>
            </div>
            <div className="form-grid">
              <div className="field">
                <label>Degree Type</label>
                <select value={d.type} onChange={e => chDeg(d.id, "type", e.target.value)}>
                  <option value="">Select Type</option>
                  {["B.Tech", "B.Sc", "B.Com", "M.Tech", "MBA", "Diploma"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>University / Board <span className="req">*</span></label>
                <input type="text" value={d.university} placeholder="e.g. Osmania University" onChange={e => chDeg(d.id, "university", e.target.value)} />
              </div>
              <div className="field">
                <label>Course / Specialization</label>
                <input type="text" value={d.course} placeholder="e.g. Computer Science" onChange={e => chDeg(d.id, "course", e.target.value)} />
              </div>
              <div className="field">
                <label>College / School Name <span className="req">*</span></label>
                <input type="text" value={d.college} placeholder="e.g. JNTU College" onChange={e => chDeg(d.id, "college", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addDeg}>+ Add Another Degree</button>
      </>
    )}

    <div className="sec-title">Upload Documents</div>
    <div className="dual-upload-container">
      {/* LEFT PANEL: MANUAL UPLOAD */}
      <div className="upload-side manual-side">
        <div className="side-title">
          <span>📎</span> Normal Way (Manual Upload)
        </div>
        <div className="side-content">
          <UpBlock type="cmm" label="CMM / Yearly Marks Sheet"
            options={["CMM", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"]}
            upProg={upProg} upNames={upNames} upCompressed={upCompressed}
            onFile={onFile} delFile={delFile} flowType="manual" />
          
          <UpBlock type="degree" label="Degree / Provisional Certificate"
            options={["Degree Certificate", "Provisional Certificate"]}
            upProg={upProg} upNames={upNames} upCompressed={upCompressed}
            onFile={onFile} delFile={delFile} flowType="manual" />
          
          <UpBlock type="internship" label="Internship Certificate"
            options={["Internship Certificate"]}
            upProg={upProg} upNames={upNames} upCompressed={upCompressed}
            onFile={onFile} delFile={delFile} flowType="manual" />
        </div>
      </div>

      {/* RIGHT PANEL: DIGILOCKER */}
      <div className="upload-side digilocker-side">
        <div className="side-title">
          <img src={digilockerLogo} alt="DigiLocker" style={{ height: '24px', width: 'auto' }} /> DigiLocker (Instantly Fetch)
        </div>
        <div className="side-content">
          <div className="info-panel sky" style={{ padding: '24px', textAlign: 'center', background: '#f5f7ff', border: '2px solid #e0e7ff', borderRadius: '18px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <img src={digilockerLogo} alt="DigiLocker" style={{ height: '60px', width: 'auto' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>One-Click Fetch</h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', marginBottom: '20px' }}>
              Securely login to your DigiLocker account to automatically fetch your verified Degree, Marksheets, and other certificates.
            </p>
            
            <button 
              type="button" 
              className="btn-digilocker" 
              style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }} 
              onClick={() => onDigiLocker('all', 'All Documents')}
            >
              <img src={digilockerLogo} alt="" style={{ height: '20px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
              Login & Fetch Documents
            </button>

            {/* Display status if documents are fetched */}
            {(upNames.cmm || upNames.degree || upNames.internship) && (
              <div style={{ marginTop: '20px', textAlign: 'left', background: '#fff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', marginBottom: '8px' }}>Fetched Documents:</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, gap: '6px', display: 'flex', flexDirection: 'column' }}>
                  {upNames.cmm && <li style={{ fontSize: '12px', color: '#1e293b' }}>✅ {upNames.cmm}</li>}
                  {upNames.degree && <li style={{ fontSize: '12px', color: '#1e293b' }}>✅ {upNames.degree}</li>}
                  {upNames.internship && <li style={{ fontSize: '12px', color: '#1e293b' }}>✅ {upNames.internship}</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    <div className="guideline-section">
      <div className="guideline-title">
        <span>📸</span> Important: Photo & Document Guidelines
      </div>
      <div className="guideline-grid">
        <div className="guideline-item">
          <div className="guideline-img-wrap">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" alt="Correct" />
            <div className="guideline-badge badge-ok">Correct</div>
          </div>
          <div className="guideline-label">Clear face, plain background</div>
        </div>
        <div className="guideline-item">
          <div className="guideline-img-wrap">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&blur=10" alt="Blurry" />
            <div className="guideline-badge badge-no">Too Blurry</div>
          </div>
          <div className="guideline-label">Out of focus or dark</div>
        </div>
        <div className="guideline-item">
          <div className="guideline-img-wrap">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&sat=-100" alt="Accessories" />
            <div className="guideline-badge badge-no">Incorrect</div>
          </div>
          <div className="guideline-label">Glasses, hats or busy bg</div>
        </div>
      </div>
    </div>

    <div className="check-list">
      <label className="check-item">
        <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={onChange} />
        <span>I have read and accepted the <strong>Terms &amp; Conditions</strong> of this service</span>
      </label>
      <label className="check-item">
        <input type="checkbox" name="specialCondition" checked={form.specialCondition} onChange={onChange} />
        <span>I confirm that I am not physically challenged / pregnant or under similar special conditions</span>
      </label>
    </div>
    <div className="actions">
      <button type="submit" className="btn-primary">Proceed to Payment &nbsp;→</button>
    </div>
  </form>
);

const Step1 = ({ form, goStep, handlePayment }) => (
  <div>
    <div className="step-header">
      <div className="step-icon icon-amber">💳</div>
      <div>
        <div className="step-title">Secure Payment</div>
        <div className="step-subtitle">Complete your payment to begin document processing</div>
      </div>
    </div>
    <div className="info-panel amber">
      <span className="info-icon">🔒</span>
      <h3>Service Fee</h3>
      <div className="amount">₹ 20</div>
      <p>One-time fee for verification, attestation &amp; processing.<br />100% Secure &bull; Instant confirmation</p>
    </div>
    <div className="timeline">
      <TlItem icon="✅" bg="#e0f2fe" title="Documents Received" desc="All your documents submitted successfully." badge="bdone" />
      <TlItem icon="💳" bg="#fef3c7" title="Payment Required" desc="Complete payment to unlock document review." badge="bprog" />
      <TlItem icon="🔍" bg="#f1f5f9" title="Document Review" desc="Our team verifies your documents (24–48 hrs)." badge="bwait" last />
    </div>
    <div className="actions">
      <button className="btn-secondary" onClick={() => goStep(0)}>← Back</button>
      <button className="btn-primary sky" onClick={handlePayment}>💳 &nbsp;Pay ₹1 Now</button>
    </div>
  </div>
);

const Step2 = ({ appStatus, adminMessage, goStep, onRetry }) => {
  const isPending = appStatus === "pending";
  const isApproved = appStatus === "approved";
  const isRejected = appStatus === "rejected";

  return (
    <div>
      <div className="step-header">
        <div className={`step-icon ${isRejected ? "icon-amber" : "icon-blue"}`}>
          {isRejected ? "❌" : isApproved ? "✅" : "🔍"}
        </div>
        <div>
          <div className="step-title">
            {isRejected ? "Action Required" : isApproved ? "Documents Verified" : "Document Review"}
          </div>
          <div className="step-subtitle">
            {isRejected ? "Some issues were found with your submission" : isApproved ? "Your documents have been approved! Please proceed to payment" : "Our experts are carefully verifying your documents"}
          </div>
        </div>
      </div>

      {isPending && (
        <div className="info-panel blue">
          <span className="info-icon">⏳</span>
          <h3>Review in Progress</h3>
          <p>Your documents are being checked for authenticity &amp; completeness.<br /><strong>Estimated: 24–48 business hours</strong></p>
        </div>
      )}

      {isApproved && (
        <div className="info-panel sky">
          <span className="info-icon">✅</span>
          <h3>Verification Successful</h3>
          <p>All documents are clear and verified. You can now proceed to make the payment to start processing.</p>
        </div>
      )}

      {isRejected && (
        <div className="info-panel amber">
          <span className="info-icon">⚠️</span>
          <h3>Issue Detected</h3>
          <div style={{ background: "rgba(255,255,255,0.6)", padding: "12px", borderRadius: "10px", margin: "10px 0", border: "1px solid #fde68a" }}>
            <p style={{ fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Message from Admin:</p>
            <p style={{ color: "#b45309", fontSize: "14px" }}>{adminMessage || "Please check your documents and retry."}</p>
          </div>
          <p>Please click retry to go back to the form and fix the issues.</p>
        </div>
      )}

      <div className="timeline">
        <TlItem icon="✅" bg="#e0f2fe" title="Documents Submitted" desc="All documents received." badge="bdone" />
        <TlItem
          icon={isApproved ? "✅" : "🔍"}
          bg={isApproved ? "#e0f2fe" : isRejected ? "#fee2e2" : "#dbeafe"}
          title="Document Review"
          desc={isRejected ? "Issues found by admin." : isApproved ? "Verification cleared!" : "Experts checking authenticity."}
          badge={isApproved ? "bdone" : isRejected ? "bwait" : "bprog"}
        />
        <TlItem icon="💳" bg="#f1f5f9" title="Secure Payment" desc="Proceed to payment after review." badge="bwait" />
        <TlItem icon="🏛️" bg="#f1f5f9" title="University Verification" desc="Sent to university after payment." badge="bwait" last />
      </div>

      <div className="actions">
        {isRejected && (
          <button className="btn-primary" onClick={onRetry}>
            🔄 &nbsp;Retry Submission
          </button>
        )}
        {isApproved && (
          <button className="btn-primary sky" onClick={() => goStep(2)}>
            💳 &nbsp;Proceed to Payment
          </button>
        )}
        {isPending && (
          <button className="btn-secondary" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
            ⏳ &nbsp;Waiting for Admin...
          </button>
        )}
      </div>
    </div>
  );
};

const Step3 = ({ reset, handleRefund }) => (
  <div>
    <div className="step-header">
      <div className="step-icon icon-purple">🏛️</div>
      <div>
        <div className="step-title">University / Board Verification</div>
        <div className="step-subtitle">Documents sent to the official authority</div>
      </div>
    </div>
    <div className="info-panel indigo">
      <span className="info-icon">🏛️</span>
      <h3>Sent to University / Board</h3>
      <p>Your documents have been forwarded to the respective authority.<br /><strong>Estimated: 3–7 working days</strong></p>
    </div>
    <div className="timeline">
      <TlItem icon="✅" bg="#e0f2fe" title="Documents Submitted" badge="bdone" />
      <TlItem icon="✅" bg="#e0f2fe" title="Payment Confirmed" badge="bdone" />
      <TlItem icon="✅" bg="#e0f2fe" title="Document Review Cleared" badge="bdone" />
      <TlItem icon="🏛️" bg="#e0e7ff" title="University Verification — Active" desc="Official authority is processing your request." badge="bprog" />
      <TlItem icon="🚀" bg="#f1f5f9" title="Final Delivery" desc="Digital & physical copies delivered." badge="bwait" last />
    </div>
    <div className="actions">
      <button className="btn-primary" onClick={reset}>+ Start New Request</button>
      <button
        className="btn-secondary"
        style={{
          marginLeft: "10px",
          backgroundColor: "#ef4444",
          color: "#fff"
        }}
        onClick={handleRefund}
      >
        💸 Refund Payment
      </button>
    </div>
  </div>
);

const Step4 = ({ form, reset }) => (
  <div className="success-wrap">
    <div className="step-header">
      <div className="step-icon icon-sky">🚀</div>
      <div>
        <div className="step-title">All Done! Delivery Complete</div>
        <div className="step-subtitle">Your verified documents are ready</div>
      </div>
    </div>
    <div className="info-panel sky" style={{ padding: 36 }}>
      <span className="star-burst">🎉</span>
      <h3 style={{ fontSize: 22, color: "#166534" }}>Congratulations!</h3>
      <p style={{ fontSize: 14, marginTop: 8 }}>Your documents have been successfully verified and delivered.</p>
      {form.email && <div className="info-chip">📧 Sent to: <strong>{form.email}</strong></div>}
      {form.referenceNumber && <div className="info-chip" style={{ marginLeft: 8 }}>🔖 Ref: <strong>{form.referenceNumber}</strong></div>}
    </div>
    <div className="timeline">
      <TlItem icon="✅" bg="#e0f2fe" title="Documents Submitted" badge="bdone" />
      <TlItem icon="✅" bg="#e0f2fe" title="Payment Confirmed" badge="bdone" />
      <TlItem icon="✅" bg="#e0f2fe" title="Document Review Cleared" badge="bdone" />
      <TlItem icon="✅" bg="#e0f2fe" title="University Verified" badge="bdone" />
      <TlItem icon="🚀" bg="#e0f2fe" title="Delivered!" badge="bdone" last />
    </div>
    <div className="actions">
      <button className="btn-primary" onClick={reset}>+ Start New Request</button>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Apply() {
  const navigate = useNavigate();
  const location = useLocation();
  const [flowType, setFlowType] = useState('manual'); // Default to manual
  const [activeStep, setActiveStep] = useState(0);
  const [trackId, setTrackId] = useState("");
  const [animKey, setAnimKey] = useState(0);

  const [applicationId, setApplicationId] = useState(() => localStorage.getItem("applicationId") || null);
  const [appStatus, setAppStatus] = useState("pending");
  const [adminMessage, setAdminMessage] = useState("");

  const [form, setForm] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userData = user?.data || {};
    return {
      fullName: userData.name || "",
      altPhone: "",
      email: userData.email || "",
      phone: "",
      requirement: "",
      referenceNumber: "",
      termsAccepted: false,
      specialCondition: false,
    };
  });

  const [upProg, setUpProg] = useState({ cmm: 0, degree: 0, internship: 0 });
  const [upNames, setUpNames] = useState({ cmm: null, degree: null, internship: null });
  const [upCompressed, setUpCompressed] = useState({ cmm: null, degree: null, internship: null });
  const [degrees, setDegrees] = useState([]);

  const [digiModal, setDigiModal] = useState({ open: false, type: null, label: "" });

  // ✅ Handle University Autofill from Search
  useEffect(() => {
    if (location.state?.university) {
      // We no longer set flowType here so the SelectionPanel opens
      setDegrees([
        {
          id: 1,
          type: "",
          university: location.state.university,
          course: "",
          college: "",
        },
      ]);
    }
  }, [location.state]);

  useEffect(() => {
    if (!document.getElementById("apply-css")) {
      const s = document.createElement("style");
      s.id = "apply-css";
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);

  // ✅ Dynamic API Base
  const API_BASE = `http://${window.location.hostname}:8000`;

  const goStep = useCallback((n) => {
    setActiveStep(n);
    setAnimKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 🔄 Restore state on refresh
  useEffect(() => {
    const restoreState = async () => {
      const storedId = localStorage.getItem("applicationId");
      const storedFlow = localStorage.getItem("flowType");
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user?.data?.email;

      if (storedFlow) setFlowType(storedFlow);

      let fetchUrl = "";
      if (storedId) {
        fetchUrl = `${API_BASE}/api/application/${storedId}/status/`;
      } else if (userEmail) {
        fetchUrl = `${API_BASE}/api/application-status/?email=${userEmail}`;
      }

      if (fetchUrl) {
        try {
          const res = await fetch(fetchUrl);
          const data = await res.json();
          if (data.status) {
            setAppStatus(data.status);
            setAdminMessage(data.admin_message || "");
            if (data.application_id) {
              setApplicationId(data.application_id);
              localStorage.setItem("applicationId", data.application_id);
            }
            if (data.flow_type) {
              setFlowType(data.flow_type);
              localStorage.setItem("flowType", data.flow_type);
            }

            // Map status to step
            if (data.status === "approved") {
              if (data.payment_status === "Paid") goStep(3);
              else goStep(2);
            } else if (data.status === "pending") {
              goStep(1);
            } else if (data.status === "rejected") {
              goStep(0); // Go to form to show rejection message
            } else if (data.status === "delivered") {
              goStep(4);
            }
          }
        } catch (err) {
          // Restore state error handled silently
        }
      }
    };
    restoreState();
  }, [goStep, API_BASE]);

  // 🔄 Status Polling while in Waiting Screen (activeStep 1)
  useEffect(() => {
    let interval;
    if (activeStep === 1 && applicationId) {
      const checkStatus = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/application/${applicationId}/status/`);
          const data = await res.json();
          if (data.status) {
            setAppStatus(data.status);
            setAdminMessage(data.admin_message || "");
            if (data.status === "approved") {
              // keep step 1, but Step2 will show proceed to payment
            } else if (data.status === "delivered") {
              goStep(4);
            }
          }
        } catch (err) {
          // Polling error handled silently
        }
      };

      checkStatus(); // Initial check
      interval = setInterval(checkStatus, 5000); // Check every 5 seconds
    }
    return () => clearInterval(interval);
  }, [activeStep, applicationId, API_BASE, goStep]);

  const onChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const addDeg = useCallback(() => {
    const id = Math.max(0, ...degrees.map(d => d.id)) + 1;
    setDegrees(ds => [...ds, { id, type: "", university: "", course: "", college: "" }]);
  }, [degrees]);

  const rmDeg = useCallback((id) => {
    setDegrees(ds => ds.filter(d => d.id !== id));
  }, []);

  const chDeg = useCallback((id, field, val) => {
    setDegrees(ds => ds.map(d => d.id === id ? { ...d, [field]: val } : d));
  }, []);

  const onFile = useCallback((type) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUpNames(p => ({ ...p, [type]: file.name }));
    setUpProg(p => ({ ...p, [type]: 5 }));
    const result = await compressImage(file);
    setUpCompressed(p => ({ ...p, [type]: result }));
    let v = 10;
    const t = setInterval(() => {
      v += Math.random() * 15 + 8;
      if (v >= 100) { v = 100; clearInterval(t); }
      setUpProg(p => ({ ...p, [type]: Math.round(v) }));
    }, 110);
  }, []);

  const delFile = useCallback((type) => {
    setUpProg(p => ({ ...p, [type]: 0 }));
    setUpNames(p => ({ ...p, [type]: null }));
    setUpCompressed(p => ({ ...p, [type]: null }));
  }, []);

  const openDigiLocker = useCallback((type, label) => {
    setDigiModal({ open: true, type, label });
  }, []);

  const handleDigiLockerFetch = useCallback((docs) => {
    const { type } = digiModal;
    if (!type || !docs.length) return;
    
    if (type === 'all') {
      // Map docs to available types
      const mapping = {
        degree: 'degree',
        marksheet: 'cmm',
        provisional: 'degree',
        migration: 'internship' // Just as a fallback for demo
      };
      
      docs.forEach(doc => {
        const targetType = mapping[doc.id];
        if (targetType) {
          setUpNames(p => ({ ...p, [targetType]: `[DigiLocker] ${doc.name}` }));
          setUpProg(p => ({ ...p, [targetType]: 100 }));
          setUpCompressed(p => ({ ...p, [targetType]: { compressed: false } }));
        }
      });
    } else {
      const docName = docs.map(d => d.name).join(", ");
      setUpNames(p => ({ ...p, [type]: `[DigiLocker] ${docName}` }));
      setUpProg(p => ({ ...p, [type]: 100 }));
      setUpCompressed(p => ({ ...p, [type]: { compressed: false } }));
    }
  }, [digiModal]);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackId.trim()) { alert("Please enter a tracking ID"); return; }
    alert(`Searching for Application ID: ${trackId}\n\n[Demo Mode]: Current status is "Processing at University"`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.altPhone || !form.requirement || !form.termsAccepted) {
      alert("Please fill all required fields (*) and accept Terms");
      return;
    }

    const trackingId = "TRK" + Date.now().toString().slice(-6);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      formData.append("trackingId", trackingId);
      formData.append("degrees", JSON.stringify(degrees));
      formData.append("flowType", flowType); // Save flowType with submission

      Object.keys(upCompressed).forEach(type => {
        const fileData = upCompressed[type];
        if (fileData?.file) formData.append(type, fileData.file);
      });

      const res = await fetch(`${API_BASE}/api/submit/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Application Submitted ✅\nAdmin will now verify your documents.`);
        setApplicationId(data.application_id);
        setAppStatus("pending");
        setAdminMessage("");
        localStorage.setItem("applicationId", data.application_id);
        localStorage.setItem("flowType", flowType); // Persist flowType locally
        goStep(1);
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (err) {
      // Frontend error handled silently
      alert("Something went wrong");
    }
  };

  const handleRefund = async () => {
    const confirmRefund = window.confirm("Are you sure you want to refund?");
    if (!confirmRefund) return;

    try {
      const res = await fetch(`http://${window.location.hostname}:8000/api/refund/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application_id: applicationId
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Refund Successful ✅\nRefund ID: ${data.refund_id}`);
      } else {
        alert(data.error || "Refund Failed ❌");
      }

    } catch (err) {
      console.error("Refund Error:", err);
      alert("Refund error ❌");
    }
  };

  const handlePayment = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/create-order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 20, // ₹1
          application_id: applicationId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Failed to create order");
        return;
      }

      const data = await res.json();

      const options = {
        key: "rzp_test_Sg6qpBoNrt75cC",
        amount: data.amount,
        currency: "INR",
        order_id: data.order_id,

        name: "100 Transcripts",
        description: "Document Verification Fee",

        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/verifys/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                application_id: applicationId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.status === "success") {
              alert("Payment Successful ✅");
              goStep(3);
            } else {
              alert("Payment Failed ❌");
            }
          } catch (err) {
            alert("Verification error ❌");
          }
        },

        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },

        theme: {
          color: "#2563eb",
        },

        // ✅ FORCE UPI ONLY (Scanner works perfectly)
        method: {
          upi: true,
          card: true,
          netbanking: false,
          wallet: false,
        },

        // ✅ Opens QR / UPI apps directly
        modal: {
            ondismiss: function () {
              // Payment popup closed
            },
          },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment error ❌");
    }
  };

  const reset = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userData = user?.data || {};
    setForm({
      fullName: userData.name || "",
      altPhone: "",
      email: userData.email || "",
      phone: "",
      requirement: "",
      referenceNumber: "",
      termsAccepted: false,
      specialCondition: false
    });
    setDegrees([]);
    setUpProg({ cmm: 0, degree: 0, internship: 0 });
    setUpNames({ cmm: null, degree: null, internship: null });
    setUpCompressed({ cmm: null, degree: null, internship: null });
    setApplicationId(null);
    setAppStatus("pending");
    setAdminMessage("");
    setFlowType(null);
    localStorage.removeItem("applicationId");
    localStorage.removeItem("flowType");
    goStep(0);
  };

  const fillPct = Math.round(((activeStep + 1) / (PROC.length)) * 100);

  return (
    <>
      {digiModal.open && (
        <DigiLockerModal
          targetLabel={digiModal.label}
          onClose={() => setDigiModal({ open: false, type: null, label: "" })}
          onFetch={handleDigiLockerFetch}
        />
      )}

      <div className="app-shell">
        <RoadmapPanel activeStep={activeStep} />

        <div className="portal-panel">
          <div className="portal-wrap">
            <div className="process-section">
              <div className="flow-track">
                <div className="flow-fill" style={{ width: `${Math.min(fillPct, 100)}%` }} />
              </div>
              <div className="proc-ribbon">
                {PROC.map((p, i) => {
                  const stepMap = [0, 1, 1, 3, 4]; // activeStep 0->0, 1->1, 2->1, 3->3, 4->4
                  const mappedStep = stepMap[activeStep];
                  const isDone = i < mappedStep || (activeStep === 2 && i <= 1);
                  const isActive = i === mappedStep || (activeStep === 2 && i === 3);
                  // Correction for UI flow
                  const uiStep = activeStep === 2 ? 3 : activeStep === 3 ? 4 : activeStep === 4 ? 5 : activeStep;
                  const iDone = i < uiStep;
                  const iActive = i === uiStep;

                  return (
                    <div key={i} className={`proc-cell ${iDone ? "pc-done" : ""} ${iActive ? "pc-active" : ""}`}>
                      <div className="proc-orb">{p.icon}</div>
                      <div className="proc-name">{p.label}</div>
                      <div className="proc-hint">{p.hint}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="main-card card-anim" key={animKey}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep + (flowType || "")}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {activeStep === 0 && (
                    <Step0
                      form={form} onChange={onChange}
                      degrees={degrees} addDeg={addDeg} rmDeg={rmDeg} chDeg={chDeg}
                      upProg={upProg} upNames={upNames} upCompressed={upCompressed}
                      onFile={onFile} delFile={delFile}
                      onDigiLocker={openDigiLocker}
                      onSubmit={onSubmit}
                      adminMessage={adminMessage}
                    />
                  )}
                  {activeStep === 1 && (
                    <Step2
                      appStatus={appStatus}
                      adminMessage={adminMessage}
                      goStep={goStep}
                      onRetry={() => goStep(0)}
                    />
                  )}
                  {activeStep === 2 && (
                    <Step1
                      form={form}
                      goStep={() => goStep(1)}
                      handlePayment={handlePayment}
                    />
                  )}
                  {activeStep === 3 && <Step3 reset={reset} handleRefund={handleRefund} />}
                  {activeStep === 4 && <Step4 form={form} reset={reset} />}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="hero-header" style={{ animationDelay: '0.4s', marginTop: 40, marginBottom: 12 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Already Applied? <em>Check Status</em></h2>
              <p>Enter your unique tracking ID to see your processing progress</p>
            </div>

            <form className="track-bar" onSubmit={handleTrack} style={{ marginTop: 20 }}>
              <input
                type="text"
                className="track-input"
                placeholder="Enter Tracking ID (e.g. TRK123456)"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
              />
              <button type="submit" className="track-btn">Track Status</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
