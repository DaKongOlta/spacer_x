# SPACER‑X (Playable Prototype)
Futuristisches Top‑Down‑Racing mit TV‑UI, 18 Strecken (u. a. Atlas Skyway, Glacier Traverse, Maelstrom Gauntlet, Fracture Belt, Eclipse Citadel, Rift Meridian, Lumen Cascades), Grand‑Prix‑Modus (5 Rennen), Flags (Green/Yellow/Safety), Mini‑Map, Grid-Briefing-Overlay sowie persistente Profile und Rennarchiv (localStorage).

## Quickstart
1. ZIP entpacken
2. `index.html` im Browser öffnen (oder optional: `python3 -m http.server`)
3. **Einstellungen**: Strecke & Runden wählen → **Schnelles Rennen** oder **Grand Prix** starten

## Ordner & Dateien
- `index.html` – UI & Screens (Main Menu, Race, Teams, Settings)
- `styles.css` – Dark/Neo‑Noir Theme, Banner, Ticker, Mini‑Map
- `script.js` – Game‑Core (Track, Cars, Flags, GP‑Flow, UI Bindings)
- `assets/sprites/track_concepts.svg` – Poster-Konzepte für Aurora Skyway, Ion Spine & Solar Cascade
- `assets/sprites/track_concepts_set2.svg` – Panorama-Triptychon mit Comet Trench, Quantum Bloom & Umbra Expanse
- `assets/sprites/track_concepts_set3.svg` – Stadion-Triptychon mit Luminaria Circuit, Ion Velodrome & Parallax Forum
- `assets/sprites/space_glider_pixelart.svg` – Pixelart-Sheet für die neuen Aether-Lance- & Violet-Flare-Gleiter
- `assets/sprites/space_glider_pixelart_set2.svg` – Vanguard-Pixelset für Prism Rider, Eclipse Talon & Grav Seraph
- `assets/sprites/space_glider_pixelart_set3.svg` – Vanguard-Pixelset für Zenith Wyvern, Halo Riptide & Comet Barricade
- `assets/sprites/team_crests.svg` – Wappen-Set für Aurora Wardens, Nova Paladins, Ember Vanguard, Tidal Oracle, Prism Lilith & Greenline Rally
- `assets/scenes/track_blueprint_panel.svg` – Blueprint-Panel mit Strecken-Notizen für Broadcast & Manager-Modus
- `assets/scenes/track_keyart_triptych.svg` – Key-Art-Triptychon als atmosphärisches Widescreen-Konzept der neuen Kurse
- `assets/scenes/track_grandstand_panorama.svg` – Stadion-Atmosphäre mit Neon-Tribünen, Sponsorflächen und Oval-Linienführung
- `assets/scenes/broadcast_motion_suite.svg` – Motion-Paket mit Flaggenkarussell, Stinger-Frames, Highlight-Queue & Stream-Deck-Grid
- `assets/scenes/track_atmosphere_set.svg` – Skyline- und Lichtpakete für Nebula Amphitheatre, Solstice Cascade & Aurora Skyway
- `assets/dlc_pack/` – DLC-Ordner mit frischen Kurs-Postern, Blueprints, Broadcast-Overlays, Teamwappen & Gleiter-Konzepten
- `assets/dlc_pack/dlc_track_posters.svg` – Poster-Trio für Nova Rift, Cygnus Spiral & Obsidian Mirage samt DLC-Branding
- `assets/dlc_pack/dlc_track_blueprints.svg` – Blueprint-Cluster für Helix Downforce, Solaris Vortex & Lagrange Drift
- `assets/dlc_pack/dlc_track_environments.svg` – Skyline-Parallaxen und Tribünen für Aurora Skyway, Nebula Spiral & Lagrange Drift
- `assets/dlc_pack/dlc_space_gliders.svg` – Pixel-Garage mit Photon Lynx, Nebula Aegis & Meteor Viper inkl. Spec-Notes
- `assets/dlc_pack/dlc_broadcast_overlay_kit.svg` – Overlay-Paket (Lower Third, Pit Panel, Intro-Bumper) für TV-Produktionen
- `assets/dlc_pack/dlc_team_logos.svg` – Neues Crest-Set (Lynx Pulse, Orbit Seraph, Verdant Arrow, Nova Mirror, Quantum Warden, Ember Vector)
- `assets/expansion_wave2/` – Expansion-Welle-2-Ordner mit neuen Track-Postern, Atmosphären, Pixel-Gleitern, Wappen & Broadcast-Overlays
- `assets/expansion_wave2/track_posters_wave2.svg` – Poster-Trio für Pulse Convergence, Nebula Thalassa & Eclipse Bastion
- `assets/expansion_wave2/space_glider_pixelart_wave2.svg` – Pixel-Sheet für Spectral Hydra, Ion Peregrine & Lumen Cyclone
- `assets/expansion_wave2/team_crests_wave2.svg` – Crest-Suite für Lyra Sentinels, Cygnus Alchemy, Auric Vanguard, Tidal Hermes, Orbit Veil & Photon Virtue
- `assets/expansion_wave2/broadcast_overlay_wave2.svg` – TV-Overlay-Kit mit Race-Control-, Replay- und Stat-Panels für die Expansionstracks
- `assets/expansion_wave2/track_atmospheres_wave2.svg` – Skyline-Panels für Pulse Convergence, Nebula Thalassa & Eclipse Bastion
- `assets/ui/manager_upgrade_icons.svg` – Facility-Icons & Ausbaustufen-Panel für Aero Lab, Dyno Hub, Systems Bay & Pilot Academy
- `assets/codex/codex_lore_cards.svg` – Codex-Karten für Team-Lore, Fahrerprofile & historische Poster
- `assets/media/streaming_branding_suite.svg` – Streaming-Bundle mit Musik-Loops, Alert-Frames & Chat-Makros
- `lore/` – Lore-Bibliothek mit Ursprungschronik, Fraktionsprofilen, Dialogfragmenten, Saisonbriefings und Namenslisten für zukünftige Narrative
- `lore/world_building.md` – Weltkompendium zur Neon-Renaissance-Ära, Fraktionslandschaft und Stimmung der Spacer-X-Zeitlinie
- `lore/expansion_tracks.md` – Hintergrunddossiers zu den neuen Expansion-Tracks, Gleitern und Team-Erweiterungen
- `promo_materials/` – Promo- und Artwork-Hub mit Wiki-Struktur und Marketing-Unterlagen
- `promo_materials/wiki/README.md` – Startseite des Promo-Wikis für Kampagnenplanung, Messaging und Asset-Verlinkung
- `promo_materials/spacer_x_promo_brochure.md` – Mehrseitiges Brochure-Draft mit Kern-Features, Zielgruppen und Calls-to-Action

