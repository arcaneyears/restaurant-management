document.addEventListener("DOMContentLoaded", function () {
  var topButton = document.getElementById("back-to-top");
  var yearSlots = document.querySelectorAll(".current-year");

  yearSlots.forEach(function (slot) {
    slot.textContent = new Date().getFullYear();
  });

  if (topButton) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 320) {
        topButton.classList.add("visible");
      } else {
        topButton.classList.remove("visible");
      }
    });
  }

  document.querySelectorAll("form[data-feedback]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      var box = document.getElementById(form.dataset.feedback);

      if (box) {
        box.classList.remove("d-none");
        box.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      form.classList.remove("was-validated");
      form.reset();
    });
  });
});
