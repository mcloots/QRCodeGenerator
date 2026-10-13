export function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error('Vul eerst een website-URL in.');
  if (/\s/.test(trimmed)) throw new Error('Een URL mag geen spaties bevatten.');
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;
  let url;
  try { url = new URL(candidate); }
  catch { throw new Error('Vul een geldige URL in, bijvoorbeeld https://jouwwebsite.be.'); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Gebruik een URL die begint met http:// of https://.');
  if (!url.hostname || url.username || url.password || (!url.hostname.includes('.') && url.hostname !== 'localhost' && !url.hostname.startsWith('['))) {
    throw new Error('Vul een geldige website-URL in, zonder gebruikersnaam of wachtwoord.');
  }
  // Preserve the submitted path, query and fragment instead of rewriting them.
  return candidate;
}
