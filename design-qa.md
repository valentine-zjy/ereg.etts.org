# Design QA — GRE Test Taker Score Report

## Comparison target

- Source visual truth: `C:\Users\Suxia\AppData\Local\Temp\ets-score-report-pdf-audit\page-1.png`, rendered from the approved user-provided three-page PDF.
- Implementation evidence: `C:\Users\Suxia\AppData\Local\Temp\score-report-1440-final-top.png` and `C:\Users\Suxia\AppData\Local\Temp\score-report-390-final-top.png`.
- Direct comparison artifact: `C:\Users\Suxia\AppData\Local\Temp\score-report-desktop-comparison.png`. It places matched report-body crops from the PDF and the rendered implementation side by side; browser navigation and the page-level PDF download control are intentionally excluded from that normalized comparison.
- Route and state: `/ereg/scorereports/ensrGRIScorereport/core.html`, initial report state; the source PDF is the print-report state and the browser implementation adds the approved eReg navigation and download control.
- Desktop capture: `1440 × 1200` CSS pixels at device scale factor `1`.
- Mobile capture: `390 × 844` CSS pixels at device scale factor `1`.
- PDF source and browser capture differ in page dimensions, so each report body was cropped to its content edges and scaled to an equal `700px` comparison width. No content was stretched non-proportionally.

## Full-view comparison evidence

The approved PDF and final desktop report body were reviewed in the combined comparison artifact. The report masthead, orange divider, test-taker data, photo, test details, purple section bars, brick-red score headers, pale-blue scales, score markers, percentiles, history table, and recipient-table hierarchy match the approved source. The implementation preserves the required website-level title and PDF download button outside the report body.

## Focused-region comparison evidence

- **Report masthead and personal-information block:** the final capture includes the GRE logo, report title, non-transmission note, divider, exact personal fields, photo, latest-test data, and print date.
- **Score cards and history table:** the three score values, score ranges, markers, percentile ranks, and history cells match the PDF data and visual hierarchy. The pale-blue range bars are present below each score marker.
- **Mobile score and table regions:** `C:\Users\Suxia\AppData\Local\Temp\score-report-390-scrolled-cdp.png` confirms the score cards and wide tables scroll only within their own visible regions while the document itself remains fixed to the phone width.

## Responsive and interaction checks

Browser-rendered measurements were taken in Chrome DevTools Protocol after emulating each viewport:

| Viewport | Root width | Root scroll width | Result |
| --- | ---: | ---: | --- |
| 1440px | 1425px | 1425px | No page-level horizontal overflow |
| 768px | 753px | 753px | No page-level horizontal overflow |
| 390px | 375px | 375px | No page-level horizontal overflow |
| 360px | 345px | 345px | No page-level horizontal overflow |

- At `390px`, the score cards expose `720px` of scrollable content within a `319px` local viewport; history and recipient tables expose `760px` and `820px` of content within local `321px` viewports.
- Setting all three local scroll positions to `156px` succeeded while the document width remained `375px`; this was also captured in the mobile scrolled screenshot.
- The download anchor targets `/images/5RGB62EB.pdf` with the filename `GRE_Score_Report_5RGB62EB.pdf`.
- The copied PDF SHA-256 is `C37A5988D97F93289173BF5C6DAB0C12746446DA86E38399E4969775737C1ADD`, matching the user-provided source PDF.
- The rendered report loads one local script only. Chrome resource inspection found no external analytics, marketing, or profile-reporting requests, and no console errors were observed.
- `Back` returns to the local eReg home route; `Request Score Review` remains a visual-only button and does not create an external request.

## Comparison history

1. **[P1] Entire report horizontally scrolled on phones.** The earlier generated report had a single fixed-width report wrapper. It was replaced with semantic report sections and independent scroll regions for the score cards and wide tables. Post-fix Chrome measurements at 360px and 390px show root scroll width equal to root client width.
2. **[P1] Download asset did not match the supplied PDF.** The previous download pointed to a different PDF. The supplied `5RGB62EB.pdf` is now copied unchanged into `images/`, referenced by the report, and given an attachment response header in `vercel.json`. Hash verification passed.
3. **[P1] Print date and PDF masthead were missing from the rebuilt report data.** The final report adds the GRE logo, source-report title/note, and print date. The final desktop comparison artifact confirms those elements with the source PDF.
4. **[P2] Static report loaded third-party tracking and identity variables.** The rebuilt route uses only local report assets and a local render script. Final Chrome resource inspection reports no external resources and no console errors.

## Required fidelity surfaces

- **Fonts and typography:** The local Beausite Classic and Speckless fonts retain the eReg display and navigation hierarchy; report typography uses the compact Arial-like print-report treatment. Headings, field labels, scale labels, and table cells remain readable without truncation at all tested widths.
- **Spacing and layout rhythm:** Desktop uses a bounded report page with the source's divider, photo/data split, score-card spacing, and section rhythm. Phone widths stack identity information and retain readable vertical spacing.
- **Colors and tokens:** Purple section bars, brick-red headers/markers, orange dividers, pale-blue score bars, muted table fills, and white document surfaces are expressed as scoped report tokens.
- **Image quality and asset fidelity:** The supplied test-taker photo and copied GRE source logo are used directly. No substitute photo, generated image, custom SVG, or CSS-drawn brand asset was introduced.
- **Copy and content:** Report labels, personal data, test data, scores, percentile ranks, history, recipient headings, policy text, and contact information were transcribed from the approved report source. No demo-site wording is present.
- **Accessibility and states:** Semantic headings, table headers, image alt text, skip navigation, focus indicators, keyboard-focusable scroll regions, and explicit local scroll affordances are included. The primary download and back navigation work; the score-review control is intentionally visual-only as scoped.

## Findings

No actionable P0, P1, or P2 findings remain.

## Follow-up polish

- [P3] The browser report is intentionally a responsive web representation rather than a page-for-page PDF renderer, so its policy sections flow continuously instead of forcing PDF page breaks.

final result: passed
