import React from 'react';

// Illustration 1: Woman examining a folder by an office filing shelf
export const OfficeWomanPhoto: React.FC = () => (
  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center select-none">
    <svg
      viewBox="0 0 600 360"
      className="w-full h-full object-cover"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="shelfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="folderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Office Wall Background */}
      <rect width="600" height="360" fill="url(#wallGrad)" />

      {/* Office Window with city skyline grid */}
      <rect x="30" y="30" width="180" height="220" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="3" />
      <line x1="120" y1="30" x2="120" y2="250" stroke="#334155" strokeWidth="2" />
      <line x1="30" y1="140" x2="210" y2="140" stroke="#334155" strokeWidth="2" />
      <rect x="50" y="100" width="30" height="150" fill="#1e293b" opacity="0.6" />
      <rect x="90" y="80" width="40" height="170" fill="#1e293b" opacity="0.8" />
      <rect x="140" y="120" width="35" height="130" fill="#1e293b" opacity="0.5" />

      {/* Office Floor */}
      <rect x="0" y="290" width="600" height="70" fill="#0b0f19" />
      <line x1="0" y1="290" x2="600" y2="290" stroke="#1e293b" strokeWidth="2" />

      {/* Filing Shelves Unit */}
      <rect x="380" y="40" width="190" height="260" rx="6" fill="url(#shelfGrad)" stroke="#475569" strokeWidth="2" />
      <line x1="380" y1="110" x2="570" y2="110" stroke="#475569" strokeWidth="3" />
      <line x1="380" y1="180" x2="570" y2="180" stroke="#475569" strokeWidth="3" />
      <line x1="380" y1="240" x2="570" y2="240" stroke="#475569" strokeWidth="3" />

      {/* Folders & binders on shelf */}
      <rect x="395" y="55" width="14" height="52" rx="2" fill="#3b82f6" />
      <rect x="412" y="52" width="14" height="55" rx="2" fill="#f59e0b" />
      <rect x="429" y="57" width="16" height="50" rx="2" fill="#10b981" />
      <rect x="448" y="50" width="14" height="57" rx="2" fill="#ef4444" />
      <rect x="465" y="54" width="14" height="53" rx="2" fill="#64748b" />
      <rect x="490" y="65" width="65" height="42" rx="3" fill="#1e293b" stroke="#475569" />

      <rect x="395" y="125" width="15" height="52" rx="2" fill="#64748b" />
      <rect x="413" y="120" width="18" height="57" rx="2" fill="#3b82f6" />
      <rect x="434" y="128" width="14" height="49" rx="2" fill="#8b5cf6" />
      <rect x="451" y="122" width="16" height="55" rx="2" fill="#f59e0b" />
      <rect x="480" y="135" width="70" height="42" rx="3" fill="#334155" />

      {/* Woman Character examining folder */}
      <g transform="translate(250, 80)">
        <ellipse cx="65" cy="40" rx="24" ry="26" fill="#78350f" />
        <circle cx="65" cy="40" r="18" fill="#fcd34d" />
        <path d="M 45 35 Q 65 15 85 35 Q 85 25 70 20 Q 55 18 45 35 Z" fill="#92400e" />
        <rect x="60" y="55" width="10" height="12" fill="#fcd34d" />
        <path d="M 40 68 L 90 68 L 95 160 L 35 160 Z" fill="url(#suitGrad)" />
        <polygon points="60,68 70,68 65,95" fill="#f8fafc" />
        <rect x="46" y="160" width="16" height="110" fill="#1e293b" />
        <rect x="68" y="160" width="16" height="110" fill="#1e293b" />
        <ellipse cx="54" cy="272" rx="12" ry="5" fill="#020617" />
        <ellipse cx="76" cy="272" rx="12" ry="5" fill="#020617" />

        <path d="M 42 75 L 75 110 L 88 105" stroke="#475569" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 88 75 L 82 110 L 98 112" stroke="#334155" strokeWidth="11" strokeLinecap="round" fill="none" />
        <circle cx="88" cy="106" r="6" fill="#fcd34d" />
        <circle cx="102" cy="112" r="6" fill="#fcd34d" />

        <g transform="translate(85, 80) rotate(-15)">
          <polygon points="0,0 28,-10 32,35 2,42" fill="url(#folderGrad)" stroke="#60a5fa" strokeWidth="1.5" />
          <polygon points="5,3 26,-6 29,32 7,38" fill="#ffffff" />
          <line x1="9" y1="8" x2="23" y2="4" stroke="#94a3b8" strokeWidth="1" />
          <line x1="10" y1="14" x2="24" y2="10" stroke="#94a3b8" strokeWidth="1" />
          <line x1="11" y1="20" x2="25" y2="16" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="28,-10 52,-5 55,38 32,35" fill="url(#folderGrad)" stroke="#60a5fa" strokeWidth="1.5" />
        </g>
      </g>

      <rect x="15" y="15" width="85" height="24" rx="4" fill="#0f172a" fillOpacity="0.8" />
      <text x="24" y="31" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">PART 1 • PHOTO</text>
    </svg>
  </div>
);

