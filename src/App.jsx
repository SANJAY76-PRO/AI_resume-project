import { useState } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import UploadCard from './components/UploadCard.jsx';
import Results from './components/Results.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Footer from './components/Footer.jsx';
import { extractText } from './lib/extractText.js';
import { scoreResume } from './lib/scoring.js';

/* App owns the whole state of the flow. In the vanilla version these were
   DOM lookups and class toggles spread across three files; here they are
   just values, and React re-renders when they change. */
export default function App() {
  const [result, setResult] = useState(null); // null until a resume is scored
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'reading' | 'scoring' | 'error'
  const [message, setMessage] = useState('');

  const busy = status === 'reading' || status === 'scoring';

  async function handleFile(file) {
    setResult(null);
    setFileName(file.name);
    setStatus('reading');
    setMessage('Reading your resume…');

    try {
      const text = await extractText(file);
      setStatus('scoring');
      setMessage('Scoring…');
      setResult(scoreResume(text));
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  }

  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <section className="wrap" id="upload">
          <UploadCard onFile={handleFile} busy={busy} status={status} message={message} fileName={fileName} />
        </section>
        {result && (
          <section className="wrap results" id="results">
            <Results result={result} fileName={fileName} />
          </section>
        )}
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
