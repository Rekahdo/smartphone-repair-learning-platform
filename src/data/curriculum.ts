// Curriculum data for RepairMaster Academy
export type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: string;
  xp: number;
  type: "theory" | "practice" | "quiz" | "simulation";
};

export type Module = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  lessons: Lesson[];
};

export type Level = {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  color: string;
  modules: Module[];
};

export const levels: Level[] = [
  {
    id: "l1",
    title: "Level 1 — Foundation Technician",
    tagline: "Master the basics of smartphone anatomy, tools, and common repairs.",
    badge: "🛠️",
    color: "from-sky-500 to-blue-600",
    modules: [
      {
        id: "m1",
        title: "Smartphone Fundamentals",
        subtitle: "Anatomy, components & architecture",
        icon: "📱",
        color: "sky",
        lessons: [
          { id: "l1-1", title: "Smartphone Anatomy", description: "Learn the external and internal layout of modern smartphones.", duration: "12 min", xp: 50, type: "theory" },
          { id: "l1-2", title: "Internal Components", description: "Identify battery, screen, cameras, motherboard, speaker & mic.", duration: "15 min", xp: 60, type: "theory" },
          { id: "l1-3", title: "Android vs iPhone Architecture", description: "Compare hardware layouts, SoC families, and design philosophies.", duration: "10 min", xp: 50, type: "theory" },
          { id: "l1-4", title: "3D Device Explorer", description: "Click components on a virtual phone to see function & failures.", duration: "20 min", xp: 100, type: "simulation" },
          { id: "l1-5", title: "Module Quiz", description: "Test your knowledge of smartphone fundamentals.", duration: "8 min", xp: 80, type: "quiz" },
        ],
      },
      {
        id: "m2",
        title: "Repair Tools Introduction",
        subtitle: "Build your tool bench & master each tool",
        icon: "🧰",
        color: "emerald",
        lessons: [
          { id: "l2-1", title: "Beginner Tool Checklist", description: "Screwdrivers, tweezers, pry tools, heat gun, multimeter & more.", duration: "10 min", xp: 40, type: "theory" },
          { id: "l2-2", title: "Tool Bench Setup", description: "Organize your workspace for efficiency and safety.", duration: "12 min", xp: 50, type: "practice" },
          { id: "l2-3", title: "Safety & ESD", description: "Electrostatic discharge protection & safety protocols.", duration: "8 min", xp: 40, type: "theory" },
          { id: "l2-4", title: "Tool Mastery Quiz", description: "Identify tools by purpose and safety warnings.", duration: "6 min", xp: 60, type: "quiz" },
        ],
      },
      {
        id: "m3",
        title: "Phone Disassembly",
        subtitle: "Open Samsung, Xiaomi, Tecno, Infinix & iPhone",
        icon: "🔧",
        color: "amber",
        lessons: [
          { id: "l3-1", title: "Opening Samsung Devices", description: "Back cover removal, adhesive handling and frame separation.", duration: "15 min", xp: 70, type: "practice" },
          { id: "l3-2", title: "Opening Xiaomi / Redmi", description: "Common layouts and hidden screws on Xiaomi devices.", duration: "12 min", xp: 60, type: "practice" },
          { id: "l3-3", title: "Opening Tecno & Infinix", description: "Budget-friendly practice devices for beginners.", duration: "10 min", xp: 50, type: "practice" },
          { id: "l3-4", title: "Opening iPhones", description: "Display-first opening, waterproof seals and pentalobe screws.", duration: "18 min", xp: 90, type: "practice" },
          { id: "l3-5", title: "Disassembly Workflow Simulator", description: "Drag steps into correct order — battery disconnect first!", duration: "15 min", xp: 120, type: "simulation" },
        ],
      },
      {
        id: "m4",
        title: "Common Hardware Repairs",
        subtitle: "Screen, battery, charging port, speaker & camera",
        icon: "🔋",
        color: "rose",
        lessons: [
          { id: "l4-1", title: "Screen Replacement", description: "Full procedure from disassembly to testing new display.", duration: "25 min", xp: 150, type: "practice" },
          { id: "l4-2", title: "Battery Replacement", description: "Adhesive strips, battery flex handling and BMS reset notes.", duration: "20 min", xp: 120, type: "practice" },
          { id: "l4-3", title: "Charging Port Replacement", description: "Micro-USB, USB-C and Lightning port replacement.", duration: "20 min", xp: 120, type: "practice" },
          { id: "l4-4", title: "Speaker & Mic Replacement", description: "Loudspeaker, earpiece and bottom microphone modules.", duration: "15 min", xp: 80, type: "practice" },
          { id: "l4-5", title: "Camera Module Replacement", description: "Rear, front and periscope camera module swap.", duration: "15 min", xp: 80, type: "practice" },
          { id: "l4-6", title: "Repair Checklist Simulator", description: "Interactive 6-step repair workflow — practice until perfect.", duration: "20 min", xp: 150, type: "simulation" },
        ],
      },
    ],
  },
  {
    id: "l2",
    title: "Level 2 — Intermediate Technician",
    tagline: "Software repair, diagnostics & multimeter mastery.",
    badge: "⚡",
    color: "from-indigo-500 to-violet-600",
    modules: [
      {
        id: "m5",
        title: "Mobile Software Repair",
        subtitle: "ADB, Fastboot, Odin, SP Flash Tool, 3uTools & iTunes",
        icon: "💻",
        color: "indigo",
        lessons: [
          { id: "l5-1", title: "ADB & Fastboot Essentials", description: "Android Debug Bridge commands & bootloader interface.", duration: "20 min", xp: 100, type: "theory" },
          { id: "l5-2", title: "Unlocking Bootloader", description: "OEM unlock, fastboot oem unlock and Xiaomi unlock.", duration: "15 min", xp: 80, type: "practice" },
          { id: "l5-3", title: "SP Flash Tool (MTK)", description: "Flash firmware on MediaTek devices — scatter files.", duration: "20 min", xp: 100, type: "practice" },
          { id: "l5-4", title: "Odin (Samsung)", description: "Flash .tar.md5 firmware on Samsung devices.", duration: "18 min", xp: 90, type: "practice" },
          { id: "l5-5", title: "QFIL (Qualcomm)", description: "Qualcomm Flash Image Loader for EDL mode flashing.", duration: "18 min", xp: 90, type: "practice" },
          { id: "l5-6", title: "iPhone Recovery & DFU Mode", description: "Enter recovery mode, DFU, iTunes & 3uTools restore.", duration: "20 min", xp: 100, type: "practice" },
          { id: "l5-7", title: "FRP & iCloud Notes", description: "Factory Reset Protection and activation lock concepts.", duration: "12 min", xp: 60, type: "theory" },
          { id: "l5-8", title: "Software Tool Quiz", description: "Match tools to chipsets and operations.", duration: "10 min", xp: 100, type: "quiz" },
        ],
      },
      {
        id: "m6",
        title: "Mobile Diagnostics",
        subtitle: "Flowchart-based fault isolation",
        icon: "🔍",
        color: "cyan",
        lessons: [
          { id: "l6-1", title: "No Power Diagnosis", description: "Battery → Power button → PMIC → Short circuit tracing.", duration: "18 min", xp: 100, type: "theory" },
          { id: "l6-2", title: "No Charging Diagnosis", description: "Cable → Port → Charging IC → Battery BMS check.", duration: "15 min", xp: 90, type: "theory" },
          { id: "l6-3", title: "Boot Loop Diagnosis", description: "Software vs hardware boot loop isolation.", duration: "12 min", xp: 80, type: "theory" },
          { id: "l6-4", title: "No Network / No Sound", description: "Baseband, IMEI, audio codec & speaker paths.", duration: "15 min", xp: 90, type: "theory" },
          { id: "l6-5", title: "Touch / Camera Failure", description: "Touch IC, display connector, camera power rails.", duration: "12 min", xp: 80, type: "theory" },
          { id: "l6-6", title: "Diagnostic Flowchart Engine", description: "Interactive YES/NO diagnostic simulator.", duration: "25 min", xp: 200, type: "simulation" },
        ],
      },
      {
        id: "m7",
        title: "Multimeter Training",
        subtitle: "Voltage, resistance, continuity & diode mode",
        icon: "⚡",
        color: "yellow",
        lessons: [
          { id: "l7-1", title: "Voltage Measurement", description: "DC voltage — battery, charging line & power rails.", duration: "15 min", xp: 80, type: "theory" },
          { id: "l7-2", title: "Resistance Measurement", description: "Pull-up / pull-down resistors and component health.", duration: "12 min", xp: 70, type: "theory" },
          { id: "l7-3", title: "Continuity Testing", description: "Beep mode — trace open circuits and connectors.", duration: "12 min", xp: 70, type: "theory" },
          { id: "l7-4", title: "Diode Mode", description: "Forward / reverse voltage drop — diode health check.", duration: "15 min", xp: 80, type: "theory" },
          { id: "l7-5", title: "Ground Testing", description: "Identify a clean ground and measure against it.", duration: "10 min", xp: 60, type: "theory" },
          { id: "l7-6", title: "Multimeter Simulator", description: "Interactive multimeter — measure battery, capacitor, fuse.", duration: "25 min", xp: 200, type: "simulation" },
        ],
      },
    ],
  },
  {
    id: "l3",
    title: "Level 3 — Advanced Board-Level Technician",
    tagline: "Schematics, components, micro-soldering & board-level troubleshooting.",
    badge: "🏆",
    color: "from-amber-500 to-orange-600",
    modules: [
      {
        id: "m8",
        title: "Electronics Fundamentals",
        subtitle: "Ohm's Law, power, ground & short circuits",
        icon: "⚙️",
        color: "orange",
        lessons: [
          { id: "l8-1", title: "Current, Voltage & Resistance", description: "The three pillars of circuit analysis.", duration: "15 min", xp: 80, type: "theory" },
          { id: "l8-2", title: "Ohm's Law", description: "V = I × R — apply it to real phone circuits.", duration: "15 min", xp: 90, type: "theory" },
          { id: "l8-3", title: "Power & Ground", description: "Power rails, return paths and GND plane.", duration: "12 min", xp: 70, type: "theory" },
          { id: "l8-4", title: "Short Circuits", description: "Detect, locate and clear short circuits on a phone board.", duration: "18 min", xp: 100, type: "theory" },
          { id: "l8-5", title: "Electronics Quiz", description: "Ohm's Law, schematic symbols & circuit concepts.", duration: "10 min", xp: 100, type: "quiz" },
        ],
      },
      {
        id: "m9",
        title: "Board Components",
        subtitle: "Identify resistors, capacitors, ICs, Mosfets & more",
        icon: "🔬",
        color: "fuchsia",
        lessons: [
          { id: "l9-1", title: "Resistors & Capacitors", description: "SMD packages, markings and common failures.", duration: "18 min", xp: 100, type: "theory" },
          { id: "l9-2", title: "Inductors & Diodes", description: "Coils, chokes, Schottky and Zener diodes.", duration: "15 min", xp: 90, type: "theory" },
          { id: "l9-3", title: "Mosfets & Transistors", description: "P-channel / N-channel — switch & load drivers.", duration: "18 min", xp: 100, type: "theory" },
          { id: "l9-4", title: "ICs, Filters & Fuses", description: "Power ICs, chargers, EMI filters and PTC fuses.", duration: "18 min", xp: 100, type: "theory" },
          { id: "l9-5", title: "Component Identification Game", description: "See the component, name it, and predict failures.", duration: "20 min", xp: 180, type: "simulation" },
        ],
      },
      {
        id: "m10",
        title: "Schematic Reading",
        subtitle: "Board view, schematics, power rails & signal lines",
        icon: "📐",
        color: "teal",
        lessons: [
          { id: "l10-1", title: "Board View vs Schematic", description: "Physical layout vs logical diagram.", duration: "15 min", xp: 80, type: "theory" },
          { id: "l10-2", title: "Reading Power Rails", description: "PP_BATT_VCC, PP_VCC_MAIN, PP1V8, PP3V0.", duration: "18 min", xp: 100, type: "theory" },
          { id: "l10-3", title: "Signal & Data Lines", description: "I2C, SPI, MIPI DSI, USB differential pairs.", duration: "18 min", xp: 100, type: "theory" },
          { id: "l10-4", title: "Schematic Reading Practice", description: "Locate components, trace power paths on a virtual schematic.", duration: "30 min", xp: 250, type: "simulation" },
        ],
      },
      {
        id: "m11",
        title: "Micro-Soldering",
        subtitle: "Flux, pad repair, jumper wires, IC & BGA rework",
        icon: "🔥",
        color: "red",
        lessons: [
          { id: "l11-1", title: "Soldering Theory", description: "Tin, lead-free, temperature profiles & wetting.", duration: "15 min", xp: 80, type: "theory" },
          { id: "l11-2", title: "Flux Usage", description: "Rosin, no-clean, paste — when and how much.", duration: "12 min", xp: 70, type: "theory" },
          { id: "l11-3", title: "Pad Repair", description: "Lifted pad reconstruction using copper tape & UV mask.", duration: "20 min", xp: 120, type: "practice" },
          { id: "l11-4", title: "Jumper Wires", description: "0.1mm enameled wire — bodge wires for broken traces.", duration: "20 min", xp: 120, type: "practice" },
          { id: "l11-5", title: "IC Replacement", description: "Hot air profile, reballing and alignment.", duration: "25 min", xp: 150, type: "practice" },
          { id: "l11-6", title: "BGA Rework Intro", description: "Underfill, reflow, reball — the final frontier.", duration: "25 min", xp: 150, type: "practice" },
        ],
      },
      {
        id: "m12",
        title: "Board-Level Troubleshooting",
        subtitle: "Case studies: dead phone, shorted board, no display & more",
        icon: "🧠",
        color: "emerald",
        lessons: [
          { id: "l12-1", title: "Dead Phone", description: "Battery → Fuse → PMIC → Short on main rail.", duration: "20 min", xp: 120, type: "theory" },
          { id: "l12-2", title: "Shorted Board", description: "Infrared camera & rosin spray to locate shorts.", duration: "20 min", xp: 120, type: "theory" },
          { id: "l12-3", title: "No Backlight / No Display", description: "Backlight driver, display power IC & MIPI lanes.", duration: "18 min", xp: 110, type: "theory" },
          { id: "l12-4", title: "No Touch", description: "Touch IC, interrupt line & I2C communication.", duration: "15 min", xp: 100, type: "theory" },
          { id: "l12-5", title: "No Baseband / No WiFi", description: "Baseband PMIC, RF transceiver, WiFi/BT combo IC.", duration: "18 min", xp: 110, type: "theory" },
          { id: "l12-6", title: "Final Certification Project", description: "Solve 3 board-level case studies to earn your badge.", duration: "45 min", xp: 500, type: "simulation" },
        ],
      },
    ],
  },
];

