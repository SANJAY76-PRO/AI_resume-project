import { useRef, useState } from 'react';

/* The dropzone. Drag state is local because nothing outside this card
   cares whether the cursor is currently over it. */
export default function UploadCard({ onFile, busy, status, message, fileName }) {
  const [isOver, setIsOver] = useState(false);
  const inputRef = useRef(null);

  function stop(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    stop(e);
    setIsOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <>
      <div
        className={`card upload${isOver ? ' is-over' : ''}`}
        onDragEnter={(e) => (stop(e), setIsOver(true))}
        onDragOver={(e) => (stop(e), setIsOver(true))}
        onDragLeave={(e) => (stop(e), setIsOver(false))}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
            // reset so choosing the same file twice fires change again
            e.target.value = '';
          }}
        />

        <div className="upload__icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
        </div>

        <h2>Drop your resume here</h2>
        <p className="muted">PDF or plain text, up to about 5&nbsp;MB.</p>

        <button className="btn btn--ghost" type="button" disabled={busy} onClick={() => inputRef.current?.click()}>
          Choose a file
        </button>

        {fileName && <p className="upload__file">Scored: {fileName}</p>}
      </div>

      {/* status line — one of three states, so no DOM toggling needed */}
      {status !== 'idle' && (
        <p className={`status${status === 'error' ? ' is-error' : ''}`}>
          {status !== 'error' && <span className="spinner" aria-hidden="true" />}
          <span>{message}</span>
        </p>
      )}
    </>
  );
}
