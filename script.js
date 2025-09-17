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

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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
    const traits = [];
    if (variant.engine > 1.05 || variant.boost > 1.05) traits.push('Top-End Boost');
    if (variant.aero > 1.05 || variant.handling > 1.05) traits.push('Kurvengriff');
    if (variant.systems > 1.05 || variant.stability > 1.05) traits.push('Robuste Systeme');
    if (variant.drag < 0.98) traits.push('Leichtbau');
    variant.summary = traits.length ? traits.join(' • ') : 'Ausgewogenes Paket';
    return variant;
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
    return { ...defaultChassisSpec, ...teamVehicleVariants[teamName] };
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
  const managerCalendar = ['oval', 'aurora', 'delta', 'canyon', 'atlas', 'solstice', 'zenith', 'wavy', 'nebula', 'fig8', 'mirage', 'fracture', 'helix', 'lumen'];
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

  let managerState = loadManagerState();
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
  const lapRecords = {
    fastestLap: { time: Infinity, driver: null, team: null, number: null },
    bestSectors: [
      { time: Infinity, driver: null, team: null, number: null },
      { time: Infinity, driver: null, team: null, number: null },
      { time: Infinity, driver: null, team: null, number: null }
    ]
  };

  const gpTrackRotation = ['oval', 'atlas', 'solstice', 'mirage', 'lumen'];

  const mainMenu = document.getElementById('mainMenu');
  const raceScreen = document.getElementById('raceScreen');
  const teamsScreen = document.getElementById('teamsScreen');
  const managerScreen = document.getElementById('managerScreen');
  const bettingScreen = document.getElementById('bettingScreen');
  const codexScreen = document.getElementById('codexScreen');
  const settingsScreen = document.getElementById('settingsScreen');

  const newRaceBtn = document.getElementById('newRaceBtn');
  const grandPrixBtn = document.getElementById('grandPrixBtn');
  const resetGpBtn = document.getElementById('resetGpBtn');
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
  const top3Banner = document.getElementById('top3Banner');
  const raceFlag = document.getElementById('raceFlag');
  const highlightTicker = document.getElementById('highlightTicker');
  const sessionInfo = document.getElementById('sessionInfo');
  const leaderGapHud = document.getElementById('leaderGapHud');
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

  const zoomSetting = document.getElementById('zoomSetting');
  const trackTypeSelect = document.getElementById('trackType');
  const lapsSetting = document.getElementById('lapsSetting');
  const aiDifficulty = document.getElementById('aiDifficulty');
  const startProc = document.getElementById('startProc');
  const weatherSetting = document.getElementById('weatherSetting');
  const toggleRaceControl = document.getElementById('toggleRaceControl');
  const toggleFocusPanel = document.getElementById('toggleFocusPanel');
  const toggleMiniMap = document.getElementById('toggleMiniMap');
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
  const managerNextTrack = document.getElementById('managerNextTrack');
  const contractList = document.getElementById('contractList');
  const upgradeStatus = document.getElementById('upgradeStatus');
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
  const codexGarage = document.getElementById('codexGarage');
  const raceArchive = document.getElementById('raceArchive');
  const hallOfFame = document.getElementById('hallOfFame');

  const uiSettings = loadUiSettings();
  if (zoomSetting && uiSettings.zoom) {
    zoomSetting.value = uiSettings.zoom;
  }
  if (toggleMiniMap) {
    toggleMiniMap.checked = uiSettings.showMiniMap;
  }
  if (toggleRaceControl) {
    toggleRaceControl.checked = uiSettings.showRaceControl;
  }
  if (toggleFocusPanel) {
    toggleFocusPanel.checked = uiSettings.showFocusPanel;
  }
  applyUiSettings();

  let raceSettings = loadRaceSettings();
  if (trackTypeSelect && raceSettings.track) {
    trackTypeSelect.value = raceSettings.track;
  }
  if (lapsSetting && raceSettings.laps) {
    const lapsValue = String(raceSettings.laps);
    if ([...lapsSetting.options].some(opt => opt.value === lapsValue)) {
      lapsSetting.value = lapsValue;
    }
  }
  if (aiDifficulty && raceSettings.ai) {
    aiDifficulty.value = raceSettings.ai;
  }
  if (startProc && raceSettings.startProc) {
    startProc.value = raceSettings.startProc;
  }
  if (weatherSetting && raceSettings.weather) {
    if ([...weatherSetting.options].some(opt => opt.value === raceSettings.weather)) {
      weatherSetting.value = raceSettings.weather;
    }
  }

  let currentTrackType = trackTypeSelect?.value || raceSettings.track || 'oval';
  let totalLaps = parseInt(lapsSetting?.value || String(raceSettings.laps || 15), 10);
  let aiLevel = aiDifficulty?.value || raceSettings.ai || 'normal';
  let currentWeather = weatherSetting?.value || raceSettings.weather || 'clear';
  let activeTrackTraits = getTrackTraits(currentTrackType);
  let currentVisualTheme = null;
  let lastTelemetryOrder = [];
  const raceControlEvents = [];
  const phaseStats = { yellow: 0, safety: 0, restart: 0 };

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

  const cars = [];
  let raceActive = false;
  let isPaused = false;
  let raceTime = 0;
  let countdownTimer = null;
  let countdownRunning = false;
  let gridIntroInterval = null;
  let gridIntroCountdown = 0;
  let racePhase = 'IDLE';
  let racePhaseEndsAt = Infinity;
  let racePhaseNext = null;
  let racePhaseMeta = {};
  let previousPhase = 'IDLE';
  let lastFrame = 0;
  let currentMode = 'quick';
  let focusDriverId = null;
  let gpActive = false;
  let gpRaceIndex = 0;
  const GP_RACES = 5;
  const GP_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const gpTable = new Map();

  const trackCenter = { x: canvas.width / 2, y: canvas.height / 2 };
  const baseRadiusX = canvas.width * 0.35;
  const baseRadiusY = canvas.height * 0.28;

  const defaultTrackTraits = { straightBias: 1, cornerFocus: 1, surfaceGrip: 1, wearRate: 1, turbulence: 1 };
  const defaultTrackTheme = { background: '#07111f', asphalt: '#1f2937', lane: '#94a3b8', accent: '#38bdf8' };
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
    }
  };
  const defaultWeatherBias = { clear: 0.5, overcast: 0.28, storm: 0.12, night: 0.1 };

  const trackCatalog = {
    oval: {
      label: 'Orbital Oval',
      theme: { background: '#07111f', asphalt: '#1f2937', lane: '#94a3b8', accent: '#38bdf8' },
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
    delta: {
      label: 'Delta Spiral',
      theme: { background: '#0d101f', asphalt: '#1f2435', lane: '#7dd3fc', accent: '#34d399' },
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
    aurora: {
      label: 'Aurora Loop',
      theme: { background: '#0a101f', asphalt: '#1c2742', lane: '#f0abfc', accent: '#a855f7' },
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
    }
  };

  let miniSamples = [];

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
    gridIntroInterval = setInterval(() => {
      gridIntroCountdown -= 1;
      if (gridIntroCountdown <= 0) {
        beginRaceCountdown();
      } else {
        updateGridIntroCountdownDisplay();
      }
    }, 1000);
  }

  function beginRaceCountdown() {
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
    const countdown = [3, 2, 1, 'GO'];
    let idx = 0;
    const runCountdown = () => {
      if (!countdownRunning) {
        return;
      }
      if (!raceScreen?.classList.contains('active')) {
        countdownRunning = false;
        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
        return;
      }
      if (idx < countdown.length) {
        const step = countdown[idx];
        if (typeof step === 'number') {
          racePhaseMeta.countdownText = `Start in ${step}`;
          top3Banner.textContent = racePhaseMeta.countdownText;
        } else {
          racePhaseMeta.countdownText = 'GO!';
          top3Banner.textContent = 'GO!';
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
        pauseRaceBtn.disabled = false;
        pauseRaceBtn.textContent = 'Pause';
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
    const defaults = { zoom: 'on', showMiniMap: true, showRaceControl: true, showFocusPanel: true };
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ui);
      if (!raw) return { ...defaults };
      const parsed = JSON.parse(raw);
      return {
        zoom: parsed.zoom === 'off' ? 'off' : 'on',
        showMiniMap: parsed.showMiniMap !== false,
        showRaceControl: parsed.showRaceControl !== false,
        showFocusPanel: parsed.showFocusPanel !== false
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
      this.inPitLane = false;
      this.pitEntryProgress = null;
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

      let pitHold = false;
      if (!this.pitted) {
        if (!this.inPitLane && this.lap === this.pitLap && this.progress < 0.2) {
          this.inPitLane = true;
          this.pitEntryProgress = this.progress;
          if (!this.wearSignals.pitCall) {
            logRaceControl(`#${this.racingNumber} ${this.driver}: Boxenstopp`, 'info');
            this.wearSignals.pitCall = true;
          }
        }
        if (this.inPitLane) {
          pitHold = true;
          this.pitTimer += dt;
          speed *= 0.52;
          if (this.pitTimer > 5.5) {
            this.pitted = true;
            this.inPitLane = false;
            this.pitTimer = 0;
            this.tireWear = Math.max(0, this.tireWear - 0.4);
            this.systemIntegrity = Math.min(1.05, this.systemIntegrity + 0.12);
            if (!this.wearSignals.pitClear) {
              logRaceControl(`#${this.racingNumber} ${this.driver}: verlässt die Box`, 'success');
              this.wearSignals.pitClear = true;
            }
            this.pitEntryProgress = null;
          }
        }
      }

      if (racePhase === 'SAFETY' && leader && !this.finished) {
        const gap = computeAngularGap(leader, this);
        if (gap > 0.02) {
          speed *= 1.18;
        }
      }

      speed = Math.max(3.5, speed);
      const phaseFactor = getPhaseSpeedFactor();
      speed *= phaseFactor;

      this.currentSpeed = Math.max(0, speed * 32);
      this.peakSpeed = Math.max(this.peakSpeed, this.currentSpeed);

      const dprog = pitHold ? 0 : speed * dt * 0.33;
      this.progress += dprog;
      if (pitHold && this.pitEntryProgress !== null) {
        this.progress = this.pitEntryProgress;
      }

      if (this.progress >= Math.PI * 2) {
        this.progress -= Math.PI * 2;
        this.lap += 1;
      }

      const currNorm = (this.lap - 1) + this.progress / (Math.PI * 2);
      handleSectorProgress(this, prevNorm, currNorm, dt);

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

  function pushTicker(msg, type) {
    if (!highlightTicker) return;
    let tag = '🏁';
    if (type === 'yellow') tag = '🟨';
    else if (type === 'sc') tag = '🚨';
    else if (type === 'pb') tag = '⏱️';
    else if (type === 'fl') tag = '🔥';
    else if (type === 'info') tag = 'ℹ️';
    highlightTicker.textContent = `${tag} ${msg}`;
  }

  function logRaceControl(message, level = 'info') {
    const stampValue = isFinite(raceTime) && raceTime > 0 ? `${Math.floor(raceTime).toString().padStart(3, '0')}s` : '---';
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

  function getPhaseSpeedFactor() {
    switch (racePhase) {
      case 'GREEN':
        return 1;
      case 'YELLOW':
        return 0.78;
      case 'SAFETY':
        return 0.55;
      case 'RESTART':
        return 0.82;
      case 'COUNTDOWN':
      case 'FINISHED':
      case 'IDLE':
        return 0;
      default:
        return 1;
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
    const sequence = { name: 'RESTART', duration: 4, next: { name: 'GREEN' } };
    setRacePhase('YELLOW', 7, sequence, { source: car.driver });
  }

  function queueSafety(car) {
    if (racePhase === 'SAFETY') {
      extendPhase(4);
      return;
    }
    const sequence = { name: 'YELLOW', duration: 4, next: { name: 'RESTART', duration: 4, next: { name: 'GREEN' } } };
    setRacePhase('SAFETY', 12, sequence, { source: car.driver });
  }

  function setRacePhase(name, duration = null, next = null, meta = {}) {
    previousPhase = racePhase;
    racePhase = name;
    racePhaseMeta = meta || {};
    racePhaseNext = next || null;
    racePhaseEndsAt = duration == null ? Infinity : raceTime + duration;
    announcePhase(name, meta);
    updateFlag();
    updateSessionInfo();
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
    } else if (racePhase === 'RESTART' || racePhase === 'YELLOW' || racePhase === 'SAFETY') {
      updateSessionInfo();
    }
  }

  function announcePhase(name, meta) {
    if (name === 'GREEN' && previousPhase !== 'GREEN') {
      pushTicker('Green Flag – Rennen frei!', 'fl');
      logRaceControl('Green Flag', 'success');
    } else if (name === 'YELLOW') {
      phaseStats.yellow += 1;
      const src = meta?.source ? ` (${meta.source})` : '';
      pushTicker(`Gelbe Flagge${src}`, 'yellow');
      logRaceControl(`Gelbe Flagge${src}`, 'warn');
    } else if (name === 'SAFETY') {
      phaseStats.safety += 1;
      const src = meta?.source ? ` wegen ${meta.source}` : '';
      pushTicker(`Safety Car${src}`, 'sc');
      logRaceControl(`Safety Car${src}`, 'alert');
    } else if (name === 'RESTART') {
      phaseStats.restart += 1;
      pushTicker('Restart-Prozedur läuft', 'info');
      logRaceControl('Restart Vorbereitung', 'info');
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
    if (racePhase === 'GREEN') {
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

  function drawTrack() {
    const track = trackCatalog[currentTrackType] || trackCatalog.oval;
    const theme = currentVisualTheme || track.theme || defaultTrackTheme;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = theme.asphalt;
    ctx.lineWidth = 60;
    ctx.beginPath();
    for (let i = 0; i <= 256; i++) {
      const t = (i / 256) * Math.PI * 2;
      const p = track.geometry(t);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();
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

  function drawCars() {
    cars.forEach(car => {
      const pos = car.getPosition();
      ctx.strokeStyle = `${car.color}55`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      car.trail.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(pos.angle);
      ctx.fillStyle = car.color;
      const geo = car.bodyGeometry || defaultChassisSpec.geometry;
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
      if (car.id === focusDriverId) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        roundRect(ctx, -halfL - 2, -halfW - 2, bodyLength + 4, bodyWidth + 4, Math.min(8, halfW + 2));
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawMiniMap() {
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

    const order = cars.slice().sort(sortByRacePosition);
    order.forEach((car, idx) => {
      const pos = car.getPosition();
      const x = pos.x * scale + ox;
      const y = pos.y * scale + oy;
      mm.fillStyle = car.color;
      mm.beginPath();
      mm.arc(x, y, idx === 0 ? 4 : 3, 0, Math.PI * 2);
      mm.fill();
    });
  }

  function drawScene() {
    drawTrack();
    drawCars();
    drawMiniMap();
    const order = cars.slice().sort(sortByRacePosition);
    const text = order.slice(0, 3).map((car, idx) => `${idx + 1}. #${car.racingNumber} ${car.driver}`).join('   ');
    if (text) {
      top3Banner.textContent = text;
      top3Banner.classList.remove('hidden');
    }
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

  function updateTelemetry(order) {
    if (!telemetryList) return;
    telemetryList.innerHTML = '';
    if (!Array.isArray(order) || order.length === 0) {
      lapInfoLabel.textContent = `Runde: 1 / ${totalLaps}`;
      raceTimeLabel.textContent = `Rennzeit: ${raceTime.toFixed(1)} s`;
      updateLeaderGap(order || []);
      updateFocusPanel(order || []);
      return;
    }
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
    raceTimeLabel.textContent = `Rennzeit: ${raceTime.toFixed(1)} s`;
    updateLeaderGap(order);
    lastTelemetryOrder = order.slice();
    updateFocusPanel(order);
  }

  function updateLeaderGap(order) {
    if (!leaderGapHud) return;
    if (!focusDriverId) {
      leaderGapHud.classList.add('hidden');
      return;
    }
    if (!Array.isArray(order) || order.length === 0) {
      leaderGapHud.classList.add('hidden');
      return;
    }
    const focusCar = order.find(car => car.id === focusDriverId);
    if (!focusCar) {
      leaderGapHud.classList.add('hidden');
      return;
    }
    const position = order.indexOf(focusCar);
    if (position === -1) {
      leaderGapHud.classList.add('hidden');
      return;
    }
    const leader = order[0];
    leaderGapHud.classList.remove('hidden', 'positive', 'negative');
    if (leader.id === focusCar.id) {
      leaderGapHud.innerHTML = `<span class=\"label\">Focus</span><span class=\"delta\">P${position + 1} - Leader</span>`;
      return;
    }
    const gap = computeTimeGap(leader, focusCar);
    const cls = gap >= 0 ? 'positive' : 'negative';
    leaderGapHud.classList.add(cls);
    leaderGapHud.innerHTML = `<span class=\"label\">Focus</span><span class=\"delta\">P${position + 1} +${formatGap(Math.abs(gap))}s</span>`;
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
    text += `Boxenstopps: ${pitCount} | Gelb: ${phaseStats.yellow} | Safety: ${phaseStats.safety} | Restarts: ${phaseStats.restart}\n`;
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
    raceActive = false;
    isPaused = false;
    raceTime = 0;
    lastFrame = performance.now();
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
    highlightTicker.textContent = '';
    resultsLabel.textContent = '';
    replayRaceBtn.style.display = 'none';
    if (nextRaceBtn) nextRaceBtn.style.display = 'none';
    startRaceBtn.disabled = true;
    pauseRaceBtn.disabled = true;
    pauseRaceBtn.textContent = 'Pause';
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
    createField();
    applyGridPositions(startProc?.value || 'standing');
    rebuildMini();
    setRacePhase('COUNTDOWN');
    top3Banner.classList.remove('hidden');
    top3Banner.textContent = '';
    logRaceControl('Grid formiert – Countdown gestartet', 'info');
    lastTelemetryOrder = cars.slice().sort(sortByRacePosition);
    updateFocusPanel(lastTelemetryOrder);
    showGridIntro(cars);
  }

  function pauseToggle() {
    if (!raceActive && !isPaused) return;
    if (!isPaused) {
      isPaused = true;
      raceActive = false;
      pauseRaceBtn.textContent = 'Fortsetzen';
      sessionInfo.textContent = 'Pause';
      sessionInfo.classList.remove('hidden');
      logRaceControl('Rennen pausiert', 'info');
    } else {
      isPaused = false;
      raceActive = true;
      pauseRaceBtn.textContent = 'Pause';
      sessionInfo.classList.add('hidden');
      logRaceControl('Rennen fortgesetzt', 'info');
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

    const leader = cars.slice().sort(sortByRacePosition).find(car => !car.finished) || cars[0] || null;
    cars.forEach(car => car.update(dt, leader));

    drawScene();
    const orderAfter = cars.slice().sort(sortByRacePosition);
    updateTelemetry(orderAfter);
    updateSessionInfo();

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
    setRacePhase('FINISHED');
    updateFlag();
    updateSessionInfo();
    pauseRaceBtn.textContent = 'Pause';
    pauseRaceBtn.disabled = true;
    startRaceBtn.disabled = false;
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    const order = cars.slice().sort(sortByRacePosition);
    recordRaceHistory(order);
    resultsLabel.textContent = formatResults(order);
    replayRaceBtn.style.display = 'inline-block';
    if (gpActive) {
      gpAccumulate(order);
      gpRaceIndex += 1;
      gpActive = gpRaceIndex < GP_RACES;
      gpSave();
      let text = `${resultsLabel.textContent}\n\n${gpStandingsText()}`;
      if (gpActive) {
        const upcomingTrackId = gpTrackRotation[gpRaceIndex % gpTrackRotation.length];
        const upcomingLabel = trackCatalog[upcomingTrackId]?.label || upcomingTrackId;
        text += `\n\nNächstes Rennen: ${upcomingLabel} (Rennen ${gpRaceIndex + 1}/${GP_RACES})`;
        if (nextRaceBtn) nextRaceBtn.style.display = 'inline-block';
      } else {
        text += '\n\nGP abgeschlossen.';
        if (nextRaceBtn) nextRaceBtn.style.display = 'none';
      }
      resultsLabel.textContent = text.trim();
    }
    if (currentMode === 'manager') {
      applyManagerRewards(order);
    }
    if (currentMode === 'betting') {
      settleBet(order);
    }
    leaderGapHud?.classList.add('hidden');
    lastTelemetryOrder = order;
    updateFocusPanel(order);
    logRaceControl('Rennen beendet – Ergebnisse verfügbar', 'success');
  }

  function syncRaceSetupForTrack(trackId) {
    if (!trackId) return;
    currentTrackType = trackId;
    if (trackTypeSelect) {
      trackTypeSelect.value = currentTrackType;
    }
    raceSettings.track = currentTrackType;
    persistRaceSettings();
    updateActiveTrackTraits();
    rebuildMini();
    refreshOddsTable();
  }

  function gpReset() {
    gpActive = true;
    gpRaceIndex = 0;
    gpTable.clear();
    gpSave();
    syncRaceSetupForTrack(gpTrackRotation[0]);
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
    const completedRaces = Math.min(gpRaceIndex, GP_RACES);
    const heading = gpRaceIndex >= GP_RACES && arr.length
      ? `GP Endstand (${GP_RACES} Rennen):`
      : `GP Zwischenstand nach Rennen ${completedRaces}/${GP_RACES}:`;
    let text = `${heading}\n`;
    arr.slice(0, 10).forEach((entry, idx) => {
      text += `${idx + 1}. #${entry.number} ${entry.driver} (${entry.team}) – ${entry.points} P\n`;
    });
    return text.trimEnd();
  }

  function formatGpStatusText() {
    const entryCount = gpTable.size;
    const hasProgress = entryCount > 0 && gpRaceIndex < GP_RACES;
    const isFinished = entryCount > 0 && gpRaceIndex >= GP_RACES;
    if (isFinished) {
      return `${gpStandingsText()}\nGP abgeschlossen.`.trim();
    }
    if (hasProgress) {
      const upcomingTrackId = gpTrackRotation[gpRaceIndex % gpTrackRotation.length];
      const upcomingLabel = trackCatalog[upcomingTrackId]?.label || upcomingTrackId;
      return `${gpStandingsText()}\nNächstes Rennen: ${upcomingLabel} (Rennen ${gpRaceIndex + 1}/${GP_RACES})`.trim();
    }
    const firstTrackId = gpTrackRotation[0];
    const firstLabel = trackCatalog[firstTrackId]?.label || firstTrackId;
    return `Grand Prix vorbereitet – Auftakt auf ${firstLabel}.`;
  }

  function prepareGpLobbyState({ fromResume = false } = {}) {
    hideGridIntro();
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    countdownRunning = false;
    raceActive = false;
    isPaused = false;
    setRacePhase('IDLE');
    if (sessionInfo) {
      sessionInfo.classList.add('hidden');
      sessionInfo.textContent = '';
    }
    if (pauseRaceBtn) {
      pauseRaceBtn.textContent = 'Pause';
      pauseRaceBtn.disabled = true;
    }
    if (startRaceBtn) {
      startRaceBtn.disabled = false;
    }
    if (replayRaceBtn) {
      replayRaceBtn.style.display = 'none';
    }
    leaderGapHud?.classList.add('hidden');
    if (highlightTicker) {
      highlightTicker.textContent = '';
    }
    if (top3Banner) {
      top3Banner.textContent = '';
      top3Banner.classList.add('hidden');
    }
    resetRaceControlLog();
    const trackIndex = gpRaceIndex < GP_RACES ? gpRaceIndex : GP_RACES - 1;
    const trackId = gpTrackRotation[trackIndex % gpTrackRotation.length];
    syncRaceSetupForTrack(trackId);
    if (resultsLabel) {
      resultsLabel.textContent = formatGpStatusText();
    }
    if (nextRaceBtn) {
      if (gpRaceIndex > 0 && gpRaceIndex < GP_RACES && gpTable.size > 0) {
        nextRaceBtn.style.display = 'inline-block';
      } else {
        nextRaceBtn.style.display = 'none';
      }
    }
    gpActive = gpRaceIndex < GP_RACES && (gpTable.size > 0 || gpRaceIndex === 0);
    if (fromResume && gpRaceIndex >= GP_RACES) {
      gpActive = false;
    }
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
      gpRaceIndex = Math.min(Math.max(obj.gpRaceIndex || 0, 0), GP_RACES);
      gpTable.clear();
      (obj.data || []).forEach(([key, value]) => gpTable.set(key, value));
      const hasEntries = gpTable.size > 0;
      gpActive = gpRaceIndex < GP_RACES && hasEntries;
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
    Object.entries(teamData.upgrades || {}).forEach(([key, level]) => {
      const div = document.createElement('div');
      div.className = 'upgradeCard';
      const baseValue = (template.base[key] || 0.6) * 100;
      const improved = baseValue + level * 4;
      div.innerHTML = `<strong>${UPGRADE_LABELS[key]}</strong><span>Stufe ${level}/${MAX_UPGRADE_LEVEL}</span><span>Basis: ${baseValue.toFixed(0)} → ${improved.toFixed(0)}</span>`;
      upgradeStatus.appendChild(div);
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
    renderCodexGarage();
    renderRaceArchive();
    renderHallOfFame();
  }

  function updateManagerView() {
    populateManagerTeamSelect();
    const teamName = managerState.selectedTeam;
    const teamData = managerState.teams[teamName];
    if (!teamData) return;
    const variant = getTeamVariant(teamName);
    focusTeam = teamName;
    if (managerBudget) managerBudget.textContent = formatCurrency(teamData.budget);
    if (managerSeasonLabel) managerSeasonLabel.textContent = managerState.seasonYear;
    if (managerWeekLabel) managerWeekLabel.textContent = managerState.week || 1;
    if (managerChassisLabel) managerChassisLabel.textContent = `${variant.codename} – ${variant.summary}`;
    const nextTrackId = getManagerTrackForWeek(managerState.week);
    if (managerNextTrack) managerNextTrack.textContent = trackCatalog[nextTrackId]?.label || nextTrackId;
    renderContracts(teamName, teamData);
    renderUpgradeStatus(teamName, teamData);
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

  function advanceManagerWeek() {
    const currentWeek = managerState.week || 1;
    let totalSpend = 0;
    const expiredDrivers = [];
    Object.entries(managerState.teams).forEach(([teamName, teamData]) => {
      const roster = Array.isArray(teamData.roster) ? teamData.roster : [];
      const updatedRoster = [];
      let salaryCost = 0;
      roster.forEach(contract => {
        if (!contract || !contract.driver) return;
        const driverInfo = driverMap.get(contract.driver);
        const salary = typeof contract.salary === 'number' ? contract.salary : (driverInfo ? driverInfo.salary : 320000);
        const decrement = 1 / MANAGER_SEASON_LENGTH;
        const years = Math.max(0, (typeof contract.years === 'number' ? contract.years : 1) - decrement);
        const moraleBase = clamp(contract.morale ?? 0.55, 0.1, 0.95);
        const morale = clamp(moraleBase - 0.02 + (teamData.form || 0) * 0.015, 0.1, 0.95);
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
      const spend = Math.round(salaryCost);
      totalSpend += spend;
      teamData.budget = Math.max(0, teamData.budget - spend);
      teamData.form = clamp((teamData.form || 0) * 0.9 - 0.01, -0.35, 0.5);
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
  }

  newRaceBtn?.addEventListener('click', () => {
    currentMode = 'quick';
    showScreen(raceScreen);
  });

  grandPrixBtn?.addEventListener('click', () => {
    currentMode = 'gp';
    const hasEntries = gpTable.size > 0;
    const canResume = hasEntries && gpRaceIndex < GP_RACES;
    const finished = hasEntries && gpRaceIndex >= GP_RACES;
    if (canResume || finished) {
      prepareGpLobbyState({ fromResume: true });
    } else {
      gpReset();
      prepareGpLobbyState();
    }
    showScreen(raceScreen);
  });

  resetGpBtn?.addEventListener('click', () => {
    const hasEntries = gpTable.size > 0;
    if (hasEntries) {
      const confirmReset = confirm('Aktuellen Grand Prix wirklich zurücksetzen? Fortschritt geht verloren.');
      if (!confirmReset) {
        return;
      }
    }
    currentMode = 'gp';
    gpReset();
    prepareGpLobbyState();
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
    hideGridIntro();
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    setRacePhase('IDLE');
    top3Banner.textContent = '';
    pauseRaceBtn.textContent = 'Pause';
    pauseRaceBtn.disabled = true;
    startRaceBtn.disabled = false;
    resultsLabel.textContent = '';
    leaderGapHud?.classList.add('hidden');
    resetRaceControlLog();
    showScreen(mainMenu);
    currentMode = 'quick';
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
    updateLeaderGap(lastTelemetryOrder);
    updateFocusPanel(lastTelemetryOrder);
  });

  gridIntroDismiss?.addEventListener('click', () => beginRaceCountdown());

  startRaceBtn?.addEventListener('click', () => startRace());
  pauseRaceBtn?.addEventListener('click', pauseToggle);
  replayRaceBtn?.addEventListener('click', () => {
    alert('Replay folgt in einer späteren Version.');
  });
  nextRaceBtn?.addEventListener('click', () => {
    nextRaceBtn.style.display = 'none';
    const nextTrack = gpTrackRotation[gpRaceIndex % gpTrackRotation.length];
    currentTrackType = nextTrack;
    if (trackTypeSelect) trackTypeSelect.value = currentTrackType;
    raceSettings.track = currentTrackType;
    persistRaceSettings();
    updateActiveTrackTraits();
    rebuildMini();
    refreshOddsTable();
    startRace();
  });

  renderTeams();
  updateManagerView();
  updateActiveTrackTraits();
  rebuildMini();
  refreshOddsTable();
  updateBettingUI();
  updateFastestLapLabel();
  showScreen(mainMenu);
  console.log('SPACER-X loaded');
})();
