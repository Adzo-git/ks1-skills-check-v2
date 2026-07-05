# Primary Tutor Online — Visual Reference Pack: Analysis & Implementation Plan

**Status: analysis only. No code has been changed.**
This document is the deliverable requested before any implementation begins.

---

## 1. Summary of the final visual direction

Primary Tutor Online's visual identity, as defined by Master Pack C (the
authoritative brand bible) and the ten supporting packs, is:

- **Friendly, professional, trusted.** Clean vector illustration — not
  emoji, not clip-art, not photography, not painted/soft-rendered art.
- **Poppins** throughout, a defined type scale (H1 32px bold → caption
  12px), used for both brand and body text.
- **A four-colour primary palette** (Purple `#652DA0`, Pink `#E91E63`,
  Green `#43A047`, Blue `#2196F3`) plus five secondary tints and four
  neutrals — small, disciplined, not decorative.
- **Four recurring named characters** (Emma, Oliver, Sophie, Ben), each
  drawn consistently front/side/back, with a shared set of actions
  (pointing, counting, thinking, reading, celebrating, confused, idea) and
  expressions (happy, excited, thinking, surprised, proud, focused, kind).
- **Reusable object, scene, and mathematical-model libraries**, each with
  explicit "use for" guidance tying them to curriculum content, not
  decoration.
- **A strict visual hierarchy**: Question → Illustration → Answers → Hint,
  where the hint is deliberately the smallest, quietest element on the
  page and is *never* a permanent motivational panel.
- **Progressive maturity by Key Stage** (confirmed consistent with what I
  already have in `DESIGN_SYSTEM.md` from earlier work) — KS1 bright and
  illustrated, maturing toward KS4 minimal and exam-style.

This is, encouragingly, the same direction the project has already been
moving in through v1.5–v1.9 (strand colours, sparing encouragement, themed
illustrations, sharpened tips) — this pack gives it a name, a formal
palette, and a much larger asset vocabulary to grow into. It is not a
reversal of that work; it's the permanent foundation that work was an
early, correct instinct toward.

## 2. Key design principles I will follow

Directly from the reference pack, in priority order when they compete:

1. **Mathematics is the hero.** Nothing on the page may compete visually
   with the question and the answer choices.
2. **Illustrations teach, never decorate.** Per Master Pack A/Image Pack 8:
   if removing an illustration makes no difference to understanding, it
   shouldn't be there in that form.
3. **Hints are small, quiet, skill-specific, and optional.** Never a
   permanent panel; never present on every question; never reveal an
   answer. This explicitly replaces (not supplements) the current
   always-visible Maths Tip box.
4. **Consistency over novelty.** One illustration style, one character
   set, one palette — reused, not reinvented per question. This directly
   supersedes some of my own v1.7–v1.9 choices (see §10 migration notes).
5. **Mathematical models stay mathematically accurate.** Ten frames,
   number lines, base-10, fraction bars/circles, arrays, bar models, clocks,
   coins, tally charts are explicitly *not* to be reskinned as decorative
   art — they already match this principle in the current codebase and
   that will not change.
6. **Accessible by construction.** High contrast, large touch targets,
   colour never the sole signal, alt text for every image, keyboard/screen
   reader friendly — matches constraints already enforced in the current
   codebase (aria-label leak sweeps, colour+icon+text redundancy).
7. **Build for reuse across the whole future platform**, not just this
   assessment — every naming and folder decision below is made with KS2–4,
   English, Science, worksheets, and lessons in mind, even though only KS1
   Maths exists today.

## 3. Proposed asset library structure

Five libraries, matching the reference pack's own division, each with a
**manifest** (a single JSON/JS file listing every asset ID, its category,
and its current implementation — placeholder or real) so the system always
knows what exists and what's still a placeholder:

```
assets/
  characters/     — Emma, Oliver, Sophie, Ben; poses & expressions
  objects/        — fruit, vehicles, toys, animals, school items, maths items, nature, money, time
  scenes/         — classroom, playground, park, kitchen, farm, beach, bedroom, supermarket, etc.
  models/         — NOT image assets — see §7, these stay code-generated
  hints/          — NOT image assets — pure content, see §8
```

Each of `characters/`, `objects/`, `scenes/` gets a manifest like:

