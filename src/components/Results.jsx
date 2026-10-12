import ScoreRing from './ScoreRing.jsx';
import SkillList from './SkillList.jsx';
import { verdictFor, fixesFor, ratingFor } from '../lib/scoring.js';

export default function Results({ result, fileName }) {
  const { total, found, missing, checks, skillPoints, checkPoints } = result;
  const [title, copy] = verdictFor(total);
  const rating = ratingFor(total);
  const fixes = fixesFor(result);

  return (
    <div className="card card--wide">
      <div className="results__head">
        <ScoreRing total={total} rating={rating} />
        <div className="verdict">
          <h2>{title}</h2>
          <p className="muted">{copy}</p>
          <p className="note">
            Heuristic scoring: {skillPoints} + {checkPoints} = {total}/100.
          </p>
        </div>
      </div>

      <div className="columns">
        <SkillList title="Skills we found" variant="good" items={found} emptyMessage="Nothing matched yet." />
        <SkillList
          title="Skills missing"
          variant="warn"
          items={missing.slice(0, 12)}
          emptyMessage="Nothing missing — nice."
          count={missing.length}
        />
      </div>

      <div className="checks">
        <h3 className="col__title">Structure checks</h3>
        <ul className="checks__list">
          {checks.map((c) => (
            <li key={c.label}>
              <span className={`tick ${c.ok ? 'tick--pass' : 'tick--fail'}`}>{c.ok ? '✓' : '✕'}</span>
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="fixes">
        <h3 className="col__title">Fix these next</h3>
        <ol className="fixes__list">
          {fixes.length ? fixes.map((f) => <li key={f}>{f}</li>) : <li>Nothing to fix — send it.</li>}
        </ol>
      </div>
    </div>
  );
}
