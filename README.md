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
  validated entirely by the browser through `required`, `type` and `minlength`
- Inline error messages driven by the CSS `:user-invalid` pseudo-class, so the forms report
  problems without a single line of our own JavaScript
- CSS Grid for the gallery mosaic, the feature cards, the footer and the hours lists
- Flexbox for the top bar, navigation, split sections, statistics and info cards
- Positioning: `fixed` back-to-top button, `sticky` navbar, `absolute` overlays, price badges
  and image tags over `relative` parents
- Hover transitions on cards, images, links and navigation underlines
- Media queries at 991px (tablet) and 575px (mobile) on top of the Bootstrap grid
- Bootstrap utilities for spacing, text alignment, flex helpers and buttons, plus the
  collapse and accordion components

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
