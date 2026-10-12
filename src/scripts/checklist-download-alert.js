// Observe the button without blocking the browser's normal file download.
// Local development and previews must not send messages to the support inbox.
const productionHosts = new Set(['aroundthehouseapp.com', 'www.aroundthehouseapp.com']);
const downloadLink = document.querySelector('#download-checklist');
let lastAlertAt = -Infinity;

downloadLink?.addEventListener('click', () => {
  if (!productionHosts.has(window.location.hostname)) return;

  const now = Date.now();
  // Avoid duplicate alerts from rapid clicks without storing visitor identifiers.
  if (now - lastAlertAt < 30_000) return;
  lastAlertAt = now;

  void fetch('https://formsubmit.co/ajax/support@quiettoolsapps.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'omit',
    // FormSubmit requires a referrer even when _url is supplied. Send only
    // the site origin, never a visitor's query string or full browsing URL.
    referrerPolicy: 'origin',
    keepalive: true,
    body: JSON.stringify({
      _subject: 'Around The House: annual checklist download requested',
      _template: 'table',
      _captcha: 'false',
      _url: 'https://aroundthehouseapp.com/annual-home-maintenance-checklist/',
      event: 'Download CSV button clicked (file saving is not confirmed)',
      document: 'Annual Home Maintenance Checklist',
      file: 'https://aroundthehouseapp.com/downloads/annual-home-maintenance-checklist.csv',
      page: 'https://aroundthehouseapp.com/annual-home-maintenance-checklist/',
      requested_at: new Date(now).toISOString(),
    }),
  }).catch(() => {
    // An unavailable notification service must not interrupt the download.
  });
});
