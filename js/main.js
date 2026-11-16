const OPEN_HOUR = 10;
const CLOSE_HOUR = 23;

function readSetting(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
  }
}

function isOpenAt(hour) {
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

function applyTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.textContent = theme === "dark" ? "☀ Light" : "☾ Dark";
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }
}

function createThemeToggle() {
  const navList = document.querySelector("#mainMenu .navbar-nav");
  if (!navList) return;

  const item = document.createElement("li");
  item.className = "nav-item ms-lg-2 mt-2 mt-lg-0";

  const button = document.createElement("button");
  button.type = "button";
  button.id = "theme-toggle";
  button.className = "btn btn-sm btn-theme";
  item.appendChild(button);
  navList.appendChild(item);

  button.addEventListener("click", function () {
    const next = document.body.classList.contains("theme-dark") ? "light" : "dark";
    applyTheme(next);
    saveSetting("saffron-theme", next);
  });
}

function showOpenStatus() {
  const topbar = document.querySelector(".topbar-inner");
  if (!topbar) return;

  const open = isOpenAt(new Date().getHours());
  const badge = document.createElement("span");
  badge.className = "topbar-item status-badge " + (open ? "is-open" : "is-closed");
  badge.textContent = open ? "● Open now" : "● Closed now";
  topbar.prepend(badge);
}

const FONT_STEPS = [90, 100, 112.5];

function applyFontStep(step) {
  const safeStep = FONT_STEPS[step] ? step : 1;
  document.documentElement.style.fontSize = FONT_STEPS[safeStep] + "%";
  document.querySelectorAll(".font-btn").forEach(function (button) {
    button.setAttribute("aria-pressed", Number(button.dataset.step) === safeStep ? "true" : "false");
  });
  return safeStep;
}

function createFontControls() {
  const topbar = document.querySelector(".topbar-inner");
  if (!topbar || typeof appStore === "undefined") return;

  const group = document.createElement("div");
  group.className = "topbar-item font-controls";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Text size");

  const labels = ["A\u2212", "A", "A+"];
  const names = ["Smaller text", "Normal text", "Larger text"];
  labels.forEach(function (label, step) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "font-btn";
    button.dataset.step = step;
    button.textContent = label;
    button.setAttribute("aria-label", names[step]);
    group.appendChild(button);
  });
  topbar.appendChild(group);

  group.addEventListener("click", function (event) {
    const button = event.target.closest(".font-btn");
    if (!button) return;
    const step = applyFontStep(Number(button.dataset.step));
    appStore.set("font-step", step);
  });

  applyFontStep(appStore.get("font-step", 1, Number.isInteger));
}

document.addEventListener("DOMContentLoaded", function () {
  createThemeToggle();
  createFontControls();
  applyTheme(readSetting("saffron-theme", "light"));
  showOpenStatus();

  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    const updateBackToTop = function () {
      backToTop.classList.toggle("is-visible", window.scrollY > 400);
    };
    window.addEventListener("scroll", updateBackToTop);
    updateBackToTop();

    backToTop.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
