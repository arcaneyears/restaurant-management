const bookingBook = new BookingBook(appStore);

const bookingView = {
  filter: "all",
  search: "",
  sort: "soonest",
  editingId: null
};

function collectBookingData() {
  const form = document.getElementById("reservation-form");
  return {
    name: form.querySelector("#guest-name").value.trim(),
    phone: form.querySelector("#guest-phone").value.trim(),
    email: form.querySelector("#guest-email").value.trim(),
    date: form.querySelector("#booking-date").value,
    time: form.querySelector("#booking-time").value,
    guests: Number(form.querySelector("#booking-guests").value),
    hall: form.querySelector('input[name="hall"]:checked').value,
    extras: [...form.querySelectorAll('input[name="extras"]:checked')].map((box) => box.value),
    notes: form.querySelector("#booking-notes").value.trim()
  };
}

function saveBookingFromForm() {
  const data = collectBookingData();
  let booking;
  let mode;
  if (bookingView.editingId && bookingBook.find(bookingView.editingId)) {
    booking = bookingBook.update(bookingView.editingId, data);
    mode = "updated";
  } else {
    booking = bookingBook.add(data);
    mode = "created";
  }
  stopEditing();
  renderBookings();
  return { booking: booking, mode: mode };
}

function startEditing(id) {
  const booking = bookingBook.find(id);
  if (!booking) return;
  const form = document.getElementById("reservation-form");

  form.reset();
  form.querySelector("#guest-name").value = booking.name;
  form.querySelector("#guest-phone").value = booking.phone;
  form.querySelector("#guest-email").value = booking.email;
  form.querySelector("#booking-date").value = booking.date;
  form.querySelector("#booking-time").value = booking.time;
  form.querySelector("#booking-guests").value = booking.guests;
  form.querySelector('input[name="hall"][value="' + booking.hall + '"]').checked = true;
  form.querySelectorAll('input[name="extras"]').forEach((box) => (box.checked = booking.extras.includes(box.value)));
  form.querySelector("#booking-notes").value = booking.notes;

  bookingView.editingId = id;
  form.classList.add("is-editing");
  form.querySelector('button[type="submit"]').textContent = "Save changes";
  document.getElementById("edit-banner").hidden = false;
  document.getElementById("edit-banner-name").textContent = booking.name + ", " + booking.formatWhen();
  document.getElementById("booking-form").scrollIntoView({ behavior: "smooth" });
}

function stopEditing() {
  bookingView.editingId = null;
  const form = document.getElementById("reservation-form");
  form.classList.remove("is-editing");
  form.querySelector('button[type="submit"]').textContent = "Send request";
  document.getElementById("edit-banner").hidden = true;
}

function createBookingCard(booking) {
  const card = document.createElement("article");
  card.className = "booking-card" + (booking.isUpcoming() ? "" : " is-past");
  card.dataset.id = booking.id;

  const head = document.createElement("div");
  head.className = "booking-card-head";
  const name = document.createElement("h3");
  name.textContent = booking.name;
  const badge = document.createElement("span");
  badge.className = "booking-badge";
  badge.textContent = booking.isUpcoming() ? "Upcoming" : "Past";
  head.append(name, badge);

  const when = document.createElement("p");
  when.className = "booking-when";
  when.textContent = booking.formatWhen();

  const details = document.createElement("p");
  details.className = "booking-details";
  details.textContent = booking.guests + (booking.guests === 1 ? " guest" : " guests") + " · " + booking.hallName() + " · " + booking.phone;

  card.append(head, when, details);

  if (booking.extras.length || booking.notes) {
    const extra = document.createElement("p");
    extra.className = "booking-notes";
    extra.textContent = [booking.extras.join(", "), booking.notes].filter(Boolean).join(" — ");
    card.appendChild(extra);
  }

  const actions = document.createElement("div");
  actions.className = "booking-actions";
  actions.innerHTML = `
    <button type="button" class="btn btn-outline-ink btn-sm" data-action="edit">Edit</button>
    <button type="button" class="btn btn-outline-danger btn-sm" data-action="delete">Cancel booking</button>`;
  card.appendChild(actions);
  return card;
}

