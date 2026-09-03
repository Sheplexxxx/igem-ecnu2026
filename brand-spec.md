# ECNU-CHINA Homepage Brand Specification

## Design direction

Quiet Bio-Editorial: a restrained scientific narrative with generous whitespace,
precise alignment, and the approachable energy of the ECNU-CHINA microbial
factory illustration. Decorative geometry is avoided; motion and interaction
are reserved for explaining biological causality.

The homepage is a Redesign · Preserve: routes, logo, navigation, and the visual
identity remain stable while the scientific copy and evidence hierarchy are
rewritten. `Do not start from zero.` is the protected narrative pivot.

## Scientific communication

- Separate team observations, control-supported interpretations, model
  predictions, proposed mechanisms, and future work in both wording and visuals.
- Use `supports`, `is consistent with`, `predicts`, and `is designed to test`
  according to the evidence level. Do not translate early-stage evidence into
  clinical efficacy claims.
- Describe RBD as a heterologous viral recall antigen, not a universal
  neoantigen.
- State that the current mouse experiment used intratumoral administration;
  systemic tumor targeting remains a validation goal.
- Preserve experimental qualifiers, comparators, model systems, and uncertainty
  whenever a numerical result is shown.

## Brand asset

- Primary logo: `assets/ecnu-brand/ecnu-china-logo.png`
- Source: user-provided 6000 × 6000 PNG
- Usage: always reference the real PNG through an `<img>` element. Do not redraw,
  recolor, or replace it with CSS shapes.
- Image treatment: keep the full mark visible in the navigation. Large editorial
  crops may be used in the homepage hero as long as the characters and ECNU-CHINA
  wordmark remain recognizable.

## Color tokens

- Ink / primary: `#242458`
- Ink deep: `#171742`
- Signal lime: `#E5F93F`
- Signal lime soft: `#F1FF88`
- Mist: `#C6C7DA`
- Paper: `#F7F7F1`
- White: `#FFFFFF`
- Body text: `#34344A`

The homepage must not reintroduce the previous red, green, or blue accent palette.
Signal lime is reserved for emphasis, active state, and biological-pathway cues.

## Typography

- Display: Bricolage Grotesque, with Arial Black fallback
- Body and UI: IBM Plex Sans, with Segoe UI fallback
- Editorial scientific phrases may use IBM Plex Serif sparingly.

## Shape and spacing

- Base spacing unit: 8px
- Controls: 8–10px radius
- Illustration-led surfaces: 24–32px radius
- Pills are used only for short biological traits or active filters
- Prefer borders, bands, and whitespace over card shadows

## Motion

- Short UI feedback: 160–220ms
- Section reveal: 480–640ms
- One signature motion family: conveyor/pathway movement
- All non-essential motion must collapse under `prefers-reduced-motion`

## Protected contracts

- Existing routes, navigation labels, homepage links, and `#storyline` anchor
- The approved scientific evidence boundaries and `Do not start from zero.` line
- Header/footer component loading through `index.js`
- Mobile navigation behavior and keyboard-accessible focus order
