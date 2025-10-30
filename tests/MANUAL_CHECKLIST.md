# Manual Test Checklist
- [ ] Quick Race: 20 Cars spawn, Countdown, Finish
- [ ] Flags: Trigger YELLOW & SC (Incidents), Restart to GREEN
- [ ] GP: 5 Rennen, Punkte zählen, Zwischenstand, Next Race
- [ ] Tracks: Oval/Wavy/Figure‑8 funktionieren
- [ ] TV: Top‑3 Banner sichtbar, Ticker bei Events
- [ ] Mini‑Map zeigt Cars korrekt
- [ ] Settings: Runden & Strecke greifen

## Automatisierte Abdeckung
- `npm run smoke` (Headless Chromium) fährt ein Schnellrennen zu Ende, beendet Lauf 1 des Grand Prix und simuliert eine Manager-Woche. Dabei werden die Button-Zustände über `window.spacerxDiagnostics.getControlState()` geprüft.

## Manueller Fallback bei fehlgeschlagenem Smoke-Test
- [ ] Schnellrennen manuell durchspielen und sicherstellen, dass Start-/Pause-Buttons wie im automatischen Lauf reagieren.
- [ ] Nach Rennen 1 im Grand Prix prüfen, ob „Nächstes Rennen“ sichtbar ist und der Start-Button „Rennen 2 starten“ anzeigt (entspricht den Smoke-Test-Assertions).
- [ ] Im Manager-Screen „Nächste Woche simulieren“ klicken und bestätigen, dass der Wochenzähler um +1 steigt – wie im automatisierten Lauf erwartet.
