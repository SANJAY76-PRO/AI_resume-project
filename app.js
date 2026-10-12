/* ============================================================
   ResumeScore — client-side resume scorer (mock)
   ------------------------------------------------------------
   Flow:  file -> text -> signals -> score -> render
   Everything runs in the browser. No upload, no backend.
   ============================================================ */

/* ---------- 1. The skill catalogue ---------------------------
   `priority` marks the ones hiring teams most often search for,
   so they show up first in "skills missing".
   ------------------------------------------------------------ */
const CATALOGUE = [
  { group: 'Languages',  skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C++', 'SQL'] },
  { group: 'Frontend',   skills: ['React', 'Vue', 'Next.js', 'HTML', 'CSS', 'Tailwind', 'Redux'] },
  { group: 'Backend',    skills: ['Node.js', 'Express', 'Django', 'Flask', 'REST', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
  { group: 'Cloud/DevOps', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux', 'Terraform'] },
  { group: 'Data/ML',    skills: ['Pandas', 'NumPy', 'scikit-learn', 'TensorFlow', 'PyTorch'] },
  { group: 'Practices',  skills: ['Testing', 'Agile', 'Scrum', 'Accessibility', 'Performance'] },
];

/* Each entry above can be written several ways in a real resume.
   The first spelling is what we display. */
const ALIASES = {
  'JavaScript':   ['javascript', 'js', 'es6', 'ecmascript'],
  'TypeScript':   ['typescript', 'ts'],
  'Node.js':      ['node.js', 'nodejs', 'node js', 'node'],
  'Next.js':      ['next.js', 'nextjs'],
  'React':        ['react', 'react.js', 'reactjs'],
  'Vue':          ['vue', 'vue.js', 'vuejs'],
  'PostgreSQL':   ['postgresql', 'postgres', 'psql'],
  'MongoDB':      ['mongodb', 'mongo'],
  'AWS':          ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
  'CI/CD':        ['ci/cd', 'ci-cd', 'continuous integration', 'github actions', 'jenkins'],
  'Testing':      ['testing', 'unit test', 'jest', 'pytest', 'vitest', 'cypress'],
  'REST':         ['rest', 'restful', 'rest api'],
  'CSS':          ['css', 'css3', 'sass', 'scss'],
  'HTML':         ['html', 'html5'],
  'C++':          ['c++', 'cpp'],
  'Go':           ['golang', ' go '],
  'SQL':          ['sql', 'mysql', 'sqlite'],
  'scikit-learn': ['scikit-learn', 'sklearn'],
  'Accessibility':['accessibility', 'a11y', 'wcag', 'aria'],
  'Performance':  ['performance', 'optimization', 'optimisation', 'lighthouse'],
  'Agile':        ['agile'],
  'Scrum':        ['scrum'],
  'Linux':        ['linux', 'ubuntu', 'unix'],
  'GraphQL':      ['graphql', 'apollo'],
  'Tailwind':     ['tailwind'],
  'Redux':        ['redux'],
  'Express':      ['express'],
  'Django':       ['django'],
  'Flask':        ['flask'],
  'Pandas':       ['pandas'],
  'NumPy':        ['numpy'],
  'TensorFlow':   ['tensorflow', 'tf.keras'],
  'PyTorch':      ['pytorch', 'torch'],
  'Terraform':    ['terraform'],
  'Kubernetes':   ['kubernetes', 'k8s', 'eks', 'helm'],
  'Docker':       ['docker', 'dockerfile', 'docker-compose'],
  'Git':          ['git', 'github', 'gitlab', 'bitbucket'],
  'Java':         ['java '],
  'Python':       ['python'],
};

/* A handful every resume benefits from, in the order we suggest adding them. */
const PRIORITY = ['Git', 'SQL', 'Docker', 'AWS', 'Testing', 'React', 'TypeScript', 'CI/CD', 'REST', 'Node.js'];

/* ---------- 2. DOM -------------------------------------------------- */
const $ = (id) => document.getElementById(id);
const dropzone = $('dropzone');
const fileInput = $('file-input');
const browseBtn = $('browse-btn');
const fileName = $('file-name');
const status = $('status');
const statusText = $('status-text');
const results = $('results');

/* ---------- 3. File intake ----------------------------------------- */
browseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => e.target.files[0] && handleFile(e.target.files[0]));

['dragenter', 'dragover'].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add('is-over');
  }),
);
['dragleave', 'drop'].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove('is-over');
  }),
);
dropzone.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

