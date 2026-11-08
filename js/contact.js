/* =========================================================
   Saffron Table — contact page (contact.html), jQuery
   - feedback form validation with field-specific messages
   - live character counter for the message box
   - FAQ quick search that slides answers up / down
   ========================================================= */

$(function () {
  const $form = $("#contact-form");
  if (!$form.length) return;

  $form.attr("novalidate", "novalidate");
  const MIN_MESSAGE = 10;
  const MAX_MESSAGE = 500;

  // Shows a message under a field; uses traversal to find its feedback box
  function markField($field, message) {
    let $feedback = $field.parent().children(".invalid-feedback");
    if (!$feedback.length) {
      // the optional phone field has no message box yet, so create one
      $feedback = $("<div>", { class: "invalid-feedback" }).insertAfter($field);
    }
    if (message) {
      $field.addClass("is-invalid").removeClass("is-valid");
      $feedback.text(message);
      return false;
    }
    $field.removeClass("is-invalid").addClass("is-valid");
    return true;
  }

  function checkName() {
    const value = $.trim($("#contact-name").val());
    if (!value) return markField($("#contact-name"), "Please tell us your name.");
    if (value.length < 2) return markField($("#contact-name"), "The name must be at least 2 characters.");
    return markField($("#contact-name"), "");
  }

  function checkEmail() {
    const value = $.trim($("#contact-email").val());
    if (!value) return markField($("#contact-email"), "A valid email lets us answer you.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return markField($("#contact-email"), "Enter an email like name@example.com.");
    return markField($("#contact-email"), "");
  }

  function checkTopic() {
    return markField($("#contact-topic"), $("#contact-topic").val() ? "" : "Select the department you need.");
  }

  function checkPhone() {
    const value = $.trim($("#contact-phone").val());
    if (value && !/^\+?[0-9\s\-()]{10,18}$/.test(value)) return markField($("#contact-phone"), "Use a format like +7 701 000 00 00.");
    return markField($("#contact-phone"), "");
  }

  function checkMessage() {
    const length = $.trim($("#contact-message").val()).length;
    if (length < MIN_MESSAGE) return markField($("#contact-message"), "Please write at least " + MIN_MESSAGE + " characters.");
    if (length > MAX_MESSAGE) return markField($("#contact-message"), "Please keep it under " + MAX_MESSAGE + " characters.");
    return markField($("#contact-message"), "");
  }

  // Live counter under the textarea
  const $counter = $("<small>", { class: "char-counter", id: "message-counter" });
  $("#contact-message").after($counter);

  function updateCounter() {
    const length = $("#contact-message").val().length;
    $counter.text(length + " / " + MAX_MESSAGE + " characters");
    $counter.toggleClass("text-danger", length > MAX_MESSAGE);
  }
  updateCounter();

  $("#contact-message").on("input", function () {
    updateCounter();
    if ($(this).hasClass("is-invalid")) checkMessage();
  });

  // Validate each field when it loses focus
  $("#contact-name").on("blur", checkName);
  $("#contact-email").on("blur", checkEmail);
  $("#contact-phone").on("blur", checkPhone);
  $("#contact-topic").on("change", checkTopic);

  $form.on("submit", function (event) {
    event.preventDefault();
    const results = [checkName(), checkEmail(), checkTopic(), checkPhone(), checkMessage()];
    const valid = results.every(Boolean);

    if (!valid) {
      $("#contact-success").slideUp(200);
      $form.find(".is-invalid").first().trigger("focus");
      return;
    }

    const name = $.trim($("#contact-name").val());
    $("#contact-success")
      .html("<strong>Message sent!</strong> Thank you, " + $("<span>").text(name).html() + " — we usually reply within one working day.")
      .hide()
      .slideDown(300);

    this.reset();
    $form.find(".is-valid").removeClass("is-valid");
    updateCounter();
  });

  $form.on("reset", function () {
    $(this).find(".is-invalid, .is-valid").removeClass("is-invalid is-valid");
    $("#contact-success").slideUp(200);
    setTimeout(updateCounter, 0);
  });

  // FAQ quick search: hides questions that do not match
  $("#faq-search").on("input", function () {
    const query = $(this).val().toLowerCase();
    let shown = 0;

    $("#faqList .accordion-item").each(function () {
      const text = $(this).text().toLowerCase();
      if (text.indexOf(query) !== -1) {
        $(this).slideDown(200);
        shown++;
      } else {
        $(this).slideUp(200);
      }
    });

    $("#faq-empty").toggle(shown === 0);
  });
});