// Illustration 2: Conference room with neat chairs around a large table (Static scene)
export const ConferenceRoomPhoto: React.FC = () => (
  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center select-none">
    <svg
      viewBox="0 0 600 360"
      className="w-full h-full object-cover"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="roomWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="tableTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="50%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>

      <rect width="600" height="360" fill="url(#roomWall)" />

      {/* Large Glass Window */}
      <rect x="60" y="20" width="480" height="150" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="3" />
      <line x1="220" y1="20" x2="220" y2="170" stroke="#334155" strokeWidth="2" />
      <line x1="380" y1="20" x2="380" y2="170" stroke="#334155" strokeWidth="2" />
      <rect x="90" y="80" width="50" height="90" fill="#1e293b" opacity="0.7" />
      <rect x="150" y="60" width="40" height="110" fill="#334155" opacity="0.6" />
      <rect x="250" y="70" width="60" height="100" fill="#1e293b" opacity="0.8" />
      <rect x="330" y="50" width="45" height="120" fill="#334155" opacity="0.5" />

      {/* Carpet Floor */}
      <polygon points="0,210 600,210 600,360 0,360" fill="#090d16" />

      {/* Back Chairs */}
      {[160, 240, 320, 400].map((cx, idx) => (
        <g key={`back-chair-${idx}`}>
          <rect x={cx - 16} y="155" width="32" height="38" rx="6" fill="#334155" stroke="#1e293b" strokeWidth="2" />
          <rect x={cx - 3} y="193" width="6" height="20" fill="#64748b" />
        </g>
      ))}

      {/* Executive Conference Table */}
      <ellipse cx="300" cy="245" rx="220" ry="42" fill="url(#tableTop)" stroke="#b45309" strokeWidth="2" />
      <ellipse cx="300" cy="242" rx="195" ry="32" fill="none" stroke="#fde68a" strokeWidth="1" opacity="0.25" />
      <ellipse cx="300" cy="242" rx="12" ry="4" fill="#0f172a" />

      {/* Front Chairs */}
      {[130, 215, 300, 385, 470].map((cx, idx) => (
        <g key={`front-chair-${idx}`} transform={`translate(${cx}, 260)`}>
          <rect x="-4" y="50" width="8" height="25" fill="#64748b" />
          <ellipse cx="0" cy="50" rx="26" ry="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="-22" y="0" width="44" height="48" rx="8" fill="#475569" stroke="#64748b" strokeWidth="2" />
          <rect x="-14" y="-14" width="28" height="12" rx="4" fill="#334155" />
        </g>
      ))}

      <rect x="15" y="15" width="85" height="24" rx="4" fill="#0f172a" fillOpacity="0.8" />
      <text x="24" y="31" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">PART 1 • PHOTO</text>
    </svg>
  </div>
);

