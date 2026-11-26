// Calendar self-check: node check.cjs  (fails loudly if a date or a text is wrong)
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const src = fs.readFileSync(__dirname + '/popup.html', 'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const box = { module: { exports: {} } };
vm.runInNewContext(src, box);
const { resolve, easterSunday, nthSunday, d, CONTENT } = box.module.exports;
const iso = t => new Date(t).toISOString().slice(0, 10);

for (const [y, e] of [[2024, '2024-03-31'], [2025, '2025-04-20'], [2026, '2026-04-05'], [2027, '2027-03-28'], [2038, '2038-04-25'], [2285, '2285-03-22']])
  assert.strictEqual(iso(easterSunday(y)), e, 'Easter ' + y);
assert.strictEqual(iso(nthSunday(2026, 5, 2)), '2026-05-10', 'Muttertag 2026');
assert.strictEqual(iso(nthSunday(2026, 6, 2)), '2026-06-14', 'Vatertag 2026');

const at = s => { const [y, m, dd] = s.split('-').map(Number); return resolve(d(y, m, dd)); };
const cases = {
  '2026-11-14': ['autumn', null], '2026-11-26': ['christmas', 28], '2026-12-23': ['christmas', 1],
  '2026-12-24': ['christmasDays', null], '2026-12-28': ['betweenYears', null], '2027-01-06': ['newYear', null],
  '2027-01-07': ['winter', null], '2027-02-14': ['valentine', 0], '2027-03-07': ['easter', 21],
  '2027-03-29': ['easter', -1], '2027-03-30': ['spring', null], '2026-05-05': ['mothersDay', 5],
  '2026-06-14': ['fathersDay', 0], '2026-07-20': ['summer', null], '2026-09-07': ['schoolStart', null],
};
for (const [day, [id, days]] of Object.entries(cases)) {
  const r = at(day);
  assert.deepStrictEqual([r.id, r.days], [id, days], day);
}

// Every day of two years resolves to an event that has copy in both languages
for (let t = d(2026, 1, 1); t < d(2028, 1, 1); t += 864e5) {
  const r = resolve(t);
  for (const l of ['de', 'en']) {
    const e = CONTENT[l].events[r.id];
    assert(e && e.title && e.text, `${l} copy missing for ${r.id}`);
    if (r.days != null) assert(e.tag && e.tag.many && e.tag.one, `${l} countdown tag missing for ${r.id}`);
  }
}
console.log('calendar ok');