export const tools = [
  { id: "t1", name: "Precision Screwdriver Set", purpose: "Open pentalobe, Phillips, tri-point screws.", icon: "🪛", difficulty: 1 },
  { id: "t2", name: "Tweezers", purpose: "Handle small components and flex cables.", icon: "🩹", difficulty: 1 },
  { id: "t3", name: "Opening Picks", purpose: "Cut adhesive around back cover & display.", icon: "📏", difficulty: 1 },
  { id: "t4", name: "Plastic Pry Tools", purpose: "Separate frames without scratching.", icon: "🔨", difficulty: 1 },
  { id: "t5", name: "Heat Gun", purpose: "Soften adhesive; reflow components.", icon: "🔥", difficulty: 3 },
  { id: "t6", name: "Magnetic Mat", purpose: "Keep screws organized by location.", icon: "🧲", difficulty: 1 },
  { id: "t7", name: "Digital Multimeter", purpose: "Voltage, resistance, continuity, diode mode.", icon: "⚡", difficulty: 3 },
  { id: "t8", name: "USB Multimeter", purpose: "Measure charging current & voltage.", icon: "🔌", difficulty: 2 },
  { id: "t9", name: "Isopropyl Alcohol 99%", purpose: "Clean flux, contacts and boards.", icon: "🧴", difficulty: 1 },
  { id: "t10", name: "Soldering Station", purpose: "Precision tip soldering — T12 or JBC.", icon: "🛠️", difficulty: 4 },
  { id: "t11", name: "Hot Air Station", purpose: "Remove & reflow ICs and connectors.", icon: "♨️", difficulty: 4 },
  { id: "t12", name: "Stereo Microscope", purpose: "Inspect board-level components and solder joints.", icon: "🔬", difficulty: 3 },
  { id: "t13", name: "Flux / Solder Paste", purpose: "Critical for reliable solder joints.", icon: "🧪", difficulty: 2 },
  { id: "t14", name: "Jumper Wire (0.1mm)", purpose: "Repair broken traces — 'bodge wires'.", icon: "🧵", difficulty: 4 },
  { id: "t15", name: "DC Power Supply", purpose: "Inject voltage, measure current draw.", icon: "🔋", difficulty: 3 },
];

