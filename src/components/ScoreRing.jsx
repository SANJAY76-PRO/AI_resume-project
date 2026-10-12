import { useEffect, useState } from 'react';
import { RING_CIRCUMFERENCE } from '../lib/scoring.js';

const RATING_COLOR = {
  good: 'var(--good)',
  ok: 'var(--brand-2)',
  warn: 'var(--warn)',
  bad: 'var(--bad)',
};

/* The score is animated by starting at 0 and setting the real value on the
   next frame, so the CSS transition on stroke-dashoffset has somewhere to
   travel from. In React that is an effect, not a requestAnimationFrame in
   the middle of a render. */
export default function ScoreRing({ total, rating }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(total));
    return () => cancelAnimationFrame(id);
  }, [total]);

  const offset = RING_CIRCUMFERENCE * (1 - shown / 100);

  return (
    <div className="score">
      <svg className="ring" viewBox="0 0 140 140" role="img" aria-label={`Resume score: ${total} out of 100`}>
        <circle className="ring__track" cx="70" cy="70" r="60" />
        <circle
          className="ring__value"
          cx="70"
          cy="70"
          r="60"
          style={{ strokeDashoffset: offset, stroke: RATING_COLOR[rating] }}
        />
      </svg>
      <div className="score__text">
        <span className="score__number">{total}</span>
        <span className="score__out">/ 100</span>
      </div>
    </div>
  );
}
