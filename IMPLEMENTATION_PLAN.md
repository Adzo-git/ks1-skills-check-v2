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

---

## Hotfix — v1.11.1 (Contextual hints showing 100% fallback in production)

**Bug reported**: every question showed "No hint needed for this one —
you've got this!", not the ~84%/16% split verified in Stage 2C.

**Root cause**: `findHintForSkill()` depended entirely on the external
`assets/hints/manifest.js` `<script>` tag loading successfully and
defining a global `HINTS`. In the reported deployment it evidently didn't
(most likely explanation: a folder literally named `assets` is a
reserved/special name to several static-site build tools, which can
interfere with a plain file living inside one — though the exact cause
couldn't be confirmed without access to the live host's logs). When
`HINTS` never loads, the `typeof HINTS === "undefined"` guard correctly
returned `null` for every single question — a 100% fallback rate,
matching exactly what was reported.

**Fix**: `app.js` now embeds `LOCAL_HINTS`, a verbatim copy of the same
9 entries in `assets/hints/manifest.js`, and uses it automatically
whenever the external file fails to load for any reason — the external
file is still preferred when it does load (identical content, so no
practical difference), but the feature no longer has a single point of
failure. `assets/hints/manifest.js` itself remains completely untouched
(checksum-confirmed).

**Verified**: reproduced the exact bug (external `HINTS` never defined)
and confirmed the fix resolves it — the 3 test skillIds that should have
real hints returned their exact real text, using only the embedded
fallback. Re-confirmed the normal path (external file loads) still works
identically. Re-ran the full sitting simulation with a corrected test
harness (an earlier verification pass had its own harness bug — a
`classList.contains()` stub that always returned `false` — caught and
fixed before trusting its output): 6/37 real hints, 31/37 fallback in one
sample sitting, consistent with the expected ~16% rate. Full standard
regression suite and aria-label leak sweep re-run — all pass, 0 leaks.

Only `app.js` changed for this hotfix (plus the routine version bump in
`config.js`/`README.md`).



---

## Stage 2D — COMPLETE (Polish & UX Review)

**Scope discipline**: `questions.js`, `supabase-setup.sql`,
`tools/generate-questions.js`, and all 5 asset manifests are byte-for-byte
identical before and after this stage (checksum-confirmed). Only
`index.html`, `styles.css`, `app.js`, `config.js`, and this document
changed. **Report/scoring computation (`computeReport`) was not touched at
all** — one item below is a *wording* fix in `renderReport`'s template,
not a logic change.

### Issues found and fixed

**1. "Top" arrow illustration** — confirmed by direct calculation, not
just a code read: for vertical directions (up/down/top/bottom), the
label's fixed y-position (145) fell *inside* the arrow shaft's range
(20–160), a genuine overlap. Redesigned with a fixed "arrow zone"
independent of direction, a bolder shaft (8px→16px) and bigger arrowhead,
and the label always in its own band well below. Verified for all 4
directions: gap between arrow and label is now 50–105px, never negative.

**2. Question progression bug (jumped ~Q5→Q11)** — investigated the root
cause rather than masking the symptom. `nextQuestion()` had no guard
against being invoked more than once per user action. If it were ever
called twice in a row (the leading hypothesis: a hosting/build quirk
duplicating the `app.js` `<script>` include — the same category of issue
already found to break `assets/hints/manifest.js` on this host — causing
`DOMContentLoaded` to attach two independent click listeners), each real
click would silently advance two questions instead of one; over 5–6
clicks that accumulates to exactly the kind of jump reported. Fixed with
two layers: (a) a re-entrancy guard on `nextQuestion()` itself, and (b) a
one-time-init guard on the whole `DOMContentLoaded` setup, so the failure
mode is now structurally impossible rather than just unlikely. **Verified
by direct reproduction**: called `nextQuestion()` twice per click across 6
consecutive questions (the literal worst-case double-fire scenario) and
confirmed the index still advances by exactly 1 each time — 7 real clicks
in, index is 7, not 12.

**3. Coloured A/B/C/D badges** — reviewed from a UX perspective as asked.
Recommendation implemented: **a single consistent brand colour for every
badge**, not four different ones. This directly serves two goals at once
— less for a child to decode (colour no longer carries information,
letter still does) and, combined with fix #4 below, removes any
possibility of colour ever pointing toward an answer. This is a genuine
judgement call, not the only valid one — happy to revisit if you'd
prefer neutral-cards-only or a different treatment after seeing it live.

