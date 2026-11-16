class Recipe {
  constructor(meal) {
    this.id = meal.idMeal;
    this.name = meal.strMeal;
    this.photo = meal.strMealThumb;
    this.category = meal.strCategory || "";
    this.area = meal.strArea || "";
    this.instructions = meal.strInstructions || "";
    this.video = meal.strYoutube || "";
    this.ingredients = Recipe.readIngredients(meal);
  }

  static readIngredients(meal) {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const name = (meal["strIngredient" + i] || "").trim();
      const measure = (meal["strMeasure" + i] || "").trim();
      if (name) list.push(measure ? measure + " " + name : name);
    }
    return list;
  }

  getSteps() {
    return this.instructions
      .split(/\r?\n/)
      .map((line) => line.replace(/^(step\s*)?\d+[.):]?\s*/i, "").trim())
      .filter((line) => line.length > 3);
  }

  toSaved() {
    return { id: this.id, name: this.name, photo: this.photo, category: this.category };
  }
}

class Order {
  constructor(store, menu) {
    this.store = store;
    this.menu = menu;
    this.items = this.load();
  }

  load() {
    const saved = this.store.get("order", [], Array.isArray);
    return saved.filter(
      (line) => line && Number.isInteger(line.qty) && line.qty > 0 && this.findDish(line.id)
    );
  }

  save() {
    this.store.set("order", this.items);
  }

  findDish(id) {
    return this.menu.find((dish) => dish.id === id);
  }

  add(id) {
    const line = this.items.find((item) => item.id === id);
    if (line) line.qty += 1;
    else this.items.push({ id: id, qty: 1 });
    this.save();
  }

  decrease(id) {
    const line = this.items.find((item) => item.id === id);
    if (!line) return;
    line.qty -= 1;
    if (line.qty <= 0) this.remove(id);
    else this.save();
  }

  remove(id) {
    this.items = this.items.filter((item) => item.id !== id);
    this.save();
  }

  clear() {
    this.items = [];
    this.store.remove("order");
  }

  count() {
    return this.items.reduce((sum, line) => sum + line.qty, 0);
  }

  total() {
    return this.items.reduce((sum, line) => sum + this.findDish(line.id).price * line.qty, 0);
  }
}

const HALL_NAMES = { main: "Main hall", family: "Family room", counter: "Kitchen counter" };

class Booking {
  constructor(data) {
    this.id = data.id || "b" + Date.now() + Math.floor(Math.random() * 1000);
    this.name = data.name;
    this.phone = data.phone;
    this.email = data.email || "";
    this.date = data.date;
    this.time = data.time;
    this.guests = Number(data.guests);
    this.hall = data.hall || "main";
    this.extras = Array.isArray(data.extras) ? data.extras : [];
    this.notes = data.notes || "";
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static isValid(data) {
    return (
      data &&
      typeof data.name === "string" &&
      typeof data.phone === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(data.date) &&
      /^\d{2}:\d{2}$/.test(data.time) &&
      Number(data.guests) > 0
    );
  }

  get dateTime() {
    return new Date(this.date + "T" + this.time);
  }

  isUpcoming() {
    return this.dateTime >= new Date();
  }

  hallName() {
    return HALL_NAMES[this.hall] || this.hall;
  }

  formatWhen() {
    const day = this.dateTime.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    return day + " · " + this.time;
  }
}

class BookingBook {
  constructor(store) {
    this.store = store;
    this.bookings = this.load();
  }

  load() {
    const saved = this.store.get("bookings", [], Array.isArray);
    return saved.filter(Booking.isValid).map((data) => new Booking(data));
  }

  save() {
    this.store.set("bookings", this.bookings);
  }

  add(data) {
    const booking = new Booking(data);
    this.bookings.push(booking);
    this.save();
    return booking;
  }

  find(id) {
    return this.bookings.find((booking) => booking.id === id) || null;
  }

  update(id, data) {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;
    const old = this.bookings[index];
    this.bookings[index] = new Booking({ ...data, id: old.id, createdAt: old.createdAt });
    this.save();
    return this.bookings[index];
  }

  remove(id) {
    this.bookings = this.bookings.filter((booking) => booking.id !== id);
    this.save();
  }

  clear() {
    this.bookings = [];
    this.store.remove("bookings");
  }

  list(filter, search, sort) {
    const query = (search || "").trim().toLowerCase();
    return this.bookings
      .filter((booking) => {
        if (filter === "upcoming" && !booking.isUpcoming()) return false;
        if (filter === "past" && booking.isUpcoming()) return false;
        return query === "" || booking.name.toLowerCase().includes(query) || booking.hallName().toLowerCase().includes(query);
      })
      .sort((a, b) => (sort === "newest" ? b.dateTime - a.dateTime : a.dateTime - b.dateTime));
  }

  getStats() {
    const upcoming = this.bookings.filter((booking) => booking.isUpcoming());
    const guestsBySlot = {};
    this.bookings.forEach((booking) => {
      guestsBySlot[booking.time] = (guestsBySlot[booking.time] || 0) + booking.guests;
    });
    const totalGuests = this.bookings.reduce((sum, booking) => sum + booking.guests, 0);
    return {
      total: this.bookings.length,
      upcoming: upcoming.length,
      guests: totalGuests,
      average: this.bookings.length ? (totalGuests / this.bookings.length).toFixed(1) : "0",
      next: upcoming.sort((a, b) => a.dateTime - b.dateTime)[0] || null,
      guestsBySlot: guestsBySlot
    };
  }
}