## Steuerung
- Alles per UI (Start/Pause/Replay/Nächstes Rennen)
- Keine Tastatureingaben erforderlich

## Features (Stand)
- 18 Tracks inklusive Glacier Traverse, Maelstrom Gauntlet, Atlas Skyway, Fracture Belt, Eclipse Citadel, Rift Meridian und Lumen Cascades; TV‑UI (Top‑3, Ticker, Mini‑Map) & Grid-Briefing; Grand Prix (5 Rennen, Punkte, localStorage)
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
- Titelbildschirm-Jingle im Neo-Noir-Sounddesign, der nach der ersten Interaktion startet und beim Wechsel ins Spiel sauber ausfadet
- Slime-Marshal-Overlay mit animierten Zielflaggen bringt das Maskottchen an die Startlinie und begleitet die Countdown-Signale
- Broadcast-Newsdesk-Intro mit Strecken-Lore, Wetterbriefing und Pace-Favoriten vor jedem Rennstart
- Strenge Gelb-/Safety-Car-Überwachung mit automatischer Positionsrückgabe bei Verstößen und verfeinertem Boxenstopp-Prozess
- Cinematisches Hauptmenü mit Twitch-Mode- und Stream-Deck-Teaser, neuem Atrium-Backdrop und Sprite-Showcase für Gleiter- und Track-Poster-Assets
- Neo-Noir-Backdrops rendern pro Strecke individuelle Skyline-Glows, Sternenfelder und Grid-Linien für mehr Retro-Atmosphäre
- 24 Fahrer inklusive Free-Agent-Pool, Manager-Transfermarkt und teambezogenen Chassis-Profilen mit zufällig gerollten Fahrzeug-Stats
- Manager-Modus mit Wochen-Simulation, Vertragsverwaltung, Upgrades, Export/Import (JSON) sowie persistenter Chassis-Anzeige; ein neues Facility-Panel erlaubt Ausbaustufen für Aero-Lab, Dyno Hub, Systems Bay und Pilot Academy, die Budget kosten, Performance-Boons liefern und Fahrermoral/Form beeinflussen
- Dynamische Wetterprofile (klar/bewölkt/sturm/nacht/ionensturm) mit Event-Briefing, sendefähigem HUD und gespeicherten Rennen-Settings
- TV-Replay mit Zeitachse, Geschwindigkeitswahl und sofortigem Wiedereinstieg in jede Rennphase inklusive Sieg-Podium-Overlay
- Live-Leaderboard-Overlay auf dem Canvas plus Meldungs-Panel mit Zeitstempeln für Überholungen, Flaggen und Specials
- Incident-/Overtake-Banner-Queue blendet zweizeilige TV-Callouts für Flaggen, Safety-Car-Deployments und Überholmanöver ein
- Mini-Map mit markierten Sektoren, Leader-Halo und Fokus-Ring für klarere TV-Analyse
- Einstellbare HUD- und Audio-Optionen (Ticker, Race-Control, Fokus, Mini-Map, Broadcast-Sounds) werden pro Profil gespeichert
- Skip-Toggle für das Broadcast-Intro erlaubt sofortigen Sprung ins Grid Briefing
- Anpassbare Simulationsparameter: Renn-Tempo (Entspannt/Standard/Intensiv) und Caution-Regelwerk (Locker/Standard/Strikt) steuern
  Pace, Bunching-Aggressivität und Überholverbots-Kontrollen