// Illustration 3: Man typing at a laptop workstation
export const ManTypingLaptopPhoto: React.FC = () => (
  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center select-none">
    <svg viewBox="0 0 600 360" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="officeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#officeGrad)" />
      {/* Desk */}
      <rect x="50" y="220" width="500" height="130" fill="#334155" stroke="#475569" strokeWidth="2" rx="4" />
      {/* Monitor on right desk */}
      <rect x="420" y="120" width="110" height="85" rx="4" fill="#020617" stroke="#64748b" strokeWidth="2" />
      <rect x="430" y="130" width="90" height="65" fill="#1e3a8a" opacity="0.8" />
      <rect x="468" y="205" width="14" height="20" fill="#64748b" />
      <ellipse cx="475" cy="225" rx="25" ry="5" fill="#475569" />
      {/* Coffee mug */}
      <rect x="100" y="200" width="22" height="28" rx="3" fill="#f8fafc" />
      <path d="M 122 206 C 130 206 130 222 122 222" stroke="#f8fafc" strokeWidth="3" fill="none" />
      {/* Man typing */}
      <g transform="translate(200, 70)">
        <ellipse cx="70" cy="40" rx="22" ry="24" fill="#1e293b" />
        <circle cx="70" cy="42" r="16" fill="#fbcfe8" />
        {/* Glasses */}
        <circle cx="64" cy="42" r="5" stroke="#020617" strokeWidth="2" fill="none" />
        <circle cx="76" cy="42" r="5" stroke="#020617" strokeWidth="2" fill="none" />
        <line x1="69" y1="42" x2="71" y2="42" stroke="#020617" strokeWidth="2" />
        {/* Shirt */}
        <path d="M 40 70 L 100 70 L 110 160 L 30 160 Z" fill="#2563eb" />
        {/* Arms reaching to laptop keyboard */}
        <path d="M 45 80 L 25 140 L 70 155" stroke="#1d4ed8" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 95 80 L 115 140 L 75 155" stroke="#1d4ed8" strokeWidth="12" strokeLinecap="round" fill="none" />
      </g>
      {/* Laptop */}
      <polygon points="230,195 310,195 330,230 210,230" fill="#94a3b8" />
      <polygon points="235,135 305,135 310,195 230,195" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
      <rect x="240" y="140" width="60" height="50" fill="#38bdf8" opacity="0.6" />
      <rect x="15" y="15" width="85" height="24" rx="4" fill="#0f172a" fillOpacity="0.8" />
      <text x="24" y="31" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">PART 1 • PHOTO</text>
    </svg>
  </div>
);

// Illustration 4: Warehouse worker moving boxes on a cart
export const WarehouseLoadingPhoto: React.FC = () => (
  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center select-none">
    <svg viewBox="0 0 600 360" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="360" fill="#0f172a" />
      {/* Storage Racks */}
      <line x1="60" y1="20" x2="60" y2="300" stroke="#f59e0b" strokeWidth="6" />
      <line x1="200" y1="20" x2="200" y2="300" stroke="#f59e0b" strokeWidth="6" />
      <line x1="60" y1="90" x2="200" y2="90" stroke="#f59e0b" strokeWidth="4" />
      <line x1="60" y1="180" x2="200" y2="180" stroke="#f59e0b" strokeWidth="4" />
      {/* Pallet boxes on racks */}
      <rect x="70" y="40" width="55" height="45" fill="#b45309" stroke="#78350f" rx="2" />
      <rect x="135" y="40" width="55" height="45" fill="#d97706" stroke="#78350f" rx="2" />
      <rect x="70" y="130" width="120" height="45" fill="#b45309" stroke="#78350f" rx="2" />
      {/* Floor */}
      <rect x="0" y="270" width="600" height="90" fill="#1e293b" />
      <line x1="0" y1="270" x2="600" y2="270" stroke="#475569" strokeWidth="2" />
      {/* Hand cart with boxes */}
      <g transform="translate(320, 160)">
        {/* Cart frame */}
        <line x1="120" y1="40" x2="30" y2="130" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
        <line x1="10" y1="140" x2="60" y2="140" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
        <circle cx="35" cy="140" r="16" fill="#020617" stroke="#64748b" strokeWidth="4" />
        {/* Cardboard boxes stacked on cart */}
        <rect x="30" y="70" width="50" height="45" fill="#d97706" stroke="#92400e" strokeWidth="2" rx="2" />
        <rect x="35" y="25" width="45" height="45" fill="#b45309" stroke="#78350f" strokeWidth="2" rx="2" />
        {/* Worker holding cart handles */}
        <circle cx="140" cy="20" r="15" fill="#fcd34d" />
        {/* Safety Vest */}
        <path d="M 125 40 L 155 40 L 155 110 L 125 110 Z" fill="#84cc16" />
        <line x1="130" y1="40" x2="130" y2="110" stroke="#ffffff" strokeWidth="4" />
        <line x1="150" y1="40" x2="150" y2="110" stroke="#ffffff" strokeWidth="4" />
        {/* Arms to handle */}
        <path d="M 130 50 L 115 70 L 118 45" stroke="#65a30d" strokeWidth="8" strokeLinecap="round" fill="none" />
        {/* Legs */}
        <rect x="127" y="110" width="10" height="45" fill="#1e3a8a" />
        <rect x="142" y="110" width="10" height="45" fill="#1e3a8a" />
      </g>
      <rect x="15" y="15" width="85" height="24" rx="4" fill="#0f172a" fillOpacity="0.8" />
      <text x="24" y="31" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">PART 1 • PHOTO</text>
    </svg>
  </div>
);

