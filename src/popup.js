const enabledHostnames = new EnabledHostnamesList();

async function getActiveTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs.length < 1) {
    throw new Error("could not get active tab");
  }
  return tabs[0];
}

async function updateUiState() {
  const activeTab = await getActiveTab();
  const currentUrl = new URL(activeTab.url);
  const currentProtocol = currentUrl.protocol;
  const currentHostname = currentUrl.hostname;
  const maskStatus = document.getElementById("maskStatus");
  const checkbox = document.getElementById("mask_enabled");
  const labelOff = document.querySelector(".label-off");
  const labelOn = document.querySelector(".label-on");

  // Add entry animations to body children
  document.body.querySelectorAll("h2, .toggle-wrap, hr, section, p").forEach((el, i) => {
    el.classList.add("animate-in");
    el.style.animationDelay = `${i * 40}ms`;
  });

  if (currentProtocol == "moz-extension:" || currentHostname == "") {
    maskStatus.innerText = "the mask cannot work on this site.";
    document.querySelector(".toggle-wrap").style.display = "none";
    return;
  }

  if (enabledHostnames.contains(currentHostname)) {
    maskStatus.innerText = "the mask is on! i pretend to be chrome on this site.";
    checkbox.checked = true;
    labelOn.style.color = "var(--accent-yellow)";
    labelOff.style.color = "var(--accent-blue)";
  } else {
    maskStatus.innerText = "the mask is off. i look like firefox to this site.";
    checkbox.checked = false;
    labelOff.style.color = "var(--accent-yellow)";
    labelOn.style.color = "var(--accent-blue)";
  }

  const inProductReporterLink = document.createElement("a");
  const webcompatLink = document.createElement("a");
  const breakageWarning = document.getElementById("breakageWarning");
  const reportBrokenSite = document.getElementById("reportBrokenSite");

  inProductReporterLink.href = "https://support.mozilla.org/kb/report-breakage-due-blocking";
  inProductReporterLink.innerText = "using the 'report broken site' feature";
  inProductReporterLink.style.color = "var(--accent-blue)";

  webcompatLink.href = "https://webcompat.com/issues/new?url=" + encodeURIComponent(activeTab.url);
  webcompatLink.innerText = "on webcompat.com";
  webcompatLink.style.color = "var(--accent-blue)";

  breakageWarning.innerText =
    "while chromask may help if you see a 'browser unsupported' message, it could cause unexpected breakage on some sites.";

  // Safe way to set the content
  reportBrokenSite.innerText = "if you find a site which works better with chromask enabled, please report it ";
  reportBrokenSite.appendChild(inProductReporterLink);
  reportBrokenSite.appendChild(document.createTextNode(" or "));
  reportBrokenSite.appendChild(webcompatLink);
  reportBrokenSite.appendChild(document.createTextNode(". thank you!"));

  const platformInfo = await browser.runtime.getPlatformInfo();
  if (platformInfo.os == "android") {
    document.getElementById("preferences").style.display = "none";
    document.getElementById("preferencesFallbackText").innerText =
      "to adjust preferences, please open the extension manager, select chromask, and hit settings.";
    document.getElementById("preferencesFallback").style.display = "block";
  } else {
    const preferencesButton = document.getElementById("preferencesButton");
    preferencesButton.innerText = "preferences";
    preferencesButton.addEventListener("click", async () => {
      await browser.runtime.openOptionsPage();
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await enabledHostnames.load();
  await updateUiState();

  document.getElementById("mask_enabled").addEventListener("change", async (ev) => {
    const activeTab = await getActiveTab();
    const currentHostname = new URL(activeTab.url).hostname;

    if (!currentHostname) {
      ev.target.checked = false;
      return;
    }

    if (ev.target.checked) {
      await enabledHostnames.add(currentHostname);
    } else {
      await enabledHostnames.remove(currentHostname);
    }

    await updateUiState();
  });
});
