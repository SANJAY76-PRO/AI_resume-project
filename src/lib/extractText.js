/* ============================================================
   Reading the file. Nothing here touches React — it takes a File
   and resolves to a string, so it can be tested or reused anywhere.
   ============================================================ */

const MAX_BYTES = 5 * 1024 * 1024;

export async function extractText(file) {
  if (file.size > MAX_BYTES) {
    throw new Error(`That file is ${(file.size / 1048576).toFixed(1)} MB — please keep it under 5 MB.`);
  }

  const text =
    file.type === 'text/plain' || file.name.endsWith('.txt') ? await file.text() : await extractPdfText(file);

  if (text.trim().length < 40) {
    throw new Error(
      'We could not read text from that file. If it is a scan or an image-only PDF, export it with a text layer first.',
    );
  }

  return text;
}

/* pdf.js is ~1 MB, so the script is fetched on first PDF, not on page load.
   The promise is cached so a second upload does not re-download it. */
let pdfjsPromise = null;

function loadPdfJs() {
  if (pdfjsPromise) return pdfjsPromise;

  pdfjsPromise = new Promise((resolve, reject) => {
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

  return pdfjsPromise;
}

async function extractPdfText(file) {
  const pdfjsLib = await loadPdfJs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    // join items with a space so words that are separate PDF runs do not fuse
    pages.push(content.items.map((item) => item.str).join(' '));
  }
  return pages.join('\n');
}
