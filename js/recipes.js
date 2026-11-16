const PAGE_SIZE = 8;

const recipeState = {
  api: new MealApi(),
  results: [],
  sort: "az",
  page: 1,
  lastRequest: null,
  title: ""
};

function isSavedRecipe(item) {
  return item && typeof item.id === "string" && typeof item.name === "string";
}

function getSavedRecipes() {
  const list = appStore.get("saved-recipes", [], Array.isArray);
  return list.filter(isSavedRecipe);
}

function setSavedRecipes(list) {
  appStore.set("saved-recipes", list);
  renderSaved();
}

function toggleSaved(recipe) {
  const list = getSavedRecipes();
  const exists = list.some((item) => item.id === recipe.id);
  setSavedRecipes(exists ? list.filter((item) => item.id !== recipe.id) : [...list, recipe.toSaved()]);
  return !exists;
}

function showStatus(state, message) {
  const status = document.getElementById("recipe-status");
  status.dataset.state = state;
  status.innerHTML = "";

  if (state === "loading") {
    status.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> ';
  }
  const text = document.createElement("span");
  text.textContent = message;
  status.appendChild(text);

  if (state === "error" && recipeState.lastRequest) {
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn btn-outline-ink btn-sm ms-2";
    retry.textContent = "Retry";
    retry.addEventListener("click", recipeState.lastRequest);
    status.appendChild(retry);
  }
}

function sortedResults() {
  const copy = [...recipeState.results];
  copy.sort((a, b) => a.name.localeCompare(b.name));
  return recipeState.sort === "za" ? copy.reverse() : copy;
}

function createRecipeCard(recipe, savedIds) {
  const col = document.createElement("div");
  col.className = "col-sm-6 col-lg-3";

  const card = document.createElement("article");
  card.className = "recipe-card";
  card.dataset.id = recipe.id;

  const img = document.createElement("img");
  img.src = recipe.photo + "/preview";
  img.alt = recipe.name;
  img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "recipe-card-body";

  const title = document.createElement("h3");
  title.textContent = recipe.name;

  const meta = document.createElement("p");
  meta.className = "recipe-meta";
  meta.textContent = [recipe.category, recipe.area].filter(Boolean).join(" · ");

  const actions = document.createElement("div");
  actions.className = "recipe-actions";
  const saved = savedIds.includes(recipe.id);
  actions.innerHTML = `
    <button type="button" class="btn btn-saffron btn-sm" data-action="details">View recipe</button>
    <button type="button" class="btn btn-outline-ink btn-sm" data-action="save" aria-pressed="${saved}">${saved ? "♥ Saved" : "♡ Save"}</button>`;

  body.append(title, meta, actions);
  card.append(img, body);
  col.appendChild(card);
  return col;
}

function renderResults() {
  const grid = document.getElementById("recipe-grid");
  const list = sortedResults();
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  recipeState.page = Math.min(recipeState.page, pages);

  const start = (recipeState.page - 1) * PAGE_SIZE;
  const pageItems = list.slice(start, start + PAGE_SIZE);
  const savedIds = getSavedRecipes().map((item) => item.id);

  grid.innerHTML = "";
  pageItems.forEach((recipe) => grid.appendChild(createRecipeCard(recipe, savedIds)));
  $(grid).hide().fadeIn(250);

  if (list.length > 0) {
    showStatus("success", `Showing ${start + 1}–${start + pageItems.length} of ${list.length} recipes for “${recipeState.title}”.`);
  }
  renderPagination(pages);
}

function renderPagination(pages) {
  const nav = document.getElementById("recipe-pages");
  nav.innerHTML = "";
  if (pages <= 1) return;

  for (let page = 1; page <= pages; page++) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "page-btn" + (page === recipeState.page ? " active" : "");
    button.textContent = page;
    button.dataset.page = page;
    if (page === recipeState.page) button.setAttribute("aria-current", "page");
    nav.appendChild(button);
  }
}

async function runRequest(title, request) {
  recipeState.title = title;
  recipeState.lastRequest = () => runRequest(title, request);
  showStatus("loading", "Loading recipes…");
  document.getElementById("recipe-grid").innerHTML = "";
  document.getElementById("recipe-pages").innerHTML = "";

  try {
    recipeState.results = await request();
    recipeState.page = 1;
    if (recipeState.results.length === 0) {
      showStatus("empty", `No recipes found for “${title}”. Try another word, e.g. “lamb” or “soup”.`);
      return;
    }
    renderResults();
  } catch (error) {
    recipeState.results = [];
    showStatus("error", error.message);
  }
}

function searchRecipes(term) {
  document.getElementById("recipe-category").value = "";
  return runRequest(term, () => recipeState.api.searchByName(term));
}

function loadCategory(category) {
  document.getElementById("recipe-search").value = "";
  return runRequest(category, () => recipeState.api.filterByCategory(category));
}

