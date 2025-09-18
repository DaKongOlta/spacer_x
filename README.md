# SPACER‑X (Playable Prototype)
Futuristisches Top‑Down‑Racing mit TV‑UI, 16 Strecken (u. a. Atlas Skyway, Fracture Belt, Eclipse Citadel, Rift Meridian, Lumen Cascades), Grand‑Prix‑Modus (5 Rennen), Flags (Green/Yellow/Safety), Mini‑Map, Grid-Briefing-Overlay sowie persistente Profile und Rennarchiv (localStorage).

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
- 16 Tracks inklusive Atlas Skyway, Fracture Belt, Eclipse Citadel, Rift Meridian und Lumen Cascades; TV‑UI (Top‑3, Ticker, Mini‑Map) & Grid-Briefing; Grand Prix (5 Rennen, Punkte, localStorage)
- Hauptmenü mit separatem „Neuer GP“ und „Fortsetzen“-Button samt Fortschrittsanzeige
- Grand-Prix-Statuskarte im Hauptmenü mit Track-Vorschau, Wetterausblick und Top-3-Standing
- Dynamische Broadcast-Kamera mit Auto-, Leader-, Battle- und Manual-Modus samt Overlay, Fokus-HUD und Speicherung der Präferenz
- Flags: Green/Yellow/Safety + adaptive Field‑Bunching + Restart + detaillierte Rennzusammenfassung (Fastest Lap, Sektor-Rekorde, Phasen)
- Dynamische Caution-Bunching-Logik hält den Pulk in Yellow/Safety-Phasen innerhalb des Zielabstands und beschleunigt Release-
  Sequenzen mit Telemetrie-Audit
- Restart‑Freigabe mit „No Overtake before Line“-Fenster: Überholverbote bleiben Sekunden nach Green aktiv, inklusive HUD-Countdown, Ticker-Hinweis und automatischer Freigabe-Meldung
- Jump-Start-Detection für Standing/Staggered-Verfahren warnt Race Control & Ticker bei Frühstarts ohne das Rennen zu stoppen
- Rolling-Start-Formation-Lap mit Countdown-Reintegration, dynamischem Race-Clock-Offset und Gap-Trends im Leaderboard
- Startlicht-Sequenz mit Broadcast-Light-Overlay, Audio-Cues (Start, Green, Yellow, Safety) und TV-würdiger Countdown-Choreografie
- Slime-Marshal-Overlay mit animierten Zielflaggen bringt das Maskottchen an die Startlinie und begleitet die Countdown-Signale
- Broadcast-Newsdesk-Intro mit Strecken-Lore, Wetterbriefing und Pace-Favoriten vor jedem Rennstart
- Strenge Gelb-/Safety-Car-Überwachung mit automatischer Positionsrückgabe bei Verstößen und verfeinertem Boxenstopp-Prozess
- Cinematisches Hauptmenü mit Twitch-Mode- und Stream-Deck-Teaser samt Sprite-Showcase für neue Gleiter-Varianten
- Neo-Noir-Backdrops rendern pro Strecke individuelle Skyline-Glows, Sternenfelder und Grid-Linien für mehr Retro-Atmosphäre
- 24 Fahrer inklusive Free-Agent-Pool, Manager-Transfermarkt und teambezogenen Chassis-Profilen mit zufällig gerollten Fahrzeug-Stats
- Manager-Modus mit Wochen-Simulation, Vertragsverwaltung, Upgrades, Export/Import (JSON) sowie persistenter Chassis-Anzeige
- Dynamische Wetterprofile (klar/bewölkt/sturm/nacht/ionensturm) mit Event-Briefing, sendefähigem HUD und gespeicherten Rennen-Settings
- TV-Replay mit Zeitachse, Geschwindigkeitswahl und sofortigem Wiedereinstieg in jede Rennphase inklusive Sieg-Podium-Overlay
- Live-Leaderboard-Overlay auf dem Canvas plus Meldungs-Panel mit Zeitstempeln für Überholungen, Flaggen und Specials
- Incident-/Overtake-Banner-Queue blendet zweizeilige TV-Callouts für Flaggen, Safety-Car-Deployments und Überholmanöver ein
- Mini-Map mit markierten Sektoren, Leader-Halo und Fokus-Ring für klarere TV-Analyse
- Einstellbare HUD- und Audio-Optionen (Ticker, Race-Control, Fokus, Mini-Map, Broadcast-Sounds) werden pro Profil gespeichert
- Codex & Archiv: Lore-Einträge, Fahrer-Persönlichkeiten, Team-Garage, Hall-of-Fame und automatisches Rennarchiv mit Schnellzugriff auf Siege & Fastest Laps
- Live-Gap-HUD mit Delta-Bar, Phasen-Timeline im Ergebnisbericht sowie `window.spacerxDiagnostics` für Race-Control-Diagnosen
- Globale Speicherverwaltung: Profil-Export/Import (JSON) inkl. Manager, GP, Wetten, Archiv & UI-Settings sowie kompletter Speicher-Reset im Einstellungsmenü
- Codex-Roadmap mit Status-Badges für Demo-, Broadcast- und Community-Meilensteine
- Lore-, Flaggen- und Chassis-Sprites als SVG-Assets für weitere UI-Iterationen

## Content Roadmap Snapshot
- **Race-Control Demo Stack** – Formation/Grid-Briefings fertig, Restart-Hold aktiv; State-Machine & adaptive Bunching ausgeliefert
- **Broadcast HUD v2** – Gap-Trends, Sektor-Gates & Incident-Banner live; nächste Schritte: erweiterte Highlight-Queue
- **Manager & Saison-Tiefe** – Transfermarkt steht, nächste Schritte: Staff-Systeme, Facility-Upgrades, Saison-Save-Validierung
- **Streaming & Tools** – Twitch-Mode & Stream-Deck-Plugin als Developer Preview im Menü angeteasert, Websocket/Chat-Hooks folgen
