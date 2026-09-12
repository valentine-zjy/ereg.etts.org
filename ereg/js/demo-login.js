/* Static sign-in routing for the publicly hosted score report. */
(function () {
  "use strict";

  var reportPath = "/ereg/home.html";

  function setupStaticLogin() {
    var form = document.querySelector('form[data-form-primary="true"]');
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var submitButton = document.querySelector("[data-action-button-primary=true]");

    if (!form || !username || !submitButton) return;

    form.noValidate = true;
    form.action = "";
    username.type = "text";
    username.required = false;
    username.removeAttribute("pattern");
    username.setAttribute("aria-required", "false");

    if (password) {
      password.required = false;
      password.disabled = false;
      password.setAttribute("aria-required", "false");
    }

    var signUp = document.querySelector(".ulp-alternate-action");
    if (signUp) signUp.classList.add("static-login-hidden");

    function updateButton() {
      submitButton.disabled = false;
      submitButton.classList.toggle("demo-empty", !username.value.trim());
      submitButton.style.setProperty("background-color", username.value.trim() ? "#103D4B" : "#d1dee1", "important");
      submitButton.style.setProperty("color", username.value.trim() ? "#fff" : "#60747b", "important");
    }

    function updateButtonAfterOtherHandlers() {
      window.setTimeout(updateButton, 0);
    }

    username.addEventListener("input", updateButtonAfterOtherHandlers);
    username.addEventListener("change", updateButtonAfterOtherHandlers);
    if (password) {
      password.addEventListener("input", updateButtonAfterOtherHandlers);
      password.addEventListener("change", updateButtonAfterOtherHandlers);
    }
    updateButton();
    new MutationObserver(function () {
      if (submitButton.disabled) submitButton.disabled = false;
    }).observe(submitButton, { attributes: true, attributeFilter: ["disabled"] });

    // The provider snapshot focuses the first field after its initial paint.
    // Keep the public entry state aligned with the untouched sign-in screen.
    window.setTimeout(function () {
      if (document.activeElement === username) username.blur();
    }, 350);

    function continueToReport(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      submitButton.disabled = true;
      window.location.assign(reportPath);
    }

    // Capture from the document so the saved provider scripts cannot submit
    // the static snapshot to a remote authentication endpoint.
    document.addEventListener("click", function (event) {
      if (event.target === submitButton || submitButton.contains(event.target)) {
        continueToReport(event);
      }
    }, true);
    document.addEventListener("submit", function (event) {
      if (event.target === form) continueToReport(event);
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupStaticLogin);
  } else {
    setupStaticLogin();
  }
}());
