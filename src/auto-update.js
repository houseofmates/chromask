// auto-update: checks the original source repo for new releases
// original: https://github.com/denschub/chrome-mask
// this is a fork: chromask by houseofmates
// checks every 6 hours and alerts via badge

(async () => {
  const ORIGINAL_REPO = "denschub/chrome-mask";
  const CHECK_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours
  const STORAGE_KEY = "chromask_update_check";

  async function checkForUpdates() {
    try {
      const resp = await fetch(`https://api.github.com/repos/${ORIGINAL_REPO}/releases/latest`);
      if (!resp.ok) return;

      const data = await resp.json();
      const latestVersion = data.tag_name.replace(/^v/i, "");
      const currentVersion = browser.runtime.getManifest().version;

      // store latest known version
      const stored = await browser.storage.local.get(STORAGE_KEY);
      const known = stored[STORAGE_KEY] || {};

      if (latestVersion !== known.latestVersion) {
        known.latestVersion = latestVersion;
        known.lastChecked = Date.now();
        await browser.storage.local.set({ [STORAGE_KEY]: known });

        // compare semver
        if (compareVersions(latestVersion, currentVersion) > 0) {
          browser.browserAction.setBadgeText({ text: "!" });
          browser.browserAction.setBadgeBackgroundColor({ color: "#f6b012" });
        }
      }
    } catch (e) {
      console.debug("chromask update check failed:", e.message);
    }
  }

  function compareVersions(a, b) {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const na = pa[i] || 0;
      const nb = pb[i] || 0;
      if (na > nb) return 1;
      if (na < nb) return -1;
    }
    return 0;
  }

  // initial check
  await checkForUpdates();

  // periodic check
  setInterval(checkForUpdates, CHECK_INTERVAL);
})();
