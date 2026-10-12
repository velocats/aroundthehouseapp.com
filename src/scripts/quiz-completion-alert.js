// Background alert when a visitor reaches their Home Health Check score.
// It carries no answers, score, or visitor identifier, and shows nothing on the page.
// Local development and previews must not send messages to the support inbox.
const productionHosts = new Set(['aroundthehouseapp.com', 'www.aroundthehouseapp.com']);
let alerted = false;

export function alertQuizCompleted() {
  if (!productionHosts.has(window.location.hostname)) return;
  // One alert per page load: reviewing answers or retaking is the same visit.
  if (alerted) return;
  alerted = true;

  void fetch('https://formsubmit.co/ajax/support@quiettoolsapps.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'omit',
    // FormSubmit requires a referrer even when _url is supplied. Send only
    // the site origin, never a visitor's query string or full browsing URL.
    referrerPolicy: 'origin',
    keepalive: true,
    body: JSON.stringify({
      _subject: 'Around The House: Home Health Check completed',
      _template: 'table',
      _captcha: 'false',
      _url: 'https://aroundthehouseapp.com/home-health-check/',
      event: 'Home Health Check completed (score shown)',
      page: 'https://aroundthehouseapp.com/home-health-check/',
      completed_at: new Date().toISOString(),
    }),
  }).catch(() => {
    // An unavailable notification service must not interrupt the quiz.
  });
}
