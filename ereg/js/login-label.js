/* The static Auth0 snapshot keeps its markup on one generated line. Update the
   visible username label after parsing without changing validation behaviour. */
(function () {
  "use strict";

  function updateUsernameLabel() {
    if (document.documentElement.dataset.demoLogin === "true") return;
    var label = document.getElementById("username-label");
    if (!label || !label.firstChild) return;
    label.firstChild.nodeValue = "电话或用户名或电子邮件 ";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateUsernameLabel);
  } else {
    updateUsernameLabel();
  }
}());
