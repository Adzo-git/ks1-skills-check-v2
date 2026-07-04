/* ============================================================
   PTO ASSET LIBRARY — HINT MANIFEST  (Stage 1 skeleton only)
   ------------------------------------------------------------
   Registry only — NOT loaded by the live app. The live app still uses
   the existing 185-entry TIPS pool in app.js (unchanged this stage).

   This file exists to prove the naming convention and organisation
   style ahead of the real Stage 3 rebuild (which replaces the
   always-visible Maths Tip box with a small optional per-skill hint).
   It is deliberately NOT a full migration — only a handful of example
   entries, chosen because they are already genuinely skill-specific
   (not generic encouragement) and were sharpened in earlier work
   specifically toward this style.

   Naming convention: hint_<strand>_<nn> (stable ID; content behind it
   can be edited freely without breaking anything that references it).

   Rules a hint must satisfy (unchanged from all earlier tip work):
     - maximum two short sentences
     - never reveals the answer
     - never references a number/picture from the specific question
     - specific to the mathematical skill, not generic encouragement
   ============================================================ */

const HINTS = {
  // Number & Place Value
  hint_npv_01: { skill: "NPV-COUNT",    text: "Count each object once." },
  hint_npv_02: { skill: "NPV-TENS",     text: "Start with the tens." },

  // Measurement — Time
  hint_time_01: { skill: "MEA-OCLOCK",   text: "The short hand shows the hour." },
  hint_time_02: { skill: "MEA-HALFPAST", text: "The long hand shows the minutes." },

  // Multiplication & Division
  hint_md_01: { skill: "MD-ARRAY", text: "Count one row first, then add it again for each extra row." },
  hint_md_02: { skill: "MD-GROUPS", text: "Equal groups can help us multiply." },

  // Fractions
  hint_fra_01: { skill: "FRA-SHADE", text: "Check that every part is exactly the same size." },

  // Geometry
  hint_geo_01: { skill: "GEO-SIDES", text: "Count the sides carefully before deciding." },

  // Position & Direction
  hint_pos_01: { skill: "POS-TURN", text: "Picture yourself making the turn before you choose." }

  // ... the remaining ~170+ entries are Stage 3 work, not Stage 1.
  // This skeleton exists to prove the ID convention and organisation
  // style, not to complete the library.
};

if (typeof module !== "undefined") module.exports = { HINTS };
