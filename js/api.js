class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

class ApiClient {
  constructor(baseUrl, timeoutMs) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs || 8000;
  }

  buildUrl(path, params) {
    const url = new URL(this.baseUrl + path);
    Object.entries(params || {}).forEach(([name, value]) => url.searchParams.set(name, value));
    return url.toString();
  }

  async getJSON(path, params) {
    if (!navigator.onLine) {
      throw new ApiError("You seem to be offline. Check the connection and try again.");
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.buildUrl(path, params), { signal: controller.signal });
      if (!response.ok) {
        throw new ApiError("The service answered with an error (" + response.status + ").", response.status);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error.name === "AbortError") throw new ApiError("The service took too long to answer.");
      throw new ApiError("Could not reach the service. Please try again in a moment.");
    } finally {
      clearTimeout(timer);
    }
  }
}

class MealApi extends ApiClient {
  constructor() {
    super("https://www.themealdb.com/api/json/v1/1/", 8000);
  }

  async getCategories() {
    const data = await this.getJSON("categories.php");
    return (data.categories || []).map((item) => item.strCategory);
  }

  async searchByName(term) {
    const data = await this.getJSON("search.php", { s: term });
    return (data.meals || []).map((meal) => new Recipe(meal));
  }

  async filterByCategory(category) {
    const data = await this.getJSON("filter.php", { c: category });
    return (data.meals || []).map((meal) => new Recipe({ ...meal, strCategory: category }));
  }

  async getById(id) {
    const data = await this.getJSON("lookup.php", { i: id });
    return data.meals && data.meals.length ? new Recipe(data.meals[0]) : null;
  }
}

class WeatherApi extends ApiClient {
  constructor() {
    super("https://api.open-meteo.com/v1/", 8000);
  }

  getForecast(latitude, longitude) {
    return this.getJSON("forecast", {
      latitude: latitude,
      longitude: longitude,
      current: "temperature_2m,weather_code,wind_speed_10m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      forecast_days: 3,
      timezone: "auto"
    });
  }
}
