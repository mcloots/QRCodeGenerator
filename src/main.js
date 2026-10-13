import QRCode from 'qrcode';
import { normalizeUrl } from './url.js';
import './style.css';

const form = document.querySelector('#qr-form');
const input = document.querySelector('#url');
const error = document.querySelector('#error');
const generate = document.querySelector('#generate');
const pngButton = document.querySelector('#download-png');
const svgButton = document.querySelector('#download-svg');
const qrImage = document.querySelector('#qr-image');
const resultUrl = document.querySelector('#result-url');
const status = document.querySelector('#status');
const options = { errorCorrectionLevel: 'M', margin: 4, width: 1200, color: { dark: '#000000', light: '#ffffff' } };
let result = null;
let revision = 0;

function clearResult() {
  revision++;
  result = null;
  pngButton.disabled = svgButton.disabled = true;
  qrImage.hidden = resultUrl.hidden = true;
  document.querySelector('#placeholder').hidden = false;
  status.textContent = '';
}

input.addEventListener('input', () => {
  clearResult();
  error.hidden = true;
  input.removeAttribute('aria-invalid');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearResult();
  const currentRevision = revision;
  error.hidden = true;
  input.removeAttribute('aria-invalid');
  let url;
  try { url = normalizeUrl(input.value); }
  catch (err) {
    error.textContent = err.message;
    error.hidden = false;
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  generate.disabled = true;
  generate.textContent = 'Je code wordt gemaakt…';
  try {
    const [png, svg] = await Promise.all([
      QRCode.toDataURL(url, options),
      QRCode.toString(url, { ...options, type: 'svg' }),
    ]);
    if (revision !== currentRevision) return;
    result = { png, svg, hostname: new URL(url).hostname };
    qrImage.src = png;
    qrImage.alt = `QR-code voor ${url}`;
    qrImage.hidden = false;
    document.querySelector('#placeholder').hidden = true;
    resultUrl.textContent = url;
    resultUrl.hidden = false;
    pngButton.disabled = svgButton.disabled = false;
    status.textContent = 'Je QR-code is klaar. Download als PNG of SVG.';
  } catch {
    if (revision !== currentRevision) return;
    error.textContent = 'Deze URL is te lang om een QR-code te maken. Probeer een kortere URL.';
    error.hidden = false;
  } finally {
    generate.disabled = false;
    generate.innerHTML = 'Maak mijn QR-code <span aria-hidden="true">↗</span>';
  }
});

function download(format) {
  if (!result) return;
  const link = document.createElement('a');
  const blobUrl = format === 'svg' ? URL.createObjectURL(new Blob([result.svg], { type: 'image/svg+xml;charset=utf-8' })) : null;
  link.href = blobUrl || result.png;
  link.download = `qr-${result.hostname.replace(/[^a-z0-9.-]/gi, '_')}.${format}`;
  document.body.append(link);
  link.click();
  link.remove();
  if (blobUrl) setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  status.textContent = `${format.toUpperCase()}-download gestart.`;
}
pngButton.addEventListener('click', () => download('png'));
svgButton.addEventListener('click', () => download('svg'));