// Illustration 5: Construction worker examining blueprints outdoors
export const ConstructionWorkerPhoto: React.FC = () => (
  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center select-none">
    <svg viewBox="0 0 600 360" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#skyGrad)" />
      {/* Background scaffolding & crane */}
      <line x1="480" y1="40" x2="480" y2="300" stroke="#334155" strokeWidth="4" />
      <line x1="420" y1="40" x2="560" y2="40" stroke="#334155" strokeWidth="3" />
      <line x1="420" y1="40" x2="480" y2="10" stroke="#334155" strokeWidth="2" />
      <line x1="480" y1="10" x2="560" y2="40" stroke="#334155" strokeWidth="2" />
      {/* Building under construction */}
      <rect x="360" y="120" width="180" height="180" fill="#475569" opacity="0.7" />
      {[140, 180, 220].map((y, idx) => (
        <line key={`beam-${idx}`} x1="360" y1={y} x2="540" y2={y} stroke="#f59e0b" strokeWidth="2" />
      ))}
      {/* Ground */}
      <rect x="0" y="270" width="600" height="90" fill="#78350f" opacity="0.9" />
      {/* Construction worker holding unrolled blueprints */}
      <g transform="translate(180, 80)">
        {/* Yellow Hardhat */}
        <path d="M 60 40 Q 80 15 100 40 Z" fill="#eab308" />
        <rect x="55" y="38" width="50" height="6" rx="2" fill="#ca8a04" />
        {/* Head */}
        <circle cx="80" cy="52" r="14" fill="#fcd34d" />
        {/* Hi-vis vest */}
        <path d="M 55 70 L 105 70 L 110 150 L 50 150 Z" fill="#ea580c" />
        <line x1="70" y1="70" x2="70" y2="150" stroke="#ffffff" strokeWidth="5" />
        <line x1="90" y1="70" x2="90" y2="150" stroke="#ffffff" strokeWidth="5" />
        {/* Arms holding blueprints */}
        <path d="M 55 80 L 40 120 L 70 125" stroke="#c2410c" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M 105 80 L 120 120 L 95 125" stroke="#c2410c" strokeWidth="10" strokeLinecap="round" fill="none" />
        {/* Blueprint sheet */}
        <polygon points="35,115 125,115 130,155 30,155" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
        <line x1="45" y1="125" x2="115" y2="125" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />
        <line x1="45" y1="135" x2="115" y2="135" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />
        <line x1="45" y1="145" x2="100" y2="145" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />
        {/* Legs */}
        <rect x="62" y="150" width="14" height="65" fill="#1e3a8a" />
        <rect x="84" y="150" width="14" height="65" fill="#1e3a8a" />
      </g>
      <rect x="15" y="15" width="85" height="24" rx="4" fill="#0f172a" fillOpacity="0.8" />
      <text x="24" y="31" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">PART 1 • PHOTO</text>
    </svg>
  </div>
);

