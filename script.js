
/* SPACER‑X gameplay core (clean rebuild) */
(() => {
  // ---- Teams & Drivers ----
  const allTeamNames = [
    "Apex Nova","VoltWorks","Nebula GP","Quantum Edge","Zenith Motors","HyperFlux",
    "Orion Dynamics","Vortex Racing","StellarPulse","Ion Storm","DeltaDrive","Aurora Tech",
    "Cyclone Engineering","Phoenix Labs"
  ];
  const driverPool = [
    "Kai R.", "Mika J.", "Nova L.", "Rex V.", "Lia S.", "Yuki T.", "Aris K.", "Zane P.",
    "Vale D.", "Iris F.", "Kato N.", "Noor H.", "Zara X.", "Odin M.", "Lio C.", "Vega B.",
    "Suri W.", "Nox G.", "Eiko Y.", "Pax Q."
  ];
  const teamColors = {};
  allTeamNames.forEach((name, i) => {
    const hue = Math.floor(i * 360 / allTeamNames.length);
    teamColors[name] = `hsl(${hue},80%,50%)`;
  });

  // First 6 teams have 2 drivers, others 1 => 20 cars
  let teamAssignment = [];
  allTeamNames.forEach((team, idx) => {
    if (idx < 6) teamAssignment.push(team, team);
    else teamAssignment.push(team);
  });
  while (teamAssignment.length < 20) teamAssignment.push(allTeamNames[teamAssignment.length % allTeamNames.length]);

  // ---- DOM ----
  const mainMenu = document.getElementById("mainMenu");
  const raceScreen = document.getElementById("raceScreen");
  const teamsScreen = document.getElementById("teamsScreen");
  const settingsScreen = document.getElementById("settingsScreen");

  const newRaceBtn = document.getElementById("newRaceBtn");
  const grandPrixBtn = document.getElementById("grandPrixBtn");
  const teamsBtn = document.getElementById("teamsBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const backToMenuFromRace = document.getElementById("backToMenuFromRace");
  const backToMenuFromTeams = document.getElementById("backToMenuFromTeams");
  const backToMenuFromSettings = document.getElementById("backToMenuFromSettings");

  const canvas = document.getElementById("raceCanvas");
  const ctx = canvas.getContext("2d");
  const miniMap = document.getElementById("miniMapCanvas");
  const mm = miniMap.getContext("2d");
  const startRaceBtn = document.getElementById("startRaceBtn");
  const pauseRaceBtn = document.getElementById("pauseRaceBtn");
  const replayRaceBtn = document.getElementById("replayRaceBtn");
  const nextRaceBtn = document.getElementById("nextRaceBtn");
  const telemetryList = document.getElementById("telemetryList");
  const lapInfoLabel = document.getElementById("lapInfoLabel");
  const raceTimeLabel = document.getElementById("raceTimeLabel");
  const resultsLabel = document.getElementById("resultsLabel");
  const teamsList = document.getElementById("teamsList");
  const top3Banner = document.getElementById("top3Banner");
  const raceFlag = document.getElementById("raceFlag");
  const highlightTicker = document.getElementById("highlightTicker");

  const zoomSetting = document.getElementById("zoomSetting");
  const trackTypeSelect = document.getElementById("trackType");
  const lapsSetting = document.getElementById("lapsSetting");
  const aiDifficulty = document.getElementById("aiDifficulty");
  const startProc = document.getElementById("startProc");

  // ---- Screens ----
  function showScreen(s) {
    [mainMenu, raceScreen, teamsScreen, settingsScreen].forEach(el => el.classList.remove("active"));
    s.classList.add("active");
  }

  // ---- Settings state ----
  let currentTrackType = trackTypeSelect?.value || "oval";
  let totalLaps = parseInt(lapsSetting?.value || "15", 10);
  trackTypeSelect?.addEventListener("change", () => currentTrackType = trackTypeSelect.value);
  lapsSetting?.addEventListener("change", () => totalLaps = parseInt(lapsSetting.value,10));

  // ---- Race State ----
  const cars = [];
  let raceActive = false;
  let raceTime = 0;
  let replayFrames = [];
  let recordInterval = null;
  let championshipResults = [];
  let safetyUntil = 0;
  let yellowUntil = 0;

  // GP Mode
  let gpActive = false, gpRaceIndex = 0;
  const GP_RACES = 5;
  const GP_POINTS = [25,18,15,12,10,8,6,4,2,1];
  const gpTable = new Map();
  function gpReset(){ gpActive=true; gpRaceIndex=0; gpTable.clear(); gpSave(); }
  function gpAccumulate(){
    const order = cars.filter(c=>c.finished).sort((a,b)=>a.finishTime-b.finishTime);
    order.forEach((c,i) => {
      const pts = GP_POINTS[i]||0;
      if (!gpTable.has(c.id)) gpTable.set(c.id, {points:0, team:c.team, driver:c.driver, number:c.racingNumber});
      gpTable.get(c.id).points += pts;
    });
    gpSave();
  }
  function gpStandingsText(){
    const arr = Array.from(gpTable.entries()).map(([id,o])=>({id,...o})).sort((a,b)=>b.points-a.points);
    let t = `\nGP Zwischenstand nach Rennen ${gpRaceIndex}/${GP_RACES}:\n`;
    arr.slice(0,10).forEach((o,i)=>{ t+= `${i+1}. #${o.number} ${o.driver} (${o.team}) – ${o.points} P\n`; });
    return t;
  }
  function gpSave(){
    try{
      const data = Array.from(gpTable.entries());
      localStorage.setItem("spacerx_gp", JSON.stringify({gpRaceIndex, data}));
    }catch(e){}
  }
  (function gpLoad(){
    try{
      const raw = localStorage.getItem("spacerx_gp"); if(!raw) return;
      const obj = JSON.parse(raw);
      gpRaceIndex = obj.gpRaceIndex||0;
      gpTable.clear(); (obj.data||[]).forEach(([id,o])=>gpTable.set(id,o));
    }catch(e){}
  })();

  // ---- Track Geometry ----
  const trackCenter = {x: canvas.width/2, y: canvas.height/2};
  const baseRadiusX = canvas.width*0.35;
  const baseRadiusY = canvas.height*0.28;

  function trackPos(t){
    let x,y,dx,dy;
    if(currentTrackType==="oval"){
      x = trackCenter.x + baseRadiusX*Math.cos(t);
      y = trackCenter.y + baseRadiusY*Math.sin(t);
      dx = -baseRadiusX*Math.sin(t);
      dy =  baseRadiusY*Math.cos(t);
    } else if(currentTrackType==="wavy"){
      const rx = baseRadiusX*(1+0.20*Math.sin(3*t));
      const ry = baseRadiusY*(1+0.15*Math.cos(2*t));
      x = trackCenter.x + rx*Math.cos(t);
      y = trackCenter.y + ry*Math.sin(t);
      dx = -rx*Math.sin(t) + (0.20*3*baseRadiusX*Math.cos(3*t))*Math.cos(t);
      dy =  ry*Math.cos(t) - (0.15*2*baseRadiusY*Math.sin(2*t))*Math.sin(t);
    } else { // fig8
      x = trackCenter.x + baseRadiusX*Math.sin(t);
      y = trackCenter.y + baseRadiusY*Math.sin(2*t);
      dx =  baseRadiusX*Math.cos(t);
      dy =  2*baseRadiusY*Math.cos(2*t);
    }
    const angle = Math.atan2(dy,dx);
    return {x,y,angle};
  }

  // Precompute minimap samples
  let miniSamples = [];
  function rebuildMini(){
    miniSamples = [];
    for(let i=0;i<256;i++){
      const t = (i/256)*Math.PI*2;
      const p = trackPos(t);
      miniSamples.push({x:p.x,y:p.y});
    }
  }
  rebuildMini();

  // ---- Car ----
  let nextId = 1;
  class Car {
    constructor(team, driver, number, baseSpeed, risk, intel, consist){
      this.id = nextId++;
      this.team = team;
      this.driver = driver;
      this.racingNumber = number;
      this.color = teamColors[team] || "#6ee7ff";
      this.baseSpeed = baseSpeed; // m/s equivalent
      this.risk = risk; this.intel = intel; this.consist = consist;

      this.progress = 0; // angle (0..2π * laps)
      this.lap = 1;
      this.finished = false;
      this.finishTime = null;
      this.deltaHist = [];
      this.trail = [];
      this.crashCooldown = 0;
      this.pitLap = Math.max(2, Math.floor(totalLaps*(0.45+Math.random()*0.15)));
      this.pitted = false;
      this.pitTimer = 0;

      this.gridOffset = {x:0,y:0}; // set at start
    }
    getPosition(){
      const p = trackPos(this.progress);
      // grid offset on lap 1 near start area
      if(this.lap===1 && this.progress<0.05){
        return {x:p.x+this.gridOffset.x, y:p.y+this.gridOffset.y, angle:p.angle};
      }
      return p;
    }
    update(dt, leader){
      if(this.finished) return;

      // randomness/consistency
      const jitter = (Math.random()-0.5)*0.6*(1-this.consist);
      let speed = this.baseSpeed + jitter;

      // curvature penalty: approximate by rate of change along path
      const kappa = 0.8 + 0.2*Math.cos(this.progress*3);
      speed -= (1-this.intel)*0.7*kappa;

      // flags
      if(raceTime < safetyUntil) speed *= 0.55;
      else if(raceTime < yellowUntil) speed *= 0.80;

      // simple pit slow lap
      if(!this.pitted && this.lap===this.pitLap && this.progress<0.25){
        this.pitTimer += dt; speed *= 0.55;
        if(this.pitTimer>5){ this.pitted = true; }
      }

      // catch-up during safety to bunch field
      if(raceTime < safetyUntil && leader){
        const gap = (leader.progress - this.progress);
        if(gap>0.02) speed *= 1.15; // gently pull forward
      }

      // occasional incidents based on risk (cooldown avoids spam)
      if(this.crashCooldown<=0 && Math.random()<0.0007+this.risk*0.001){
        // choose yellow or safety based on severity
        if(Math.random()<0.4){ yellowUntil = Math.max(yellowUntil, raceTime+8); pushTicker(`${this.driver} (YELLOW at Lap ${this.lap})`,"yellow"); }
        else { safetyUntil = Math.max(safetyUntil, raceTime+12); pushTicker(`${this.driver} (SAFETY CAR at Lap ${this.lap})`,"sc"); }
        this.crashCooldown = 10;
      } else {
        this.crashCooldown -= dt;
      }

      // integrate
      const dprog = speed * dt * 0.35 / (1+0); // scale to canvas
      const prevLap = this.lap;
      this.progress += dprog;
      if(this.progress >= Math.PI*2){
        this.progress -= Math.PI*2;
        this.lap++;
      }

      // trail
      const pos = this.getPosition();
      this.trail.push({x:pos.x,y:pos.y});
      if(this.trail.length>40) this.trail.shift();

      // finish
      if(this.lap>totalLaps && !this.finished){
        this.finished = true; this.finishTime = raceTime;
        pushTicker(`${this.driver} im Ziel (${this.team})`,"finish");
      }
    }
  }

  // ---- UI: Teams ----
  function renderTeams(){
    teamsList.innerHTML = "";
    const byTeam = {};
    teamAssignment.forEach((t,i) => {
      if(!byTeam[t]) byTeam[t]=[];
      byTeam[t].push(i);
    });
    Object.keys(byTeam).forEach(team => {
      const box = document.createElement("div");
      box.style.border = "1px solid #1e293b";
      box.style.borderRadius = "10px";
      box.style.padding = "8px";
      box.style.margin = "6px 0";
      const color = teamColors[team];
      const idxs = byTeam[team];
      const drivers = idxs.map(i => driverPool[i%driverPool.length]).join(", ");
      box.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
        <strong style="color:${color}">● ${team}</strong>
        <span>${drivers}</span></div>`;
      teamsList.appendChild(box);
    });
  }

  // ---- UI: Flag / Ticker ----
  function setFlag(mode){
    raceFlag.classList.remove("hidden","green","yellow","sc");
    if(mode==="green"){ raceFlag.textContent="GREEN FLAG"; raceFlag.classList.add("green"); }
    else if(mode==="yellow"){ raceFlag.textContent="YELLOW FLAG"; raceFlag.classList.add("yellow"); }
    else if(mode==="sc"){ raceFlag.textContent="SAFETY CAR"; raceFlag.classList.add("sc"); }
    else { raceFlag.classList.add("hidden"); }
  }
  function pushTicker(msg, type){
    const tag = type==="yellow"?"🟨": type==="sc"?"🚨":"🏁";
    highlightTicker.textContent = `${tag} ${msg}`;
  }

  // ---- Start Grid ----
  function applyGridPositions(mode){
    // Build 4x5 grid offsets
    const rowGap = 16, colGap = 28;
    const baseX = -46, baseY = -8;
    const positions = [];
    for(let r=0;r<4;r++){
      for(let c=0;c<5;c++){
        const offX = baseX + c*colGap + (mode==="staggered" && r%2? colGap*0.5:0);
        const offY = baseY + r*rowGap;
        positions.push({x:offX, y:offY});
      }
    }
    // randomize grid order slightly
    const order = [...cars];
    order.sort(()=>Math.random()-0.5);
    order.forEach((car,i)=>{
      const p = positions[i];
      car.gridOffset = {x:p.x, y:p.y};
    });
  }

  // ---- Race Control ----
  let lastFrame = 0;
  function gameLoop(ts){
    if(!raceActive){ return; }
    const dt = Math.max(0.016, Math.min(0.05, (ts-lastFrame)/1000)); lastFrame = ts;
    raceTime += dt;

    // Flags/Green state
    if(raceTime < safetyUntil) setFlag("sc");
    else if(raceTime < yellowUntil) setFlag("yellow");
    else setFlag("green");

    // Leader ref
    const leader = cars.filter(c=>!c.finished).sort((a,b)=> (b.lap-a.lap) || (a.progress-b.progress))[0] || null;

    // Update cars
    cars.forEach(c => c.update(dt, leader));

    // Drawing
    drawScene();

    // Telemetry
    updateTelemetry(leader);

    // Check end
    if(cars.every(c=>c.finished)){
      finishRace();
    } else {
      requestAnimationFrame(gameLoop);
    }
  }

  function finishRace(){
    raceActive = false;
    replayRaceBtn.style.display = "inline-block";
    if(gpActive){
      gpAccumulate(); gpRaceIndex++;
      let text = "Rennen beendet!\n";
      text += gpStandingsText();
      if(gpRaceIndex < GP_RACES) { nextRaceBtn.style.display="inline-block"; }
      else { text += "\nGP abgeschlossen."; gpActive=false; }
      resultsLabel.textContent = text;
    } else {
      resultsLabel.textContent = "Rennen beendet!";
    }
  }

  // ---- Draw ----
  function drawTrack(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#0a1320"; ctx.fillRect(0,0,canvas.width,canvas.height);
    // asphalt ribbon
    ctx.strokeStyle="#1f2937"; ctx.lineWidth=60; ctx.lineCap="round"; ctx.beginPath();
    for(let i=0;i<=256;i++){
      const t=(i/256)*Math.PI*2;
      const p = trackPos(t);
      if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
    }
    ctx.closePath(); ctx.stroke();
    // middle white lane
    ctx.strokeStyle="#94a3b8"; ctx.lineWidth=2; ctx.beginPath();
    for(let i=0;i<=256;i+=3){
      const t=(i/256)*Math.PI*2;
      const p = trackPos(t);
      if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
    }
    ctx.stroke();
  }

  function drawCars(){
    cars.forEach(car => {
      const pos = car.getPosition();
      // trail
      ctx.strokeStyle = car.color + "55"; ctx.lineWidth=2; ctx.beginPath();
      car.trail.forEach((pt,idx)=> idx===0? ctx.moveTo(pt.x,pt.y): ctx.lineTo(pt.x,pt.y));
      ctx.stroke();

      // body
      ctx.save();
      ctx.translate(pos.x,pos.y);
      ctx.rotate(pos.angle);
      ctx.fillStyle = car.color;
      roundRect(ctx,-14,-8,28,16,5); ctx.fill();
      // number stripe
      ctx.fillStyle = "#0b0f17"; ctx.fillRect(-4,-8,8,16);
      ctx.restore();
    });
  }

  function drawMiniMap(){
    mm.clearRect(0,0,miniMap.width,miniMap.height);
    mm.fillStyle="#0b0f17"; mm.fillRect(0,0,miniMap.width,miniMap.height);
    // fit samples into minimap
    const minX = Math.min(...miniSamples.map(p=>p.x));
    const maxX = Math.max(...miniSamples.map(p=>p.x));
    const minY = Math.min(...miniSamples.map(p=>p.y));
    const maxY = Math.max(...miniSamples.map(p=>p.y));
    const sx = (miniMap.width-10)/(maxX-minX);
    const sy = (miniMap.height-10)/(maxY-minY);
    const k = Math.min(sx,sy);
    const ox = 5 - minX*k;
    const oy = 5 - minY*k;

    // path
    mm.strokeStyle="#243b55"; mm.lineWidth=3; mm.beginPath();
    miniSamples.forEach((p,i)=> i===0 ? mm.moveTo(p.x*k+ox,p.y*k+oy) : mm.lineTo(p.x*k+ox,p.y*k+oy));
    mm.closePath(); mm.stroke();

    // cars
    cars.forEach(c=>{
      const pos = c.getPosition();
      const x = pos.x*k+ox, y = pos.y*k+oy;
      mm.fillStyle = c.color; mm.beginPath(); mm.arc(x,y,3,0,Math.PI*2); mm.fill();
    });
  }

  function drawScene(){
    drawTrack();
    drawCars();
    drawMiniMap();
    // Top-3 banner
    const order = cars.slice().sort((a,b)=> (b.lap-a.lap) || (a.progress-b.progress));
    const txt = order.slice(0,3).map((c,i)=> `${i+1}. #${c.racingNumber} ${c.driver}`).join("   ");
    if(txt){ top3Banner.textContent = txt; top3Banner.classList.remove("hidden"); }
  }

  // ---- Telemetry ----
  function updateTelemetry(leader){
    telemetryList.innerHTML = "";
    const order = cars.slice().sort((a,b)=> (b.lap-a.lap) || (a.progress-b.progress));
    let leaderPos = null;
    if(order.length) leaderPos = {lap: order[0].lap, prog: order[0].progress};
    order.forEach((car, idx) => {
      const li = document.createElement("li");
      let gapTxt = "";
      if(leaderPos && idx>0){
        let gapLaps = leaderPos.lap - car.lap;
        let gapProg = leaderPos.prog - car.progress;
        if(gapProg<0) { gapLaps -= 1; gapProg += Math.PI*2; }
        const gapSec = (gapLaps*(Math.PI*2) + gapProg) / 0.35; // inverse of speed-scale; approx seconds
        const cls = gapSec>0 ? "gapPlus":"gapMinus";
        gapTxt = ` <span class="${cls}">+${gapSec.toFixed(1)}s</span>`;
      }
      li.innerHTML = `<span>${idx+1}.</span> <strong style="color:${car.color}">#${car.racingNumber}</strong> ${car.driver} <em>Lap ${Math.min(car.lap,totalLaps)}</em>${gapTxt}`;
      telemetryList.appendChild(li);
    });
    const curLap = Math.min(...cars.map(c=>c.lap));
    lapInfoLabel.textContent = `Runde: ${Math.min(curLap,totalLaps)} / ${totalLaps}`;
    raceTimeLabel.textContent = `Rennzeit: ${raceTime.toFixed(1)} s`;
  }

  // ---- RoundRect helper ----
  function roundRect(ctx,x,y,w,h,r){
    const rr = Math.min(r, Math.abs(w)/2, Math.abs(h)/2);
    ctx.beginPath();
    ctx.moveTo(x+rr, y);
    ctx.quadraticCurveTo(x, y, x, y+rr);
    ctx.lineTo(x, y+h-rr);
    ctx.quadraticCurveTo(x, y+h, x+rr, y+h);
    ctx.lineTo(x+w-rr, y+h);
    ctx.quadraticCurveTo(x+w, y+h, x+w, y+h-rr);
    ctx.lineTo(x+w, y+rr);
    ctx.quadraticCurveTo(x+w, y, x+w-rr, y);
    ctx.closePath();
  }

  // ---- Race wiring ----
  function createField(){
    cars.length = 0;
    nextId = 1;
    for(let i=0;i<20;i++){
      const team = teamAssignment[i % teamAssignment.length];
      const driver = driverPool[i % driverPool.length];
      const number = (i+1);
      const baseSpeed = 12 + Math.random()*5; // spread
      const risk = Math.random()*0.8;
      const intel = 0.6 + Math.random()*0.4;
      const consist = 0.5 + Math.random()*0.5;
      cars.push(new Car(team, driver, number, baseSpeed, risk, intel, consist));
    }
  }

  function startRace(){
    raceTime = 0; safetyUntil = 0; yellowUntil=0;
    replayFrames = []; championshipResults = [];
    resultsLabel.textContent = "";
    startRaceBtn.disabled = true;
    replayRaceBtn.style.display = "none";
    if(nextRaceBtn) nextRaceBtn.style.display="none";
    createField();
    applyGridPositions(startProc.value);
    rebuildMini();

    // Countdown then GO
    const countdown = [3,2,1,"GO"];
    let idx = 0;
    const id = setInterval(()=>{
      if(idx<countdown.length){
        setFlag(typeof countdown[idx]==="number"?"yellow":"green");
        top3Banner.classList.remove("hidden");
        top3Banner.textContent = `Start in ${countdown[idx]}`;
        idx++;
      } else {
        clearInterval(id);
        top3Banner.textContent = "";
        raceActive = true;
        requestAnimationFrame((t)=>{ lastFrame=t; requestAnimationFrame(gameLoop); });
      }
    }, 1000);
  }

  function pauseToggle(){
    if(!raceActive){ return; }
    raceActive = false;
    pauseRaceBtn.textContent = "Fortsetzen";
    setTimeout(()=>{ // resume on click
      pauseRaceBtn.onclick = () => {
        raceActive = true;
        pauseRaceBtn.textContent = "Pause";
        pauseRaceBtn.onclick = pauseToggle;
        requestAnimationFrame((t)=>{ lastFrame=t; requestAnimationFrame(gameLoop); });
      };
    },0);
  }

  // ---- Events ----
  newRaceBtn.addEventListener("click", () => { showScreen(raceScreen); });
  grandPrixBtn.addEventListener("click", () => { gpReset(); showScreen(raceScreen); });
  teamsBtn.addEventListener("click", () => { renderTeams(); showScreen(teamsScreen); });
  settingsBtn.addEventListener("click", () => { showScreen(settingsScreen); });
  backToMenuFromRace.addEventListener("click", () => { raceActive=false; showScreen(mainMenu); });
  backToMenuFromTeams.addEventListener("click", () => showScreen(mainMenu));
  backToMenuFromSettings.addEventListener("click", () => showScreen(mainMenu));

  startRaceBtn.addEventListener("click", () => startRace());
  pauseRaceBtn.addEventListener("click", pauseToggle);
  replayRaceBtn.addEventListener("click", () => { alert("Replay stub – wird gleich erweitert."); });
  nextRaceBtn.addEventListener("click", () => {
    nextRaceBtn.style.display = "none";
    // rotate track type for next GP race
    const order = ["oval","wavy","fig8"];
    const nextIdx = (order.indexOf(currentTrackType)+1) % order.length;
    currentTrackType = order[nextIdx];
    gpRaceIndex = Math.min(gpRaceIndex, GP_RACES-1);
    startRace();
  });

  // initial
  console.log("SPACER‑X loaded");
})();
