/* One column of skill chips. `count` lets the "missing" column show the
   true total even though only the first twelve are rendered. */
export default function SkillList({ title, variant, items, emptyMessage, count }) {
  const shown = count ?? items.length;

  return (
    <div className="col">
      <h3 className="col__title">
        {title} <span className={`pill pill--${variant}`}>{shown}</span>
      </h3>
      <ul className="chips">
        {items.length === 0 ? (
          <li className="is-empty">{emptyMessage}</li>
        ) : (
          items.map((item) => (
            <li key={item.skill} className={`is-${variant === 'good' ? 'found' : 'missing'}`} title={item.group}>
              {item.skill}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
