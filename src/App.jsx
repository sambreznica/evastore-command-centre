import { useState, useMemo, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie } from "recharts";
import { AlertTriangle, CheckCircle, Clock, Mail, Zap, Bell, ChevronDown, ChevronRight, ExternalLink, Target, Shield, Inbox, AlertCircle, Timer, BarChart3, Settings, Activity, Search, RefreshCw, Layers, GitBranch, Info, BookOpen, Wifi, WifiOff } from "lucide-react";

const REFRESH_MS = 60000;

const FALLBACK = [
  {threadId:"19c4c57e",inboundTimestamp:"2026-02-11T10:55:49Z",subject:"Post",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"post_dispatch",categoryLabel:"📦 Post / Dispatch",priority:"P1",urgency:"high",type:"Action",status:"OPEN",samReplyTimestamp:null,responseTimeBizHours:null,slaDeadline:"2026-02-12T10:55:00Z",escalationLevel:"DM",gmailLink:"https://mail.google.com/mail/u/0/#inbox/19c4c57e"},
  {threadId:"19c42d00",inboundTimestamp:"2026-02-09T14:30:43Z",subject:"Post 05/02/2026",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"post_dispatch",categoryLabel:"📦 Post / Dispatch",priority:"P1",urgency:"high",type:"Action",status:"REPLIED ✓",samReplyTimestamp:"2026-02-10T09:42:54Z",responseTimeBizHours:3.2,slaDeadline:"2026-02-10T14:30:00Z",escalationLevel:"",gmailLink:""},
  {threadId:"19c41de6",inboundTimestamp:"2026-02-09T10:06:37Z",subject:"Will box",fromName:"Gary Tait",fromEmail:"gary@evastore.co.uk",category:"will_storage",categoryLabel:"🗄️ Will Storage",priority:"P1",urgency:"high",type:"Action",status:"REPLIED ✓",samReplyTimestamp:"2026-02-10T09:49:30Z",responseTimeBizHours:7.71,slaDeadline:"2026-02-10T10:06:00Z",escalationLevel:"",gmailLink:""},
  {threadId:"19c33edf",inboundTimestamp:"2026-02-06T17:09:11Z",subject:"Weekly Round up w/c 02/02/2026",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"weekly_roundup",categoryLabel:"📊 Weekly Roundup",priority:"P3",urgency:"low",type:"FYI",status:"AUTO-ACKED ✓",samReplyTimestamp:"2026-02-11T16:54:01Z",responseTimeBizHours:0,slaDeadline:null,escalationLevel:"",gmailLink:""},
  {threadId:"19c2ec52",inboundTimestamp:"2026-02-05T17:06:31Z",subject:"WSL documents",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"wsl_documents",categoryLabel:"📄 WSL Documents",priority:"P1",urgency:"high",type:"Action",status:"REPLIED ✓",samReplyTimestamp:"2026-02-06T16:49:56Z",responseTimeBizHours:7.83,slaDeadline:"2026-02-06T17:06:00Z",escalationLevel:"",gmailLink:""},
  {threadId:"19c2d685",inboundTimestamp:"2026-02-05T10:45:31Z",subject:"FW: post 05/02/2026",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"post_dispatch",categoryLabel:"📦 Post / Dispatch",priority:"P1",urgency:"high",type:"Action",status:"REPLIED (LATE)",samReplyTimestamp:"2026-02-10T09:51:31Z",responseTimeBizHours:23.1,slaDeadline:"2026-02-06T10:45:00Z",escalationLevel:"BREACH",gmailLink:""},
  {threadId:"19c2d66a",inboundTimestamp:"2026-02-05T10:43:46Z",subject:"(No subject)",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"general",categoryLabel:"📧 General",priority:"P2",urgency:"medium",type:"Action",status:"SLA BREACHED",samReplyTimestamp:null,responseTimeBizHours:null,slaDeadline:"2026-02-06T10:43:00Z",escalationLevel:"BREACH",gmailLink:""},
  {threadId:"19c2d65c",inboundTimestamp:"2026-02-05T10:42:41Z",subject:"Post 05/02/2026",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"post_dispatch",categoryLabel:"📦 Post / Dispatch",priority:"P1",urgency:"high",type:"Action",status:"REPLIED (LATE)",samReplyTimestamp:"2026-02-10T09:50:32Z",responseTimeBizHours:23.13,slaDeadline:"2026-02-06T10:42:00Z",escalationLevel:"BREACH",gmailLink:""},
  {threadId:"19c0f634",inboundTimestamp:"2026-01-30T14:51:24Z",subject:"post",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"post_dispatch",categoryLabel:"📦 Post / Dispatch",priority:"P1",urgency:"high",type:"Action",status:"REPLIED ✓",samReplyTimestamp:"2026-01-30T14:55:00Z",responseTimeBizHours:0.07,slaDeadline:"2026-02-02T14:51:00Z",escalationLevel:"",gmailLink:""},
  {threadId:"19c09fab",inboundTimestamp:"2026-01-29T13:39:06Z",subject:"Marking Copied wills",fromName:"Gary Tait",fromEmail:"gary@evastore.co.uk",category:"will_marking",categoryLabel:"✅ Will Marking",priority:"P2",urgency:"medium",type:"Action",status:"SLA BREACHED",samReplyTimestamp:null,responseTimeBizHours:null,slaDeadline:"2026-01-30T13:39:00Z",escalationLevel:"BREACH",gmailLink:""},
  {threadId:"19c04aad",inboundTimestamp:"2026-01-28T12:53:45Z",subject:"FW: Response reference the HubSpot process",fromName:"Gary Tait",fromEmail:"gary@evastore.co.uk",category:"hubspot_process",categoryLabel:"⚙️ HubSpot / Access",priority:"P2",urgency:"medium",type:"Action",status:"REPLIED ✓",samReplyTimestamp:"2026-01-28T16:39:07Z",responseTimeBizHours:3.76,slaDeadline:"2026-01-29T12:53:00Z",escalationLevel:"",gmailLink:""},
  {threadId:"19bfb0d6",inboundTimestamp:"2026-01-26T16:05:01Z",subject:"Call Back",fromName:"Gary Tait",fromEmail:"gary@evastore.co.uk",category:"general",categoryLabel:"📧 General",priority:"P2",urgency:"medium",type:"Action",status:"REPLIED ✓",samReplyTimestamp:"2026-01-26T16:22:00Z",responseTimeBizHours:0.27,slaDeadline:"2026-01-27T16:05:00Z",escalationLevel:"",gmailLink:""},
  {threadId:"19bead15",inboundTimestamp:"2026-01-23T12:25:36Z",subject:"Testator Address",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"testator_query",categoryLabel:"👤 Testator Query",priority:"P1",urgency:"high",type:"Action",status:"REPLIED ✓",samReplyTimestamp:"2026-01-23T13:28:07Z",responseTimeBizHours:1.04,slaDeadline:"2026-01-24T12:25:00Z",escalationLevel:"",gmailLink:""},
  {threadId:"19be54fd",inboundTimestamp:"2026-01-22T10:46:04Z",subject:"Post 22/01/2026",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"post_dispatch",categoryLabel:"📦 Post / Dispatch",priority:"P1",urgency:"high",type:"Action",status:"REPLIED ✓",samReplyTimestamp:"2026-01-22T10:51:00Z",responseTimeBizHours:0.08,slaDeadline:"2026-01-23T10:46:00Z",escalationLevel:"",gmailLink:""},
  {threadId:"19bb7fb7",inboundTimestamp:"2026-01-13T15:31:01Z",subject:"RE: Post",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"post_dispatch",categoryLabel:"📦 Post / Dispatch",priority:"P1",urgency:"high",type:"Action",status:"REPLIED ✓",samReplyTimestamp:"2026-01-13T17:00:00Z",responseTimeBizHours:1.48,slaDeadline:"2026-01-14T15:31:00Z",escalationLevel:"",gmailLink:""},
  {threadId:"19bb7f5c",inboundTimestamp:"2026-01-13T15:24:49Z",subject:"Post 16/01/2026",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"post_dispatch",categoryLabel:"📦 Post / Dispatch",priority:"P1",urgency:"high",type:"Action",status:"SLA BREACHED",samReplyTimestamp:null,responseTimeBizHours:null,slaDeadline:"2026-01-14T15:24:00Z",escalationLevel:"BREACH",gmailLink:""},
  {threadId:"19b8dff2",inboundTimestamp:"2026-01-05T11:51:00Z",subject:"OLW post",fromName:"Rebecca Wallace",fromEmail:"rebecca@evastore.co.uk",category:"post_dispatch",categoryLabel:"📦 Post / Dispatch",priority:"P1",urgency:"high",type:"Action",status:"REPLIED (LATE)",samReplyTimestamp:"2026-01-13T09:00:00Z",responseTimeBizHours:45.77,slaDeadline:"2026-01-06T11:51:00Z",escalationLevel:"BREACH",gmailLink:""},
];