export const diagnosticFlow = {
  start: {
    question: "Phone Not Charging — Cable Tested Good?",
    yes: "portClean",
    no: "replaceCable",
  },
  replaceCable: {
    question: "Replace cable & charger. Does phone charge now?",
    yes: "doneCable",
    no: "portClean",
  },
  portClean: {
    question: "Charging port clean & pins straight?",
    yes: "batteryVoltage",
    no: "cleanPort",
  },
  cleanPort: {
    question: "Clean port with isopropyl alcohol. Does it charge?",
    yes: "donePort",
    no: "batteryVoltage",
  },
  batteryVoltage: {
    question: "Battery voltage present at connector (>3.2V)?",
    yes: "chargingIC",
    no: "replaceBattery",
  },
  replaceBattery: {
    question: "Replace battery. Does phone charge & boot?",
    yes: "doneBattery",
    no: "chargingIC",
  },
  chargingIC: {
    question: "Charging IC output voltage OK?",
    yes: "doneSoftware",
    no: "replaceChargingIC",
  },
  replaceChargingIC: {
    question: "Replace charging IC (U2 / Tigris / BQ25 series).",
    yes: "doneBoard",
    no: "doneBoard",
  },
  doneCable: { result: "Cable/charger fault — easy fix. ✅" },
  donePort: { result: "Dirty charging port — cleaned. ✅" },
  doneBattery: { result: "Defective battery — replaced. ✅" },
  doneSoftware: { result: "Software / charge counter issue — restore firmware. ✅" },
  doneBoard: { result: "Board-level fault — charging IC or power path. Refer to Level 3. 🔬" },
};

