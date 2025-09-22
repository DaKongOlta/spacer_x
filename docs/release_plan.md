# Spacer‑X Release Roadmap

## Overview
Spacer‑X currently ships as a v0.9.0 **Demo** build that showcases the full single-player broadcast loop, adaptive race-control logic, and the first iteration of the management toolkit. The roadmap below clarifies how we graduate from the demo milestone to the public release channel.

## Release Milestones
### v0.9.0 — Demo (Current)
- Showcase race-control state machine with GREEN/YELLOW/SAFETY/RESTART phases and restart hold.
- Deliver broadcast HUD v2 with leaderboard, ticker, minimap halos, and replay suite.
- Provide manager facilities, transfer market, and profile export/import as a taste of long-form progression.
- Include 20 themed circuits with lore entries and dynamic weather presets.

### v0.9.5 — Alpha Preview
- Modularise the codebase into ES modules (`src/core`, `src/ui`, `src/data`) and finalise the automated smoke harness.
- Expand AI behaviours (attack/defend/conserve/follow_SC) with pacing calibration against new chassis archetypes.
- Introduce the sponsor-goal economy loop in manager mode and nightly data snapshots for season archives.
- Ship first community tooling preview (track JSON validator, overlay profiler, OBS layout pack).

### v0.9.9 — Beta Candidate
- Lock gameplay rules for Grand Prix, quick race, and betting challenge; focus on balance, stability, and accessibility polish.
- Add couch spectator toggles (multi-slip betting, shared HUD presets) and configurable camera presets.
- Integrate full telemetry export (CSV/JSON) and enhance replay bookmarking for incidents and battle highlights.
- Localise UI copy into DE/EN and finish the narrated onboarding tour.

### v1.0.0 — Launch Release
- Enable full career progression: sponsor negotiations, staff management, facility trees, and hall-of-fame tracking across seasons.
- Deliver mod-ready data bundles (tracks, teams, audio) with versioned loaders and migration guides.
- Add comprehensive audio suite (dynamic soundtrack, pit radio cues, ambient layers) and performance HUD toggle for streamers.
- Final QA pass with automated regression suite, hardware performance sweep, and documentation freeze.

## Next Steps
- Track progress via [`docs/v0.9_demo_checklist.md`](v0.9_demo_checklist.md) and promote completed milestones into this release plan.
- Prioritise regression automation and ES-module refactor to unlock the Alpha preview build.
- Collect player feedback on the demo build to calibrate AI tuning, management pacing, and presentation polish ahead of Beta.