function renderBookings() {
  const list = bookingBook.list(bookingView.filter, bookingView.search, bookingView.sort);
  const holder = document.getElementById("booking-list");
  holder.innerHTML = "";
  list.forEach((booking) => holder.appendChild(createBookingCard(booking)));

  const empty = document.getElementById("booking-empty");
  empty.hidden = list.length > 0;
  empty.textContent = bookingBook.bookings.length === 0
    ? "You have no saved bookings yet. Send the form above and your booking will appear here."
    : "No bookings match this filter.";
  document.getElementById("booking-clear").disabled = bookingBook.bookings.length === 0;

  renderStats();
}

function renderStats() {
  const stats = bookingBook.getStats();
  document.getElementById("stat-total").textContent = stats.total;
  document.getElementById("stat-upcoming").textContent = stats.upcoming;
  document.getElementById("stat-guests").textContent = stats.guests;
  document.getElementById("stat-average").textContent = stats.average;
  document.getElementById("stat-next").textContent = stats.next ? stats.next.formatWhen() : "—";
  drawSlotChart(stats.guestsBySlot);
}

function drawSlotChart(guestsBySlot) {
  const canvas = document.getElementById("slot-chart");
  const slots = [...document.querySelectorAll("#booking-time option")].map((o) => o.value).filter(Boolean);
  const values = slots.map((slot) => guestsBySlot[slot] || 0);
  const max = Math.max(4, ...values);

  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);

  const styles = getComputedStyle(document.documentElement);
  const barColor = styles.getPropertyValue("--saffron").trim() || "#c8761c";
  const textColor = styles.getPropertyValue("--ink").trim() || "#1b1917";
  const pad = { top: 18, bottom: 28, left: 8, right: 8 };
  const chartHeight = height - pad.top - pad.bottom;
  const slotWidth = (width - pad.left - pad.right) / slots.length;
  const barWidth = Math.min(46, slotWidth * 0.6);

  ctx.font = "12px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.moveTo(pad.left, height - pad.bottom + 0.5);
  ctx.lineTo(width - pad.right, height - pad.bottom + 0.5);
  ctx.stroke();

  values.forEach((value, index) => {
    const x = pad.left + slotWidth * index + (slotWidth - barWidth) / 2;
    const barHeight = (value / max) * chartHeight;
    const y = height - pad.bottom - barHeight;
    ctx.fillStyle = barColor;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = textColor;
    if (value > 0) ctx.fillText(value, x + barWidth / 2, y - 5);
    ctx.fillText(slots[index], x + barWidth / 2, height - 10);
  });

  canvas.setAttribute("aria-label", "Guests per time slot: " + slots.map((s, i) => s + " " + values[i]).join(", "));
}

document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("booking-list")) return;
  renderBookings();

  document.getElementById("booking-filter").addEventListener("change", function () {
    bookingView.filter = this.value;
    renderBookings();
  });
  document.getElementById("booking-sort").addEventListener("change", function () {
    bookingView.sort = this.value;
    renderBookings();
  });
  document.getElementById("booking-search").addEventListener("input", function () {
    bookingView.search = this.value;
    renderBookings();
  });

  document.getElementById("booking-list").addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const card = button.closest(".booking-card");
    const id = card.dataset.id;

    if (button.dataset.action === "edit") startEditing(id);
    if (button.dataset.action === "delete") {
      if (button.dataset.confirm !== "yes") {
        button.dataset.confirm = "yes";
        button.textContent = "Press again to cancel";
        setTimeout(() => {
          button.dataset.confirm = "";
          button.textContent = "Cancel booking";
        }, 3000);
        return;
      }
      if (bookingView.editingId === id) {
        document.getElementById("reservation-form").reset();
      }
      $(card).fadeOut(250, function () {
        bookingBook.remove(id);
        renderBookings();
      });
    }
  });

  document.getElementById("booking-clear").addEventListener("click", function () {
    if (this.dataset.confirm !== "yes") {
      this.dataset.confirm = "yes";
      this.textContent = "Press again to delete all";
      setTimeout(() => {
        this.dataset.confirm = "";
        this.textContent = "Delete all bookings";
      }, 3000);
      return;
    }
    this.dataset.confirm = "";
    this.textContent = "Delete all bookings";
    bookingBook.clear();
    document.getElementById("reservation-form").reset();
    renderBookings();
  });

  document.getElementById("edit-cancel").addEventListener("click", function () {
    document.getElementById("reservation-form").reset();
  });

  window.addEventListener("resize", () => drawSlotChart(bookingBook.getStats().guestsBySlot));
});