// Illustration 6: Chef chopping food in a restaurant kitchen
export const ChefPreparingFoodPhoto: React.FC = () => (
  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center select-none">
    <svg viewBox="0 0 600 360" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="360" fill="#1e293b" />
      {/* Tiled kitchen wall */}
      <line x1="0" y1="80" x2="600" y2="80" stroke="#334155" strokeWidth="1" />
      <line x1="0" y1="140" x2="600" y2="140" stroke="#334155" strokeWidth="1" />
      {/* Hanging pots */}
      <circle cx="100" cy="60" r="18" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
      <line x1="100" y1="20" x2="100" y2="42" stroke="#94a3b8" strokeWidth="3" />
      <circle cx="160" cy="55" r="14" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
      <line x1="160" y1="20" x2="160" y2="41" stroke="#94a3b8" strokeWidth="3" />
      {/* Kitchen Countertop */}
      <rect x="40" y="210" width="520" height="130" fill="#64748b" stroke="#94a3b8" strokeWidth="2" rx="4" />
      {/* Cutting board with vegetables */}
      <rect x="230" y="200" width="140" height="25" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      <circle cx="260" cy="210" r="6" fill="#ef4444" />
      <circle cx="280" cy="208" r="7" fill="#10b981" />
      <circle cx="300" cy="212" r="6" fill="#f59e0b" />
      {/* Chef in white uniform */}
      <g transform="translate(250, 45)">
        {/* Chef Toque hat */}
        <path d="M 35 30 Q 50 5 65 30 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <ellipse cx="50" cy="20" rx="20" ry="12" fill="#ffffff" />
        <rect x="36" y="25" width="28" height="10" fill="#ffffff" />
        <circle cx="50" cy="48" r="14" fill="#fcd34d" />
        {/* White double-breasted jacket */}
        <path d="M 25 65 L 75 65 L 80 160 L 20 160 Z" fill="#ffffff" />
        <circle cx="45" cy="85" r="2.5" fill="#0f172a" />
        <circle cx="55" cy="85" r="2.5" fill="#0f172a" />
        <circle cx="45" cy="110" r="2.5" fill="#0f172a" />
        <circle cx="55" cy="110" r="2.5" fill="#0f172a" />
        {/* Arms holding kitchen knife */}
        <path d="M 25 75 L 10 130 L 45 155" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M 75 75 L 85 130 L 55 155" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" fill="none" />
        {/* Knife */}
        <polygon points="50,152 75,152 70,162 48,160" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
        <rect x="40" y="150" width="10" height="4" fill="#78350f" />
      </g>
      <rect x="15" y="15" width="85" height="24" rx="4" fill="#0f172a" fillOpacity="0.8" />
      <text x="24" y="31" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">PART 1 • PHOTO</text>
    </svg>
  </div>
);

// Illustration 7: Customer handing credit card to cashier
export const CustomerCashierPhoto: React.FC = () => (
  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center select-none">
    <svg viewBox="0 0 600 360" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="360" fill="#0f172a" />
      {/* Checkout Counter */}
      <rect x="180" y="180" width="240" height="160" fill="#334155" stroke="#475569" strokeWidth="2" />
      {/* Cash register / POS Terminal */}
      <rect x="250" y="140" width="55" height="40" rx="3" fill="#020617" stroke="#64748b" strokeWidth="2" />
      <rect x="258" y="145" width="40" height="20" fill="#10b981" opacity="0.8" />
      <polygon points="245,178 310,178 300,195 240,195" fill="#475569" />
      {/* Customer on Left extending arm with payment card */}
      <g transform="translate(60, 90)">
        <circle cx="50" cy="30" r="16" fill="#fcd34d" />
        <path d="M 25 50 L 75 50 L 80 160 L 20 160 Z" fill="#9333ea" />
        {/* Arm reaching across counter holding card */}
        <path d="M 65 60 L 120 90 L 160 90" stroke="#7e22ce" strokeWidth="10" strokeLinecap="round" fill="none" />
        {/* Credit card */}
        <rect x="160" y="82" width="22" height="14" rx="2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
      </g>
      {/* Cashier on Right receiving payment */}
      <g transform="translate(420, 80)">
        <circle cx="50" cy="30" r="16" fill="#fcd34d" />
        {/* Uniform apron */}
        <path d="M 25 50 L 75 50 L 80 160 L 20 160 Z" fill="#059669" />
        <path d="M 35 60 L 10 95 L -20 95" stroke="#047857" strokeWidth="10" strokeLinecap="round" fill="none" />
      </g>
      <rect x="15" y="15" width="85" height="24" rx="4" fill="#0f172a" fillOpacity="0.8" />
      <text x="24" y="31" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">PART 1 • PHOTO</text>
    </svg>
  </div>
);

