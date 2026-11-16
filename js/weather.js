const ALMATY = { latitude: 43.24, longitude: 76.95 };
const WEATHER_CACHE_MS = 15 * 60 * 1000;

const WEATHER_CODES = [
  { max: 0, text: "Clear sky", icon: "☀️" },
  { max: 3, text: "Partly cloudy", icon: "⛅" },
  { max: 48, text: "Fog", icon: "🌫️" },
  { max: 57, text: "Drizzle", icon: "🌦️" },
  { max: 67, text: "Rain", icon: "🌧️" },
  { max: 77, text: "Snow", icon: "❄️" },
  { max: 82, text: "Rain showers", icon: "🌧️" },
  { max: 86, text: "Snow showers", icon: "🌨️" },
  { max: 99, text: "Thunderstorm", icon: "⛈️" }
];

function describeWeather(code) {
  return WEATHER_CODES.find((item) => code <= item.max) || { text: "Unknown", icon: "☁️" };
}

function terraceAdvice(temperature, code) {
  if (code >= 51) return "Wet outside — we recommend a table in the main hall.";
  if (temperature < 10) return "Too cold for the terrace today — the fireplace corner is open.";
  if (temperature > 30) return "Hot day — terrace umbrellas and cold lemonade are ready.";
  return "Good terrace weather — ask for an outdoor table when you book.";
}

const weatherWidget = {
  api: new WeatherApi(),
  box: null,

  setState(state, html) {
    this.box.dataset.state = state;
    this.box.setAttribute("aria-busy", state === "loading" ? "true" : "false");
    this.box.innerHTML = html;
  },

  showLoading() {
    this.setState("loading", '<div class="spinner-border spinner-border-sm" role="status"></div> <span>Loading live weather for Almaty…</span>');
  },

  showError(message) {
    this.setState("error", "");
    const text = document.createElement("p");
    text.className = "mb-2";
    text.textContent = "Weather is not available right now. " + message;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn btn-outline-ink btn-sm";
    retry.textContent = "Try again";
    retry.addEventListener("click", () => this.load(true));
    this.box.append(text, retry);
  },

  render(data, savedAt) {
    if (!data || !data.current || !data.daily || !data.daily.time || data.daily.time.length === 0) {
      this.setState("empty", "<p class='mb-0'>No forecast data was returned for Almaty.</p>");
      return;
    }

    const now = data.current;
    const look = describeWeather(now.weather_code);
    this.setState("success", "");

    const current = document.createElement("div");
    current.className = "weather-now";
    current.innerHTML = `
      <span class="weather-icon" aria-hidden="true">${look.icon}</span>
      <div>
        <strong class="weather-temp">${Math.round(now.temperature_2m)}&deg;C</strong>
        <span class="weather-text">${look.text}, wind ${Math.round(now.wind_speed_10m)} km/h</span>
      </div>`;

    const advice = document.createElement("p");
    advice.className = "weather-advice";
    advice.textContent = terraceAdvice(now.temperature_2m, now.weather_code);

    const days = document.createElement("ul");
    days.className = "weather-days";
    data.daily.time.forEach((day, index) => {
      const item = document.createElement("li");
      const dayLook = describeWeather(data.daily.weather_code[index]);
      const label = index === 0 ? "Today" : new Date(day).toLocaleDateString("en-GB", { weekday: "short" });
      item.innerHTML = `<span>${label}</span><span aria-hidden="true">${dayLook.icon}</span>
        <span>${Math.round(data.daily.temperature_2m_min[index])}&deg; / ${Math.round(data.daily.temperature_2m_max[index])}&deg;</span>
        <small>rain ${data.daily.precipitation_probability_max[index] ?? 0}%</small>`;
      days.appendChild(item);
    });

    const updated = document.createElement("small");
    updated.className = "weather-updated";
    updated.textContent = "Updated " + new Date(savedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + " · Open-Meteo";

    this.box.append(current, advice, days, updated);
  },

  async load(forceFresh) {
    const cached = appStore.get("weather", null, (value) => value && value.savedAt && value.data);
    if (!forceFresh && cached && Date.now() - cached.savedAt < WEATHER_CACHE_MS) {
      this.render(cached.data, cached.savedAt);
      return;
    }

    this.showLoading();
    try {
      const data = await this.api.getForecast(ALMATY.latitude, ALMATY.longitude);
      const savedAt = Date.now();
      appStore.set("weather", { savedAt: savedAt, data: data });
      this.render(data, savedAt);
    } catch (error) {
      this.showError(error.message);
    }
  }
};

document.addEventListener("DOMContentLoaded", function () {
  weatherWidget.box = document.getElementById("weather-box");
  if (!weatherWidget.box) return;
  weatherWidget.load(false);
  document.getElementById("weather-refresh").addEventListener("click", () => weatherWidget.load(true));
});
