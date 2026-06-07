if (typeof window.InstallTrigger !== "undefined") {
  delete window.wrappedJSObject.InstallTrigger;
}

Object.defineProperty(window.navigator.wrappedJSObject, "appVersion", {
  get: exportFunction(function () {
    return navigator.userAgent.replace("Mozilla/", "");
  }, window),

  set: exportFunction(function () {}, window),
});

Object.defineProperty(window.navigator.wrappedJSObject, "vendor", {
  get: exportFunction(function () {
    return "Google Inc.";
  }, window),

  set: exportFunction(function () {}, window),
});

// Spoof navigator.pdfViewerEnabled - Chrome usually has this true
Object.defineProperty(window.navigator.wrappedJSObject, "pdfViewerEnabled", {
  get: exportFunction(function () {
    return true;
  }, window),
  set: exportFunction(function () {}, window),
});

window.wrappedJSObject.chrome = cloneInto(
  {
    csi: exportFunction(function () {}, window),
    loadTimes: exportFunction(function () {}, window),
    runtime: {},
    webstore: {},
  },
  window,
);

const uaVersion = navigator.userAgent.split("Chrome/")[1].slice(0, 3);

const uaPlatform = {
  Win: "Windows",
  Mac: "macOS",
  Lin: "Android",
}[navigator.userAgent.slice(13, 16)];

navigator.wrappedJSObject.userAgentData = cloneInto(
  {
    brands: [
      { brand: "Chromium", version: uaVersion },
      { brand: "Google Chrome", version: uaVersion },
      { brand: "Not/A)Brand", version: "99" },
    ],
    mobile: uaPlatform == "Android",
    platform: uaPlatform,
    getHighEntropyValues: exportFunction(function (hints) {
      return Promise.resolve({
        brands: [
          { brand: "Chromium", version: uaVersion },
          { brand: "Google Chrome", version: uaVersion },
          { brand: "Not/A)Brand", version: "99" },
        ],
        mobile: uaPlatform == "Android",
        platform: uaPlatform,
        platformVersion: "10.0.0",
        architecture: "x86",
        model: "",
        uaFullVersion: `${uaVersion}.0.0.0`,
      });
    }, window),
  },
  navigator,
);
