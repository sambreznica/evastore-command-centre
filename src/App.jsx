import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Area, AreaChart, PieChart, Pie
} from "recharts";
import {
  AlertTriangle, CheckCircle, Clock, Mail, TrendingUp, Zap, Bell,
  Filter, ChevronDown, ChevronRight, ExternalLink, Target, Shield,
  Inbox, AlertCircle, Timer, BarChart3, Settings, Activity, Search,
  ArrowRight, Radio, Send, Eye, EyeOff, RefreshCw, Layers, GitBranch
} from "lucide-react";

// ═══ LIVE DATA — Updated from Evastore Triage sheet (12 Feb 2026) ═══
const TRIAGE_DATA = [
  { id: "19c4c57e", date: "2026-02-11T10:55:49Z", subject: "Post", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "post_dispatch", label: "📦 Post / Dispatch", priority: "P1", urgency: "high", type: "Action", status: "OPEN", replyDate: null, bizHours: null, slaDeadline: "2026-02-12T10:55:00Z", escalation: "DM" },
  { id: "19c42d00", date: "2026-02-09T14:30:43Z", subject: "Post 05/02/2026", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "post_dispatch", label: "📦 Post / Dispatch", priority: "P1", urgency: "high", type: "Action", status: "REPLIED ✓", replyDate: "2026-02-10T09:42:54Z", bizHours: 3.2, slaDeadline: "2026-02-10T14:30:00Z", escalation: "" },
  { id: "19c41de6", date: "2026-02-09T10:06:37Z", subject: "Will box", from: "Gary Tait", email: "gary@evastore.co.uk", category: "will_storage", label: "🗄️ Will Storage", priority: "P1", urgency: "high", type: "Action", status: "REPLIED ✓", replyDate: "2026-02-10T09:49:30Z", bizHours: 7.71, slaDeadline: "2026-02-10T10:06:00Z", escalation: "" },
  { id: "19c42c02", date: "2026-02-09T14:13:22Z", subject: "Login to Hubspot", from: "Gary Tait", email: "gary@evastore.co.uk", category: "hubspot_process", label: "⚙️ HubSpot / Access", priority: "P2", urgency: "medium", type: "Action", status: "SLA BREACHED", replyDate: null, bizHours: null, slaDeadline: "2026-02-10T14:13:00Z", escalation: "BREACH" },
  { id: "19c33edf", date: "2026-02-06T17:09:11Z", subject: "Weekly Round up w/c 02/02/2026", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "weekly_roundup", label: "📊 Weekly Roundup", priority: "P3", urgency: "low", type: "FYI", status: "AUTO-ACKED ✓", replyDate: "2026-02-11T16:54:01Z", bizHours: 0, slaDeadline: "2026-02-09T17:00:00Z", escalation: "" },
  { id: "19c2ec52", date: "2026-02-05T17:06:31Z", subject: "WSL documents", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "wsl_documents", label: "📄 WSL Documents", priority: "P1", urgency: "high", type: "Action", status: "REPLIED ✓", replyDate: "2026-02-06T16:49:56Z", bizHours: 7.83, slaDeadline: "2026-02-06T17:06:00Z", escalation: "BREACH" },
  { id: "19c2d685", date: "2026-02-05T10:45:31Z", subject: "FW: post 05/02/2026", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "post_dispatch", label: "📦 Post / Dispatch", priority: "P1", urgency: "high", type: "Action", status: "REPLIED ✓", replyDate: "2026-02-10T09:51:31Z", bizHours: 23.1, slaDeadline: "2026-02-06T10:45:00Z", escalation: "BREACH" },
  { id: "19c2d66a", date: "2026-02-05T10:43:46Z", subject: "(No subject)", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "general", label: "📧 General", priority: "P2", urgency: "medium", type: "Action", status: "SLA BREACHED", replyDate: null, bizHours: null, slaDeadline: "2026-02-06T10:43:00Z", escalation: "BREACH" },
  { id: "19c2d65c", date: "2026-02-05T10:42:41Z", subject: "Post 05/02/2026", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "post_dispatch", label: "📦 Post / Dispatch", priority: "P1", urgency: "high", type: "Action", status: "REPLIED ✓", replyDate: "2026-02-10T09:50:32Z", bizHours: 23.13, slaDeadline: "2026-02-06T10:42:00Z", escalation: "BREACH" },
  { id: "19c1ddaa", date: "2026-02-02T10:16:31Z", subject: "Accepted invitation", from: "Gary Tait", email: "gary@evastore.co.uk", category: "hubspot_process", label: "⚙️ HubSpot / Access", priority: "P2", urgency: "medium", type: "Action", status: "SLA BREACHED", replyDate: null, bizHours: null, slaDeadline: "2026-02-03T10:16:00Z", escalation: "BREACH" },
  { id: "19c1d935", date: "2026-02-02T08:58:35Z", subject: "Accepted invitation", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "hubspot_process", label: "⚙️ HubSpot / Access", priority: "P2", urgency: "medium", type: "Action", status: "SLA BREACHED", replyDate: null, bizHours: null, slaDeadline: "2026-02-02T16:58:00Z", escalation: "BREACH" },
  { id: "19c0fcab", date: "2026-01-30T16:44:26Z", subject: "Accepted invitation", from: "Gary Tait", email: "gary@evastore.co.uk", category: "hubspot_process", label: "⚙️ HubSpot / Access", priority: "P2", urgency: "medium", type: "Action", status: "SLA BREACHED", replyDate: null, bizHours: null, slaDeadline: "2026-02-02T16:44:00Z", escalation: "BREACH" },
  { id: "19c0fb02", date: "2026-01-30T16:15:21Z", subject: "Weekly Round up w/c 26/01/2026", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "weekly_roundup", label: "📊 Weekly Roundup", priority: "P3", urgency: "low", type: "FYI", status: "AUTO-ACKED ✓", replyDate: "2026-02-11T16:54:11Z", bizHours: 0, slaDeadline: "2026-02-02T16:15:00Z", escalation: "" },
  { id: "19c0f634", date: "2026-01-30T14:51:24Z", subject: "post", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "post_dispatch", label: "📦 Post / Dispatch", priority: "P1", urgency: "high", type: "Action", status: "REPLIED ✓", replyDate: "2026-01-30T14:55:00Z", bizHours: 0.07, slaDeadline: "2026-02-02T14:51:00Z", escalation: "" },
  { id: "19c09fab", date: "2026-01-29T13:39:06Z", subject: "Marking Copied wills", from: "Gary Tait", email: "gary@evastore.co.uk", category: "will_marking", label: "✅ Will Marking", priority: "P2", urgency: "medium", type: "Action", status: "SLA BREACHED", replyDate: null, bizHours: null, slaDeadline: "2026-01-30T13:39:00Z", escalation: "BREACH" },
  { id: "19c04aad", date: "2026-01-28T12:53:45Z", subject: "FW: Response reference the HubSpot process", from: "Gary Tait", email: "gary@evastore.co.uk", category: "hubspot_process", label: "⚙️ HubSpot / Access", priority: "P2", urgency: "medium", type: "Action", status: "REPLIED ✓", replyDate: "2026-01-28T16:39:07Z", bizHours: 3.76, slaDeadline: "2026-01-29T12:53:00Z", escalation: "" },
  { id: "19bfb0d6", date: "2026-01-26T16:05:01Z", subject: "Call Back", from: "Gary Tait", email: "gary@evastore.co.uk", category: "general", label: "📧 General", priority: "P2", urgency: "medium", type: "Action", status: "REPLIED ✓", replyDate: "2026-01-26T16:22:00Z", bizHours: 0.27, slaDeadline: "2026-01-27T16:05:00Z", escalation: "" },
  { id: "19bfa233", date: "2026-01-26T11:49:28Z", subject: "Automated message", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "general", label: "📧 General", priority: "P2", urgency: "medium", type: "Action", status: "SLA BREACHED", replyDate: null, bizHours: null, slaDeadline: "2026-01-27T11:49:00Z", escalation: "BREACH" },
  { id: "19bebd93", date: "2026-01-23T17:13:50Z", subject: "Weekly Round up w/c19/01/2026", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "weekly_roundup", label: "📊 Weekly Roundup", priority: "P3", urgency: "low", type: "FYI", status: "AUTO-ACKED ✓", replyDate: "2026-02-11T16:54:19Z", bizHours: 0, slaDeadline: "2026-01-26T17:13:00Z", escalation: "" },
  { id: "19bead15", date: "2026-01-23T12:25:36Z", subject: "Testator Address", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "testator_query", label: "👤 Testator Query", priority: "P1", urgency: "high", type: "Action", status: "REPLIED ✓", replyDate: "2026-01-23T13:28:07Z", bizHours: 1.04, slaDeadline: "2026-01-24T12:25:00Z", escalation: "" },
  { id: "19be54fd", date: "2026-01-22T10:46:04Z", subject: "Post 22/01/2026", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "post_dispatch", label: "📦 Post / Dispatch", priority: "P1", urgency: "high", type: "Action", status: "REPLIED ✓", replyDate: "2026-01-22T10:51:00Z", bizHours: 0.08, slaDeadline: "2026-01-23T10:46:00Z", escalation: "" },
  { id: "19bbcc7a", date: "2026-01-14T13:52:37Z", subject: "Accepted invitation", from: "Gary Tait", email: "gary@evastore.co.uk", category: "hubspot_process", label: "⚙️ HubSpot / Access", priority: "P2", urgency: "medium", type: "Action", status: "SLA BREACHED", replyDate: null, bizHours: null, slaDeadline: "2026-01-15T13:52:00Z", escalation: "BREACH" },
  { id: "19bb7fb7", date: "2026-01-13T15:31:01Z", subject: "RE: Post", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "post_dispatch", label: "📦 Post / Dispatch", priority: "P1", urgency: "high", type: "Action", status: "REPLIED ✓", replyDate: "2026-01-13T17:00:00Z", bizHours: 1.48, slaDeadline: "2026-01-14T15:31:00Z", escalation: "" },
  { id: "19bb7f5c", date: "2026-01-13T15:24:49Z", subject: "Post 16/01/2026", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "post_dispatch", label: "📦 Post / Dispatch", priority: "P1", urgency: "high", type: "Action", status: "SLA BREACHED", replyDate: null, bizHours: null, slaDeadline: "2026-01-14T15:24:00Z", escalation: "BREACH" },
  { id: "19b8dff2", date: "2026-01-05T11:51:00Z", subject: "OLW post", from: "Rebecca Wallace", email: "rebecca@evastore.co.uk", category: "post_dispatch", label: "📦 Post / Dispatch", priority: "P1", urgency: "high", type: "Action", status: "REPLIED ✓", replyDate: "2026-01-13T09:00:00Z", bizHours: 45.77, slaDeadline: "2026-01-06T11:51:00Z", escalation: "BREACH" },
];

