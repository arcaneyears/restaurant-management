/* =========================================================
   Saffron Table — shared project data
   Arrays used by menu.js and gallery.js to build the pages.
   ========================================================= */

// Array 1: menu categories (used to build the filter buttons)
const menuCategories = [
  { id: "all", label: "All dishes" },
  { id: "starters", label: "Starters" },
  { id: "mains", label: "Main courses" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" }
];

// Array 2: every dish on the seasonal card (project data)
const menuItems = [
  { id: 1, name: "Charred aubergine dip", category: "starters", price: 2400, tag: "", desc: "Smoked aubergine, walnut, pomegranate, warm flatbread" },
  { id: 2, name: "Steppe beef tartare", category: "starters", price: 3900, tag: "", desc: "Hand-cut beef, cured yolk, mustard seeds, rye crisp" },
  { id: 3, name: "Market greens", category: "starters", price: 2100, tag: "Vegan", desc: "Seasonal leaves, toasted seeds, herb tahini" },
  { id: 4, name: "Hot lamb broth", category: "starters", price: 2600, tag: "", desc: "Slow lamb stock, barley, root vegetables, dill oil" },
  { id: 5, name: "Saffron lamb rack", category: "mains", price: 6200, tag: "Signature", desc: "Charcoal rack, saffron jus, smoked aubergine, apricot" },
  { id: 6, name: "Grilled river trout", category: "mains", price: 5400, tag: "", desc: "Whole trout, brown butter, capers, new potatoes" },
  { id: 7, name: "Garden harvest bowl", category: "mains", price: 3400, tag: "Vegan", desc: "Charred corn, roast squash, freekeh, herb dressing" },
  { id: 8, name: "Hand-rolled beshbarmak", category: "mains", price: 4800, tag: "", desc: "Wide noodles, braised beef, onion broth, black pepper" },
  { id: 9, name: "Clay-oven chicken", category: "mains", price: 4300, tag: "", desc: "Half chicken, sumac onions, burnt lemon, flatbread" },
  { id: 10, name: "Honey saffron tart", category: "desserts", price: 2900, tag: "", desc: "Steppe honey custard, saffron crumb, sour cream ice" },
  { id: 11, name: "Apricot kissel", category: "desserts", price: 2200, tag: "", desc: "Dried apricot, toasted oats, cold cream" },
  { id: 12, name: "Dark chocolate pot", category: "desserts", price: 2500, tag: "", desc: "Bitter chocolate, sea salt, olive oil, rye crumb" },
  { id: 13, name: "Filter coffee", category: "drinks", price: 1300, tag: "", desc: "Single origin, roasted in Almaty, changes monthly" },
  { id: 14, name: "Mountain herb tea", category: "drinks", price: 1600, tag: "", desc: "Thyme, mint and rosehip, served by the pot" },
  { id: 15, name: "Saffron lemonade", category: "drinks", price: 1800, tag: "House", desc: "Saffron syrup, lemon, soda, cold press apple" },
  { id: 16, name: "Wine by the glass", category: "drinks", price: 2700, tag: "", desc: "Two reds, two whites, rotated every season" }
];

// Array 3: gallery photos (size controls the mosaic span)
const galleryPhotos = [
  { src: "images/hero.jpg", alt: "Guests dining at a long table in the main hall", caption: "Friday service in the main hall", group: "hall", size: "wide tall" },
  { src: "images/interior.jpg", alt: "Wooden tables set with linen and glassware", caption: "Tables set before opening", group: "hall", size: "" },
  { src: "images/kitchen.jpg", alt: "Cooks working at the open kitchen counter", caption: "The open kitchen counter", group: "team", size: "" },
  { src: "images/dish-1.jpg", alt: "Grilled lamb rack plated with vegetables", caption: "Saffron lamb rack, ready to leave the pass", group: "food", size: "wide" },
  { src: "images/dish-2.jpg", alt: "Seasonal salad bowl with fresh herbs", caption: "Garden harvest bowl, built to order", group: "food", size: "tall" },
  { src: "images/dessert.jpg", alt: "Dessert plate with berries and cream", caption: "Honey saffron tart", group: "food", size: "" },
  { src: "images/cafe.jpg", alt: "Private dining corner prepared for an event", caption: "Private corner for small events", group: "hall", size: "" },
  { src: "images/coffee.jpg", alt: "Coffee being poured at the bar", caption: "Morning filter at the bar station", group: "food", size: "wide" },
  { src: "images/chef.jpg", alt: "Head chef checking a dish before service", caption: "The 16:30 tasting, every single day", group: "team", size: "tall" },
  { src: "images/team.jpg", alt: "Staff briefing before the evening shift", caption: "Pre-shift briefing at 15:00", group: "team", size: "" },
  { src: "images/dish-3.jpg", alt: "Flatbread baked in the clay oven", caption: "Flatbread straight from the clay oven", group: "food", size: "" },
  { src: "images/dish-4.jpg", alt: "Shared plates arranged on a table", caption: "Family feast package, served to share", group: "food", size: "wide" }
];

/* Reusable helper: formats a number as tenge, e.g. 6200 -> "6 200 ₸".
   Returns a value, so it can be used anywhere a price is printed. */
function formatPrice(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
}