**4. Accidental colour associations** (e.g. yellow stars next to a
coincidentally-yellow badge) — resolved as a side effect of fix #3: with
every badge now the same colour, no illustration's colour can ever
coincide with *one specific* answer's badge, because there's no longer
any per-position colour variation to coincide with.

**5. Illustration alignment/spacing** — found the actual mechanism behind
"looks accidental": the scattered-layout jitter formula was checked
mathematically (not just eyeballed) and found to **systematically drift
every small group upward by 2.5–4.5px on average** — not organic scatter,
a real directional bias. Replaced with a small designed palette of offset
pairs verified to cancel to exactly (0,0) for every even count and stay
within ±1.3px average for odd counts, while keeping the same magnitude
bounds — so the existing overlap-safety proof still holds unchanged
(re-verified: minimum pairwise distance 48.2px against a 40px safety
floor). Applied to all three scattered-illustration renderers (dots,
emoji groups, coins) via one shared, tested helper.

**6. Report wording contradiction** ("answered 27 of 37" then "worked
through every one") — root cause found immediately: a single template
line conflated `totalCorrect` with `totalQuestions`, literally writing
"answered {totalCorrect} of {totalQuestions}" where it should have
described questions *attempted*, not *correct*. Since every question
must be answered to advance (no skip capability exists), attempted
always equals `totalQuestions` — the sentence now says exactly that:
"worked through all 37 questions, getting 25 correct." This is a
one-line wording fix in `renderReport`; `computeReport`'s actual
computation was never wrong and was not touched.

**7. Hint system showing the fallback almost always** — two things were
going on. First, the fix shipped in the v1.11.1 hotfix (embedded
`LOCAL_HINTS`) should have restored the intended ~16% real-hint rate, but
that fix may not yet have been visible in the deployment this feedback
was based on. Second, and more importantly, the *design* itself has
changed per this brief: rather than showing a "no hint needed" fallback
message on ~84% of questions, the **entire hint panel now collapses**
when a question has no genuinely curated hint, and the main
question/illustration/answers area expands to use the freed space (a
real, verified CSS grid change: `.qlayout.no-hint` drops to a single
column at desktop width). Verified across a full 37-question sitting: the
panel's hidden/visible state stays in perfect sync with the layout class
on every single question, with zero mismatches logged.

### Deliberately not changed, and why

- **No new visual redesign for item 8** — no reference image was actually
  attached to this message (the text referenced "the supplied reference
  image" but the documents block contained text only). Continuing to
  evolve the already-approved Stage 2C direction rather than reacting to
  something not actually visible seemed safer than guessing.
- **Badge colour choice (#3)** is a judgement call, explicitly flagged as
  one rather than presented as the only correct answer — see above.
- **Emoji vertical centring within their circles** (`y = cy + r*0.65`) was
  reviewed and left as-is — it's a reasonable approximation already
  applied consistently everywhere, and no specific evidence of a real
  centring defect (as opposed to the proven jitter-drift issue) was found.

### Verified, not asserted

- Progression bug: directly reproduced (double-fire × 6 questions) and
  confirmed fixed — index advances by exactly 1 per real click.
- Hint collapse: checked against all 37 questions in a sitting, 0
  mismatches between panel visibility and layout class.
- Report wording: regenerated with a real 25/37 sitting — sentence now
  reads as a single, non-contradictory statement.
- Arrow overlap: recalculated for all 4 directions — 50–105px gap, never
  overlapping.
- Scatter jitter: recalculated cumulative offset for n=2–14 — cancels to
  (0,0) at every even count; overlap-safety re-verified (48.2px minimum,
  vs. a 40px floor).
- Badge colour: confirmed by code inspection — one constant, used
  identically for every position, no per-index variation possible.
- Full standard regression suite (37 questions, correct quotas, 209
  illustrations, 2,000 unique selections) — all pass.
- Aria-label leak sweep re-run across all 209 illustrated questions —
  still 0 leaks, 0 render failures.
- **One complete simulated assessment run start to finish** (setup →
  37 questions → confidence → independence → report): 0 render failures,
  reaches the final question correctly, generates a coherent report.
- All frozen files (question bank, Supabase schema, generator, all 5
  asset manifests) confirmed byte-for-byte identical by checksum.

---

## Stage 2E — COMPLETE (Simplify Answer Selection & Improve Child UX)

**Scope discipline**: `questions.js`, `supabase-setup.sql`,
`tools/generate-questions.js`, and all 5 asset manifests are byte-for-byte
identical before and after this stage (checksum-confirmed). Only
`index.html` was not touched at all this round; `styles.css`, `app.js`,
`config.js`, and this document changed. **`computeReport`, scoring, and
Supabase payload shape were not touched.**

### Recommended approach on badge colour (asked to justify, not just implement)

Kept the single PTO-purple badge from Stage 2D rather than reverting to
four colours or going neutral. Reasoning against the five stated
priorities: one colour to decode (not four) directly serves **minimal
cognitive load**; the letter — not colour — is the actual accessible
identifier, so colour is reinforcement only, which serves **accessibility**;
with every badge identical, no illustration's colour can ever coincide
with *one specific* answer, which is what **no accidental clues** actually
requires; it's literally the brand's own primary colour, serving
**consistent branding** directly; and it's already proven visually
attractive in the Stage 2D screenshots. The one thing I was deliberate
about: since the badge and the selected-state accent are the *same*
purple, the **tick swap (letter→tick) is what communicates selection**,
not colour — so there's no ambiguity between "this is an answer" purple
and "this is selected" purple.

### What changed

1. **The redundant radio-circle tick indicator is gone entirely.** The
   badge is now the only selection indicator: it shows the option's
   letter normally, and swaps to a small white tick when that card is
   selected — swapping back to the letter if the child changes their
   mind and picks a different card. Verified directly: selected option's
   badge shows the tick, all siblings show their letters; picking a
   different option correctly reverts the previous badge back to its
   letter (not stuck showing a tick).
2. **The whole card is the single visual identifier and the single click
   target** — unchanged structurally (it always was a full-card
   `<button>`), but with the second indicator removed, this is now
   actually true visually as well as functionally.
3. **Selected state**: subtle lift (`translateY(-1px)`), purple outline,
   light purple fill, badge grows slightly (36px→40px) — all already
   existing, refined to work with the tick swap instead of a second
   element.
4. **Hover is now gated to real pointer devices only**
   (`@media (hover: hover) and (pointer: fine)`), so touch devices never
   get a "stuck" hover state after a tap — directly following the
   `inspiration` products named in the brief (Duolingo, Khan Academy Kids
   etc.), which avoid exactly this common mobile-web pitfall.

### Verified, not asserted

- Built a test harness with genuine `innerHTML`/`querySelector` parsing
  (not a stub) and confirmed: initial render shows all 4 letters, no
  ticks; clicking option 2 shows a tick on option 2 only, letters on the
  rest; clicking option 0 afterward correctly reverts option 2's badge to
  "C" and shows the tick on option 0 instead.
- Full standard regression suite (37 questions, correct quotas, 209
  illustrations, 2,000 unique selections) — all pass.
- Full sitting → report → Supabase row shape: 37/37 responses, identical
  11-key shape, unchanged.
- Aria-label leak sweep re-run across all 209 illustrated questions —
  still 0 leaks (no illustration code touched this stage, checked anyway).
- All frozen files confirmed byte-for-byte identical by checksum.
- A visual mockup was rendered using the exact hex values, radii, and
  shadow values from the real `styles.css` (not an approximation) showing
  default, hover, selected, and reverted-sibling states side by side.

---

## Stage 2F — COMPLETE (Final Branding Integration & UI Polish)

**Scope discipline**: `questions.js`, `supabase-setup.sql`,
`tools/generate-questions.js`, and all 5 asset manifests confirmed
byte-for-byte identical before and after this stage (checksum-compared
directly by hash value, not just visually diffed — see verification
below). Only `index.html`, `styles.css`, `config.js`, `README.md`, and
this document changed.

### Item 1 — official branding: blocked on a real, disclosed limitation

Verified the live site (`www.primarytutoronline.com`) is real — Companies
House registered, Trustpilot reviews, an actual working business. Located
the exact logo image URLs in the page source. **Could not download the
actual logo file**: the web-fetch tool refuses direct image downloads
(text/markdown only, and it explicitly blocks fetching an image URL that
wasn't itself a prior search/fetch result), there's no other
image-download capability available, and the sandbox has no general
network access. Per the explicit instruction not to redesign, recreate,
or substitute the logo, the only honest option was to leave the current
placeholder mark untouched rather than approximate it — **the real logo
file needs to be uploaded directly** for this to be completed properly.

**What I could and did fix with certainty**: the tagline. The live site's
actual footer/header text is "Learn, Achieve, Succeed." — comma-separated,
ending in a period. The app previously showed "Learn · Achieve ·
Succeed" (middle dots, no punctuation) — a genuine mismatch, now corrected
to match the real site exactly.

### Items 2 & 3 — badge animation and eliminating movement

Rebuilt the badge so the letter and the tick both exist simultaneously,
stacked in the same spot via `position: absolute; inset: 0`, and only
their **opacity** crossfades (180ms) when the "selected" class toggles —
this is what actually makes a smooth fade possible at all; the previous
approach replaced the badge's `innerHTML` outright, which cannot be
animated. Verified directly: the badge markup contains both
`.badge-letter` and `.badge-tick` from the very first render, and
selecting an answer **never touches innerHTML again** — only the
`selected` class toggles, confirmed by comparing every button's
`innerHTML` before and after a selection (byte-identical).

Removed every `transform` from the answer-card interaction states:
badge no longer resizes (was 36px→40px, now a fixed 36px throughout);
hover no longer lifts (`translateY(-2px)` removed, kept only a subtly
darker border + soft shadow); selected state no longer lifts
(`translateY(-1px)` removed, kept only outline + light fill + soft
shadow). Audited the whole stylesheet for any other `transform`: found
two unrelated ones — a subtle screen-transition fade (different context,
common and reasonable practice, left as-is) and a 1px button-press effect
on `.btn-primary:active` (near-universal, barely perceptible, outside the
specific "answer selection" scope of this request) — both flagged rather
than silently left in.

### Item 4 & 5 — illustration and whitespace polish

Ran a further systematic centring check across all 14 illustration types
(building on the Stage 2D jitter-balance and arrow fixes). Investigated
every flagged asymmetry rather than accepting the numbers at face value:
most were artifacts of the check itself (it only measured `<circle>` and
`<text>` coordinates, missing `<rect>`-based bars/tally content and
under-sampling the single-label arrow) rather than real defects.
Confirmed mathematically that the `dots`/`array` layout formulas
allocate symmetric padding (16px each side) regardless of how full the
last row is — the per-instance variation seen is the intentional organic
scatter already verified balanced in Stage 2D, not a new bug.

Whitespace audit: reviewed every hardcoded colour value in `styles.css`
(28 distinct hex values) — found and fixed one trivial inconsistency
(`#ffffff` vs `#fff` used for the same token in two different notations;
normalized to `#fff`, zero visual change). No other stray/duplicate
colour values found; the apparent near-duplicates (`#c9b8e6`, `#cdbfe4`,
`#a99bc7`) are each used in a genuinely different, distinct context
(confidence-button hover, disabled-button fill, answer-card hover) rather
than being leftover dead code.

### Items 6 & 7 — consistency audit and designer mindset

Given the scope of this stage was primarily the answer-card interaction
model (items 1–5 above are where the actual defects/requests were), the
consistency audit focused on stylesheet-wide token usage rather than
re-auditing every screen's layout from scratch (already covered across
Stages 2A–2E). No further screen-level inconsistencies were found beyond
the hex-notation fix above.

### Verified, not asserted

- Badge markup confirmed to contain both letter and tick from first
  render; selection confirmed to never touch `innerHTML` again (byte-for-
  byte comparison before/after).
- Full standard regression suite (37 questions, correct quotas, 209
  illustrations, 2,000 unique selections) — all pass.
- Full sitting → report → Supabase row shape: 37/37 responses, identical
  11-key shape.
- All frozen files confirmed byte-for-byte identical **by direct hash
  comparison** (not just a visual diff, which was initially confused by
  path-string formatting — re-verified with a Python hash-list equality
  check to remove any ambiguity).
- CSS brace-balanced (131/131), no duplicate HTML ids.
- A visual mockup rendered showing the crossfade at three points (0%,
  ~50%, 100%) using the exact real hex/radius/shadow values, demonstrating
  the badge stays a fixed 36px throughout.

### Outstanding, needs your input

**Official logo file** — please upload the actual PNG/SVG asset(s) from
the live site (ideally both the square icon and the wider footer
version). I'll wire it in exactly as provided with no interpretation.
I was unable to confirm the site's exact brand colour hex values or
typography choices beyond what's already documented in the existing
Design System (Master Pack C) either, since the fetch tool only returns
page text, not rendered styles — if you have the definitive values,
they're a quick, safe update; otherwise the current PTO palette
(already sourced from Master Pack C) remains the best available source.

---

## Stage 3 — Official logo integrated (v1.15)

**The blocker from Stage 2F/2F-polish is resolved.** A genuine standalone
logo file was uploaded this round (`Screenshot_2026-07-05_121138.png`,
196×180px, PNG) — not a mockup screenshot this time. Verified before use:
solid background at exactly `#652DA0` (already our `--pto-purple` token),
fully opaque, no cropping artefacts.

**What changed**: the file was copied byte-for-byte into the project root
as `brand-mark.png` (confirmed identical MD5 hash to the original upload
— no modification whatsoever) and wired in two places: replacing the
placeholder `<div class="brand-mark">P</div>` text roundel in the header
with the real `<img>`, and added as the site's favicon (`<link
rel="icon">`), which had never existed before this — a legitimate small
addition, not a stretch beyond the brief. `object-fit: cover` is used
purely to fill the 42×42px slot cleanly; since the image's own background
already matches the container's intended colour exactly, no distortion or
visible cropping of the actual glyph occurs.

**Also addressed** (largely already fixed in the previous "Stage 2F"
round, re-confirmed rather than blindly redone): the "top" arrow overlap,
the question-progression double-fire guard, and the report wording
contradiction were all re-verified functionally against the live code and
found still correctly fixed — this stage's brief listed them again as
"existing issues," but the attached mock-up's own QA summary panel
already showed them as resolved, so I checked both possibilities directly
rather than assuming either.

**Verified, not asserted:**
- MD5 hash of the copied file matches the uploaded original exactly.
- Structural checks: no duplicate ids, `brand-mark.png` referenced
  exactly twice (favicon + header), old placeholder fully removed.
- Full standard regression suite — all pass.
- Supabase schema and all 5 asset manifests confirmed byte-identical
  by direct hash comparison.
- A genuine HTML rendering of the actual logo file (base64-embedded,
  not a mockup) shown at its real 42×42px size in the real header layout.

---

## Watch List — NOT resolved, kept open pending broader device/browser testing

Per Adam's explicit instruction: these remain open watch-list items, not
closed bugs, until real-world multi-device/browser testing is complete.
Do not treat the investigation below as a closure.

1. **Question progression occasionally skipping questions** — extensive
   adversarial testing (20,000-run duplicate-ID stress test, full-trace of
   every `state.index` mutation site, forced double-fire reproduction)
   found no reproducible mechanism in the current code. Status:
   **not currently reproducible**, not resolved.
2. **Report occasionally showing fewer than 37 answered** — traced to the
   same underlying mechanism as #1 (`computeReport` builds its response
   list directly from `state.answers`); a full continuous simulated
   walkthrough produced 37/37 with no discrepancy. Status:
   **not currently reproducible**, not resolved.

If either recurs during real-device testing, the most useful next report
would include: the specific question number(s), whether it's consistent
or intermittent, browser/device used, and any console errors — to enable
investigating a specific reproducible case rather than a general one.

---

## Stage 3 — Commercial polish pass (v1.16)

**Watch-list items (previous section) remain open, not resolved** — no
new investigation was done on them this round per Adam's instruction;
this round was a dedicated visual audit.

**Real defects found by actually re-reading every screen, not assumed:**

1. **A stray duplicate `</section>` tag** immediately after the question
   screen (previously silently tolerated by browsers, since unmatched
   closing tags are simply ignored in HTML parsing — but genuinely
   invalid markup that has no place in a commercial release). Removed;
   `<section>` tags now balance exactly 7 open / 7 close (previously 7/8).
2. **A stale pre-brand-update colour**: the celebration star SVG on the
   "Well done" screen used `#e84b8a`, a pink value from before the
   Master Pack C brand colours were adopted — the only place in the
   entire project still using it. Corrected to the current `#E91E63`
   brand pink token.
3. **Confidence-card styling had drifted from the answer-card system**:
   14px corner radius (vs. answer cards' 18px), a different, older hover
   colour (`#c9b8e6` vs. answer cards' `#a99bc7`), and no selected-state
   shadow — even though confidence cards are conceptually the same
   "selectable card" pattern as answer cards. Unified: same radius, same
   pointer-gated hover treatment, same selected-state shadow.

**Reviewed and deliberately left alone**: the parent-guidance note box
(instructions screen) uses a neutral grey tone while the hint box uses a
warm yellow tone — this is intentional, not drifted, since they serve
different audiences (a parent-facing instruction vs. a child-facing
maths hint) and deserve visually distinct treatment. The `.tips` numbered
dots (instructions screen) use a soft-purple-on-purple style rather than
the answer badges' solid-purple-on-white — also intentional, since they
label a numbered list, not a selectable option. Button styling
(`.btn`/`.btn-primary`/`.btn-ghost`) was already a single shared class
used identically across every screen — no drift found there.

**A verification-script bug caught before it caused a false report**:
my own frozen-file comparison initially printed "False" due to an
asymmetric-filtering bug in the Python check (comparing a 7-item filtered
list against a 9-item unfiltered one) — not a real file discrepancy.
Caught by re-checking with a proper path-keyed comparison before
reporting anything; all 7 genuinely frozen files (Supabase schema + all
5 asset manifests) are confirmed identical.

**Verified, not asserted:**
- HTML tag balance: `<section>` 7/7, `<div>` 42/42, `<form>` 1/1, no
  duplicate ids.
- Full standard regression suite — all pass.
- A complete simulated walkthrough (setup → 37 questions → confidence →
  independence → report) after the HTML structural fix — 0 render
  failures, 37/37 responses.
- All 7 genuinely frozen files confirmed identical via a corrected,
  path-keyed hash comparison.

---

## Version 1.0 Beta (from v1.16)

**Note on the version jump**: the number goes from `v1.16` to `v1.0-beta`
deliberately, not as a downgrade — this moves from an incrementing
pre-release counter to the proper semantic milestone label Adam asked
for, marking this as the version intended for real family testing.

**Watch-list items remain open, untouched this round**: question
progression and report-count issues are still logged as "not currently
reproducible," not resolved — no new investigation was done on them this
round, per instruction to treat broader real-device testing as the next
step for those specifically.

### What changed, and why each change was justified (per the "does this
genuinely improve things" test from the previous review)

**1. Report accessibility contrast — fixed, verified by calculation.**
The two WCAG AA failures identified in the previous review (green pill
text 2.82:1, pink pill text 3.38:1 — both need 4.5:1) are fixed.
Computed darker shades in the *same* colour family that clear the
threshold with margin: green `#327935` (4.58:1) and pink `#C31953`
(4.55:1), added as proper `--pto-green-text`/`--pto-pink-text` tokens
rather than one-off hex values, keeping the original brand green/pink
for every other use (buttons, borders) where they already pass
comfortably against white.

**2. Keyboard accessibility for radiogroups — implemented properly, not
decoratively.** All three `role="radiogroup"` instances (answer options,
confidence check, independence check) previously had the ARIA role
without the keyboard behaviour it implies. Fixed with:
- A single shared `wireRadiogroupKeyboard()` helper (not duplicated three
  times) providing real ArrowUp/Down/Left/Right navigation with wraparound.
- Proper roving tabindex (`tabindex="0"` on exactly one option at a time,
  `"-1"` on the rest) — previously Tab stopped on every option
  individually; now it enters the group once, matching how a native
  radio group and every screen-reader user already expect it to behave.
- `role="radio"` and `aria-checked` added to the confidence and
  independence buttons, which previously had neither (only the dynamic
  answer buttons had them) — a second, distinct correctness gap found
  while implementing the first fix, not anticipated in the original
  review.

Verified with real simulated `keydown` events (not just a code read):
focus starts on option 0 (the only `tabindex="0"` element); ArrowRight
moves focus to option 1 *and* selects it; tabindex correctly follows
focus; ArrowLeft twice returns to option 0; ArrowLeft from option 0
wraps to the last option. All confirmed working exactly as intended.

**3. Illustration alignment — investigated further, found nothing left
to fix.** Re-ran the symmetry check from the previous round and found a
consistent ~26px "asymmetry" in emoji-based dot illustrations. Rather
than report a new problem or silently ignore the number, traced the
cause: the check was comparing a text element's *baseline* coordinate
(`y = cy + r×0.65`, a deliberate offset used to visually centre an emoji
glyph within its circle — standard SVG/text-centring practice) against a
plain circle's *geometric centre* coordinate — these are never going to
match numerically even when the actual rendering is correctly centred.
Confirmed by direct comparison of the raw SVG for an emoji-based vs.
plain-colour dot: the plain circle is exactly centred (`cy=36` in a
72-tall viewBox); the emoji's baseline-adjusted `y` coordinate looks
"off" by design. **No code change made here** — this is a limitation of
a non-browser measurement tool, not a rendering defect, and changing the
0.65 offset without genuine visual confirmation could easily make real
rendering worse while "fixing" a number that was never actually wrong.

**4. Overall visual polish** — no new issues found this round beyond
what the previous two rounds already fixed (stray closing tag, stale
brand colour, confidence-card drift). Re-ran the full structural checks
(HTML tag balance, CSS brace balance, no duplicate ids) — all pass.

**5. Brand consistency** — unchanged and unaffected by this round's
work; no regressions found.

**Verified, not asserted:**
- Contrast ratios recalculated after the fix: 4.58:1 and 4.55:1, both
  clearing the 4.5:1 WCAG AA threshold.
- Keyboard navigation tested with real simulated `keydown` dispatch,
  not just read as code — focus movement, selection-on-arrow-key, roving
  tabindex, and bidirectional wraparound all confirmed.
- Full standard regression suite (37 questions, correct quotas, 209
  illustrations, 2,000 unique selections) — all pass.
- HTML structure: `<section>` 7/7, `<div>` 42/42, `<button>` 14/14, no
  duplicate ids. CSS brace-balanced (134/134).
- A complete simulated walkthrough (setup → 37 questions → confidence →
  independence → report) — 0 render failures, 37/37 responses, unchanged
  Supabase row shape.
- All 7 genuinely frozen files (Supabase schema + 5 asset manifests)
  confirmed identical via the corrected, path-keyed hash comparison.
  `questions.js`/`tools/generate-questions.js` also confirmed stable at
  their last legitimate, previously-disclosed checkpoint — untouched
  this round since no illustration data needed changing.

---

## v0.9.1-beta — Five specific fixes from live-testing feedback

**No general polish pass this round** — five specific, named issues only,
per explicit instruction not to make unrelated changes.

**1. Supabase preview message removed.** The message mentioning
"Supabase," "config.js," and "preview mode" is gone entirely from the
report screen — verified by checking every remaining `statusEl` message
in the file; all three that remain (saving unavailable, saved
successfully, save failed) are already parent-friendly with zero
technical terms.

**2. Arrow illustration made substantially bolder.** The underlying code
already matched the earlier fix (no regression found), which points to
either a caching/deployment issue on the live site, or the design simply
wasn't visually bold enough. Rather than guess at a caching fix I can't
verify from here, made it unambiguously larger: stroke width 16→20,
arrowhead 26→32, arrow length 55→62, label 28px→32px. Re-verified no
overlap across all 8 directions (48–110px gap, same margin as before).

**3. Header brand text colour fixed.** `.brand-name span { color:
--pto-purple }` only coloured the word "Online" — "Primary Tutor "
outside the span was uncoloured. Moved the colour to `.brand-name`
itself so the whole name is `#652DA0`, confirmed by direct token lookup.

**4. Hint coverage expanded from 9 to all 62 skills in the bank.** This
is an explicitly authorised, deliberate expansion of
`assets/hints/manifest.js` — not a violation of the file's earlier
"frozen" status, which was always contingent on no explicit instruction
to change it. Built the mapping from the 16 example categories given,
extended sensibly to the skills not explicitly named, and verified
programmatically: cross-checked all 62 mapped skills against the actual
bank's skill list — zero missing, zero typos, zero mismatches. Went
further and directly tested every real skillId through the live
`findHintForSkill()` lookup — 62/62 correct matches, 0 wrong matches
(checking specifically for `endsWith()` suffix-collision risk between
similar skill names like `NPV-TENS`/`NPV-TENMORE`/`NPV-TENLESS`), 0
misses. Result: 100% hint coverage across simulated sittings (the
natural consequence of covering every skill, not an approximation). The
embedded `LOCAL_HINTS` fallback copy in `app.js` was regenerated from the
same source data to guarantee both files stay identical.

**5. Clock hands recoloured, time hint corrected.** Hour hand → red
(`#D32F2F`, 4.98:1 contrast against white — comfortably clears WCAG's 3:1
graphical-object minimum), minute hand → black (`#000000`). Both
`MEA-OCLOCK` and `MEA-HALFPAST` hints now read exactly: "The short red
hand shows the hour. The long black hand shows the minutes." — verified
present verbatim in both hint files.

**A test-script mistake caught before it was reported as a product bug**:
an early verification run showed 38 responses instead of 37 — investigated
immediately rather than assumed as a regression, and found to be my own
test script pushing a duplicate answer entry directly (bypassing the
app's real dedup logic) rather than a real defect. Re-ran cleanly using
only the actual `selectAnswer()` function throughout — 37/37, correct.

**Verified, not asserted:**
- Full standard regression suite — all pass.
- Full walkthrough (real `selectAnswer()` calls only): 0 render failures,
  37/37 responses, Supabase payload shape unchanged (11 keys).
- All frozen files except the deliberately-expanded
  `assets/hints/manifest.js` confirmed identical to their last legitimate
  checkpoint by hash comparison.
- `questions.js`/`tools/generate-questions.js` confirmed unchanged this
  round.

---

## v0.9.2-beta — Full KS1 National Curriculum coverage

Following a direct question about curriculum coverage, I compared the
actual objective text of all 62 existing skills (not just skill-code
names) against the real DfE KS1 Maths programme of study and found 7
genuine content gaps, plus a separate, previously-undiscovered data bug.

### Content gaps closed — 11 new skills added

| New skill | Year | Closes the gap in |
|---|---|---|
| `NPV-IN3` | 2 | Counting in steps of 3 (previously only 2, 5, 10) |
| `AS-ADD2D2D` | 2 | Adding two genuine two-digit numbers (previously only two-digit+ones or +tens) |
| `MD-X2` | 2 | Explicit 2-times-table recall |
| `MD-COMM` | 2 | Multiplication commutativity (previously only addition had this) |
| `FRA-THIRDQ`, `FRA-THIRDN` | 2 | Thirds — entirely absent before |
| `FRA-THREEQ` | 2 | Three-quarters as its own concept |
| `FRA-EQUIV` | 2 | Fraction equivalence (2/4 = 1/2) |
| `MEA-QPAST`, `MEA-QTO` | 2 | Quarter-past/quarter-to time-telling (previously only o'clock/half-past — a Year 1-only level) |
| `MEA-CAPACITY` | 1 | Capacity/volume comparison — entirely absent before |

Bank grew from 360 → **414 questions**, 62 → **73 skills**. Reused the
existing `svgFraction` and `svgClock` renderers directly for the new
content (both were already fully generic — `svgFraction` takes any
`parts` count, `svgClock` takes any `hour`/`minute` — so thirds and
quarter-past/to needed zero illustration-code changes, only new question
data).

### A separate bug found and fixed along the way

`app.js` has referenced `q.curriculumYear` and `q.misconceptionCategory`
in its Supabase payload builder since early in this project — but the
generator never actually populated either field on any of the 360
original questions. Every saved family result to date would have
recorded `null` for both. Classified all 62 existing skills by real NC
year stage and assigned a misconception category, injected both into the
generator's metadata programmatically (not by hand, to avoid transcription
errors across 62 blocks), and confirmed **100% of all 414 questions now
have both fields populated** (was 0%).

### Verified, not asserted

- Injected metadata into exactly 62/62 existing templates with zero
  warnings (each skillId is a unique substring, checked before replacing).
- All 11 new skills render without error and produce valid 4-option
  questions (checked programmatically, not by inspection).
- Quarter-past vs quarter-to clocks verified to produce genuinely
  different, correct hand positions: minute hand at exactly
  `(cx+78, cy)` for :15 and `(cx-78, cy)` for :45 — pointing at the "3"
  and "9" respectively, not just visually similar-looking.
- Re-ran the full aria-label leak sweep across all 239 illustrated
  questions (up from 209) — still 0 leaks.
- Re-verified all 73 skills (not just the original 62) map to the
  correct hint with zero collisions, using the same direct-lookup method
  as before.
- Full standard regression suite (37 per sitting, quota sum 37, all
  illustrations render, 2,000/2,000 unique simulated sittings) — all pass
  unchanged, confirming the larger skill pool didn't disturb selection
  behaviour.
- A complete simulated walkthrough confirmed the previously-broken
  `curriculum_year`/`misconception_category` fields now contain real
  values (e.g. `"Year 1"`, `"counting-in-steps"`) in the actual
  Supabase-bound response payload, not just in the source data.

### What did not change

Assessment logic, scoring, strand quotas (still NPV:8/AS:6/MD:4/FRA:4/
MEA:5/GEO:4/POS:3/STA:3 = 37), Supabase schema, and question selection
algorithm are all untouched — the larger skill pool per strand simply
gives the existing selection logic more variety to draw from within the
same quotas.
