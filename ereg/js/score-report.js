/* Keeps fixed-width report tables readable on phones without altering the
   generated report markup or allowing the full document to overflow. */
(function () {
  "use strict";

  function makeScrollable(scoreTable, node) {
    if (!node || node.parentElement.classList.contains("report-scroll")) return;

    var wrapper = document.createElement("div");
    wrapper.className = "report-scroll";
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", "Scrollable score report section");
    wrapper.tabIndex = 0;
    scoreTable.insertBefore(wrapper, node);
    wrapper.appendChild(node);
  }

  function wrapReportTables() {
    var scoreTable = document.getElementById("scoreTable");
    if (!scoreTable) return;

    /* The generated HTML nests the full report in #oReportDiv, not as direct
       table children. Wrapping this one root keeps the entire report available
       in a local scrolling region on narrow screens. */
    var reportRoot = scoreTable.querySelector("#oReportDiv");
    if (reportRoot) {
      makeScrollable(scoreTable, reportRoot);
      return;
    }

    Array.prototype.forEach.call(scoreTable.children, function (child) {
      if (child.tagName === "TABLE") makeScrollable(scoreTable, child);
    });
  }

  function createScoreCards() {
    var snapshot = document.getElementById("score-snapshot");
    if (!snapshot) return;

    var data = [
      { title: "Verbal Reasoning", label: "Your Scaled Score:", value: "159", min: "130", max: "170", percentile: "80th", position: "72.5%" },
      { title: "Quantitative Reasoning", label: "Your Scaled Score:", value: "170", min: "130", max: "170", percentile: "91st", position: "100%" },
      { title: "Analytical Writing", label: "Your Score:", value: "3.0", min: "0", max: "6", percentile: "17th", position: "50%" }
    ];
    var cards = snapshot.querySelectorAll(".cards-grid > .card");

    Array.prototype.forEach.call(cards, function (card, index) {
      var item = data[index];
      if (!item) return;

      card.style.setProperty("--score-position", item.position);
      card.innerHTML =
        '<div class="card-title">' + item.title + '</div>' +
        '<div class="score-graphic">' +
          '<div class="score-label">' + item.label + '</div>' +
          '<div class="score-value">' + item.value + '</div>' +
          '<div class="score-scale" aria-label="Score range ' + item.min + ' to ' + item.max + '">' +
            '<span class="scale-min">' + item.min + '</span>' +
            '<span class="scale-track"><span class="scale-marker"></span></span>' +
            '<span class="scale-max">' + item.max + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="percentile"><span>' + item.percentile + '</span><span>Percentile</span></div>';
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      createScoreCards();
      wrapReportTables();
    });
  } else {
    createScoreCards();
    wrapReportTables();
  }
}());
