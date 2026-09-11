/* Static sign-in routing for the publicly hosted score report. */
(function () {
  "use strict";

  var reportPath = "/ereg/scorereports/ensrGRIScorereport/core.html";
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setupStaticLogin() {
    var form = document.querySelector('form[data-form-primary="true"]');
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var submitButton = document.querySelector("[data-action-button-primary=true]");

    if (!form || !username || !submitButton) return;

    form.noValidate = false;
    form.action = "";

    if (password) {
      password.required = false;
      password.disabled = false;
      password.setAttribute("aria-required", "false");
    }

    var signUp = document.querySelector(".ulp-alternate-action");
    if (signUp) signUp.classList.add("static-login-hidden");

    function updateButton() {
      submitButton.disabled = !emailPattern.test(username.value.trim());
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

    // The provider snapshot focuses the first field after its initial paint.
    // Keep the public entry state aligned with the untouched sign-in screen.
    window.setTimeout(function () {
      if (document.activeElement === username) username.blur();
    }, 350);

    function continueToReport(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (!emailPattern.test(username.value.trim())) {
        username.focus();
        return;
      }

      try {
        window.localStorage.setItem("ets-login-identifier", username.value.trim());
      } catch (error) {
        // Private browsing can disable storage; routing still works.
      }

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