// Illustration 8: Reader reaching for a book on a library bookshelf
export const LibraryReaderPhoto: React.FC = () => (
  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center select-none">
    <svg viewBox="0 0 600 360" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="360" fill="#0b0f19" />
      {/* Tall Wooden Bookcase on Left */}
      <rect x="40" y="20" width="240" height="320" rx="4" fill="#451a03" stroke="#78350f" strokeWidth="3" />
      {[90, 160, 230, 300].map((y, idx) => (
        <line key={`lib-shelf-${idx}`} x1="40" y1={y} x2="280" y2={y} stroke="#78350f" strokeWidth="4" />
      ))}
      {/* Books on top shelf */}
      {[55, 75, 95, 115, 140, 165, 190, 215, 240].map((x, idx) => {
        const colors = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#0284c7'];
        const c = colors[idx % colors.length];
        return <rect key={`b-${idx}`} x={x} y="40" width="18" height="50" rx="2" fill={c} />;
      })}
      {/* Reader reaching up */}
      <g transform="translate(320, 80)">
        <circle cx="50" cy="50" r="16" fill="#fcd34d" />
        <path d="M 30 70 L 70 70 L 75 180 L 25 180 Z" fill="#0284c7" />
        {/* Raised arm reaching left towards books */}
        <path d="M 40 80 L 0 50 L -40 40" stroke="#0369a1" strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="-42" cy="40" r="5" fill="#fcd34d" />
        {/* Legs */}
        <rect x="35" y="180" width="14" height="85" fill="#1e293b" />
        <rect x="55" y="180" width="14" height="85" fill="#1e293b" />
      </g>
      <rect x="15" y="15" width="85" height="24" rx="4" fill="#0f172a" fillOpacity="0.8" />
      <text x="24" y="31" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">PART 1 • PHOTO</text>
    </svg>
  </div>
);

// Illustration 9: Airport luggage conveyor carousel
export const AirportConveyorPhoto: React.FC = () => (
  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center select-none">
    <svg viewBox="0 0 600 360" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="360" fill="#0f172a" />
      {/* Ceiling lights */}
      <ellipse cx="200" cy="30" rx="40" ry="10" fill="#38bdf8" opacity="0.3" />
      <ellipse cx="400" cy="30" rx="40" ry="10" fill="#38bdf8" opacity="0.3" />
      {/* Flight info sign */}
      <rect x="220" y="50" width="160" height="40" rx="4" fill="#020617" stroke="#eab308" strokeWidth="2" />
      <text x="235" y="75" fill="#eab308" fontSize="12" fontWeight="700" fontFamily="monospace">CAROUSEL 4 • ARRIVALS</text>
      {/* Conveyor Belt Loop (Ellipse) */}
      <ellipse cx="300" cy="240" rx="230" ry="60" fill="#1e293b" stroke="#64748b" strokeWidth="8" />
      <ellipse cx="300" cy="240" rx="160" ry="35" fill="#0f172a" stroke="#475569" strokeWidth="4" />
      {/* Suitcases on belt */}
      <rect x="130" y="215" width="38" height="24" rx="3" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
      <rect x="220" y="250" width="45" height="28" rx="3" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
      <rect x="360" y="255" width="42" height="26" rx="3" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
      <rect x="440" y="210" width="40" height="25" rx="3" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
      <rect x="15" y="15" width="85" height="24" rx="4" fill="#0f172a" fillOpacity="0.8" />
      <text x="24" y="31" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">PART 1 • PHOTO</text>
    </svg>
  </div>
);

// Illustration 10: Park bench and water fountain (Static outdoor scene)
export const ParkBenchFountainPhoto: React.FC = () => (
  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center select-none">
    <svg viewBox="0 0 600 360" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="parkSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#parkSky)" />
      {/* Trees in background */}
      <ellipse cx="100" cy="120" rx="60" ry="70" fill="#065f46" />
      <ellipse cx="500" cy="120" rx="60" ry="70" fill="#065f46" />
      {/* Stone ground walkway */}
      <rect x="0" y="220" width="600" height="140" fill="#334155" />
      {/* Fountain in center background */}
      <ellipse cx="300" cy="180" rx="80" ry="25" fill="#0284c7" stroke="#94a3b8" strokeWidth="3" />
      <ellipse cx="300" cy="165" rx="40" ry="12" fill="#38bdf8" stroke="#cbd5e1" strokeWidth="2" />
      {/* Water jet spray */}
      <line x1="300" y1="165" x2="300" y2="120" stroke="#bae6fd" strokeWidth="3" />
      <path d="M 300 120 Q 280 140 270 160" stroke="#bae6fd" strokeWidth="2" fill="none" />
      <path d="M 300 120 Q 320 140 330 160" stroke="#bae6fd" strokeWidth="2" fill="none" />
      {/* Wooden Park Bench in foreground on right */}
      <g transform="translate(140, 230)">
        <rect x="0" y="0" width="160" height="10" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        <rect x="0" y="14" width="160" height="10" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        <rect x="0" y="28" width="160" height="10" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        {/* Bench cast iron legs */}
        <line x1="20" y1="0" x2="15" y2="70" stroke="#0f172a" strokeWidth="5" />
        <line x1="140" y1="0" x2="145" y2="70" stroke="#0f172a" strokeWidth="5" />
      </g>
      <rect x="15" y="15" width="85" height="24" rx="4" fill="#0f172a" fillOpacity="0.8" />
      <text x="24" y="31" fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="monospace">PART 1 • PHOTO</text>
    </svg>
  </div>
);