export const components = [
  { id: "c1", name: "Resistor (SMD 0402)", symbol: "▭", function: "Limit current; divide voltage.", failure: "Open circuit, drift in value.", color: "bg-amber-500/20 border-amber-500/40" },
  { id: "c2", name: "Capacitor (MLCC)", symbol: "⊓⊔", function: "Filter noise; stabilize voltage.", failure: "Short circuit; low capacitance.", color: "bg-sky-500/20 border-sky-500/40" },
  { id: "c3", name: "Inductor (Coil)", symbol: "∿", function: "Filter; buck/boost converter.", failure: "Open; corroded.", color: "bg-fuchsia-500/20 border-fuchsia-500/40" },
  { id: "c4", name: "Diode", symbol: "▸|", function: "Allow current in one direction.", failure: "Short; open.", color: "bg-emerald-500/20 border-emerald-500/40" },
  { id: "c5", name: "Mosfet (Q)", symbol: "⟐", function: "Power switch; load driver.", failure: "Short D-S; dead gate.", color: "bg-rose-500/20 border-rose-500/40" },
  { id: "c6", name: "Power IC (PMIC)", symbol: "⬛", function: "Generate all voltage rails.", failure: "Short on VIN; overheating.", color: "bg-indigo-500/20 border-indigo-500/40" },
  { id: "c7", name: "Charging IC (U2)", symbol: "⬜", function: "Manage battery charging.", failure: "No charge; boot loop.", color: "bg-cyan-500/20 border-cyan-500/40" },
  { id: "c8", name: "Fuse (PTC)", symbol: "⚡", function: "Protect against overcurrent.", failure: "Blown open.", color: "bg-yellow-500/20 border-yellow-500/40" },
];

