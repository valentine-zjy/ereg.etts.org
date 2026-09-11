# Design QA — GRE Test Taker Score Report

## Comparison target

- Source visual truth: `D:\temp\2026\9月\GRE Score Report.html`, captured at `C:\Users\Suxia\AppData\Local\Temp\codex-gre-reference-desktop.png` and `C:\Users\Suxia\AppData\Local\Temp\codex-gre-reference-mobile.png`.
- Implementation route: `/ereg/scorereports/ensrGRIScorereport/core.html`.
- Implementation evidence: `C:\Users\Suxia\AppData\Local\Temp\codex-gre-final-pass-1440.png`, `C:\Users\Suxia\AppData\Local\Temp\codex-gre-final-pass-390.png`, and `C:\Users\Suxia\AppData\Local\Temp\codex-gre-final-pass-768.png`.
- Combined visual evidence: `C:\Users\Suxia\AppData\Local\Temp\codex-gre-final-comparison-desktop.png` and `C:\Users\Suxia\AppData\Local\Temp\codex-gre-final-comparison-mobile.png`.
- Desktop state: 1440px CSS viewport, device scale factor 1. Mobile state: 390px CSS viewport, device scale factor 1. The comparison preserves the intentionally different score-overview component and the approved PDF-backed personal and score data.

## Comparison history

1. **[P1] Global legacy styles changed the preserved score overview.** The first implementation pass caused the score title and card labels to inherit the saved page's condensed display font. The score-overview font family is now explicitly scoped back to its existing Arial implementation; its card structure, blue tracks, markers, and local scrolling remain unchanged.
2. **[P2] The report document title clipped at narrow phone widths.** The document masthead originally retained the desktop two-column layout. It now stacks the GRE mark and report title on mobile, making the title and non-transmission note fully visible before the personal-information content.
3. **[P2] Back control lost its label contrast.** The legacy button color rule overrode the local secondary style. The Back button now uses the reference page's filled purple treatment with visible white text.

## Final visual review

- **Fonts and typography:** The eReg shell, page title, compact report text, purple section labels, brick-red table headers, and PDF action match the supplied saved report's hierarchy. The retained score overview keeps its prior type scale and alignment.
- **Spacing and layout rhythm:** The desktop page uses the saved report's wide container, unshadowed report body, masthead divider, compact tables, action bar, and centered footer. On phones, identity data and policy text flow vertically; wide report regions remain locally scrollable.
- **Colors and visual tokens:** The reviewed result uses the saved page's white surface, GRE purple, brick-red headings, orange divider, pale-blue score tracks, muted table fill, and gray rules.
- **Image and icon fidelity:** The repository's identical GRE header-logo asset is used. The personal photo remains the approved local report photo. Navigation icons are copied from the supplied source markup; no generated or substitute assets were introduced.
- **Copy and content:** Personal information, photo, test data, score data, and the local PDF filename remain unchanged. `Print Date` and demo-site wording are absent. The source's empty/cancelled report values are not copied because the approved PDF-backed data is intentionally retained.

## Functional and responsive checks

- The local `Download PDF Report` link still targets `/images/5RGB62EB.pdf` with `GRE_Score_Report_5RGB62EB.pdf`; `vercel.json` retains its attachment response header.
- `Back` remains a local eReg-home link; `Request Score Review` remains intentionally visual-only.
- The 1440px, 768px, 390px, and 360px captures show no non-score section clipping. Score cards and report tables retain their own horizontal-scroll regions at phone widths.
- Visual inspection confirms the score values, arrows, and black scale markers remain centered together for all three score cards.
- Source search found no Segment, HubSpot, Facebook, Dynatrace, analytics, demo, or Print Date strings in the report route, report script, or report stylesheet. `git diff --check` completed without whitespace errors.

## Findings

No actionable P0, P1, or P2 findings remain.

## Follow-up polish

- [P3] The saved reference uses a different no-photo/cancelled-score state; those data-state differences are intentionally excluded from visual matching.

final result: passed
