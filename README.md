# SPACER‑X (Playable Prototype)
Futuristisches Top‑Down‑Racing mit TV‑UI, 14 Strecken (u. a. Atlas Skyway, Fracture Belt, Lumen Cascades), Grand‑Prix‑Modus (5 Rennen), Flags (Green/Yellow/Safety), Mini‑Map, Grid-Briefing-Overlay sowie persistente Profile und Rennarchiv (localStorage).

## Quickstart
1. ZIP entpacken
2. `index.html` im Browser öffnen (oder optional: `python3 -m http.server`)
3. **Einstellungen**: Strecke & Runden wählen → **Schnelles Rennen** oder **Grand Prix** starten

## Ordner & Dateien
- `index.html` – UI & Screens (Main Menu, Race, Teams, Settings)
- `styles.css` – Dark/Neo‑Noir Theme, Banner, Ticker, Mini‑Map
- `script.js` – Game‑Core (Track, Cars, Flags, GP‑Flow, UI Bindings)

## Steuerung
- Alles per UI (Start/Pause/Replay/Nächstes Rennen)
- Keine Tastatureingaben erforderlich

## Features (Stand)
- 14 Tracks inklusive Atlas Skyway, Fracture Belt und Lumen Cascades; TV‑UI (Top‑3, Ticker, Mini‑Map) & Grid-Briefing; Grand Prix (5 Rennen, Punkte, localStorage)
- Dynamische Broadcast-Kamera mit Auto-, Leader-, Battle- und Manual-Modus samt Overlay, Fokus-HUD und Speicherung der Präferenz
- Flags: Green/Yellow/Safety + Field‑Bunching + Restart + detaillierte Rennzusammenfassung (Fastest Lap, Sektor-Rekorde, Phasen)
- 24 Fahrer inklusive Free-Agent-Pool, Manager-Transfermarkt und teambezogenen Chassis-Profilen mit zufällig gerollten Fahrzeug-Stats
- Manager-Modus mit Wochen-Simulation, Vertragsverwaltung, Upgrades, Export/Import (JSON) sowie persistenter Chassis-Anzeige
- Dynamische Wetterprofile (klar/bewölkt/sturm/nacht) mit Event-Briefing, sendefähigem HUD und gespeicherten Rennen-Settings
- Live-Leaderboard-Overlay auf dem Canvas plus Meldungs-Panel mit Zeitstempeln für Überholungen, Flaggen und Specials
- Codex & Archiv: Lore-Einträge, Team-Garage, Hall-of-Fame und automatisches Rennarchiv mit Schnellzugriff auf Siege & Fastest Laps
- Live-Gap-HUD mit Delta-Bar, Phasen-Timeline im Ergebnisbericht sowie `window.spacerxDiagnostics` für Race-Control-Diagnosen
