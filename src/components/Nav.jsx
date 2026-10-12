export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <a className="brand" href="#top">
          <span className="brand__mark">0&nbsp;&rarr;&nbsp;S</span>
          <span className="brand__name">ResumeScore</span>
        </a>
        <nav className="nav__links">
          <a href="#how">How it works</a>
          <a href="#upload">Check my resume</a>
        </nav>
      </div>
    </header>
  );
}
