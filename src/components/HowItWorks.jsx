export default function HowItWorks() {
  const steps = [
    {
      title: 'You pick a file',
      body: 'We read it with pdf.js, right here in the tab. Your resume is never sent anywhere.',
    },
    {
      title: 'We look for signal',
      body: 'A catalogue of skills is keyword-matched against the text, plus checks for contact details, sections and numbers.',
    },
    {
      title: 'You get the gaps',
      body: 'A score out of 100, the skills that landed, the ones that did not, and what to fix first.',
    },
  ];

  return (
    <section className="wrap how" id="how">
      <h2 className="section__title">How it works</h2>
      <ol className="steps">
        {steps.map((step, i) => (
          <li className="step" key={step.title}>
            <span className="step__num">{i + 1}</span>
            <h3>{step.title}</h3>
            <p className="muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
