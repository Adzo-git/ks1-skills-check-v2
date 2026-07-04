/* ============================================================
   PTO ASSET LIBRARY — MATHEMATICAL MODELS MANIFEST  (Stage 1)
   ------------------------------------------------------------
   Registry only — not loaded by the live app (the live app already
   calls these functions directly via renderIllustration() in app.js;
   this file does not change that, it documents it).

   ARCHITECTURAL DECISION (from the approved implementation plan):
   mathematical models are NOT image assets that get swapped for final
   artwork. They render specific numeric data per question (a number
   line spanning particular values, a clock at a particular time), which
   a static image cannot do. The existing app.js functions ARE the
   permanent asset for this category. This manifest exists so that:
     (a) coverage against Image Pack 5's 15 model categories is visible
         in one place, and
     (b) any restyling to match the brand-bible palette exactly (a
         later, separate task) has a checklist to work from.

   status: "implemented" = a working renderer exists in app.js today.
           "gap"          = named in Image Pack 5 but no renderer exists.
   ============================================================ */

const MODELS = {
  model_number_line:     { status: "implemented", renderer: "svgNumberline" },
  model_ten_frame:       { status: "gap",         renderer: null }, // NOT yet built — dots/svgDots exist but not a labelled 10-frame grid
  model_part_whole:      { status: "gap",         renderer: null }, // NOT yet built — no part-whole "bond" diagram renderer exists
  model_base10:          { status: "implemented", renderer: "svgBase10" },
  model_bead_string:     { status: "gap",         renderer: null },
  model_bar_model:       { status: "gap",         renderer: null }, // svgBars exists but renders comparative LENGTH bars, not part/part/whole bar models
  model_array:           { status: "implemented", renderer: "svgArray" },
  model_fraction_bar:    { status: "implemented", renderer: "svgFraction" }, // shape param controls bar vs pie
  model_fraction_circle:{ status: "implemented", renderer: "svgFraction" },  // shape:"pie"
  model_pictorial:       { status: "implemented", renderer: "svgDots / svgEmojiGrid" },
  model_2d_shape:        { status: "implemented", renderer: "svgShape" },
  model_3d_shape:        { status: "gap",         renderer: null }, // svgShape is 2D-only; no cube/cuboid/sphere/cylinder/cone/pyramid renderer exists
  model_money:           { status: "implemented", renderer: "svgCoins" },
  model_time:            { status: "implemented", renderer: "svgClock" },
  model_bars_chart:      { status: "implemented", renderer: "svgBars" },
  model_pictogram:       { status: "implemented", renderer: "svgPictogram" },
  model_tally_chart:     { status: "implemented", renderer: "svgTally" },
  model_turns:           { status: "implemented", renderer: "svgTurns" },   // PTO-specific addition, not in Image Pack 5's own list, kept for Position & Direction
  model_arrow:           { status: "implemented", renderer: "svgArrow" }    // PTO-specific addition, same reason
};

if (typeof module !== "undefined") module.exports = { MODELS };
