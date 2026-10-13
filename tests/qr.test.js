import test from 'node:test';
import assert from 'node:assert/strict';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { normalizeUrl } from '../src/url.js';

test('voegt HTTPS toe en behoudt de exacte URL inclusief query en fragment', () => {
  assert.equal(normalizeUrl('  example.com/menu?q=eten%20en%20drinken#kaart  '), 'https://example.com/menu?q=eten%20en%20drinken#kaart');
  assert.equal(normalizeUrl('http://example.com'), 'http://example.com');
  assert.equal(normalizeUrl('https://example.com/één?taal=nl'), 'https://example.com/één?taal=nl');
});

test('weigert lege invoer, ongeldige URLs en onveilige protocollen', () => {
  for (const value of ['', 'geen website', 'example', 'https://', 'javascript:alert(1)', 'data:text/html,hello', 'ftp://example.com', 'https://user:password@example.com']) {
    assert.throws(() => normalizeUrl(value), value);
  }
});

test('QR-code decodeert rechtstreeks naar de oorspronkelijke URL', () => {
  for (const value of ['example.com', 'https://example.com/menu?taal=nl&item=42#kaart', 'https://example.com/één?naam=café']) {
    const url = normalizeUrl(value);
    const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
    const scale = 8;
    const margin = 4;
    const size = (qr.modules.size + margin * 2) * scale;
    const pixels = new Uint8ClampedArray(size * size * 4).fill(255);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const row = Math.floor(y / scale) - margin;
        const col = Math.floor(x / scale) - margin;
        if (row >= 0 && col >= 0 && row < qr.modules.size && col < qr.modules.size && qr.modules.get(row, col)) {
          const offset = (y * size + x) * 4;
          pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = 0;
        }
      }
    }
    const decoded = jsQR(pixels, size, size);
    assert.ok(decoded, 'QR-code moet scanbaar zijn');
    assert.equal(decoded.data, url);
  }
});
