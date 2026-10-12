import { CATALOGUE, ALIASES, PRIORITY } from '../data/skills.js';

/* ============================================================
   Scoring. Pure functions: text in, result object out.
   No DOM, no React — which is what makes this testable.
   ============================================================ */

/* Matching runs on a normalised copy, so "React.js" and "react" behave
   the same and a term split across two lines still matches. */
function normalise(text) {
  return ` ${text.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ')} `;
}

function needlesFor(skill) {
  return (ALIASES[skill] || [skill.toLowerCase()]).map((n) =>
    n.startsWith(' ') || n.endsWith(' ') ? n : ` ${n} `,
  );
}

function rank(skill) {
  const i = PRIORITY.indexOf(skill);
  return i === -1 ? PRIORITY.length : i;
}

export function findSkills(text) {
  const haystack = normalise(text);
  const found = [];
  const missing = [];

  for (const { group, skills } of CATALOGUE) {
    for (const skill of skills) {
      const hit = needlesFor(skill).some((n) => haystack.includes(n));
      (hit ? found : missing).push({ skill, group });
    }
  }

  missing.sort((a, b) => rank(a.skill) - rank(b.skill));
  return { found, missing };
}

export function runChecks(text) {
  const words = text.trim().split(/\s+/).length;
  const has = (re) => re.test(text);

  return [
    { label: 'Email address', ok: has(/[\w.+-]+@[\w-]+\.[\w.]{2,}/), points: 5 },
    { label: 'Phone number', ok: has(/(\+?\d[\d\s().-]{7,}\d)/), points: 5 },
    { label: 'Portfolio, LinkedIn or GitHub link', ok: has(/https?:\/\/|linkedin|github/i), points: 5 },
    { label: 'Experience section', ok: has(/\b(experience|employment|work history)\b/i), points: 5 },
    {
      label: 'Education section',
      ok: has(/\b(education|bachelor|master|b\.?tech|degree|university)\b/i),
      points: 5,
    },
    { label: 'Projects section', ok: has(/\b(projects?|portfolio|built|shipped)\b/i), points: 5 },
    {
      label: 'Quantified results (numbers, %, users)',
      ok: has(/\d+\s?(%|percent|x\b)|\b\d{2,}\+?\s?(users|customers|requests|ms|hours)/i),
      points: 5,
    },
    { label: 'Length is in the 300–900 word range', ok: words >= 300 && words <= 900, points: 5 },
  ];
}

/* 100 points, split so the learner can see where each part comes from:
     60  skills  — 4 points per distinct match, capped at 15 skills
     40  checks  — 8 structure checks worth 5 each                       */
export function scoreResume(text) {
  const { found, missing } = findSkills(text);
  const checks = runChecks(text);

  const skillPoints = Math.min(60, found.length * 4);
  const checkPoints = checks.reduce((sum, c) => sum + (c.ok ? c.points : 0), 0);
  const total = Math.round(skillPoints + checkPoints);

  return { total, found, missing, checks, skillPoints, checkPoints };
}

export function verdictFor(total) {
  if (total >= 80)
    return ['Strong — this passes most screens.', 'The signals are all there. Tighten the wording and it is ready to send.'];
  if (total >= 60)
    return ['Decent, with obvious gaps.', 'A recruiter would keep reading, but the missing pieces below are costing you callbacks.'];
  if (total >= 40)
    return ['Thin on signal.', 'The structure is partly there. Work through the missing skills and the failed checks.'];
  return ['Needs work before it goes out.', 'Start with the failed checks — contact details and sections — then the priority skills.'];
}

export function ratingFor(total) {
  if (total >= 80) return 'good';
  if (total >= 60) return 'ok';
  if (total >= 40) return 'warn';
  return 'bad';
}

export const RING_CIRCUMFERENCE = 2 * Math.PI * 60; // r = 60 in the SVG

export function fixesFor({ checks, missing }) {
  return [
    ...checks.filter((c) => !c.ok).map((c) => `Add or fix: ${c.label.toLowerCase()}.`),
    ...missing.slice(0, 3).map((m) => `If you have used ${m.skill} (${m.group}), name it somewhere it can be found.`),
  ].slice(0, 5);
}
