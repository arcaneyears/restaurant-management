/* =========================================================
   Saffron Table — booking form validation (reservation.html)
   Plain JavaScript, no reliance on browser default messages.
   ========================================================= */

const PHONE_PATTERN = /^\+?[0-9\s\-()]{10,18}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Shows or clears the message under one field. Returns true when valid.
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

// Returns today's date as YYYY-MM-DD in local time
function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

// Each rule returns an error message, or "" when the value is fine
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

  form.setAttribute("novalidate", ""); // our own messages replace the browser bubbles
  document.getElementById("booking-date").setAttribute("min", todayString());

  const fields = Object.keys(bookingRules).map((id) => document.getElementById(id));
  const terms = document.getElementById("booking-terms");
  const success = document.getElementById("booking-success");

  // Re-check a field as the user types or changes it
  fields.forEach(function (field) {
    const eventName = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventName, () => validateField(field));
    field.addEventListener("blur", () => validateField(field));
  });
  terms.addEventListener("change", () => validateTerms(terms));

  // Changing the hall affects the guest limit
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

    const name = document.getElementById("guest-name").value.trim();
    const date = document.getElementById("booking-date").value;
    const time = document.getElementById("booking-time").value;
    const guests = document.getElementById("booking-guests").value;

    success.innerHTML =
      "<strong>Thank you, " + name + "!</strong> Your table for " + guests +
      " on " + date + " at " + time + " is requested. We will call you within 30 minutes to confirm.";
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });

    form.reset();
    form.querySelectorAll(".is-valid").forEach((el) => el.classList.remove("is-valid"));
  });

  // Clearing the form also clears every message
  form.addEventListener("reset", function () {
    form.querySelectorAll(".is-invalid, .is-valid").forEach((el) => el.classList.remove("is-invalid", "is-valid"));
  });
});
