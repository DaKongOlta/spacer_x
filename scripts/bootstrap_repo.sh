#!/usr/bin/env bash
set -euo pipefail

REPO_SSH=${1:-git@github.com:DaKongOlta/spacer_x.git}

echo '>>> Init git'
git init
git branch -m main
git add .
git commit -m "[init] Spacer X Pro – playable static app"

echo '>>> Add remote & push'
git remote add origin "$REPO_SSH"
git push -u origin main

echo '>>> Create labels (requires gh)'
if command -v gh >/dev/null 2>&1; then
  gh auth status || true
  gh api --method GET repos/DaKongOlta/spacer_x/labels >/dev/null 2>&1 || true
  gh api --method POST repos/DaKongOlta/spacer_x/labels --input .github/labels.json || true

  echo '>>> Create issues'
  gh issue create --title "GP Race‑Control State Machine" --label "race,gp" --body "GREEN→YELLOW→SC→RESTART→GREEN; Banner; Bunching/Release; Acceptance in HANDOVER.md"
  gh issue create --title "TV: Sektoren‑Splits + PB/FL" --label "tv" --body "Virtuelle S1/S2/S3; PB/FL Highlight; Leaderboard‑Widget."
  gh issue create --title "Manager v1 (Budget/Contracts/Upgrades)" --label "mgr,enhancement" --body "Wirkt auf baseSpeed/consistency/cornerPenalty; Save/Load JSON."
  gh issue create --title "Special: Race Betting (Stub)" --label "spec" --body "Quotenmodell + Credits; Payout nach Rennen."
  gh issue create --title "Optik: SVG‑Logo & Theme Polish" --label "enhancement" --body "Neo‑Noir Theme; Streckenfarben; Trails."
fi

echo '>>> Enable GitHub Pages: Settings > Pages > Build: GitHub Actions (pages.yml)'