```js
// assets/characters/manifest.js
const CHARACTERS = {
  "emma-point":     { character: "emma",   pose: "point",     status: "placeholder", file: null },
  "oliver-think":   { character: "oliver", pose: "think",     status: "placeholder", file: null },
  // ...
};
```

`status` is either `"placeholder"` (renders a simple built-in stand-in) or
`"final"` (renders the real asset file). **This is the single mechanism
that lets real artwork replace placeholders with zero changes to
`questions.js` or the assessment engine** — exactly the requirement in your
brief. A question never says "draw a circle here"; it says
`character: "emma-point"`, and the manifest decides what that resolves to
today versus after you upload real art.

## 4. Proposed folder and naming structure

Following Master Pack B's own naming examples almost exactly (they're
already good and I see no reason to diverge):

```
char_<name>_<pose>          e.g. char_emma_point, char_oliver_think
obj_<name>_<variant?>       e.g. obj_apple, obj_car_red, obj_bus_blue
scene_<name>                e.g. scene_classroom, scene_farm, scene_beach
model_<type>                e.g. model_ten_frame, model_number_line, model_base10
hint_<strand>_<nn>          e.g. hint_npv_01, hint_time_03
```

All lowercase, underscore-separated, no version numbers in the name
(versioning happens at the manifest/file level, not the ID) — an asset's
*ID* is permanent even when the *artwork behind it* is replaced.

## 5. Proposed character system

- **Four characters, fixed traits** (matching the Character Bible exactly):
  Emma (pink, curious/kind/encouraging), Oliver (green, thoughtful/logical),
  Sophie (purple, creative/imaginative — note: glasses, per the bible art,
  though the brand-bible palette assigns purple to the brand itself, not
  specifically Sophie — I'll treat character *colour* as their clothing
  only, distinct from strand colours, to avoid a collision between
  "Sophie is purple" and "Geometry is purple"), Ben (orange in the Character
  Bible board, though Master Pack B's asset shows Ben in blue — **this is a
  second small inconsistency between boards I'll flag rather than guess**:
  Character Bible = Ben orange, Master Pack B = Ben blue).
- **A fixed action vocabulary**: point, count, think, read, celebrate,
  confused, idea (7 actions × 4 characters = 28 character assets minimum,
  before expressions are layered in).
