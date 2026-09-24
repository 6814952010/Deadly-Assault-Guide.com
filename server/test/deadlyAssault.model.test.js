const test = require('node:test');
const assert = require('node:assert/strict');
const DeadlyAssault = require('../src/models/deadlyAssault.model');

const validCycle = () => new DeadlyAssault({
  cycle: 1,
  patchVersion: '2.0',
  title: 'Deadly Assault: Cycle 1',
  startsAt: new Date('2026-01-01'),
  endsAt: new Date('2026-01-15'),
  stages: [{ slot: 1, title: 'First Front', enemies: [{ name: 'Pompey', slug: 'pompey' }] }]
});

test('Deadly Assault model accepts a valid cycle', async () => {
  await assert.doesNotReject(validCycle().validate());
});

test('Deadly Assault model rejects an invalid date range and duplicate stage slots', async () => {
  const cycle = validCycle();
  cycle.endsAt = new Date('2025-12-31');
  cycle.stages.push({ slot: 1, title: 'Duplicate Front' });
  await assert.rejects(cycle.validate(), /end date|stage slots/i);
});
