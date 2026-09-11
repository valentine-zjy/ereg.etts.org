# Design QA — ETS sign-in page

## Comparison target

- Source visual truth: `C:\Users\Suxia\AppData\Local\Temp\codex-clipboard-7cb0fd91-092f-4f91-b292-42a0b4fb3250.png`
- Implementation screenshot: `C:\Users\Suxia\AppData\Local\Temp\ets-login-desktop-release.png`
- Route and state: `/idaas.ets.org/u/login.html`, desktop initial state, no input focused, empty fields, disabled Continue button.
- Source pixels: `2145 × 1344`; implementation pixels: `2145 × 1344`.
- CSS viewport: `1430 × 896`; device scale factor: `1.5` for both the normalized source comparison and implementation capture. No crop, browser chrome, or density adjustment was used.

## Full-view comparison evidence

The source image and `ets-login-desktop-release.png` were opened together in one visual comparison input. The logo, teal page field, top Help/Create Account navigation, white sign-in panel, form geometry, disabled-button state, recovery links, and footer align with the source at the matched density.

## Focused-region comparison evidence

The form panel was readable in the full-view comparison, including the display font, two field outlines, password-eye asset, and recovery links; a separate crop was not needed. The implementation uses the copied ETS logo, password-eye asset, and locally hosted ETS font files rather than hand-drawn substitutions.

## Responsive and interaction checks

- Mobile implementation evidence: `C:\Users\Suxia\AppData\Local\Temp\ets-login-mobile-release.png` at `390 × 844` CSS pixels, device scale factor `1`.
- Mobile document overflow: `0px`; sign-in panel width: `350px` inside the `390px` viewport.
- Empty initial state keeps Continue disabled.
- Entering `visitor@example.com` enables Continue and routes to `/ereg/scorereports/ensrGRIScorereport/core.html` without a password.
- Password visibility toggle changes the field from `password` to `text`.
- Password content is not stored or sent by the static routing script.
- Browser console was checked. The untouched initial state had no console errors. The source snapshot still attempts a nonessential third-party analytics beacon, which may be aborted by the browser; it has no visible or functional effect on this page.

## Comparison history

1. **[P1] Login controls differed from the reference.** The prior static routing presentation removed the password field and recovery links. It was replaced with the source's two-field sign-in layout, the header registration entry, and the visible recovery links, while retaining local-only routing.
2. **[P2] Initial username focus differed from the reference.** `ets-login-local-normalized.png` showed the floating/focused username label. The static routing script now removes that inherited automatic focus after the source snapshot initializes. The final desktop capture shows the unfocused placeholder state.
3. **[P2] Phone viewport had 5px horizontal overflow.** The first mobile capture showed fixed-width prompt descendants extending past the viewport. The mobile rule now scopes `--prompt-width` to `calc(100vw - 40px)`. The release capture reports `0px` overflow with no out-of-bounds elements.

## Required fidelity surfaces

- **Fonts and typography:** Local Speckless and Beausite font files match the display/body hierarchy and avoid runtime font CORS failures.
- **Spacing and layout rhythm:** The desktop card, content gutters, vertical gaps, footer alignment, and 15px panel radius match the reference at the normalized viewport.
- **Colors and tokens:** The source teal field, white panel, dark text, field border, and muted disabled-button colors are retained.
- **Image quality and asset fidelity:** The ETS logo is the copied source SVG; the existing source password-eye mark is preserved. No CSS or handcrafted icon replacement is used.
- **Copy and content:** The visible initial-state copy matches the reference, with no public demo wording.

## Findings

No actionable P0, P1, or P2 findings remain.

## Follow-up polish

- [P3] The source snapshot includes a nonessential third-party analytics beacon. It can be removed in a later cleanup if an entirely network-quiet static page is required.

final result: passed
