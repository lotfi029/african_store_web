import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { PRESET, REFERENCE, calibratedConfig, multiplierFor } from '../lhci-calibrated.mjs';

test('a reference-class or faster runner keeps the 4× preset', () => {
  assert.equal(multiplierFor(REFERENCE), PRESET);
  assert.equal(multiplierFor(4200), PRESET);
});

test('a slower runner is throttled proportionally less, never below 1×', () => {
  assert.equal(multiplierFor(2000), 2.67);
  assert.equal(multiplierFor(1500), 2);
  assert.equal(multiplierFor(100), 1);
});

test('an unknown benchmark falls back to the preset', () => {
  assert.equal(multiplierFor(NaN), PRESET);
  assert.equal(multiplierFor(0), PRESET);
});

test('only the CPU multiplier changes: assertions, URLs and runs stay as in lighthouserc.json', () => {
  const rc = JSON.parse(readFileSync('lighthouserc.json', 'utf8'));
  const out = calibratedConfig(rc, 2.5);
  assert.equal(out.ci.collect.settings.throttling.cpuSlowdownMultiplier, 2.5);
  assert.equal(out.ci.collect.settings.chromeFlags, rc.ci.collect.settings.chromeFlags);
  assert.deepEqual(out.ci.assert, rc.ci.assert);
  assert.deepEqual(out.ci.collect.url, rc.ci.collect.url);
  assert.equal(out.ci.collect.numberOfRuns, rc.ci.collect.numberOfRuns);
  assert.equal(rc.ci.collect.settings.throttling, undefined, 'the source config is not modified');
});
