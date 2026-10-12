export default function Hero() {
  return (
    <section className="hero wrap">
      <p className="eyebrow">0 to Shipped · project 01</p>
      <h1>
        Know your resume&rsquo;s score
        <br />
        <span className="grad">before a recruiter does.</span>
      </h1>
      <p className="hero__sub">
        Drop in a PDF. We read it, score it against the skills hiring teams search for, and show you exactly what is
        missing. Nothing leaves your browser.
      </p>
      <a className="btn btn--primary" href="#upload">
        Upload a resume
      </a>
      <p className="hero__note">No sign-up. No upload server. Works offline once the page is loaded.</p>
    </section>
  );
}
