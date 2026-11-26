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
  '2026-11-14': 'autumn', '2026-11-26': 'christmas', '2026-12-23': 'christmas',
  '2026-12-24': 'christmasDays', '2026-12-28': 'betweenYears', '2027-01-06': 'newYear',
  '2027-01-07': 'winter', '2027-02-14': 'valentine', '2027-03-07': 'easter',
  '2027-03-29': 'easter', '2027-03-30': 'spring', '2026-05-05': 'mothersDay',
  '2026-06-14': 'fathersDay', '2026-07-20': 'summer', '2026-09-07': 'schoolStart',
};
for (const [day, id] of Object.entries(cases)) assert.strictEqual(at(day).id, id, day);

// Every day of two years resolves to an event that has copy in both languages
for (let t = d(2026, 1, 1); t < d(2028, 1, 1); t += 864e5) {
  const r = resolve(t);
  for (const l of ['de', 'en']) {
    const e = CONTENT[l].events[r.id];
    assert(e && e.title && e.text, `${l} copy missing for ${r.id}`);
    assert(!!e.tag === !!CONTENT.de.events[r.id].tag && (!e.tag || typeof e.tag === 'string'), `${l} tag mismatch for ${r.id}`);
  }
}
console.log('calendar ok');