async function handleFile(file) {
  const MAX = 5 * 1024 * 1024;
  if (file.size > MAX) {
    return fail(`That file is ${(file.size / 1048576).toFixed(1)} MB — please keep it under 5 MB.`);
  }

  fileName.hidden = false;
  fileName.textContent = file.name;
  say('Reading your resume…');

  try {
    const text = await extractText(file);
    if (text.trim().length < 40) {
      return fail('We could not read text from that file. If it is a scan or an image-only PDF, export it with a text layer first.');
    }
    say('Scoring…');
    render(score(text), file.name);
  } catch (err) {
    fail(`Could not read that file: ${err.message}`);
  } finally {
    status.hidden = true;
  }
}

function say(message) {
  statusText.textContent = message;
  status.hidden = false;
}

function fail(message) {
  statusText.textContent = message;
  status.hidden = false;
  status.querySelector('.spinner').hidden = true;
}

/* ---------- 4. Text extraction ------------------------------------- */
async function extractText(file) {
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return file.text();
  }
  return extractPdfText(file);
}

/* pdf.js is ~1 MB, so it is fetched only when a PDF is actually chosen. */
let pdfModule = null;
function loadPdfJs() {
  if (pdfModule) return pdfModule;

  pdfModule = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const lib = window.pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(lib);
    };
    script.onerror = () => reject(new Error('pdf.js could not be loaded (are you offline?)'));
    document.head.appendChild(script);
  });

  return pdfModule;
}

async function extractPdfText(file) {
  const pdfjsLib = await loadPdfJs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    // join items, keeping a space between them so words do not fuse together
    pages.push(content.items.map((item) => item.str).join(' '));
  }
  return pages.join('\n');
}

/* ---------- 5. Signals --------------------------------------------- */
/* Matching runs on a normalised copy so "React.js" and "react" behave
   the same, and so line breaks do not hide a two-word term. */
function normalise(text) {
  return ` ${text.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ')} `;
}

function findSkills(text) {
  const haystack = normalise(text);
  const found = [];
  const missing = [];

  for (const { group, skills } of CATALOGUE) {
    for (const skill of skills) {
      const needles = (ALIASES[skill] || [skill.toLowerCase()]).map((n) =>
        n.startsWith(' ') || n.endsWith(' ') ? n : ` ${n} `,
      );
      const hit = needles.some((n) => haystack.includes(n));
      (hit ? found : missing).push({ skill, group });
    }
  }

  // suggest the high-demand ones first, then whatever else is absent
  missing.sort((a, b) => rank(a.skill) - rank(b.skill));
  return { found, missing };
}

function rank(skill) {
  const i = PRIORITY.indexOf(skill);
  return i === -1 ? PRIORITY.length : i;
}

function runChecks(text) {
  const words = text.trim().split(/\s+/).length;
  const has = (re) => re.test(text);

  return [
    { label: 'Email address', ok: has(/[\w.+-]+@[\w-]+\.[\w.]{2,}/), points: 5 },
    { label: 'Phone number', ok: has(/(\+?\d[\d\s().-]{7,}\d)/), points: 5 },
    { label: 'Portfolio, LinkedIn or GitHub link', ok: has(/https?:\/\/|linkedin|github/i), points: 5 },
    { label: 'Experience section', ok: has(/\b(experience|employment|work history)\b/i), points: 5 },
    { label: 'Education section', ok: has(/\b(education|bachelor|master|b\.?tech|degree|university)\b/i), points: 5 },
    { label: 'Projects section', ok: has(/\b(projects?|portfolio|built|shipped)\b/i), points: 5 },
    { label: 'Quantified results (numbers, %, users)', ok: has(/\d+\s?(%|percent|x\b)|\b\d{2,}\+?\s?(users|customers|requests|ms|hours)/i), points: 5 },
    { label: 'Length is in the 300–900 word range', ok: words >= 300 && words <= 900, points: 5 },
  ];
}

