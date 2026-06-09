const enabledHostnames = new EnabledHostnamesList();

async function initUi() {
  document.getElementById("add-site-title").innerText = "add site";
  document.getElementById("add-site-hostname-explanation").innerText =
    "note: always enter the full domain name. if you enter example.com, chromask will not be active on www.example.com!";
  document.getElementById("masked-sites-title").innerText = "currently masked sites";
  document.getElementById("add-site-button").value = "add site";

  // Add entry animations
  document.querySelectorAll("section").forEach((s, i) => {
    s.classList.add("animate-in");
    s.classList.add(`stagger-${i + 1}`);
  });

  setupAddForm();
  setupSiteList();
  setupKeyboardShortcuts();
  setupSearch();
}

function tryValidateHostname(input) {
  try {
    return new URL(input).hostname;
  } catch {}
  try {
    return new URL(`https://${input}`).hostname;
  } catch {}
  return undefined;
}

function setupAddForm() {
  const inputEl = document.getElementById("add-site-input");
  const form = document.getElementById("add-site-form");

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const maybeHostname = tryValidateHostname(inputEl.value);

    // Clear old errors
    const oldError = form.parentElement.querySelector(".error-msg");
    if (oldError) oldError.remove();

    if (!maybeHostname) {
      showError("please enter a valid domain!");
      return false;
    }
    if (enabledHostnames.contains(maybeHostname)) {
      showError("chromask is already enabled for this domain!");
      return false;
    }
    await enabledHostnames.add(maybeHostname);
    inputEl.value = "";
    window.location.reload();
  });
}

function showError(msg) {
  const error = document.createElement("p");
  error.className = "error-msg";
  error.innerText = msg;
  error.style.color = "var(--accent-blue)";
  error.style.marginTop = "8px";
  error.classList.add("animate-in");
  document.getElementById("add-site-form").after(error);
}

function setupSiteList(filter = "") {
  const siteList = document.getElementById("masked-sites");
  siteList.innerHTML = "";

  const values = [...enabledHostnames.get_values()]
    .filter((h) => h.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  if (values.length < 1) {
    const item = document.createElement("p");
    item.innerText = filter ? "no sites match your search." : "you did not enable chromask on any site yet!";
    item.style.opacity = "0.6";
    siteList.appendChild(item);
    return;
  }

  values.forEach((hostname, i) => {
    const item = document.createElement("div");
    item.classList.add("site-list-item", "animate-in");
    item.style.animationDelay = `${i * 20}ms`;

    const label = document.createElement("p");
    label.textContent = hostname;

    const del = document.createElement("button");
    del.textContent = "remove";
    del.addEventListener("click", async () => {
      await enabledHostnames.remove(hostname);
      setupSiteList(document.getElementById("search-input").value);
    });

    item.append(label, del);
    siteList.appendChild(item);
  });
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    setupSiteList(e.target.value);
  });
}

async function setupKeyboardShortcuts() {
  const platformInfo = await browser.runtime.getPlatformInfo();
  if (platformInfo.os == "android") return;

  document.getElementById("shortcuts-title").textContent = "keyboard shortcuts";
  document.getElementById("shortcuts-command-combo").textContent = "keys";
  document.getElementById("shortcuts-command-description").textContent = "description";

  const list = document.getElementById("shortcuts-command-list");
  const commands = await browser.commands.getAll();
  commands.forEach((cmd) => {
    const row = document.createElement("tr");
    const key = document.createElement("td");
    key.textContent = cmd.shortcut || "undefined";
    const desc = document.createElement("td");
    desc.textContent = cmd.description;
    row.append(key, desc);
    list.appendChild(row);
  });

  const browserInfo = await browser.runtime.getBrowserInfo();
  const ver = browserInfo.version.split(".")[0];
  if (ver >= 137) {
    const btn = document.getElementById("shortcuts-open-panel-button");
    btn.textContent = "open keyboard shortcut settings";
    btn.addEventListener("click", async () => {
      if (browser.commands?.openShortcutSettings) {
        await browser.commands.openShortcutSettings();
      }
    });
    btn.style.display = "block";
  }

  document.getElementById("shortcuts-section").style.display = "block";
}

document.addEventListener("DOMContentLoaded", async () => {
  await enabledHostnames.load();
  await initUi();

  browser.runtime.onMessage.addListener(async (msg) => {
    if (msg.action === "enabled_hostnames_changed") {
      setupSiteList(document.getElementById("search-input").value);
    }
  });
});