// ═══ HELPERS ═══
function fmtDate(iso){if(!iso)return"—";try{return new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}catch{return"—"}}
function timeAgo(iso){if(!iso)return"";const h=Math.floor((Date.now()-new Date(iso).getTime())/36e5);return h<1?"< 1h ago":h<24?h+"h ago":Math.floor(h/24)+"d ago"}
function getMonth(iso){if(!iso)return"";const d=new Date(iso);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")}

function computeMetrics(threads,mk){
  const all=threads.filter(t=>getMonth(t.inboundTimestamp)===mk);
  const action=all.filter(t=>t.type==="Action");
  const excluded=all.filter(t=>t.type!=="Action");
  const st=s=>(s||"").toUpperCase();
  const replied=action.filter(t=>st(t.status).includes("REPLIED")&&!st(t.status).includes("LATE"));
  const late=action.filter(t=>st(t.status).includes("LATE"));
  const within=replied.filter(t=>{const h=parseFloat(t.responseTimeBizHours);return!isNaN(h)&&h<=8});
  const breached=action.filter(t=>st(t.status).includes("BREACH"));
  const open=all.filter(t=>st(t.status)==="OPEN");
  const acked=all.filter(t=>st(t.status).includes("AUTO-ACKED"));
  const times=[...replied,...late].map(t=>parseFloat(t.responseTimeBizHours)).filter(h=>!isNaN(h)&&h>0);
  const avg=times.length?times.reduce((a,b)=>a+b,0)/times.length:0;
  const sla=action.length?Math.round(within.length/action.length*100):100;
  return{total:all.length,actionCount:action.length,excludedCount:excluded.length,replied:replied.length,repliedLate:late.length,withinSla:within.length,autoAcked:acked.length,breached:breached.length,open:open.length,avgHours:Math.round(avg*100)/100,slaRate:sla}
}

const ACT_MAP={post_dispatch:["Confirm receipt","Update HubSpot deal stage","Cross-ref membership number","Notify fulfilment"],will_storage:["Cross-ref membership on cover","Verify in HubSpot","Update Beacon pipeline"],wsl_documents:["Review compliance requirements","Verify against HubSpot","Respond"],testator_query:["Look up in HubSpot","Verify details","Respond"],hubspot_process:["Assess Hayden/Jan needed","Coordinate access","Respond"],will_marking:["Verify in HubSpot/Arken","Confirm with Evastore"],weekly_roundup:["Auto-acknowledged — review for discrepancies only"],general:["Triage and categorise","Reply within SLA"]};

// ═══ UI ATOMS ═══
function StatusChip({status}){
  const s=(status||"").toUpperCase();
  const map={AUTO:{bg:"bg-sky-400/15",t:"text-sky-300",b:"border-sky-400/30",I:RefreshCw},LATE:{bg:"bg-orange-400/15",t:"text-orange-300",b:"border-orange-400/30",I:AlertCircle},BREACH:{bg:"bg-red-400/15",t:"text-red-300",b:"border-red-400/30",I:AlertTriangle},REPLIED:{bg:"bg-emerald-400/15",t:"text-emerald-300",b:"border-emerald-400/30",I:CheckCircle},OPEN:{bg:"bg-amber-400/15",t:"text-amber-300",b:"border-amber-400/30",I:Clock},EXCL:{bg:"bg-zinc-600/15",t:"text-zinc-400",b:"border-zinc-600/30",I:Info}};
  const k=s.includes("AUTO")?"AUTO":s.includes("LATE")?"LATE":s.includes("BREACH")?"BREACH":s.includes("REPLIED")?"REPLIED":s==="OPEN"?"OPEN":"EXCL";
  const c=map[k];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${c.bg} ${c.t} ${c.b}`}><c.I size={10}/>{status}</span>;
}

function SLAGauge({percent}){
  const r=58,circ=2*Math.PI*r,prog=(Math.min(percent,100)/100)*circ,col=percent>=90?"#34d399":percent>=70?"#fbbf24":"#f87171";
  return(
    <div className="relative" style={{width:160,height:160}}>
      <svg viewBox="0 0 130 130" className="w-full h-full" style={{transform:"rotate(-90deg)"}}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="#1e1e24" strokeWidth="10"/>
        <circle cx="65" cy="65" r={r} fill="none" stroke={col} strokeWidth="10" strokeDasharray={circ} strokeDashoffset={circ-prog} strokeLinecap="round" style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black tabular-nums" style={{color:col,fontFamily:"'Space Mono',monospace"}}>{percent}</span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 mt-0.5">% SLA</span>
      </div>
    </div>
  );
}

function Tile({icon:Icon,label,value,sub,color="#a1a1aa"}){
  return(
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 hover:border-zinc-700/80 transition-colors">
      <div className="flex items-center gap-2 mb-2"><Icon size={13} style={{color}}/><span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span></div>
      <div className="text-2xl font-black tabular-nums text-zinc-100" style={{fontFamily:"'Space Mono',monospace"}}>{value}</div>
      {sub&&<div className="text-[11px] text-zinc-500 mt-1">{sub}</div>}
    </div>
  );
}

// ═══ TRIAGE ROW ═══
function TriageRow({t,expanded,onToggle}){
  const s=(t.status||"").toUpperCase(),isOpen=s==="OPEN",isBreach=s.includes("BREACH")||s.includes("LATE"),isExcl=t.type!=="Action";
  const border=isOpen?"border-amber-500/30":isBreach?"border-red-500/20":"border-zinc-800/60";
  const bg=isOpen?"bg-amber-500/[0.03]":isBreach?"bg-red-500/[0.02]":"bg-zinc-900/30";
  const label=t.categoryLabel||t.category||"📧 General";
  const icon=label.split(" ")[0]||"📧";
  const bh=parseFloat(t.responseTimeBizHours);
  const acts=ACT_MAP[t.category]||ACT_MAP.general;
  return(
    <div className={`border rounded-xl overflow-hidden transition-all ${border} ${bg} ${isExcl?"opacity-50":""}`}>
      <button onClick={onToggle} className="w-full text-left p-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
        <span className="text-base flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`inline-block w-2 h-2 rounded-full ${t.priority==="P1"?"bg-red-400":t.priority==="P2"?"bg-amber-400":"bg-emerald-400"}`}/>
            <span className={`text-[13px] font-semibold truncate ${isExcl?"text-zinc-500":"text-zinc-200"}`}>{t.subject||"(No subject)"}</span>
            <StatusChip status={t.status}/>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-500 flex-wrap">
            <span>{t.fromName||t.fromEmail}</span><span>·</span><span>{fmtDate(t.inboundTimestamp)}</span>
            {!isNaN(bh)&&bh>0&&<><span>·</span><span className={`font-mono font-bold ${bh<=8?"text-emerald-400":"text-red-400"}`}>{bh}h</span></>}
            {isOpen&&<span className="text-amber-400 font-medium animate-pulse">⏱ {timeAgo(t.inboundTimestamp)}</span>}
          </div>
        </div>
        {expanded?<ChevronDown size={14} className="text-zinc-600"/>:<ChevronRight size={14} className="text-zinc-600"/>}
      </button>
      {expanded&&(
        <div className="px-4 pb-4 border-t border-zinc-800/40">
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{l:"Category",v:label},{l:"Priority",v:`${t.priority} — ${t.urgency}`},{l:"SLA Deadline",v:t.slaDeadline?fmtDate(t.slaDeadline):"N/A"},{l:"Response",v:!isNaN(bh)?`${bh}h`:(t.type==="Action"&&isOpen)?"Pending":"N/A"}].map((x,i)=>
              <div key={i}><span className="text-[9px] uppercase tracking-widest text-zinc-600">{x.l}</span><p className="text-xs text-zinc-300 mt-0.5 font-medium">{x.v}</p></div>
            )}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
            <div className="flex items-center gap-1.5 mb-2"><Zap size={11} className="text-amber-400"/><span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold">Actions</span></div>
            {acts.map((a,j)=><div key={j} className="text-[11px] text-zinc-400 flex items-start gap-2"><span className="text-zinc-600">›</span><span>{a}</span></div>)}
          </div>
          {t.gmailLink&&<a href={t.gmailLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium"><ExternalLink size={11}/>Open in Gmail</a>}
        </div>
      )}
    </div>
  );
}

// ═══ SYSTEM + ESCALATION DIAGRAMS ═══
function SystemDiagram(){
  const stages=[
    {phase:"INGEST",color:"#60a5fa",icon:"📥",items:["Gmail → Zapier instant (< 1s)","Apps Script 5-min scan + classify","Both → Slack #evastore-triage"]},
    {phase:"CLASSIFY",color:"#a78bfa",icon:"🧠",items:["Subject keywords → 7 categories","P1 (compliance) → P3 (info)","FYI → auto-acknowledge"]},
    {phase:"TRIAGE",color:"#fbbf24",icon:"📋",items:["Slack card: category + actions + deadline","Sheet row: 18 columns populated","Portal refreshes every 60s"]},
    {phase:"ESCALATE",color:"#f87171",icon:"🚨",items:["T+2h → Channel reminder","T+4h → DM to Sam","T+6h → DM to Jorge","T+7h → SMS"]},
    {phase:"RESOLVE",color:"#34d399",icon:"✅",items:["Reply detected → biz hours calc","Sheet + Slack + Portal update","SLA compliance logged"]},
  ];
  return(
    <div className="space-y-1">
      {stages.map((s,i)=>(
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm" style={{background:`${s.color}20`,border:`1px solid ${s.color}40`}}>{s.icon}</div>
            {i<stages.length-1&&<div className="w-px flex-1 my-1" style={{background:`${s.color}30`}}/>}
          </div>
          <div className="flex-1 pb-4">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5" style={{color:s.color}}>{s.phase}</div>
            {s.items.map((item,j)=><div key={j} className="text-[11px] text-zinc-400 flex items-start gap-1.5 mb-0.5"><span className="text-zinc-600">›</span><span>{item}</span></div>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function EscalationTimeline(){
  const events=[
    {time:"T+0",label:"Email detected",desc:"Zapier fires instant Slack alert",type:"info"},
    {time:"T+2h",label:"Channel nudge",desc:"Slack reminder in #evastore-triage",type:"warn"},
    {time:"T+4h",label:"DM to Sam",desc:"Direct message with Gmail link",type:"warn"},
    {time:"T+6h",label:"Escalate to Jorge",desc:"Backup responder notified",type:"crit"},
    {time:"T+7h",label:"SMS alert",desc:"Text to mobile — final warning",type:"crit"},
    {time:"T+8h",label:"SLA Breach",desc:"Status logged, breach recorded",type:"breach"},
  ];
  const cols={info:"#60a5fa",warn:"#fbbf24",crit:"#f87171",breach:"#991b1b"};
  return(
    <div className="relative pl-7">
      <div className="absolute left-[13px] top-2 bottom-2 w-px" style={{background:"linear-gradient(to bottom, #60a5fa, #fbbf24, #f87171, #991b1b)"}}/>
      {events.map((e,i)=>(
        <div key={i} className="relative mb-5 last:mb-0">
          <div className="absolute left-[-19px] top-1 w-3.5 h-3.5 rounded-full border-2" style={{borderColor:cols[e.type],background:cols[e.type]}}/>
          <div className="ml-2">
            <div className="flex items-center gap-2"><span className="text-[10px] font-mono text-zinc-500 font-bold">{e.time}</span><span className="text-xs font-bold text-zinc-200">{e.label}</span></div>
            <p className="text-[11px] text-zinc-500 mt-0.5">{e.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══ SETUP MODAL ═══
function SetupModal({onSave,onClose}){
  const[url,setUrl]=useState("");
  return(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-lg w-full">
        <h2 className="text-lg font-bold text-zinc-100 mb-2">Connect Live Data</h2>
        <p className="text-xs text-zinc-400 mb-4 leading-relaxed">Paste your Apps Script Web App URL to enable live data refresh every 60 seconds.</p>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 block">API URL</label>
            <input type="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://script.google.com/macros/s/AKf.../exec" className="w-full px-3 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 outline-none focus:border-sky-500 font-mono"/>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Setup:</p>
            <ol className="text-[11px] text-zinc-400 space-y-1">
              <li><span className="text-sky-400 font-mono">1.</span> Open EVA_Store_SLA_Metrics → Apps Script</li>
              <li><span className="text-sky-400 font-mono">2.</span> Add new file → <code className="bg-zinc-700 px-1 rounded">TriageAPI</code></li>
              <li><span className="text-sky-400 font-mono">3.</span> Paste the TriageAPI.gs code</li>
              <li><span className="text-sky-400 font-mono">4.</span> Deploy → New deployment → Web app</li>
              <li><span className="text-sky-400 font-mono">5.</span> Execute as: <strong className="text-zinc-300">Me</strong> · Access: <strong className="text-zinc-300">Anyone</strong></li>
              <li><span className="text-sky-400 font-mono">6.</span> Copy URL → paste above</li>
            </ol>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={()=>{if(url.trim())onSave(url.trim())}} className="flex-1 px-4 py-2.5 rounded-lg bg-sky-500 text-white text-sm font-bold hover:bg-sky-400 transition-colors">Connect</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg bg-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-700 transition-colors">Use Offline</button>
        </div>
      </div>
    </div>
  );
}

// ═══ MAIN APP ═══
export default function App(){
  const[tab,setTab]=useState("dashboard");
  const[expanded,setExpanded]=useState(null);
  const[filter,setFilter]=useState("all");
  const[month,setMonth]=useState("");
  const[searchQ,setSearchQ]=useState("");
  const[showSetup,setShowSetup]=useState(false);
  const[threads,setThreads]=useState(FALLBACK);
  const[isLive,setIsLive]=useState(false);
  const[lastFetch,setLastFetch]=useState(null);
  const[fetchErr,setFetchErr]=useState(null);
  const[apiUrl,setApiUrl]=useState(()=>{try{return window.localStorage?.getItem("evastore_api_url")||""}catch{return""}});

  const fetchData=useCallback(async()=>{
    if(!apiUrl)return;
    try{
      const res=await fetch(apiUrl);
      if(!res.ok)throw new Error("HTTP "+res.status);
      const json=await res.json();
      if(!json.ok)throw new Error(json.error||"API error");
      setThreads(json.threads||[]);
      setIsLive(true);setLastFetch(new Date());setFetchErr(null);
    }catch(err){setFetchErr(err.message);setIsLive(false)}
  },[apiUrl]);

  useEffect(()=>{if(apiUrl){fetchData();const iv=setInterval(fetchData,REFRESH_MS);return()=>clearInterval(iv)}},[apiUrl,fetchData]);

  const months=useMemo(()=>{const s=new Set();threads.forEach(t=>{const m=getMonth(t.inboundTimestamp);if(m)s.add(m)});return[...s].sort().reverse()},[threads]);
  useEffect(()=>{if(!month&&months.length>0)setMonth(months[0])},[months,month]);

  const metrics=useMemo(()=>computeMetrics(threads,month),[threads,month]);

  const filtered=useMemo(()=>{
    let list=threads.filter(t=>getMonth(t.inboundTimestamp)===month);
    const u=f=>(f||"").toUpperCase();
    if(filter==="open")list=list.filter(t=>u(t.status)==="OPEN");
    if(filter==="replied")list=list.filter(t=>u(t.status).includes("REPLIED")||u(t.status).includes("AUTO"));
    if(filter==="breached")list=list.filter(t=>u(t.status).includes("BREACH")||u(t.status).includes("LATE"));
    if(filter==="action")list=list.filter(t=>t.type==="Action"&&u(t.status)==="OPEN");
    if(searchQ){const q=searchQ.toLowerCase();list=list.filter(t=>(t.subject||"").toLowerCase().includes(q)||(t.fromName||"").toLowerCase().includes(q))}
    return list.sort((a,b)=>new Date(b.inboundTimestamp)-new Date(a.inboundTimestamp));
  },[threads,month,filter,searchQ]);

  const responseChart=useMemo(()=>threads.filter(t=>getMonth(t.inboundTimestamp)===month&&parseFloat(t.responseTimeBizHours)>0).sort((a,b)=>new Date(a.inboundTimestamp)-new Date(b.inboundTimestamp)).map(t=>({name:(t.subject||"").substring(0,16),hours:parseFloat(t.responseTimeBizHours),sla:8})),[threads,month]);

  const catBreakdown=useMemo(()=>{const c={};threads.filter(t=>getMonth(t.inboundTimestamp)===month).forEach(t=>{const l=(t.categoryLabel||t.category||"General").replace(/^[^\w]+/,"").trim();c[l]=(c[l]||0)+1});return Object.entries(c).map(([name,value])=>({name,value}))},[threads,month]);
  const catCols=["#60a5fa","#f87171","#fbbf24","#34d399","#a78bfa","#fb923c","#38bdf8","#e879f9"];

  const handleSaveApi=(url)=>{try{window.localStorage?.setItem("evastore_api_url",url)}catch{};setApiUrl(url);setShowSetup(false)};
  const monthLabel=m=>{const[y,mo]=m.split("-");return new Date(y,mo-1).toLocaleDateString("en-GB",{month:"short",year:"numeric"})};
  const tabs=[{id:"dashboard",label:"Dashboard",icon:BarChart3},{id:"triage",label:"Triage Queue",icon:Inbox},{id:"system",label:"System Build",icon:Layers},{id:"alerts",label:"Alerts",icon:Bell}];

  return(
    <div className="min-h-screen text-zinc-100" style={{background:"radial-gradient(ellipse at 20% 0%, #0f172a 0%, #09090b 50%, #09090b 100%)"}}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`*{font-family:'DM Sans',sans-serif}.mono{font-family:'Space Mono',monospace}@keyframes si{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.anim{animation:si .4s ease-out forwards}`}</style>

      {showSetup&&<SetupModal onSave={handleSaveApi} onClose={()=>setShowSetup(false)}/>}

      <header className="border-b border-zinc-800/50 bg-zinc-950/70 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg, #34d399, #60a5fa)"}}><Shield size={17} className="text-white"/></div>
              <div><h1 className="text-sm font-black tracking-tight">EVASTORE PARTNER OPS</h1><p className="text-[9px] text-zinc-600 uppercase tracking-[0.3em]">SLA Command Centre</p></div>
            </div>
            <div className="flex items-center gap-3">
              {months.length>0&&<select value={month} onChange={e=>setMonth(e.target.value)} className="text-xs bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-3 py-1.5 text-zinc-300 outline-none">{months.map(m=><option key={m} value={m}>{monthLabel(m)}</option>)}</select>}
              <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${metrics.slaRate>=90?"bg-emerald-400/15 text-emerald-300 border border-emerald-400/30":"bg-red-400/15 text-red-300 border border-red-400/30"}`}>{metrics.slaRate>=90?"✓ ON TRACK":"⚠ AT RISK"}</div>
              <button onClick={()=>isLive?fetchData():setShowSetup(true)} className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors" title={isLive?`Updated ${lastFetch?.toLocaleTimeString()}`:"Connect live data"}>
                {isLive?<><Wifi size={10} className="text-emerald-400"/><span className="text-emerald-400">LIVE</span></>:<><WifiOff size={10} className="text-zinc-500"/><span className="text-zinc-500">OFFLINE</span></>}
              </button>
            </div>
          </div>
          <div className="flex gap-1 -mb-px">{tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${tab===t.id?"border-sky-400 text-sky-300":"border-transparent text-zinc-600 hover:text-zinc-400"}`}><t.icon size={13}/>{t.label}</button>)}</div>
        </div>
      </header>

      {fetchErr&&<div className="max-w-7xl mx-auto px-5 mt-2"><div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300"><AlertTriangle size={13}/>{fetchErr}<button onClick={()=>setShowSetup(true)} className="ml-auto text-sky-400 hover:text-sky-300 font-medium">Reconfigure</button></div></div>}

      <main className="max-w-7xl mx-auto px-5 py-6">

        {tab==="dashboard"&&(
          <div className="space-y-5 anim">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-3 border border-zinc-800/60 rounded-2xl p-6 bg-zinc-900/30 flex flex-col items-center justify-center">
                <SLAGauge percent={metrics.slaRate}/>
                <div className="mt-3 text-center">
                  <div className={`text-xs font-bold ${metrics.slaRate>=90?"text-emerald-400":"text-red-400"}`}>{metrics.slaRate>=90?"✓ Expansion eligible":`✗ ${90-metrics.slaRate}pp below target`}</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">Target: 90% · Gate for 2nd partner</div>
                </div>
              </div>
              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                <Tile icon={Mail} label="Threads" value={metrics.total} sub={`${metrics.actionCount} action · ${metrics.excludedCount} excluded`} color="#60a5fa"/>
                <Tile icon={CheckCircle} label="Resolved" value={metrics.replied+metrics.autoAcked} sub={`${metrics.replied} replied · ${metrics.autoAcked} auto-acked`} color="#34d399"/>
                <Tile icon={Clock} label="Avg Response" value={`${metrics.avgHours}h`} sub={metrics.avgHours<=8?"Within SLA":"Above 8h target"} color={metrics.avgHours<=8?"#34d399":"#f87171"}/>
                <Tile icon={AlertTriangle} label="Issues" value={metrics.breached+metrics.open} sub={`${metrics.breached} breached · ${metrics.open} open`} color={metrics.breached+metrics.open===0?"#34d399":"#f87171"}/>
              </div>
              <div className="lg:col-span-4 border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
                <div className="flex items-center gap-2 mb-3"><Target size={13} className="text-zinc-500"/><span className="text-[10px] uppercase tracking-widest text-zinc-500">Expansion Gate</span></div>
                <div className="mb-3"><div className="flex justify-between text-[11px] mb-1"><span className="text-zinc-400">SLA</span><span className="mono font-bold" style={{color:metrics.slaRate>=90?"#34d399":"#f87171"}}>{metrics.slaRate}%</span></div><div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{width:`${Math.min(metrics.slaRate,100)}%`,background:metrics.slaRate>=90?"#34d399":"#f87171"}}/></div></div>
                <div className="text-[11px] text-zinc-400 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30 leading-relaxed">{isLive?<><span className="text-emerald-400 font-bold">Live:</span> Refreshing every 60s from your triage sheet.</>:<><span className="text-amber-400 font-bold">Offline:</span> Snapshot data. <button onClick={()=>setShowSetup(true)} className="text-sky-400 underline">Connect API</button> for live updates.</>}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><BarChart3 size={12}/>Response Time</h3>
                <div style={{height:220}}>{responseChart.length>0?<ResponsiveContainer width="100%" height="100%"><BarChart data={responseChart} margin={{top:5,right:5,bottom:30,left:0}}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e24"/><XAxis dataKey="name" tick={{fontSize:9,fill:"#52525b"}} angle={-30} textAnchor="end"/><YAxis tick={{fontSize:9,fill:"#52525b"}}/><Tooltip contentStyle={{background:"#18181b",border:"1px solid #27272a",borderRadius:"10px",fontSize:"11px"}}/><Bar dataKey="hours" radius={[6,6,0,0]} name="Hours">{responseChart.map((e,i)=><Cell key={i} fill={e.hours<=8?"#34d399":"#f87171"}/>)}</Bar></BarChart></ResponsiveContainer>:<div className="flex items-center justify-center h-full text-zinc-600 text-xs">No data</div>}</div>
              </div>
              <div className="border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Activity size={12}/>Categories</h3>
                <div style={{height:180}}>{catBreakdown.length>0&&<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={catBreakdown} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35} paddingAngle={3} strokeWidth={0}>{catBreakdown.map((_,i)=><Cell key={i} fill={catCols[i%catCols.length]}/>)}</Pie><Tooltip contentStyle={{background:"#18181b",border:"1px solid #27272a",borderRadius:"10px",fontSize:"11px"}}/></PieChart></ResponsiveContainer>}</div>
                <div className="mt-1 space-y-1">{catBreakdown.map((c,i)=><div key={i} className="flex items-center gap-2 text-[10px]"><span className="w-2 h-2 rounded-full" style={{background:catCols[i%catCols.length]}}/><span className="text-zinc-400 truncate">{c.name}</span><span className="text-zinc-600 mono ml-auto">{c.value}</span></div>)}</div>
              </div>
            </div>
          </div>
        )}

        {tab==="triage"&&(
          <div className="space-y-4 anim">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 max-w-xs"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"/><input type="text" placeholder="Search..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-900/50 border border-zinc-800/60 rounded-lg text-zinc-300 outline-none focus:border-zinc-600"/></div>
              {["all","action","open","replied","breached"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${filter===f?"bg-zinc-700/80 text-zinc-200":"bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800/50"}`}>{f==="all"?"All":f==="action"?"⚡ Action":f==="open"?"⏳ Open":f==="replied"?"✅ Resolved":"🔴 Breached"}</button>)}
              <span className="text-[10px] text-zinc-600 ml-2 mono">{filtered.length}</span>
            </div>
            <div className="space-y-2">{filtered.map(t=><TriageRow key={t.threadId} t={t} expanded={expanded===t.threadId} onToggle={()=>setExpanded(expanded===t.threadId?null:t.threadId)}/>)}{filtered.length===0&&<div className="text-center py-16 text-zinc-600"><CheckCircle size={28} className="mx-auto mb-2 opacity-40"/><p className="text-xs">No threads match</p></div>}</div>
          </div>
        )}

        {tab==="system"&&(
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 anim">
            <div><h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2"><GitBranch size={12}/>Pipeline</h2><div className="border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30"><SystemDiagram/></div></div>
            <div className="space-y-4">
              <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2"><Zap size={12}/>Integrations</h2>
              {[{name:"Zap #1: Inbound → Slack",trigger:"Gmail: *@evastore.co.uk → sam.breznica",act:"Slack → #evastore-triage (instant)"},{name:"Zap #2: Escalation → Slack",trigger:"Webhooks: Catch Hook (Apps Script)",act:"Slack → #evastore-triage (escalations)"},{name:"Zap #3: Reply → Confirmation",trigger:"Gmail: sam.breznica → *@evastore.co.uk",act:"Slack → #evastore-triage (✅ resolved)"}].map((z,i)=>
                <div key={i} className="border border-zinc-800/60 rounded-xl p-4 bg-zinc-900/30">
                  <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Zap size={13} className="text-orange-400"/><span className="text-xs font-bold text-zinc-200">{z.name}</span></div><span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 font-bold tracking-wider">LIVE</span></div>
                  <p className="text-[10px] text-sky-400 font-mono mb-1">{z.trigger}</p><p className="text-[11px] text-zinc-400">{z.act}</p>
                </div>
              )}
            </div>
            <div className="lg:col-span-2 border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
              <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Settings size={12}/>Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[{n:"Gmail",d:"Inbound + reply tracking",s:true},{n:"Apps Script",d:"Classification + escalation",s:true},{n:"Google Sheets",d:"Single source of truth",s:true},{n:"Zapier (×3)",d:"Inbound, escalation, reply",s:true},{n:"Slack",d:"#evastore-triage",s:true},{n:"Auto-Ack",d:"Weekly Roundups auto-replied",s:true},{n:"Command Centre",d:isLive?"Live — 60s refresh":"Offline — connect API",s:isLive},{n:"SMS (T+7h)",d:"Final warning via Zapier",s:false}].map((c,i)=>
                  <div key={i} className="p-3 rounded-xl bg-zinc-800/20 border border-zinc-800/40"><div className="flex items-center justify-between mb-1"><span className="text-xs font-bold text-zinc-200">{c.n}</span><span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider ${c.s?"bg-emerald-400/15 text-emerald-300 border border-emerald-400/30":"bg-zinc-700/50 text-zinc-400 border border-zinc-600/30"}`}>{c.s?"Active":"Ready"}</span></div><p className="text-[10px] text-zinc-500">{c.d}</p></div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab==="alerts"&&(
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 anim">
            <div><h2 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2"><Timer size={12}/>Escalation Ladder</h2><div className="border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30"><EscalationTimeline/></div></div>
            <div className="space-y-4">
              <div className="border border-zinc-800/60 rounded-2xl p-5 bg-zinc-900/30">
                <h3 className="text-xs font-bold text-zinc-200 mb-3">Classification Rules</h3>
                {[{i:"📦",l:"Post / Dispatch",k:"post, dispatch, delivery",p:"P1"},{i:"🗄️",l:"Will Storage",k:"will box, storage",p:"P1"},{i:"📄",l:"WSL Documents",k:"wsl, document",p:"P1"},{i:"👤",l:"Testator Query",k:"testator, address",p:"P1"},{i:"⚙️",l:"HubSpot / Access",k:"hubspot, login, access",p:"P2"},{i:"✅",l:"Will Marking",k:"marking, copied",p:"P2"},{i:"📊",l:"Weekly Roundup",k:"weekly round",p:"P3 FYI"}].map((r,idx)=>
                  <div key={idx} className="flex items-center gap-3 text-[11px] mb-2"><span>{r.i}</span><div className="flex-1"><span className="text-zinc-200 font-semibold">{r.l}</span><span className="text-zinc-600 ml-2 font-mono text-[9px]">{r.k}</span></div><span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${r.p.startsWith("P1")?"text-red-400 bg-red-400/10 border border-red-400/20":r.p.startsWith("P2")?"text-amber-400 bg-amber-400/10 border border-amber-400/20":"text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"}`}>{r.p}</span></div>
                )}
              </div>
              <div className="border border-sky-500/20 rounded-2xl p-5 bg-sky-500/[0.03]">
                <h3 className="text-xs font-bold text-sky-300 mb-2 flex items-center gap-2"><BookOpen size={12}/>How It Works</h3>
                <div className="text-[11px] text-zinc-400 space-y-2 leading-relaxed">
                  <p><span className="text-sky-300 font-bold">AUTO-ACKED ✓</span> = Apps Script auto-sent an ack email (e.g. Weekly Roundups). Removed from SLA calculation.</p>
                  <p><span className="text-orange-300 font-bold">REPLIED (LATE)</span> = You replied after the 8h window. Counts as actioned but impacts SLA %.</p>
                  <p><span className="text-zinc-300 font-bold">EXCLUDED</span> = Thread excluded — Jorge replied, or system-generated notification.</p>
                  <p><span className="text-emerald-300 font-bold">LIVE MODE</span> = {isLive?"Active! Fetching from your sheet every 60s. New triage entries appear automatically.":"Not connected. Click the OFFLINE button to connect your API endpoint."}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800/40 mt-10"><div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between"><span className="text-[9px] text-zinc-700">Octopus Legacy — Evastore Partner Ops</span><span className="text-[9px] text-zinc-700">{isLive?`Live · ${lastFetch?.toLocaleTimeString()||"—"}`:"Offline · Snapshot"}</span></div></footer>
    </div>
  );
}