- **Placeholder behaviour**: until real art exists, a character reference
  renders as a simple labelled silhouette/initial-badge (e.g. a circle with
  "E" and the character's brand colour) — clearly a placeholder, never
  mistaken for finished art, per your instruction not to build throwaway
  placeholder *artwork*.
- **Usage discipline** (from Master Pack B's own usage notes): characters
  support understanding, they don't have to appear on every question — a
  counting question with a character pointing at objects earns their
  presence; an abstract place-value question likely doesn't need one.

## 6. Proposed object and scene system

- **Objects**: organised exactly along the 12 categories in Image Pack 3
  (People, Animals, Food & Drink, Transport, Shapes, School Items,
  Everyday Objects, Numbers & Maths, Nature, Time & Calendar, Money,
  Patterns & Counting). Each object is a single reusable asset ID,
  referenced by count/colour/position data from the question, never
  redrawn per question.
- **Scenes**: the 8 categories from Image Pack 4 (Home, School, Outdoors,
  Town & Community, Nature & Seasons, Fantasy & Imagination, Transport &
  Travel, Sport & Activities). Scenes are backgrounds *only* — objects and
  characters composite on top of them. A scene is optional per question,
  used only when it "helps children connect to the question" per the
  pack's own best-practice note, not applied by default.
- **Placeholder behaviour**: an object/scene reference without final
  artwork falls back to the current flat-SVG/emoji rendering already
  built (dots, themed emoji, simple shapes) — which is a perfectly
  reasonable placeholder tier, not a step backward, since it's already
  built, tested, and leak-verified.

## 7. Proposed mathematical model system

**These stay code-generated, not image assets — this is a deliberate
architectural decision, not an oversight.** Ten frames, number lines,
base-10 blocks, fraction bars/circles, arrays, bar models, clocks, coins,
and tally charts all need to render *specific numeric data per question*
(a number line spanning specific values, a clock at a specific time, a
fraction split into a specific number of parts). A static image can't do
that. The existing `app.js` renderers (`svgBase10`, `svgNumberline`,
`svgFraction`, `svgClock`, `svgCoins`, `svgTally`, `svgArray`) already do
exactly this and are already verified against the Illustration Style
Guide's own stated requirements (consistent size/proportions, logical
colours, accurate labelling). **These are the permanent asset for this
category — the code *is* the reusable library**, and my recommendation is
to leave them as-is structurally, restyled only where the colour palette
needs updating to match the brand-bible hex values exactly (see §10).

## 8. Proposed hint system

This is a genuine behaviour change, not just a rename — confirming I've
understood the instruction correctly:

- **Remove** the current always-visible Maths Tip box entirely from the
  default question layout.
- **Replace** with a small, optional "Hint" affordance (matching Image
  Pack 1/7's "View Hint" button pattern) that a child can *choose* to
  reveal, rather than a box that's always showing something.
- **Content**: organised as a hint library by curriculum objective/skill
  (not by the 5-type system from v1.4 — that typed system was a good
  intermediate step, but this pack asks for something more targeted: one
  or a small number of genuinely skill-specific hints *per question type*,
  e.g. "The longer hand shows the minutes" only for half-past/quarter-past
  clock questions, not a general MEA-strand pool). This means the hint
  library is organised more like `hints/npv/count-objects.js` than a flat
  185-entry strand pool.
- **Rule preserved from all existing work**: maximum two short sentences,
  never reveals the answer, verified via the same leak-sweep methodology
  already in place.
- **Migration note**: many of the 185 existing Maths Tips are already
  good raw material for this — several are already skill-specific
  (`"The short hand points to the hour, and the long hand points to the
  minutes"`, `"Equal rows can help you see multiplication clearly"`) and
  can likely be re-homed into the new per-skill hint library rather than
  rewritten from scratch.

## 9. Proposed question page layout

Directly from Image Pack 1 / 7's visual hierarchy panel, adapted to what
the brand bible (Master Pack C) actually specifies for colours/type:

```
1. Header        — brand mark, progress ("Question 12 of 37"), pause/menu
2. Strand tag     — small, e.g. "Maths" (already exists)
3. QUESTION       — largest text on the page
4. ILLUSTRATION   — large, central, the second-largest element
5. ANSWERS        — large tappable cards, 2×2 grid, colour-coded per option
                     (not per strand — this is a change from the current
                     single-column layout)
6. HINT           — small, quiet, optional, bottom or side placement
7. Navigation     — Previous / Flag for Review / Next
```

This is a real layout change from the current single-column answer list
and always-visible tip box — flagged clearly as a UI change requiring its
own careful, verified pass (HTML/CSS), not just a content change.

## 10. Phased implementation plan

Matching the staged approach you specified, with my own honesty checks
built into each stage (nothing marked "done" without the same
leak-sweep/regression rigor used throughout this project):

**Stage 1 — Asset/library architecture.**
Build the manifest structure (§3), folder/naming conventions (§4), and the
placeholder-resolution mechanism, with *zero* visible change to the live
assessment — this stage is pure plumbing, verified by confirming the
current assessment still renders identically before and after.

**Stage 2 — Page layout update.**
Rebuild `index.html`/`styles.css` to the new hierarchy (§9): larger
illustration area, 2×2 colour-coded answer grid, hint moved to a
collapsed/optional affordance, Maths Tip box removed. This is the biggest
single visual change and needs its own dedicated round with full
before/after screenshots-equivalent verification (structural HTML checks,
mobile-width checks, accessibility contrast checks).

**Stage 3 — Hint system rebuild.**
Replace the current always-on 185-tip pool with the per-skill hint library
(§8), migrating salvageable existing tips. Verify: every question has at
most the intended hint(s), none leak, hint is optional not forced.

**Stage 4 — Apply to a small test set.**
Pick one strand's worth of a handful of questions (I'd suggest starting
with the already-partially-migrated NPV counting questions, since they're
the most mature) and apply character/scene/object placeholders end-to-end,
to prove the whole pipeline before committing to all 360.

**Stage 5 — Validate.**
Full regression suite (as used throughout this project): syntax checks,
2,000-run selection simulation, aria-label leak sweep, full sitting
simulation, Supabase row-shape check, mobile-width CSS check.

**Stage 6 — Strand-by-strand rollout.**
NPV → AS → MD → Fractions → Measurement → Geometry → Position & Direction
→ Statistics, each strand fully completed (with a Question Review Log
entry per question) before the next begins, exactly as you specified.

---

## Two things I need your call on before Stage 1 begins

1. **Ben's colour** — Character Bible board shows orange, Master Pack B's
   character sheet shows blue. Worth confirming which is correct before
   any character asset ID gets built around it.
2. **Character colour vs. strand colour collision** — Sophie's brand
   colour is purple, and Geometry's strand colour is also purple in the
   established Design System. If Sophie appears on a Geometry question,
   should her outfit colour and the strand accent colour be allowed to
   clash, or should character colour take visual priority (i.e. strand
   colour becomes a much subtler accent when a character is present)?

No code has been changed. Awaiting your review of this plan.

---

## Stage 1 — COMPLETE

Both decisions confirmed: Ben = blue (Master Pack B authoritative);
character colours and strand colours are permanently separate systems,
any visual clash resolved by layout, never by recolouring.

**What was built** (all under `assets/`, see `assets/README.md` for full
detail): character manifest (4 characters × 7 poses = 28 entries), object
manifest (grounded in every emoji already live in the question bank),
scene manifest (18 scenes across 8 categories, honestly all placeholder
since no scene rendering exists yet), mathematical models manifest
(documents 11 implemented renderers and 4 genuine gaps — ten frames,
part-whole diagrams, bead strings, true bar models, 3D shapes — found by
cross-checking against Image Pack 5), a hint manifest skeleton (8 example
entries proving the naming convention, not a full migration), and the
resolver (`assets/resolve.js`) that makes placeholder→final swaps require
zero other code changes.

**Verified, not asserted:**
- 24/24 tests pass, including the key architectural claim: simulating a
  real-artwork upload (flip `status` to `"final"`, add a `file` path)
  and confirming the resolver returns the real asset with no other code
  touched.
- **Every live file's checksum is byte-for-byte identical before and
  after this stage** (`index.html`, `styles.css`, `app.js`,
  `questions.js`, `config.js`, `supabase-setup.sql`,
  `tools/generate-questions.js`) — this stage added files only; it did
  not modify anything that runs today.
- Full standard regression suite still passes (37 questions, correct
  quotas, 209 illustrations, 2,000 unique selections).

**The live assessment runs exactly as it did before this stage** — this
isn't a judgement call, it's a checksum fact.

---

## Stage 2A — COMPLETE (Page Layout Framework)

**Scope discipline confirmed by checksum**: `questions.js`, `config.js`,
`supabase-setup.sql`, `tools/generate-questions.js`, and all 5 asset
manifests are byte-for-byte identical before and after this stage. Only
`index.html`, `styles.css`, and `app.js` changed.

**What changed:**

1. **Colour tokens updated to exact Master Pack C hex values** — Purple
   `#652DA0` (already correct), Pink `#E91E63` (was `#e84b8a`), Green
   `#43A047` (was `#2e9e6b`), added Blue `#2196F3` as the 4th primary
   (token added, not yet applied anywhere — available for future stages).
   Neutrals updated to the brand bible's Text Dark/Medium/Border values.
2. **Type scale updated** — H1 now 32px bold per the brand bible's own
   type scale (was 30px). Question text (`.qtext`) enlarged to 28px→32px
   (mobile→desktop) and set to bold 700 weight — it is now the single
   largest, boldest text on the question screen, ahead of even the page
   header, matching "maths is always the hero."
3. **Illustration area enlarged** — 300px→400px (mobile→desktop), up
   from 280px→360px.
4. **2×2 answer card grid** — new `.answers-grid` class applied only to
   the question-screen answers (`#answers`), leaving the parent
   independence screen's 3-option single-column list (which reuses the
   base `.answers` class) completely unaffected. Drops to single column
   below 360px width so long answers (e.g. "half past 3") never feel
   cramped on the smallest phones.
