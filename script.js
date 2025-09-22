/* SPACER-X gameplay core (extended build) */
(() => {
  'use strict';

  const STORAGE_KEYS = {
    manager: 'spacerx_manager',
    gp: 'spacerx_gp',
    betting: 'spacerx_bet',
    ui: 'spacerx_ui',
    raceSettings: 'spacerx_race_settings',
    garage: 'spacerx_garage_profiles',
    history: 'spacerx_race_history'
  };
  const PROFILE_EXPORT_VERSION = '0.9.0-demo';

  const allTeamNames = [
    "Apex Nova","VoltWorks","Nebula GP","Quantum Edge","Zenith Motors","HyperFlux",
    "Orion Dynamics","Vortex Racing","StellarPulse","Ion Storm","DeltaDrive","Aurora Tech",
    "Cyclone Engineering","Phoenix Labs"
  ];

  const teamColors = {};
  allTeamNames.forEach((name, idx) => {
    const hue = Math.floor(idx * 360 / allTeamNames.length);
    teamColors[name] = `hsl(${hue},80%,52%)`;
  });

  const driverDatabase = [
    { name: "Kai R.", number: 11, pace: 0.88, risk: 0.32, intel: 0.74, consist: 0.82, salary: 450000 },
    { name: "Mika J.", number: 12, pace: 0.86, risk: 0.28, intel: 0.78, consist: 0.80, salary: 440000 },
    { name: "Nova L.", number: 21, pace: 0.84, risk: 0.34, intel: 0.70, consist: 0.76, salary: 420000 },
    { name: "Rex V.", number: 22, pace: 0.83, risk: 0.40, intel: 0.65, consist: 0.74, salary: 405000 },
    { name: "Lia S.", number: 31, pace: 0.82, risk: 0.30, intel: 0.72, consist: 0.79, salary: 400000 },
    { name: "Yuki T.", number: 32, pace: 0.80, risk: 0.27, intel: 0.76, consist: 0.81, salary: 395000 },
    { name: "Aris K.", number: 41, pace: 0.79, risk: 0.36, intel: 0.69, consist: 0.75, salary: 380000 },
    { name: "Zane P.", number: 42, pace: 0.78, risk: 0.38, intel: 0.66, consist: 0.73, salary: 372000 },
    { name: "Vale D.", number: 51, pace: 0.77, risk: 0.33, intel: 0.71, consist: 0.78, salary: 365000 },
    { name: "Iris F.", number: 52, pace: 0.76, risk: 0.29, intel: 0.74, consist: 0.80, salary: 360000 },
    { name: "Kato N.", number: 61, pace: 0.75, risk: 0.37, intel: 0.67, consist: 0.72, salary: 350000 },
    { name: "Noor H.", number: 62, pace: 0.74, risk: 0.31, intel: 0.71, consist: 0.77, salary: 344000 },
    { name: "Zara X.", number: 71, pace: 0.73, risk: 0.35, intel: 0.68, consist: 0.70, salary: 332000 },
    { name: "Odin M.", number: 72, pace: 0.72, risk: 0.39, intel: 0.64, consist: 0.69, salary: 326000 },
    { name: "Lio C.", number: 81, pace: 0.71, risk: 0.28, intel: 0.70, consist: 0.74, salary: 320000 },
    { name: "Vega B.", number: 82, pace: 0.70, risk: 0.42, intel: 0.62, consist: 0.68, salary: 312000 },
    { name: "Suri W.", number: 91, pace: 0.69, risk: 0.30, intel: 0.67, consist: 0.72, salary: 305000 },
    { name: "Nox G.", number: 92, pace: 0.68, risk: 0.33, intel: 0.65, consist: 0.70, salary: 298000 },
    { name: "Eiko Y.", number: 93, pace: 0.67, risk: 0.31, intel: 0.66, consist: 0.71, salary: 292000 },
    { name: "Pax Q.", number: 94, pace: 0.66, risk: 0.29, intel: 0.64, consist: 0.69, salary: 285000 },
    { name: "Axel D.", number: 95, pace: 0.65, risk: 0.31, intel: 0.68, consist: 0.66, salary: 270000 },
    { name: "Mara E.", number: 96, pace: 0.72, risk: 0.26, intel: 0.74, consist: 0.71, salary: 340000 },
    { name: "Rhea Z.", number: 97, pace: 0.79, risk: 0.43, intel: 0.62, consist: 0.68, salary: 330000 },
    { name: "Taro U.", number: 98, pace: 0.67, risk: 0.24, intel: 0.70, consist: 0.73, salary: 300000 }
  ];

  const driverMap = new Map(driverDatabase.map(d => [d.name, d]));

  const vehicleArchetypes = {
    balanced: { label: 'Balanced', straight: 1, corner: 1, systems: 1, wear: 1 },
    sprinter: { label: 'Hyperdrive', straight: 1.06, corner: 0.98, systems: 0.96, wear: 1.08 },
    downforce: { label: 'Downforce', straight: 0.99, corner: 1.08, systems: 1.02, wear: 0.94 },
    resilient: { label: 'Endurance', straight: 1.0, corner: 1.0, systems: 1.12, wear: 0.88 },
    experimental: { label: 'Experimental', straight: 1.03, corner: 1.03, systems: 0.9, wear: 1.15 }
  };

  const teamTemplates = {
    "Apex Nova": { budget: 7800000, base: { engine: 0.86, aero: 0.82, systems: 0.79 }, archetype: 'sprinter' },
    "VoltWorks": { budget: 7600000, base: { engine: 0.82, aero: 0.78, systems: 0.76 }, archetype: 'downforce' },
    "Nebula GP": { budget: 7200000, base: { engine: 0.80, aero: 0.74, systems: 0.75 }, archetype: 'balanced' },
    "Quantum Edge": { budget: 6900000, base: { engine: 0.78, aero: 0.76, systems: 0.72 }, archetype: 'experimental' },
    "Zenith Motors": { budget: 6600000, base: { engine: 0.76, aero: 0.72, systems: 0.74 }, archetype: 'downforce' },
    "HyperFlux": { budget: 6400000, base: { engine: 0.74, aero: 0.70, systems: 0.71 }, archetype: 'sprinter' },
    "Orion Dynamics": { budget: 5200000, base: { engine: 0.71, aero: 0.68, systems: 0.69 }, archetype: 'resilient' },
    "Vortex Racing": { budget: 5000000, base: { engine: 0.70, aero: 0.66, systems: 0.68 }, archetype: 'balanced' },
    "StellarPulse": { budget: 4800000, base: { engine: 0.69, aero: 0.64, systems: 0.67 }, archetype: 'downforce' },
    "Ion Storm": { budget: 4700000, base: { engine: 0.68, aero: 0.63, systems: 0.65 }, archetype: 'experimental' },
    "DeltaDrive": { budget: 4500000, base: { engine: 0.67, aero: 0.62, systems: 0.64 }, archetype: 'balanced' },
    "Aurora Tech": { budget: 4400000, base: { engine: 0.66, aero: 0.61, systems: 0.63 }, archetype: 'resilient' },
    "Cyclone Engineering": { budget: 4300000, base: { engine: 0.65, aero: 0.60, systems: 0.62 }, archetype: 'balanced' },
    "Phoenix Labs": { budget: 4200000, base: { engine: 0.64, aero: 0.59, systems: 0.61 }, archetype: 'experimental' }
  };

  const teamLore = {
    'Apex Nova': 'Flaggschiff der Orbital Coalition – aggressive Entwicklung, kompromissloser Fokus auf Topspeed.',
    'VoltWorks': 'Energie-Konsortium aus Singapur, spezialisiert auf effiziente Rekuperation und Downforce-Layouts.',
    'Nebula GP': 'Traditionsreiches Forscherteam, das Astrogationsdaten in Setups übersetzt – analytisch und konstant.',
    'Quantum Edge': 'Start-up aus dem Deep-Lab Belt – experimentelle Prototypen, riskante Innovationen.',
    'Zenith Motors': 'Luxusmarke mit strengem Engineering-Standard – bevorzugt kontrollierte Power-Stints.',
    'HyperFlux': 'Cyberpunk-Schmiede aus Neo-Mexico, extreme Boost-Profile und agiles Marketing.',
    'Orion Dynamics': 'Militärischer Zulieferer, berüchtigt für robuste Systeme und defensive Rennstrategien.',
    'Vortex Racing': 'Fans-owned Franchise, setzt auf Community-Telemetrie und verspielte Aero-Tricks.',
    'StellarPulse': 'Synthwave-Kollektiv, das Balance zwischen Show und Performance sucht – spektakuläre Liveries.',
    'Ion Storm': 'Untergrundwerkstatt aus den Plasma-Docks – mutige Experimente mit Hybrid-Systemen.',
    'DeltaDrive': 'Automata-geführtes Team, perfekte Boxenabläufe und nüchterne Effizienz.',
    'Aurora Tech': 'Nordisches Innovationslabor mit Fokus auf Winter-Handling und Energiemanagement.',
    'Cyclone Engineering': 'Industrieverbund aus den Wüstenstaaten – langlebige Komponenten, zähe Fahrer.',
    'Phoenix Labs': 'Bio-mechanische Tüftler, die adaptive Steuerungen mit KI-Assistenz kombinieren.'
  };

  const roadmapMilestones = [
    {
      title: 'Race-Control Demo Stack',
      badge: 'progress',
      label: 'In Arbeit',
      steps: [
        { label: 'Formation & Grid Briefings mit Countdown', done: true },
        { label: 'State Machine GREEN → YELLOW → SC → RESTART', done: true },
        { label: 'Restart-Hold & Give-Back Audits', done: true },
        { label: 'Bunching-Tuning & Telemetrie-Reports', done: true }
      ]
    },
    {
      title: 'Broadcast HUD v2',
      badge: 'progress',
      label: 'In Arbeit',
      steps: [
        { label: 'Leaderboard mit Gap-Trend & Leader-Halo', done: true },
        { label: 'Sektor-Gates & Splits mit PB/FL', done: true },
        { label: 'Incident/Overtake Banner Queue', done: true }
      ]
    },
    {
      title: 'Manager & Saison-Tiefe',
      badge: 'next',
      label: 'Als nächstes',
      steps: [
        { label: 'Staff-Systeme & Facility-Upgrades', done: false },
        { label: 'Langzeit-Rekorde & Archiv-Erweiterung', done: false },
        { label: 'Season Save Validation & Patching', done: false }
      ]
    }
  ];

  const integrationRoadmapPlan = [
    {
      title: 'Streaming & Tools',
      badge: 'progress',
      label: 'Dev Preview',
      steps: [
        { label: 'Twitch Chat Hooks für Race-Control', done: false },
        { label: 'OBS Scene Switch WebSocket Bridge', done: false },
        { label: 'Stream Deck Makro-Presets', done: false }
      ]
    },
    {
      title: 'Community Content',
      badge: 'progress',
      label: 'Aktiv',
      steps: [
        { label: 'Codex Lore Drops & Team Stories', done: true },
        { label: 'Race Archive Timeline', done: true },
        { label: 'Spacer Newsdesk Rotation', done: false }
      ]
    },
    {
      title: 'Presentation Polish',
      badge: 'next',
      label: 'Planung',
      steps: [
        { label: 'Title Theme & Soundtrack Layering', done: false },
        { label: 'Cinematic Camera Paths', done: false },
        { label: 'Dynamic Sponsor Packages', done: false }
      ]
    }
  ];

  let managerState;

  const defaultChassisSpec = {
    codename: 'Spec-A1',
    engine: 1,
    aero: 1,
    systems: 1,
    boost: 1,
    drag: 1,
    handling: 1,
    stability: 1,
    geometry: { length: 28, width: 16, nose: 5, canopy: 12 },
    summary: 'Ausgewogenes Paket'
  };

  const chassisGeometries = [
    { label: 'Longtail', length: 31, width: 15, nose: 7, canopy: 11 },
    { label: 'Broadwing', length: 27, width: 18, nose: 5, canopy: 14 },
    { label: 'Arrow', length: 28, width: 16, nose: 6, canopy: 12 },
    { label: 'Delta', length: 26, width: 17, nose: 5, canopy: 13 }
  ];

  const chassisPrefixes = ['VX', 'XR', 'NT', 'QS', 'SP', 'HE', 'AT', 'LX'];
  const chassisSuffixes = ['Flux', 'Nova', 'Vortex', 'Pulse', 'Specter', 'Prism', 'Halo', 'Drift'];

  const MAX_FACILITY_LEVEL = 3;
  const FACILITY_TYPES = {
    aeroLab: {
      label: 'Aero-Lab',
      shortLabel: 'Aero',
      description: 'Erhöht Downforce & Cornering-Stabilität.',
      costs: [0, 950000, 1200000, 1550000]
    },
    powertrain: {
      label: 'Dyno Hub',
      shortLabel: 'Power',
      description: 'Optimiert Motorleistung & Boost-Response.',
      costs: [0, 1000000, 1350000, 1750000]
    },
    systemsBay: {
      label: 'Systems Bay',
      shortLabel: 'Systems',
      description: 'Verbessert Zuverlässigkeit & Reifenverschleiß.',
      costs: [0, 820000, 1120000, 1480000]
    },
    academy: {
      label: 'Pilot Academy',
      shortLabel: 'Academy',
      description: 'Hebt Fahrermoral & Formentwicklung.',
      costs: [0, 650000, 880000, 1180000]
    }
  };

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function describeVariantProfile(variant = {}) {
    const traits = [];
    const engine = typeof variant.engine === 'number' ? variant.engine : 1;
    const boost = typeof variant.boost === 'number' ? variant.boost : 1;
    const aero = typeof variant.aero === 'number' ? variant.aero : 1;
    const handling = typeof variant.handling === 'number' ? variant.handling : 1;
    const systems = typeof variant.systems === 'number' ? variant.systems : 1;
    const stability = typeof variant.stability === 'number' ? variant.stability : 1;
    const drag = typeof variant.drag === 'number' ? variant.drag : 1;
    if (engine > 1.05 || boost > 1.05) traits.push('Top-End Boost');
    if (aero > 1.05 || handling > 1.05) traits.push('Kurvengriff');
    if (systems > 1.05 || stability > 1.05) traits.push('Robuste Systeme');
    if (drag < 0.98) traits.push('Leichtbau');
    return traits.length ? traits.join(' • ') : 'Ausgewogenes Paket';
  }

  function generateVehicleVariant(teamName) {
    const geometry = { ...pickRandom(chassisGeometries) };
    const codename = `${pickRandom(chassisPrefixes)}-${pickRandom(chassisSuffixes)}${Math.floor(10 + Math.random() * 80)}`;
    const variant = {
      codename,
      team: teamName,
      engine: 0.9 + Math.random() * 0.22,
      aero: 0.9 + Math.random() * 0.22,
      systems: 0.88 + Math.random() * 0.24,
      boost: 0.95 + Math.random() * 0.14,
      drag: 0.93 + Math.random() * 0.14,
      handling: 0.88 + Math.random() * 0.22,
      stability: 0.9 + Math.random() * 0.2,
      geometry,
      summary: ''
    };
    variant.summary = describeVariantProfile(variant);
    return variant;
  }

  function applyUpgradeEffects(teamName, variant) {
    const team = managerState && managerState.teams ? managerState.teams[teamName] : null;
    if (!team) {
      const clone = { ...variant };
      clone.summary = describeVariantProfile(clone);
      return clone;
    }
    const upgrades = team.upgrades || {};
    const engineLevel = clamp(Math.round(upgrades.engine ?? 0), 0, MAX_UPGRADE_LEVEL);
    const aeroLevel = clamp(Math.round(upgrades.aero ?? 0), 0, MAX_UPGRADE_LEVEL);
    const systemsLevel = clamp(Math.round(upgrades.systems ?? 0), 0, MAX_UPGRADE_LEVEL);
    const adjusted = { ...variant };
    if (adjusted.wear == null) adjusted.wear = 1;
    if (adjusted.drag == null) adjusted.drag = 1;
    if (engineLevel > 0) {
      adjusted.engine = (adjusted.engine || 1) + engineLevel * 0.02;
      adjusted.boost = (adjusted.boost || 1) + engineLevel * 0.018;
      adjusted.drag = Math.max(0.82, (adjusted.drag || 1) - engineLevel * 0.01);
    }
    if (aeroLevel > 0) {
      adjusted.aero = (adjusted.aero || 1) + aeroLevel * 0.022;
      adjusted.handling = (adjusted.handling || 1) + aeroLevel * 0.024;
    }
    if (systemsLevel > 0) {
      adjusted.systems = (adjusted.systems || 1) + systemsLevel * 0.024;
      adjusted.stability = (adjusted.stability || 1) + systemsLevel * 0.022;
      adjusted.wear = Math.max(0.72, (adjusted.wear || 1) - systemsLevel * 0.02);
    }
    const facilities = sanitizeFacilities(team.facilities);
    const aeroLab = clampFacilityLevel(facilities.aeroLab);
    const powertrain = clampFacilityLevel(facilities.powertrain);
    const systemsBay = clampFacilityLevel(facilities.systemsBay);
    if (aeroLab > 0) {
      adjusted.aero = (adjusted.aero || 1) + aeroLab * 0.018;
      adjusted.handling = (adjusted.handling || 1) + aeroLab * 0.022;
      adjusted.drag = Math.max(0.8, (adjusted.drag || 1) - aeroLab * 0.006);
    }
    if (powertrain > 0) {
      adjusted.engine = (adjusted.engine || 1) + powertrain * 0.017;
      adjusted.boost = (adjusted.boost || 1) + powertrain * 0.015;
      adjusted.drag = Math.max(0.78, (adjusted.drag || 1) - powertrain * 0.008);
    }
    if (systemsBay > 0) {
      adjusted.systems = (adjusted.systems || 1) + systemsBay * 0.02;
      adjusted.stability = (adjusted.stability || 1) + systemsBay * 0.02;
      adjusted.wear = Math.max(0.68, (adjusted.wear || 1) - systemsBay * 0.028);
    }
    adjusted.summary = describeVariantProfile(adjusted);
    return adjusted;
  }

  function persistVehicleVariants(map = {}) {
    try {
      localStorage.setItem(STORAGE_KEYS.garage, JSON.stringify(map));
    } catch (err) {
      console.warn('garage save failed', err);
    }
  }

  function loadVehicleVariants() {
    let stored = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.garage);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') stored = parsed;
      }
    } catch (err) {
      console.warn('garage load failed', err);
    }
    let mutated = false;
    allTeamNames.forEach(team => {
      if (!stored[team]) {
        stored[team] = generateVehicleVariant(team);
        mutated = true;
      }
    });
    if (mutated) {
      persistVehicleVariants(stored);
    }
    return stored;
  }

  let teamVehicleVariants = loadVehicleVariants();

  function getTeamVariant(teamName) {
    if (!teamVehicleVariants[teamName]) {
      teamVehicleVariants[teamName] = generateVehicleVariant(teamName);
      persistVehicleVariants(teamVehicleVariants);
    }
    const baseVariant = { ...defaultChassisSpec, ...teamVehicleVariants[teamName] };
    return applyUpgradeEffects(teamName, baseVariant);
  }

  const defaultRosters = [
    { team: "Apex Nova", drivers: ["Kai R.", "Mika J."] },
    { team: "VoltWorks", drivers: ["Nova L.", "Rex V."] },
    { team: "Nebula GP", drivers: ["Lia S.", "Yuki T."] },
    { team: "Quantum Edge", drivers: ["Aris K.", "Zane P."] },
    { team: "Zenith Motors", drivers: ["Vale D.", "Iris F."] },
    { team: "HyperFlux", drivers: ["Kato N.", "Noor H."] },
    { team: "Orion Dynamics", drivers: ["Zara X."] },
    { team: "Vortex Racing", drivers: ["Odin M."] },
    { team: "StellarPulse", drivers: ["Lio C."] },
    { team: "Ion Storm", drivers: ["Vega B."] },
    { team: "DeltaDrive", drivers: ["Suri W."] },
    { team: "Aurora Tech", drivers: ["Nox G."] },
    { team: "Cyclone Engineering", drivers: ["Eiko Y."] },
    { team: "Phoenix Labs", drivers: ["Pax Q."] }
  ];

  const MAX_UPGRADE_LEVEL = 5;
  const MAX_ROSTER_SIZE = 2;
  const UPGRADE_COST = { engine: 450000, aero: 380000, systems: 320000 };
  const UPGRADE_LABELS = {
    engine: 'Motor & Power',
    aero: 'Aero & Balance',
    systems: 'Systeme & Reliability'
  };
  const managerCalendar = ['oval', 'city', 'aurora', 'delta', 'canyon', 'canyonSprint', 'atlas', 'solstice', 'zenith', 'wavy', 'nebula', 'fig8', 'mirage', 'fracture', 'helix', 'lumen', 'glacier', 'eclipse', 'maelstrom', 'rift'];
  const MANAGER_SEASON_LENGTH = managerCalendar.length;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatTime(value) {
    if (!isFinite(value) || value <= 0) return '--';
    const minutes = Math.floor(value / 60);
    const seconds = value - minutes * 60;
    const secStr = seconds.toFixed(3);
    return minutes > 0 ? `${minutes}:${secStr.padStart(6, '0')}` : secStr;
  }

  function formatSplit(value) {
    if (!isFinite(value) || value <= 0) return '--';
    return value.toFixed(3);
  }

  function formatGap(value) {
    if (!isFinite(value)) return '--';
    return value >= 10 ? value.toFixed(1) : value.toFixed(2);
  }

  function formatSecondsLabel(value) {
    if (!isFinite(value) || value < 0) return '0,0s';
    if (value >= 60) {
      return `${formatTime(value).replace('.', ',')}s`;
    }
    return `${value.toFixed(1).replace('.', ',')}s`;
  }

  function formatCurrency(value) {
    return `${Math.round(value).toLocaleString('de-DE')} Cr`;
  }

  function formatDateTime(value) {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }

  function createDefaultFacilities() {
    return {
      aeroLab: 1,
      powertrain: 1,
      systemsBay: 1,
      academy: 0
    };
  }

  function clampFacilityLevel(value) {
    return clamp(Math.round(value ?? 0), 0, MAX_FACILITY_LEVEL);
  }

  function sanitizeFacilities(input) {
    const defaults = createDefaultFacilities();
    if (!input || typeof input !== 'object') {
      return { ...defaults };
    }
    const sanitized = {};
    Object.keys(FACILITY_TYPES).forEach(key => {
      sanitized[key] = clampFacilityLevel(input[key] ?? defaults[key]);
    });
    return sanitized;
  }

  function createDefaultManagerState() {
    const state = {
      version: 3,
      seasonYear: 1,
      week: 1,
      selectedTeam: defaultRosters[0].team,
      teams: {}
    };
    const rostered = new Set();
    defaultRosters.forEach(entry => {
      const template = teamTemplates[entry.team] || { budget: 4500000, base: { engine: 0.66, aero: 0.6, systems: 0.62 } };
      const roster = entry.drivers.map(name => {
        const driver = driverMap.get(name);
        rostered.add(name);
        return {
          driver: name,
          years: 2,
          salary: driver ? driver.salary : 320000,
          morale: 0.55
        };
      });
      state.teams[entry.team] = {
        budget: template.budget,
        upgrades: { engine: 0, aero: 0, systems: 0 },
        facilities: createDefaultFacilities(),
        roster,
        form: 0
      };
    });
    state.freeAgents = driverDatabase
      .filter(driver => !rostered.has(driver.name))
      .map(driver => ({
        driver: driver.name,
        morale: 0.5,
        askingSalary: Math.round(driver.salary * 1.1)
      }));
    return state;
  }

  function normalizeManagerState(state) {
    const base = createDefaultManagerState();
    if (!state || typeof state !== 'object') {
      return base;
    }
    base.seasonYear = typeof state.seasonYear === 'number' ? Math.max(1, Math.floor(state.seasonYear)) : base.seasonYear;
    base.week = typeof state.week === 'number' && state.week >= 1 ? Math.floor(state.week) : base.week;
    if (state.teams) {
      Object.entries(base.teams).forEach(([team, data]) => {
        const incoming = state.teams[team];
        if (!incoming) return;
        if (typeof incoming.budget === 'number') data.budget = incoming.budget;
        if (incoming.upgrades) {
          data.upgrades.engine = clamp(incoming.upgrades.engine ?? data.upgrades.engine, 0, MAX_UPGRADE_LEVEL);
          data.upgrades.aero = clamp(incoming.upgrades.aero ?? data.upgrades.aero, 0, MAX_UPGRADE_LEVEL);
          data.upgrades.systems = clamp(incoming.upgrades.systems ?? data.upgrades.systems, 0, MAX_UPGRADE_LEVEL);
        }
        data.facilities = sanitizeFacilities(incoming.facilities || data.facilities);
        data.form = typeof incoming.form === 'number' ? incoming.form : 0;
        const roster = Array.isArray(incoming.roster) ? incoming.roster : [];
        const baseRoster = data.roster.slice();
        const sanitizedRoster = [];
        const seenDrivers = new Set();
        roster.forEach(contract => {
          if (!contract || !contract.driver) return;
          const driverInfo = driverMap.get(contract.driver);
          if (!driverInfo) return;
          const years = typeof contract.years === 'number' ? Math.max(0, contract.years) : 2;
          const salary = typeof contract.salary === 'number' ? contract.salary : driverInfo.salary;
          const morale = clamp(typeof contract.morale === 'number' ? contract.morale : 0.55, 0.1, 0.95);
          sanitizedRoster.push({ driver: contract.driver, years, salary, morale });
          seenDrivers.add(contract.driver);
        });
        baseRoster.forEach(contract => {
          if (!seenDrivers.has(contract.driver)) {
            sanitizedRoster.push(contract);
            seenDrivers.add(contract.driver);
          }
        });
        data.roster = sanitizedRoster.slice(0, MAX_ROSTER_SIZE);
      });
    }
    Object.values(base.teams).forEach(team => {
      team.facilities = sanitizeFacilities(team.facilities);
    });
    if (state.selectedTeam && base.teams[state.selectedTeam]) {
      base.selectedTeam = state.selectedTeam;
    }
    const rostered = new Set();
    Object.values(base.teams).forEach(team => {
      (team.roster || []).forEach(contract => rostered.add(contract.driver));
    });
    const agents = [];
    if (Array.isArray(state.freeAgents)) {
      state.freeAgents.forEach(entry => {
        const name = typeof entry === 'string' ? entry : entry?.driver;
        if (!name || rostered.has(name)) return;
        const driverInfo = driverMap.get(name);
        if (!driverInfo) return;
        const morale = clamp(typeof entry?.morale === 'number' ? entry.morale : 0.5, 0.1, 0.95);
        const askingSalary = typeof entry?.askingSalary === 'number' ? entry.askingSalary : Math.round(driverInfo.salary * 1.1);
        agents.push({ driver: name, morale, askingSalary });
        rostered.add(name);
      });
    }
    driverDatabase.forEach(driver => {
      if (rostered.has(driver.name)) return;
      agents.push({
        driver: driver.name,
        morale: 0.5,
        askingSalary: Math.round(driver.salary * 1.1)
      });
    });
    base.freeAgents = agents;
    return base;
  }

  function loadManagerState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.manager);
      if (!raw) return createDefaultManagerState();
      const parsed = JSON.parse(raw);
      return normalizeManagerState(parsed);
    } catch (err) {
      console.warn('manager state load failed', err);
      return createDefaultManagerState();
    }
  }

  function persistManagerState() {
    try {
      localStorage.setItem(STORAGE_KEYS.manager, JSON.stringify(managerState));
    } catch (err) {
      console.warn('manager state save failed', err);
    }
  }

  function ensureFreeAgentPool() {
    if (!managerState || !managerState.teams) return;
    const rostered = new Set();
    Object.values(managerState.teams).forEach(team => {
      (team.roster || []).forEach(contract => rostered.add(contract.driver));
    });
    const unique = new Map();
    if (Array.isArray(managerState.freeAgents)) {
      managerState.freeAgents.forEach(entry => {
        const name = typeof entry === 'string' ? entry : entry?.driver;
        if (!name || rostered.has(name)) return;
        const driverInfo = driverMap.get(name);
        if (!driverInfo) return;
        const morale = clamp(typeof entry?.morale === 'number' ? entry.morale : 0.5, 0.1, 0.95);
        const askingSalary = typeof entry?.askingSalary === 'number'
          ? entry.askingSalary
          : Math.round(driverInfo.salary * 1.1);
        unique.set(name, { driver: name, morale, askingSalary });
      });
    }
    driverDatabase.forEach(driver => {
      if (rostered.has(driver.name) || unique.has(driver.name)) return;
      unique.set(driver.name, {
        driver: driver.name,
        morale: 0.5,
        askingSalary: Math.round(driver.salary * 1.1)
      });
    });
    managerState.freeAgents = Array.from(unique.values());
  }

  function ensureStaffPool() {
    if (!managerState) return;
    if (!Array.isArray(managerState.staffFreeAgents)) {
      managerState.staffFreeAgents = [];
    }
  }

  managerState = loadManagerState();
  ensureFreeAgentPool();
  let focusTeam = managerState.selectedTeam;

  const bettingDefaults = { balance: 1000, activeBet: null, history: [] };

  function loadBettingState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.betting);
      if (!raw) return { ...bettingDefaults };
      const parsed = JSON.parse(raw);
      return {
        balance: typeof parsed.balance === 'number' ? parsed.balance : bettingDefaults.balance,
        activeBet: parsed.activeBet || null,
        history: Array.isArray(parsed.history) ? parsed.history.slice(0, 12) : []
      };
    } catch (err) {
      console.warn('betting state load failed', err);
      return { ...bettingDefaults };
    }
  }

  function persistBettingState() {
    try {
      localStorage.setItem(STORAGE_KEYS.betting, JSON.stringify(bettingState));
    } catch (err) {
      console.warn('betting state save failed', err);
    }
  }

  const MAX_ARCHIVE_ENTRIES = 40;

  function loadRaceChronicle() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.history);
      if (!raw) return { events: [] };
      const parsed = JSON.parse(raw);
      const events = Array.isArray(parsed?.events) ? parsed.events.filter(Boolean).slice(0, MAX_ARCHIVE_ENTRIES) : [];
      return { events };
    } catch (err) {
      console.warn('history load failed', err);
      return { events: [] };
    }
  }

  function persistRaceChronicle() {
    try {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(raceChronicle));
    } catch (err) {
      console.warn('history save failed', err);
    }
  }

  let raceChronicle = loadRaceChronicle();

  let bettingState = loadBettingState();
  let cachedOdds = [];

  const difficultyModifiers = {
    easy: { speed: -0.8, consistency: 0.06 },
    normal: { speed: 0, consistency: 0 },
    hard: { speed: 0.75, consistency: -0.04 }
  };
  const aiLabels = { easy: 'KI: Easy', normal: 'KI: Normal', hard: 'KI: Hard' };

  const SECTOR_SPLITS = [0, 1 / 3, 2 / 3, 1];
  const sectorFeed = [];
  const liveTickerEvents = [];
  const cautionOrderMap = new Map();
  const lapRecords = {
    fastestLap: { time: Infinity, driver: null, team: null, number: null },
    bestSectors: [
      { time: Infinity, driver: null, team: null, number: null },
      { time: Infinity, driver: null, team: null, number: null },
      { time: Infinity, driver: null, team: null, number: null }
    ]
  };

  const gpTrackRotation = ['oval', 'city', 'atlas', 'glacier', 'mirage', 'canyonSprint', 'maelstrom', 'rift'];

  function sanitizeUiSnapshot(data) {
    const defaults = {
      zoom: 'on',
      showMiniMap: true,
      showRaceControl: true,
      showFocusPanel: true,
      showTicker: true,
      skipBroadcastIntro: false,
      enableAudio: true,
      cameraMode: 'auto',
      racePace: 'normal',
      cautionStrictness: 'standard'
    };
    if (!data || typeof data !== 'object') return { ...defaults };
    const cameraModes = new Set(['auto', 'leader', 'battle', 'manual']);
    const paceModes = new Set(['slow', 'normal', 'fast']);
    const cautionModes = new Set(['relaxed', 'standard', 'strict']);
    return {
      zoom: data.zoom === 'off' ? 'off' : 'on',
      showMiniMap: data.showMiniMap !== false,
      showRaceControl: data.showRaceControl !== false,
      showFocusPanel: data.showFocusPanel !== false,
      showTicker: data.showTicker !== false,
      skipBroadcastIntro: data.skipBroadcastIntro === true,
      enableAudio: data.enableAudio !== false,
      cameraMode: cameraModes.has(data.cameraMode) ? data.cameraMode : defaults.cameraMode,
      racePace: paceModes.has(data.racePace) ? data.racePace : defaults.racePace,
      cautionStrictness: cautionModes.has(data.cautionStrictness) ? data.cautionStrictness : defaults.cautionStrictness
    };
  }

  function sanitizeRaceSettingsSnapshot(data) {
    const defaults = { track: 'oval', laps: 15, ai: 'normal', weather: 'clear', startProc: 'standing' };
    if (!data || typeof data !== 'object') return { ...defaults };
    const trackId = typeof data.track === 'string' && data.track in (trackCatalog || {}) ? data.track : defaults.track;
    const lapsValue = Number.isFinite(data.laps) ? Math.max(1, Math.floor(data.laps)) : parseInt(data.laps, 10);
    const aiModes = new Set(['easy', 'normal', 'hard']);
    const weatherOptions = new Set(Object.keys(weatherCatalog || {}));
    const startModes = new Set(['standing', 'staggered', 'rolling']);
    return {
      track: trackCatalog && trackCatalog[trackId] ? trackId : defaults.track,
      laps: Number.isFinite(lapsValue) ? lapsValue : defaults.laps,
      ai: aiModes.has(data.ai) ? data.ai : defaults.ai,
      weather: weatherOptions.has(data.weather) ? data.weather : defaults.weather,
      startProc: startModes.has(data.startProc) ? data.startProc : defaults.startProc
    };
  }

  function sanitizeGeometrySnapshot(geometry = {}) {
    const base = defaultChassisSpec.geometry;
    if (!geometry || typeof geometry !== 'object') {
      return { ...base };
    }
    return {
      length: clamp(Number.isFinite(geometry.length) ? geometry.length : base.length, 20, 40),
      width: clamp(Number.isFinite(geometry.width) ? geometry.width : base.width, 12, 24),
      nose: clamp(Number.isFinite(geometry.nose) ? geometry.nose : base.nose, 3, 10),
      canopy: clamp(Number.isFinite(geometry.canopy) ? geometry.canopy : base.canopy, 8, 18)
    };
  }

  function sanitizeGarageSnapshot(data) {
    const result = {};
    const source = data && typeof data === 'object' ? data : {};
    allTeamNames.forEach(team => {
      const incoming = source[team];
      if (incoming && typeof incoming === 'object') {
        result[team] = {
          team,
          codename: typeof incoming.codename === 'string' && incoming.codename.trim() ? incoming.codename.trim() : `Spec-${team.slice(0, 2).toUpperCase()}`,
          engine: clamp(Number(incoming.engine) || 1, 0.6, 1.4),
          aero: clamp(Number(incoming.aero) || 1, 0.6, 1.4),
          systems: clamp(Number(incoming.systems) || 1, 0.6, 1.4),
          boost: clamp(Number(incoming.boost) || 1, 0.6, 1.4),
          drag: clamp(Number(incoming.drag) || 1, 0.6, 1.4),
          handling: clamp(Number(incoming.handling) || 1, 0.6, 1.4),
          stability: clamp(Number(incoming.stability) || 1, 0.6, 1.4),
          geometry: sanitizeGeometrySnapshot(incoming.geometry),
          summary: typeof incoming.summary === 'string' && incoming.summary.trim() ? incoming.summary.trim() : 'Ausgewogenes Paket'
        };
      } else {
        result[team] = generateVehicleVariant(team);
      }
    });
    return result;
  }

  function sanitizeBetHistoryEntry(entry) {
    if (!entry || typeof entry !== 'object' || typeof entry.driver !== 'string') return null;
    const sanitized = {
      driver: entry.driver,
      amount: Number.isFinite(entry.amount) ? Math.max(0, Math.round(entry.amount)) : 0,
      odds: Number.isFinite(entry.odds) ? Math.max(1, Number(entry.odds)) : 1,
      placedAt: Number.isFinite(entry.placedAt) ? entry.placedAt : Date.now(),
      track: typeof entry.track === 'string' ? entry.track : '',
      success: entry.success === true
    };
    if (Number.isFinite(entry.payout)) sanitized.payout = Math.max(0, Math.round(entry.payout));
    if (Number.isFinite(entry.loss)) sanitized.loss = Math.max(0, Math.round(entry.loss));
    if (Number.isFinite(entry.settledAt)) sanitized.settledAt = entry.settledAt;
    return sanitized;
  }

  function sanitizeBettingSnapshot(data) {
    const snapshot = { balance: bettingDefaults.balance, activeBet: null, history: [] };
    if (!data || typeof data !== 'object') return snapshot;
    if (Number.isFinite(data.balance)) {
      snapshot.balance = Math.max(0, Math.round(data.balance));
    }
    if (data.activeBet && typeof data.activeBet === 'object' && typeof data.activeBet.driver === 'string') {
      const active = data.activeBet;
      snapshot.activeBet = {
        driver: active.driver,
        team: typeof active.team === 'string' ? active.team : '',
        amount: Number.isFinite(active.amount) ? Math.max(0, Math.round(active.amount)) : 0,
        odds: Number.isFinite(active.odds) ? Math.max(1, Number(active.odds)) : 1,
        track: typeof active.track === 'string' ? active.track : '',
        placedAt: Number.isFinite(active.placedAt) ? active.placedAt : Date.now()
      };
    }
    if (Array.isArray(data.history)) {
      data.history.slice(0, 12).forEach(item => {
        const sanitized = sanitizeBetHistoryEntry(item);
        if (sanitized) snapshot.history.push(sanitized);
      });
    }
    return snapshot;
  }

  function sanitizeGpSnapshot(data) {
    const snapshot = { active: false, raceIndex: 0, table: [] };
    if (!data || typeof data !== 'object') return snapshot;
    const raceIndex = Number.isFinite(data.raceIndex) ? Math.max(0, Math.floor(data.raceIndex)) : 0;
    snapshot.raceIndex = Math.min(raceIndex, GP_RACES);
    if (Array.isArray(data.table)) {
      data.table.forEach(entry => {
        if (!Array.isArray(entry) || entry.length < 2) return;
        const driver = entry[0];
        const value = entry[1];
        if (typeof driver !== 'string' || !value || typeof value !== 'object') return;
        const normalized = {
          driver,
          team: typeof value.team === 'string' ? value.team : '',
          number: Number.isFinite(value.number) ? Math.round(value.number) : null,
          points: Number.isFinite(value.points) ? Math.max(0, Math.round(value.points)) : 0
        };
        snapshot.table.push(normalized);
      });
    }
    const hasProgress = snapshot.table.length > 0 && snapshot.raceIndex > 0;
    snapshot.active = Boolean(data.active) && hasProgress && snapshot.raceIndex < GP_RACES;
    return snapshot;
  }

  function normalizeChronicleSnapshot(data) {
    const chronicle = { events: [] };
    if (!data || typeof data !== 'object' || !Array.isArray(data.events)) return chronicle;
    data.events.forEach(entry => {
      if (!entry || typeof entry !== 'object') return;
      const trackId = typeof entry.trackId === 'string' ? entry.trackId : 'oval';
      const podium = Array.isArray(entry.podium)
        ? entry.podium.slice(0, 3).map(item => {
            if (!item || typeof item !== 'object' || typeof item.driver !== 'string') return null;
            return {
              driver: item.driver,
              team: typeof item.team === 'string' ? item.team : '',
              number: Number.isFinite(item.number) ? Math.round(item.number) : null,
              gap: Number.isFinite(item.gap) ? item.gap : null
            };
          }).filter(Boolean)
        : [];
      const fastestLap = entry.fastestLap && typeof entry.fastestLap === 'object' && typeof entry.fastestLap.driver === 'string'
        ? {
            driver: entry.fastestLap.driver,
            team: typeof entry.fastestLap.team === 'string' ? entry.fastestLap.team : '',
            number: Number.isFinite(entry.fastestLap.number) ? Math.round(entry.fastestLap.number) : null,
            time: Number.isFinite(entry.fastestLap.time) ? entry.fastestLap.time : null
          }
        : null;
      chronicle.events.push({
        id: Number.isFinite(entry.id) ? entry.id : Date.now(),
        timestamp: Number.isFinite(entry.timestamp) ? entry.timestamp : Date.now(),
        mode: typeof entry.mode === 'string' ? entry.mode : 'quick',
        trackId,
        trackLabel: typeof entry.trackLabel === 'string' ? entry.trackLabel : (trackCatalog?.[trackId]?.label || trackId),
        weatherLabel: typeof entry.weatherLabel === 'string' ? entry.weatherLabel : 'Klar',
        laps: Number.isFinite(entry.laps) ? Math.max(0, Math.floor(entry.laps)) : 0,
        podium,
        fastestLap
      });
    });
    chronicle.events.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    if (chronicle.events.length > MAX_ARCHIVE_ENTRIES) {
      chronicle.events.length = MAX_ARCHIVE_ENTRIES;
    }
    return chronicle;
  }

  function collectProfileSnapshot() {
    return {
      version: PROFILE_EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      manager: JSON.parse(JSON.stringify(managerState)),
      gp: {
        active: gpActive,
        raceIndex: gpRaceIndex,
        table: Array.from(gpTable.entries()).map(([driver, value]) => [driver, { ...value }])
      },
      betting: JSON.parse(JSON.stringify(bettingState)),
      garage: JSON.parse(JSON.stringify(teamVehicleVariants)),
      raceHistory: JSON.parse(JSON.stringify(raceChronicle)),
      ui: { ...uiSettings },
      raceSettings: { ...raceSettings }
    };
  }

  function applyProfileSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') {
      throw new Error('Ungültiger Profil-Datensatz');
    }
    managerState = normalizeManagerState(snapshot.manager);
    ensureFreeAgentPool();
    focusTeam = managerState.selectedTeam;
    persistManagerState();

    teamVehicleVariants = sanitizeGarageSnapshot(snapshot.garage || snapshot.variants);
    persistVehicleVariants(teamVehicleVariants);

    bettingState = sanitizeBettingSnapshot(snapshot.betting);
    persistBettingState();

    raceChronicle = normalizeChronicleSnapshot(snapshot.raceHistory);
    persistRaceChronicle();

    const gpSnapshot = sanitizeGpSnapshot(snapshot.gp);
    gpTable.clear();
    gpSnapshot.table.forEach(entry => {
      gpTable.set(entry.driver, entry);
    });
    gpRaceIndex = gpSnapshot.raceIndex;
    gpActive = gpSnapshot.active;
    gpSave();

    const uiSnapshot = sanitizeUiSnapshot(snapshot.ui);
    Object.assign(uiSettings, uiSnapshot);
    persistUiSettings();
    applyUiSettings();
    syncUiSettingControls();

    raceSettings = sanitizeRaceSettingsSnapshot(snapshot.raceSettings);
    persistRaceSettings();
    syncRaceSettingControls();

    cachedOdds = [];
    refreshOddsTable();
    updateBettingUI();
    updateManagerView();
    renderCodex();
    renderTeams();

    if (gpActive) {
      prepareGrandPrixRound();
    }

    return { version: typeof snapshot.version === 'string' ? snapshot.version : PROFILE_EXPORT_VERSION };
  }

  function wipeProfileStorage() {
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.warn('storage wipe failed', err);
      }
    });
    managerState = createDefaultManagerState();
    ensureFreeAgentPool();
    focusTeam = managerState.selectedTeam;
    persistManagerState();

    teamVehicleVariants = loadVehicleVariants();

    bettingState = { ...bettingDefaults, history: [] };
    persistBettingState();

    raceChronicle = { events: [] };
    persistRaceChronicle();

    gpTable.clear();
    gpRaceIndex = 0;
    gpActive = false;

    raceSettings = loadRaceSettings();
    const uiDefaults = sanitizeUiSnapshot({});
    Object.assign(uiSettings, uiDefaults);
    persistUiSettings();
    applyUiSettings();
    syncUiSettingControls();
    persistRaceSettings();
    syncRaceSettingControls();

    cachedOdds = [];
    refreshOddsTable();
    updateBettingUI();
    updateManagerView();
    renderCodex();
    renderTeams();
  }

  const mainMenu = document.getElementById('mainMenu');
  const raceScreen = document.getElementById('raceScreen');
  const teamsScreen = document.getElementById('teamsScreen');
  const managerScreen = document.getElementById('managerScreen');
  const bettingScreen = document.getElementById('bettingScreen');
  const codexScreen = document.getElementById('codexScreen');
  const settingsScreen = document.getElementById('settingsScreen');

  const newRaceBtn = document.getElementById('newRaceBtn');
  const grandPrixBtn = document.getElementById('grandPrixBtn');
  const resumeGrandPrixBtn = document.getElementById('resumeGrandPrixBtn');
  const gpStatusCard = document.getElementById('grandPrixStatusCard');
  const gpStatusMeta = document.getElementById('gpStatusMeta');
  const gpStatusTrack = document.getElementById('gpStatusTrack');
  const gpStatusWeather = document.getElementById('gpStatusWeather');
  const gpStatusStandings = document.getElementById('gpStatusStandings');
  const gpStatusEmpty = document.getElementById('gpStatusEmpty');
  const managerBtn = document.getElementById('managerBtn');
  const bettingBtn = document.getElementById('bettingBtn');
  const teamsBtn = document.getElementById('teamsBtn');
  const codexBtn = document.getElementById('codexBtn');
  const settingsBtn = document.getElementById('settingsBtn');

  const backToMenuFromRace = document.getElementById('backToMenuFromRace');
  const backToMenuFromTeams = document.getElementById('backToMenuFromTeams');
  const backToMenuFromManager = document.getElementById('backToMenuFromManager');
  const backToMenuFromBetting = document.getElementById('backToMenuFromBetting');
  const backToMenuFromCodex = document.getElementById('backToMenuFromCodex');
  const backToMenuFromSettings = document.getElementById('backToMenuFromSettings');

  const canvas = document.getElementById('raceCanvas');
  const ctx = canvas.getContext('2d');
  const miniMap = document.getElementById('miniMapCanvas');
  const mm = miniMap.getContext('2d');
  const canvasWrap = document.querySelector('.canvasWrap');
  const startRaceBtn = document.getElementById('startRaceBtn');
  const pauseRaceBtn = document.getElementById('pauseRaceBtn');
  const replayRaceBtn = document.getElementById('replayRaceBtn');
  const nextRaceBtn = document.getElementById('nextRaceBtn');
  const telemetryList = document.getElementById('telemetryList');
  const lapInfoLabel = document.getElementById('lapInfoLabel');
  const raceTimeLabel = document.getElementById('raceTimeLabel');
  const resultsLabel = document.getElementById('resultsLabel');
  const teamsList = document.getElementById('teamsList');
  const contentRoadmapPanel = document.getElementById('contentRoadmap');
  const integrationRoadmapPanel = document.getElementById('integrationRoadmap');
  const top3Banner = document.getElementById('top3Banner');
  const restartHoldBanner = document.getElementById('restartHoldBanner');
  const broadcastIntro = document.getElementById('broadcastIntro');
  const broadcastIntroHeadline = document.getElementById('broadcastIntroHeadline');
  const broadcastIntroSummary = document.getElementById('broadcastIntroSummary');
  const broadcastIntroLeaders = document.getElementById('broadcastIntroLeaders');
  const broadcastIntroSkip = document.getElementById('broadcastIntroSkip');
  const raceFlag = document.getElementById('raceFlag');
  const highlightTicker = document.getElementById('highlightTicker');
  const leaderboardHud = document.getElementById('leaderboardHud');
  const leaderboardList = leaderboardHud?.querySelector('ol');
  const liveTickerList = document.getElementById('liveTickerList');
  const liveTickerPanel = document.querySelector('.liveTickerPanel');
  const sessionInfo = document.getElementById('sessionInfo');
  const leaderGapHud = document.getElementById('leaderGapHud');
  const leaderGapLabel = leaderGapHud?.querySelector('.label');
  const leaderGapDelta = leaderGapHud?.querySelector('.delta');
  const leaderGapFill = leaderGapHud?.querySelector('.gapBar .fill');
  const startLights = document.getElementById('startLights');
  const startLightBulbs = startLights ? Array.from(startLights.querySelectorAll('.light')) : [];
  let startLightClearTimer = null;
  let startLightsActiveTotal = 5;
  const marshalOverlay = document.getElementById('marshalOverlay');
  const marshalMessage = document.getElementById('marshalMessage');
  const cameraHud = document.getElementById('cameraHud');
  const eventBanner = document.getElementById('eventBanner');
  const eventBannerPrimary = eventBanner?.querySelector('.primary') || null;
  const eventBannerSecondary = eventBanner?.querySelector('.secondary') || null;
  const battleSpotlight = document.getElementById('battleSpotlight');
  const battleSpotlightLabel = battleSpotlight?.querySelector('.label') || null;
  const battleSpotlightGap = battleSpotlight?.querySelector('.gap') || null;
  const battleSpotlightTrend = battleSpotlight?.querySelector('.trend') || null;
  let battleSpotlightState = null;
  let battleSpotlightIdle = 0;
  const BATTLE_SPOTLIGHT_THRESHOLD = 0.9;
  const BATTLE_SPOTLIGHT_HIDE_DELAY = 2.8;
  const BATTLE_SPOTLIGHT_TREND_DELTA = 0.08;
  const sectorWidget = document.getElementById('sectorWidget');
  const fastestLapLabel = document.getElementById('fastestLapLabel');
  const focusDriverPanel = document.getElementById('focusDriverPanel');
  const focusDriverName = document.getElementById('focusDriverName');
  const focusDriverMeta = document.getElementById('focusDriverMeta');
  const focusDriverStats = document.getElementById('focusDriverStats');
  const focusDriverTrend = document.getElementById('focusDriverTrend');
  const raceControlPanel = document.getElementById('raceControlPanel');
  const raceControlLog = document.getElementById('raceControlLog');
  const gridIntroOverlay = document.getElementById('gridIntro');
  const gridIntroList = document.getElementById('gridIntroList');
  const gridIntroMeta = document.getElementById('gridIntroMeta');
  const gridIntroDismiss = document.getElementById('gridIntroDismiss');
  const gridIntroTimer = document.getElementById('gridIntroTimer');
  const replayControls = document.getElementById('replayControls');
  const replayPlayPauseBtn = document.getElementById('replayPlayPause');
  const replayScrubber = document.getElementById('replayScrubber');
  const replayTimeLabel = document.getElementById('replayTimeLabel');
  const replaySpeedSelect = document.getElementById('replaySpeed');
  const replayBookmarkSelect = document.getElementById('replayBookmarkSelect');
  const podiumOverlay = document.getElementById('podiumOverlay');
  const podiumList = document.getElementById('podiumList');
  const podiumCloseBtn = document.getElementById('podiumCloseBtn');
  const timingModalBtn = document.getElementById('timingModalBtn');
  const timingModal = document.getElementById('timingModal');
  const timingModalClose = document.getElementById('timingModalClose');
  const timingModalTable = document.getElementById('timingModalTable');
  let marshalHideTimer = null;
  let titleThemeStarted = false;
  let titleThemeArmed = false;
  let titleThemeGain = null;
  let titleThemeSources = [];

  function setStartButtonState(enabled, label = 'Rennen starten') {
    if (!startRaceBtn) return;
    startRaceBtn.disabled = !enabled;
    if (enabled) {
      startRaceBtn.removeAttribute('disabled');
    } else {
      startRaceBtn.setAttribute('disabled', 'disabled');
    }
    startRaceBtn.setAttribute('aria-disabled', String(!enabled));
    startRaceBtn.setAttribute('data-state', enabled ? 'ready' : 'disabled');
    if (label) {
      startRaceBtn.textContent = label;
    }
  }

  function setPauseButtonState(enabled, label = 'Pause') {
    if (!pauseRaceBtn) return;
    pauseRaceBtn.disabled = !enabled;
    if (enabled) {
      pauseRaceBtn.removeAttribute('disabled');
    } else {
      pauseRaceBtn.setAttribute('disabled', 'disabled');
    }
    pauseRaceBtn.setAttribute('aria-disabled', String(!enabled));
    pauseRaceBtn.setAttribute('data-state', enabled ? 'armed' : 'locked');
    if (label) {
      pauseRaceBtn.textContent = label;
    }
  }

  function clearHighlightTickerClasses() {
    if (!highlightTicker) return;
    highlightTickerToneClasses.forEach(cls => highlightTicker.classList.remove(cls));
  }

  function resetHighlightTicker() {
    if (!highlightTicker) return;
    highlightTickerQueue.length = 0;
    highlightTickerActive = null;
    if (highlightTickerTimer) {
      clearTimeout(highlightTickerTimer);
      highlightTickerTimer = null;
    }
    highlightTicker.classList.remove('visible');
    clearHighlightTickerClasses();
    highlightTicker.textContent = '';
  }

  function queueHighlightTicker(tag, message, tone = 'info') {
    if (!highlightTicker || !message) return;
    const toneClassMap = {
      info: 'tone-info',
      yellow: 'tone-yellow',
      sc: 'tone-sc',
      pb: 'tone-pb',
      fl: 'tone-fl',
      finish: 'tone-finish',
      warn: 'tone-warn',
      pit: 'tone-pit',
      stats: 'tone-stats'
    };
    const toneClass = toneClassMap[tone] || toneClassMap.info;
    const duration = Math.max(2600, Math.min(7000, 2200 + message.length * 35));
    highlightTickerQueue.push({ tag, message, toneClass, duration });
    if (!highlightTickerActive) {
      showNextHighlightTicker();
    }
  }

  function resetCautionHistory() {
    cautionLapHistory = [];
    currentCautionEntry = null;
  }

  function beginCautionPhaseTracking(name) {
    if (name !== 'YELLOW' && name !== 'SAFETY') {
      return;
    }
    currentCautionEntry = {
      phase: name,
      laps: 0,
      leaderLap: null,
      startedAt: raceTime
    };
    cautionLapHistory.push(currentCautionEntry);
  }

  function finalizeCautionPhaseTracking(nextPhase) {
    if (!currentCautionEntry) return;
    if (nextPhase === 'YELLOW' || nextPhase === 'SAFETY') return;
    currentCautionEntry.leaderLap = null;
    currentCautionEntry = null;
  }

  function trackCautionLaps(leader) {
    if (!currentCautionEntry || !leader) return;
    if (!Number.isFinite(currentCautionEntry.leaderLap)) {
      currentCautionEntry.leaderLap = leader.lap;
      return;
    }
    if (leader.lap > currentCautionEntry.leaderLap) {
      const delta = leader.lap - currentCautionEntry.leaderLap;
      currentCautionEntry.leaderLap = leader.lap;
      currentCautionEntry.laps += delta;
      const label = currentCautionEntry.phase === 'SAFETY' ? 'Safety Car' : 'Gelbphase';
      const tone = currentCautionEntry.phase === 'SAFETY' ? 'sc' : 'yellow';
      const tag = tone === 'sc' ? '🚨' : '🟨';
      queueHighlightTicker(tag, `${label} – Runde ${currentCautionEntry.laps}`, tone);
    }
  }

  function logPitStopHighlight(car, tireGain, systemGain) {
    if (!car) return;
    const tyrePercent = Math.max(0, Math.round(tireGain * 100));
    const systemPercent = Math.max(0, Math.round(systemGain * 100));
    const parts = [];
    if (tyrePercent > 0) parts.push(`Reifen +${tyrePercent}%`);
    if (systemPercent > 0) parts.push(`Systeme +${systemPercent}%`);
    const detail = parts.length ? parts.join(' · ') : 'Service abgeschlossen';
    const headline = `#${car.racingNumber} ${car.driver} Boxenstopp ${car.pitCount}`;
    const message = parts.length ? `${headline} · ${detail}` : headline;
    queueHighlightTicker('🛠️', message, 'pit');
    racePitLog.unshift({
      driver: car.driver,
      team: car.team,
      number: car.racingNumber,
      lap: car.lap,
      stop: car.pitCount,
      tireGain: tyrePercent,
      systemGain: systemPercent,
      time: getEffectiveRaceTime(),
      detail
    });
    if (racePitLog.length > 18) {
      racePitLog.pop();
    }
  }

  function handleReplayBookmark(phase, previousPhase) {
    let label = null;
    if (phase === 'FORMATION') {
      label = 'Formation Lap';
    } else if (phase === 'GREEN') {
      label = previousPhase === 'RESTART' ? 'Restart – Green' : 'Start – Green Flag';
    } else if (phase === 'RESTART') {
      label = 'Restart Hold';
    }
    if (label) {
      addReplayBookmark(raceTime, label);
    }
  }

  function renderTimingModal(order) {
    if (!timingModal || !timingModalTable) return;
    const rows = Array.isArray(order) && order.length ? order : lastTelemetryOrder;
    timingModalTable.innerHTML = '';
    if (!rows || !rows.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 8;
      td.textContent = 'Keine Timing-Daten – starte ein Rennen.';
      timingModalTable.appendChild(tr);
      tr.appendChild(td);
      return;
    }
    const leader = rows[0];
    rows.forEach((car, idx) => {
      const tr = document.createElement('tr');
      const pos = document.createElement('td');
      pos.textContent = `P${idx + 1}`;
      const driverCell = document.createElement('td');
      const tag = document.createElement('div');
      tag.className = 'driverTag';
      const name = document.createElement('strong');
      name.textContent = `#${car.racingNumber} ${car.driver}`;
      const team = document.createElement('span');
      team.textContent = `${car.team} • ${car.chassisLabel || 'Spec'}`;
      tag.appendChild(name);
      tag.appendChild(team);
      driverCell.appendChild(tag);
      const gapCell = document.createElement('td');
      if (!leader || leader.id === car.id) {
        gapCell.textContent = 'Leader';
      } else {
        const gap = Math.abs(computeTimeGap(leader, car));
        gapCell.textContent = `+${formatGap(gap)}s`;
      }
      const lapCell = document.createElement('td');
      lapCell.textContent = `${Math.min(car.lap, totalLaps)} / ${totalLaps}`;
      const lastLapCell = document.createElement('td');
      lastLapCell.textContent = formatTime(car.lastLapTime).replace('.', ',');
      const bestLapCell = document.createElement('td');
      bestLapCell.textContent = formatTime(car.bestLapTime).replace('.', ',');
      const pitCell = document.createElement('td');
      pitCell.textContent = car.pitCount ? `${car.pitCount}` : '0';
      const statusCell = document.createElement('td');
      let statusClass = 'ok';
      let statusLabel = 'On Track';
      if (car.finished) {
        statusClass = 'ok';
        statusLabel = 'Im Ziel';
      } else if (car.inPit) {
        statusClass = 'pit';
        statusLabel = 'In Box';
      } else if (car.systemIntegrity < 0.5 || car.tireWear > 0.7) {
        statusClass = 'danger';
        statusLabel = car.systemIntegrity < 0.5 ? 'Systeme' : 'Reifen';
      }
      const badge = document.createElement('span');
      badge.className = `statusBadge ${statusClass}`;
      badge.textContent = statusLabel;
      statusCell.appendChild(badge);
      tr.append(pos, driverCell, gapCell, lapCell, lastLapCell, bestLapCell, pitCell, statusCell);
      timingModalTable.appendChild(tr);
    });
  }

  function setTimingModalOpen(open) {
    if (!timingModal) return;
    timingModalOpen = !!open;
    timingModal.classList.toggle('hidden', !timingModalOpen);
    if (timingModalOpen) {
      renderTimingModal(lastTelemetryOrder);
    }
  }

  function closeTimingModal() {
    setTimingModalOpen(false);
  }

  function resetBattleSpotlight(hide = true) {
    battleSpotlightState = null;
    battleSpotlightIdle = 0;
    if (!battleSpotlight) return;
    battleSpotlight.classList.remove('closing', 'widening');
    if (battleSpotlightLabel) battleSpotlightLabel.textContent = '--';
    if (battleSpotlightGap) battleSpotlightGap.textContent = 'Gap --';
    if (battleSpotlightTrend) battleSpotlightTrend.textContent = 'Stabil';
    if (hide) {
      battleSpotlight.classList.add('hidden');
    }
  }

  function hideBattleSpotlightIfIdle(force = false) {
    if (!battleSpotlight) return;
    if (force || battleSpotlightIdle > BATTLE_SPOTLIGHT_HIDE_DELAY) {
      battleSpotlight.classList.add('hidden');
      battleSpotlight.classList.remove('closing', 'widening');
      battleSpotlightState = null;
      battleSpotlightIdle = 0;
    }
  }

  function updateBattleSpotlight(order, dt = 0) {
    if (!battleSpotlight) return;
    if (!raceActive) {
      battleSpotlightIdle += dt;
      hideBattleSpotlightIfIdle(true);
      return;
    }
    if (!Array.isArray(order) || order.length < 2) {
      battleSpotlightIdle += dt;
      hideBattleSpotlightIfIdle(false);
      return;
    }
    if (racePhase !== 'GREEN' && racePhase !== 'RESTART') {
      battleSpotlightIdle += dt;
      hideBattleSpotlightIfIdle(false);
      return;
    }
    if (isRestartHoldActive()) {
      battleSpotlightIdle += dt;
      hideBattleSpotlightIfIdle(false);
      return;
    }
    let bestLeader = null;
    let bestChaser = null;
    let bestIndex = -1;
    let smallestGap = Infinity;
    for (let idx = 1; idx < order.length; idx++) {
      const ahead = order[idx - 1];
      const car = order[idx];
      if (!ahead || !car) continue;
      if (ahead.finished || car.finished) continue;
      const gap = Math.abs(computeTimeGap(ahead, car));
      if (!Number.isFinite(gap)) continue;
      if (gap < smallestGap) {
        smallestGap = gap;
        bestLeader = ahead;
        bestChaser = car;
        bestIndex = idx;
      }
    }
    if (!bestLeader || !bestChaser || smallestGap > BATTLE_SPOTLIGHT_THRESHOLD) {
      battleSpotlightIdle += dt;
      hideBattleSpotlightIfIdle(false);
      return;
    }
    battleSpotlightIdle = 0;
    const previous = battleSpotlightState;
    battleSpotlightState = {
      leaderId: bestLeader.id,
      chaserId: bestChaser.id,
      gap: smallestGap
    };
    const leaderLine = `P${bestIndex} #${bestLeader.racingNumber} ${bestLeader.driver}`;
    const chaserLine = `P${bestIndex + 1} #${bestChaser.racingNumber} ${bestChaser.driver}`;
    if (battleSpotlightLabel) {
      battleSpotlightLabel.textContent = `${leaderLine} vs ${chaserLine}`;
    }
    if (battleSpotlightGap) {
      battleSpotlightGap.textContent = `Gap +${formatGap(smallestGap)}s`;
    }
    if (battleSpotlightTrend) {
      let trendLabel = 'Stabil';
      battleSpotlight.classList.remove('closing', 'widening');
      if (
        previous &&
        previous.leaderId === bestLeader.id &&
        previous.chaserId === bestChaser.id &&
        Number.isFinite(previous.gap)
      ) {
        if (smallestGap < previous.gap - BATTLE_SPOTLIGHT_TREND_DELTA) {
          trendLabel = 'Gap schrumpft';
          battleSpotlight.classList.add('closing');
        } else if (smallestGap > previous.gap + BATTLE_SPOTLIGHT_TREND_DELTA) {
          trendLabel = 'Gap wächst';
          battleSpotlight.classList.add('widening');
        }
      }
      battleSpotlightTrend.textContent = trendLabel;
    }
    battleSpotlight.classList.remove('hidden');
  }

  function showNextHighlightTicker() {
    if (!highlightTicker || highlightTickerActive) return;
    const next = highlightTickerQueue.shift();
    if (!next) return;
    highlightTickerActive = next;
    highlightTicker.textContent = `${next.tag} ${next.message}`;
    clearHighlightTickerClasses();
    if (next.toneClass) {
      highlightTicker.classList.add(next.toneClass);
    }
    highlightTicker.classList.add('visible');
    if (highlightTickerTimer) {
      clearTimeout(highlightTickerTimer);
    }
    highlightTickerTimer = setTimeout(() => {
      hideHighlightTicker();
    }, next.duration);
  }

  function hideHighlightTicker() {
    if (!highlightTicker) return;
    highlightTicker.classList.remove('visible');
    if (highlightTickerTimer) {
      clearTimeout(highlightTickerTimer);
      highlightTickerTimer = null;
    }
    highlightTickerActive = null;
    if (highlightTickerQueue.length > 0) {
      setTimeout(() => {
        if (!highlightTickerActive) {
          showNextHighlightTicker();
        }
      }, 180);
    } else {
      clearHighlightTickerClasses();
      highlightTicker.textContent = '';
    }
  }

  function resetRaceControls() {
    resetStartLights();
    resetMarshalOverlay();
    resetEventBanner();
    resetHighlightTicker();
    resetBattleSpotlight();
    setTimingModalOpen(false);
    setPauseButtonState(false, 'Pause');
    setStartButtonState(true, 'Rennen starten');
    restartHoldUntil = 0;
    restartReleaseArmed = false;
    updateRestartHoldHud();
    jumpStartArmed = false;
    jumpStartBaselines.clear();
    jumpStartWarnings.clear();
    cancelBroadcastIntro();
    if (replayRaceBtn) {
      replayRaceBtn.style.display = 'none';
      replayRaceBtn.textContent = 'Replay';
    }
    if (replayControls) {
      replayControls.classList.add('hidden');
      replayControls.setAttribute('aria-hidden', 'true');
    }
  }

  function resetEventBanner() {
    if (!eventBanner) return;
    eventBannerQueue.length = 0;
    eventBannerActive = null;
    if (eventBannerTimer) {
      clearTimeout(eventBannerTimer);
      eventBannerTimer = null;
    }
    eventBanner.classList.add('hidden');
    eventBanner.classList.remove('info', 'pass', 'caution', 'alert', 'success');
    if (eventBannerPrimary) eventBannerPrimary.textContent = '';
    if (eventBannerSecondary) {
      eventBannerSecondary.textContent = '';
      eventBannerSecondary.classList.add('hiddenLine');
    }
  }

  function queueEventBanner(primary, secondary = '', tone = 'info', options = {}) {
    if (!eventBanner || !primary) return;
    const entry = {
      primary,
      secondary,
      tone,
      duration: typeof options.duration === 'number' && options.duration > 0 ? options.duration : 4000
    };
    eventBannerQueue.push(entry);
    if (!eventBannerActive) {
      showNextEventBanner();
    }
  }

  function showNextEventBanner() {
    if (!eventBanner || eventBannerActive) return;
    const next = eventBannerQueue.shift();
    if (!next) return;
    eventBannerActive = next;
    eventBanner.classList.remove('hidden', 'info', 'pass', 'caution', 'alert', 'success');
    eventBanner.classList.add(next.tone || 'info');
    if (eventBannerPrimary) eventBannerPrimary.textContent = next.primary;
    if (eventBannerSecondary) {
      eventBannerSecondary.textContent = next.secondary || '';
      eventBannerSecondary.classList.toggle('hiddenLine', !next.secondary);
    }
    if (eventBannerTimer) {
      clearTimeout(eventBannerTimer);
    }
    eventBannerTimer = setTimeout(() => {
      hideEventBanner();
    }, next.duration);
  }

  function hideEventBanner() {
    if (!eventBanner) return;
    eventBanner.classList.add('hidden');
    if (eventBannerTimer) {
      clearTimeout(eventBannerTimer);
      eventBannerTimer = null;
    }
    eventBannerActive = null;
    if (eventBannerQueue.length > 0) {
      setTimeout(() => {
        if (!eventBannerActive) {
          showNextEventBanner();
        }
      }, 220);
    } else {
      eventBanner.classList.remove('info', 'pass', 'caution', 'alert', 'success');
    }
  }

  function resetStartLights() {
    if (!startLights) return;
    startLights.classList.add('hidden');
    startLights.classList.remove('go');
    startLights.setAttribute('aria-hidden', 'true');
    startLightBulbs.forEach(bulb => {
      bulb.classList.remove('on');
      bulb.classList.remove('dimmed');
    });
    if (startLightClearTimer) {
      clearTimeout(startLightClearTimer);
      startLightClearTimer = null;
    }
  }

  function resetMarshalOverlay() {
    if (!marshalOverlay) return;
    if (marshalHideTimer) {
      clearTimeout(marshalHideTimer);
      marshalHideTimer = null;
    }
    marshalOverlay.classList.add('hidden');
    marshalOverlay.setAttribute('aria-hidden', 'true');
    marshalOverlay.classList.remove('wave', 'ready', 'countdown', 'formation', 'go');
    if (marshalMessage) {
      marshalMessage.textContent = '';
    }
  }

  function setMarshalState(state, message, options = {}) {
    if (!marshalOverlay) return;
    if (marshalHideTimer) {
      clearTimeout(marshalHideTimer);
      marshalHideTimer = null;
    }
    marshalOverlay.classList.remove('hidden');
    marshalOverlay.setAttribute('aria-hidden', 'false');
    marshalOverlay.classList.remove('wave', 'ready', 'countdown', 'formation', 'go');
    if (state) {
      marshalOverlay.classList.add(state);
    }
    if (marshalMessage && typeof message === 'string') {
      marshalMessage.textContent = message;
    }
    const autoHide = typeof options.autoHide === 'number' ? options.autoHide : null;
    if (autoHide && autoHide > 0) {
      marshalHideTimer = setTimeout(() => {
        resetMarshalOverlay();
      }, autoHide);
    }
  }

  function setStartLightState(count = 0, total = startLightsActiveTotal) {
    if (!startLights || !startLightBulbs.length) return;
    const maxTotal = startLightBulbs.length;
    startLightsActiveTotal = Math.max(1, Math.min(total, maxTotal));
    const activeCount = Math.max(0, Math.min(count, startLightsActiveTotal));
    startLights.classList.remove('go');
    startLights.classList.remove('hidden');
    startLights.setAttribute('aria-hidden', 'false');
    startLightBulbs.forEach((bulb, idx) => {
      const inRange = idx < startLightsActiveTotal;
      bulb.classList.toggle('dimmed', !inRange);
      if (!inRange) {
        bulb.classList.remove('on');
        return;
      }
      bulb.classList.toggle('on', idx < activeCount);
    });
  }

  function flashStartLights() {
    if (!startLights) return;
    startLights.classList.add('go');
    startLightBulbs.forEach(bulb => bulb.classList.remove('on'));
    if (startLightClearTimer) {
      clearTimeout(startLightClearTimer);
    }
    startLightClearTimer = window.setTimeout(() => {
      resetStartLights();
    }, 600);
  }

  function ensureAudioContext() {
    if (audioCtx) return audioCtx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
    return audioCtx;
  }

  function stopTitleTheme(reset = false) {
    if (!titleThemeGain || !audioCtx) {
      if (reset) {
        titleThemeStarted = false;
        titleThemeGain = null;
        titleThemeSources = [];
      }
      return;
    }
    const ctx = audioCtx;
    const now = ctx.currentTime;
    try {
      titleThemeGain.gain.cancelScheduledValues(now);
      titleThemeGain.gain.setValueAtTime(titleThemeGain.gain.value, now);
      titleThemeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    } catch (err) {
      /* noop */
    }
    titleThemeSources.forEach(entry => {
      if (!entry) return;
      try {
        entry.gain.gain.cancelScheduledValues(now);
        entry.gain.gain.setValueAtTime(entry.gain.gain.value, now);
        entry.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        entry.osc.stop(now + 0.3);
      } catch (err) {
        /* noop */
      }
    });
    titleThemeSources = [];
    window.setTimeout(() => {
      try {
        titleThemeGain.disconnect();
      } catch (err) {
        /* noop */
      }
      titleThemeGain = null;
    }, 360);
    titleThemeStarted = false;
  }

  function playTitleTheme() {
    if (titleThemeStarted) return;
    if (uiSettings && uiSettings.enableAudio === false) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    titleThemeStarted = true;
    titleThemeArmed = false;
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    titleThemeGain = master;
    const now = ctx.currentTime + 0.08;
    const notes = [
      { freq: 220, duration: 0.42, gain: 0.16, type: 'sawtooth', offset: 0 },
      { freq: 277, duration: 0.36, gain: 0.14, type: 'triangle', offset: 0.32 },
      { freq: 330, duration: 0.36, gain: 0.14, type: 'sawtooth', offset: 0.64 },
      { freq: 392, duration: 0.48, gain: 0.18, type: 'triangle', offset: 0.96 },
      { freq: 523, duration: 0.5, gain: 0.18, type: 'square', offset: 1.32 },
      { freq: 392, duration: 0.4, gain: 0.15, type: 'triangle', offset: 1.82 },
      { freq: 440, duration: 0.5, gain: 0.16, type: 'sawtooth', offset: 2.14 },
      { freq: 659, duration: 0.6, gain: 0.2, type: 'triangle', offset: 2.64 },
      { freq: 523, duration: 0.6, gain: 0.18, type: 'sawtooth', offset: 3.24 },
      { freq: 784, duration: 0.7, gain: 0.2, type: 'triangle', offset: 3.86 }
    ];
    const pad = ctx.createOscillator();
    const padGain = ctx.createGain();
    pad.type = 'sine';
    pad.frequency.setValueAtTime(110, now - 0.02);
    padGain.gain.setValueAtTime(0.0001, now - 0.05);
    padGain.gain.linearRampToValueAtTime(0.08, now + 0.6);
    padGain.gain.linearRampToValueAtTime(0.04, now + 4.6);
    padGain.gain.linearRampToValueAtTime(0.0001, now + 5.4);
    pad.connect(padGain);
    padGain.connect(master);
    pad.start(now - 0.05);
    pad.stop(now + 5.6);
    pad.onended = () => {
      try {
        padGain.disconnect();
      } catch (err) {
        /* noop */
      }
      titleThemeSources = titleThemeSources.filter(entry => entry.osc !== pad);
    };
    titleThemeSources.push({ osc: pad, gain: padGain });
    notes.forEach(note => {
      const osc = ctx.createOscillator();
      osc.type = note.type || 'sawtooth';
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.0001, now + note.offset);
      gainNode.gain.linearRampToValueAtTime(note.gain, now + note.offset + 0.04);
      gainNode.gain.linearRampToValueAtTime(0.0001, now + note.offset + note.duration);
      osc.frequency.setValueAtTime(note.freq, now + note.offset);
      osc.connect(gainNode);
      gainNode.connect(master);
      const stopAt = now + note.offset + note.duration + 0.08;
      osc.start(now + note.offset);
      osc.stop(stopAt);
      titleThemeSources.push({ osc, gain: gainNode });
      osc.onended = () => {
        try {
          gainNode.disconnect();
        } catch (err) {
          /* noop */
        }
        titleThemeSources = titleThemeSources.filter(entry => entry.osc !== osc);
      };
    });
    master.gain.setValueAtTime(0.0001, now - 0.05);
    master.gain.linearRampToValueAtTime(0.14, now + 0.5);
    master.gain.linearRampToValueAtTime(0.08, now + 4.8);
    master.gain.linearRampToValueAtTime(0.0001, now + 6.2);
    window.setTimeout(() => {
      if (titleThemeGain === master) {
        try {
          master.disconnect();
        } catch (err) {
          /* noop */
        }
        titleThemeGain = null;
      }
    }, 6400);
  }

  function armTitleThemeTrigger() {
    if (titleThemeStarted || titleThemeArmed) return;
    if (uiSettings && uiSettings.enableAudio === false) return;
    titleThemeArmed = true;
    const handler = () => {
      document.removeEventListener('pointerdown', handler);
      document.removeEventListener('keydown', handler);
      titleThemeArmed = false;
      playTitleTheme();
    };
    document.addEventListener('pointerdown', handler);
    document.addEventListener('keydown', handler);
  }

  function warmupAudio() {
    if (uiSettings && uiSettings.enableAudio === false) {
      if (audioCtx && typeof audioCtx.suspend === 'function' && audioCtx.state !== 'closed') {
        audioCtx.suspend().catch(() => {});
      }
      return;
    }
    const ctx = ensureAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  function playTone(frequency, duration, type = 'sine', gain = 0.15) {
    if (uiSettings && uiSettings.enableAudio === false) {
      return;
    }
    const ctx = ensureAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const oscillator = ctx.createOscillator();
    const amp = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    amp.gain.value = gain;
    oscillator.connect(amp);
    amp.connect(ctx.destination);
    const now = ctx.currentTime;
    oscillator.start(now);
    oscillator.stop(now + duration);
    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
  }

  function playRaceCue(kind) {
    switch (kind) {
      case 'light':
        playTone(520, 0.12, 'triangle', 0.12);
        break;
      case 'go':
        playTone(720, 0.2, 'sawtooth', 0.18);
        window.setTimeout(() => playTone(840, 0.18, 'sine', 0.1), 120);
        break;
      case 'yellow':
        playTone(340, 0.22, 'square', 0.14);
        break;
      case 'safety':
        playTone(300, 0.28, 'square', 0.16);
        break;
      case 'green':
        playTone(660, 0.18, 'triangle', 0.16);
        break;
      case 'finish':
        playTone(540, 0.26, 'sawtooth', 0.18);
        window.setTimeout(() => playTone(720, 0.32, 'triangle', 0.12), 220);
        break;
      default:
        break;
    }
  }

  function hidePodiumOverlay(clear = false) {
    if (podiumOverlay) {
      podiumOverlay.classList.add('hidden');
      podiumOverlay.setAttribute('aria-hidden', 'true');
      podiumOverlay.classList.remove('celebrate');
    }
    if (podiumTimer) {
      clearTimeout(podiumTimer);
      podiumTimer = null;
    }
    if (clear && podiumList) {
      podiumList.innerHTML = '';
    }
  }

  function showPodium(order) {
    if (!podiumOverlay || !podiumList) return;
    podiumList.innerHTML = '';
    if (!Array.isArray(order) || order.length === 0) {
      hidePodiumOverlay(true);
      return;
    }
    const leader = order[0];
    const medals = ['gold', 'silver', 'bronze'];
    const frag = document.createDocumentFragment();
    order.slice(0, 3).forEach((car, idx) => {
      if (!car) return;
      const li = document.createElement('li');
      if (medals[idx]) li.classList.add(medals[idx]);
      const pos = document.createElement('span');
      pos.className = 'pos';
      pos.textContent = `${idx + 1}.`;
      const meta = document.createElement('div');
      meta.className = 'meta';
      const name = document.createElement('strong');
      name.textContent = `#${car.racingNumber} ${car.driver}`;
      name.style.color = car.color;
      const team = document.createElement('span');
      team.textContent = car.team;
      const detail = document.createElement('span');
      if (idx === 0) {
        detail.textContent = car.finishTime != null ? `Gesamt: ${formatTime(car.finishTime)}` : 'Gesamt: --';
      } else if (leader && leader.finishTime != null && car.finishTime != null) {
        const gap = Math.max(0, car.finishTime - leader.finishTime);
        detail.textContent = `Gap: +${formatGap(gap)}s`;
      } else {
        detail.textContent = 'Gap: --';
      }
      meta.appendChild(name);
      meta.appendChild(team);
      meta.appendChild(detail);
      li.appendChild(pos);
      li.appendChild(meta);
      frag.appendChild(li);
    });
    podiumList.appendChild(frag);
    podiumOverlay.classList.remove('hidden');
    podiumOverlay.setAttribute('aria-hidden', 'false');
    podiumOverlay.classList.add('celebrate');
    if (podiumTimer) clearTimeout(podiumTimer);
    podiumTimer = setTimeout(() => hidePodiumOverlay(false), 8000);
  }

  function stopReplay(resetView = true) {
    if (replayRafId) {
      cancelAnimationFrame(replayRafId);
      replayRafId = 0;
    }
    replayActive = false;
    replayPlaying = false;
    replayAccumulator = 0;
    replayLastTimestamp = 0;
    if (replayControls) {
      replayControls.classList.add('hidden');
      replayControls.setAttribute('aria-hidden', 'true');
    }
    if (replayPlayPauseBtn) {
      replayPlayPauseBtn.textContent = '▶︎';
      replayPlayPauseBtn.setAttribute('aria-label', 'Replay abspielen');
    }
    if (replayRaceBtn) {
      replayRaceBtn.textContent = 'Replay ansehen';
    }
    if (sessionInfo && replaySessionInfoCache) {
      sessionInfo.textContent = replaySessionInfoCache.text || '';
      sessionInfo.classList.toggle('hidden', replaySessionInfoCache.hidden);
      replaySessionInfoCache = null;
    }
    if (resetView) {
      drawScene();
      updateSessionInfo();
    }
  }

  function clearReplayData() {
    stopReplay(false);
    replayBuffer.length = 0;
    replayMeta = new Map();
    replayCarState = new Map();
    replayCursor = 0;
    replayAccumulator = 0;
    replayAppliedIndex = -1;
    replayTotalDuration = 0;
    if (replayScrubber) {
      replayScrubber.value = '0';
      replayScrubber.max = '1';
    }
    if (replayTimeLabel) {
      replayTimeLabel.textContent = '0,0s / 0,0s';
    }
    replayBookmarks.length = 0;
    updateReplayBookmarksUI();
  }

  function prepareReplayMeta() {
    replayMeta = new Map();
    cars.forEach(car => {
      replayMeta.set(car.id, {
        id: car.id,
        driver: car.driver,
        team: car.team,
        racingNumber: car.racingNumber,
        color: car.color,
        baseSpeed: car.baseSpeed,
        profile: car.profile,
        bodyGeometry: car.bodyGeometry || defaultChassisSpec.geometry
      });
    });
  }

  function projectReplayFrame(frame, resetTrails = false) {
    if (!frame) return;
    frame.cars.forEach(entry => {
      const meta = replayMeta.get(entry.id);
      if (!meta) return;
      let state = replayCarState.get(entry.id);
      if (!state || resetTrails) {
        state = {
          id: meta.id,
          driver: meta.driver,
          team: meta.team,
          racingNumber: meta.racingNumber,
          color: meta.color,
          baseSpeed: meta.baseSpeed,
          profile: meta.profile,
          bodyGeometry: meta.bodyGeometry,
          trail: []
        };
        replayCarState.set(entry.id, state);
      }
      if (resetTrails && state.trail) {
        state.trail.length = 0;
      }
      state.x = entry.x;
      state.y = entry.y;
      state.angle = entry.angle;
      state.lap = entry.lap;
      state.progress = entry.progress;
      state.finishTime = entry.finishTime;
      state.finished = entry.finished;
      state.lastLapTime = entry.lastLapTime;
      state.bestLapTime = entry.bestLapTime;
      state.currentSpeed = entry.currentSpeed;
      if (!state.trail) state.trail = [];
      state.trail.push({ x: entry.x, y: entry.y });
      if (state.trail.length > 48) state.trail.shift();
      state.getPosition = () => ({ x: state.x, y: state.y, angle: state.angle || 0 });
    });
  }

  function renderReplayFrame(frame) {
    if (!frame) return;
    const carsForRender = Array.from(replayCarState.values());
    const order = frame.order
      .map(id => replayCarState.get(id))
      .filter(Boolean);
    drawScene(order, carsForRender);
    if (replayActive && sessionInfo) {
      const label = frame.phase ? `Replay · ${frame.phase}` : 'Replay';
      sessionInfo.textContent = label;
      sessionInfo.classList.remove('hidden');
    }
  }

  function updateReplayBookmarksUI() {
    if (!replayBookmarkSelect) return;
    replayBookmarkSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '– Szene wählen –';
    replayBookmarkSelect.appendChild(placeholder);
    replayBookmarks
      .slice()
      .sort((a, b) => a.time - b.time)
      .forEach(bookmark => {
        const option = document.createElement('option');
        option.value = bookmark.time.toString();
        option.textContent = `${formatSecondsLabel(bookmark.time)} · ${bookmark.label}`;
        replayBookmarkSelect.appendChild(option);
      });
    replayBookmarkSelect.disabled = replayBookmarks.length === 0;
    if (replayBookmarks.length === 0) {
      replayBookmarkSelect.value = '';
    }
  }

  function addReplayBookmark(time, label) {
    if (!Number.isFinite(time) || !label) return;
    const normalized = Math.max(0, Number(time.toFixed(2)));
    const last = replayBookmarks[replayBookmarks.length - 1];
    if (last && Math.abs(last.time - normalized) < 0.2 && last.label === label) {
      return;
    }
    replayBookmarks.push({ time: normalized, label });
    if (replayBookmarks.length > 12) {
      replayBookmarks.shift();
    }
    updateReplayBookmarksUI();
  }

  function seekReplayToTime(time) {
    if (!Number.isFinite(time) || !replayBuffer.length) return;
    let index = replayBuffer.findIndex(frame => frame.time >= time - 0.05);
    if (index < 0) {
      index = replayBuffer.length - 1;
    }
    applyReplayFrame(index, true);
    updateReplayUi();
  }

  function updateReplayUi() {
    if (replayScrubber) {
      replayScrubber.value = String(replayCursor);
    }
    if (replayTimeLabel) {
      const currentTime = replayBuffer[replayCursor]?.time ?? 0;
      replayTimeLabel.textContent = `${formatSecondsLabel(currentTime)} / ${formatSecondsLabel(replayTotalDuration)}`;
    }
  }

  function applyReplayFrame(index, forceReset = false) {
    if (!replayBuffer.length) return;
    if (index < 0) index = 0;
    if (index >= replayBuffer.length) index = replayBuffer.length - 1;
    if (forceReset || index < replayAppliedIndex) {
      replayCarState = new Map();
      replayAppliedIndex = -1;
    }
    for (let i = Math.max(0, replayAppliedIndex + 1); i <= index; i++) {
      const frame = replayBuffer[i];
      projectReplayFrame(frame, i === 0 && (forceReset || replayAppliedIndex < 0));
      replayAppliedIndex = i;
    }
    replayCursor = index;
    renderReplayFrame(replayBuffer[index]);
    updateReplayUi();
  }

  function setReplayPlaying(active) {
    replayPlaying = !!active;
    if (replayPlayPauseBtn) {
      if (replayPlaying) {
        replayPlayPauseBtn.textContent = '❚❚';
        replayPlayPauseBtn.setAttribute('aria-label', 'Replay pausieren');
      } else {
        replayPlayPauseBtn.textContent = '▶︎';
        replayPlayPauseBtn.setAttribute('aria-label', 'Replay abspielen');
      }
    }
    if (replayPlaying) {
      replayLastTimestamp = 0;
      replayRafId = requestAnimationFrame(stepReplay);
    } else if (replayRafId) {
      cancelAnimationFrame(replayRafId);
      replayRafId = 0;
    }
  }

  function beginReplaySession() {
    if (!replayBuffer.length) {
      alert('Kein Replay verfügbar.');
      return;
    }
    if (replayActive) {
      stopReplay(true);
      return;
    }
    hidePodiumOverlay(false);
    replayActive = true;
    replayAccumulator = 0;
    replayLastTimestamp = 0;
    replayAppliedIndex = -1;
    replayCarState = new Map();
    if (replayControls) {
      replayControls.classList.remove('hidden');
      replayControls.setAttribute('aria-hidden', 'false');
    }
    if (replayRaceBtn) {
      replayRaceBtn.textContent = 'Replay stoppen';
    }
    if (replaySpeedSelect) {
      replaySpeedSelect.value = replaySpeed.toString();
    }
    if (replayScrubber) {
      replayScrubber.max = String(Math.max(1, replayBuffer.length - 1));
      replayScrubber.value = '0';
    }
    if (sessionInfo) {
      replaySessionInfoCache = {
        text: sessionInfo.textContent,
        hidden: sessionInfo.classList.contains('hidden')
      };
    }
    leaderGapHud?.classList.add('hidden');
    updateCameraHud([]);
    applyReplayFrame(0, true);
    setReplayPlaying(true);
  }

  function stepReplay(timestamp) {
    if (!replayActive || !replayPlaying) return;
    if (!replayLastTimestamp) replayLastTimestamp = timestamp;
    const elapsed = (timestamp - replayLastTimestamp) / 1000;
    replayLastTimestamp = timestamp;
    replayAccumulator += elapsed * replaySpeed;
    while (replayCursor < replayBuffer.length - 1) {
      const nextFrame = replayBuffer[replayCursor + 1];
      const frameDt = Math.max(0.016, nextFrame?.dt || 0.016);
      if (replayAccumulator < frameDt) break;
      replayAccumulator -= frameDt;
      replayCursor += 1;
      applyReplayFrame(replayCursor);
    }
    if (replayCursor >= replayBuffer.length - 1) {
      setReplayPlaying(false);
      return;
    }
    if (replayPlaying) {
      replayRafId = requestAnimationFrame(stepReplay);
    }
  }

  function captureReplayFrame(order, dt, phaseOverride = null) {
    if (!recordingReplay) return;
    const safeOrder = Array.isArray(order) && order.length ? order : cars.slice().sort(sortByRacePosition);
    const frame = {
      time: Number(raceTime.toFixed(4)),
      dt: Math.max(0.016, dt || 0.016),
      phase: phaseOverride || racePhase,
      order: safeOrder.map(car => car.id),
      cars: cars.map(car => {
        const pos = car.getPosition();
        return {
          id: car.id,
          x: pos.x,
          y: pos.y,
          angle: pos.angle || 0,
          lap: car.lap,
          progress: car.progress,
          finishTime: car.finishTime,
          finished: car.finished,
          lastLapTime: car.lastLapTime,
          bestLapTime: car.bestLapTime,
          currentSpeed: car.currentSpeed
        };
      })
    };
    replayBuffer.push(frame);
    replayTotalDuration = frame.time;
    if (replayBuffer.length > MAX_REPLAY_FRAMES) {
      replayBuffer.shift();
      if (replayAppliedIndex >= 0) {
        replayAppliedIndex = Math.max(-1, replayAppliedIndex - 1);
      }
      if (replayCursor > 0) {
        replayCursor = Math.max(0, replayCursor - 1);
      }
    }
  }

  const zoomSetting = document.getElementById('zoomSetting');
  const trackTypeSelect = document.getElementById('trackType');
  const lapsSetting = document.getElementById('lapsSetting');
  const aiDifficulty = document.getElementById('aiDifficulty');
  const startProc = document.getElementById('startProc');
  const weatherSetting = document.getElementById('weatherSetting');
  const toggleRaceControl = document.getElementById('toggleRaceControl');
  const toggleFocusPanel = document.getElementById('toggleFocusPanel');
  const toggleMiniMap = document.getElementById('toggleMiniMap');
  const toggleBroadcastIntro = document.getElementById('toggleBroadcastIntro');
  const toggleTicker = document.getElementById('toggleTicker');
  const toggleAudio = document.getElementById('toggleAudio');
  const cameraSetting = document.getElementById('cameraSetting');
  const racePaceSetting = document.getElementById('racePaceSetting');
  const cautionSetting = document.getElementById('cautionSetting');
  const eventBriefing = document.getElementById('eventBriefing');
  const eventTrackLabel = document.getElementById('eventTrackLabel');
  const eventWeatherLabel = document.getElementById('eventWeatherLabel');
  const eventWeatherDesc = document.getElementById('eventWeatherDesc');
  const eventTraitSummary = document.getElementById('eventTraitSummary');

  const managerTeamSelect = document.getElementById('managerTeamSelect');
  const managerBudget = document.getElementById('managerBudget');
  const managerSeasonLabel = document.getElementById('managerSeasonLabel');
  const managerWeekLabel = document.getElementById('managerWeekLabel');
  const managerChassisLabel = document.getElementById('managerChassisLabel');
  const managerFacilityLabel = document.getElementById('managerFacilityLabel');
  const managerNextTrack = document.getElementById('managerNextTrack');
  const contractList = document.getElementById('contractList');
  const upgradeStatus = document.getElementById('upgradeStatus');
  const facilityList = document.getElementById('facilityList');
  const managerNotice = document.getElementById('managerNotice');
  const managerSaveBtn = document.getElementById('managerSaveBtn');
  const managerExportBtn = document.getElementById('managerExportBtn');
  const managerImportInput = document.getElementById('managerImportInput');
  const managerStartRaceBtn = document.getElementById('managerStartRaceBtn');
  const freeAgentList = document.getElementById('freeAgentList');
  const advanceManagerWeekBtn = document.getElementById('advanceManagerWeekBtn');

  const betBalance = document.getElementById('betBalance');
  const betDriverSelect = document.getElementById('betDriverSelect');
  const betAmount = document.getElementById('betAmount');
  const betSlip = document.getElementById('betSlip');
  const betHistory = document.getElementById('betHistory');
  const oddsTable = document.getElementById('oddsTable');
  const placeBetBtn = document.getElementById('placeBetBtn');
  const betStartRaceBtn = document.getElementById('betStartRaceBtn');
  const loreEntries = document.getElementById('loreEntries');
  const driverCodex = document.getElementById('driverCodex');
  const codexGarage = document.getElementById('codexGarage');
  const raceArchive = document.getElementById('raceArchive');
  const hallOfFame = document.getElementById('hallOfFame');
  const exportProfileBtn = document.getElementById('exportProfileBtn');
  const importProfileBtn = document.getElementById('importProfileBtn');
  const importProfileInput = document.getElementById('importProfileInput');
  const wipeProfileBtn = document.getElementById('wipeProfileBtn');
  const settingsNotice = document.getElementById('settingsNotice');

  const uiSettings = loadUiSettings();
  const leaderboardGapHistory = new Map();
  const eventBannerQueue = [];
  let eventBannerActive = null;
  let eventBannerTimer = null;
  const highlightTickerToneClasses = ['tone-info', 'tone-yellow', 'tone-sc', 'tone-pb', 'tone-fl', 'tone-finish', 'tone-warn', 'tone-pit', 'tone-stats'];
  const highlightTickerQueue = [];
  let highlightTickerActive = null;
  let highlightTickerTimer = null;
  const CAUTION_STRICTNESS_PRESETS = {
    relaxed: { targetScale: 1.12, restartScale: 0.9, safetyScale: 1.12, formationScale: 0.95, aggressionOffset: -0.07, graceMs: 1400 },
    standard: { targetScale: 1, restartScale: 0.82, safetyScale: 1.05, formationScale: 0.9, aggressionOffset: 0, graceMs: 900 },
    strict: { targetScale: 0.9, restartScale: 0.78, safetyScale: 1.02, formationScale: 0.85, aggressionOffset: 0.08, graceMs: 600 }
  };
  let cautionOrderSnapshot = null;
  const cautionPenaltyMemo = new Map();
  const cautionTargets = new Map();
  const BASE_CAUTION_TARGET = {
    YELLOW: 0.26,
    SAFETY: 0.32,
    RESTART: 0.18,
    FORMATION: 0.2
  };
  let restartHoldUntil = 0;
  let restartReleaseArmed = false;
  const jumpStartBaselines = new Map();
  const jumpStartWarnings = new Set();
  let jumpStartArmed = false;
  let audioCtx = null;
  const MAX_REPLAY_FRAMES = 60 * 60 * 6;
  const cars = [];
  const replayBuffer = [];
  let recordingReplay = false;
  let replayMeta = new Map();
  let replayCarState = new Map();
  let replayActive = false;
  let replayPlaying = false;
  let replayCursor = 0;
  let replayAccumulator = 0;
  let replayLastTimestamp = 0;
  let replayTotalDuration = 0;
  let replayRafId = 0;
  let replayAppliedIndex = -1;
  let replaySpeed = 1;
  let replaySessionInfoCache = null;
  let raceActive = false;
  let isPaused = false;
  let raceTime = 0;
  let countdownTimer = null;
  let countdownRunning = false;
  let gridIntroInterval = null;
  let gridIntroCountdown = 0;
  let broadcastIntroTimer = null;
  let broadcastIntroCallback = null;
  let podiumTimer = null;
  let racePhase = 'IDLE';
  let racePhaseEndsAt = Infinity;
  let racePhaseNext = null;
  let racePhaseMeta = {};
  let previousPhase = 'IDLE';
  let raceClockOffset = 0;
  let raceClockArmed = false;
  let formationActive = false;
  let lastFrame = 0;
  let currentMode = 'quick';
  let focusDriverId = null;
  let gpActive = false;
  let gpRaceIndex = 0;
  const GP_RACES = 5;
  const GP_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const gpTable = new Map();
  syncUiSettingControls();
  applyUiSettings();
  armTitleThemeTrigger();
  resetLiveTicker();
  updateLeaderboardHud([]);
  resetRaceControls();

  function hasGrandPrixProgress() {
    return gpActive && gpRaceIndex > 0 && gpRaceIndex < GP_RACES && gpTable.size > 0;
  }
  function updateGrandPrixMenuState() {
    const progress = hasGrandPrixProgress();
    if (resumeGrandPrixBtn) {
      resumeGrandPrixBtn.disabled = !progress;
      resumeGrandPrixBtn.textContent = progress
        ? `Grand Prix fortsetzen (Rennen ${Math.min(GP_RACES, gpRaceIndex + 1)}/${GP_RACES})`
        : 'Grand Prix fortsetzen';
    }
    if (grandPrixBtn) {
      grandPrixBtn.textContent = progress ? 'Neuen Grand Prix starten' : 'Grand Prix (5 Rennen)';
    }
    applyGrandPrixStatusCard(progress);
  }

  function applyGrandPrixStatusCard(hasProgress) {
    if (!gpStatusCard) return;
    const activeSeries = gpActive || hasProgress;
    if (!activeSeries) {
      gpStatusCard.classList.add('hidden');
      return;
    }
    gpStatusCard.classList.remove('hidden');
    gpStatusCard.classList.toggle('isDormant', !hasProgress);
    const completed = Math.min(gpRaceIndex, GP_RACES);
    const nextRaceNumber = Math.min(GP_RACES, completed + 1);
    if (gpStatusMeta) {
      if (hasProgress) {
        if (completed >= GP_RACES) {
          gpStatusMeta.textContent = `Serie abgeschlossen (${GP_RACES}/${GP_RACES})`;
        } else {
          gpStatusMeta.textContent = `Rennen ${nextRaceNumber} von ${GP_RACES}`;
        }
      } else {
        gpStatusMeta.textContent = `Bereit für Lauf ${nextRaceNumber} von ${GP_RACES}`;
      }
    }
    const rotationIndex = gpActive ? completed % gpTrackRotation.length : 0;
    const nextTrackId = gpTrackRotation[rotationIndex] || gpTrackRotation[0];
    const track = trackCatalog[nextTrackId] || null;
    if (gpStatusTrack) {
      gpStatusTrack.textContent = track?.label || nextTrackId || '–';
    }
    if (gpStatusWeather) {
      const forecast = getLikelyWeatherForTrack(nextTrackId);
      gpStatusWeather.textContent = forecast?.label || '–';
    }
    if (gpStatusStandings) {
      gpStatusStandings.innerHTML = '';
      const standings = Array.from(gpTable.values()).sort((a, b) => b.points - a.points);
      if (standings.length === 0) {
        gpStatusEmpty?.classList.remove('hidden');
      } else {
        gpStatusEmpty?.classList.add('hidden');
        standings.slice(0, 3).forEach((entry, idx) => {
          const li = document.createElement('li');
          const driverSpan = document.createElement('span');
          driverSpan.className = 'driver';
          const carNumber = Number.isFinite(entry.number) ? `#${entry.number} ` : '';
          driverSpan.textContent = `${idx + 1}. ${carNumber}${entry.driver}`;
          const teamSpan = document.createElement('span');
          teamSpan.className = 'team';
          teamSpan.textContent = entry.team || '—';
          const pointsSpan = document.createElement('span');
          pointsSpan.className = 'points';
          pointsSpan.textContent = `${entry.points} P`;
          li.append(driverSpan, teamSpan, pointsSpan);
          gpStatusStandings.appendChild(li);
        });
      }
    }
  }
  const cautionPhases = new Set(['YELLOW', 'SAFETY', 'RESTART']);
  const RESTART_HOLD_DURATION = 2.5;
  const JUMP_START_THRESHOLD = 0.06;
  const JUMP_START_SPEED_THRESHOLD = 24;
  const BUNCHING_TARGET_FACTOR = 1.35;
  const BUNCHING_MIN_TARGET = 0.14;
  const BUNCHING_MAX_TARGET = 0.52;
  const BUNCHING_AGGRESSION = 0.22;
  const RACE_PACE_PRESETS = { slow: 0.9, normal: 1, fast: 1.15 };
  function getRacePaceMultiplier() {
    const preset = RACE_PACE_PRESETS[uiSettings.racePace] ?? RACE_PACE_PRESETS.normal;
    return typeof preset === 'number' && !Number.isNaN(preset) ? preset : 1;
  }

  function getCautionTuning() {
    const preset = CAUTION_STRICTNESS_PRESETS[uiSettings.cautionStrictness] || CAUTION_STRICTNESS_PRESETS.standard;
    return preset || CAUTION_STRICTNESS_PRESETS.standard;
  }

  function getCautionTargetForPhase(phase = racePhase) {
    const tuning = getCautionTuning();
    const base = BASE_CAUTION_TARGET[phase] ?? BASE_CAUTION_TARGET.YELLOW;
    let scaled = base * (tuning.targetScale || 1);
    if (phase === 'RESTART') {
      scaled *= tuning.restartScale || 1;
    } else if (phase === 'SAFETY') {
      scaled *= tuning.safetyScale || 1;
    } else if (phase === 'FORMATION') {
      scaled *= tuning.formationScale || 1;
    }
    return clamp(scaled, BUNCHING_MIN_TARGET, BUNCHING_MAX_TARGET);
  }

  function getBunchingAggression(phase = racePhase) {
    const tuning = getCautionTuning();
    const base = Math.max(0.05, (BUNCHING_AGGRESSION + (tuning.aggressionOffset || 0)));
    if (phase === 'RESTART') {
      return base + 0.08;
    }
    if (phase === 'SAFETY') {
      return Math.max(0.05, base - 0.04);
    }
    return base;
  }

  function getCautionGracePeriod() {
    const tuning = getCautionTuning();
    return Math.max(250, tuning.graceMs || 900);
  }

  const trackCenter = { x: canvas.width / 2, y: canvas.height / 2 };
  const baseRadiusX = canvas.width * 0.35;
  const baseRadiusY = canvas.height * 0.28;

  const defaultTrackTraits = { straightBias: 1, cornerFocus: 1, surfaceGrip: 1, wearRate: 1, turbulence: 1 };
  const defaultTrackTheme = { background: '#07111f', asphalt: '#1f2937', lane: '#94a3b8', accent: '#38bdf8' };

  function buildBackdrop(config = {}) {
    return {
      skyTop: '#07111f',
      skyBottom: '#02060f',
      horizon: '#0c1829',
      haze: 'rgba(56,189,248,0.08)',
      accent: '#38bdf8',
      stars: 72,
      pulses: 3,
      gridSpacing: 26,
      ...config
    };
  }

  function hashString(input = '') {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) + 1;
  }

  function createSeededRandom(seedValue) {
    let seed = seedValue % 2147483647;
    if (seed <= 0) seed += 2147483646;
    return () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }

  function hexToRgba(hex = '#ffffff', alpha = 1) {
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) return `rgba(255,255,255,${alpha})`;
    const bigint = parseInt(normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function lightenHex(hex = '#000000', amount = 0.1) {
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) return hex;
    const num = parseInt(normalized, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    r = Math.min(255, Math.max(0, Math.round(r + 255 * amount)));
    g = Math.min(255, Math.max(0, Math.round(g + 255 * amount)));
    b = Math.min(255, Math.max(0, Math.round(b + 255 * amount)));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  const weatherCatalog = {
    clear: {
      label: 'Klar',
      description: 'Trockene Strecke, Höchsttempo möglich.',
      traits: { surfaceGrip: 1.04, wearRate: 0.94, turbulence: 0.92 }
    },
    overcast: {
      label: 'Bewölkt',
      description: 'Kühle Luft stabilisiert die Pace.',
      traits: { surfaceGrip: 1.0, wearRate: 0.98, turbulence: 0.96 },
      theme: { background: '#060d18', accent: '#7dd3fc' }
    },
    storm: {
      label: 'Sturmregen',
      description: 'Nasse Strecke mit hoher Dirty-Air und Verschleiß.',
      traits: { surfaceGrip: 0.82, wearRate: 1.28, turbulence: 1.35 },
      theme: { background: '#050910', asphalt: '#111827', lane: '#38bdf8', accent: '#0ea5e9' }
    },
    night: {
      label: 'Nachtrennen',
      description: 'Kühle Luft steigert Motorleistung und Grip.',
      traits: { surfaceGrip: 1.06, wearRate: 0.9, straightBias: 1.04, turbulence: 0.9 },
      theme: { background: '#01030a', asphalt: '#0b1120', lane: '#38bdf8', accent: '#facc15' }
    },
    ionstorm: {
      label: 'Ionensturm',
      description: 'Elektrisch geladene Winde pushen Topspeeds, aber destabilisieren die Luft massiv.',
      traits: { surfaceGrip: 0.9, wearRate: 1.18, straightBias: 1.08, turbulence: 1.42 },
      theme: { background: '#090616', asphalt: '#101726', lane: '#38bdf8', accent: '#a855f7' }
    }
  };
  const defaultWeatherBias = { clear: 0.46, overcast: 0.26, storm: 0.12, night: 0.1, ionstorm: 0.06 };

  const trackCatalog = {
    oval: {
      label: 'Orbital Oval',
      theme: { background: '#07111f', asphalt: '#1f2937', lane: '#94a3b8', accent: '#38bdf8' },
      backdrop: buildBackdrop({
        skyTop: '#071a30',
        skyBottom: '#020912',
        horizon: '#0a1f33',
        accent: '#38bdf8',
        haze: 'rgba(56,189,248,0.1)',
        stars: 88,
        pulses: 3
      }),
      traits: { straightBias: 1.05, cornerFocus: 0.82, surfaceGrip: 1.02, wearRate: 0.92, turbulence: 0.9 },
      weatherBias: { clear: 0.54, overcast: 0.26, storm: 0.1, night: 0.1 },
      lore: 'Die Orbital-Plattform über Neo-Tokyo hostet seit Jahrzehnten die Spacer-X-Auftaktrennen – makellose Oberfläche, hohe Topspeeds, gefährliche Dirty-Air-Zonen.',
      geometry(t) {
        return {
          x: trackCenter.x + baseRadiusX * Math.cos(t),
          y: trackCenter.y + baseRadiusY * Math.sin(t)
        };
      }
    },
    wavy: {
      label: 'Wavy Oval',
      theme: { background: '#081225', asphalt: '#1e293b', lane: '#cbd5f5', accent: '#8b5cf6' },
      backdrop: buildBackdrop({
        skyTop: '#0a1f3b',
        skyBottom: '#030b19',
        horizon: '#122445',
        accent: '#8b5cf6',
        haze: 'rgba(139,92,246,0.12)',
        stars: 84,
        pulses: 4
      }),
      traits: { straightBias: 1.0, cornerFocus: 1.08, surfaceGrip: 1.04, wearRate: 1.0, turbulence: 1.05 },
      weatherBias: { clear: 0.48, overcast: 0.28, storm: 0.14, night: 0.1 },
      lore: 'Eine gewellte Konstruktion, die über dem Pazifik schwebt – die Höhenunterschiede erzeugen wechselnde Downforce-Fenster und belohnen feinfühliges Fahrverhalten.',
      geometry(t) {
        const rx = baseRadiusX * (1 + 0.22 * Math.sin(3 * t));
        const ry = baseRadiusY * (1 + 0.18 * Math.cos(2 * t));
        return {
          x: trackCenter.x + rx * Math.cos(t),
          y: trackCenter.y + ry * Math.sin(t)
        };
      }
    },
    fig8: {
      label: 'Figure Eight',
      theme: { background: '#0b1320', asphalt: '#1c2635', lane: '#d1d5db', accent: '#f472b6' },
      backdrop: buildBackdrop({
        skyTop: '#101e36',
        skyBottom: '#030814',
        horizon: '#1a2640',
        accent: '#f472b6',
        haze: 'rgba(244,114,182,0.12)',
        stars: 92,
        pulses: 5
      }),
      traits: { straightBias: 0.96, cornerFocus: 1.12, surfaceGrip: 0.98, wearRate: 1.08, turbulence: 1.2 },
      weatherBias: { clear: 0.42, overcast: 0.28, storm: 0.2, night: 0.1 },
      lore: 'Die ikonische Überschneidung über dem Core-Habitat zwingt Piloten zu taktischen Überholungen – übermütige Manöver enden schnell im Verkehrschaos.',
      geometry(t) {
        return {
          x: trackCenter.x + baseRadiusX * Math.sin(t),
          y: trackCenter.y + baseRadiusY * Math.sin(2 * t)
        };
      }
    },
    canyon: {
      label: 'Canyon Switchback',
      theme: { background: '#101322', asphalt: '#252f3f', lane: '#facc15', accent: '#fb7185' },
      backdrop: buildBackdrop({
        skyTop: '#1a2338',
        skyBottom: '#070b16',
        horizon: '#201d2e',
        accent: '#fb7185',
        haze: 'rgba(251,113,133,0.12)',
        stars: 70,
        pulses: 4,
        gridSpacing: 30
      }),
      traits: { straightBias: 0.94, cornerFocus: 1.15, surfaceGrip: 0.95, wearRate: 1.18, turbulence: 1.25 },
      weatherBias: { clear: 0.38, overcast: 0.32, storm: 0.2, night: 0.1 },
      lore: 'Durch ein abgestürztes Felsmassiv geschnitten – Dust-Devils, steile Switchbacks und unruhige Luftmassen prägen den Canyon-Lauf.',
      geometry(t) {
        const rx = baseRadiusX * (0.85 + 0.18 * Math.sin(3 * t));
        const ry = baseRadiusY * (0.72 + 0.26 * Math.cos(1.5 * t));
        const offset = 0.18 * Math.sin(2 * t);
        return {
          x: trackCenter.x + rx * Math.cos(t + offset * 0.5),
          y: trackCenter.y + ry * Math.sin(t)
        };
      }
    },
    canyonSprint: {
      label: 'Canyon Sprint',
      theme: { background: '#120d16', asphalt: '#251b29', lane: '#fbbf24', accent: '#fb7185' },
      backdrop: buildBackdrop({
        skyTop: '#20142a',
        skyBottom: '#07040b',
        horizon: '#281a2f',
        accent: '#fb7185',
        haze: 'rgba(251,113,133,0.14)',
        pulses: 5,
        gridSpacing: 32
      }),
      traits: { straightBias: 1.14, cornerFocus: 1.05, surfaceGrip: 0.98, wearRate: 1.16, turbulence: 1.28 },
      weatherBias: { clear: 0.34, overcast: 0.28, storm: 0.24, night: 0.14 },
      lore: 'Ein gestreckter Achterkurs zwischen Felsnadeln – Highspeed-Sweeps wechseln mit engen Überwurfhairpins über dem Canyon.',
      geometry(t) {
        const angle = t % (Math.PI * 2);
        const sweep = Math.sin(angle);
        const cross = Math.sin(angle) * Math.cos(angle);
        const ridge = 0.24 * Math.sin(1.8 * angle);
        const x = trackCenter.x + baseRadiusX * 0.92 * sweep * (1 + 0.12 * Math.sin(2 * angle + ridge));
        const y = trackCenter.y + baseRadiusY * (0.58 + 0.34 * Math.sin(angle + ridge)) * (Math.sin(2 * angle) + 0.18 * cross);
        return { x, y };
      }
    },
    delta: {
      label: 'Delta Spiral',
      theme: { background: '#0d101f', asphalt: '#1f2435', lane: '#7dd3fc', accent: '#34d399' },
      backdrop: buildBackdrop({
        skyTop: '#0c1d2d',
        skyBottom: '#02070f',
        horizon: '#122533',
        accent: '#34d399',
        haze: 'rgba(125,211,252,0.12)',
        stars: 90,
        pulses: 4
      }),
      traits: { straightBias: 1.02, cornerFocus: 1.05, surfaceGrip: 1.06, wearRate: 1.05, turbulence: 1.12 },
      weatherBias: { clear: 0.44, overcast: 0.3, storm: 0.16, night: 0.1 },
      lore: 'Schwebende Spiralen im Mündungstrichter des Orinoco – variable Banking-Winkel fordern Balance zwischen Topspeed und Rotation.',
      geometry(t) {
        const wave = 0.25 * Math.sin(4 * t);
        const rx = baseRadiusX * (0.7 + 0.25 * Math.cos(2 * t + wave));
        const ry = baseRadiusY * (0.88 + 0.22 * Math.sin(3 * t));
        return {
          x: trackCenter.x + rx * Math.sin(t + wave * 0.3),
          y: trackCenter.y + ry * Math.cos(t)
        };
      }
    },
    city: {
      label: 'City Grand Prix',
      theme: { background: '#050a16', asphalt: '#111d2c', lane: '#f8fafc', accent: '#38bdf8' },
      backdrop: buildBackdrop({
        skyTop: '#091d32',
        skyBottom: '#02060f',
        horizon: '#0f2438',
        accent: '#38bdf8',
        haze: 'rgba(56,189,248,0.12)',
        towers: 8,
        pulses: 4
      }),
      traits: { straightBias: 1.08, cornerFocus: 1.18, surfaceGrip: 1.1, wearRate: 1.06, turbulence: 1.22 },
      weatherBias: { clear: 0.38, overcast: 0.34, storm: 0.18, night: 0.1 },
      lore: 'Neon-Schluchten, niedrige Mauern und verkantete Schikanen mitten in Neo-Atlantis – jede Gerade endet in einem 90°-Ankerpunkt.',
      geometry(t) {
        const angle = t % (Math.PI * 2);
        const rectX = baseRadiusX * 0.78 * Math.sign(Math.cos(angle));
        const rectY = baseRadiusY * 0.62 * Math.sign(Math.sin(angle));
        const blendX = baseRadiusX * 0.24 * Math.cos(angle);
        const blendY = baseRadiusY * 0.22 * Math.sin(angle);
        const chicaneX = baseRadiusX * 0.08 * Math.sin(angle * 6);
        const chicaneY = baseRadiusY * 0.05 * Math.sin(angle * 4);
        const hairpin = Math.max(0, 1 - Math.abs(Math.cos(angle))) * baseRadiusX * 0.06 * Math.sin(angle * 2);
        return {
          x: trackCenter.x + rectX + blendX + chicaneX - hairpin * Math.sign(Math.cos(angle)),
          y: trackCenter.y + rectY + blendY + chicaneY + hairpin * 0.6 * Math.sign(Math.sin(angle))
        };
      }
    },
    aurora: {
      label: 'Aurora Loop',
      theme: { background: '#0a101f', asphalt: '#1c2742', lane: '#f0abfc', accent: '#a855f7' },
      backdrop: buildBackdrop({
        skyTop: '#101f3b',
        skyBottom: '#030814',
        horizon: '#182a48',
        accent: '#a855f7',
        haze: 'rgba(168,85,247,0.14)',
        stars: 96,
        pulses: 5
      }),
      traits: { straightBias: 0.97, cornerFocus: 1.18, surfaceGrip: 1.12, wearRate: 0.98, turbulence: 1.05 },
      weatherBias: { clear: 0.38, overcast: 0.24, storm: 0.18, night: 0.2 },
      lore: 'Polare Lichtvorhänge beleuchten den Loop über Skandinavien – eiskalte Luft liefert Grip, aber schnelle Temperaturwechsel fordern das Material.',
      geometry(t) {
        const wave = 0.18 * Math.sin(3.5 * t);
        const rx = baseRadiusX * (0.78 + 0.24 * Math.sin(4 * t));
        const ry = baseRadiusY * (0.68 + 0.2 * Math.cos(3 * t + wave));
        return {
          x: trackCenter.x + rx * Math.cos(t + wave * 0.6),
          y: trackCenter.y + ry * Math.sin(t)
        };
      }
    },
    zenith: {
      label: 'Zenith Horizon',
      theme: { background: '#060b16', asphalt: '#1a2335', lane: '#bae6fd', accent: '#22d3ee' },
      backdrop: buildBackdrop({
        skyTop: '#09182c',
        skyBottom: '#01050d',
        horizon: '#13223b',
        accent: '#22d3ee',
        haze: 'rgba(34,211,238,0.12)',
        stars: 82,
        pulses: 3
      }),
      traits: { straightBias: 1.1, cornerFocus: 0.92, surfaceGrip: 0.99, wearRate: 1.02, turbulence: 0.94 },
      weatherBias: { clear: 0.46, overcast: 0.24, storm: 0.12, night: 0.18 },
      lore: 'Über den Alpen gespannt: endlose Horizont-Geraden, dünne Luft und schnelle Wetterumschwünge – ideal für Motorpower.',
      geometry(t) {
        const rx = baseRadiusX * (0.92 + 0.08 * Math.sin(2 * t));
        const ry = baseRadiusY * (0.85 + 0.12 * Math.sin(t + 0.5 * Math.sin(3 * t)));
        const offset = 0.14 * Math.sin(1.5 * t);
        return {
          x: trackCenter.x + rx * Math.cos(t),
          y: trackCenter.y + ry * Math.sin(t + offset)
        };
      }
    },
    mirage: {
      label: 'Mirage Hyperloop',
      theme: { background: '#050910', asphalt: '#1a2536', lane: '#fde68a', accent: '#fb923c' },
      backdrop: buildBackdrop({
        skyTop: '#140f24',
        skyBottom: '#06040c',
        horizon: '#261826',
        accent: '#fb923c',
        haze: 'rgba(251,146,60,0.14)',
        stars: 68,
        pulses: 4,
        gridSpacing: 32
      }),
      traits: { straightBias: 1.18, cornerFocus: 0.88, surfaceGrip: 1.08, wearRate: 0.96, turbulence: 0.86 },
      weatherBias: { clear: 0.34, overcast: 0.26, storm: 0.26, night: 0.14 },
      lore: 'Durch die Dünen des Sahara-Orbits gebohrt – die Hyperloop-Tunnels pushen Topspeed, aber Sandpartikel erschweren Sicht und Kühlung.',
      geometry(t) {
        const wave = 0.2 * Math.sin(2.5 * t);
        const rx = baseRadiusX * (0.95 + 0.18 * Math.cos(2 * t + wave));
        const ry = baseRadiusY * (0.7 + 0.28 * Math.sin(3 * t));
        return {
          x: trackCenter.x + rx * Math.cos(t + wave * 0.4),
          y: trackCenter.y + ry * Math.sin(t)
        };
      }
    },
    nebula: {
      label: 'Nebula Nexus',
      theme: { background: '#080b19', asphalt: '#1e2438', lane: '#d8b4fe', accent: '#f472b6' },
      backdrop: buildBackdrop({
        skyTop: '#130f28',
        skyBottom: '#040615',
        horizon: '#221d36',
        accent: '#f472b6',
        haze: 'rgba(244,114,182,0.16)',
        stars: 110,
        pulses: 6
      }),
      traits: { straightBias: 0.94, cornerFocus: 1.22, surfaceGrip: 1.07, wearRate: 1.15, turbulence: 1.2 },
      weatherBias: { clear: 0.4, overcast: 0.26, storm: 0.18, night: 0.16 },
      lore: 'Ein Labyrinth aus Glasröhren im Asteroidenfeld – hohe Seitwärtskräfte treffen auf flackernde Plasma-Lichter.',
      geometry(t) {
        const wave = 0.22 * Math.sin(4 * t);
        const rx = baseRadiusX * (0.72 + 0.26 * Math.sin(3 * t + wave));
        const ry = baseRadiusY * (0.75 + 0.24 * Math.cos(2.5 * t));
        return {
          x: trackCenter.x + rx * Math.sin(t + wave * 0.6),
          y: trackCenter.y + ry * Math.cos(t)
        };
      }
    },
    solstice: {
      label: 'Solstice Ridge',
      theme: { background: '#060b19', asphalt: '#1c2536', lane: '#fbbf24', accent: '#f97316' },
      backdrop: buildBackdrop({
        skyTop: '#11182d',
        skyBottom: '#05060f',
        horizon: '#241e30',
        accent: '#f97316',
        haze: 'rgba(249,115,22,0.12)',
        stars: 76,
        pulses: 4
      }),
      traits: { straightBias: 1.12, cornerFocus: 0.94, surfaceGrip: 1.04, wearRate: 1.1, turbulence: 0.9 },
      weatherBias: { clear: 0.36, overcast: 0.34, storm: 0.18, night: 0.12 },
      lore: 'Über Sonnenkollektoren rund um Mercurys Tag-Nacht-Grenze gebaut – extreme Hitze wechselt mit Schattenkälte.',
      geometry(t) {
        const crest = 0.2 * Math.sin(1.5 * t);
        const rx = baseRadiusX * (0.88 + 0.18 * Math.cos(2.5 * t + crest));
        const ry = baseRadiusY * (0.72 + 0.24 * Math.sin(3 * t));
        const offset = 0.18 * Math.sin(t + crest);
        return {
          x: trackCenter.x + rx * Math.cos(t + offset * 0.4),
          y: trackCenter.y + ry * Math.sin(t + offset * 0.1)
        };
      }
    },
    helix: {
      label: 'Helix Spires',
      theme: { background: '#040712', asphalt: '#161f31', lane: '#a5b4fc', accent: '#c084fc' },
      backdrop: buildBackdrop({
        skyTop: '#0b1326',
        skyBottom: '#02040a',
        horizon: '#1a2136',
        accent: '#c084fc',
        haze: 'rgba(192,132,252,0.16)',
        stars: 104,
        pulses: 6
      }),
      traits: { straightBias: 0.98, cornerFocus: 1.24, surfaceGrip: 1.08, wearRate: 1.12, turbulence: 1.18 },
      weatherBias: { clear: 0.32, overcast: 0.28, storm: 0.22, night: 0.18 },
      lore: 'Ein Geflecht aus Spindeln über Titan – enge Schikanen im Nebel, ständige Kurswechsel und magnetische Aufwinde.',
      geometry(t) {
        const spiral = 0.26 * Math.sin(3.5 * t);
        const rx = baseRadiusX * (0.68 + 0.24 * Math.sin(4 * t + spiral));
        const ry = baseRadiusY * (0.7 + 0.28 * Math.cos(3.5 * t));
        return {
          x: trackCenter.x + rx * Math.sin(t + spiral * 0.5),
          y: trackCenter.y + ry * Math.cos(t + 0.35 * Math.sin(2 * t))
        };
      }
    },
    atlas: {
      label: 'Atlas Skyway',
      theme: { background: '#040914', asphalt: '#172032', lane: '#60a5fa', accent: '#f97316' },
      backdrop: buildBackdrop({
        skyTop: '#0b1a2c',
        skyBottom: '#01050b',
        horizon: '#13233b',
        accent: '#60a5fa',
        haze: 'rgba(96,165,250,0.14)',
        stars: 88,
        pulses: 4
      }),
      traits: { straightBias: 1.12, cornerFocus: 1.02, surfaceGrip: 1.05, wearRate: 1.1, turbulence: 1.18 },
      weatherBias: { clear: 0.4, overcast: 0.28, storm: 0.18, night: 0.14 },
      lore: 'Eine transkontinentale Himmelsstraße über Mega-City Atlas – Windschatten in den Canyons, Sturmfronten über den Wolken.',
      geometry(t) {
        const wave = 0.24 * Math.sin(2.8 * t);
        const rx = baseRadiusX * (0.82 + 0.22 * Math.cos(2.6 * t + wave));
        const ry = baseRadiusY * (0.78 + 0.2 * Math.sin(3.4 * t));
        return {
          x: trackCenter.x + rx * Math.cos(t + wave * 0.3),
          y: trackCenter.y + ry * Math.sin(t)
        };
      }
    },
    fracture: {
      label: 'Fracture Belt',
      theme: { background: '#030710', asphalt: '#1a1f2f', lane: '#fda4af', accent: '#fb7185' },
      backdrop: buildBackdrop({
        skyTop: '#130f24',
        skyBottom: '#02040c',
        horizon: '#201828',
        accent: '#fb7185',
        haze: 'rgba(253,164,175,0.16)',
        stars: 112,
        pulses: 6,
        gridSpacing: 22
      }),
      traits: { straightBias: 0.9, cornerFocus: 1.25, surfaceGrip: 0.96, wearRate: 1.22, turbulence: 1.3 },
      weatherBias: { clear: 0.28, overcast: 0.3, storm: 0.28, night: 0.14 },
      lore: 'Zwischen aufgebrochenen Asteroiden-Trümmern verlaufen kurze Geraden und unzählige Richtungswechsel – Technik-Parcours pur.',
      geometry(t) {
        const wave = 0.32 * Math.sin(5 * t);
        const rx = baseRadiusX * (0.66 + 0.28 * Math.sin(3.6 * t + wave));
        const ry = baseRadiusY * (0.7 + 0.26 * Math.cos(4.2 * t));
        return {
          x: trackCenter.x + rx * Math.cos(t + wave * 0.4),
          y: trackCenter.y + ry * Math.sin(t)
        };
      }
    },
    lumen: {
      label: 'Lumen Cascades',
      theme: { background: '#040a12', asphalt: '#121c2b', lane: '#bbf7d0', accent: '#38bdf8' },
      backdrop: buildBackdrop({
        skyTop: '#06182a',
        skyBottom: '#01060c',
        horizon: '#0d2232',
        accent: '#38bdf8',
        haze: 'rgba(59,229,246,0.14)',
        stars: 94,
        pulses: 5
      }),
      traits: { straightBias: 1.0, cornerFocus: 1.14, surfaceGrip: 1.16, wearRate: 0.94, turbulence: 0.98 },
      weatherBias: { clear: 0.36, overcast: 0.24, storm: 0.14, night: 0.26 },
      lore: 'Kaskaden aus gefrorenem Licht über Europa – spiegelnde Oberflächen, wechselhafte Beleuchtung, ideal für Präzisions-Handling.',
      geometry(t) {
        const wave = 0.2 * Math.sin(3.8 * t);
        const rx = baseRadiusX * (0.76 + 0.22 * Math.sin(4.5 * t));
        const ry = baseRadiusY * (0.74 + 0.2 * Math.cos(3.7 * t + wave));
        return {
          x: trackCenter.x + rx * Math.cos(t + wave * 0.5),
          y: trackCenter.y + ry * Math.sin(t)
        };
      }
    },
    glacier: {
      label: 'Glacier Traverse',
      theme: { background: '#050a15', asphalt: '#142032', lane: '#bfdbfe', accent: '#60a5fa' },
      backdrop: buildBackdrop({
        skyTop: '#0d1d33',
        skyBottom: '#04070f',
        horizon: '#13243a',
        accent: '#60a5fa',
        haze: 'rgba(96,165,250,0.16)',
        stars: 88,
        pulses: 4,
        gridSpacing: 30
      }),
      traits: { straightBias: 0.92, cornerFocus: 1.2, surfaceGrip: 1.12, wearRate: 1.14, turbulence: 1.18 },
      weatherBias: { clear: 0.24, overcast: 0.3, storm: 0.16, night: 0.3 },
      lore: 'Eine Hochalpin-Traverse über eingefrorenen Antennenfeldern – eisiger Grip, kantige Chicanes und dünne Luft.',
      geometry(t) {
        const crest = 0.22 * Math.sin(2.1 * t);
        const rx = baseRadiusX * (0.68 + 0.24 * Math.cos(3.2 * t + crest));
        const ry = baseRadiusY * (0.76 + 0.26 * Math.sin(2.6 * t));
        return {
          x: trackCenter.x + rx * Math.sin(t + crest * 0.35),
          y: trackCenter.y + ry * Math.cos(t)
        };
      }
    },
    eclipse: {
      label: 'Eclipse Citadel',
      theme: { background: '#050915', asphalt: '#151f2d', lane: '#fca5a5', accent: '#f97316' },
      backdrop: buildBackdrop({
        skyTop: '#120f24',
        skyBottom: '#05060e',
        horizon: '#1f1e2c',
        accent: '#f97316',
        haze: 'rgba(249,115,22,0.14)',
        stars: 108,
        pulses: 5,
        gridSpacing: 28
      }),
      traits: { straightBias: 1.04, cornerFocus: 1.12, surfaceGrip: 1.08, wearRate: 1.02, turbulence: 1.14 },
      weatherBias: { clear: 0.32, overcast: 0.24, storm: 0.18, night: 0.16, ionstorm: 0.1 },
      lore: 'Zwischen gläsernen Festungstürmen wechseln Schatten und Neon – nur wer Rhythmusgefühl beweist, bleibt vorne.',
      geometry(t) {
        const crest = 0.22 * Math.sin(4.1 * t);
        const rx = baseRadiusX * (0.74 + 0.26 * Math.cos(3.2 * t + crest));
        const ry = baseRadiusY * (0.7 + 0.23 * Math.sin(2.8 * t));
        return {
          x: trackCenter.x + rx * Math.cos(t + crest * 0.35),
          y: trackCenter.y + ry * Math.sin(t)
        };
      }
    },
    maelstrom: {
      label: 'Maelstrom Gauntlet',
      theme: { background: '#080612', asphalt: '#1a1226', lane: '#fde047', accent: '#f472b6' },
      backdrop: buildBackdrop({
        skyTop: '#160f2c',
        skyBottom: '#05030a',
        horizon: '#221634',
        accent: '#f472b6',
        haze: 'rgba(244,114,182,0.18)',
        stars: 118,
        pulses: 6,
        gridSpacing: 24
      }),
      traits: { straightBias: 1.08, cornerFocus: 0.98, surfaceGrip: 0.94, wearRate: 1.2, turbulence: 1.3 },
      weatherBias: { clear: 0.32, overcast: 0.22, storm: 0.26, night: 0.2 },
      lore: 'Ein Wirbelkanal über den Magnetmeeren von Carina – Turbo-Bursts wechseln mit Scherwinden und engen Underpass-Kurven.',
      geometry(t) {
        const surge = 0.26 * Math.sin(2.7 * t);
        const rx = baseRadiusX * (0.82 + 0.18 * Math.sin(3.5 * t + surge));
        const ry = baseRadiusY * (0.7 + 0.24 * Math.cos(2.9 * t));
        const offset = 0.3 * Math.sin(t + surge);
        return {
          x: trackCenter.x + rx * Math.cos(t + offset * 0.35),
          y: trackCenter.y + ry * Math.sin(t + surge * 0.25)
        };
      }
    },
    rift: {
      label: 'Rift Meridian',
      theme: { background: '#040c18', asphalt: '#142032', lane: '#bef264', accent: '#4ade80' },
      backdrop: buildBackdrop({
        skyTop: '#0f1c2e',
        skyBottom: '#03070e',
        horizon: '#142235',
        accent: '#4ade80',
        haze: 'rgba(74,222,128,0.12)',
        stars: 102,
        pulses: 4,
        gridSpacing: 26
      }),
      traits: { straightBias: 1.16, cornerFocus: 0.96, surfaceGrip: 1.02, wearRate: 1.08, turbulence: 1.12 },
      weatherBias: { clear: 0.36, overcast: 0.24, storm: 0.14, night: 0.14, ionstorm: 0.12 },
      lore: 'Ein magnetisierter Rift-Gürtel entlang des Äquators sorgt für beschleunigende Strömungen und abrupte Seitenböen.',
      geometry(t) {
        const surge = 0.27 * Math.sin(2.3 * t);
        const rx = baseRadiusX * (0.86 + 0.18 * Math.sin(2.9 * t + surge));
        const ry = baseRadiusY * (0.72 + 0.22 * Math.cos(3.3 * t));
        return {
          x: trackCenter.x + rx * Math.cos(t),
          y: trackCenter.y + ry * Math.sin(t + surge * 0.4)
        };
      }
    }
  };

  let raceSettings = loadRaceSettings();
  let currentTrackType = raceSettings.track || 'oval';
  let totalLaps = Number.isFinite(raceSettings.laps) ? raceSettings.laps : 15;
  let aiLevel = raceSettings.ai || 'normal';
  let currentWeather = raceSettings.weather || 'clear';
  let startProcedureMode = raceSettings.startProc || 'standing';
  let activeTrackTraits = getTrackTraits(currentTrackType);
  let currentVisualTheme = null;
  let lastTelemetryOrder = [];
  const raceControlEvents = [];
  const racePitLog = [];
  const replayBookmarks = [];
  let cautionLapHistory = [];
  let currentCautionEntry = null;
  let timingModalOpen = false;
  const phaseStats = { yellow: 0, safety: 0, restart: 0, formation: 0 };
  const phaseTimeline = [];
  const flowAudit = [];
  let settingsNoticeTimer = null;
  let miniSamples = [];

  syncRaceSettingControls();

  trackTypeSelect?.addEventListener('change', () => {
    currentTrackType = trackTypeSelect.value;
    raceSettings.track = currentTrackType;
    persistRaceSettings();
    updateActiveTrackTraits();
    rebuildMini();
    refreshOddsTable();
  });
  lapsSetting?.addEventListener('change', () => {
    totalLaps = parseInt(lapsSetting.value, 10);
    raceSettings.laps = totalLaps;
    persistRaceSettings();
    updateEventBriefing();
  });
  aiDifficulty?.addEventListener('change', () => {
    aiLevel = aiDifficulty.value;
    raceSettings.ai = aiLevel;
    persistRaceSettings();
    updateEventBriefing();
  });
  startProc?.addEventListener('change', () => {
    raceSettings.startProc = startProc.value;
    startProcedureMode = startProc.value;
    persistRaceSettings();
    updateEventBriefing();
  });
  weatherSetting?.addEventListener('change', () => {
    currentWeather = weatherSetting.value;
    raceSettings.weather = currentWeather;
    persistRaceSettings();
    updateActiveTrackTraits();
    refreshOddsTable();
  });
  zoomSetting?.addEventListener('change', () => {
    uiSettings.zoom = zoomSetting.value;
    applyUiSettings();
    persistUiSettings();
  });
  toggleMiniMap?.addEventListener('change', () => {
    uiSettings.showMiniMap = !!toggleMiniMap.checked;
    applyUiSettings();
    persistUiSettings();
  });
  toggleRaceControl?.addEventListener('change', () => {
    uiSettings.showRaceControl = !!toggleRaceControl.checked;
    applyUiSettings();
    persistUiSettings();
  });
  toggleFocusPanel?.addEventListener('change', () => {
    uiSettings.showFocusPanel = !!toggleFocusPanel.checked;
    applyUiSettings();
    persistUiSettings();
    updateFocusPanel(lastTelemetryOrder);
  });
  toggleTicker?.addEventListener('change', () => {
    uiSettings.showTicker = !!toggleTicker.checked;
    applyUiSettings();
    persistUiSettings();
  });
  toggleBroadcastIntro?.addEventListener('change', () => {
    uiSettings.skipBroadcastIntro = !!toggleBroadcastIntro.checked;
    persistUiSettings();
    showSettingsNotice(uiSettings.skipBroadcastIntro ? 'Broadcast-Intro wird übersprungen.' : 'Broadcast-Intro aktiv.', 'info');
  });
  toggleAudio?.addEventListener('change', () => {
    uiSettings.enableAudio = !!toggleAudio.checked;
    persistUiSettings();
    if (uiSettings.enableAudio) {
      warmupAudio();
      armTitleThemeTrigger();
      showSettingsNotice('Audio-Benachrichtigungen aktiv.', 'info');
    } else if (audioCtx && typeof audioCtx.suspend === 'function' && audioCtx.state !== 'closed') {
      stopTitleTheme(true);
      audioCtx.suspend().catch(() => {});
      showSettingsNotice('Audio-Benachrichtigungen deaktiviert.', 'info');
    }
  });
  cameraSetting?.addEventListener('change', () => {
    uiSettings.cameraMode = cameraSetting.value;
    if (uiSettings.cameraMode !== 'manual') {
      focusDriverId = null;
    }
    persistUiSettings();
    applyCameraLogic(lastTelemetryOrder);
    updateLeaderGap(lastTelemetryOrder);
    updateFocusPanel(lastTelemetryOrder);
    updateCameraHud(lastTelemetryOrder);
  });
  racePaceSetting?.addEventListener('change', () => {
    const allowed = ['slow', 'normal', 'fast'];
    const value = allowed.includes(racePaceSetting.value) ? racePaceSetting.value : 'normal';
    uiSettings.racePace = value;
    persistUiSettings();
    showSettingsNotice(`Renn-Tempo: ${racePaceSetting.options[racePaceSetting.selectedIndex]?.textContent || ''}`, 'info');
  });
  cautionSetting?.addEventListener('change', () => {
    const allowed = ['relaxed', 'standard', 'strict'];
    const value = allowed.includes(cautionSetting.value) ? cautionSetting.value : 'standard';
    uiSettings.cautionStrictness = value;
    persistUiSettings();
    clearCautionSnapshot();
    showSettingsNotice('Caution-Regelwerk aktualisiert.', 'info');
  });

  const backdropCache = new Map();

  function trackPos(angle) {
    const track = trackCatalog[currentTrackType] || trackCatalog.oval;
    const norm = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const base = track.geometry(norm);
    const ahead = track.geometry((norm + 0.01) % (Math.PI * 2));
    const angleRad = Math.atan2(ahead.y - base.y, ahead.x - base.x);
    return { x: base.x, y: base.y, angle: angleRad };
  }

  function rebuildMini() {
    miniSamples = [];
    const track = trackCatalog[currentTrackType] || trackCatalog.oval;
    for (let i = 0; i < 256; i++) {
      const t = (i / 256) * Math.PI * 2;
      const p = track.geometry(t);
      miniSamples.push({ x: p.x, y: p.y });
    }
  }

  function getTrackTraits(type = currentTrackType) {
    const track = trackCatalog[type];
    if (!track) return { ...defaultTrackTraits };
    return { ...defaultTrackTraits, ...(track.traits || {}) };
  }

  function getWeatherProfile(id = currentWeather) {
    return weatherCatalog[id] || weatherCatalog.clear;
  }

  function getLikelyWeatherForTrack(trackId) {
    const track = trackCatalog[trackId];
    const weights = track?.weatherBias || defaultWeatherBias;
    if (!weights) {
      return weatherCatalog.clear;
    }
    let pick = null;
    let bestWeight = -Infinity;
    Object.entries(weights).forEach(([key, weight]) => {
      if (!weatherCatalog[key]) return;
      const numeric = Number(weight);
      if (!Number.isFinite(numeric)) return;
      if (numeric > bestWeight) {
        bestWeight = numeric;
        pick = key;
      }
    });
    if (!pick) {
      return weatherCatalog.clear;
    }
    return weatherCatalog[pick] || weatherCatalog.clear;
  }

  function computeVisualTheme(track, weatherProfile) {
    const base = { ...defaultTrackTheme, ...(track?.theme || {}) };
    const override = weatherProfile?.theme || {};
    return {
      background: override.background || base.background,
      asphalt: override.asphalt || base.asphalt,
      lane: override.lane || base.lane,
      accent: override.accent || base.accent
    };
  }

  function updateActiveTrackTraits() {
    const baseTraits = getTrackTraits(currentTrackType);
    const weatherProfile = getWeatherProfile();
    const merged = { ...baseTraits };
    Object.entries(weatherProfile.traits || {}).forEach(([key, modifier]) => {
      if (typeof modifier === 'number') {
        const baseValue = merged[key] ?? 1;
        merged[key] = baseValue * modifier;
      }
    });
    activeTrackTraits = merged;
    const track = trackCatalog[currentTrackType] || trackCatalog.oval;
    currentVisualTheme = computeVisualTheme(track, weatherProfile);
    if (canvasWrap) {
      canvasWrap.dataset.weather = currentWeather;
    }
    if (eventBriefing) {
      eventBriefing.dataset.weather = currentWeather;
    }
    if (gridIntroOverlay) {
      gridIntroOverlay.dataset.weather = currentWeather;
    }
    updateEventBriefing();
  }

  function describeValue(value, highLabel, neutralLabel, lowLabel) {
    if (value >= 1.06) return highLabel;
    if (value <= 0.94) return lowLabel;
    return neutralLabel;
  }

  function getStartProcedureLabel(mode) {
    switch (mode) {
      case 'rolling':
        return 'Start: Rolling';
      case 'staggered':
        return 'Start: Versetzt';
      default:
        return 'Start: Standing';
    }
  }

  function getModeLabel(mode) {
    switch (mode) {
      case 'manager':
        return 'Team Karriere';
      case 'betting':
        return 'Betting';
      case 'gp':
        return 'Grand Prix';
      default:
        return 'Schnelles Rennen';
    }
  }

  function updateEventBriefing() {
    if (!eventTrackLabel || !eventWeatherLabel || !eventTraitSummary) return;
    const track = trackCatalog[currentTrackType] || trackCatalog.oval;
    const weatherProfile = getWeatherProfile();
    eventTrackLabel.textContent = track.label || currentTrackType;
    eventWeatherLabel.textContent = weatherProfile.label;
    if (eventWeatherDesc) {
      eventWeatherDesc.textContent = weatherProfile.description || '';
    }
    if (eventBriefing) {
      eventBriefing.dataset.weather = currentWeather;
    }
    const tags = [];
    const straight = activeTrackTraits.straightBias ?? 1;
    const corner = activeTrackTraits.cornerFocus ?? 1;
    if (straight >= corner + 0.08 || straight >= 1.08) tags.push('Geradenpower');
    else if (corner >= straight + 0.08 || corner >= 1.08) tags.push('Kurvenfluss');
    else tags.push('Balance');
    tags.push(describeValue(activeTrackTraits.surfaceGrip ?? 1, 'Grip Hoch', 'Grip Mittel', 'Grip Niedrig'));
    tags.push(describeValue(activeTrackTraits.wearRate ?? 1, 'Verschleiß Hoch', 'Verschleiß Moderat', 'Verschleiß Gering'));
    tags.push(describeValue(activeTrackTraits.turbulence ?? 1, 'Dirty Air', 'Luft Stabil', 'Freie Luft'));
    tags.push(`${totalLaps} Runden`);
    const startMode = startProc?.value || raceSettings.startProc || 'standing';
    tags.push(getStartProcedureLabel(startMode));
    tags.push(aiLabels[aiLevel] || `KI: ${aiLevel}`);
    eventTraitSummary.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('');
  }

  function updateGridIntroCountdownDisplay() {
    if (gridIntroTimer) {
      gridIntroTimer.textContent = Math.max(0, Math.ceil(gridIntroCountdown)).toString();
    }
  }

  function computeProjectedPace(car) {
    if (!car) return 0;
    const base = (car.baseSpeed || 12) * 10;
    const consist = (car.consist || 0.6) * 24;
    const intel = (car.intel || 0.6) * 18;
    const risk = (1 - (car.risk || 0.3)) * 14;
    const moraleSource = car.contract?.morale ?? car.morale ?? 0.5;
    const morale = (moraleSource - 0.5) * 20;
    const profileStraight = car.profile?.straight ?? 1;
    const profileCorner = car.profile?.corner ?? 1;
    const profileScore = ((profileStraight + profileCorner) / 2) * 16;
    const chassis = car.chassis || defaultChassisSpec;
    const chassisPerformance = ((chassis.engine || 1) + (chassis.aero || 1) + (chassis.boost || 1)) / 3 * 14;
    const chassisReliability = ((chassis.systems || 1) + (chassis.stability || 1)) / 2 * 12;
    const grip = (activeTrackTraits.surfaceGrip ?? 1) * 6;
    const form = (car.form || 0) * 40;
    return base + consist + intel + risk + morale + profileScore + grip + form + chassisPerformance + chassisReliability;
  }

  function renderGridIntro(cars) {
    if (!gridIntroOverlay || !gridIntroList || !Array.isArray(cars) || cars.length === 0) {
      return false;
    }
    const track = trackCatalog[currentTrackType] || trackCatalog.oval;
    const weatherProfile = getWeatherProfile();
    const startMode = startProc?.value || raceSettings.startProc || 'standing';
    const metaParts = [
      track.label || currentTrackType,
      `${totalLaps} Runden`,
      weatherProfile.label,
      getStartProcedureLabel(startMode),
      aiLabels[aiLevel] || `KI: ${aiLevel}`
    ];
    if (gridIntroMeta) {
      gridIntroMeta.textContent = metaParts.join(' • ');
    }
    gridIntroOverlay.dataset.weather = currentWeather || 'clear';
    const sorted = cars.slice().sort((a, b) => (b.projectedPace || 0) - (a.projectedPace || 0));
    const topEntries = sorted.slice(0, Math.min(6, sorted.length));
    const listItems = topEntries.map((car, idx) => {
      const projected = car.projectedPace ?? computeProjectedPace(car);
      const paceIndex = Math.round(projected / 10);
      const profileLabel = car.profile?.label || 'Balanced';
      const morale = clamp(car.contract?.morale ?? car.morale ?? 0.5, 0, 1);
      const moralePct = Math.round(morale * 100);
      const formText = car.form ? `${car.form >= 0 ? '+' : ''}${car.form.toFixed(2)}` : '+0.00';
      const info = car.driverInfo || {};
      const paceStat = Math.round((info.pace || 0) * 100);
      const consistStat = Math.round((info.consist || 0) * 100);
      const riskStat = Math.round((info.risk || 0) * 100);
      const intelStat = Math.round((info.intel || 0) * 100);
      const chassisLabel = car.chassisLabel || 'Spec';
      const chassisSummary = car.chassis?.summary || 'Ausgewogen';
      const liClass = idx < 3 ? ' class="highlight"' : '';
      return `<li${liClass}><strong>#${car.racingNumber} ${car.driver}</strong>` +
        `<span>${car.team} • ${profileLabel}</span>` +
        `<span>Chassis ${chassisLabel} • ${chassisSummary}</span>` +
        `<span>PaceIdx ${paceIndex} • Form ${formText} • Morale ${moralePct}%</span>` +
        `<span>Driver Stats P${paceStat} | I${intelStat} | C${consistStat} | R${riskStat}</span></li>`;
    });
    gridIntroList.innerHTML = listItems.join('');
    return true;
  }

  function hideGridIntro() {
    if (!gridIntroOverlay) return;
    if (gridIntroInterval) {
      clearInterval(gridIntroInterval);
      gridIntroInterval = null;
    }
    gridIntroCountdown = 0;
    updateGridIntroCountdownDisplay();
    gridIntroOverlay.classList.add('hidden');
    gridIntroOverlay.setAttribute('aria-hidden', 'true');
  }

  function cancelBroadcastIntro() {
    if (broadcastIntroTimer) {
      clearTimeout(broadcastIntroTimer);
      broadcastIntroTimer = null;
    }
    broadcastIntroCallback = null;
    if (!broadcastIntro) return;
    broadcastIntro.classList.add('hidden');
    broadcastIntro.setAttribute('aria-hidden', 'true');
  }

  function completeBroadcastIntro(immediate = false) {
    if (broadcastIntroTimer) {
      clearTimeout(broadcastIntroTimer);
      broadcastIntroTimer = null;
    }
    const callback = broadcastIntroCallback;
    broadcastIntroCallback = null;
    if (broadcastIntro) {
      broadcastIntro.classList.add('hidden');
      broadcastIntro.setAttribute('aria-hidden', 'true');
    }
    if (typeof callback === 'function') {
      if (immediate) {
        requestAnimationFrame(() => callback());
      } else {
        callback();
      }
    }
  }

  function renderBroadcastIntroCard(cars, track, weatherProfile) {
    if (!broadcastIntro || !broadcastIntroHeadline || !broadcastIntroSummary || !broadcastIntroLeaders) {
      return false;
    }
    const trackLabel = track?.label || currentTrackType;
    const weatherLabel = weatherProfile?.label || 'Wetter';
    broadcastIntroHeadline.textContent = `${trackLabel} • ${weatherLabel}`;
    const summaryParts = [];
    if (track?.lore) summaryParts.push(track.lore);
    if (weatherProfile?.description) summaryParts.push(weatherProfile.description);
    const startMode = startProc?.value || raceSettings.startProc || 'standing';
    summaryParts.push(`${totalLaps} Runden · ${getStartProcedureLabel(startMode)}`);
    broadcastIntroSummary.textContent = summaryParts.join(' ');
    broadcastIntroLeaders.innerHTML = '';
    const contenders = cars.slice().sort((a, b) => (b.projectedPace || 0) - (a.projectedPace || 0));
    contenders.slice(0, 5).forEach((car, index) => {
      const li = document.createElement('li');
      const rank = document.createElement('span');
      rank.className = 'rank';
      rank.textContent = `P${index + 1}`;
      const driver = document.createElement('span');
      driver.className = 'driver';
      driver.textContent = `#${car.racingNumber} ${car.driver}`;
      const team = document.createElement('span');
      team.className = 'team';
      team.style.color = teamColors[car.team] || '#38bdf8';
      team.textContent = car.team;
      const pace = document.createElement('span');
      pace.className = 'pace';
      const paceValue = car.projectedPace ? Math.round(car.projectedPace) : null;
      pace.textContent = paceValue ? `PI ${paceValue}` : '--';
      li.append(rank, driver, team, pace);
      broadcastIntroLeaders.appendChild(li);
    });
    if (!broadcastIntroLeaders.childElementCount) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'Feld wird vorbereitet…';
      broadcastIntroLeaders.appendChild(li);
    }
    return true;
  }

  function showBroadcastIntro(cars, track, weatherProfile, onComplete) {
    cancelBroadcastIntro();
    if (uiSettings?.skipBroadcastIntro) {
      logRaceControl('Broadcast-Intro übersprungen (Einstellung).', 'info');
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    if (!Array.isArray(cars) || cars.length === 0) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    if (!renderBroadcastIntroCard(cars, track, weatherProfile)) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }
    broadcastIntroCallback = typeof onComplete === 'function' ? onComplete : null;
    broadcastIntro.classList.remove('hidden');
    broadcastIntro.setAttribute('aria-hidden', 'false');
    broadcastIntroTimer = window.setTimeout(() => {
      completeBroadcastIntro();
    }, 4500);
  }

  function showGridIntro(cars) {
    if (!renderGridIntro(cars)) {
      beginRaceCountdown();
      return;
    }
    if (gridIntroInterval) {
      clearInterval(gridIntroInterval);
      gridIntroInterval = null;
    }
    gridIntroOverlay.classList.remove('hidden');
    gridIntroOverlay.setAttribute('aria-hidden', 'false');
    gridIntroCountdown = 4;
    updateGridIntroCountdownDisplay();
    auditRaceFlow('gridIntro', { field: cars?.length || 0 });
    gridIntroInterval = setInterval(() => {
      gridIntroCountdown -= 1;
      if (gridIntroCountdown <= 0) {
        beginRaceCountdown();
      } else {
        updateGridIntroCountdownDisplay();
      }
    }, 1000);
  }

  function beginFormationLap() {
    if (formationActive) return;
    formationActive = true;
    countdownRunning = false;
    resetStartLights();
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    setRacePhase('FORMATION', 12, { name: 'COUNTDOWN' }, { procedure: 'rolling' });
    top3Banner.textContent = 'Formation Lap';
    top3Banner.classList.remove('hidden');
    setMarshalState('formation', 'Formation', { autoHide: 3200 });
    logRaceControl('Formation Lap aktiviert (Rolling Start)', 'info');
    pushTicker('Formation Lap – Rolling Start', 'info');
    raceActive = true;
    isPaused = false;
    setPauseButtonState(true, 'Pause');
    requestAnimationFrame(time => {
      lastFrame = time;
      requestAnimationFrame(gameLoop);
    });
  }

  function beginRaceCountdown(force = false) {
    if (!force && startProcedureMode === 'rolling' && !formationActive) {
      beginFormationLap();
      return;
    }
    if (countdownRunning) return;
    if (gridIntroInterval) {
      clearInterval(gridIntroInterval);
      gridIntroInterval = null;
    }
    hideGridIntro();
    gridIntroCountdown = 0;
    updateGridIntroCountdownDisplay();
    if (!raceScreen?.classList.contains('active')) {
      return;
    }
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    countdownRunning = true;
    resetStartLights();
    setMarshalState('ready', 'Bereit');
    let countdown;
    if (startProcedureMode === 'standing') {
      countdown = [
        { type: 'light', count: 1, total: 5 },
        { type: 'light', count: 2, total: 5 },
        { type: 'light', count: 3, total: 5 },
        { type: 'light', count: 4, total: 5 },
        { type: 'light', count: 5, total: 5 },
        { type: 'go' }
      ];
    } else if (startProcedureMode === 'staggered') {
      countdown = [
        { type: 'number', value: 4, total: 4 },
        { type: 'number', value: 3, total: 4 },
        { type: 'number', value: 2, total: 4 },
        { type: 'number', value: 1, total: 4 },
        { type: 'go' }
      ];
    } else {
      countdown = [
        { type: 'number', value: 3, total: 3 },
        { type: 'number', value: 2, total: 3 },
        { type: 'number', value: 1, total: 3 },
        { type: 'go' }
      ];
    }
    let idx = 0;
    auditRaceFlow('countdown', { steps: countdown.length });
    const runCountdown = () => {
      if (!countdownRunning) {
        return;
      }
      scanJumpStarts();
      if (!raceScreen?.classList.contains('active')) {
        countdownRunning = false;
        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
        resetStartLights();
        resetMarshalOverlay();
        return;
      }
      if (idx < countdown.length) {
        const step = countdown[idx];
        if (step.type === 'light') {
          const total = step.total || 5;
          setStartLightState(step.count, total);
          racePhaseMeta.countdownText = `Startlichter ${step.count}/${total}`;
          top3Banner.textContent = racePhaseMeta.countdownText;
          playRaceCue('light');
          setMarshalState('ready', 'Bereit');
        } else if (step.type === 'number') {
          const total = step.total || 3;
          const lit = Math.max(1, total - step.value + 1);
          setStartLightState(lit, total);
          racePhaseMeta.countdownText = `Start in ${step.value}`;
          top3Banner.textContent = racePhaseMeta.countdownText;
          playRaceCue('light');
          setMarshalState('countdown', `Start in ${step.value}`);
        } else if (step.type === 'go') {
          racePhaseMeta.countdownText = 'GO!';
          top3Banner.textContent = 'GO!';
          flashStartLights();
          playRaceCue('go');
          setMarshalState('wave', 'GO!', { autoHide: 2200 });
        }
        top3Banner.classList.remove('hidden');
        updateSessionInfo();
        idx += 1;
      } else {
        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
        countdownRunning = false;
        top3Banner.textContent = '';
        top3Banner.classList.remove('hidden');
        racePhaseMeta = {};
        setRacePhase('GREEN');
        raceActive = true;
        isPaused = false;
        setPauseButtonState(true, 'Pause');
        requestAnimationFrame(time => {
          lastFrame = time;
          requestAnimationFrame(gameLoop);
        });
      }
    };
    runCountdown();
    countdownTimer = setInterval(runCountdown, 1000);
  }

  function rollEventWeather(trackId) {
    const track = trackCatalog[trackId];
    const weights = track?.weatherBias || defaultWeatherBias;
    const entries = Object.entries(weights).filter(([key, weight]) => weatherCatalog[key] && weight > 0);
    if (!entries.length) return 'clear';
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let pick = Math.random() * total;
    for (const [key, weight] of entries) {
      pick -= weight;
      if (pick <= 0) return key;
    }
    return entries[0][0];
  }

  function loadUiSettings() {
    const defaults = {
      zoom: 'on',
      showMiniMap: true,
      showRaceControl: true,
      showFocusPanel: true,
      showTicker: true,
      skipBroadcastIntro: false,
      enableAudio: true,
      cameraMode: 'auto',
      racePace: 'normal',
      cautionStrictness: 'standard'
    };
    const cameraModes = new Set(['auto', 'leader', 'battle', 'manual']);
    const paceModes = new Set(['slow', 'normal', 'fast']);
    const cautionModes = new Set(['relaxed', 'standard', 'strict']);
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ui);
      if (!raw) return { ...defaults };
      const parsed = JSON.parse(raw);
      return {
        zoom: parsed.zoom === 'off' ? 'off' : 'on',
        showMiniMap: parsed.showMiniMap !== false,
        showRaceControl: parsed.showRaceControl !== false,
        showFocusPanel: parsed.showFocusPanel !== false,
        showTicker: parsed.showTicker !== false,
        skipBroadcastIntro: parsed.skipBroadcastIntro === true,
        enableAudio: parsed.enableAudio !== false,
        cameraMode: cameraModes.has(parsed.cameraMode) ? parsed.cameraMode : defaults.cameraMode,
        racePace: paceModes.has(parsed.racePace) ? parsed.racePace : defaults.racePace,
        cautionStrictness: cautionModes.has(parsed.cautionStrictness) ? parsed.cautionStrictness : defaults.cautionStrictness
      };
    } catch (err) {
      console.warn('ui settings load failed', err);
      return { ...defaults };
    }
  }

  function persistUiSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.ui, JSON.stringify(uiSettings));
    } catch (err) {
      console.warn('ui settings save failed', err);
    }
  }

  function loadRaceSettings() {
    const defaults = { track: 'oval', laps: 15, ai: 'normal', weather: 'clear', startProc: 'standing' };
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.raceSettings);
      if (!raw) return { ...defaults };
      const parsed = JSON.parse(raw);
      return {
        track: typeof parsed.track === 'string' ? parsed.track : defaults.track,
        laps: Number.isFinite(parsed.laps) ? parsed.laps : parseInt(parsed.laps, 10) || defaults.laps,
        ai: typeof parsed.ai === 'string' ? parsed.ai : defaults.ai,
        weather: typeof parsed.weather === 'string' ? parsed.weather : defaults.weather,
        startProc: typeof parsed.startProc === 'string' ? parsed.startProc : defaults.startProc
      };
    } catch (err) {
      console.warn('race settings load failed', err);
      return { ...defaults };
    }
  }

  function persistRaceSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.raceSettings, JSON.stringify(raceSettings));
    } catch (err) {
      console.warn('race settings save failed', err);
    }
  }

  function applyUiSettings() {
    if (canvasWrap) {
      canvasWrap.classList.toggle('zoomOff', uiSettings.zoom === 'off');
      canvasWrap.classList.toggle('zoomOn', uiSettings.zoom !== 'off');
    }
    if (miniMap) {
      miniMap.classList.toggle('isHidden', !uiSettings.showMiniMap);
    }
    if (raceControlPanel) {
      raceControlPanel.classList.toggle('isHidden', !uiSettings.showRaceControl);
    }
    if (focusDriverPanel) {
      focusDriverPanel.classList.toggle('isHidden', !uiSettings.showFocusPanel);
    }
    if (liveTickerPanel) {
      liveTickerPanel.classList.toggle('isHidden', uiSettings.showTicker === false);
    }
    if (highlightTicker) {
      highlightTicker.classList.toggle('isHidden', uiSettings.showTicker === false);
    }
  }

  function syncUiSettingControls() {
    if (zoomSetting) {
      zoomSetting.value = uiSettings.zoom === 'off' ? 'off' : 'on';
    }
    if (cameraSetting) {
      const allowed = ['auto', 'leader', 'battle', 'manual'];
      cameraSetting.value = allowed.includes(uiSettings.cameraMode) ? uiSettings.cameraMode : 'auto';
    }
    if (racePaceSetting) {
      const allowedPace = ['slow', 'normal', 'fast'];
      racePaceSetting.value = allowedPace.includes(uiSettings.racePace) ? uiSettings.racePace : 'normal';
    }
    if (cautionSetting) {
      const allowedCaution = ['relaxed', 'standard', 'strict'];
      cautionSetting.value = allowedCaution.includes(uiSettings.cautionStrictness) ? uiSettings.cautionStrictness : 'standard';
    }
    if (toggleMiniMap) {
      toggleMiniMap.checked = uiSettings.showMiniMap !== false;
    }
    if (toggleRaceControl) {
      toggleRaceControl.checked = uiSettings.showRaceControl !== false;
    }
    if (toggleFocusPanel) {
      toggleFocusPanel.checked = uiSettings.showFocusPanel !== false;
    }
    if (toggleTicker) {
      toggleTicker.checked = uiSettings.showTicker !== false;
    }
    if (toggleBroadcastIntro) {
      toggleBroadcastIntro.checked = uiSettings.skipBroadcastIntro === true;
    }
    if (toggleAudio) {
      toggleAudio.checked = uiSettings.enableAudio !== false;
    }
  }

  function syncRaceSettingControls() {
    const availableTracks = new Set(Object.keys(trackCatalog || {}));
    const trackId = availableTracks.has(raceSettings.track) ? raceSettings.track : 'oval';
    if (trackTypeSelect) {
      if ([...trackTypeSelect.options].some(opt => opt.value === trackId)) {
        trackTypeSelect.value = trackId;
      } else if (trackTypeSelect.options.length) {
        trackTypeSelect.value = trackTypeSelect.options[0].value;
      }
    }
    currentTrackType = trackTypeSelect?.value || trackId;
    raceSettings.track = currentTrackType;

    if (lapsSetting) {
      const lapsValue = String(raceSettings.laps || totalLaps || 15);
      if ([...lapsSetting.options].some(opt => opt.value === lapsValue)) {
        lapsSetting.value = lapsValue;
      } else if (lapsSetting.options.length) {
        lapsSetting.value = lapsSetting.options[0].value;
      }
      totalLaps = parseInt(lapsSetting.value, 10);
    } else {
      totalLaps = Number.isFinite(raceSettings.laps) ? raceSettings.laps : 15;
    }
    raceSettings.laps = totalLaps;

    const aiValue = ['easy', 'normal', 'hard'].includes(raceSettings.ai) ? raceSettings.ai : 'normal';
    if (aiDifficulty) {
      aiDifficulty.value = aiValue;
    }
    aiLevel = aiValue;
    raceSettings.ai = aiValue;

    const weatherValue = raceSettings.weather && weatherCatalog[raceSettings.weather] ? raceSettings.weather : 'clear';
    if (weatherSetting) {
      if ([...weatherSetting.options].some(opt => opt.value === weatherValue)) {
        weatherSetting.value = weatherValue;
      } else if (weatherSetting.options.length) {
        weatherSetting.value = weatherSetting.options[0].value;
      }
      currentWeather = weatherSetting.value;
    } else {
      currentWeather = weatherValue;
    }
    raceSettings.weather = currentWeather;

    const startValue = ['standing', 'staggered', 'rolling'].includes(raceSettings.startProc) ? raceSettings.startProc : 'standing';
    if (startProc) {
      if ([...startProc.options].some(opt => opt.value === startValue)) {
        startProc.value = startValue;
      } else if (startProc.options.length) {
        startProc.value = startProc.options[0].value;
      }
      startProcedureMode = startProc.value;
    } else {
      startProcedureMode = startValue;
    }
    raceSettings.startProc = startProcedureMode;

    updateActiveTrackTraits();
    rebuildMini();
    updateEventBriefing();
    persistRaceSettings();
    refreshOddsTable();
  }

  function showSettingsNotice(message, type = 'info') {
    if (!settingsNotice) return;
    if (settingsNoticeTimer) {
      clearTimeout(settingsNoticeTimer);
      settingsNoticeTimer = null;
    }
    settingsNotice.textContent = message || '';
    settingsNotice.classList.remove('success', 'error', 'info', 'visible');
    if (!message) return;
    const typeClass = type === 'success' ? 'success' : type === 'error' ? 'error' : 'info';
    settingsNotice.classList.add(typeClass, 'visible');
    settingsNoticeTimer = window.setTimeout(() => {
      settingsNotice.classList.remove('visible', 'success', 'error', 'info');
      settingsNotice.textContent = '';
      settingsNoticeTimer = null;
    }, 4000);
  }
  function getGridEntries() {
    const entries = [];
    Object.entries(managerState.teams).forEach(([teamName, teamData]) => {
      (teamData.roster || []).forEach(contract => {
        const info = driverMap.get(contract.driver);
        if (!info) return;
        entries.push({
          team: teamName,
          driver: contract.driver,
          number: info.number,
          driverInfo: info,
          contract
        });
      });
    });
    return entries.slice(0, 20);
  }

  let nextId = 1;
  class Car {
    constructor(team, driver, number, baseSpeed, risk, intel, consist, extras = {}) {
      this.id = nextId++;
      this.team = team;
      this.driver = driver;
      this.racingNumber = number;
      this.color = teamColors[team] || '#6ee7ff';
      this.baseSpeed = baseSpeed;
      this.risk = risk;
      this.intel = intel;
      this.consist = consist;
      this.profile = extras.profile || vehicleArchetypes.balanced;
      const chassis = { ...defaultChassisSpec, ...(extras.chassis || {}) };
      this.chassis = chassis;
      this.chassisLabel = chassis.codename || 'Spec-A1';
      this.bodyGeometry = chassis.geometry || defaultChassisSpec.geometry;
      this.morale = extras.morale ?? 0.5;
      this.progress = 0;
      this.lap = 1;
      this.finished = false;
      this.finishTime = null;
      this.trail = [];
      this.speedVariance = (Math.random() - 0.5) * 0.35;
      this.gridOffset = { x: 0, y: 0 };
      this.crashCooldown = 0;
      this.pitted = false;
      this.pitTimer = 0;
      this.inPit = false;
      this.pitHoldProgress = 0;
      this.pitHoldLap = 1;
      this.pitReleaseBoost = 0;
      this.pitCount = 0;
      this.pitEntryWear = null;
      this.pitLap = Math.max(2, Math.floor(totalLaps * (0.45 + Math.random() * 0.18)));
      this.currentLapStartTime = 0;
      this.lastSectorTimestamp = 0;
      this.nextSectorIndex = 1;
      this.nextSectorNormalized = SECTOR_SPLITS[1];
      this.currentLapSectors = [];
      this.lastLapTime = 0;
      this.bestLapTime = Infinity;
      this.bestSectorTimes = [Infinity, Infinity, Infinity];
      this.form = extras.teamForm || 0;
      this.contract = extras.contract || null;
      this.driverInfo = extras.driverInfo || null;
      this.trackTraits = extras.trackTraits || activeTrackTraits;
      this.upgradeBoost = extras.upgrades || { engine: 0, aero: 0, systems: 0 };
      this.systemIntegrity = clamp(0.68 + this.consist * 0.3 + (this.profile.systems - 1) * 0.25 + (chassis.systems - 1) * 0.25, 0.5, 1.2);
      this.tireWear = 0;
      this.wearSignals = { tire: false, system: false, critical: false, pitCall: false, pitClear: false };
      this.currentSpeed = 0;
      this.peakSpeed = 0;
    }
    getPosition() {
      const pos = trackPos(this.progress);
      if (this.lap === 1 && this.progress < 0.05) {
        return { x: pos.x + this.gridOffset.x, y: pos.y + this.gridOffset.y, angle: pos.angle };
      }
      return pos;
    }
    update(dt, leader) {
      if (this.finished) return;
      const prevNorm = (this.lap - 1) + this.progress / (Math.PI * 2);

      const traits = this.trackTraits || activeTrackTraits;
      let speed = this.baseSpeed + this.speedVariance;
      speed *= 1 + (traits.straightBias - 1) * 0.12;
      speed *= 1 + (this.form || 0) * 0.02 + (this.morale - 0.5) * 0.04;

      const stability = 0.45 + this.consist * 0.55;
      speed += (Math.random() - 0.5) * (1.15 - stability);

      const curvaturePenalty = (0.25 + 0.55 * Math.sin(this.progress * 3) ** 2) * (traits.cornerFocus || 1);
      const cornerControl = clamp(this.intel * (this.profile.corner || 1), 0, 1.2);
      speed -= (1 - cornerControl) * curvaturePenalty;

      const turbulence = traits.turbulence || 1;
      if (Math.random() < 0.002 * turbulence * (1 - this.consist)) {
        speed -= Math.random() * 0.8;
      }

      if (raceClockArmed) {
        this.tireWear = clamp(
          this.tireWear + dt * (0.035 + this.risk * 0.025) * (traits.wearRate || 1) * (this.profile.wear || 1),
          0,
          1.2
        );
        const wearPenalty = this.tireWear * 0.6;
        speed -= wearPenalty;

        this.systemIntegrity = clamp(
          this.systemIntegrity - dt * (0.004 + this.risk * 0.003) * (traits.wearRate || 1) / Math.max(0.75, this.profile.systems || 1),
          0.35,
          1.15
        );
        const systemPenalty = (1.05 - this.systemIntegrity) * 1.4;
        if (systemPenalty > 0) {
          speed -= systemPenalty;
        }

        if (!this.wearSignals.tire && this.tireWear > 0.62) {
          logRaceControl(`#${this.racingNumber} ${this.driver}: Reifenverschleiß steigt`, 'warn');
          this.wearSignals.tire = true;
        }
        if (!this.wearSignals.system && this.systemIntegrity < 0.62) {
          logRaceControl(`#${this.racingNumber} ${this.driver}: Systeme unter Beobachtung`, 'warn');
          this.wearSignals.system = true;
        }
        if (!this.wearSignals.critical && this.systemIntegrity < 0.45) {
          this.speedVariance -= 0.2;
          logRaceControl(`#${this.racingNumber} ${this.driver}: Leistungsverlust`, 'alert');
          this.wearSignals.critical = true;
        }
      }

      const pitWindowOpen =
        raceClockArmed &&
        !this.finished &&
        !this.pitted &&
        this.lap === this.pitLap &&
        racePhase !== 'COUNTDOWN' &&
        racePhase !== 'FORMATION';

      if (!this.inPit && pitWindowOpen && this.progress < 0.32) {
        this.inPit = true;
        this.pitTimer = 0;
        this.pitHoldProgress = this.progress;
        this.pitHoldLap = this.lap;
        this.pitEntryWear = { tire: this.tireWear, system: this.systemIntegrity };
        if (!this.wearSignals.pitCall) {
          logRaceControl(`#${this.racingNumber} ${this.driver}: Boxenstopp`, 'info');
          this.wearSignals.pitCall = true;
        }
      }

      if (this.inPit) {
        this.pitTimer += dt;
        speed = Math.min(speed, 2.4);
        this.progress = this.pitHoldProgress;
        this.lap = this.pitHoldLap;
        if (this.pitTimer >= 5.5) {
          this.inPit = false;
          this.pitted = true;
          this.pitTimer = 0;
          const release = this.pitHoldProgress + 0.14;
          if (release >= Math.PI * 2) {
            this.progress = release - Math.PI * 2;
            this.lap = this.pitHoldLap + 1;
          } else {
            this.progress = release;
          }
          const entryWear = this.pitEntryWear?.tire ?? this.tireWear;
          const entrySystem = this.pitEntryWear?.system ?? this.systemIntegrity;
          this.tireWear = Math.max(0, this.tireWear - 0.4);
          this.systemIntegrity = Math.min(1.05, this.systemIntegrity + 0.12);
          this.pitReleaseBoost = 0.6;
          this.pitCount = (this.pitCount || 0) + 1;
          logPitStopHighlight(this, entryWear - this.tireWear, this.systemIntegrity - entrySystem);
          this.pitEntryWear = null;
          if (!this.wearSignals.pitClear) {
            logRaceControl(`#${this.racingNumber} ${this.driver}: verlässt die Box`, 'success');
            this.wearSignals.pitClear = true;
          }
        }
      }

      if (this.pitReleaseBoost > 0) {
        speed *= 1 + Math.min(this.pitReleaseBoost, 0.6);
        this.pitReleaseBoost = Math.max(0, this.pitReleaseBoost - dt * 0.9);
      }

      if (!this.finished && (isCautionPhase() || racePhase === 'FORMATION')) {
        const ahead = cautionOrderMap.get(this.id);
        let reference = null;
        if (ahead && ahead !== this && !ahead.finished) {
          reference = ahead;
        } else if (leader && leader !== this) {
          reference = leader;
        }
        if (reference) {
          const gap = computeAngularGap(reference, this);
          let target = cautionTargets.get(this.id);
          if (typeof target !== 'number' || Number.isNaN(target)) {
            target = getCautionTargetForPhase(racePhase);
          }
          target = clamp(target, BUNCHING_MIN_TARGET, BUNCHING_MAX_TARGET);
          const overshoot = gap - target;
          if (overshoot > 0.005) {
            const ratio = clamp(overshoot / Math.max(target, 0.01), 0.08, 2.8);
            const aggression = getBunchingAggression(racePhase);
            speed *= 1 + ratio * aggression;
            speed += overshoot * 0.35;
          } else if (gap < target * 0.42) {
            speed *= 0.78;
          }
        }
      }

      if (jumpStartArmed && racePhase === 'COUNTDOWN') {
        detectJumpStart(this, speed);
      }

      speed = Math.max(3.5, speed);
      const phaseFactor = getPhaseSpeedFactor();
      speed *= phaseFactor;

      this.currentSpeed = Math.max(0, speed * 32);
      this.peakSpeed = Math.max(this.peakSpeed, this.currentSpeed);

      const dprog = speed * dt * 0.33;
      this.progress += dprog;

      if (this.progress >= Math.PI * 2) {
        this.progress -= Math.PI * 2;
        if (raceClockArmed) {
          this.lap += 1;
        }
      }

      const currNorm = (this.lap - 1) + this.progress / (Math.PI * 2);
      if (raceClockArmed) {
        handleSectorProgress(this, prevNorm, currNorm, dt);
      }

      const pos = this.getPosition();
      this.trail.push({ x: pos.x, y: pos.y });
      if (this.trail.length > 48) this.trail.shift();

      if (this.lap > totalLaps && !this.finished) {
        this.finished = true;
        this.finishTime = raceTime;
        registerFinish(this);
      }

      if (this.crashCooldown > 0) {
        this.crashCooldown -= dt;
      } else if (racePhase === 'GREEN' && Math.random() < 0.00055 + this.risk * 0.0009) {
        triggerIncident(this);
        this.crashCooldown = 12;
      }
    }
  }

  function handleSectorProgress(car, prevNorm, currNorm, dt) {
    let prevTime = raceTime - dt;
    let basePrevNorm = prevNorm;
    let safety = 0;
    while (car.nextSectorIndex <= 3 && currNorm + 1e-6 >= car.nextSectorNormalized) {
      safety += 1;
      if (safety > 6) break;
      const progressDelta = currNorm - basePrevNorm;
      const ratio = progressDelta <= 0 ? 1 : (car.nextSectorNormalized - basePrevNorm) / progressDelta;
      const alpha = clamp(ratio, 0, 1);
      const crossTime = prevTime + alpha * dt;
      const split = crossTime - car.lastSectorTimestamp;
      const sectorIdx = car.nextSectorIndex;
      if (split > 0) {
        const previousBest = car.bestSectorTimes[sectorIdx - 1];
        const isPB = split < previousBest - 0.0005;
        car.currentLapSectors[sectorIdx - 1] = split;
        car.bestSectorTimes[sectorIdx - 1] = Math.min(previousBest, split);
        registerSector(car, sectorIdx, split, isPB);
      }
      car.lastSectorTimestamp = crossTime;
      basePrevNorm = car.nextSectorNormalized;
      prevTime = crossTime;
      if (sectorIdx === 3) {
        const lapTime = crossTime - car.currentLapStartTime;
        if (lapTime > 0) {
          const improved = lapTime < car.bestLapTime - 0.002;
          car.lastLapTime = lapTime;
          car.bestLapTime = Math.min(car.bestLapTime, lapTime);
          registerLap(car, lapTime, improved);
        }
        car.currentLapStartTime = crossTime;
        car.currentLapSectors = [];
        car.nextSectorIndex = 1;
        const baseLap = Math.floor(currNorm);
        car.nextSectorNormalized = baseLap + SECTOR_SPLITS[1];
      } else {
        car.nextSectorIndex += 1;
        const baseLap = Math.floor(currNorm);
        car.nextSectorNormalized = baseLap + SECTOR_SPLITS[car.nextSectorIndex];
      }
    }
  }

  function registerSector(car, sectorIndex, time, isPB) {
    if (!isFinite(time) || time <= 0) return;
    const record = lapRecords.bestSectors[sectorIndex - 1];
    let className = '';
    let label = '';
    if (time < record.time - 0.001) {
      record.time = time;
      record.driver = car.driver;
      record.team = car.team;
      record.number = car.racingNumber;
      className = 'fl';
      label = 'REC';
      pushTicker(`S${sectorIndex} Rekord ${car.driver} – ${formatSplit(time)}s`, 'pb');
      logRaceControl(`S${sectorIndex} Rekord ${car.driver}`, 'success');
    } else if (isPB) {
      className = 'pb';
      label = 'PB';
      pushTicker(`S${sectorIndex} PB ${car.driver} – ${formatSplit(time)}s`, 'pb');
      logRaceControl(`S${sectorIndex} PB ${car.driver}`, 'info');
    }
    addSectorFeed({
      sector: sectorIndex,
      driver: car.driver,
      number: car.racingNumber,
      time,
      label,
      className
    });
  }

  function registerLap(car, lapTime, improved) {
    if (!isFinite(lapTime) || lapTime <= 0) return;
    const record = lapRecords.fastestLap;
    if (lapTime < record.time - 0.003) {
      lapRecords.fastestLap = {
        time: lapTime,
        driver: car.driver,
        team: car.team,
        number: car.racingNumber
      };
      pushTicker(`Neue schnellste Runde ${car.driver} – ${formatTime(lapTime)}`, 'fl');
      logRaceControl(`FL ${car.driver} ${formatTime(lapTime)}`, 'success');
    } else if (improved) {
      pushTicker(`${car.driver} persönliche Bestzeit ${formatTime(lapTime)}`, 'pb');
      logRaceControl(`PB Runde ${car.driver}`, 'info');
    }
    updateFastestLapLabel();
  }

  function registerFinish(car) {
    pushTicker(`${car.driver} im Ziel (${car.team})`, 'finish');
    logRaceControl(`#${car.racingNumber} ${car.driver} erreicht das Ziel`, 'success');
  }

  function addSectorFeed(event) {
    sectorFeed.unshift(event);
    if (sectorFeed.length > 6) sectorFeed.pop();
    updateSectorWidget();
  }

  function updateSectorWidget() {
    if (!sectorWidget) return;
    sectorWidget.innerHTML = '';
    sectorFeed.forEach(item => {
      const li = document.createElement('li');
      if (item.className) li.classList.add(item.className);
      li.innerHTML = `<span class=\"tag\">S${item.sector}</span><span class=\"driver\">#${item.number} ${item.driver}</span><span class=\"value\">${formatSplit(item.time)}${item.label ? ' ' + item.label : ''}</span>`;
      sectorWidget.appendChild(li);
    });
  }

  function updateFastestLapLabel() {
    if (!fastestLapLabel) return;
    const record = lapRecords.fastestLap;
    if (!record.driver) {
      fastestLapLabel.textContent = 'Schnellste Runde: --';
      return;
    }
    fastestLapLabel.innerHTML = `<span class=\"highlight\">FL</span> #${record.number} ${record.driver} ${formatTime(record.time)}`;
  }

  function getEffectiveRaceTime() {
    const value = Math.max(0, raceTime - raceClockOffset);
    return Number.isFinite(value) ? value : 0;
  }

  function formatTickerStamp() {
    const time = getEffectiveRaceTime();
    if (!isFinite(time) || time <= 0) return '--:--';
    return `${time.toFixed(1)}s`;
  }

  function updateLiveTicker() {
    if (!liveTickerList) return;
    liveTickerList.innerHTML = '';
    if (liveTickerEvents.length === 0) {
      const li = document.createElement('li');
      li.classList.add('empty');
      li.textContent = 'Warten auf Meldungen...';
      liveTickerList.appendChild(li);
      return;
    }
    const frag = document.createDocumentFragment();
    liveTickerEvents.forEach(entry => {
      const li = document.createElement('li');
      li.classList.add(entry.type || 'info');
      const stamp = document.createElement('span');
      stamp.className = 'stamp';
      stamp.textContent = entry.stamp || '--:--';
      const message = document.createElement('span');
      message.className = 'message';
      message.textContent = entry.message;
      li.appendChild(stamp);
      li.appendChild(message);
      frag.appendChild(li);
    });
    liveTickerList.appendChild(frag);
  }

  function resetLiveTicker() {
    liveTickerEvents.length = 0;
    updateLiveTicker();
  }

  function pushTicker(msg, type) {
    let tag = '🏁';
    if (type === 'yellow') tag = '🟨';
    else if (type === 'sc') tag = '🚨';
    else if (type === 'pb') tag = '⏱️';
    else if (type === 'fl') tag = '🔥';
    else if (type === 'info') tag = 'ℹ️';
    else if (type === 'warn') tag = '⚠️';
    else if (type === 'pit') tag = '🛠️';
    else if (type === 'stats') tag = '📊';
    const entryType = type || 'info';
    queueHighlightTicker(tag, msg, entryType);
    liveTickerEvents.unshift({ message: msg, type: entryType, stamp: formatTickerStamp() });
    if (liveTickerEvents.length > 12) {
      liveTickerEvents.pop();
    }
    updateLiveTicker();
  }

  function logRaceControl(message, level = 'info') {
    const displayTime = getEffectiveRaceTime();
    const stampValue = isFinite(displayTime) && displayTime > 0
      ? `${Math.floor(displayTime).toString().padStart(3, '0')}s`
      : '---';
    raceControlEvents.unshift({ message, level, stamp: stampValue });
    if (raceControlEvents.length > 14) {
      raceControlEvents.pop();
    }
    updateRaceControlLog();
  }

  function updateRaceControlLog() {
    if (!raceControlLog) return;
    raceControlLog.innerHTML = '';
    raceControlEvents.forEach(entry => {
      const li = document.createElement('li');
      li.classList.add(entry.level || 'info');
      li.innerHTML = `<span class=\"time\">${entry.stamp}</span><span class=\"msg\">${entry.message}</span>`;
      raceControlLog.appendChild(li);
    });
  }

  function resetRaceControlLog() {
    raceControlEvents.length = 0;
    updateRaceControlLog();
  }

  function finalizePhaseTimeline(endTime = raceTime) {
    const entry = phaseTimeline[phaseTimeline.length - 1];
    if (!entry || entry.end != null) return;
    entry.end = endTime;
    entry.duration = Math.max(0, endTime - entry.start);
  }

  function pushPhaseTimeline(name, meta) {
    const entry = {
      phase: name,
      start: raceTime,
      meta: meta && typeof meta === 'object' ? { ...meta } : undefined,
      end: null,
      duration: 0
    };
    phaseTimeline.push(entry);
    if (phaseTimeline.length > 40) {
      phaseTimeline.shift();
    }
  }

  function auditRaceFlow(event, details) {
    const snapshot = {
      event,
      phase: racePhase,
      raceTime: Number(raceTime.toFixed(3)),
      timestamp: Date.now()
    };
    if (details && typeof details === 'object') {
      snapshot.details = { ...details };
    }
    flowAudit.push(snapshot);
    if (flowAudit.length > 80) {
      flowAudit.shift();
    }
  }

  function getPhaseSpeedFactor() {
    const pace = getRacePaceMultiplier();
    switch (racePhase) {
      case 'GREEN':
        return (isRestartHoldActive() ? 0.9 : 1) * pace;
      case 'YELLOW':
        return 0.78 * pace;
      case 'SAFETY':
        return 0.55 * pace;
      case 'RESTART':
        return 0.82 * pace;
      case 'FORMATION':
        return 0.6 * pace;
      case 'COUNTDOWN':
      case 'FINISHED':
      case 'IDLE':
        return 0;
      default:
        return 1 * pace;
    }
  }

  function computeAngularGap(leader, car) {
    let gap = (leader.lap - car.lap) * Math.PI * 2 + (leader.progress - car.progress);
    while (gap < 0) gap += Math.PI * 2;
    return gap;
  }

  function computeTimeGap(leader, car) {
    if (leader.finishTime != null && car.finishTime != null) {
      return car.finishTime - leader.finishTime;
    }
    const angularGap = computeAngularGap(leader, car);
    const refSpeed = Math.max(8, leader.baseSpeed || 12);
    return angularGap / (refSpeed * 0.33);
  }

  function isRestartHoldActive(referenceTime = raceTime) {
    return restartHoldUntil > referenceTime && racePhase === 'GREEN';
  }

  function isCautionPhase(phase = racePhase) {
    if (phase === 'GREEN' && isRestartHoldActive()) {
      return true;
    }
    return cautionPhases.has(phase);
  }

  function snapshotCautionOrder() {
    if (!isCautionPhase()) {
      cautionOrderSnapshot = null;
      cautionPenaltyMemo.clear();
      return;
    }
    const order = cars.slice().sort(sortByRacePosition).filter(car => !car.finished);
    cautionOrderSnapshot = new Map(order.map((car, idx) => [car.id, idx]));
    cautionPenaltyMemo.clear();
  }

  function clearCautionSnapshot() {
    cautionOrderSnapshot = null;
    cautionPenaltyMemo.clear();
    cautionTargets.clear();
  }

  function updateCautionBunchingTargets(order) {
    cautionTargets.clear();
    if (!isCautionPhase()) {
      return;
    }
    const active = order.filter(car => !car.finished);
    if (active.length <= 1) return;
    const circumference = Math.PI * 2;
    const theoretical = circumference / active.length;
    let measured = 0;
    let segments = 0;
    for (let idx = 1; idx < active.length; idx++) {
      measured += computeAngularGap(active[idx - 1], active[idx]);
      segments += 1;
    }
    const average = segments > 0 ? measured / segments : theoretical;
    const tuning = getCautionTuning();
    let baseTarget = average * BUNCHING_TARGET_FACTOR * (tuning.targetScale || 1);
    if (racePhase === 'RESTART') {
      baseTarget *= tuning.restartScale || 1;
    } else if (racePhase === 'SAFETY') {
      baseTarget *= tuning.safetyScale || 1;
    } else if (racePhase === 'FORMATION') {
      baseTarget *= tuning.formationScale || 1;
    }
    baseTarget = clamp(baseTarget, BUNCHING_MIN_TARGET, BUNCHING_MAX_TARGET);
    for (let idx = 1; idx < active.length; idx++) {
      const car = active[idx];
      const spread = 1 + Math.min(idx * 0.06, 0.32);
      const target = clamp(baseTarget * spread, BUNCHING_MIN_TARGET, BUNCHING_MAX_TARGET);
      cautionTargets.set(car.id, target);
    }
  }

  function detectJumpStart(car, baseSpeed = 0) {
    if (!jumpStartArmed) return;
    if (racePhase !== 'COUNTDOWN') return;
    if (startProcedureMode === 'rolling') return;
    if (jumpStartWarnings.has(car.id)) return;
    const baseline = jumpStartBaselines.get(car.id);
    if (!baseline) return;
    let delta = car.progress - baseline.progress;
    const lapOffset = (car.lap - baseline.lap) * Math.PI * 2;
    delta += lapOffset;
    if (delta < 0) {
      delta = 0;
    }
    const speedEstimate = Math.max(Math.abs(baseSpeed * 32), Math.abs(car.currentSpeed || 0));
    if (delta > JUMP_START_THRESHOLD || speedEstimate > JUMP_START_SPEED_THRESHOLD) {
      jumpStartWarnings.add(car.id);
      pushTicker(`#${car.racingNumber} Frühstartwarnung`, 'warn');
      logRaceControl(`#${car.racingNumber} ${car.driver}: Jump-Start erkannt`, 'alert');
    }
  }

  function scanJumpStarts() {
    if (!jumpStartArmed) return;
    if (racePhase !== 'COUNTDOWN') return;
    if (startProcedureMode === 'rolling') return;
    cars.forEach(car => detectJumpStart(car, car.baseSpeed || 0));
  }

  function placeCarBehind(car, target) {
    if (!car || !target) return;
    let newProgress = target.progress - 0.06;
    let newLap = target.lap;
    if (newProgress < 0) {
      newProgress += Math.PI * 2;
      newLap = Math.max(1, target.lap - 1);
    }
    car.progress = newProgress;
    car.lap = newLap;
    car.currentSpeed = Math.min(car.currentSpeed, target.currentSpeed * 0.9);
    car.speedVariance -= 0.04;
  }

  function enforceCautionOrder(order) {
    if (!isCautionPhase()) {
      return;
    }
    if (!cautionOrderSnapshot) {
      snapshotCautionOrder();
      if (!cautionOrderSnapshot) return;
    }
    const now = Date.now();
    const grace = getCautionGracePeriod();
    for (let idx = 0; idx < order.length; idx++) {
      const car = order[idx];
      if (!car || car.finished) continue;
      const baseline = cautionOrderSnapshot.get(car.id);
      if (baseline == null) continue;
      if (idx < baseline) {
        const firstFlagged = cautionPenaltyMemo.get(car.id);
        if (firstFlagged == null) {
          cautionPenaltyMemo.set(car.id, now);
          continue;
        }
        if (now - firstFlagged < grace) {
          continue;
        }
        const ahead = idx > 0 ? order[idx - 1] : null;
        if (ahead && ahead !== car) {
          placeCarBehind(car, ahead);
          cautionPenaltyMemo.delete(car.id);
          pushTicker(`#${car.racingNumber} gibt Position unter Gelb zurück`, 'yellow');
          logRaceControl(`#${car.racingNumber} ${car.driver}: Position unter Gelb zurückgegeben`, 'warn');
          snapshotCautionOrder();
          break;
        }
      } else {
        cautionPenaltyMemo.delete(car.id);
      }
    }
  }

  function handleRestartRelease() {
    if (!restartReleaseArmed) {
      if (racePhase !== 'RESTART') {
        updateRestartHoldHud();
      }
      return;
    }
    if (racePhase !== 'GREEN') {
      restartReleaseArmed = false;
      restartHoldUntil = 0;
      clearCautionSnapshot();
      updateRestartHoldHud();
      return;
    }
    if (raceTime >= restartHoldUntil) {
      restartReleaseArmed = false;
      restartHoldUntil = 0;
      clearCautionSnapshot();
      pushTicker('Überholen wieder erlaubt', 'info');
      logRaceControl('Restart-Freigabe: Überholen wieder erlaubt', 'success');
      updateRestartHoldHud();
    }
  }

  function triggerIncident(car) {
    if (Math.random() < 0.5) {
      queueYellow(car);
    } else {
      queueSafety(car);
    }
  }

  function queueYellow(car) {
    if (racePhase === 'SAFETY') {
      extendPhase(3);
      return;
    }
    if (racePhase === 'YELLOW') {
      extendPhase(3);
      return;
    }
    const sequence = {
      name: 'RESTART',
      duration: 4,
      meta: { holdDuration: RESTART_HOLD_DURATION },
      next: { name: 'GREEN', meta: { holdDuration: RESTART_HOLD_DURATION } }
    };
    setRacePhase('YELLOW', 7, sequence, { source: car.driver });
  }

  function queueSafety(car) {
    if (racePhase === 'SAFETY') {
      extendPhase(4);
      return;
    }
    const sequence = {
      name: 'YELLOW',
      duration: 4,
      next: {
        name: 'RESTART',
        duration: 4,
        meta: { holdDuration: RESTART_HOLD_DURATION },
        next: { name: 'GREEN', meta: { holdDuration: RESTART_HOLD_DURATION } }
      }
    };
    setRacePhase('SAFETY', 12, sequence, { source: car.driver });
  }

  function setRacePhase(name, duration = null, next = null, meta = {}) {
    finalizePhaseTimeline(raceTime);
    previousPhase = racePhase;
    racePhase = name;
    racePhaseMeta = meta || {};
    racePhaseNext = next || null;
    racePhaseEndsAt = duration == null ? Infinity : raceTime + duration;
    if (name === 'RESTART') {
      const hold = typeof racePhaseMeta.holdDuration === 'number'
        ? Math.max(0, racePhaseMeta.holdDuration)
        : RESTART_HOLD_DURATION;
      racePhaseMeta.holdDuration = hold;
      restartHoldUntil = 0;
      restartReleaseArmed = false;
    } else if (name === 'GREEN') {
      if (previousPhase === 'RESTART') {
        const hold = typeof racePhaseMeta.holdDuration === 'number'
          ? Math.max(0, racePhaseMeta.holdDuration)
          : RESTART_HOLD_DURATION;
        if (hold > 0) {
          restartHoldUntil = raceTime + hold;
          restartReleaseArmed = true;
          racePhaseMeta.holdDuration = hold;
        } else {
          restartHoldUntil = 0;
          restartReleaseArmed = false;
        }
      } else {
        restartHoldUntil = 0;
        restartReleaseArmed = false;
      }
    } else {
      restartHoldUntil = 0;
      if (name !== 'RESTART') {
        restartReleaseArmed = false;
      }
    }
    pushPhaseTimeline(name, racePhaseMeta);
    auditRaceFlow('phase', {
      phase: name,
      duration,
      next: next?.name || null,
      source: meta?.source || null
    });
    const cautionActive = isCautionPhase(name);
    if (cautionActive) {
      snapshotCautionOrder();
    } else if (!isRestartHoldActive()) {
      clearCautionSnapshot();
    }
    if (name === 'FORMATION') {
      formationActive = true;
    }
    announcePhase(name, meta);
    if (previousPhase === 'YELLOW' || previousPhase === 'SAFETY') {
      finalizeCautionPhaseTracking(name);
    }
    if (name === 'YELLOW' || name === 'SAFETY') {
      beginCautionPhaseTracking(name);
    }
    handleReplayBookmark(name, previousPhase);
    updateFlag();
    updateSessionInfo();
    updateRestartHoldHud();
    if (name === 'COUNTDOWN' && previousPhase === 'FORMATION') {
      formationActive = false;
      raceActive = false;
      isPaused = false;
      setPauseButtonState(false, 'Pause');
      if (!countdownRunning) {
        beginRaceCountdown(true);
      }
    } else if (name === 'GREEN' && !raceClockArmed) {
      raceClockOffset = raceTime;
      raceClockArmed = true;
      cars.forEach(car => {
        car.currentLapStartTime = raceTime;
        car.lastSectorTimestamp = raceTime;
        car.currentLapSectors = [];
        car.nextSectorIndex = 1;
        car.nextSectorNormalized = SECTOR_SPLITS[1];
      });
    }
    if (name === 'COUNTDOWN') {
      if (startProcedureMode !== 'rolling') {
        jumpStartArmed = true;
        jumpStartBaselines.clear();
        jumpStartWarnings.clear();
        cars.forEach(car => {
          jumpStartBaselines.set(car.id, { lap: car.lap, progress: car.progress });
        });
      } else {
        jumpStartArmed = false;
        jumpStartBaselines.clear();
        jumpStartWarnings.clear();
      }
    } else if (name === 'GREEN') {
      jumpStartArmed = false;
      jumpStartBaselines.clear();
      jumpStartWarnings.clear();
    }
  }

  function extendPhase(extraSeconds) {
    if (racePhaseEndsAt !== Infinity) {
      racePhaseEndsAt += extraSeconds;
    }
  }

  function tickPhase() {
    if (racePhaseEndsAt !== Infinity && raceTime >= racePhaseEndsAt) {
      if (racePhaseNext) {
        const next = racePhaseNext;
        setRacePhase(next.name, next.duration ?? null, next.next ?? null, next.meta || {});
      } else {
        setRacePhase('GREEN');
      }
    } else if (racePhase === 'RESTART' || racePhase === 'YELLOW' || racePhase === 'SAFETY' || racePhase === 'FORMATION') {
      updateSessionInfo();
    }
  }

  function announcePhase(name, meta) {
    if (name === 'GREEN' && previousPhase !== 'GREEN') {
      pushTicker('Green Flag – Rennen frei!', 'fl');
      logRaceControl('Green Flag', 'success');
      playRaceCue('green');
      let detail = 'Rennen frei';
      if (previousPhase === 'RESTART') {
        detail = isRestartHoldActive()
          ? 'Restart: Überholen erst nach Startlinie'
          : 'Restart abgeschlossen – Feld freigegeben';
      }
      const stamp = formatTickerStamp();
      const secondary = stamp && stamp !== '--:--' ? `${stamp} · ${detail}` : detail;
      queueEventBanner('Grüne Flagge', secondary, 'success');
      if (previousPhase === 'RESTART' && isRestartHoldActive()) {
        pushTicker('Überholen erst nach Startlinie erlaubt', 'yellow');
        logRaceControl('Restart: Überholen erst nach Startlinie erlaubt', 'warn');
      }
    } else if (name === 'YELLOW') {
      phaseStats.yellow += 1;
      const src = meta?.source ? ` (${meta.source})` : '';
      pushTicker(`Gelbe Flagge${src}`, 'yellow');
      logRaceControl(`Gelbe Flagge${src}`, 'warn');
      playRaceCue('yellow');
      const stamp = formatTickerStamp();
      const cause = meta?.source ? `Auslöser: ${meta.source}` : 'Vorsicht auf der Strecke';
      const secondary = stamp && stamp !== '--:--' ? `${stamp} · ${cause}` : cause;
      queueEventBanner('Gelbe Flagge', secondary, 'caution');
    } else if (name === 'SAFETY') {
      phaseStats.safety += 1;
      const src = meta?.source ? ` wegen ${meta.source}` : '';
      pushTicker(`Safety Car${src}`, 'sc');
      logRaceControl(`Safety Car${src}`, 'alert');
      playRaceCue('safety');
      const stamp = formatTickerStamp();
      const cause = meta?.source ? `Auslöser: ${meta.source}` : 'Feld neutralisiert';
      const secondary = stamp && stamp !== '--:--' ? `${stamp} · ${cause}` : cause;
      queueEventBanner('Safety Car auf Strecke', secondary, 'alert');
    } else if (name === 'RESTART') {
      phaseStats.restart += 1;
      pushTicker('Restart-Prozedur läuft', 'info');
      logRaceControl('Restart Vorbereitung', 'info');
      playRaceCue('light');
      const hold = typeof meta?.holdDuration === 'number' ? Math.max(0, meta.holdDuration) : RESTART_HOLD_DURATION;
      const stamp = formatTickerStamp();
      const detail = hold > 0
        ? `Freigabe in ${hold.toFixed(1)}s`
        : 'Freigabe in Kürze';
      const secondary = stamp && stamp !== '--:--' ? `${stamp} · ${detail}` : detail;
      queueEventBanner('Restart-Prozedur', secondary, 'info');
    } else if (name === 'FORMATION') {
      phaseStats.formation += 1;
      const stamp = formatTickerStamp();
      const detail = stamp && stamp !== '--:--' ? `${stamp} · Feld reiht sich ein` : 'Feld reiht sich ein';
      queueEventBanner('Formationsrunde', detail, 'info');
    }
  }

  function updateFlag() {
    if (!raceFlag) return;
    raceFlag.classList.add('hidden');
    raceFlag.classList.remove('green', 'yellow', 'sc', 'restart');
    switch (racePhase) {
      case 'GREEN':
        raceFlag.textContent = 'GREEN FLAG';
        raceFlag.classList.remove('hidden');
        raceFlag.classList.add('green');
        break;
      case 'YELLOW':
        raceFlag.textContent = 'YELLOW FLAG';
        raceFlag.classList.remove('hidden');
        raceFlag.classList.add('yellow');
        break;
      case 'SAFETY':
        raceFlag.textContent = 'SAFETY CAR';
        raceFlag.classList.remove('hidden');
        raceFlag.classList.add('sc');
        break;
      case 'RESTART':
        raceFlag.textContent = 'RESTART';
        raceFlag.classList.remove('hidden');
        raceFlag.classList.add('restart');
        break;
      case 'FORMATION':
        raceFlag.textContent = 'FORMATION LAP';
        raceFlag.classList.remove('hidden');
        raceFlag.classList.add('yellow');
        break;
      case 'COUNTDOWN':
        raceFlag.textContent = 'GRID HOLD';
        raceFlag.classList.remove('hidden');
        raceFlag.classList.add('yellow');
        break;
      default:
        break;
    }
  }

  function updateSessionInfo() {
    if (!sessionInfo) return;
    if (racePhase === 'GREEN' && !isRestartHoldActive()) {
      sessionInfo.classList.add('hidden');
      return;
    }
    let text = '';
    if (racePhase === 'COUNTDOWN') {
      text = racePhaseMeta.countdownText || 'Start';
    } else if (racePhase === 'YELLOW') {
      const remain = racePhaseEndsAt === Infinity ? '' : ` ${Math.max(0, Math.ceil(racePhaseEndsAt - raceTime))}s`;
      text = `Yellow${remain}`;
    } else if (racePhase === 'SAFETY') {
      const remain = racePhaseEndsAt === Infinity ? '' : ` ${Math.max(0, Math.ceil(racePhaseEndsAt - raceTime))}s`;
      text = `Safety Car${remain}`;
    } else if (racePhase === 'RESTART') {
      const remain = racePhaseEndsAt === Infinity ? '' : ` in ${Math.max(0, Math.ceil(racePhaseEndsAt - raceTime))}s`;
      text = `Restart${remain}`;
    } else if (racePhase === 'GREEN' && isRestartHoldActive()) {
      const remain = Math.max(0, restartHoldUntil - raceTime);
      text = `Green – Überholen in ${Math.ceil(remain)}s`;
    } else if (racePhase === 'FORMATION') {
      const remain = racePhaseEndsAt === Infinity ? '' : ` ${Math.max(0, Math.ceil(racePhaseEndsAt - raceTime))}s`;
      text = `Formation${remain}`;
    } else if (racePhase === 'FINISHED') {
      text = 'Rennen beendet';
    } else if (racePhase === 'IDLE') {
      text = '';
    } else {
      text = racePhase;
    }
    if (text) {
      sessionInfo.textContent = text;
      sessionInfo.classList.remove('hidden');
    } else {
      sessionInfo.classList.add('hidden');
    }
  }

  function updateRestartHoldHud() {
    if (!restartHoldBanner) return;
    if (racePhase === 'RESTART' && (racePhaseMeta?.holdDuration || 0) > 0) {
      restartHoldBanner.textContent = 'Restart – Kein Überholen';
      restartHoldBanner.classList.remove('hidden');
      return;
    }
    if (isRestartHoldActive()) {
      const remain = Math.max(0, restartHoldUntil - raceTime);
      const label = remain > 0.05
        ? `No Overtake – ${remain.toFixed(1)}s`
        : 'No Overtake – Freigabe';
      restartHoldBanner.textContent = label;
      restartHoldBanner.classList.remove('hidden');
      return;
    }
    restartHoldBanner.classList.add('hidden');
  }

  function getBackdropElements(trackId, config) {
    if (backdropCache.has(trackId)) {
      return backdropCache.get(trackId);
    }
    const rng = createSeededRandom(hashString(trackId));
    const stars = [];
    const pulses = [];
    const starCount = Math.max(24, Math.round(config.stars || 72));
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: rng() * canvas.width,
        y: rng() * canvas.height * 0.7,
        r: 0.6 + rng() * 1.4,
        alpha: 0.25 + rng() * 0.5
      });
    }
    const pulseCount = Math.max(1, Math.round(config.pulses || 3));
    for (let i = 0; i < pulseCount; i++) {
      pulses.push({
        x: canvas.width * (0.2 + rng() * 0.6),
        y: canvas.height * (0.55 + rng() * 0.3),
        radiusX: canvas.width * (0.18 + rng() * 0.22),
        radiusY: canvas.height * (0.08 + rng() * 0.1),
        alpha: 0.12 + rng() * 0.18
      });
    }
    const pack = { stars, pulses };
    backdropCache.set(trackId, pack);
    return pack;
  }

  function drawBackdrop(trackId, track, theme) {
    const config = track?.backdrop || {};
    const skyTop = config.skyTop || lightenHex(theme.background || '#07111f', 0.12);
    const skyBottom = config.skyBottom || theme.background || '#02060f';
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, skyTop);
    gradient.addColorStop(1, skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const horizonColor = config.horizon || lightenHex(theme.background || '#07111f', 0.04);
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = horizonColor;
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height * 0.94, canvas.width * 0.9, canvas.height * 0.52, 0, Math.PI, 0, true);
    ctx.fill();
    ctx.restore();

    if (config.haze) {
      ctx.save();
      ctx.fillStyle = config.haze;
      ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.6);
      ctx.restore();
    }

    const elements = getBackdropElements(trackId, config);
    ctx.save();
    (elements.stars || []).forEach(star => {
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = hexToRgba(config.accent || theme.accent || '#38bdf8', 0.18);
    ctx.lineWidth = 1;
    const spacing = config.gridSpacing || 24;
    for (let y = canvas.height * 0.45; y < canvas.height; y += spacing) {
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    (elements.pulses || []).forEach(glow => {
      ctx.globalAlpha = glow.alpha;
      const gradientGlow = ctx.createRadialGradient(
        glow.x,
        glow.y,
        Math.min(glow.radiusX, glow.radiusY) * 0.25,
        glow.x,
        glow.y,
        Math.max(glow.radiusX, glow.radiusY)
      );
      gradientGlow.addColorStop(0, hexToRgba(config.accent || theme.accent || '#38bdf8', 0.32));
      gradientGlow.addColorStop(1, 'rgba(2,6,14,0)');
      ctx.fillStyle = gradientGlow;
      ctx.beginPath();
      ctx.ellipse(glow.x, glow.y, glow.radiusX, glow.radiusY, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawTrack() {
    const track = trackCatalog[currentTrackType] || trackCatalog.oval;
    const theme = currentVisualTheme || track.theme || defaultTrackTheme;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackdrop(currentTrackType, track, theme);
    ctx.save();
    ctx.strokeStyle = theme.asphalt;
    ctx.lineWidth = 60;
    ctx.shadowColor = hexToRgba((track.backdrop && track.backdrop.accent) || theme.accent || '#38bdf8', 0.28);
    ctx.shadowBlur = 18;
    ctx.beginPath();
    for (let i = 0; i <= 256; i++) {
      const t = (i / 256) * Math.PI * 2;
      const p = track.geometry(t);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = theme.lane;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 256; i += 3) {
      const t = (i / 256) * Math.PI * 2;
      const p = track.geometry(t);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function roundRect(ctx2, x, y, w, h, r) {
    const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx2.beginPath();
    ctx2.moveTo(x + rr, y);
    ctx2.quadraticCurveTo(x, y, x, y + rr);
    ctx2.lineTo(x, y + h - rr);
    ctx2.quadraticCurveTo(x, y + h, x + rr, y + h);
    ctx2.lineTo(x + w - rr, y + h);
    ctx2.quadraticCurveTo(x + w, y + h, x + w, y + h - rr);
    ctx2.lineTo(x + w, y + rr);
    ctx2.quadraticCurveTo(x + w, y, x + w - rr, y);
    ctx2.closePath();
  }

  function drawCars(carList = cars) {
    carList.forEach(car => {
      const pos = typeof car.getPosition === 'function' ? car.getPosition() : { x: car.x ?? 0, y: car.y ?? 0, angle: car.angle ?? 0 };
      const trail = Array.isArray(car.trail) ? car.trail : [];
      ctx.strokeStyle = `${car.color}55`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      trail.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(pos.angle);
      ctx.fillStyle = car.color;
      const geo = car.bodyGeometry || car.geometry || defaultChassisSpec.geometry;
      const bodyLength = geo?.length ?? 28;
      const bodyWidth = geo?.width ?? 16;
      const nose = geo?.nose ?? 6;
      const canopy = geo?.canopy ?? 12;
      const halfL = bodyLength / 2;
      const halfW = bodyWidth / 2;
      roundRect(ctx, -halfL, -halfW, bodyLength, bodyWidth, Math.min(6, halfW));
      ctx.fill();
      ctx.fillStyle = '#0b0f17';
      ctx.fillRect(-canopy / 2, -halfW, canopy, bodyWidth);
      ctx.fillStyle = `${car.color}aa`;
      ctx.fillRect(halfL - nose, -halfW, nose, bodyWidth);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(car.racingNumber, 0, 3);
      if (car.id === focusDriverId && !replayActive) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        roundRect(ctx, -halfL - 2, -halfW - 2, bodyLength + 4, bodyWidth + 4, Math.min(8, halfW + 2));
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawMiniMap(carList = cars) {
    const track = trackCatalog[currentTrackType] || trackCatalog.oval;
    const theme = currentVisualTheme || track.theme || defaultTrackTheme;
    mm.clearRect(0, 0, miniMap.width, miniMap.height);
    mm.fillStyle = theme.background || '#0b0f17';
    mm.fillRect(0, 0, miniMap.width, miniMap.height);
    if (!miniSamples.length) rebuildMini();
    const xs = miniSamples.map(p => p.x);
    const ys = miniSamples.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const scaleX = (miniMap.width - 10) / (maxX - minX);
    const scaleY = (miniMap.height - 10) / (maxY - minY);
    const scale = Math.min(scaleX, scaleY);
    const ox = 5 - minX * scale;
    const oy = 5 - minY * scale;

    mm.strokeStyle = theme.accent;
    mm.lineWidth = 3;
    mm.beginPath();
    miniSamples.forEach((p, idx) => {
      const x = p.x * scale + ox;
      const y = p.y * scale + oy;
      if (idx === 0) mm.moveTo(x, y);
      else mm.lineTo(x, y);
    });
    mm.closePath();
    mm.stroke();

    const sectorAngles = SECTOR_SPLITS.slice(1, SECTOR_SPLITS.length - 1);
    mm.lineWidth = 1.5;
    sectorAngles.forEach((split, idx) => {
      const angle = split * Math.PI * 2;
      const pt = track.geometry(angle);
      const sx = pt.x * scale + ox;
      const sy = pt.y * scale + oy;
      mm.strokeStyle = `${theme.lane || '#64748b'}66`;
      mm.beginPath();
      mm.arc(sx, sy, 9, 0, Math.PI * 2);
      mm.stroke();
      mm.fillStyle = '#cbd5f5';
      mm.font = '9px Orbitron, Arial';
      mm.textAlign = 'center';
      mm.textBaseline = 'middle';
      mm.fillText(`S${idx + 1}`, sx, sy);
    });

    const order = (Array.isArray(carList) ? carList.slice() : Array.from(carList)).sort(sortByRacePosition);
    const leaderId = order[0]?.id ?? null;
    let leaderPoint = null;
    let focusPoint = null;
    order.forEach((car, idx) => {
      const pos = typeof car.getPosition === 'function' ? car.getPosition() : { x: car.x ?? 0, y: car.y ?? 0 };
      const x = pos.x * scale + ox;
      const y = pos.y * scale + oy;
      mm.fillStyle = car.color;
      mm.beginPath();
      mm.arc(x, y, idx === 0 ? 4 : 3, 0, Math.PI * 2);
      mm.fill();
      if (idx === 0) {
        leaderPoint = { x, y };
      }
      if (focusDriverId && car.id === focusDriverId) {
        focusPoint = { x, y };
      }
    });
    if (leaderPoint) {
      mm.strokeStyle = '#facc15';
      mm.lineWidth = 2;
      mm.beginPath();
      mm.arc(leaderPoint.x, leaderPoint.y, 6, 0, Math.PI * 2);
      mm.stroke();
    }
    if (focusPoint && (!leaderId || focusDriverId !== leaderId)) {
      mm.strokeStyle = '#38bdf8';
      mm.lineWidth = 1.5;
      mm.beginPath();
      mm.arc(focusPoint.x, focusPoint.y, 7.5, 0, Math.PI * 2);
      mm.stroke();
    }
  }

  function drawScene(orderOverride = null, carList = cars) {
    const list = Array.isArray(carList) ? carList : Array.from(carList);
    drawTrack();
    drawCars(list);
    drawMiniMap(list);
    const order = Array.isArray(orderOverride) && orderOverride.length ? orderOverride : list.slice().sort(sortByRacePosition);
    const text = order.slice(0, 3).map((car, idx) => `${idx + 1}. #${car.racingNumber} ${car.driver}`).join('   ');
    if (text) {
      top3Banner.textContent = text;
      top3Banner.classList.remove('hidden');
    } else {
      top3Banner.textContent = '';
      top3Banner.classList.add('hidden');
    }
    updateLeaderboardHud(order);
  }

  function updateLeaderboardHud(order) {
    if (!leaderboardHud || !leaderboardList) return;
    if (!Array.isArray(order) || order.length === 0) {
      leaderboardHud.classList.add('hidden');
      leaderboardList.innerHTML = '';
      leaderboardGapHistory.clear();
      return;
    }
    const leader = order[0];
    if (!leader) {
      leaderboardHud.classList.add('hidden');
      leaderboardList.innerHTML = '';
      leaderboardGapHistory.clear();
      return;
    }
    const frag = document.createDocumentFragment();
    const limit = Math.min(order.length, 6);
    const nextGapHistory = new Map();
    for (let i = 0; i < limit; i++) {
      const car = order[i];
      if (!car) continue;
      const li = document.createElement('li');
      if (i === 0) li.classList.add('leader');
      if (i > 0) {
        const duelGap = Math.abs(computeTimeGap(order[i - 1], car));
        if (duelGap < 0.45) {
          li.classList.add('charge');
        }
      }
      const rawGap = leader === car ? 0 : Math.abs(computeTimeGap(leader, car));
      const gapText = i === 0 ? 'Leader' : `+${formatGap(rawGap)}s`;
      const prevGap = leaderboardGapHistory.get(car.id);
      let trendText = '';
      let trendClass = '';
      if (prevGap != null) {
        const delta = prevGap - rawGap;
        if (Math.abs(delta) >= 0.03) {
          const closing = delta > 0;
          trendClass = closing ? 'gain' : 'loss';
          trendText = `${closing ? '▼' : '▲'}${formatGap(Math.abs(delta))}s`;
          li.classList.add(closing ? 'gain' : 'loss');
        }
      }
      const trendHtml = trendText ? `<span class="trend ${trendClass}">${trendText}</span>` : '';
      li.innerHTML = `
        <span class="pos">${i + 1}</span>
        <span class="driver"><strong style="color:${car.color}">#${car.racingNumber}</strong> ${car.driver}</span>
        <span class="gap">${gapText}</span>
        ${trendHtml}
      `;
      const info = document.createElement('span');
      info.className = 'team';
      const lapText = formatTime(car.lastLapTime);
      if (i === 0 && lapText !== '--') {
        info.textContent = `${car.team} • LL ${lapText}`;
      } else {
        info.textContent = car.team;
      }
      li.appendChild(info);
      frag.appendChild(li);
      nextGapHistory.set(car.id, rawGap);
    }
    leaderboardList.innerHTML = '';
    leaderboardList.appendChild(frag);
    leaderboardHud.classList.remove('hidden');
    leaderboardGapHistory.clear();
    nextGapHistory.forEach((value, key) => {
      leaderboardGapHistory.set(key, value);
    });
  }

  function sortByRacePosition(a, b) {
    if (a.finished && b.finished) {
      return a.finishTime - b.finishTime;
    }
    if (a.finished) return -1;
    if (b.finished) return 1;
    if (b.lap !== a.lap) return b.lap - a.lap;
    return b.progress - a.progress;
  }

  function createField() {
    cars.length = 0;
    nextId = 1;
    focusDriverId = null;
    const entries = getGridEntries();
    const diff = difficultyModifiers[aiLevel] || difficultyModifiers.normal;
    entries.forEach(entry => {
      const template = teamTemplates[entry.team] || { base: { engine: 0.66, aero: 0.6, systems: 0.62 }, archetype: 'balanced' };
      const teamData = managerState.teams[entry.team] || { upgrades: { engine: 0, aero: 0, systems: 0 }, form: 0 };
      const upgrades = teamData.upgrades || { engine: 0, aero: 0, systems: 0 };
      const base = template.base || { engine: 0.66, aero: 0.6, systems: 0.62 };
      const chassis = getTeamVariant(entry.team);
      const driverInfo = entry.driverInfo;
      const morale = clamp((entry.contract?.morale ?? 0.55), 0.1, 0.95);
      const upgradeBoost = {
        engine: upgrades.engine * 0.06,
        aero: upgrades.aero * 0.05,
        systems: upgrades.systems * 0.05
      };
      const formBoost = teamData.form || 0;
      const profile = vehicleArchetypes[template.archetype] || vehicleArchetypes.balanced;
      const straightInfluence = activeTrackTraits.straightBias || 1;
      const cornerInfluence = activeTrackTraits.cornerFocus || 1;
      const gripInfluence = activeTrackTraits.surfaceGrip || 1;
      const dragBoost = 1 + ((chassis.drag || 1) - 1) * 0.6;
      const handlingBoost = 1 + ((chassis.handling || 1) - 1) * 0.75;
      const stabilityBoost = 1 + ((chassis.stability || 1) - 1) * 0.7;
      const engineRating = (base.engine + upgradeBoost.engine) * profile.straight * (chassis.engine || 1) * (chassis.boost || 1);
      const aeroRating = (base.aero + upgradeBoost.aero) * profile.corner * (chassis.aero || 1) * handlingBoost;
      const systemRating = (base.systems + upgradeBoost.systems) * profile.systems * (chassis.systems || 1) * stabilityBoost;
      const baseSpeed = 11.2 +
        driverInfo.pace * 3.6 * profile.straight * (chassis.boost || 1) +
        engineRating * 2.1 * straightInfluence * dragBoost +
        aeroRating * 1.6 * cornerInfluence +
        diff.speed +
        (morale - 0.5) * 0.9 +
        formBoost * 0.45 +
        (Math.random() - 0.5) * 0.45;
      let risk = driverInfo.risk * (1 + (activeTrackTraits.turbulence - 1) * 0.6);
      risk = risk / stabilityBoost - upgradeBoost.systems * 0.25;
      risk = clamp(risk, 0.06, 0.95);
      const intel = clamp(driverInfo.intel * handlingBoost + aeroRating * 0.14 + (gripInfluence - 1) * 0.08, 0.45, 0.99);
      const consist = clamp(
        driverInfo.consist * stabilityBoost + systemRating * 0.18 + diff.consistency + (1 - profile.wear) * 0.08 + (gripInfluence - 1) * 0.08,
        0.35,
        0.99
      );

      const car = new Car(entry.team, entry.driver, entry.number, baseSpeed, risk, intel, consist, {
        profile,
        morale,
        upgrades: upgradeBoost,
        teamForm: formBoost,
        trackTraits: activeTrackTraits,
        contract: entry.contract,
        driverInfo,
        chassis
      });
      car.projectedPace = computeProjectedPace(car);
      cars.push(car);
      if (entry.team === focusTeam && !focusDriverId) {
        focusDriverId = car.id;
      }
    });
  }

  function applyGridPositions(mode) {
    const order = cars.slice();
    order.sort(() => Math.random() - 0.5);
    const rowGap = 18;
    const colGap = 30;
    const baseX = -46;
    const baseY = -10;
    order.forEach((car, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      let offX = baseX + col * colGap;
      let offY = baseY + row * rowGap;
      if (mode === 'staggered' && row % 2 === 1) {
        offX += colGap * 0.5;
      }
      if (mode === 'rolling') {
        offY += row * 2;
        car.progress = Math.max(0, car.progress - 0.01 * row);
      }
      car.gridOffset = { x: offX, y: offY };
    });
  }

  function detectRaceEvents(previous, current) {
    if (!raceActive) return;
    if (!Array.isArray(previous) || previous.length === 0) return;
    if (!Array.isArray(current) || current.length === 0) return;
    if (racePhase !== 'GREEN' && racePhase !== 'RESTART') return;
    if (isRestartHoldActive()) return;
    const prevInfo = new Map();
    previous.forEach((car, idx) => {
      if (!car) return;
      prevInfo.set(car.id, {
        idx,
        lap: Number.isFinite(car.lap) ? car.lap : 0,
        finished: !!car.finished
      });
    });
    if (prevInfo.size === 0) return;
    const newPositions = new Map();
    current.forEach((car, idx) => {
      if (!car) return;
      newPositions.set(car.id, idx);
    });
    current.forEach((car, idx) => {
      if (!car) return;
      const info = prevInfo.get(car.id);
      if (!info) return;
      if (info.finished || car.finished) return;
      if ((Number.isFinite(car.lap) ? car.lap : 0) < info.lap) return;
      if (info.idx > idx) {
        const gained = info.idx - idx;
        let target = null;
        for (let check = info.idx - 1; check >= 0; check--) {
          const candidate = previous[check];
          if (!candidate || candidate.id === car.id) continue;
          if (candidate.finished) continue;
          const newPos = newPositions.get(candidate.id);
          if (newPos == null) continue;
          if (newPos > idx) {
            target = candidate;
            break;
          }
        }
        let detail = `+${gained} Position${gained > 1 ? 'en' : ''}`;
        if (target) {
          detail = `Vorbei an #${target.racingNumber} ${target.driver} · ${detail}`;
        }
        const stamp = formatTickerStamp();
        const secondary = stamp && stamp !== '--:--' ? `${stamp} · ${detail}` : detail;
        queueEventBanner(`Überholung • #${car.racingNumber} ${car.driver}`, secondary, 'pass');
      }
    });
  }

  function updateTelemetry(order) {
    if (!telemetryList) return;
    telemetryList.innerHTML = '';
    if (!Array.isArray(order) || order.length === 0) {
      lapInfoLabel.textContent = `Runde: 1 / ${totalLaps}`;
      raceTimeLabel.textContent = `Rennzeit: ${getEffectiveRaceTime().toFixed(1)} s`;
      updateLeaderGap(order || []);
      updateFocusPanel(order || []);
      updateCameraHud(order || []);
      return;
    }
    if (Array.isArray(lastTelemetryOrder) && lastTelemetryOrder.length > 0) {
      detectRaceEvents(lastTelemetryOrder, order);
    }
    applyCameraLogic(order);
    const leader = order[0];
    order.forEach((car, idx) => {
      const li = document.createElement('li');
      li.dataset.carId = String(car.id);
      if (car.id === focusDriverId) {
        li.classList.add('focus');
      }
      const gap = idx === 0 ? 'Leader' : `+${formatGap(Math.abs(computeTimeGap(leader, car)))}s`;
      const lastLap = formatTime(car.lastLapTime);
      const bestLap = formatTime(car.bestLapTime);
      let badge = '';
      let badgeClass = '';
      if (car.systemIntegrity < 0.5) {
        badge = 'SYS';
        badgeClass = 'hot';
      } else if (car.tireWear > 0.6) {
        badge = 'TYR';
        badgeClass = 'hot';
      } else if (car.currentSpeed > 0 && car.systemIntegrity > 0.85 && car.tireWear < 0.35) {
        badge = 'OPT';
        badgeClass = 'cool';
      }
      const badgeHtml = badge ? ` <span class=\"statusBadge ${badgeClass}\">${badge}</span>` : '';
      const chassisLabel = car.chassisLabel || 'Spec';
      const variantSummary = car.chassis?.summary ? ` • ${car.chassis.summary}` : '';
      li.innerHTML = `
        <span class=\"pos\">${idx + 1}.</span>
        <span class=\"driver\"><strong style=\"color:${car.color}\">#${car.racingNumber}</strong> ${car.driver}</span>
        <span class=\"lap\">Lap ${Math.min(car.lap, totalLaps)} • ${car.team}</span>
        <span class=\"lapTimes\">LL ${lastLap} | BL ${bestLap}${badgeHtml}</span>
        <span class=\"chassis\">${chassisLabel}${variantSummary}</span>
        <span class=\"gap\">${gap}</span>
      `;
      telemetryList.appendChild(li);
    });
    lapInfoLabel.textContent = `Runde: ${Math.min(leader.lap, totalLaps)} / ${totalLaps}`;
    raceTimeLabel.textContent = `Rennzeit: ${getEffectiveRaceTime().toFixed(1)} s`;
    updateLeaderGap(order);
    lastTelemetryOrder = order.slice();
    updateFocusPanel(order);
    updateCameraHud(order);
  }

  function updateLeaderGap(order) {
    if (!leaderGapHud) return;
    const hideHud = () => {
      leaderGapHud.classList.add('hidden');
      leaderGapHud.classList.remove('positive', 'negative', 'leader', 'tight');
      if (leaderGapDelta) leaderGapDelta.textContent = '--';
      if (leaderGapLabel) leaderGapLabel.textContent = 'Focus';
      if (leaderGapFill) leaderGapFill.style.width = '0%';
    };
    if (!focusDriverId) {
      hideHud();
      return;
    }
    if (!Array.isArray(order) || order.length === 0) {
      hideHud();
      return;
    }
    const focusCar = order.find(car => car.id === focusDriverId);
    if (!focusCar) {
      hideHud();
      return;
    }
    const position = order.indexOf(focusCar);
    if (position === -1) {
      hideHud();
      return;
    }
    const leader = order[0];
    leaderGapHud.classList.remove('hidden', 'positive', 'negative', 'leader', 'tight');
    const placeText = position === 0 ? 'Leader' : `P${position + 1}`;
    if (leaderGapLabel) {
      leaderGapLabel.textContent = `Focus ${placeText}`;
    }
    if (!leader || leader.id === focusCar.id) {
      if (leaderGapDelta) leaderGapDelta.textContent = 'Im Lead';
      leaderGapHud.classList.add('leader');
      if (leaderGapFill) leaderGapFill.style.width = '100%';
      return;
    }
    const gap = computeTimeGap(leader, focusCar);
    const absGap = Math.abs(gap);
    const cls = gap >= 0 ? 'positive' : 'negative';
    leaderGapHud.classList.add(cls);
    if (leaderGapDelta) {
      const gapText = formatGap(absGap);
      leaderGapDelta.textContent = `${gap >= 0 ? '+' : '-'}${gapText}s zum Leader`;
    }
    if (leaderGapFill) {
      const capped = Math.min(absGap, 8);
      leaderGapFill.style.width = `${Math.round((capped / 8) * 100)}%`;
    }
    if (absGap <= 0.35) {
      leaderGapHud.classList.add('tight');
    }
  }
  function getCameraModeLabel(mode) {
    switch (mode) {
      case 'leader':
        return 'Leader Cam';
      case 'battle':
        return 'Battle Pack';
      case 'manual':
        return 'Manual Focus';
      default:
        return 'Broadcast Auto';
    }
  }

  function applyCameraLogic(order) {
    if (!Array.isArray(order) || order.length === 0) return;
    const mode = uiSettings.cameraMode || 'auto';
    const focusExists = focusDriverId && order.some(car => car.id === focusDriverId);
    if (mode === 'manual') {
      if (!focusExists) {
        focusDriverId = order[0].id;
      }
      return;
    }
    if (mode === 'leader') {
      focusDriverId = order[0].id;
      return;
    }
    if (mode === 'battle') {
      let candidate = order[0];
      let smallestGap = Infinity;
      for (let i = 1; i < order.length; i++) {
        const gap = Math.abs(computeTimeGap(order[i - 1], order[i]));
        if (gap < smallestGap) {
          smallestGap = gap;
          candidate = order[i];
        }
      }
      focusDriverId = candidate?.id ?? order[0].id;
      return;
    }
    let autoCandidate = null;
    let tightestGap = Infinity;
    const scanLength = Math.min(order.length, 8);
    for (let i = 1; i < scanLength; i++) {
      const gap = Math.abs(computeTimeGap(order[i - 1], order[i]));
      if (gap < 1.2 && gap < tightestGap) {
        tightestGap = gap;
        autoCandidate = order[i];
      }
    }
    const chosen = autoCandidate || order[0];
    focusDriverId = chosen?.id ?? order[0].id;
  }

  function updateCameraHud(order) {
    if (!cameraHud) return;
    if (!Array.isArray(order) || order.length === 0) {
      cameraHud.classList.add('hidden');
      cameraHud.innerHTML = '';
      return;
    }
    const mode = uiSettings.cameraMode || 'auto';
    const label = getCameraModeLabel(mode);
    let targetText = '--';
    if (focusDriverId) {
      const car = order.find(item => item.id === focusDriverId);
      if (car) {
        const pos = order.indexOf(car) + 1;
        targetText = `P${pos} #${car.racingNumber} ${car.driver}`;
      }
    }
    cameraHud.innerHTML = `<span class="mode">${label}</span><span class="target">${targetText}</span>`;
    if (raceActive || racePhase === 'COUNTDOWN') {
      cameraHud.classList.remove('hidden');
    } else {
      cameraHud.classList.add('hidden');
    }
  }

  function updateFocusPanel(order) {
    if (!focusDriverPanel || !focusDriverName || !focusDriverMeta || !focusDriverStats || !focusDriverTrend) {
      return;
    }
    if (!focusDriverId || !Array.isArray(order) || order.length === 0) {
      focusDriverPanel.classList.add('inactive');
      focusDriverName.textContent = 'Fahrer auswählen';
      focusDriverMeta.textContent = 'Wähle einen Fahrer aus der Übersicht, um Detaildaten zu sehen.';
      focusDriverStats.innerHTML = '';
      focusDriverTrend.textContent = '--';
      focusDriverTrend.className = 'trend neutral';
      return;
    }
    const car = order.find(item => item.id === focusDriverId);
    if (!car) {
      focusDriverPanel.classList.add('inactive');
      focusDriverName.textContent = 'Fahrer auswählen';
      focusDriverMeta.textContent = 'Wähle einen Fahrer aus der Übersicht, um Detaildaten zu sehen.';
      focusDriverStats.innerHTML = '';
      focusDriverTrend.textContent = '--';
      focusDriverTrend.className = 'trend neutral';
      return;
    }
    focusDriverPanel.classList.remove('inactive');
    focusDriverName.textContent = `#${car.racingNumber} ${car.driver}`;
    const position = order.indexOf(car) + 1;
    const leader = order[0];
    const gap = position === 1 ? 'Leader' : `+${formatGap(Math.abs(computeTimeGap(leader, car)))}s`;
    const profileLabel = car.profile?.label || 'Balanced';
    const morale = clamp(car.contract?.morale ?? car.morale ?? 0.5, 0, 1);
    const moralePct = Math.round(morale * 100);
    const systemPct = Math.round(clamp(car.systemIntegrity, 0, 1.1) * 100);
    const wearPct = Math.round(clamp(car.tireWear, 0, 1) * 100);
    const topSpeed = Math.round(car.peakSpeed || 0);
    const lastLap = formatTime(car.lastLapTime);
    const bestLap = formatTime(car.bestLapTime);
    const formValue = car.form ? `${car.form >= 0 ? '+' : ''}${car.form.toFixed(2)}` : '0.00';
    const chassisLabel = car.chassisLabel || 'Spec';
    focusDriverMeta.textContent = `${car.team} • P${position} (${gap}) • ${profileLabel} • ${chassisLabel}`;
    let trendClass = 'neutral';
    let trendText = 'Stabil';
    if (moralePct >= 70) {
      trendClass = 'good';
      trendText = 'Aufwind';
    } else if (moralePct <= 40) {
      trendClass = 'bad';
      trendText = 'Druck';
    }
    focusDriverTrend.textContent = `${trendText} (${moralePct}%)`;
    focusDriverTrend.className = `trend ${trendClass}`;
    focusDriverStats.innerHTML = `
      <div class="row"><span class="label">Letzte Runde</span><span class="value">${lastLap}</span></div>
      <div class="row"><span class="label">Beste Runde</span><span class="value">${bestLap}</span></div>
      <div class="row"><span class="label">Top Speed</span><span class="value">${topSpeed} km/h</span></div>
      <div class="row"><span class="label">Systeme</span><span class="value">${systemPct}%</span></div>
      <div class="row"><span class="label">Reifen</span><span class="value">${wearPct}%</span></div>
      <div class="row"><span class="label">Form</span><span class="value">${formValue}</span></div>
    `;
  }


  function formatPhaseLabel(phase) {
    switch (phase) {
      case 'GREEN':
        return 'Green';
      case 'YELLOW':
        return 'Yellow';
      case 'SAFETY':
        return 'Safety';
      case 'RESTART':
        return 'Restart';
      case 'COUNTDOWN':
        return 'Countdown';
      case 'FORMATION':
        return 'Formation';
      default:
        return phase;
    }
  }

  function summarizePhaseTimeline() {
    if (!phaseTimeline.length) return '';
    const segments = phaseTimeline
      .filter(entry => entry && entry.phase && entry.phase !== 'IDLE' && entry.phase !== 'FINISHED')
      .map(entry => {
        const end = entry.end ?? raceTime;
        const duration = Math.max(0, end - entry.start);
        const label = formatPhaseLabel(entry.phase);
        const note = entry.meta?.source ? ` (${entry.meta.source})` : '';
        return `${label}${note}: ${duration.toFixed(1)}s`;
      });
    return segments.join(' | ');
  }

  function formatResults(order) {
    if (!order.length) return '';
    const winner = order[0];
    let text = 'Ergebnis:\n';
    order.forEach((car, idx) => {
      let line = `${idx + 1}. #${car.racingNumber} ${car.driver} (${car.team}) `;
      if (idx === 0) {
        line += 'Sieger';
      } else if (car.finishTime != null && winner.finishTime != null) {
        line += `+${formatGap(car.finishTime - winner.finishTime)}s`;
      } else {
        line += 'DNF';
      }
      text += `${line}\n`;
    });
    const fastest = lapRecords.fastestLap;
    if (fastest.driver) {
      text += `\nSchnellste Runde: #${fastest.number} ${fastest.driver} ${formatTime(fastest.time)}\n`;
    }
    const sectorSummary = lapRecords.bestSectors.map((rec, idx) => {
      if (!rec.driver) return `S${idx + 1}: --`;
      return `S${idx + 1}: #${rec.number} ${rec.driver} ${formatSplit(rec.time)}`;
    }).join(' | ');
    if (sectorSummary) {
      text += `Sektor-Rekorde: ${sectorSummary}\n`;
    }
    const pitCount = cars.filter(car => car.pitted).length;
    const incidentCount = raceControlEvents.filter(entry => entry.level === 'warn' || entry.level === 'alert').length;
    text += `Boxenstopps: ${pitCount} | Formation: ${phaseStats.formation} | Gelb: ${phaseStats.yellow} | Safety: ${phaseStats.safety} | Restarts: ${phaseStats.restart}\n`;
    const phaseSummary = summarizePhaseTimeline();
    if (phaseSummary) {
      text += `Phasen: ${phaseSummary}\n`;
    }
    text += `Race-Control Warnungen: ${incidentCount}`;
    return text;
  }

  function recordRaceHistory(order) {
    if (!Array.isArray(order) || order.length === 0) return;
    const track = trackCatalog[currentTrackType] || { label: currentTrackType };
    const weatherProfile = getWeatherProfile();
    const winner = order[0];
    const winnerTime = winner?.finishTime ?? 0;
    const entry = {
      id: Date.now(),
      timestamp: Date.now(),
      mode: currentMode,
      trackId: currentTrackType,
      trackLabel: track.label || currentTrackType,
      weatherLabel: weatherProfile.label,
      laps: totalLaps,
      podium: order.slice(0, 3).map((car, idx) => ({
        driver: car.driver,
        team: car.team,
        number: car.racingNumber,
        gap: idx === 0 ? 0 : (car.finishTime != null && winner.finishTime != null ? car.finishTime - winnerTime : null)
      })),
      fastestLap: lapRecords.fastestLap?.driver ? {
        driver: lapRecords.fastestLap.driver,
        team: lapRecords.fastestLap.team,
        number: lapRecords.fastestLap.number,
        time: lapRecords.fastestLap.time
      } : null
    };
    const violationLogs = raceControlEvents
      .filter(item => item.level === 'warn' || item.level === 'alert')
      .map(item => ({ stamp: item.stamp, message: item.message, level: item.level }))
      .slice(0, 8);
    const pitSummary = racePitLog.slice(0, 8).map(item => ({
      driver: item.driver,
      team: item.team,
      number: item.number,
      lap: item.lap,
      stop: item.stop,
      detail: item.detail,
      time: item.time
    }));
    const cautionSummary = cautionLapHistory
      .filter(item => item && item.laps > 0)
      .map(item => ({ phase: item.phase, laps: item.laps, startedAt: item.startedAt }));
    if (violationLogs.length) entry.violations = violationLogs;
    if (pitSummary.length) entry.pitStops = pitSummary;
    if (cautionSummary.length) entry.cautionLaps = cautionSummary;
    raceChronicle.events.unshift(entry);
    if (raceChronicle.events.length > MAX_ARCHIVE_ENTRIES) {
      raceChronicle.events.length = MAX_ARCHIVE_ENTRIES;
    }
    persistRaceChronicle();
    if (codexScreen?.classList.contains('active')) {
      renderCodex();
    }
  }

  function applyManagerRewards(order) {
    const prizeTable = [550000, 420000, 320000, 260000, 210000, 170000, 130000, 110000, 90000, 70000];
    order.forEach((car, idx) => {
      const teamData = managerState.teams[car.team];
      if (!teamData) return;
      const prize = prizeTable[idx] || 50000;
      teamData.budget += prize;
      teamData.form = clamp((teamData.form || 0) + (0.04 - idx * 0.003), -0.25, 0.45);
      const contract = teamData.roster.find(r => r.driver === car.driver);
      if (contract) {
        contract.morale = clamp((contract.morale || 0.5) + (0.05 - idx * 0.004), 0.1, 0.95);
      }
    });
    persistManagerState();
    if (managerScreen?.classList.contains('active')) {
      updateManagerView();
    }
  }

  function settleBet(order) {
    if (!bettingState.activeBet) return;
    const bet = bettingState.activeBet;
    const winner = order[0];
    const historyEntry = {
      driver: bet.driver,
      amount: bet.amount,
      odds: bet.odds,
      placedAt: bet.placedAt,
      track: bet.track || currentTrackType,
      success: false
    };
    if (winner && winner.driver === bet.driver) {
      const payout = Math.round(bet.amount * bet.odds);
      bettingState.balance += payout;
      historyEntry.success = true;
      historyEntry.payout = payout;
      pushTicker(`Wette gewonnen! ${bet.driver} zahlt ${payout.toLocaleString('de-DE')} Cr`, 'fl');
    } else {
      historyEntry.loss = bet.amount;
      pushTicker(`Wette verloren – ${bet.driver} nicht auf P1`, 'yellow');
    }
    bettingState.history.unshift(historyEntry);
    if (bettingState.history.length > 12) bettingState.history.pop();
    bettingState.activeBet = null;
    persistBettingState();
    updateBettingUI();
  }

  function startRace() {
    hidePodiumOverlay(true);
    clearReplayData();
    recordingReplay = true;
    warmupAudio();
    replaySpeed = parseFloat(replaySpeedSelect?.value || '1') || 1;
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    if (gridIntroInterval) {
      clearInterval(gridIntroInterval);
      gridIntroInterval = null;
    }
    countdownRunning = false;
    hideGridIntro();
    cancelBroadcastIntro();
    raceActive = false;
    isPaused = false;
    raceTime = 0;
    raceClockOffset = 0;
    raceClockArmed = false;
    formationActive = false;
    focusDriverId = null;
    lastFrame = performance.now();
    phaseTimeline.length = 0;
    flowAudit.length = 0;
    lapRecords.fastestLap = { time: Infinity, driver: null, team: null, number: null };
    lapRecords.bestSectors = [
      { time: Infinity, driver: null, team: null, number: null },
      { time: Infinity, driver: null, team: null, number: null },
      { time: Infinity, driver: null, team: null, number: null }
    ];
    sectorFeed.length = 0;
    updateSectorWidget();
    updateFastestLapLabel();
    leaderGapHud?.classList.add('hidden');
    if (leaderGapFill) leaderGapFill.style.width = '0%';
    if (leaderGapHud) leaderGapHud.classList.remove('leader', 'positive', 'negative', 'tight');
    resetHighlightTicker();
    resetBattleSpotlight();
    resetLiveTicker();
    racePitLog.length = 0;
    resetCautionHistory();
    replayBookmarks.length = 0;
    updateReplayBookmarksUI();
    setTimingModalOpen(false);
    updateLeaderboardHud([]);
    resultsLabel.textContent = '';
    replayRaceBtn.style.display = 'none';
    if (nextRaceBtn) nextRaceBtn.style.display = 'none';
    setStartButtonState(false);
    setPauseButtonState(false, 'Pause');
    resetMarshalOverlay();
    resetEventBanner();
    racePhaseMeta = {};
    resetRaceControlLog();
    const track = trackCatalog[currentTrackType] || trackCatalog.oval;
    const weatherProfile = getWeatherProfile();
    logRaceControl(`${track.label} • ${weatherProfile.label} (${totalLaps} Runden)`, 'info');
    if (weatherProfile.description) {
      logRaceControl(weatherProfile.description, 'info');
    }
    pushTicker(`${track.label} · ${weatherProfile.label} · ${totalLaps} Runden`, 'info');
    phaseStats.yellow = 0;
    phaseStats.safety = 0;
    phaseStats.restart = 0;
    phaseStats.formation = 0;
    leaderboardGapHistory.clear();
    startProcedureMode = startProc?.value || startProcedureMode || 'standing';
    auditRaceFlow('start', { mode: currentMode, track: currentTrackType, laps: totalLaps });
    createField();
    prepareReplayMeta();
    applyGridPositions(startProcedureMode);
    rebuildMini();
    setRacePhase('COUNTDOWN');
    top3Banner.classList.remove('hidden');
    top3Banner.textContent = '';
    logRaceControl('Grid formiert – Countdown gestartet', 'info');
    lastTelemetryOrder = cars.slice().sort(sortByRacePosition);
    captureReplayFrame(lastTelemetryOrder, 0.016, 'COUNTDOWN');
    updateFocusPanel(lastTelemetryOrder);
    showBroadcastIntro(cars, track, weatherProfile, () => showGridIntro(cars));
  }

  function pauseToggle() {
    if (!raceActive && !isPaused) return;
    if (!isPaused) {
      isPaused = true;
      raceActive = false;
      setPauseButtonState(true, 'Fortsetzen');
      sessionInfo.textContent = 'Pause';
      sessionInfo.classList.remove('hidden');
      logRaceControl('Rennen pausiert', 'info');
      auditRaceFlow('pause', { paused: true });
    } else {
      isPaused = false;
      raceActive = true;
      setPauseButtonState(true, 'Pause');
      sessionInfo.classList.add('hidden');
      logRaceControl('Rennen fortgesetzt', 'info');
      auditRaceFlow('pause', { paused: false });
      requestAnimationFrame(time => {
        lastFrame = time;
        requestAnimationFrame(gameLoop);
      });
    }
  }

  function gameLoop(timestamp) {
    if (!raceActive) return;
    const dt = Math.max(0.016, Math.min(0.05, (timestamp - lastFrame) / 1000));
    lastFrame = timestamp;
    raceTime += dt;

    tickPhase();

    const snapshotOrder = cars.slice().sort(sortByRacePosition);
    updateCautionBunchingTargets(snapshotOrder);
    cautionOrderMap.clear();
    for (let i = 1; i < snapshotOrder.length; i++) {
      const car = snapshotOrder[i];
      const ahead = snapshotOrder[i - 1];
      if (car && ahead) {
        cautionOrderMap.set(car.id, ahead);
      }
    }
    const leader = snapshotOrder.find(car => !car.finished) || snapshotOrder[0] || null;
    cars.forEach(car => car.update(dt, leader));
    trackCautionLaps(leader);

    const orderAfter = cars.slice().sort(sortByRacePosition);
    drawScene(orderAfter);
    updateTelemetry(orderAfter);
    if (timingModalOpen) {
      renderTimingModal(orderAfter);
    }
    enforceCautionOrder(orderAfter);
    handleRestartRelease();
    updateRestartHoldHud();
    updateSessionInfo();
    updateBattleSpotlight(orderAfter, dt);
    captureReplayFrame(orderAfter, dt);

    if (cars.every(car => car.finished)) {
      finishRace();
    } else {
      requestAnimationFrame(gameLoop);
    }
  }

  function finishRace() {
    countdownRunning = false;
    hideGridIntro();
    raceActive = false;
    isPaused = false;
    formationActive = false;
    setRacePhase('FINISHED');
    playRaceCue('finish');
    finalizePhaseTimeline(raceTime);
    updateFlag();
    updateSessionInfo();
    resetRaceControls();
    clearCautionSnapshot();
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    const order = cars.slice().sort(sortByRacePosition);
    if (recordingReplay) {
      captureReplayFrame(order, 0.033, 'FINISHED');
      recordingReplay = false;
    }
    replayTotalDuration = replayBuffer.length ? replayBuffer[replayBuffer.length - 1].time : raceTime;
    replayCursor = replayBuffer.length ? replayBuffer.length - 1 : 0;
    replayAppliedIndex = -1;
    updateReplayUi();
    recordRaceHistory(order);
    resultsLabel.textContent = formatResults(order);
    replayRaceBtn.style.display = 'inline-block';
    replayRaceBtn.textContent = 'Replay ansehen';
    if (currentMode === 'gp' && gpActive) {
      gpAccumulate(order);
      gpRaceIndex += 1;
      if (gpRaceIndex < GP_RACES) {
        prepareGrandPrixRound();
      }
      gpSave();
      let text = resultsLabel.textContent;
      text += gpStandingsText();
      if (gpRaceIndex < GP_RACES) {
        const nextRaceNumber = Math.min(GP_RACES, gpRaceIndex + 1);
        nextRaceBtn.style.display = 'inline-block';
        setStartButtonState(true, `Rennen ${nextRaceNumber} starten`);
      } else {
        gpActive = false;
        text += '\nGP abgeschlossen.';
        gpSave();
        setStartButtonState(true, 'Rennen starten');
      }
      resultsLabel.textContent = text;
      updateGrandPrixMenuState();
    }
    if (currentMode === 'manager') {
      applyManagerRewards(order);
    }
    if (currentMode === 'betting') {
      settleBet(order);
    }
    leaderGapHud?.classList.add('hidden');
    updateCameraHud([]);
    lastTelemetryOrder = order;
    updateFocusPanel(order);
    updateLeaderboardHud(order);
    showPodium(order);
    logRaceControl('Rennen beendet – Ergebnisse verfügbar', 'success');
    auditRaceFlow('finish', {
      winner: order[0]?.driver || null,
      duration: Number(raceTime.toFixed(2)),
      mode: currentMode
    });
  }

  function gpReset() {
    gpActive = true;
    gpRaceIndex = 0;
    gpTable.clear();
    gpSave();
    updateGrandPrixMenuState();
    prepareGrandPrixRound();
  }

  function gpAccumulate(order) {
    order.forEach((car, idx) => {
      if (!gpTable.has(car.driver)) {
        gpTable.set(car.driver, { points: 0, team: car.team, driver: car.driver, number: car.racingNumber });
      }
      const pts = GP_POINTS[idx] || 0;
      gpTable.get(car.driver).points += pts;
    });
  }

  function gpStandingsText() {
    const arr = Array.from(gpTable.values()).sort((a, b) => b.points - a.points);
    let text = `\nGP Zwischenstand nach Rennen ${gpRaceIndex}/${GP_RACES}:\n`;
    arr.slice(0, 10).forEach((entry, idx) => {
      text += `${idx + 1}. #${entry.number} ${entry.driver} (${entry.team}) – ${entry.points} P\n`;
    });
    return text;
  }

  function gpSave() {
    try {
      const data = Array.from(gpTable.entries());
      localStorage.setItem(STORAGE_KEYS.gp, JSON.stringify({ gpRaceIndex, data }));
    } catch (err) {
      console.warn('gp save failed', err);
    }
  }

  (function gpLoad() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.gp);
      if (!raw) return;
      const obj = JSON.parse(raw);
      gpRaceIndex = obj.gpRaceIndex || 0;
      gpTable.clear();
      (obj.data || []).forEach(([key, value]) => gpTable.set(key, value));
      gpActive = gpRaceIndex > 0 && gpRaceIndex < GP_RACES;
      updateGrandPrixMenuState();
    } catch (err) {
      console.warn('gp load failed', err);
    }
  })();

  function getManagerTrackForWeek(week = managerState.week || 1) {
    const normalizedWeek = Math.max(1, Math.floor(week));
    const index = (normalizedWeek - 1) % MANAGER_SEASON_LENGTH;
    return managerCalendar[index] || 'oval';
  }

  function renderTeams() {
    if (!teamsList) return;
    teamsList.innerHTML = '';
    Object.entries(managerState.teams).forEach(([team, data]) => {
      const card = document.createElement('div');
      card.style.border = '1px solid #1e293b';
      card.style.borderRadius = '10px';
      card.style.padding = '8px';
      card.style.margin = '6px 0';
      const drivers = (data.roster || []).map(r => r.driver).join(', ');
      const variant = getTeamVariant(team);
      const summary = variant.summary || 'Ausgewogen';
      card.innerHTML = `<div style=\"display:flex;justify-content:space-between;align-items:center\"><strong style=\"color:${teamColors[team] || '#38bdf8'}\">● ${team}</strong><span>${(data.budget / 1000000).toFixed(2)} Mio Cr</span></div><div>${drivers}</div><div style=\"font-size:11px;opacity:.7\">Chassis ${variant.codename} • ${summary}</div>`;
      teamsList.appendChild(card);
    });
  }

  function populateManagerTeamSelect() {
    if (!managerTeamSelect) return;
    managerTeamSelect.innerHTML = '';
    Object.keys(managerState.teams).forEach(team => {
      const opt = document.createElement('option');
      opt.value = team;
      opt.textContent = team;
      if (team === managerState.selectedTeam) opt.selected = true;
      managerTeamSelect.appendChild(opt);
    });
  }

  function showManagerNotice(message, type = 'info') {
    if (!managerNotice) return;
    managerNotice.textContent = message;
    managerNotice.classList.remove('error', 'success', 'warn');
    if (type === 'error') managerNotice.classList.add('error');
    else if (type === 'success') managerNotice.classList.add('success');
    else if (type === 'warn') managerNotice.classList.add('warn');
  }

  function formatFacilitySummary(teamData) {
    const facilities = sanitizeFacilities(teamData?.facilities);
    const chunks = Object.entries(FACILITY_TYPES).map(([key, meta]) => {
      const level = clampFacilityLevel(facilities[key]);
      const label = meta.shortLabel || meta.label;
      return `${label} L${level}`;
    });
    return chunks.join(' · ');
  }

  function formatVariantStatLine(variant) {
    if (!variant) return 'Engine 100% · Aero 100% · Systeme 100%';
    const engine = Math.round((variant.engine ?? 1) * 100);
    const aero = Math.round((variant.aero ?? 1) * 100);
    const systems = Math.round((variant.systems ?? 1) * 100);
    return `Engine ${engine}% · Aero ${aero}% · Systeme ${systems}%`;
  }

  function renderContracts(teamName, teamData) {
    if (!contractList) return;
    contractList.innerHTML = '';
    const roster = teamData.roster || [];
    roster.forEach(contract => {
      const driver = driverMap.get(contract.driver);
      const card = document.createElement('div');
      card.className = 'contractCard';
      const pace = driver ? Math.round(driver.pace * 100) : '--';
      const consist = driver ? Math.round(driver.consist * 100) : '--';
      const morale = Math.round(clamp(contract.morale || 0.5, 0, 1) * 100);
      const years = typeof contract.years === 'number' ? contract.years : 0;
      if (years < 0.6) card.classList.add('expiring');
      const durationText = `${years.toFixed(1)} Jahre`;
      card.innerHTML = `<strong>${contract.driver}</strong><span>Vertrag: ${durationText} | Gehalt ${formatCurrency(contract.salary)}</span><span>Pace ${pace} | Consistency ${consist} | Moral ${morale}%</span>`;
      const actions = document.createElement('div');
      actions.className = 'actions';
      const renewBtn = document.createElement('button');
      renewBtn.textContent = 'Verlängern (-Budget)';
      renewBtn.addEventListener('click', () => renewContract(teamName, contract.driver));
      actions.appendChild(renewBtn);
      card.appendChild(actions);
      contractList.appendChild(card);
    });
    if (roster.length < MAX_ROSTER_SIZE) {
      const hint = document.createElement('div');
      hint.className = 'contractHint';
      const remaining = MAX_ROSTER_SIZE - roster.length;
      hint.textContent = remaining === 1 ? '1 Cockpit ist frei – Transfermarkt prüfen.' : `${remaining} Cockpits sind frei – Transfermarkt prüfen.`;
      contractList.appendChild(hint);
    }
  }

  function renderUpgradeStatus(teamName, teamData) {
    if (!upgradeStatus) return;
    upgradeStatus.innerHTML = '';
    const template = teamTemplates[teamName] || { base: { engine: 0.66, aero: 0.6, systems: 0.62 } };
    const chassisVariant = getTeamVariant(teamName);
    const variantStats = {
      engine: (chassisVariant?.engine ?? 1) * 100,
      aero: (chassisVariant?.aero ?? 1) * 100,
      systems: (chassisVariant?.systems ?? 1) * 100
    };
    Object.entries(teamData.upgrades || {}).forEach(([key, level]) => {
      const div = document.createElement('div');
      div.className = 'upgradeCard';
      const baseValue = (template.base[key] || 0.6) * 100;
      const improved = baseValue + level * 4;
      const current = Number.isFinite(variantStats[key]) ? variantStats[key] : improved;
      const delta = current - baseValue;
      const deltaLabel = Number.isFinite(delta) && Math.abs(delta) >= 0.5
        ? ` (${delta >= 0 ? '+' : ''}${delta.toFixed(0)}%)`
        : '';
      div.innerHTML = `
        <strong>${UPGRADE_LABELS[key]}</strong>
        <span>Stufe ${level}/${MAX_UPGRADE_LEVEL}</span>
        <span>Basis: ${baseValue.toFixed(0)} → ${improved.toFixed(0)}</span>
        <span>Chassis aktuell: ${current.toFixed(0)}%${deltaLabel}</span>
      `;
      upgradeStatus.appendChild(div);
    });
  }

  function renderFacilities(teamName, teamData) {
    if (!facilityList) return;
    facilityList.innerHTML = '';
    const facilities = sanitizeFacilities(teamData.facilities);
    Object.entries(FACILITY_TYPES).forEach(([key, meta]) => {
      const level = clampFacilityLevel(facilities[key]);
      const card = document.createElement('div');
      card.className = 'facilityCard';
      const header = document.createElement('div');
      header.className = 'facilityHeader';
      const title = document.createElement('strong');
      title.textContent = meta.label;
      const badge = document.createElement('span');
      badge.className = 'facilityLevel';
      badge.textContent = `Stufe ${level}/${MAX_FACILITY_LEVEL}`;
      header.appendChild(title);
      header.appendChild(badge);
      const desc = document.createElement('p');
      desc.className = 'facilityDesc';
      desc.textContent = meta.description;
      card.appendChild(header);
      card.appendChild(desc);
      const controls = document.createElement('div');
      controls.className = 'facilityControls';
      if (level >= MAX_FACILITY_LEVEL) {
        const span = document.createElement('span');
        span.className = 'facilityCap';
        span.textContent = 'Maximale Stufe erreicht';
        controls.appendChild(span);
      } else {
        const nextCost = Array.isArray(meta.costs) ? meta.costs[level + 1] : null;
        const costLabel = nextCost ? formatCurrency(nextCost) : 'Upgrade';
        const btn = document.createElement('button');
        btn.textContent = `Upgrade (${costLabel})`;
        btn.addEventListener('click', () => upgradeFacility(teamName, key));
        controls.appendChild(btn);
      }
      card.appendChild(controls);
      facilityList.appendChild(card);
    });
  }

  function renderFreeAgents(teamName, teamData) {
    if (!freeAgentList) return;
    freeAgentList.innerHTML = '';
    ensureFreeAgentPool();
    const agents = managerState.freeAgents || [];
    if (!agents.length) {
      const empty = document.createElement('div');
      empty.className = 'contractHint';
      empty.textContent = 'Zurzeit keine freien Fahrer verfügbar.';
      freeAgentList.appendChild(empty);
      return;
    }
    const availableSlots = Math.max(0, MAX_ROSTER_SIZE - (teamData.roster?.length || 0));
    if (availableSlots === 0) {
      const capNotice = document.createElement('div');
      capNotice.className = 'contractHint';
      capNotice.textContent = 'Alle Cockpits belegt – Verträge managen oder Fahrer freigeben.';
      freeAgentList.appendChild(capNotice);
    }
    agents.forEach(agent => {
      const driver = driverMap.get(agent.driver);
      const card = document.createElement('div');
      card.className = 'freeAgentCard';
      const pace = driver ? Math.round(driver.pace * 100) : '--';
      const consist = driver ? Math.round(driver.consist * 100) : '--';
      const risk = driver ? Math.round(driver.risk * 100) : '--';
      const morale = Math.round(clamp(agent.morale ?? 0.5, 0, 1) * 100);
      const asking = agent.askingSalary ?? (driver ? driver.salary : 300000);
      card.innerHTML = `
        <div class="headline"><span>${agent.driver}</span><span>#${driver?.number ?? '--'}</span></div>
        <div class="meta"><span>Pace ${pace}</span><span>Risk ${risk}</span></div>
        <div class="meta"><span>Consistency ${consist}</span><span>Morale ${morale}%</span></div>
        <div class="meta"><span>Signing</span><span>${formatCurrency(asking)}</span></div>
      `;
      const action = document.createElement('button');
      action.textContent = 'Verpflichten';
      const affordable = teamData.budget >= asking;
      const slotsOpen = availableSlots > 0;
      if (!affordable || !slotsOpen) {
        action.disabled = true;
        card.classList.add('unavailable');
      }
      action.addEventListener('click', () => signFreeAgent(agent.driver));
      card.appendChild(action);
      freeAgentList.appendChild(card);
    });
  }

  function renderCodexLore() {
    if (!loreEntries) return;
    loreEntries.innerHTML = '';
    const tracks = Object.entries(trackCatalog).map(([id, track]) => ({ id, track })).sort((a, b) => {
      const la = a.track.label || a.id;
      const lb = b.track.label || b.id;
      return la.localeCompare(lb, 'de');
    });
    tracks.forEach(({ id, track }) => {
      const card = document.createElement('div');
      card.className = 'loreCard';
      const traits = track.traits || {};
      const straight = traits.straightBias ?? 1;
      const corner = traits.cornerFocus ?? 1;
      const grip = traits.surfaceGrip ?? 1;
      const wear = traits.wearRate ?? 1;
      const turbulence = traits.turbulence ?? 1;
      let focus;
      if (straight >= corner + 0.08 || straight >= 1.08) focus = 'High-Speed';
      else if (corner >= straight + 0.08 || corner >= 1.08) focus = 'Kurvenflow';
      else focus = 'Ausgewogen';
      const gripText = grip >= 1.08 ? 'Grip Hoch' : grip <= 0.94 ? 'Grip Niedrig' : 'Grip Mittel';
      const wearText = wear >= 1.12 ? 'Verschleiß Hoch' : wear <= 0.92 ? 'Verschleiß Gering' : 'Verschleiß Mittel';
      const dirtyText = turbulence >= 1.12 ? 'Dirty Air' : turbulence <= 0.95 ? 'Saubere Luft' : 'Neutral';
      card.innerHTML = `
        <strong>${track.label || id}</strong>
        <span>${track.lore || 'Keine Hintergrunddaten verfügbar.'}</span>
        <span>${focus} • ${gripText} • ${wearText} • ${dirtyText}</span>
      `;
      loreEntries.appendChild(card);
    });
  }

  function computeDriverPersona(driver) {
    const { pace, risk, intel, consist } = driver;
    let persona = 'Allrounder';
    if (pace >= 0.86 && risk >= 0.36) persona = 'Attack Pilot';
    else if (pace >= 0.85 && consist >= 0.8) persona = 'Lead Anchor';
    else if (intel >= 0.76 && consist >= 0.79) persona = 'Strategiemeister';
    else if (risk <= 0.28 && intel >= 0.72) persona = 'Präzisionsfahrer';
    else if (risk >= 0.4) persona = 'Showrunner';
    const tags = [];
    if (pace >= 0.86) tags.push('High Pace');
    else if (pace <= 0.72) tags.push('Reifenschoner');
    else tags.push('Solide Pace');
    if (risk >= 0.4) tags.push('Aggressiv');
    else if (risk <= 0.27) tags.push('Geduldig');
    if (intel >= 0.76) tags.push('Analytisch');
    else if (intel <= 0.66) tags.push('Instinkt');
    if (consist >= 0.8) tags.push('Konstant');
    else if (consist <= 0.7) tags.push('Launisch');
    return { persona, tags };
  }

  function renderDriverCodex() {
    if (!driverCodex) return;
    driverCodex.innerHTML = '';
    driverDatabase
      .slice()
      .sort((a, b) => a.number - b.number)
      .forEach(driver => {
        const { persona, tags } = computeDriverPersona(driver);
        const card = document.createElement('div');
        card.className = 'driverCard';
        const traitLine = tags.map(tag => `<span>${tag}</span>`).join('');
        const salaryText = formatCurrency(driver.salary || 0);
        card.innerHTML = `
          <header><span>#${driver.number}</span><span>${driver.name}</span></header>
          <div class="persona">${persona}</div>
          <div class="traitLine">${traitLine}</div>
          <div class="metrics">
            <span>Tempo ${(driver.pace * 100).toFixed(0)}</span>
            <span>Risiko ${(driver.risk * 100).toFixed(0)}</span>
            <span>Intelligenz ${(driver.intel * 100).toFixed(0)}</span>
            <span>Konstanz ${(driver.consist * 100).toFixed(0)}</span>
          </div>
          <footer><span>Gehalt ${salaryText}</span><span>Vertrags-ID ${driver.number}${driver.name.charCodeAt(0)}</span></footer>
        `;
        driverCodex.appendChild(card);
      });
  }

  function renderCodexGarage() {
    if (!codexGarage) return;
    codexGarage.innerHTML = '';
    Object.keys(managerState.teams).sort((a, b) => a.localeCompare(b, 'de')).forEach(team => {
      const variant = getTeamVariant(team);
      const card = document.createElement('div');
      card.className = 'garageCard';
      const stats = [
        `Engine ${(variant.engine * 100).toFixed(0)}%`,
        `Aero ${(variant.aero * 100).toFixed(0)}%`,
        `Systems ${(variant.systems * 100).toFixed(0)}%`,
        `Boost ${(variant.boost * 100).toFixed(0)}%`,
        `Stability ${(variant.stability * 100).toFixed(0)}%`
      ];
      const lore = teamLore[team] || 'Keine Teamdaten hinterlegt.';
      card.innerHTML = `
        <header><span>${team}</span><span>${variant.codename}</span></header>
        <div class="summary">${lore}</div>
        <div class="summary">Setup: ${variant.summary}</div>
        <div class="stats">${stats.map(s => `<span>${s}</span>`).join('')}</div>
      `;
      codexGarage.appendChild(card);
    });
  }

  function renderRoadmapSection(target, sections) {
    if (!target) return;
    target.innerHTML = '';
    sections.forEach(section => {
      const card = document.createElement('article');
      card.className = 'roadmapCard';
      const header = document.createElement('header');
      const title = document.createElement('strong');
      title.textContent = section.title;
      const badge = document.createElement('span');
      badge.className = `badge ${section.badge || 'progress'}`;
      badge.textContent = section.label || '';
      header.appendChild(title);
      header.appendChild(badge);
      card.appendChild(header);
      if (Array.isArray(section.steps) && section.steps.length) {
        const list = document.createElement('ul');
        section.steps.forEach(step => {
          const li = document.createElement('li');
          const span = document.createElement('span');
          const dot = document.createElement('span');
          dot.className = `dot ${step.done ? 'done' : 'pending'}`;
          span.appendChild(dot);
          span.append(step.label);
          li.appendChild(span);
          list.appendChild(li);
        });
        card.appendChild(list);
      }
      target.appendChild(card);
    });
  }

  function renderContentRoadmap() {
    renderRoadmapSection(contentRoadmapPanel, roadmapMilestones);
  }

  function renderIntegrationRoadmap() {
    renderRoadmapSection(integrationRoadmapPanel, integrationRoadmapPlan);
  }

  function renderRaceArchive() {
    if (!raceArchive) return;
    raceArchive.innerHTML = '';
    if (!raceChronicle.events.length) {
      const empty = document.createElement('div');
      empty.className = 'archiveEntry';
      empty.textContent = 'Noch keine Rennen im Archiv – starte ein Event!';
      raceArchive.appendChild(empty);
      return;
    }
    raceChronicle.events.slice(0, 8).forEach(entry => {
      const container = document.createElement('div');
      container.className = 'archiveEntry';
      const header = document.createElement('header');
      header.innerHTML = `<span>${formatDateTime(entry.timestamp)}</span><span>${entry.trackLabel}</span>`;
      container.appendChild(header);
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${getModeLabel(entry.mode)} • ${entry.weatherLabel} • ${entry.laps} Runden`;
      container.appendChild(meta);
      const podium = document.createElement('div');
      podium.className = 'podium';
      (entry.podium || []).forEach((pod, idx) => {
        const line = document.createElement('span');
        const gapText = idx === 0 ? 'Sieger' : pod.gap != null ? `+${formatGap(pod.gap)}s` : 'DNF';
        line.textContent = `${idx + 1}. #${pod.number} ${pod.driver} (${pod.team}) – ${gapText}`;
        podium.appendChild(line);
      });
      container.appendChild(podium);
      if (entry.fastestLap) {
        const fl = document.createElement('div');
        fl.className = 'meta';
        fl.textContent = `FL: #${entry.fastestLap.number} ${entry.fastestLap.driver} ${formatTime(entry.fastestLap.time)}`;
        container.appendChild(fl);
      }
        if (Array.isArray(entry.cautionLaps) && entry.cautionLaps.length) {
          const caution = document.createElement('div');
          caution.className = 'meta';
          const text = entry.cautionLaps
            .map(item => `${item.phase}: ${item.laps} Runde${item.laps === 1 ? '' : 'n'}`)
            .join(' • ');
          caution.textContent = `Caution-Laps: ${text}`;
          container.appendChild(caution);
        }
      if (Array.isArray(entry.pitStops) && entry.pitStops.length) {
        const pitLine = document.createElement('div');
        pitLine.className = 'meta';
        const pitText = entry.pitStops
          .slice(0, 3)
          .map(item => `#${item.number} ${item.driver} (Lap ${item.lap})`)
          .join(' • ');
        pitLine.textContent = `Pit-Stops: ${pitText}`;
        container.appendChild(pitLine);
      }
      if (Array.isArray(entry.violations) && entry.violations.length) {
        const list = document.createElement('ul');
        list.className = 'violationLog';
        entry.violations.slice(0, 5).forEach(log => {
          const li = document.createElement('li');
          const stamp = document.createElement('span');
          stamp.className = 'stamp';
          stamp.textContent = log.stamp || '---';
          const message = document.createElement('span');
          message.textContent = log.message;
          li.append(stamp, message);
          list.appendChild(li);
        });
        container.appendChild(list);
      }
      raceArchive.appendChild(container);
    });
  }

  function computeHallOfFame() {
    const stats = new Map();
    raceChronicle.events.forEach(entry => {
      (entry.podium || []).forEach((pod, idx) => {
        if (!pod?.driver) return;
        if (!stats.has(pod.driver)) {
          stats.set(pod.driver, { driver: pod.driver, team: pod.team, wins: 0, podiums: 0 });
        }
        const rec = stats.get(pod.driver);
        rec.team = pod.team;
        rec.podiums += 1;
        if (idx === 0) rec.wins += 1;
      });
    });
    return Array.from(stats.values()).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.podiums !== a.podiums) return b.podiums - a.podiums;
      return a.driver.localeCompare(b.driver, 'de');
    });
  }

  function renderHallOfFame() {
    if (!hallOfFame) return;
    hallOfFame.innerHTML = '';
    const list = computeHallOfFame().slice(0, 6);
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'fameEntry';
      empty.textContent = 'Noch keine Legenden – fahre mehr Rennen!';
      hallOfFame.appendChild(empty);
      return;
    }
    list.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'fameEntry';
      div.innerHTML = `
        <strong>${entry.driver}</strong>
        <span>${entry.team}</span>
        <span>${entry.wins} Siege • ${entry.podiums} Podien</span>
      `;
      hallOfFame.appendChild(div);
    });
  }

  function renderCodex() {
    renderCodexLore();
    renderDriverCodex();
    renderCodexGarage();
    renderContentRoadmap();
    renderIntegrationRoadmap();
    renderRaceArchive();
    renderHallOfFame();
  }

  function updateManagerView() {
    populateManagerTeamSelect();
    const teamName = managerState.selectedTeam;
    const teamData = managerState.teams[teamName];
    if (!teamData) return;
    teamData.facilities = sanitizeFacilities(teamData.facilities);
    const variant = getTeamVariant(teamName);
    focusTeam = teamName;
    if (managerBudget) managerBudget.textContent = formatCurrency(teamData.budget);
    if (managerSeasonLabel) managerSeasonLabel.textContent = managerState.seasonYear;
    if (managerWeekLabel) managerWeekLabel.textContent = managerState.week || 1;
    if (managerChassisLabel) {
      const statsLine = formatVariantStatLine(variant);
      managerChassisLabel.textContent = `${variant.codename} – ${variant.summary} (${statsLine})`;
    }
    if (managerFacilityLabel) {
      managerFacilityLabel.textContent = formatFacilitySummary(teamData);
    }
    const nextTrackId = getManagerTrackForWeek(managerState.week);
    if (managerNextTrack) managerNextTrack.textContent = trackCatalog[nextTrackId]?.label || nextTrackId;
    renderContracts(teamName, teamData);
    renderUpgradeStatus(teamName, teamData);
    renderFacilities(teamName, teamData);
    renderFreeAgents(teamName, teamData);
    refreshOddsTable();
  }

  function signFreeAgent(driverName) {
    const teamName = managerState.selectedTeam;
    const teamData = managerState.teams[teamName];
    if (!teamData) return;
    if ((teamData.roster || []).length >= MAX_ROSTER_SIZE) {
      showManagerNotice('Alle Cockpits sind besetzt.', 'error');
      return;
    }
    ensureFreeAgentPool();
    const agents = managerState.freeAgents || [];
    const index = agents.findIndex(a => a.driver === driverName);
    if (index === -1) {
      showManagerNotice('Fahrer nicht verfügbar.', 'error');
      return;
    }
    const agent = agents[index];
    const driverInfo = driverMap.get(driverName);
    const asking = agent.askingSalary ?? (driverInfo ? driverInfo.salary : 320000);
    if (teamData.budget < asking) {
      showManagerNotice('Budget nicht ausreichend für Verpflichtung.', 'error');
      return;
    }
    teamData.budget -= asking;
    const salary = driverInfo ? driverInfo.salary : Math.round(asking * 0.8);
    const morale = clamp(agent.morale ?? 0.55, 0.1, 0.95);
    teamData.roster = [...(teamData.roster || []), { driver: driverName, years: 2, salary, morale }].slice(0, MAX_ROSTER_SIZE);
    managerState.freeAgents.splice(index, 1);
    ensureFreeAgentPool();
    persistManagerState();
    updateManagerView();
    showManagerNotice(`${driverName} verpflichtet.`, 'success');
  }

  function renewContract(teamName, driverName) {
    const teamData = managerState.teams[teamName];
    if (!teamData) return;
    const contract = teamData.roster.find(r => r.driver === driverName);
    if (!contract) return;
    const cost = Math.round(contract.salary * 1.4);
    if (teamData.budget < cost) {
      showManagerNotice('Budget zu gering für Vertragsverlängerung.', 'error');
      return;
    }
    teamData.budget -= cost;
    contract.years = Math.max(0, contract.years || 0) + 2;
    contract.morale = clamp((contract.morale || 0.5) + 0.12, 0.1, 0.95);
    showManagerNotice(`Vertrag mit ${driverName} verlängert.`, 'success');
    persistManagerState();
    updateManagerView();
  }

  function handleUpgrade(type) {
    const teamName = managerState.selectedTeam;
    const teamData = managerState.teams[teamName];
    if (!teamData) return;
    const level = teamData.upgrades[type] || 0;
    if (level >= MAX_UPGRADE_LEVEL) {
      showManagerNotice('Maximales Upgrade-Level erreicht.', 'error');
      return;
    }
    const cost = UPGRADE_COST[type];
    if (teamData.budget < cost) {
      showManagerNotice('Budget nicht ausreichend für Upgrade.', 'error');
      return;
    }
    teamData.budget -= cost;
    teamData.upgrades[type] = level + 1;
    showManagerNotice(`${UPGRADE_LABELS[type]} auf Stufe ${teamData.upgrades[type]} erhöht.`, 'success');
    persistManagerState();
    updateManagerView();
  }

  function upgradeFacility(teamName, key) {
    const definition = FACILITY_TYPES[key];
    if (!definition) return;
    const teamData = managerState.teams[teamName];
    if (!teamData) return;
    teamData.facilities = sanitizeFacilities(teamData.facilities);
    const level = clampFacilityLevel(teamData.facilities[key]);
    if (level >= MAX_FACILITY_LEVEL) {
      showManagerNotice('Facility bereits am Limit.', 'error');
      return;
    }
    const nextCost = Array.isArray(definition.costs) ? definition.costs[level + 1] : null;
    if (!nextCost) {
      showManagerNotice('Kein Upgrade verfügbar.', 'error');
      return;
    }
    if (teamData.budget < nextCost) {
      showManagerNotice('Budget nicht ausreichend für Ausbau.', 'error');
      return;
    }
    teamData.budget -= nextCost;
    teamData.facilities[key] = level + 1;
    showManagerNotice(`${definition.label} auf Stufe ${teamData.facilities[key]} erweitert.`, 'success');
    persistManagerState();
    updateManagerView();
  }

  function advanceManagerWeek() {
    const currentWeek = managerState.week || 1;
    let totalSpend = 0;
    const expiredDrivers = [];
    Object.entries(managerState.teams).forEach(([teamName, teamData]) => {
      const roster = Array.isArray(teamData.roster) ? teamData.roster : [];
      const updatedRoster = [];
      let salaryCost = 0;
      const facilities = sanitizeFacilities(teamData.facilities);
      const academyLevel = clampFacilityLevel(facilities.academy);
      const systemsLevel = clampFacilityLevel(facilities.systemsBay);
      const aeroLevel = clampFacilityLevel(facilities.aeroLab);
      const powerLevel = clampFacilityLevel(facilities.powertrain);
      const moraleDecay = Math.max(0.008, 0.02 - academyLevel * 0.005);
      const upkeepFactor = Math.max(0.72, 1 - systemsLevel * 0.05);
      roster.forEach(contract => {
        if (!contract || !contract.driver) return;
        const driverInfo = driverMap.get(contract.driver);
        const salary = typeof contract.salary === 'number' ? contract.salary : (driverInfo ? driverInfo.salary : 320000);
        const decrement = 1 / MANAGER_SEASON_LENGTH;
        const years = Math.max(0, (typeof contract.years === 'number' ? contract.years : 1) - decrement);
        const moraleBase = clamp(contract.morale ?? 0.55, 0.1, 0.95);
        const morale = clamp(moraleBase - moraleDecay + (teamData.form || 0) * 0.015 + academyLevel * 0.01, 0.1, 0.98);
        salaryCost += salary / MANAGER_SEASON_LENGTH;
        if (years <= 0.05) {
          expiredDrivers.push(`${contract.driver} (${teamName})`);
          managerState.freeAgents = managerState.freeAgents || [];
          managerState.freeAgents.push({
            driver: contract.driver,
            morale,
            askingSalary: Math.round(salary * 1.05)
          });
        } else {
          updatedRoster.push({ driver: contract.driver, years, salary, morale });
        }
      });
      teamData.roster = updatedRoster.slice(0, MAX_ROSTER_SIZE);
      const spend = Math.round(salaryCost * upkeepFactor);
      totalSpend += spend;
      teamData.budget = Math.max(0, teamData.budget - spend);
      const facilityMomentum = academyLevel * 0.018 + (aeroLevel + powerLevel) * 0.007;
      teamData.form = clamp((teamData.form || 0) * 0.9 - 0.01 + facilityMomentum, -0.35, 0.6);
    });
    managerState.week = currentWeek + 1;
    let seasonAdvanced = false;
    if (managerState.week > MANAGER_SEASON_LENGTH) {
      managerState.week = 1;
      managerState.seasonYear += 1;
      seasonAdvanced = true;
      Object.entries(managerState.teams).forEach(([teamName, teamData]) => {
        const stipend = Math.round((teamTemplates[teamName]?.budget || 4500000) * 0.18);
        teamData.budget += stipend;
        teamData.form = clamp((teamData.form || 0) * 0.6, -0.2, 0.4);
        teamData.roster = (teamData.roster || []).map(contract => ({
          driver: contract.driver,
          years: Math.max(contract.years, 0.5),
          salary: contract.salary,
          morale: clamp(contract.morale + 0.04, 0.1, 0.95)
        }));
      });
    }
    ensureFreeAgentPool();
    persistManagerState();
    updateManagerView();
    const summaryParts = [`Gehälter: -${formatCurrency(totalSpend)}`];
    if (expiredDrivers.length) {
      summaryParts.push(`Verträge ausgelaufen: ${expiredDrivers.join(', ')}`);
    }
    if (seasonAdvanced) {
      summaryParts.push(`Neue Saison ${managerState.seasonYear}`);
      showManagerNotice(summaryParts.join(' • '), 'success');
    } else {
      showManagerNotice(summaryParts.join(' • '), expiredDrivers.length ? 'warn' : 'info');
    }
    ensureFreeAgentPool();
    ensureStaffPool();
    persistManagerState();
    updateManagerView();
  }

  function prepareManagerEvent() {
    const trackId = getManagerTrackForWeek(managerState.week);
    if (trackCatalog[trackId]) {
      currentTrackType = trackId;
      if (trackTypeSelect) trackTypeSelect.value = trackId;
      raceSettings.track = trackId;
      const rolledWeather = rollEventWeather(trackId);
      currentWeather = rolledWeather;
      if (weatherSetting) weatherSetting.value = currentWeather;
      raceSettings.weather = currentWeather;
      persistRaceSettings();
      updateActiveTrackTraits();
      rebuildMini();
      refreshOddsTable();
      const trackLabel = trackCatalog[trackId]?.label || trackId;
      const weatherLabel = getWeatherProfile().label;
      if (managerScreen?.classList.contains('active')) {
        showManagerNotice(`Event vorbereitet: ${trackLabel} • ${weatherLabel}`, 'info');
      }
    }
  }

  function calculateOdds() {
    const entries = getGridEntries();
    const ratings = entries.map(entry => {
      const template = teamTemplates[entry.team] || { base: { engine: 0.66, aero: 0.6, systems: 0.62 } };
      const teamData = managerState.teams[entry.team] || { upgrades: { engine: 0, aero: 0, systems: 0 }, form: 0 };
      const upgrades = teamData.upgrades || { engine: 0, aero: 0, systems: 0 };
      const driver = entry.driverInfo;
      const base = template.base || { engine: 0.66, aero: 0.6, systems: 0.62 };
      const profile = vehicleArchetypes[template.archetype] || vehicleArchetypes.balanced;
      const traits = activeTrackTraits || defaultTrackTraits;
      const chassis = getTeamVariant(entry.team);
      const synergy = profile.corner * traits.cornerFocus + profile.straight * traits.straightBias;
      const reliability = profile.systems * traits.surfaceGrip;
      const rating =
        driver.pace * 1.4 +
        driver.intel * 0.9 +
        driver.consist * 0.8 +
        base.engine * 0.6 +
        base.aero * 0.4 +
        (upgrades.engine + upgrades.aero + upgrades.systems) * 0.25 +
        (chassis.engine + chassis.aero + chassis.boost) * 0.2 +
        (chassis.systems + chassis.stability) * 0.18 +
        (teamData.form || 0) * 0.8 +
        synergy * 0.35 +
        reliability * 0.3 -
        driver.risk * (0.3 + (traits.turbulence - 1) * 0.4);
      return { ...entry, rating: Math.max(0.1, rating) };
    });
    const total = ratings.reduce((sum, item) => sum + item.rating, 0);
    return ratings.map(item => {
      const probability = item.rating / total;
      const odds = Math.max(1.2, (1 / probability) * 0.85);
      return { ...item, probability, odds };
    }).sort((a, b) => a.odds - b.odds);
  }

  function refreshOddsTable() {
    if (!oddsTable) return;
    const tbody = oddsTable.querySelector('tbody');
    if (!tbody) return;
    const odds = calculateOdds();
    cachedOdds = odds;
    tbody.innerHTML = '';
    if (betDriverSelect) betDriverSelect.innerHTML = '';
    odds.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>#${entry.number} ${entry.driver}</td><td>${entry.team}</td><td>${entry.odds.toFixed(2)}</td>`;
      tbody.appendChild(row);
      if (betDriverSelect) {
        const opt = document.createElement('option');
        opt.value = entry.driver;
        opt.textContent = `#${entry.number} ${entry.driver} (${entry.odds.toFixed(2)})`;
        betDriverSelect.appendChild(opt);
      }
    });
  }

  function updateBetHistory() {
    if (!betHistory) return;
    betHistory.innerHTML = '';
    bettingState.history.forEach(entry => {
      const div = document.createElement('div');
      div.className = entry.success ? 'win' : 'loss';
      if (entry.success) {
        div.textContent = `${entry.driver} – Gewinn ${entry.payout?.toLocaleString('de-DE')} Cr`;
      } else {
        div.textContent = `${entry.driver} – Verlust ${entry.loss?.toLocaleString('de-DE')} Cr`;
      }
      betHistory.appendChild(div);
    });
  }

  function updateBettingUI() {
    if (betBalance) {
      betBalance.textContent = `${Math.round(bettingState.balance).toLocaleString('de-DE')} Cr`;
    }
    if (betSlip) {
      if (bettingState.activeBet) {
        const bet = bettingState.activeBet;
        betSlip.textContent = `Aktive Wette: ${bet.driver} – ${bet.amount} Cr @ ${bet.odds.toFixed(2)}`;
      } else {
        betSlip.textContent = 'Keine aktive Wette.';
      }
    }
    updateBetHistory();
  }

  function showScreen(target) {
    [mainMenu, raceScreen, teamsScreen, managerScreen, bettingScreen, codexScreen, settingsScreen].forEach(el => {
      if (el) el.classList.remove('active');
    });
    if (target) target.classList.add('active');
    if (target === mainMenu) {
      armTitleThemeTrigger();
    } else {
      stopTitleTheme();
    }
    if (target === raceScreen && !raceActive && !countdownRunning) {
      resetRaceControls();
      updateEventBriefing();
    }
  }

  newRaceBtn?.addEventListener('click', () => {
    currentMode = 'quick';
    showScreen(raceScreen);
  });

  function prepareGrandPrixRound() {
    const trackId = gpTrackRotation[gpRaceIndex % gpTrackRotation.length] || gpTrackRotation[0];
    currentTrackType = trackId;
    if (trackTypeSelect) {
      trackTypeSelect.value = trackId;
    }
    raceSettings.track = trackId;
    persistRaceSettings();
    updateActiveTrackTraits();
    rebuildMini();
    refreshOddsTable();
    updateEventBriefing();
  }

  grandPrixBtn?.addEventListener('click', () => {
    const progress = hasGrandPrixProgress();
    if (progress) {
      const reset = window.confirm(
        `Ein Grand Prix läuft noch. Neu starten und bisherigen Fortschritt verwerfen?`
      );
      if (!reset) {
        return;
      }
    }
    currentMode = 'gp';
    gpReset();
    showScreen(raceScreen);
  });

  resumeGrandPrixBtn?.addEventListener('click', () => {
    const progress = hasGrandPrixProgress();
    if (!progress) {
      window.alert('Kein laufender Grand Prix zum Fortsetzen gefunden.');
      return;
    }
    currentMode = 'gp';
    if (!gpActive) {
      gpActive = true;
    }
    prepareGrandPrixRound();
    showScreen(raceScreen);
  });

  managerBtn?.addEventListener('click', () => {
    showScreen(managerScreen);
    updateManagerView();
  });

  bettingBtn?.addEventListener('click', () => {
    refreshOddsTable();
    updateBettingUI();
    showScreen(bettingScreen);
  });

  teamsBtn?.addEventListener('click', () => {
    renderTeams();
    showScreen(teamsScreen);
  });

  codexBtn?.addEventListener('click', () => {
    renderCodex();
    showScreen(codexScreen);
  });

  settingsBtn?.addEventListener('click', () => {
    showScreen(settingsScreen);
  });

  managerTeamSelect?.addEventListener('change', () => {
    managerState.selectedTeam = managerTeamSelect.value;
    focusTeam = managerState.selectedTeam;
    persistManagerState();
    updateManagerView();
  });

  managerStartRaceBtn?.addEventListener('click', () => {
    currentMode = 'manager';
    prepareManagerEvent();
    showScreen(raceScreen);
  });

  advanceManagerWeekBtn?.addEventListener('click', () => {
    advanceManagerWeek();
  });

  managerSaveBtn?.addEventListener('click', () => {
    persistManagerState();
    showManagerNotice('Karriere gespeichert.', 'success');
  });

  managerExportBtn?.addEventListener('click', () => {
    try {
      const blob = new Blob([JSON.stringify(managerState, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spacerx-manager-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('export failed', err);
    }
  });

  managerImportInput?.addEventListener('change', ev => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        managerState = normalizeManagerState(data);
        focusTeam = managerState.selectedTeam;
        ensureFreeAgentPool();
        persistManagerState();
        updateManagerView();
        showManagerNotice('Import erfolgreich.', 'success');
      } catch (err) {
        console.warn('import failed', err);
        showManagerNotice('Import fehlgeschlagen.', 'error');
      }
    };
    reader.readAsText(file);
    managerImportInput.value = '';
  });

  exportProfileBtn?.addEventListener('click', () => {
    try {
      const snapshot = collectProfileSnapshot();
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spacerx-profile-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showSettingsNotice('Profil exportiert.', 'success');
    } catch (err) {
      console.warn('profile export failed', err);
      showSettingsNotice('Export fehlgeschlagen.', 'error');
    }
  });

  importProfileBtn?.addEventListener('click', () => {
    if (importProfileInput) {
      importProfileInput.value = '';
      importProfileInput.click();
    }
  });

  importProfileInput?.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const info = applyProfileSnapshot(data);
        const label = info?.version ? `Profil importiert (v${info.version})` : 'Profil importiert.';
        showSettingsNotice(label, 'success');
      } catch (err) {
        console.warn('profile import failed', err);
        showSettingsNotice('Import fehlgeschlagen.', 'error');
      }
    };
    reader.readAsText(file);
  });

  wipeProfileBtn?.addEventListener('click', () => {
    if (!window.confirm('Gesamten lokalen Spielstand wirklich löschen?')) return;
    wipeProfileStorage();
    showSettingsNotice('Speicher zurückgesetzt.', 'success');
  });

  document.querySelectorAll('.upgradeControls button').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-upgrade');
      if (type) handleUpgrade(type);
    });
  });

  placeBetBtn?.addEventListener('click', () => {
    const driver = betDriverSelect?.value;
    const amount = parseInt(betAmount?.value || '0', 10);
    if (!driver || !amount || amount <= 0) {
      if (betSlip) betSlip.textContent = 'Bitte Fahrer und Einsatz wählen.';
      return;
    }
    if (amount > bettingState.balance) {
      if (betSlip) betSlip.textContent = 'Nicht genügend Credits.';
      return;
    }
    const oddsEntry = cachedOdds.find(item => item.driver === driver);
    if (!oddsEntry) {
      if (betSlip) betSlip.textContent = 'Quote nicht verfügbar.';
      return;
    }
    bettingState.balance -= amount;
    bettingState.activeBet = {
      driver,
      team: oddsEntry.team,
      amount,
      odds: oddsEntry.odds,
      track: currentTrackType,
      placedAt: Date.now()
    };
    persistBettingState();
    updateBettingUI();
  });

  betStartRaceBtn?.addEventListener('click', () => {
    currentMode = 'betting';
    showScreen(raceScreen);
  });

  backToMenuFromRace?.addEventListener('click', () => {
    raceActive = false;
    isPaused = false;
    countdownRunning = false;
    recordingReplay = false;
    formationActive = false;
    raceClockArmed = false;
    raceClockOffset = 0;
    hideGridIntro();
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    setRacePhase('IDLE');
    top3Banner.textContent = '';
    resetRaceControls();
    resultsLabel.textContent = '';
    leaderGapHud?.classList.add('hidden');
    updateCameraHud([]);
    updateLeaderboardHud([]);
    leaderboardGapHistory.clear();
    resetLiveTicker();
    resetRaceControlLog();
    clearCautionSnapshot();
    hidePodiumOverlay(true);
    clearReplayData();
    resetCautionHistory();
    racePitLog.length = 0;
    replayBookmarks.length = 0;
    updateReplayBookmarksUI();
    showScreen(mainMenu);
    currentMode = 'quick';
    finalizePhaseTimeline(raceTime);
    auditRaceFlow('exit', { via: 'menu', raceTime: Number(raceTime.toFixed(2)) });
    phaseTimeline.length = 0;
    flowAudit.length = 0;
    updateGrandPrixMenuState();
  });

  backToMenuFromTeams?.addEventListener('click', () => showScreen(mainMenu));
  backToMenuFromManager?.addEventListener('click', () => showScreen(mainMenu));
  backToMenuFromBetting?.addEventListener('click', () => showScreen(mainMenu));
  backToMenuFromCodex?.addEventListener('click', () => showScreen(mainMenu));
  backToMenuFromSettings?.addEventListener('click', () => showScreen(mainMenu));

  telemetryList?.addEventListener('click', event => {
    const item = event.target.closest('li');
    if (!item?.dataset?.carId) return;
    focusDriverId = parseInt(item.dataset.carId, 10);
    if (Number.isNaN(focusDriverId)) return;
    if (uiSettings.cameraMode !== 'manual') {
      uiSettings.cameraMode = 'manual';
      if (cameraSetting) {
        cameraSetting.value = 'manual';
      }
      persistUiSettings();
    }
    updateLeaderGap(lastTelemetryOrder);
    updateFocusPanel(lastTelemetryOrder);
    updateCameraHud(lastTelemetryOrder);
  });

  broadcastIntroSkip?.addEventListener('click', () => completeBroadcastIntro(true));
  broadcastIntro?.addEventListener('click', event => {
    if (event.target === broadcastIntro) {
      completeBroadcastIntro(true);
    }
  });

  gridIntroDismiss?.addEventListener('click', () => beginRaceCountdown());

  startRaceBtn?.addEventListener('click', () => startRace());
  pauseRaceBtn?.addEventListener('click', pauseToggle);
  replayRaceBtn?.addEventListener('click', () => {
    beginReplaySession();
  });
  replayPlayPauseBtn?.addEventListener('click', () => {
    if (!replayActive) {
      beginReplaySession();
      return;
    }
    setReplayPlaying(!replayPlaying);
  });
  replayScrubber?.addEventListener('input', () => {
    if (!replayBuffer.length) return;
    const idx = parseInt(replayScrubber.value || '0', 10);
    setReplayPlaying(false);
    applyReplayFrame(Number.isNaN(idx) ? 0 : idx, false);
  });
  replaySpeedSelect?.addEventListener('change', () => {
    const value = parseFloat(replaySpeedSelect.value || '1');
    replaySpeed = Number.isFinite(value) && value > 0 ? value : 1;
    if (replayPlaying) {
      replayLastTimestamp = 0;
    }
  });
  replayBookmarkSelect?.addEventListener('change', () => {
    const value = parseFloat(replayBookmarkSelect.value || '');
    if (!Number.isFinite(value)) {
      return;
    }
    setReplayPlaying(false);
    seekReplayToTime(value);
  });
  timingModalBtn?.addEventListener('click', () => {
    setTimingModalOpen(true);
    queueHighlightTicker('📊', 'Timing-Overlay geöffnet', 'stats');
  });
  timingModalClose?.addEventListener('click', () => closeTimingModal());
  timingModal?.addEventListener('click', event => {
    if (event.target === timingModal) {
      closeTimingModal();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && timingModalOpen) {
      closeTimingModal();
    }
  });
  podiumCloseBtn?.addEventListener('click', () => {
    hidePodiumOverlay(true);
  });
  nextRaceBtn?.addEventListener('click', () => {
    nextRaceBtn.style.display = 'none';
    prepareGrandPrixRound();
    startRace();
  });

  if (typeof window !== 'undefined') {
    window.spacerxDiagnostics = {
      getPhaseTimeline: () => phaseTimeline.map(entry => {
        const startValue = entry.start ?? 0;
        const endValue = entry.end;
        const durationValue = entry.duration;
        return {
          phase: entry.phase,
          start: Number(startValue.toFixed(3)),
          end: endValue != null ? Number(endValue.toFixed(3)) : null,
          duration: durationValue != null ? Number(durationValue.toFixed(3)) : null,
          meta: entry.meta || null
        };
      }),
      getFlowAudit: () => flowAudit.map(item => ({
        event: item.event,
        phase: item.phase,
        raceTime: item.raceTime,
        timestamp: item.timestamp,
        details: item.details || null
      })),
      reset: () => {
        phaseTimeline.length = 0;
        flowAudit.length = 0;
      }
    };
  }

  renderTeams();
  renderContentRoadmap();
  renderIntegrationRoadmap();
  updateManagerView();
  updateActiveTrackTraits();
  rebuildMini();
  refreshOddsTable();
  updateBettingUI();
  updateFastestLapLabel();
  updateGrandPrixMenuState();
  updateReplayBookmarksUI();
  showScreen(mainMenu);
  console.log('SPACER-X loaded');
})();
