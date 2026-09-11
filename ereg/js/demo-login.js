/*
 * Static-hosting sign-in for the score-report demo.  No credentials are sent
 * anywhere: a syntactically valid email address is only stored in this
 * browser, then the visitor is taken to the public report.
 */
(function () {
  "use strict";

  var reportPath = "/ereg/scorereports/ensrGRIScorereport/core.html";

  function setupDemoLogin() {
    var form = document.querySelector('form[data-form-primary="true"]');
    var email = document.getElementById("username");
    var password = document.getElementById("password");
    var submitButton = document.querySelector("[data-action-button-primary=true]");
    var emailLabel = document.getElementById("username-label");

    if (!form || !email || !submitButton) return;

    document.documentElement.dataset.demoLogin = "true";
    form.noValidate = false;
    form.action = "";

    email.type = "email";
    email.name = "email";
    email.inputMode = "email";
    email.autocomplete = "email";
    email.placeholder = "name@example.com";
    email.setAttribute("aria-describedby", "demo-login-note");

    if (emailLabel) {
      emailLabel.childNodes[0].nodeValue = "电子邮件地址 ";
    }

    if (password) {
      password.value = "demo-login-bypass";
      password.required = false;
      password.disabled = true;
      password.setAttribute("aria-required", "false");
      var passwordWrapper = password.closest(".input-wrapper");
      if (passwordWrapper) passwordWrapper.classList.add("demo-login-hidden");
    }

    var resetLink = form.querySelector(".cedda26f3");
    var signUp = document.querySelector(".ulp-alternate-action");
    if (resetLink) resetLink.classList.add("demo-login-hidden");
    if (signUp) signUp.classList.add("demo-login-hidden");

    var note = document.createElement("p");
    note.id = "demo-login-note";
    note.className = "demo-login-note";
    note.textContent = "演示站点无需验证：输入任意有效邮箱即可查看成绩报告。";
    email.closest(".input-wrapper").insertAdjacentElement("afterend", note);

    function updateButton() {
      submitButton.disabled = !email.validity.valid;
    }

    function updateButtonAfterOtherHandlers() {
      window.setTimeout(updateButton, 0);
    }

    email.addEventListener("input", updateButtonAfterOtherHandlers);
    email.addEventListener("change", updateButtonAfterOtherHandlers);
    updateButton();

    function continueToReport(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (!email.validity.valid) {
        email.reportValidity();
        return;
      }

      try {
        window.localStorage.setItem("gre-demo-email", email.value.trim());
      } catch (error) {
        // Private browsing can disable storage; sign-in can still continue.
      }

      submitButton.disabled = true;
      submitButton.textContent = "正在打开成绩报告…";
      window.location.assign(reportPath);
    }

    // The captured click prevents the saved Auth0 page scripts from starting
    // their original sign-in flow before the browser creates a submit event.
    submitButton.addEventListener("click", continueToReport, true);
    form.addEventListener("submit", continueToReport, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupDemoLogin);
  } else {
    setupDemoLogin();
  }
}());
