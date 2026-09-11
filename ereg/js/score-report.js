(function () {
  "use strict";

  var scoreReportData = {
    reportTitle: "TEST TAKER SCORE REPORT",
    person: {
      name: "TING WU",
      address: "PINGYI,YILIN, YILIN, 273300 China",
      email: "xiaowuminye@163.com",
      phone: "86-13287133601",
      dateOfBirth: "November 23, 1999",
      gender: "Female",
      photo: "../../../images/wm.png"
    },
    test: {
      date: "August 5, 2026",
      country: "China",
      center: "STNRPCHN - Home Edition",
      registrationNumber: "3872463",
      printDate: "August 14, 2026"
    },
    scores: [
      { title: "Verbal Reasoning", scoreLabel: "Your Scaled Score:", value: "159", min: "130", max: "170", percentile: "80th", position: "72.5%" },
      { title: "Quantitative Reasoning", scoreLabel: "Your Scaled Score:", value: "170", min: "130", max: "170", percentile: "91st", position: "100%" },
      { title: "Analytical Writing", scoreLabel: "Your Score:", value: "3.0", min: "0", max: "6", percentile: "17th", position: "50%" }
    ],
    history: {
      date: "August 5, 2026",
      verbal: { scaled: "159", percentile: "80" },
      quantitative: { scaled: "170", percentile: "91" },
      writing: { score: "3.0", percentile: "17" }
    },
    policies: [
      {
        title: "Score Reporting Policies",
        paragraphs: [
          "With the ScoreSelect® option, you can decide which test scores to send to the institutions you designate. There are three options to choose from:"
        ],
        list: [
          "Most Recent option - Send your scores from your most recent test administration",
          "All option - Send your scores from all administrations in the last five years",
          "Any option - Send your scores from one OR as many test administrations in the last five years (this option is not available on test day when you select up to four FREE score reports)"
        ]
      },
      {
        title: "",
        paragraphs: [
          "Scores for a test administration must be reported in their entirety. Institutions will receive score reports that show only the scores that you selected to send to them. There will be no special indication if you have taken additional GRE tests. See the GRE® Information Bulletin for details. The policies and procedures explained in the Bulletin for the current testing year supersede previous policies and procedures in previous bulletins.",
          "If your scores are not available for any reason, you will see \"Not Available\" in Your Test Score History.",
          "GRE test scores are reportable for five (5) years following your test date. For example, scores for a test taken on July 3, 2021, are reportable through July 2, 2026. Note: Score recipients will only receive scores from test administrations that you have selected to send to them.",
          "Beginning in September 2023, the subscores on the Physics and Psychology Tests will be reported as percent correct scores (i.e., the percentage of questions in a subscore area answered correctly). Subscores earned after September 2023 should not be compared with scaled subscores earned prior to September 2023."
        ]
      },
      {
        title: "Percentile Rank (% Below)",
        paragraphs: [
          "A percentile rank for a test score indicates the percentage of test takers who took that test and received a lower score. Regardless of when the reported scores were earned, the percentile ranks for General Test and Subject Test scores are based on the scores of all test takers who tested within the most recent three-year period."
        ]
      },
      {
        title: "Free GRE Diagnostic Service",
        paragraphs: [
          "For detailed information about your performance on the Verbal Reasoning and Quantitative Reasoning sections of the computer-delivered GRE General Test, access the free GRE Diagnostic Service from your ETS account. This service includes a description of the types of questions you answered right and wrong, the difficulty level of each question, and the time spent on each question. This service is available approximately 15 days after your test administration and for six months following your test administration."
        ]
      },
      {
        title: "Retaking a GRE Test",
        paragraphs: [
          "You can take the GRE General Test once every 21 days, up to five times within any continuous rolling 12-month period (365 days). This applies even if you canceled your scores on a test taken previously. You can retake a GRE Subject Test once every 14 days.",
          "Note: This policy will be enforced even if a violation is not immediately identified (e.g., inconsistent registration information) and test scores have been reported. In such cases, the invalid scores will be canceled and score recipients will be notified of the cancellation. Test fees will be forfeited."
        ]
      }
    ]
  };

  window.scoreReportData = scoreReportData;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
    });
  }

  function scoreCard(score) {
    return '' +
      '<section class="score-card" style="--score-position:' + escapeHtml(score.position) + '">' +
        '<h3>' + escapeHtml(score.title) + '</h3>' +
        '<div class="score-card-body">' +
          '<span class="score-label">' + escapeHtml(score.scoreLabel) + '</span>' +
          '<strong class="score-value">' + escapeHtml(score.value) + '</strong>' +
          '<div class="score-scale" aria-label="Score range ' + escapeHtml(score.min) + ' to ' + escapeHtml(score.max) + '">' +
            '<span>' + escapeHtml(score.min) + '</span>' +
            '<span class="scale-track"><span class="scale-marker"></span></span>' +
            '<span>' + escapeHtml(score.max) + '</span>' +
          '</div>' +
        '</div>' +
        '<p class="percentile"><strong>' + escapeHtml(score.percentile) + '</strong> Percentile</p>' +
      '</section>';
  }

  function recipientTable(title, recipientLabel) {
    return '' +
      '<section class="recipient-section">' +
        '<h3>' + escapeHtml(title) + '</h3>' +
        '<div class="table-scroll" role="region" aria-label="' + escapeHtml(title) + ' table" tabindex="0">' +
          '<table class="recipient-table">' +
            '<thead><tr><th>Report Date</th><th>' + escapeHtml(recipientLabel) + ' (Code)</th><th>Department (Code)</th><th>Test Title</th><th>Test Date</th></tr></thead>' +
            '<tbody><tr><td colspan="5" aria-label="No score recipients reported"></td></tr></tbody>' +
          '</table>' +
        '</div>' +
      '</section>';
  }

  function policyBlock(policy) {
    var title = policy.title ? '<h3>' + escapeHtml(policy.title) + '</h3>' : '';
    var paragraphs = policy.paragraphs.map(function (paragraph) {
      return '<p>' + escapeHtml(paragraph) + '</p>';
    }).join('');
    var list = policy.list ? '<ul>' + policy.list.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul>' : '';
    return '<section class="policy-block">' + title + paragraphs + list + '</section>';
  }

  function renderReport() {
    var target = document.getElementById("score-report");
    if (!target) return;
    var data = scoreReportData;
    var scores = data.scores.map(scoreCard).join('');
    var policies = data.policies.map(policyBlock).join('');

    target.innerHTML = '' +
      '<header class="report-identity">' +
        '<div class="report-document-header">' +
          '<img src="../../img/GRI-header-logo.svg" alt="GRE">' +
          '<div><h2>' + escapeHtml(data.reportTitle) + '</h2><p><strong>Note:</strong> This report is not valid for transmission of scores to an institution.</p></div>' +
        '</div>' +
        '<div class="orange-rule"></div>' +
        '<div class="identity-grid">' +
          '<div class="person-details">' +
            '<h3>' + escapeHtml(data.person.name) + '</h3>' +
            '<dl>' +
              '<div><dt>Address:</dt><dd>' + escapeHtml(data.person.address) + '</dd></div>' +
              '<div><dt>Email:</dt><dd>' + escapeHtml(data.person.email) + '</dd></div>' +
              '<div><dt>Phone:</dt><dd>' + escapeHtml(data.person.phone) + '</dd></div>' +
              '<div><dt>Date of Birth:</dt><dd>' + escapeHtml(data.person.dateOfBirth) + '</dd></div>' +
              '<div><dt>Gender:</dt><dd>' + escapeHtml(data.person.gender) + '</dd></div>' +
            '</dl>' +
          '</div>' +
          '<figure class="test-taker-photo"><img src="' + escapeHtml(data.person.photo) + '" alt="Test taker photo"></figure>' +
        '</div>' +
        '<div class="test-details">' +
          '<p><strong>Most Recent Test Date:</strong> ' + escapeHtml(data.test.date) + '</p>' +
          '<p><strong>Test Center Country:</strong> ' + escapeHtml(data.test.country) + '</p>' +
          '<p><strong>Test Center:</strong> ' + escapeHtml(data.test.center) + '</p>' +
          '<p><strong>Registration Number:</strong> ' + escapeHtml(data.test.registrationNumber) + '</p>' +
          '<p><strong>Print Date:</strong> ' + escapeHtml(data.test.printDate) + '</p>' +
        '</div>' +
      '</header>' +
      '<section class="score-overview">' +
        '<h2>Your Scores for the General Test Taken on ' + escapeHtml(data.test.date) + '</h2>' +
        '<div class="score-cards-scroll" role="region" aria-label="General test scores" tabindex="0"><div class="score-cards">' + scores + '</div></div>' +
      '</section>' +
      '<section class="score-history">' +
        '<h2>Your Test Score History</h2>' +
        '<h3>General Test Scores</h3>' +
        '<div class="table-scroll" role="region" aria-label="General Test Scores table" tabindex="0">' +
          '<table class="history-table">' +
            '<thead><tr><th rowspan="2">Test Date</th><th colspan="2">Verbal Reasoning</th><th colspan="2">Quantitative Reasoning</th><th colspan="2">Analytical Writing</th></tr><tr><th>Scaled Score</th><th>Percentile</th><th>Scaled Score</th><th>Percentile</th><th>Score</th><th>Percentile</th></tr></thead>' +
            '<tbody><tr><td>' + escapeHtml(data.history.date) + '</td><td>' + escapeHtml(data.history.verbal.scaled) + '</td><td>' + escapeHtml(data.history.verbal.percentile) + '</td><td>' + escapeHtml(data.history.quantitative.scaled) + '</td><td>' + escapeHtml(data.history.quantitative.percentile) + '</td><td>' + escapeHtml(data.history.writing.score) + '</td><td>' + escapeHtml(data.history.writing.percentile) + '</td></tr></tbody>' +
          '</table>' +
        '</div>' +
        '<h3 class="subject-heading">Subject Test Scores</h3>' +
        '<p>You do not have reportable test scores at this time.</p>' +
      '</section>' +
      '<section class="recipients"><h2>Your Score Recipient(s)</h2>' +
        recipientTable("Undergraduate Institution", "Institution") +
        recipientTable("Designated Score Recipient(s)", "Score Recipient") +
      '</section>' +
      '<section class="score-information"><h2>About Your <em>GRE</em>® Score Report</h2>' + policies +
        '<section class="policy-block"><h3>For More Information</h3><p>For information about interpreting your scores, see <a href="https://www.ets.org/gre/test-takers/general-test/scores/understand-scores.html" target="_blank" rel="noreferrer">https://www.ets.org/gre/test-takers/general-test/scores/understand-scores.html</a>.</p><p>If you have any questions concerning your score report, email GRE Services at <a href="mailto:gre-info@ets.org">gre-info@ets.org</a> or call 1-609-771-7670 or 1-866-473-4373 (toll free for test takers in the U.S., U.S. Territories and Canada) between 8 a.m. and 7:45 p.m. (New York Time).</p></section>' +
      '</section>';
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderReport);
  } else {
    renderReport();
  }
}());
