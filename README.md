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
| Reservation | `reservation.html` | Full booking form with validation, availability table, booking policy                           |
| Contact     | `contact.html`     | Contact cards, feedback form, embedded map, FAQ accordion                                       |

All six pages share the same top bar, sticky navigation and footer.

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
├── reservation.html
├── contact.html
├── README.md
├── css/
│   └── style.css
├── images/
│   └── 12 photographs
└── vendor/
    └── bootstrap/
        ├── css/bootstrap.min.css
        └── js/bootstrap.bundle.min.js
```

Bootstrap 5.3.3 is bundled locally in `vendor/`, so the site works without a CDN.

The project contains no JavaScript of its own. The only script on the pages is the Bootstrap
bundle, which its collapsible mobile navbar and the FAQ accordion depend on. Everything else,
including form validation and the error messages, is plain HTML and CSS.

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