export const phoneComponents = [
  { id: "pc1", name: "Battery", icon: "🔋", x: 30, y: 30, function: "Supplies power to the device.", common: "Swelling, no charge, sudden shutdown.", difficulty: 2 },
  { id: "pc2", name: "Screen / Display", icon: "📺", x: 50, y: 20, function: "OLED/LCD panel + touch digitizer.", common: "Cracks, no display, touch failure.", difficulty: 3 },
  { id: "pc3", name: "Charging Port", icon: "🔌", x: 50, y: 80, function: "USB-C / Lightning / Micro-USB.", common: "Bent pins, dirt, no charge.", difficulty: 2 },
  { id: "pc4", name: "Rear Camera", icon: "📷", x: 75, y: 18, function: "Image sensor module + OIS.", common: "Blurry, black screen, water damage.", difficulty: 2 },
  { id: "pc5", name: "Motherboard", icon: "🧠", x: 50, y: 55, function: "Main logic board with SoC & PMIC.", common: "Short circuit, dead boot, no baseband.", difficulty: 5 },
  { id: "pc6", name: "Loudspeaker", icon: "🔊", x: 25, y: 78, function: "Bottom speaker for audio & ringer.", common: "Muffled sound, no sound.", difficulty: 1 },
  { id: "pc7", name: "Microphone", icon: "🎤", x: 75, y: 78, function: "Bottom / top mic for voice calls.", common: "Muffled mic, no audio input.", difficulty: 1 },
  { id: "pc8", name: "Earpiece", icon: "👂", x: 50, y: 12, function: "Top speaker for calls.", common: "No in-call sound.", difficulty: 1 },
];

export const certificates = [
  { id: "cert1", name: "Foundation Technician", icon: "🛠️", requirement: "Complete Level 1", color: "from-sky-500 to-blue-600" },
  { id: "cert2", name: "Software Technician", icon: "💻", requirement: "Complete Module 5 + software quiz (80%)", color: "from-indigo-500 to-violet-600" },
  { id: "cert3", name: "Hardware Technician", icon: "🔧", requirement: "Complete Modules 1-4 + 50 repairs logged", color: "from-emerald-500 to-teal-600" },
  { id: "cert4", name: "Board-Level Technician", icon: "🔬", requirement: "Complete Level 3 modules", color: "from-amber-500 to-orange-600" },
  { id: "cert5", name: "Master Repair Technician", icon: "🏆", requirement: "All levels + final board case studies (80%)", color: "from-rose-500 to-pink-600" },
];
