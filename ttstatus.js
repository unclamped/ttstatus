const trackers = {
  'passthepopcorn.me': 'ptp',
  'redacted.ch': 'red',
  'gazellegames.net': 'ggn'
}

const serviceNames = {
  'Website': 'Website',
  'TrackerHTTP': 'HTTP Tracker',
  'TrackerHTTPS': 'HTTPS Tracker',
  'IRC': 'IRC',
  'IRCTorrentAnnouncer': 'IRC Torrent Announcer',
  'IRCUserIdentifier': 'IRC User Identifier',
  'Barney': 'Barney',
  'CableGuy': 'CableGuy',
  'ImageHost': 'Image host'
};
  
function checkSiteStatus(tabId, tab) {
  if (tab.active) {
    const site = new URL(tab.url).hostname;

    const apiName = trackers[site];
    if (!apiName) return;

    console.log('pingas')

    fetch(`https://${apiName + '.'}trackerstatus.info/api/status`)
      .then(response => response.json())
      .then(status => {
        let failingServices = [];
        for (const service in status) {
          if (status[service] === '0' || status[service] === '2') {
            const serviceName = serviceNames[service];
            failingServices.push(`, ${serviceName}`);
          }
        }

        if (failingServices.length > 0) {
          const message = failingServices.join('\n');
          browser.tabs.executeScript(tabId, {
            code: `alert("Beware! The following services don't seem to be properly working: ${message}.")`
          });
        }
      })
      .catch(console.error);
  }
}

browser.tabs.onUpdated.addListener(checkSiteStatus);  