// Graphic 1: Flight Schedule Table for Part 3
export const FlightScheduleGraphic: React.FC = () => (
  <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 shadow-lg">
    <div className="flex items-center justify-between pb-3 border-b border-slate-700">
      <div>
        <h4 className="text-sm font-bold text-sky-400">Departures to Chicago (ORD)</h4>
        <p className="text-xs text-slate-400">Date: Friday, October 14</p>
      </div>
      <span className="text-xs px-2 py-1 bg-sky-950 text-sky-300 rounded font-mono border border-sky-800">
        GATE INFORMATION
      </span>
    </div>
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-xs text-left">
        <thead className="bg-slate-800 text-slate-300 font-semibold uppercase">
          <tr>
            <th className="p-2">Flight</th>
            <th className="p-2">Departs</th>
            <th className="p-2">Arrives</th>
            <th className="p-2">Gate</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          <tr className="hover:bg-slate-800/50">
            <td className="p-2 font-mono font-bold text-sky-300">PA 204</td>
            <td className="p-2">07:15 AM</td>
            <td className="p-2">09:30 AM</td>
            <td className="p-2 font-semibold">B12</td>
            <td className="p-2 text-emerald-400">On Time</td>
          </tr>
          <tr className="hover:bg-slate-800/50">
            <td className="p-2 font-mono font-bold text-sky-300">PA 318</td>
            <td className="p-2">10:45 AM</td>
            <td className="p-2">01:00 PM</td>
            <td className="p-2 font-semibold">B18</td>
            <td className="p-2 text-rose-400">Delayed (Mech)</td>
          </tr>
          <tr className="hover:bg-slate-800/50">
            <td className="p-2 font-mono font-bold text-sky-300">PA 520</td>
            <td className="p-2">02:30 PM</td>
            <td className="p-2">04:45 PM</td>
            <td className="p-2 font-semibold">C04</td>
            <td className="p-2 text-emerald-400">On Time</td>
          </tr>
          <tr className="hover:bg-slate-800/50">
            <td className="p-2 font-mono font-bold text-sky-300">PA 612</td>
            <td className="p-2">06:15 PM</td>
            <td className="p-2">08:30 PM</td>
            <td className="p-2 font-semibold">C11</td>
            <td className="p-2 text-emerald-400">On Time</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// Graphic 2: Retail Floor Directory Map for Part 4
export const StoreDirectoryGraphic: React.FC = () => (
  <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 shadow-lg">
    <div className="flex items-center justify-between pb-3 border-b border-slate-700">
      <div>
        <h4 className="text-sm font-bold text-amber-400">Grand Central Department Store</h4>
        <p className="text-xs text-slate-400">Weekend Super Sale — Floor Directory</p>
      </div>
      <span className="text-xs px-2 py-1 bg-amber-950 text-amber-300 rounded font-mono border border-amber-800">
        STORE MAP
      </span>
    </div>
    <div className="mt-3 space-y-2 text-xs">
      <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-750">
        <span className="font-bold text-amber-300 w-16">Floor 1</span>
        <span className="flex-1 text-slate-300">Cosmetics, Fragrances & Luxury Jewelry</span>
      </div>
      <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-750">
        <span className="font-bold text-amber-300 w-16">Floor 2</span>
        <span className="flex-1 text-slate-300">Women's Designer Wear & Men's Formal Apparel</span>
      </div>
      <div className="flex items-center justify-between p-2 rounded bg-amber-500/10 border border-amber-500/40">
        <span className="font-bold text-amber-300 w-16">Floor 3</span>
        <span className="flex-1 text-amber-200">
          Home Goods & Bedding <em className="text-xs text-amber-400 font-normal">(*Kitchenware moved to Floor 4 Annex)</em>
        </span>
      </div>
      <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-750">
        <span className="font-bold text-amber-300 w-16">Floor 4</span>
        <span className="flex-1 text-slate-300">Small Kitchen Appliances (Annex), Electronics & Customer Service</span>
      </div>
    </div>
  </div>
);
