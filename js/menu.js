/* =========================================================
   Saffron Table — interactive menu (menu.html)
   - dishes rendered from the menuItems array (data.js)
   - category filter, live search and price sorting
   - favourites (heart button) remembered in localStorage
   - "My order" list: add / remove dishes, running total
   ========================================================= */

const menuState = {
  category: "all",
  search: "",
  sort: "default",
  favourites: loadFavourites(),
  order: [] // array of { id, qty }
};

function loadFavourites() {
  try {
    return JSON.parse(localStorage.getItem("saffron-favourites")) || [];
  } catch (error) {
    return [];
  }
}

function saveFavourites() {
  try {
    localStorage.setItem("saffron-favourites", JSON.stringify(menuState.favourites));
  } catch (error) {
    /* ignore — favourites stay for this visit only */
  }
}

// Returns the list of dishes that match the current filter, search and sort
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

// Builds one dish card element from a dish object
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

// Re-renders the whole dish grid
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

// Builds the category buttons from the menuCategories array
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

// Returns the total price of the order
function calculateTotal(order) {
  let total = 0;
  for (let i = 0; i < order.length; i++) {
    const dish = menuItems.find((d) => d.id === order[i].id);
    total += dish.price * order[i].qty;
  }
  return total;
}

function addToOrder(id) {
  const line = menuState.order.find((item) => item.id === id);
  if (line) {
    line.qty += 1;
  } else {
    menuState.order.push({ id: id, qty: 1 });
  }
  renderOrder();
}

function removeFromOrder(id) {
  menuState.order = menuState.order.filter((item) => item.id !== id);
  renderOrder();
}

// Draws the "My order" list, adding and removing <li> elements
function renderOrder() {
  const list = document.getElementById("order-list");
  list.innerHTML = "";

  menuState.order.forEach(function (line) {
    const dish = menuItems.find((d) => d.id === line.id);
    const li = document.createElement("li");
    li.className = "order-line";
    li.innerHTML = `
      <span>${dish.name} <small>&times; ${line.qty}</small></span>
      <span>${formatPrice(dish.price * line.qty)}
        <button type="button" class="remove-btn" data-id="${dish.id}" aria-label="Remove ${dish.name}">&times;</button>
      </span>`;
    list.appendChild(li);
  });

  const count = menuState.order.reduce((sum, line) => sum + line.qty, 0);
  document.getElementById("order-total").textContent = formatPrice(calculateTotal(menuState.order));
  document.getElementById("order-count").textContent = count;
  document.getElementById("order-empty").hidden = count > 0;
  document.getElementById("order-clear").disabled = count === 0;
}

document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("dish-grid")) return;

  renderCategoryButtons();
  renderMenu();
  renderOrder();

  // click: switch category (event delegation on the button group)
  document.getElementById("category-filters").addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;
    this.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    menuState.category = button.dataset.category;
    renderMenu();
  });

  // input: live search while typing
  document.getElementById("menu-search").addEventListener("input", function (event) {
    menuState.search = event.target.value;
    renderMenu();
  });

  // change: sort by price
  document.getElementById("menu-sort").addEventListener("change", function (event) {
    menuState.sort = event.target.value;
    renderMenu();
  });

  // click inside the grid: favourite toggle or add to order
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
      addToOrder(id);
      event.target.textContent = "Added ✓";
      setTimeout(() => (event.target.textContent = "Add to order"), 900);
    }
  });

  document.getElementById("order-list").addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
      removeFromOrder(Number(event.target.dataset.id));
    }
  });

  document.getElementById("order-clear").addEventListener("click", function () {
    menuState.order = [];
    renderOrder();
  });

  // keydown: Escape clears the search box
  document.getElementById("menu-search").addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      this.value = "";
      menuState.search = "";
      renderMenu();
    }
  });
});
