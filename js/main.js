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

document.addEventListener("DOMContentLoaded", function () {
  createThemeToggle();
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
