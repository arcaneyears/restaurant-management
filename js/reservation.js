const PHONE_PATTERN = /^\+?[0-9\s\-()]{10,18}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setFieldState(field, message) {
  const wrapper = field.parentElement;
  let feedback = wrapper.querySelector(".invalid-feedback");

  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "invalid-feedback";
    wrapper.appendChild(feedback);
  }

  if (message) {
    field.classList.add("is-invalid");
    field.classList.remove("is-valid");
    feedback.textContent = message;
    return false;
  }
  field.classList.remove("is-invalid");
  field.classList.add("is-valid");
  return true;
}

function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

const bookingRules = {
  "guest-name": function (value) {
    if (value.trim() === "") return "Please enter the name for the booking.";
    if (value.trim().length < 2) return "The name must be at least 2 characters long.";
    if (/\d/.test(value)) return "The name should not contain digits.";
    return "";
  },
  "guest-phone": function (value) {
    if (value.trim() === "") return "We need a phone number to confirm.";
    if (!PHONE_PATTERN.test(value.trim())) return "Use a format like +7 701 000 00 00.";
    return "";
  },
  "guest-email": function (value) {
    if (value.trim() !== "" && !EMAIL_PATTERN.test(value.trim())) return "This email address does not look right.";
    return "";
  },
  "booking-date": function (value) {
    if (value === "") return "Choose a date for your visit.";
    if (value < todayString()) return "The date cannot be in the past.";
    return "";
  },
  "booking-time": function (value) {
    return value === "" ? "Pick one of the available slots." : "";
  },
  "booking-guests": function (value) {
    const guests = Number(value);
    if (value === "" || !Number.isInteger(guests)) return "Enter a whole number of guests.";
    if (guests < 1 || guests > 24) return "Enter a number between 1 and 24.";
    const hall = document.querySelector('input[name="hall"]:checked');
    if (hall && hall.value === "counter" && guests > 6) return "The kitchen counter seats up to 6 guests.";
    return "";
  }
};

function validateField(field) {
  const rule = bookingRules[field.id];
  if (!rule) return true;
  return setFieldState(field, rule(field.value));
}

function validateTerms(checkbox) {
  return setFieldState(checkbox, checkbox.checked ? "" : "Please accept the policy to continue.");
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reservation-form");
  if (!form) return;

  form.setAttribute("novalidate", "");
  document.getElementById("booking-date").setAttribute("min", todayString());

  const fields = Object.keys(bookingRules).map((id) => document.getElementById(id));
  const terms = document.getElementById("booking-terms");
  const success = document.getElementById("booking-success");

  fields.forEach(function (field) {
    const eventName = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventName, () => validateField(field));
    field.addEventListener("blur", () => validateField(field));
  });
  terms.addEventListener("change", () => validateTerms(terms));

  document.querySelectorAll('input[name="hall"]').forEach(function (radio) {
    radio.addEventListener("change", () => validateField(document.getElementById("booking-guests")));
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    let allValid = true;
    for (const field of fields) {
      if (!validateField(field)) allValid = false;
    }
    if (!validateTerms(terms)) allValid = false;

    if (!allValid) {
      success.hidden = true;
      form.querySelector(".is-invalid").focus();
      return;
    }

    const result = saveBookingFromForm();
    const booking = result.booking;

    success.textContent = "";
    const strong = document.createElement("strong");
    strong.textContent = result.mode === "updated" ? "Booking updated. " : "Thank you, " + booking.name + "! ";
    success.append(
      strong,
      "Table for " + booking.guests + " on " + booking.formatWhen() +
        (result.mode === "updated" ? " is saved." : " is requested. We will call you within 30 minutes to confirm.") +
        " You can see it under \u201CMy bookings\u201D below."
    );
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });

    form.reset();
    form.querySelectorAll(".is-valid").forEach((el) => el.classList.remove("is-valid"));
  });

  form.addEventListener("reset", function () {
    if (typeof stopEditing === "function") stopEditing();
    form.querySelectorAll(".is-invalid, .is-valid").forEach((el) => el.classList.remove("is-invalid", "is-valid"));
  });
});
