# Saffron Table — Restaurant & Management Hub

A static multi-page website for a fictional restaurant in Almaty that also presents its
management side: catering packages, a published weekly shift schedule and live hall capacity.
Built with semantic HTML5, custom CSS and Bootstrap 5.

**Live site:** https://arcaneyears.github.io/restaurant-management/

## Topic

Restaurant management. The site works on two levels at once:

- as a guest-facing restaurant site — menu, gallery, reservations, contact;
- as a window into how the restaurant is run — department structure, shift planning,
  supplier and capacity data, catering package comparison.

## Pages

| Page        | File               | What it contains                                                                                |
| ----------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| Home        | `index.html`       | Hero section, three departments, story teaser, statistics, signature dishes, guest testimonials |
| About       | `about.html`       | History timeline, values, management team, weekly shift schedule table                          |
| Menu        | `menu.html`        | Starters, mains, desserts, drinks, catering package comparison table                            |
| Gallery     | `gallery.html`     | Twelve-frame CSS Grid mosaic with hover captions                                                |
| Recipes     | `recipes.html`     | Live recipe search from TheMealDB, categories, pagination, details modal, saved recipes (final)  |
| Reservation | `reservation.html` | Full booking form with validation, My bookings (CRUD), statistics and chart, availability table  |
| Contact     | `contact.html`     | Contact cards, feedback form, embedded map, FAQ accordion                                       |

All seven pages share the same top bar, sticky navigation and footer.

## Features

- Sticky Bootstrap navbar with a collapsible mobile menu and an active-page indicator
- Semantic structure throughout: `header`, `nav`, `main`, `section`, `article`, `aside`,
  `figure`, `figcaption`, `address`, `time`, `dl`, `footer`
- Three data tables with `caption`, `thead`, `tbody`, `tfoot` and scoped headers
- Two forms with fieldsets, legends, labels, selects, radios, checkboxes and textareas,
  validated with our own JavaScript (endterm), see below
- CSS Grid for the gallery mosaic, the feature cards, the footer and the hours lists
- Flexbox for the top bar, navigation, split sections, statistics and info cards
- Positioning: `fixed` back-to-top button, `sticky` navbar, `absolute` overlays, price badges
  and image tags over `relative` parents
- Hover transitions on cards, images, links and navigation underlines
- Media queries at 991px (tablet) and 575px (mobile) on top of the Bootstrap grid
- Bootstrap utilities for spacing, text alignment, flex helpers and buttons, plus the
  collapse and accordion components



## Final project — client-side web application

The final stage keeps every midterm and endterm feature and turns the site into a small
client-side application. New scripts: `js/storage.js`, `js/api.js`, `js/models.js`,
`js/weather.js`, `js/recipes.js`, `js/bookings.js`; new page: `recipes.html`.

- **Live site:** https://arcaneyears.github.io/restaurant-management/
- **Repository:** https://github.com/arcaneyears/restaurant-management

### New features

| # | Feature | Where | Requirement covered |
| - | ------- | ----- | ------------------- |
| 1 | **Recipe ideas** — search by name, category filter, A–Z / Z–A sort, pagination (8 per page), details modal with ingredients and steps, saved recipes | `recipes.html`, `js/recipes.js` | API, localStorage, advanced search/sort/pagination, modal |
| 2 | **Terrace today** — live weather for Almaty with advice for guests and a 3-day forecast, cached for 15 minutes | `index.html`, `js/weather.js` | API, localStorage |
| 3 | **My bookings** — every booking request is saved; edit it in the form, cancel it, delete all, search, filter (upcoming / past) and sort | `reservation.html`, `js/bookings.js`, `js/reservation.js` | CRUD, OOP, localStorage |
| 4 | **Booking statistics** — totals, average party size, next visit and a bar chart of guests per time slot drawn with the Canvas API | `reservation.html`, `js/bookings.js` | Chart / statistics panel |
| 5 | **Saved order** — "My order" on the menu page is an `Order` object, survives a reload, with + / − quantity buttons | `menu.html`, `js/menu.js` | OOP, localStorage |
| 6 | **Text size controls** (A− / A / A+) on every page, saved together with the dark theme | top bar, `js/main.js` | Accessibility preference saved |

### APIs used (both free, no API key, nothing secret in the code)