/* ---------- 6. Scoring ---------------------------------------------
   100 points, split so the learner can see where each part comes from:
     60  skills  — 4 points per distinct match, capped at 60 (15 skills)
     40  checks  — 8 structure checks worth 5 each
   ---------------------------------------------------------------- */
function score(text) {
  const { found, missing } = findSkills(text);
  const checks = runChecks(text);

  const skillPoints = Math.min(60, found.length * 4);
  const checkPoints = checks.reduce((sum, c) => sum + (c.ok ? c.points : 0), 0);
  const total = Math.round(skillPoints + checkPoints);

  return { total, found, missing, checks, skillPoints, checkPoints };
}

function verdictFor(total) {
  if (total >= 80) return ['Strong — this passes most screens.', 'The signals are all there. Tighten the wording and it is ready to send.'];
  if (total >= 60) return ['Decent, with obvious gaps.', 'A recruiter would keep reading, but the missing pieces below are costing you callbacks.'];
  if (total >= 40) return ['Thin on signal.', 'The structure is partly there. Work through the missing skills and the failed checks.'];
  return ['Needs work before it goes out.', 'Start with the failed checks — contact details and sections — then the priority skills.'];
}

/* ---------- 7. Rendering ------------------------------------------- */
function render(result, name) {
  const { total, found, missing, checks } = result;
  const [title, copy] = verdictFor(total);

  $('score-number').textContent = total;
  $('verdict-title').textContent = title;
  $('verdict-copy').textContent = copy;

  // ring: circumference 2 * PI * 60 = 376.99
  const ring = $('ring-value');
  const circumference = 376.99;
  ring.style.strokeDashoffset = circumference;
  ring.style.stroke = total >= 80 ? 'var(--good)' : total >= 60 ? 'var(--brand-2)' : total >= 40 ? 'var(--warn)' : 'var(--bad)';
  // next frame, so the browser animates from the empty state
  requestAnimationFrame(() => {
    ring.style.strokeDashoffset = circumference * (1 - total / 100);
  });

  fillList('found-list', found, 'is-found', 'Nothing matched yet.');
  fillList('missing-list', missing.slice(0, 12), 'is-missing', 'Nothing missing — nice.');
  $('found-count').textContent = found.length;
  $('missing-count').textContent = missing.length;

  $('checks-list').innerHTML = '';
  for (const c of checks) {
    const li = document.createElement('li');
    const tick = document.createElement('span');
    tick.className = `tick ${c.ok ? 'tick--pass' : 'tick--fail'}`;
    tick.textContent = c.ok ? '✓' : '✕';
    const label = document.createElement('span');
    label.textContent = c.label;
    li.append(tick, label);
    $('checks-list').appendChild(li);
  }

  const fixes = [
    ...checks.filter((c) => !c.ok).map((c) => `Add or fix: ${c.label.toLowerCase()}.`),
    ...missing.slice(0, 3).map((m) => `If you have used ${m.skill} (${m.group}), name it somewhere it can be found.`),
  ].slice(0, 5);
  $('fixes-list').innerHTML = fixes.map((f) => `<li>${escapeHtml(f)}</li>`).join('')
    || '<li>Nothing to fix — send it.</li>';

  const note = $('mock-note');
  note.hidden = true;
  note.textContent = `Heuristic scoring: ${result.skillPoints} + ${result.checkPoints} = ${total}/100.`;

  $('file-name').textContent = `Scored: ${name}`;
  results.hidden = false;
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function fillList(id, items, className, emptyMessage) {
  const ul = $(id);
  ul.innerHTML = '';

  if (!items.length) {
    const li = document.createElement('li');
    li.className = 'is-empty';
    li.textContent = emptyMessage;
    ul.appendChild(li);
    return;
  }

  for (const item of items) {
    const li = document.createElement('li');
    li.className = className;
    li.textContent = item.skill;
    li.title = item.group;
    ul.appendChild(li);
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}