5. **The always-visible Maths Tip box is now hidden by default**, with a
   small "💡 View Hint" button that reveals it on tap (matching Master
   Pack C's own "View Hint" button pattern) and automatically re-hides on
   every new question. Restyled smaller and quieter — soft yellow, no
   dashed border, 13.5px body text (down from 15px) — matching the brand
   bible's own Hint Box example rather than the pink dashed box invented
   in earlier work.
6. **The sparing encouragement line was removed entirely** (previously
   shown on every 6th question). This is an interpretation, not an
   explicit line-item instruction — Master Pack C's own page hierarchy
   panel lists Question/Illustration/Answers as largest, Progress/
   Navigation as medium, Hint as small, and explicitly states **"Nothing
   else."** Encouragement wasn't in that list, so it was removed along
   with the tip box's permanence. Flagging this clearly in case the
   sparing encouragement was actually wanted to stay — it's a one-line
   revert if so.

**Verified, not asserted** (full faithful-DOM tests, not just a code read):
- Loads from Question 1 with zero console warnings and zero thrown errors.
- Hint starts hidden on every question; tapping "View Hint" reveals it and
  changes the button to "Hide Hint"; tapping again hides it; moving to the
  next question automatically resets it to hidden.
- Answer selection enables the Next button correctly; Next correctly
  advances `state.index`.
- A full simulated 37-question sitting → confidence → independence →
  report produces the identical response shape as before (11 keys,
  unchanged) — scoring and Supabase row shape are untouched.
- Full standard regression suite (37 questions, correct quotas, 209
  illustrations, 2,000 unique selections) — all pass.
- Aria-label leak sweep re-run across all 209 illustrated questions —
  still 0 leaks (unaffected by this stage, checked anyway).
- CSS brace-balanced (118/118), no duplicate HTML ids.
- Mobile breakpoint (`max-width: 480px`) re-checked against the new type
  scale — still scales down sensibly.

**Not done in this stage, deliberately**: no character/object/scene
assets wired in (that's Stage 4 territory once the layout itself is
approved), no strand-colour accent added to the illustration container
(mentioned as a future step in the Stage 1 README), no changes to any
individual question's content or illustration.

---

## Stage 2B — COMPLETE (True Desktop Layout Redesign)

**Scope discipline confirmed by checksum**: `questions.js`, `config.js`
(aside from the version bump), `supabase-setup.sql`,
`tools/generate-questions.js`, and all 5 asset manifests are byte-for-byte
identical before and after this stage. Only `index.html`, `styles.css`,
and `app.js` changed.

**What changed:**

1. **True two-column desktop layout for the question screen only.** The
   question screen now uses a wide container (`.qcard`, up to 1100px) with
   a CSS grid (`.qlayout`) splitting into a large main panel (illustration/
   question/answers, `.qmain`) and a small secondary hint panel (`.qside`)
   at ≥900px width. Below 900px it stacks into a single column — same
   content, same order, no functionality lost. Every *other* screen
   (welcome, instructions, confidence, complete, independence, report)
   keeps its original narrow, centred card — `.card` was given an explicit
   `max-width: 660px` so widening `.app` didn't widen them too.
2. **Answer cards are now substantially bigger** (62px→84px min-height,
   20px→21px text, 14px→16px corner radius) with a **coloured letter
   badge (A/B/C/D)** per Master Pack C's answer-card examples — blue,
   green, amber, purple. This is presentation only: the same
   `selectAnswer(i)` function, same click handler, same `aria-checked`
   logic, verified directly (see below).
3. **A bottom nav row** (`.qnav`) with Previous / Flag for Review / Next,
   matching the approved reference's layout.
4. **Colour palette, type scale, hint box, 2×2 grid, and encouragement
   removal** all carried over unchanged from Stage 2A.

**One decision flagged, not silently made**: **Previous and Flag for
Review are rendered but intentionally disabled**, not wired to any
behaviour. This check was deliberately built with no back-navigation (PTO
Standards Part 20 — "children move forward through the check," capturing
current thinking rather than allowing improved guessing) and the brief
for this stage was explicit that question logic must not change. Adding
real back-navigation is a genuine behaviour change — it would need its
own design pass (what happens to the currently-shown Maths Tip, the
recorded answer, re-selection) — not something to bundle silently into a
CSS/layout stage. They're present in the layout for visual completeness
against the reference, each with a `title` attribute explaining why
they're inactive. Happy to scope real Previous/Flag functionality as its
own stage if wanted.

**Verified, not asserted:**
- Loads from Question 1, zero console warnings, zero thrown errors.
- All 4 answer badges render with the correct letter and colour.
- Clicking an answer correctly marks only that card `selected` (verified
  with a test harness that actually implements `querySelectorAll`, not a
  stub) and correctly sets `aria-checked` on all four; Next enables.
- Hint starts hidden, toggles correctly, resets to hidden on every new
  question (identical behaviour to Stage 2A, re-verified after the HTML
  restructure).
- All 37 questions render with 0 failures across the full order.
- Full sitting → report → Supabase row shape: 37/37 responses, identical
  11-key shape to before.
- Full standard regression suite (37 questions, correct quotas, 209
  illustrations, 2,000 unique selections) — all pass.
- Aria-label leak sweep re-run across all 209 illustrated questions —
  still 0 leaks.
- CSS brace-balanced (133/133), no duplicate HTML ids.

**A real mistake caught and fixed before it shipped**: an early edit
accidentally deleted the base `.answers { display: grid; ... }` rule while
inserting the new layout CSS around it. Caught by grepping for the rule
immediately after the edit, before any testing — restored before any
validation ran.

---

## Stage 2C — COMPLETE (Final UI Refinement)

**Scope discipline**: `questions.js`, `supabase-setup.sql`,
`tools/generate-questions.js`, and all 5 asset manifests are byte-for-byte
identical before and after this stage (verified by checksum, config.js
excepted since a version bump was explicitly permitted). Only
`index.html`, `styles.css`, `app.js`, `config.js`, and this document
changed.

**The single most important change**: the always-visible 185-tip strand
pool (random tip on every question, described in the brief as "too large
and too frequent") has been **retired from the live hint mechanism**. In
its place, `app.js` now reads the small, curated, skill-specific hint
library that already existed in `assets/hints/manifest.js` — a frozen
asset, **read but never modified**. A question only shows a genuine hint
if its skill has one curated (9 skills, 57 of 360 questions — about 16%,
matching "many questions will not need one"); every other question shows
a calm, quiet fallback line ("No hint needed for this one — you've got
this!", the exact wording from the brief) instead of a fabricated or
repeated tip. Verified directly: 5 known skillIds tested against the
lookup, 3 curated ones returned their exact real hint text, 2 non-curated
ones correctly fell through to the fallback.

**Removed entirely, per the brief**: the "View Hint" toggle button (the
hint is now always visible but its *content* is what's intelligent, not
its visibility); Previous and Flag for Review buttons (only a single,
centred Next button remains — no back-navigation, unchanged from the
established "captures a child's first instinct" principle); the unused
185-entry `TIPS`/`TIP_TYPES` system and `pickMathsTip`/`toggleHint`
functions from `app.js` (app.js shrank from 1163 to 945 lines).

**Visual refinements**: side hint panel narrowed to ~25% width
(`3fr minmax(220px,1fr)`, was a fixed 300px); answer cards enlarged
further (84px min-height, 18px corner radius) with a subtle hover-lift
(`translateY(-2px)`) and a stronger selected-state shadow+lift; the
strand-colour accent that used to sit on the tip box now sits on the
illustration container instead (the deferred Stage 1 idea, now
implemented) — with an important fix: **the illustration container is
now hidden entirely (not shown empty) for the ~40% of questions with no
illustration**, since an empty coloured box would itself be exactly the
kind of decorative clutter this stage asked to remove.

**Two real mistakes caught and fixed before they shipped**: (1) an early
CSS edit accidentally deleted the `.illus svg { max-width... }` sizing
rule while inserting the new border/background styling around it —
caught by grepping immediately after the edit; (2) the assumption that
Question 1 in a test run would show a real hint (because it's usually an
NPV question and NPV has 2 curated skills) turned out wrong for that
specific random sitting — investigated and confirmed it was correct,
quota-based behaviour (which specific NPV skill lands in slot 1 varies),
not a bug, by testing the lookup mechanism directly against known
skillIds rather than trusting one sitting's output.

**Verified, not asserted:**
- Loads from Question 1, zero console warnings, zero thrown errors.
- Hint lookup tested directly against 5 known skillIds (curated and
  non-curated) — all matched correctly.
- Answer selection correctly marks the clicked card (and only that card)
  as selected, using a test harness with genuine `querySelectorAll`
  support, not a stub.
- All 37 questions in a full sitting render with 0 failures; hint
  intelligence distribution (8 real / 29 fallback in one sample sitting)
  is consistent with the curated-skill coverage across strand quotas.
- Full sitting → report → Supabase row shape: 37/37 responses, identical
  11-key shape.
- Full standard regression suite (37 questions, correct quotas, 209
  illustrations, 2,000 unique selections) — all pass.
- Aria-label leak sweep re-run across all 209 illustrated questions —
  still 0 leaks.
- CSS brace-balanced (128/128), no duplicate HTML ids.



