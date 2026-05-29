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

window.wrappedJSObject.chrome = cloneInto(
  {
    csi: {},
    loadTimes: {},
    runtime: {},
    webstore: {},
  },
  window,
);

// Dear reader, I apologize for the code that follows next. I effecivetly have
// to parse some things out of the UA string again to build the Client Hints JS
// API spoof. Any "reasonable" methods for passing data from the Background
// Script into here would allow async message passing, which would make the
// timings of these shims rather unpredicable. I don't want that kind of headache
// in my future, so I prefer this kinda of headache instead.

// Yes, this breaks for four-digit version numbers. If I'm still doing WebCompat
// work by then, something went either very right, or very wrong. :p
const uaVersion = navigator.userAgent.split("Chrome/")[1].slice(0, 3);

// Also, this is kinda horrible. I don't want to do too much string operation
// work here, and since I know Chome Mask never spoof as a Linux UA string, I
// can just naively assume that all UA strings that have a `Lin` as the first
// three chars in the OS segment are Android.
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
  },
  navigator,
);