// Computed monthly metrics
function computeMetrics(data, monthPrefix) {
  const threads = data.filter(t => t.date.startsWith(monthPrefix));
  const actionThreads = threads.filter(t => t.type === "Action");
  const replied = actionThreads.filter(t => t.status === "REPLIED ✓" || t.status === "REPLIED (LATE)");
  const withinSla = replied.filter(t => t.bizHours !== null && t.bizHours <= 8);
  const autoAcked = threads.filter(t => t.status === "AUTO-ACKED ✓");
  const breached = actionThreads.filter(t => t.status === "SLA BREACHED");
  const open = threads.filter(t => t.status === "OPEN");
  const allReplied = replied.filter(t => t.bizHours !== null);
  const avgHours = allReplied.length > 0 ? allReplied.reduce((s, t) => s + t.bizHours, 0) / allReplied.length : 0;
  const sortedHours = allReplied.map(t => t.bizHours).sort((a, b) => a - b);
  const p90 = sortedHours.length > 0 ? sortedHours[Math.floor(sortedHours.length * 0.9)] : 0;
  const slaRate = actionThreads.length > 0 ? Math.round((withinSla.length / actionThreads.length) * 100) : 100;

  return {
    total: threads.length, actionCount: actionThreads.length, replied: replied.length,
    withinSla: withinSla.length, autoAcked: autoAcked.length, breached: breached.length,
    open: open.length, avgHours: Math.round(avgHours * 100) / 100,
    p90: Math.round(p90 * 100) / 100, slaRate,
  };
}

