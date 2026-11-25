#!/usr/bin/env node
/**
 * `npm run lhci`: Lighthouse CI with the CPU throttling calibrated to the runner (DECISIONS W-04, REVIEW).
 *
 * Lighthouse's mobile preset slows the CPU 4× whatever the machine. GitHub runners differ about 2× in speed
 * (`benchmarkIndex` 2000–4200 for the same code, DECISIONS "LHCI evidence"), and TBT follows the runner: 140–210 ms on a
 * fast one, 400+ ms on a slow one. The gate then measures the runner, not the pages.
 *
 * This script measures the runner's `benchmarkIndex` first (median of 3 quick Lighthouse runs on the first URL), then
 * runs `lhci autorun` with `cpuSlowdownMultiplier = 4 × min(1, benchmarkIndex / REFERENCE)`: a runner at least as fast
 * as REFERENCE keeps the 4× of the preset; a slower one is throttled less, so every run emulates the same device (a
 * REFERENCE-class machine slowed 4×). Assertions, thresholds, run count and aggregation in lighthouserc.json are
 * unchanged. `LHCI_CPU_MULTIPLIER` forces a multiplier (e.g. 4 to reproduce the uncalibrated preset).
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** The runner class the thresholds were set on: W-00 run 8 (green, `benchmarkIndex` 2701–2899) and run 1 (3761–4258). */
export const REFERENCE = 3000;
export const PRESET = 4;

/** 4× on a REFERENCE-class or faster runner; proportionally less on a slower one; never below 1. */
export function multiplierFor(benchmarkIndex) {
  if (!Number.isFinite(benchmarkIndex) || benchmarkIndex <= 0) return PRESET;
  const m = PRESET * Math.min(1, benchmarkIndex / REFERENCE);
  return Math.max(1, Math.round(m * 100) / 100);
}

/** lighthouserc.json with the multiplier added to the collect settings (Lighthouse merges `throttling` deeply). */
export function calibratedConfig(rc, multiplier) {
  const out = structuredClone(rc);
  const settings = (out.ci.collect.settings ??= {});
  settings.throttling = { ...(settings.throttling ?? {}), cpuSlowdownMultiplier: multiplier };
  return out;
}

function measureBenchmarkIndex(url, chromeFlags) {
  const values = [];
  for (let i = 0; i < 3; i++) {
    try {
      const json = execFileSync(
        'npx',
        ['--no-install', 'lighthouse', url, '--only-audits=total-blocking-time', '--output=json', '--output-path=stdout',
          '--quiet', `--chrome-flags=${chromeFlags}`],
        { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'inherit'] },
      );
      const bi = JSON.parse(json).environment?.benchmarkIndex;
      if (Number.isFinite(bi)) values.push(bi);
    } catch (e) {
      console.warn(`lhci-calibrated: benchmark run ${i + 1} failed (${e.message.split('\n')[0]})`);
    }
  }
  values.sort((a, b) => a - b);
  return values.length ? values[Math.floor(values.length / 2)] : NaN;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rc = JSON.parse(readFileSync('lighthouserc.json', 'utf8'));
  const forced = Number(process.env.LHCI_CPU_MULTIPLIER);
  let multiplier;
  if (forced > 0) {
    multiplier = forced;
    console.log(`lhci-calibrated: LHCI_CPU_MULTIPLIER=${forced} (forced)`);
  } else {
    const bi = measureBenchmarkIndex(rc.ci.collect.url[0], rc.ci.collect.settings?.chromeFlags ?? '');
    multiplier = multiplierFor(bi);
    console.log(
      `lhci-calibrated: runner benchmarkIndex ${Number.isFinite(bi) ? Math.round(bi) : 'unknown'} (reference ${REFERENCE})` +
        ` → cpuSlowdownMultiplier ${multiplier} (preset ${PRESET})`,
    );
  }
  const dir = mkdtempSync(join(tmpdir(), 'lhci-'));
  const path = join(dir, 'lighthouserc.json');
  writeFileSync(path, JSON.stringify(calibratedConfig(rc, multiplier), null, 2));
  const run = spawnSync('npx', ['--no-install', 'lhci', 'autorun', `--config=${path}`], { stdio: 'inherit' });
  // The owner-target table is printed whatever the gate says (it shows how far each URL is from the targets).
  spawnSync('node', ['scripts/lhci-targets.mjs'], { stdio: 'inherit' });
  process.exit(run.status ?? 1);
}