| API | Endpoints | Used for |
| --- | --------- | -------- |
| [TheMealDB](https://www.themealdb.com/api.php) | `search.php?s=`, `filter.php?c=`, `lookup.php?i=`, `categories.php` | Recipe search, categories, recipe details |
| [Open-Meteo](https://open-meteo.com/) | `forecast?latitude=&longitude=&current=&daily=` | Current weather and 3-day forecast for Almaty |

All requests go through `ApiClient.getJSON()` (`js/api.js`): `fetch` with `async/await`, an 8-second
timeout (`AbortController`), an offline check and readable error messages. Every API view has
**loading**, **success**, **empty** and **error (with Retry)** states.

### Object-oriented JavaScript

| Class | File | Responsibility |
| ----- | ---- | -------------- |
| `StorageService` | `js/storage.js` | Safe JSON read/write in localStorage; invalid or missing data falls back to a default |
| `ApiClient`, `ApiError` | `js/api.js` | Shared fetch logic and error type |
| `MealApi`, `WeatherApi` (extend `ApiClient`) | `js/api.js` | One method per endpoint, return ready objects |
| `Recipe` | `js/models.js` | Turns raw API JSON into an object with `ingredients`, `getSteps()`, `toSaved()` |
| `Order` | `js/models.js` | Menu order: `add`, `decrease`, `remove`, `clear`, `count`, `total`, saved automatically |
| `Booking`, `BookingBook` | `js/models.js` | One booking / the list of bookings: `add`, `find`, `update`, `remove`, `clear`, `list`, `getStats` |

### What is stored in localStorage (keys start with `saffron:`)

| Key | Value (JSON) | Update / clear |
| --- | ------------ | -------------- |
| `saffron:bookings` | array of booking objects | Edit, Cancel booking, Delete all bookings |
| `saffron:order` | array of `{ id, qty }` | + / −, ×, Clear order |
| `saffron:favourites` | array of dish ids | ♡ button on the menu |
| `saffron:saved-recipes` | array of `{ id, name, photo, category }` | Save / × / Clear saved |
| `saffron:font-step` | 0, 1 or 2 | A− / A / A+ |
| `saffron:weather` | `{ savedAt, data }` | Refresh button, expires after 15 min |
| `saffron-theme` | `"light"` / `"dark"` | ☾ Dark button (endterm) |

Broken JSON or a value of the wrong shape is removed and replaced by a safe default, so the page
never crashes on bad stored data.

### How to run and test

1. Open the live site, or clone the repository and open `index.html` (or run `python -m http.server`
   in the folder and open `http://localhost:8000`). No build step and no installation needed.
2. **Home:** the "Terrace today" box loads live weather. Turn off Wi-Fi and press Refresh to see the error state.
3. **Recipes:** the page opens with the "Lamb" category. Change the category, search "chicken", search
   "zzz" (empty state), type one letter (validation), switch pages, open a recipe, save two recipes and reload.
4. **Menu:** add dishes, reload — the order is still there; use + / − / ×.
5. **Reservation:** send two bookings, then Edit one (the form fills in, the button says "Save changes"),
   Cancel booking (press twice), filter and search the list; watch the statistics and the chart change.
6. **Any page:** A− / A / A+ and ☾ Dark, then reload.

### Who did what (final stage)

| Member | Final-stage part |
| ------ | ---------------- |
| Yersaiyn Taubay (arcaneyears) | `StorageService`, `ApiClient` / `MealApi` / `WeatherApi`, weather widget, text-size controls, README |
| Nursultan Duisenbekuly (nursultan-duisenbek) | `Recipe` and `Order` classes, Recipes page (search, filter, sort, pagination, modal, saved recipes), saved menu order |
| Ramazan Sagyngali (Ramazan-SE-2524) | `Booking` and `BookingBook` classes, My bookings CRUD, statistics panel and canvas chart, form integration, styles |

## Endterm — JavaScript & jQuery features

The midterm site is kept as it was (same six pages, navigation, Bootstrap layout) and extended
with interactive features. All scripts live in `js/`, jQuery 3.7.1 is bundled in `vendor/jquery/`.

| File                | Page(s)          | What it does                                                                                       |
| ------------------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| `js/data.js`        | menu, gallery    | Arrays `menuCategories`, `menuItems`, `galleryPhotos` and the `formatPrice()` helper (returns a value) |
| `js/main.js`        | all pages        | Dark / light theme switcher (saved in localStorage), "Open now / Closed" badge, smart back-to-top     |
| `js/menu.js`        | `menu.html`      | Menu cards built from the array, category filter, live search, price sort, favourites, "My order" with total |
| `js/gallery.js`     | `gallery.html`   | jQuery: mosaic built from the array, filter with fadeIn/fadeOut, lightbox with arrows and keyboard |
| `js/reservation.js` | `reservation.html` | Vanilla JS booking-form validation with messages under every field and a success message        |
| `js/contact.js`     | `contact.html`   | jQuery feedback-form validation, live character counter, FAQ search with slideUp/slideDown        |

### Requirement checklist

- **Arrays:** `menuItems`, `menuCategories`, `galleryPhotos`, the order array `menuState.order`, favourites array
- **Loops:** `for...of` (render dishes, validate fields), `forEach` (category buttons, order list), classic `for` (`calculateTotal`), `$.each` (gallery)
- **Functions with parameters / return values:** `formatPrice(amount)`, `getVisibleDishes(items, state)`, `calculateTotal(order)`, `isOpenAt(hour)`, `setFieldState(field, message)`, `createDishCard(dish, isFavourite)`
- **DOM manipulation:** cards, order lines, gallery figures, theme button, status badge and success messages are created with `createElement` / jQuery; order lines are added and removed; classes, text, attributes and visibility change on user actions
- **Events (addEventListener):** `DOMContentLoaded`, `click`, `input`, `change`, `submit`, `keydown`, `blur`, `scroll`, `reset`; `event.preventDefault()` on both forms and on the back-to-top link
- **Form validation:** required fields, name length, no digits in the name, phone and email format, date not in the past, time slot selected, guests 1–24 (max 6 at the kitchen counter), policy checkbox; contact form checks name, email, department, optional phone and message length 10–500
- **jQuery:** selectors by ID (`#gallery-grid`), class (`.gallery-filter`), attribute (`button[data-filter]`), descendant (`#faqList .accordion-item`); traversal with `siblings()`, `children()`, `find()`, `parent()`; events `click`, `keydown`, `input`, `submit`, `blur`, `change`; effects `fadeIn`/`fadeOut`, `slideUp`/`slideDown`

### How to test

1. **Any page:** press the ☾ Dark button in the navbar — reload and the theme is remembered. Scroll down to see the back-to-top button appear. The top bar shows whether the restaurant is open right now.
2. **Menu:** type "lamb" in the search, press Esc to clear it, choose a category, sort by price, press ♡ on a dish, press "Add to order" a few times and remove lines with ×.
3. **Gallery:** choose "Our team", click a photo, browse with ← / → or the buttons, close with Esc or by clicking the dark background.
4. **Reservation:** press "Send request" on the empty form to see every message, pick "Kitchen counter" with 8 guests to see the seat limit, then fill the form correctly to see the confirmation.
5. **Contact:** submit the empty form, type a short message and watch the counter, then send a valid message. Type "allergies" in the FAQ search.

### Who did what

| Member                  | GitHub              | Endterm part                                                                    |
| ----------------------- | ------------------- | ------------------------------------------------------------------------------- |
| Yersaiyn Taubay         | arcaneyears         | jQuery setup, shared `main.js` (theme switcher, open status, back-to-top), README |
| Nursultan Duisenbekuly  | nursultan-duisenbek | Menu data and `menu.js` (filter, search, sort, favourites, order), contact form in jQuery |
| Ramazan Sagyngali       | Ramazan-SE-2524     | Gallery with jQuery lightbox, reservation form validation, feature styles       |

## Structure

```
restaurant-management/
├── index.html
├── about.html
├── menu.html
├── gallery.html
├── recipes.html          (final)
├── reservation.html
├── contact.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── storage.js        (final) StorageService
│   ├── api.js            (final) ApiClient, MealApi, WeatherApi
│   ├── models.js         (final) Recipe, Order, Booking, BookingBook
│   ├── weather.js        (final) home weather widget
│   ├── recipes.js        (final) recipes page
│   ├── bookings.js       (final) My bookings + statistics
│   ├── data.js           menu and gallery arrays
│   ├── main.js           theme, text size, open status, back-to-top
│   ├── menu.js           interactive menu and saved order
│   ├── gallery.js        jQuery gallery and lightbox
│   ├── reservation.js    booking form validation
│   └── contact.js        jQuery contact form and FAQ search
├── images/
│   └── 12 photographs
└── vendor/
    ├── jquery/jquery-3.7.1.min.js
    └── bootstrap/
        ├── css/bootstrap.min.css
        └── js/bootstrap.bundle.min.js
```

Bootstrap 5.3.3 is bundled locally in `vendor/`, so the site works without a CDN.

The midterm version had no JavaScript of its own; JavaScript and jQuery were added at the endterm stage and extended in the final stage (see the sections above).

## Design

| Role    | Value     |
| ------- | --------- |
| Ink     | `#1b1917` |
| Cream   | `#faf5ed` |
| Sand    | `#f1e7d7` |
| Saffron | `#c0701a` |
| Sage    | `#4a6151` |

Headings use Playfair Display, body text uses Inter, both with system fallbacks.

## Running locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Team

| Member                 | GitHub                | Responsibility                                                         |
| ---------------------- | --------------------- | ---------------------------------------------------------------------- |
| Yersaiyn Taubay        | `arcaneyears`         | Project setup, Bootstrap bundle, base CSS theme, home page, README     |
| Nursultan Duisenbekuly | `nursultan-duisenbek` | Image assets, component styles, about, menu and contact pages          |
| Ramazan Sagyngali      | `Ramazan-SE-2524`     | Form and footer styles, gallery and reservation pages, responsive pass |