const FEB = computeMetrics(TRIAGE_DATA, "2026-02");
const JAN = computeMetrics(TRIAGE_DATA, "2026-01");

// ═══ FORMATTING HELPERS ═══
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "< 1h ago";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ═══ COMPONENTS ═══

function StatusChip({ status }) {
  const configs = {
    "OPEN": { bg: "bg-amber-400/15", text: "text-amber-300", border: "border-amber-400/30", icon: Clock },
    "REPLIED ✓": { bg: "bg-emerald-400/15", text: "text-emerald-300", border: "border-emerald-400/30", icon: CheckCircle },
    "AUTO-ACKED ✓": { bg: "bg-sky-400/15", text: "text-sky-300", border: "border-sky-400/30", icon: RefreshCw },
    "SLA BREACHED": { bg: "bg-red-400/15", text: "text-red-300", border: "border-red-400/30", icon: AlertTriangle },
    "REPLIED (LATE)": { bg: "bg-orange-400/15", text: "text-orange-300", border: "border-orange-400/30", icon: AlertCircle },
  };
  const c = configs[status] || configs["OPEN"];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${c.bg} ${c.text} ${c.border}`}>
      <Icon size={10} /> {status}
    </span>
  );
}

function PriorityDot({ priority }) {
  const colors = { P1: "bg-red-400", P2: "bg-amber-400", P3: "bg-emerald-400" };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[priority] || "bg-zinc-500"}`} />;
}