- Codex & Archiv: Lore-Einträge, Fahrer-Persönlichkeiten, Team-Garage, Hall-of-Fame und automatisches Rennarchiv mit Schnellzugriff auf Siege & Fastest Laps
- Live-Gap-HUD mit Delta-Bar, Phasen-Timeline im Ergebnisbericht sowie `window.spacerxDiagnostics` für Race-Control-Diagnosen
- Globale Speicherverwaltung: Profil-Export/Import (JSON) inkl. Manager, GP, Wetten, Archiv & UI-Settings sowie kompletter Speicher-Reset im Einstellungsmenü
- Codex-Roadmap mit Status-Badges für Demo-, Broadcast- und Community-Meilensteine
- Lore-, Flaggen- und Chassis-Sprites als SVG-Assets für weitere UI-Iterationen

## Content Roadmap Snapshot
- **Race-Control Demo Stack** – Formation/Grid-Briefings fertig, Restart-Hold aktiv; State-Machine & adaptive Bunching ausgeliefert
- **Broadcast HUD v2** – Gap-Trends, Sektor-Gates & Incident-Banner live; nächste Schritte: erweiterte Highlight-Queue
- **Manager & Saison-Tiefe** – Transfermarkt steht, Facility-Upgrades mit Effekten auf Chassis & Moral sind live; nächste Schritte: Staff-Systeme und Saison-Save-Validierung
- **Streaming & Tools** – Twitch-Mode & Stream-Deck-Plugin als Developer Preview im Menü angeteasert, Websocket/Chat-Hooks folgen
