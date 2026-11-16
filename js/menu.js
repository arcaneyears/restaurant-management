const menuState = {
  category: "all",
  search: "",
  sort: "default",
  favourites: loadFavourites()
};

const order = new Order(appStore, menuItems);

function loadFavourites() {
  const saved = appStore.get("favourites", [], Array.isArray);
  return saved.filter((id) => menuItems.some((dish) => dish.id === id));
}

function saveFavourites() {
  appStore.set("favourites", menuState.favourites);
}

function getVisibleDishes(items, state) {
  const query = state.search.trim().toLowerCase();
  const result = items.filter(function (dish) {
    const inCategory = state.category === "all" || dish.category === state.category;
    const inSearch =
      query === "" ||
      dish.name.toLowerCase().includes(query) ||
      dish.desc.toLowerCase().includes(query);
    return inCategory && inSearch;
  });

  if (state.sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") result.sort((a, b) => b.price - a.price);
  return result;
}

function createDishCard(dish, isFavourite) {
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4";

  const card = document.createElement("article");
  card.className = "dish-tile" + (isFavourite ? " is-favourite" : "");
  card.dataset.id = dish.id;

  const tag = dish.tag ? `<span class="tag-pill">${dish.tag}</span>` : "";
  card.innerHTML = `
    <div class="dish-tile-head">
      <h3 class="menu-name">${dish.name}${tag}</h3>
      <button type="button" class="fav-btn" aria-label="Add ${dish.name} to favourites"
        aria-pressed="${isFavourite}">${isFavourite ? "♥" : "♡"}</button>
    </div>
    <p class="menu-desc">${dish.desc}</p>
    <div class="dish-tile-foot">
      <span class="menu-cost">${formatPrice(dish.price)}</span>
      <button type="button" class="btn btn-saffron btn-sm add-btn">Add to order</button>
    </div>`;

  col.appendChild(card);
  return col;
}

function renderMenu() {
  const grid = document.getElementById("dish-grid");
  const counter = document.getElementById("dish-count");
  const dishes = getVisibleDishes(menuItems, menuState);

  grid.innerHTML = "";
  for (const dish of dishes) {
    const fav = menuState.favourites.includes(dish.id);
    grid.appendChild(createDishCard(dish, fav));
  }

  counter.textContent = dishes.length + (dishes.length === 1 ? " dish" : " dishes") + " shown";
  document.getElementById("menu-empty").hidden = dishes.length > 0;
}

function renderCategoryButtons() {
  const holder = document.getElementById("category-filters");
  menuCategories.forEach(function (cat) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-ink btn-sm" + (cat.id === "all" ? " active" : "");
    button.dataset.category = cat.id;
    button.textContent = cat.label;
    holder.appendChild(button);
  });
}

function renderOrder() {
  const list = document.getElementById("order-list");
  list.innerHTML = "";

  order.items.forEach(function (line) {
    const dish = order.findDish(line.id);
    const li = document.createElement("li");
    li.className = "order-line";
    li.innerHTML = `
      <span>${dish.name}</span>
      <span class="order-qty">
        <button type="button" class="qty-btn" data-action="decrease" data-id="${dish.id}" aria-label="One less ${dish.name}">&minus;</button>
        <strong>${line.qty}</strong>
        <button type="button" class="qty-btn" data-action="increase" data-id="${dish.id}" aria-label="One more ${dish.name}">+</button>
        <span class="order-sum">${formatPrice(dish.price * line.qty)}</span>
        <button type="button" class="remove-btn" data-action="remove" data-id="${dish.id}" aria-label="Remove ${dish.name}">&times;</button>
      </span>`;
    list.appendChild(li);
  });

  const count = order.count();
  document.getElementById("order-total").textContent = formatPrice(order.total());
  document.getElementById("order-count").textContent = count;
  document.getElementById("order-empty").hidden = count > 0;
  document.getElementById("order-clear").disabled = count === 0;
}

document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("dish-grid")) return;

  renderCategoryButtons();
  renderMenu();
  renderOrder();

  document.getElementById("category-filters").addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;
    this.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    menuState.category = button.dataset.category;
    renderMenu();
  });

  document.getElementById("menu-search").addEventListener("input", function (event) {
    menuState.search = event.target.value;
    renderMenu();
  });

  document.getElementById("menu-sort").addEventListener("change", function (event) {
    menuState.sort = event.target.value;
    renderMenu();
  });

  document.getElementById("dish-grid").addEventListener("click", function (event) {
    const card = event.target.closest(".dish-tile");
    if (!card) return;
    const id = Number(card.dataset.id);

    if (event.target.classList.contains("fav-btn")) {
      const index = menuState.favourites.indexOf(id);
      if (index === -1) menuState.favourites.push(id);
      else menuState.favourites.splice(index, 1);
      saveFavourites();
      renderMenu();
    }

    if (event.target.classList.contains("add-btn")) {
      order.add(id);
      renderOrder();
      event.target.textContent = "Added ✓";
      setTimeout(() => (event.target.textContent = "Add to order"), 900);
    }
  });

  document.getElementById("order-list").addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = Number(button.dataset.id);
    if (button.dataset.action === "increase") order.add(id);
    if (button.dataset.action === "decrease") order.decrease(id);
    if (button.dataset.action === "remove") order.remove(id);
    renderOrder();
  });

  document.getElementById("order-clear").addEventListener("click", function () {
    order.clear();
    renderOrder();
  });

  document.getElementById("menu-search").addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      this.value = "";
      menuState.search = "";
      renderMenu();
    }
  });
});