function SLAGauge({ percent, size = 160 }) {
  const radius = 58;
  const circ = 2 * Math.PI * radius;
  const progress = (percent / 100) * circ;
  const color = percent >= 90 ? "#34d399" : percent >= 70 ? "#fbbf24" : "#f87171";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 130 130" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#1e1e24" strokeWidth="10" />
        <circle cx="65" cy="65" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={circ - progress} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }} />
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#f8717140" strokeWidth="1"
          strokeDasharray={`${(90 / 100) * circ} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black tabular-nums" style={{ color, fontFamily: "'Space Mono', monospace" }}>{percent}</span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 mt-0.5">% SLA</span>
      </div>
    </div>
  );
}

function MetricTile({ icon: Icon, label, value, sub, color = "#a1a1aa" }) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 hover:border-zinc-700/80 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} style={{ color }} />
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
      </div>
      <div className="text-2xl font-black tabular-nums text-zinc-100" style={{ fontFamily: "'Space Mono', monospace" }}>{value}</div>
      {sub && <div className="text-[11px] text-zinc-500 mt-1">{sub}</div>}
    </div>
  );
}

function TriageRow({ thread, expanded, onToggle }) {
  const isOpen = thread.status === "OPEN";
  const isBreached = thread.status === "SLA BREACHED";
  const borderColor = isOpen ? "border-amber-500/30" : isBreached ? "border-red-500/20" : "border-zinc-800/60";
  const bgColor = isOpen ? "bg-amber-500/[0.03]" : isBreached ? "bg-red-500/[0.02]" : "bg-zinc-900/30";

  const actions = {
    post_dispatch: ["Confirm receipt of will/documents", "Update HubSpot deal stage", "Cross-reference membership number", "Notify fulfilment team"],
    will_storage: ["Cross-reference membership number on will cover", "Verify storage in HubSpot", "Update Beacon pipeline if needed", "Respond confirming status"],
    wsl_documents: ["Review for compliance requirements", "Verify against HubSpot records", "Flag discrepancies", "Respond with confirmation"],
    testator_query: ["Look up testator in HubSpot", "Verify address/contact details", "Respond with confirmed info", "Update HubSpot if corrections needed"],
    hubspot_process: ["Assess if Hayden (technical) or Jan (admin) needed", "Coordinate provisioning if access request", "Document answer + respond"],
    will_marking: ["Verify marking status in HubSpot/Arken", "Cross-reference with Evastore", "Confirm completion"],
    weekly_roundup: ["Review for discrepancies", "Flag issues that need follow-up", "Auto-acknowledged — only escalate if issues found"],
    general: ["Triage and categorise", "Determine required response", "Reply within SLA"],
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${borderColor} ${bgColor}`}>
      <button onClick={onToggle} className="w-full text-left p-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
        <span className="text-base flex-shrink-0">{thread.label.split(" ")[0]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <PriorityDot priority={thread.priority} />
            <span className="text-[13px] font-semibold text-zinc-200 truncate">{thread.subject || "(No subject)"}</span>
            <StatusChip status={thread.status} />
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
            <span>{thread.from}</span>
            <span>·</span>
            <span>{formatDate(thread.date)}</span>
            {thread.bizHours !== null && thread.bizHours > 0 && (
              <>
                <span>·</span>
                <span className={`font-mono font-bold ${thread.bizHours <= 8 ? "text-emerald-400" : "text-red-400"}`}>
                  {thread.bizHours}h
                </span>
              </>
            )}
            {isOpen && <span className="text-amber-400 font-medium animate-pulse">⏱ {timeAgo(thread.date)}</span>}
          </div>
        </div>
        {expanded ? <ChevronDown size={14} className="text-zinc-600" /> : <ChevronRight size={14} className="text-zinc-600" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800/40">
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: "Category", v: thread.label },
              { l: "Priority", v: `${thread.priority} — ${thread.urgency}` },
              { l: "SLA Deadline", v: formatDate(thread.slaDeadline) },
              { l: "Response Time", v: thread.bizHours !== null ? `${thread.bizHours}h` : "Pending" },
            ].map((item, i) => (
              <div key={i}>
                <span className="text-[9px] uppercase tracking-widest text-zinc-600">{item.l}</span>
                <p className="text-xs text-zinc-300 mt-0.5 font-medium">{item.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap size={11} className="text-amber-400" />
              <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold">Recommended Actions</span>
            </div>
            <div className="space-y-1">
              {(actions[thread.category] || actions.general).map((a, j) => (
                <div key={j} className="text-[11px] text-zinc-400 flex items-start gap-2">
                  <span className="text-zinc-600 mt-px">›</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>

          <a href={`https://mail.google.com/mail/u/0/#inbox/${thread.id}`} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium">
            <ExternalLink size={11} /> Open in Gmail
          </a>
        </div>
      )}
    </div>
  );
}

// ═══ SYSTEM ARCHITECTURE ═══
function SystemDiagram() {
  const stages = [
    { phase: "INGEST", color: "#60a5fa", icon: "📥", items: [
      "Gmail → Zapier instant detection (< 1s)",
      "Apps Script 5-min scan (classification engine)",
      "Both paths converge on Slack #evastore-triage",
    ]},
    { phase: "CLASSIFY", color: "#a78bfa", icon: "🧠", items: [
      "Subject keyword matching → 7 categories",
      "Priority assignment: P1 (compliance) → P3 (info)",
      "FYI flagging for auto-acknowledgement",
    ]},
    { phase: "TRIAGE", color: "#fbbf24", icon: "📋", items: [
      "Slack notification with category + action items",
      "Google Sheet row created with 18-column structure",
      "Auto-ack fires for Weekly Roundup emails",
    ]},
    { phase: "ESCALATE", color: "#f87171", icon: "🚨", items: [
      "T+2h → Slack channel reminder",
      "T+4h → Slack DM to Sam",
      "T+6h → Slack DM to Jorge (backup)",
      "T+7h → SMS to mobile (final warning)",
    ]},
    { phase: "RESOLVE", color: "#34d399", icon: "✅", items: [
      "Reply detected → business hours calculated",
      "Sheet + Slack updated automatically",
      "SLA compliance logged, dashboard refreshed",
    ]},
  ];

  return (
    <div className="space-y-1">
      {stages.map((s, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
              {s.icon}
            </div>
            {i < stages.length - 1 && <div className="w-px flex-1 my-1" style={{ background: `${s.color}30` }} />}
          </div>
          <div className="flex-1 pb-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5" style={{ color: s.color }}>{s.phase}</div>
            {s.items.map((item, j) => (
              <div key={j} className="text-[11px] text-zinc-400 flex items-start gap-1.5 mb-0.5">
                <span className="text-zinc-600 mt-px">›</span><span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ZapCard({ name, trigger, actions, status }) {
  return (
    <div className="border border-zinc-800/60 rounded-xl p-4 bg-zinc-900/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={13} className="text-orange-400" />
          <span className="text-xs font-bold text-zinc-200">{name}</span>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 font-bold tracking-wider">{status}</span>
      </div>
      <div className="mb-2">
        <span className="text-[9px] uppercase tracking-widest text-zinc-600">Trigger</span>
        <p className="text-[11px] text-sky-400 mt-0.5 font-mono">{trigger}</p>
      </div>
      <div>
        <span className="text-[9px] uppercase tracking-widest text-zinc-600">Actions</span>
        {actions.map((a, i) => (
          <div key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5 mt-0.5">
            <span className="text-zinc-600 font-mono">{i + 1}.</span><span>{a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EscalationTimeline() {
  const events = [
    { time: "T+0", label: "Email detected", desc: "Zapier fires instant Slack alert → Apps Script classifies within 5 min", type: "info" },
    { time: "T+0", label: "Auto-classify", desc: "Category, priority, action items populated in triage sheet", type: "info" },
    { time: "T+2h", label: "Channel nudge", desc: "Slack reminder in #evastore-triage with time remaining", type: "warn" },
    { time: "T+4h", label: "DM to Sam", desc: "Direct Slack message with Gmail link and SLA countdown", type: "warn" },
    { time: "T+6h", label: "Escalate to Jorge", desc: "Jorge DM + channel notification for backup response", type: "crit" },
    { time: "T+7h", label: "SMS alert", desc: "Text message to Sam's mobile — final warning", type: "crit" },
    { time: "T+8h", label: "SLA Breach", desc: "Status updated, breach logged, post-mortem flag created", type: "breach" },
  ];
  const colors = { info: "#60a5fa", warn: "#fbbf24", crit: "#f87171", breach: "#991b1b" };

  return (
    <div className="relative pl-7">
      <div className="absolute left-[13px] top-2 bottom-2 w-px" style={{ background: "linear-gradient(to bottom, #60a5fa, #fbbf24, #f87171, #991b1b)" }} />
      {events.map((e, i) => (
        <div key={i} className="relative mb-5 last:mb-0">
          <div className="absolute left-[-19px] top-1 w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: colors[e.type], background: colors[e.type] }} />
          <div className="ml-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 font-bold">{e.time}</span>
              <span className="text-xs font-bold text-zinc-200">{e.label}</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">{e.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══ MAIN APP ═══
export default function EvastoreCommandCentre() {
  const [tab, setTab] = useState("dashboard");
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");
  const [month, setMonth] = useState("2026-02");
  const [searchQuery, setSearchQuery] = useState("");

  const metrics = month === "2026-02" ? FEB : JAN;

  const filteredThreads = useMemo(() => {
    let threads = TRIAGE_DATA.filter(t => t.date.startsWith(month));
    if (filter === "open") threads = threads.filter(t => t.status === "OPEN");
    if (filter === "replied") threads = threads.filter(t => t.status.includes("REPLIED") || t.status === "AUTO-ACKED ✓");
    if (filter === "breached") threads = threads.filter(t => t.status === "SLA BREACHED");
    if (filter === "action") threads = threads.filter(t => t.type === "Action" && t.status === "OPEN");
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      threads = threads.filter(t => t.subject.toLowerCase().includes(q) || t.from.toLowerCase().includes(q) || t.label.toLowerCase().includes(q));
    }
    return threads.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [month, filter, searchQuery]);

  const responseChart = useMemo(() => {
    return TRIAGE_DATA
      .filter(t => t.date.startsWith(month) && t.bizHours !== null && t.bizHours > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(t => ({ name: t.subject.substring(0, 18), hours: t.bizHours, sla: 8 }));
  }, [month]);

  const categoryBreakdown = useMemo(() => {
    const counts = {};
    TRIAGE_DATA.filter(t => t.date.startsWith(month)).forEach(t => {
      counts[t.label] = (counts[t.label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: name.substring(2).trim(), value }));
  }, [month]);

  const catColors = ["#60a5fa", "#f87171", "#fbbf24", "#34d399", "#a78bfa", "#fb923c", "#38bdf8", "#e879f9"];

  const trendData = [
    { month: "Jan", sla: JAN.slaRate, target: 90 },
    { month: "Feb", sla: FEB.slaRate, target: 90 },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "triage", label: "Triage Queue", icon: Inbox },
    { id: "system", label: "System Build", icon: Layers },
    { id: "alerts", label: "Alert Config", icon: Bell },
  ];

  return (
    <div className="min-h-screen text-zinc-100" style={{ background: "radial-gradient(ellipse at 20% 0%, #0f172a 0%, #09090b 50%, #09090b 100%)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`* { font-family: 'DM Sans', sans-serif; } .mono { font-family: 'Space Mono', monospace; } @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .animate-in { animation: slideIn 0.4s ease-out forwards; }`}</style>

      {/* HEADER */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/70 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #34d399, #60a5fa)" }}>
                <Shield size={17} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight">EVASTORE PARTNER OPS</h1>
                <p className="text-[9px] text-zinc-600 uppercase tracking-[0.3em]">SLA Command Centre</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select value={month} onChange={e => setMonth(e.target.value)}
                className="text-xs bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-3 py-1.5 text-zinc-300 outline-none">
                <option value="2026-02">Feb 2026</option>
                <option value="2026-01">Jan 2026</option>
              </select>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${metrics.slaRate >= 90 ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30" : "bg-red-400/15 text-red-300 border border-red-400/30"}`}>
                {metrics.slaRate >= 90 ? "✓ ON TRACK" : "⚠ AT RISK"}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                <Radio size={10} className="text-emerald-400 animate-pulse" />
                LIVE
              </div>
            </div>
          </div>
          <div className="flex gap-1 -mb-px">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${tab === t.id ? "border-sky-400 text-sky-300" : "border-transparent text-zinc-600 hover:text-zinc-400"}`}>
                <t.icon size={13} /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-5 py-6">

        {/* ═══ DASHBOARD ═══ */}
        {tab === "dashboard" && (
          <div className="space-y-5 animate-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* SLA Gauge */}
              <div className="lg:col-span-3 border border-zinc-800/60 rounded-2xl p-6 bg-zinc-900/30 flex flex-col items-center justify-center">
                <SLAGauge percent={metrics.slaRate} />
                <div className="mt-3 text-center">
                  <div className={`text-xs font-bold ${metrics.slaRate >= 90 ? "text-emerald-400" : "text-red-400"}`}>
                    {metrics.slaRate >= 90 ? "✓ Expansion eligible" : `✗ ${90 - metrics.slaRate}pp below target`}
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">Target: 90% · Gate for 2nd partner</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                <MetricTile icon={Mail} label="Threads" value={metrics.total} sub={`${metrics.actionCount} action · ${metrics.total - metrics.actionCount} FYI`} color="#60a5fa" />
                <MetricTile icon={CheckCircle} label="Resolved" value={metrics.replied + metrics.autoAcked} sub={`${metrics.replied} replied · ${metrics.autoAcked} auto-acked`} color="#34d399" />
                <MetricTile icon={Clock} label="Avg Response" value={`${metrics.avgHours}h`} sub={metrics.avgHours <= 8 ? "Within SLA target" : "Above 8h target"} color={metrics.avgHours <= 8 ? "#34d399" : "#f87171"} />
                <MetricTile icon={AlertTriangle} label="Breached" value={metrics.breached} sub={`${metrics.open} still open`} color={metrics.breached === 0 ? "#34d399" : "#f87171"} />
              </div>

              {/* Recovery Path */}
              <div className="lg:col-span-4 border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={13} className="text-zinc-500" />
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Recovery Path</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">SLA Adherence</span>
                      <span className="mono font-bold" style={{ color: metrics.slaRate >= 90 ? "#34d399" : "#f87171" }}>{metrics.slaRate}% / 90%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(metrics.slaRate, 100)}%`, background: metrics.slaRate >= 90 ? "#34d399" : metrics.slaRate >= 70 ? "#fbbf24" : "#f87171" }} />
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-400 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30 leading-relaxed">
                    <span className="text-emerald-400 font-bold">Quick win landed:</span> 3 Weekly Roundups auto-acknowledged on 11 Feb. These no longer count as unreplied. Escalation system now prevents future 23h outliers (Fri→Mon gap). With the triage engine running, new threads get actioned within hours, not days.
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><BarChart3 size={12} /> Response Time by Thread</h3>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseChart} margin={{ top: 5, right: 5, bottom: 30, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e1e24" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#52525b" }} angle={-30} textAnchor="end" />
                      <YAxis tick={{ fontSize: 9, fill: "#52525b" }} />
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "10px", fontSize: "11px" }} />
                      <Bar dataKey="hours" radius={[6, 6, 0, 0]} name="Hours">
                        {responseChart.map((e, i) => <Cell key={i} fill={e.hours <= 8 ? "#34d399" : "#f87171"} />)}
                      </Bar>
                      <Bar dataKey="sla" fill="transparent" stroke="#f8717140" strokeDasharray="4 4" name="8h SLA" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Activity size={12} /> Category Mix</h3>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryBreakdown} dataKey="value" cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={3} strokeWidth={0}>
                        {categoryBreakdown.map((_, i) => <Cell key={i} fill={catColors[i % catColors.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "10px", fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-1">
                  {categoryBreakdown.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      <span className="w-2 h-2 rounded-full" style={{ background: catColors[i % catColors.length] }} />
                      <span className="text-zinc-400">{c.name}</span>
                      <span className="text-zinc-600 mono ml-auto">{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TRIAGE QUEUE ═══ */}
        {tab === "triage" && (
          <div className="space-y-4 animate-in">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input type="text" placeholder="Search threads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-900/50 border border-zinc-800/60 rounded-lg text-zinc-300 outline-none focus:border-zinc-600 transition-colors" />
              </div>
              {["all", "action", "open", "replied", "breached"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${filter === f ? "bg-zinc-700/80 text-zinc-200" : "bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800/50"}`}>
                  {f === "all" ? "All" : f === "action" ? "⚡ Needs Action" : f === "open" ? "⏳ Open" : f === "replied" ? "✅ Resolved" : "🔴 Breached"}
                </button>
              ))}
              <span className="text-[10px] text-zinc-600 ml-2 mono">{filteredThreads.length} threads</span>
            </div>

            <div className="space-y-2">
              {filteredThreads.map(t => (
                <TriageRow key={t.id} thread={t} expanded={expanded === t.id} onToggle={() => setExpanded(expanded === t.id ? null : t.id)} />
              ))}
              {filteredThreads.length === 0 && (
                <div className="text-center py-16 text-zinc-600">
                  <CheckCircle size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No threads match this filter</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ SYSTEM BUILD ═══ */}
        {tab === "system" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-in">
            <div>
              <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2"><GitBranch size={12} /> Workflow Pipeline</h2>
              <div className="border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
                <SystemDiagram />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2"><Zap size={12} /> Zapier Integrations</h2>
              <ZapCard name="Zap #1: Inbound → Instant Alert" status="LIVE"
                trigger="Gmail: New email from *@evastore.co.uk → sam.breznica"
                actions={["Slack: Send to #evastore-triage (subject, sender, timestamp)", "Fires within seconds of email arrival"]} />
              <ZapCard name="Zap #2: Escalation → Slack" status="LIVE"
                trigger="Webhooks by Zapier: Catch Hook (from Apps Script)"
                actions={["Slack: Forward escalation message to #evastore-triage", "Handles T+2h nudges, T+4h DMs, breach notifications"]} />
              <ZapCard name="Zap #3: Reply Sent → Confirmation" status="LIVE"
                trigger="Gmail: New email from sam.breznica → *@evastore.co.uk"
                actions={["Slack: Send ✅ confirmation to #evastore-triage", "Apps Script calculates response time on next cycle"]} />
            </div>

            {/* Tech Stack */}
            <div className="lg:col-span-2 border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
              <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Settings size={12} /> System Components</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Gmail", desc: "Inbound detection + reply tracking", status: "Active" },
                  { name: "Apps Script", desc: "Classification, escalation, reply detection (5min + 30min triggers)", status: "Active" },
                  { name: "Google Sheets", desc: "Evastore Triage tab — 25 threads, 18 columns", status: "Active" },
                  { name: "Zapier", desc: "3 zaps: inbound alert, escalation routing, reply confirmation", status: "Active" },
                  { name: "Slack", desc: "#evastore-triage channel — all notifications via Zapier", status: "Active" },
                  { name: "Auto-Ack", desc: "Weekly Roundup emails auto-replied (3 fired so far)", status: "Active" },
                  { name: "SMS (T+7h)", desc: "Zapier SMS for critical final warning", status: "Ready" },
                  { name: "Jorge Escalation", desc: "DM at T+6h for backup response", status: "Ready" },
                ].map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-zinc-800/20 border border-zinc-800/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-200">{c.name}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider ${c.status === "Active" ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30" : "bg-zinc-700/50 text-zinc-400 border border-zinc-600/30"}`}>{c.status}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ ALERTS CONFIG ═══ */}
        {tab === "alerts" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-in">
            <div>
              <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2"><Timer size={12} /> Escalation Ladder</h2>
              <div className="border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
                <EscalationTimeline />
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
                <h3 className="text-xs font-bold text-zinc-200 mb-3 flex items-center gap-2"><Layers size={12} /> Classification Rules</h3>
                <div className="space-y-2.5">
                  {[
                    { icon: "📦", label: "Post / Dispatch", keywords: "post, dispatch, delivery", priority: "P1", color: "#f87171" },
                    { icon: "🗄️", label: "Will Storage", keywords: "will box, storage", priority: "P1", color: "#f87171" },
                    { icon: "📄", label: "WSL Documents", keywords: "wsl, document", priority: "P1", color: "#f87171" },
                    { icon: "👤", label: "Testator Query", keywords: "testator, address", priority: "P1", color: "#f87171" },
                    { icon: "⚙️", label: "HubSpot / Access", keywords: "hubspot, login, access", priority: "P2", color: "#fbbf24" },
                    { icon: "✅", label: "Will Marking", keywords: "marking, copied", priority: "P2", color: "#fbbf24" },
                    { icon: "📊", label: "Weekly Roundup", keywords: "weekly round, roundup", priority: "P3 FYI", color: "#34d399" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3 text-[11px]">
                      <span className="text-base">{r.icon}</span>
                      <div className="flex-1">
                        <span className="text-zinc-200 font-semibold">{r.label}</span>
                        <span className="text-zinc-600 ml-2 font-mono text-[9px]">{r.keywords}</span>
                      </div>
                      <span className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded" style={{ color: r.color, background: `${r.color}15`, border: `1px solid ${r.color}30` }}>{r.priority}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-emerald-500/20 rounded-2xl p-5 bg-emerald-500/[0.03]">
                <h3 className="text-xs font-bold text-emerald-300 mb-2 flex items-center gap-2"><Zap size={12} /> Impact Summary</h3>
                <div className="space-y-2 text-[11px] text-zinc-400 leading-relaxed">
                  <p><span className="text-emerald-300 font-bold">Auto-ack deployed:</span> 3 Weekly Roundups auto-replied on 11 Feb. These previously counted as "unreplied" and dragged SLA down.</p>
                  <p><span className="text-emerald-300 font-bold">Escalation engine active:</span> Apps Script checks every 30 min during business hours. No more Fri→Mon silent gaps.</p>
                  <p><span className="text-emerald-300 font-bold">Instant detection:</span> Zapier fires Slack alert within seconds of any Evastore email landing. Classification follows within 5 min.</p>
                  <p className="text-zinc-500">Combined effect: the system that produced 60% SLA in Feb is now fundamentally different. Going forward, every thread gets visibility, every delay gets escalated, every roundup gets auto-handled.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800/40 mt-10">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <span className="text-[9px] text-zinc-700">Octopus Legacy — Evastore Partner Operations</span>
          <span className="text-[9px] text-zinc-700">Data: EVA_Store_SLA_Metrics.xlsx · Evastore Triage sheet · Apps Script pipeline</span>
        </div>
      </footer>
    </div>
  );
}
