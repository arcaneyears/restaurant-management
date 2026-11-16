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
