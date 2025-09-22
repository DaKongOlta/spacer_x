# SPACER‑X (Playable Prototype)
Futuristisches Top‑Down‑Racing mit TV‑UI, 20 Strecken (u. a. City Grand Prix, Canyon Sprint, Atlas Skyway, Glacier Traverse, Maelstrom Gauntlet, Fracture Belt, Eclipse Citadel, Rift Meridian, Lumen Cascades), Grand‑Prix‑Modus (5 Rennen), Flags (Green/Yellow/Safety), Mini‑Map, Grid-Briefing-Overlay sowie persistente Profile und Rennarchiv (localStorage).

## Quickstart
1. ZIP entpacken
2. `index.html` im Browser öffnen (oder optional: `python3 -m http.server`)
3. **Einstellungen**: Strecke & Runden wählen → **Schnelles Rennen** oder **Grand Prix** starten

## Ordner & Dateien
- `index.html` – UI & Screens (Main Menu, Race, Teams, Settings)
- `styles.css` – Dark/Neo‑Noir Theme, Banner, Ticker, Mini‑Map
- `script.js` – Game‑Core (Track, Cars, Flags, GP‑Flow, UI Bindings)
- `assets/data/tracks.json` – Track-Katalog (Label, Theme, Traits, Lore) für Modding & Rotation

## Steuerung
- Alles per UI (Start/Pause/Replay/Nächstes Rennen)
- Keine Tastatureingaben erforderlich

## Features (Stand)
- 20 Tracks inklusive City Grand Prix, Canyon Sprint, Glacier Traverse, Maelstrom Gauntlet, Atlas Skyway, Fracture Belt, Eclipse Citadel, Rift Meridian und Lumen Cascades; TV‑UI (Top‑3, Ticker, Mini‑Map) & Grid-Briefing; Grand Prix (5 Rennen, Punkte, localStorage)
- Track-Selector, Grand-Prix-Rotation und Manager-Kalender lesen dynamisch aus `assets/data/tracks.json` (Fallback für `file://`-Start inklusive)
- Hauptmenü mit separatem „Neuer GP“ und „Fortsetzen“-Button samt Fortschrittsanzeige
- Grand-Prix-Statuskarte im Hauptmenü mit Track-Vorschau, Wetterausblick und Top-3-Standing
- Grand-Prix-Runden springen nach dem Zieleinlauf automatisch zum nächsten Track – Startbutton & Briefing zeigen sofort das folgende Event
- Dynamische Broadcast-Kamera mit Auto-, Leader-, Battle- und Manual-Modus samt Overlay, Fokus-HUD und Speicherung der Präferenz
- Flags: Green/Yellow/Safety + adaptive Field‑Bunching + Restart + detaillierte Rennzusammenfassung (Fastest Lap, Sektor-Rekorde, Phasen)
- Dynamische Caution-Bunching-Logik hält den Pulk in Yellow/Safety-Phasen innerhalb des Zielabstands und beschleunigt Release-
  Sequenzen mit Telemetrie-Audit