async function loadCategories() {
  const select = document.getElementById("recipe-category");
  try {
    const categories = await recipeState.api.getCategories();
    categories.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
  } catch (error) {
    select.disabled = true;
    select.options[0].textContent = "Categories unavailable";
  }
}

async function openDetails(id) {
  const modalEl = document.getElementById("recipe-modal");
  const body = document.getElementById("recipe-modal-body");
  const title = document.getElementById("recipe-modal-title");
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  title.textContent = "Loading…";
  body.innerHTML = '<div class="text-center py-4"><span class="spinner-border" role="status"></span></div>';
  modal.show();

  try {
    const recipe = await recipeState.api.getById(id);
    if (!recipe) {
      title.textContent = "Recipe not found";
      body.textContent = "This recipe is no longer available.";
      return;
    }
    title.textContent = recipe.name;
    body.innerHTML = "";

    const img = document.createElement("img");
    img.src = recipe.photo;
    img.alt = recipe.name;
    img.className = "recipe-modal-img";

    const meta = document.createElement("p");
    meta.className = "recipe-meta";
    meta.textContent = [recipe.category, recipe.area, recipe.ingredients.length + " ingredients"].filter(Boolean).join(" · ");

    const ingTitle = document.createElement("h3");
    ingTitle.textContent = "Ingredients";
    const ingList = document.createElement("ul");
    ingList.className = "ingredient-list";
    recipe.ingredients.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      ingList.appendChild(li);
    });

    const stepTitle = document.createElement("h3");
    stepTitle.textContent = "Method";
    const steps = document.createElement("ol");
    steps.className = "step-list";
    recipe.getSteps().forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      steps.appendChild(li);
    });

    body.append(img, meta, ingTitle, ingList, stepTitle, steps);

    if (recipe.video) {
      const link = document.createElement("a");
      link.href = recipe.video;
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "btn btn-outline-ink btn-sm";
      link.textContent = "Watch the video";
      body.appendChild(link);
    }
  } catch (error) {
    title.textContent = "Could not load the recipe";
    body.textContent = error.message;
  }
}

function renderSaved() {
  const list = getSavedRecipes();
  const holder = document.getElementById("saved-list");
  document.getElementById("saved-count").textContent = list.length;
  document.getElementById("saved-clear").disabled = list.length === 0;
  holder.innerHTML = "";

  if (list.length === 0) {
    holder.innerHTML = '<li class="saved-empty">No saved recipes yet. Press “♡ Save” on any card.</li>';
    return;
  }

  list.forEach((item) => {
    const li = document.createElement("li");
    li.className = "saved-item";
    li.dataset.id = item.id;
    li.innerHTML = `<img src="${item.photo}/preview" alt="" />
      <button type="button" class="saved-open" data-action="details"></button>
      <button type="button" class="remove-btn" data-action="unsave" aria-label="Remove from saved">&times;</button>`;
    li.querySelector(".saved-open").textContent = item.name;
    holder.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("recipe-grid")) return;

  renderSaved();
  loadCategories();
  loadCategory("Lamb");

  const searchInput = document.getElementById("recipe-search");
  const searchError = document.getElementById("recipe-search-error");

  document.getElementById("recipe-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const term = searchInput.value.trim();
    if (term.length < 2 || !/^[a-zA-Z\s-]+$/.test(term)) {
      searchInput.classList.add("is-invalid");
      searchError.textContent = "Type at least 2 English letters, e.g. “chicken”.";
      return;
    }
    searchInput.classList.remove("is-invalid");
    searchRecipes(term);
  });

  searchInput.addEventListener("input", () => searchInput.classList.remove("is-invalid"));

  document.getElementById("recipe-category").addEventListener("change", function () {
    if (this.value) loadCategory(this.value);
  });

  document.getElementById("recipe-sort").addEventListener("change", function () {
    recipeState.sort = this.value;
    recipeState.page = 1;
    if (recipeState.results.length) renderResults();
  });

  document.getElementById("recipe-pages").addEventListener("click", function (event) {
    const button = event.target.closest(".page-btn");
    if (!button) return;
    recipeState.page = Number(button.dataset.page);
    renderResults();
    document.getElementById("recipe-status").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("recipe-grid").addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = button.closest(".recipe-card").dataset.id;
    const recipe = recipeState.results.find((item) => item.id === id);

    if (button.dataset.action === "details") openDetails(id);
    if (button.dataset.action === "save" && recipe) {
      const nowSaved = toggleSaved(recipe);
      button.textContent = nowSaved ? "♥ Saved" : "♡ Save";
      button.setAttribute("aria-pressed", nowSaved);
    }
  });

  document.getElementById("saved-list").addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = button.closest(".saved-item").dataset.id;
    if (button.dataset.action === "details") openDetails(id);
    if (button.dataset.action === "unsave") {
      setSavedRecipes(getSavedRecipes().filter((item) => item.id !== id));
      if (recipeState.results.length) renderResults();
    }
  });

  document.getElementById("saved-clear").addEventListener("click", function () {
    setSavedRecipes([]);
    if (recipeState.results.length) renderResults();
  });
});
