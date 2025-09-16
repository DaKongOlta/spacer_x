# HANDOVER for SPACER‑X
Dieser Leitfaden macht dich in wenigen Minuten „codex‑ready“.

## Ziele (kurz)
- Spielbar & stabil (Quick Race, GP 5 Rennen)
- Flag‑System (Yellow vs Safety) + Restart‑Logik
- TV‑/Broadcast‑UI (Top‑3, Ticker, Splits, PB/FL)
- Manager‑Grundlagen (Budget/Contracts/Upgrades, Save/Load)
- Special: Race Betting (Stub)

## Code‑Karte (script.js)
- **Track**:
  - `trackPos(t)` – Parametrische Strecke (Oval/Wavy/Figure‑8), liefert `{x,y,angle}`
  - `rebuildMini()` – Samples für Mini‑Map
- **Cars**:
  - `class Car` – Eigenschaften: `baseSpeed, risk, intel, consist, progress, lap, finished, pitLap, pitted`
  - `Car.update(dt, leader)` – Flags/Pits/Jitter/Krümmungs‑Penalty, Lap‑Zählung, Finish
  - `createField()` – 20 Fahrzeuge aus Teams/Fahrern erzeugen
  - `applyGridPositions(mode)` – Standing/Staggered Grid‑Offsets
- **Race Control**:
  - Globale Flags: `yellowUntil`, `safetyUntil`
  - `gameLoop(ts)` – Update/Draw/Telemetry, Endcheck
  - `finishRace()` – Replay‑Button, GP‑Zwischenstände, Next‑Race
  - GP: `gpReset/gpAccumulate/gpStandingsText/gpSave` (+ localStorage)
- **Draw**:
  - `drawTrack/drawCars/drawMiniMap/drawScene` – Canvas‑Render
- **UI Bindings**: main menu, settings, race controls

## Bekannte Stellen für Erweiterungen
- **Sektoren**: an `trackPos(t)` 3 Sektor‑Grenzen definieren; in `Car.update` Zwischenzeiten protokollieren; in UI highlighten (PB/FL)
- **Gap zum Leader**: derzeit approximiert in `updateTelemetry(leader)` → auf „echte“ Zeitbasis erweitern, wenn Laptime‑Ticker vorhanden
- **Safety‑/Yellow‑Timers**: harte Zeiten → Queue/State‑Machine (states: GREEN/YELLOW/SC/RESTART)

## Akzeptanzkriterien (Auszug)
- **Race‑Start**: 20 Autos, Grid korrekt (Standing/Staggered), Countdown → Green
- **Yellow**: Tempo ~80 %, kein Überholen, Banner „YELLOW“
- **Safety**: Tempo ~55 %, Field‑Bunching, nach Ablauf **Green Restart**
- **GP**: Punkte addieren, Zwischenstand anzeigen, nach 5 Rennen „GP abgeschlossen“

## Dev‑Konventionen
- Keine Frameworks; Vanilla Canvas + DOM
- Pure Functions wo möglich; Side‑Effects klar bündeln
- PR‑Tags: `[race] [tv] [gp] [mgr] [spec] [perf] [refactor]`

## „Paste‑in“ Prompt für kodex
> Du bist **Codex**. Lade die beigefügten Dateien (index.html, styles.css, script.js). Implementiere nacheinander:

> 1) GP‑Race‑Control Polish: getrennte YELLOW vs SAFETY States inkl. Banner & schnellere Bunching/Restart‑Logik (State‑Machine),

> 2) TV‑UI Splits (S1/S2/S3) mit PB/FL, Gap‑Bar vs Leader,

> 3) Manager‑Mode v1 (Budget, Contracts, Upgrades), Save/Load als JSON Export/Import,

> 4) Special: Race Betting (Stub) mit Quoten & Payout.

> Halte die öffentlichen Funktionen & IDs stabil. Schreibe kleinen, sauberen Code, ohne externe Abhängigkeiten.