- Restart‑Freigabe mit „No Overtake before Line“-Fenster: Überholverbote bleiben Sekunden nach Green aktiv, inklusive HUD-Countdown, Ticker-Hinweis und automatischer Freigabe-Meldung
- Jump-Start-Detection für Standing/Staggered-Verfahren warnt Race Control & Ticker bei Frühstarts ohne das Rennen zu stoppen
- Rolling-Start-Formation-Lap mit Countdown-Reintegration, dynamischem Race-Clock-Offset und Gap-Trends im Leaderboard
- Startlicht-Sequenz mit Broadcast-Light-Overlay, Audio-Cues (Start, Green, Yellow, Safety) und TV-würdiger Countdown-Choreografie
- Safety-, Restart- und Finish-SFX liefern markante Audio-Cues für jede Race-Control-Phase
- Titelbildschirm-Jingle im Neo-Noir-Sounddesign, der nach der ersten Interaktion startet und beim Wechsel ins Spiel sauber ausfadet
- Slime-Marshal-Overlay mit animierten Zielflaggen bringt das Maskottchen an die Startlinie und begleitet die Countdown-Signale
- Broadcast-Newsdesk-Intro mit Strecken-Lore, Wetterbriefing und Pace-Favoriten vor jedem Rennstart
- Grid-Briefing-Kamera-Sweeps rotieren Drohnenperspektiven samt City- & Canyon-Minimap-SVGs direkt im Countdown
- Strenge Gelb-/Safety-Car-Überwachung mit automatischer Positionsrückgabe bei Verstößen und verfeinertem Boxenstopp-Prozess
- Cinematisches Hauptmenü mit Twitch-Mode- und Stream-Deck-Teaser, neuem Atrium-Backdrop und Sprite-Showcase für Gleiter- und Track-Poster-Assets
- Neo-Noir-Backdrops rendern pro Strecke individuelle Skyline-Glows, Sternenfelder und Grid-Linien für mehr Retro-Atmosphäre
- 24 Fahrer inklusive Free-Agent-Pool, Manager-Transfermarkt und teambezogenen Chassis-Profilen mit zufällig gerollten Fahrzeug-Stats
- Manager-Modus mit Wochen-Simulation, Vertragsverwaltung, Upgrades, Export/Import (JSON) sowie persistenter Chassis-Anzeige; ein neues Facility-Panel erlaubt Ausbaustufen für Aero-Lab, Dyno Hub, Systems Bay und Pilot Academy, die Budget kosten, Performance-Boons liefern und Fahrermoral/Form beeinflussen
- Dynamische, streckengebundene Wetterprofile (klar/bewölkt/sturm/nacht/ionensturm) mit Event-Briefing, sendefähigem HUD und gespeicherten Rennen-Settings
- TV-Replay mit Zeitachse, Geschwindigkeitswahl und sofortigem Wiedereinstieg in jede Rennphase inklusive Sieg-Podium-Overlay
- Live-Leaderboard-Overlay auf dem Canvas plus Meldungs-Panel mit Zeitstempeln für Überholungen, Flaggen und Specials
- Battle-Spotlight blendet engste Duelle mit Gap-Trend (schrumpft/wächst) und Teamfarben im Broadcast-HUD ein
- Incident-/Overtake-Banner-Queue blendet zweizeilige TV-Callouts für Flaggen, Safety-Car-Deployments und Überholmanöver ein
- KI-Zustandsmaschine (Attack/Defend/Conserve/Follow SC) steuert Pace, Reifenverschleiß & Risiko-Fenster; Incident-Log zeichnet Kontakte für Codex & Diagnostik auf
- Highlight-Ticker zählt Safety-Laps mit und fasst Pit-Stops als Broadcast-Callouts zusammen, inklusive Service-Gewinnen
- Mini-Map mit markierten Sektoren, Leader-Halo und Fokus-Ring für klarere TV-Analyse
- Einstellbare HUD- und Audio-Optionen (Ticker, Race-Control, Fokus, Mini-Map, Broadcast-Sounds) werden pro Profil gespeichert
- Accessibility-Toggles für reduzierte Animationen und hohen Kontrast verbessern Lesbarkeit und Komfort
- Skip-Toggle für das Broadcast-Intro erlaubt sofortigen Sprung ins Grid Briefing
- Anpassbare Simulationsparameter: Renn-Tempo (Entspannt/Standard/Intensiv) und Caution-Regelwerk (Locker/Standard/Strikt) steuern
  Pace, Bunching-Aggressivität und Überholverbots-Kontrollen
- Codex & Archiv: Lore-Einträge, Fahrer-Persönlichkeiten, Team-Garage, Hall-of-Fame und automatisches Rennarchiv mit Schnellzugriff auf Siege & Fastest Laps
- Timing-&-Statistik-Overlay mit kompaktem Timing-Table, Replay-Markierungen für Formation/Starts und laufend aktualisierten Gap-/Statusdaten
- Codex-Archiv erweitert um Race-Control-Verstöße, Pit-Stop-Zusammenfassungen und Caution-Statistiken je Event
- Live-Gap-HUD mit Delta-Bar, Phasen-Timeline im Ergebnisbericht sowie `window.spacerxDiagnostics` für Race-Control-Diagnosen
- Globale Speicherverwaltung: Profil-Export/Import (JSON) inkl. Manager, GP, Wetten, Archiv & UI-Settings, versionierte Grand-Prix-Saves (inkl. Rotation-Migration) sowie kompletter Speicher-Reset im Einstellungsmenü
- Codex-Roadmap mit Status-Badges für Demo-, Broadcast- und Community-Meilensteine
- Lore-, Flaggen- und Chassis-Sprites als SVG-Assets für weitere UI-Iterationen

## Content Roadmap Snapshot
- **Race-Control Demo Stack** – Formation/Grid-Briefings fertig, Restart-Hold aktiv; State-Machine & adaptive Bunching ausgeliefert
- **Broadcast HUD v2** – Gap-Trends, Sektor-Gates & Incident-Banner live; nächste Schritte: erweiterte Highlight-Queue
- **Manager & Saison-Tiefe** – Transfermarkt steht, Facility-Upgrades mit Effekten auf Chassis & Moral sind live; nächste Schritte: Staff-Systeme und Saison-Save-Validierung
- **Streaming & Tools** – Twitch-Mode & Stream-Deck-Plugin als Developer Preview im Menü angeteasert, Websocket/Chat-Hooks folgen

👉 Für die detaillierte Aufgabenliste zum v0.9.0-„DEMO“-Push siehe [`docs/v0.9_demo_checklist.md`](docs/v0.9_demo_checklist.md). Dort sind alle Deliverables mit Status-Checkboxen hinterlegt, sodass Fortschritt und nächste Schritte jederzeit sichtbar bleiben.
