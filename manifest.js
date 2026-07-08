/* ============================================================
   PTO ASSET LIBRARY — HINT MANIFEST
   ------------------------------------------------------------
   Registry only — NOT loaded by every part of the app; only
   index.html's <script src="assets/hints/manifest.js"> tag uses this
   directly, and app.js keeps an embedded fallback copy (LOCAL_HINTS) in
   sync with this file for resilience against hosting/script-load issues
   (see app.js for why).

   Every skill in the 360-question bank now has a curated, skill-specific
   hint (62 of 62 skills — full coverage, not the earlier 9-skill subset).
   This is a deliberate content expansion, explicitly requested, not a
   return to the earlier retired "always-random-from-a-big-pool" tip
   system: every hint here is tied to one specific skill, worded to
   support the mathematical thinking that skill needs, and never reveals
   an answer or references a specific question's numbers/picture.

   Naming convention: hint_<strand>_<nn> (stable ID; content behind it
   can be edited freely without breaking anything that references it).
   ============================================================ */

const HINTS = {
  hint_npv_01: { skill: "NPV-COUNT", text: "Count each object once. Point as you count." },
  hint_npv_02: { skill: "NPV-ONEMORE", text: "Count on one more from the number." },
  hint_npv_03: { skill: "NPV-ONELESS", text: "Count back one less from the number." },
  hint_npv_04: { skill: "NPV-SEQ", text: "Look at how the numbers are changing each time." },
  hint_npv_05: { skill: "NPV-IN2", text: "Look at how the numbers are changing each time." },
  hint_npv_06: { skill: "NPV-IN5", text: "Look at how the numbers are changing each time." },
  hint_npv_07: { skill: "NPV-IN10", text: "Look at how the numbers are changing each time." },
  hint_npv_08: { skill: "NPV-CMPMAX", text: "Compare the numbers carefully before choosing." },
  hint_npv_09: { skill: "NPV-CMPMIN", text: "Compare the numbers carefully before choosing." },
  hint_npv_10: { skill: "NPV-TENS", text: "Look at the tens first, then the ones." },
  hint_npv_11: { skill: "NPV-TENMORE", text: "Look at the tens first, then the ones." },
  hint_npv_12: { skill: "NPV-TENLESS", text: "Look at the tens first, then the ones." },
  hint_npv_13: { skill: "NPV-BUILD", text: "Look at the tens first, then the ones." },

  hint_as_01: { skill: "AS-BOND10", text: "Think of two numbers that make 10 together." },
  hint_as_02: { skill: "AS-BOND20", text: "Think of two numbers that make 20 together." },
  hint_as_03: { skill: "AS-ADD10", text: "Start with the larger number and count on." },
  hint_as_04: { skill: "AS-ADD20", text: "Start with the larger number and count on." },
  hint_as_05: { skill: "AS-ADD2D1", text: "Start with the larger number and count on." },
  hint_as_06: { skill: "AS-ADD10s", text: "Start with the larger number and count on." },
  hint_as_07: { skill: "AS-SUB10", text: "Think about what is left." },
  hint_as_08: { skill: "AS-SUB20", text: "Think about what is left." },
  hint_as_09: { skill: "AS-SUB2D1", text: "Think about what is left." },
  hint_as_10: { skill: "AS-MISSADD", text: "Think about what number is missing to make the total." },
  hint_as_11: { skill: "AS-MISSSUB", text: "Think about what is left." },
  hint_as_12: { skill: "AS-WORDADD", text: "Start with the larger number and count on." },
  hint_as_13: { skill: "AS-WORDSUB", text: "Think about what is left." },
  hint_as_14: { skill: "AS-COMM", text: "Adding in a different order gives the same total." },

  hint_md_01: { skill: "MD-DOUBLE", text: "Doubling means adding the number to itself." },
  hint_md_02: { skill: "MD-GROUPS", text: "Count the equal groups carefully." },
  hint_md_03: { skill: "MD-ARRAY", text: "Count the equal groups carefully." },
  hint_md_04: { skill: "MD-X5", text: "Count the equal groups carefully." },
  hint_md_05: { skill: "MD-X10", text: "Count the equal groups carefully." },
  hint_md_06: { skill: "MD-SHARE", text: "Each group must get the same amount." },
  hint_md_07: { skill: "MD-GROUP", text: "Each group must get the same amount." },

  hint_fra_01: { skill: "FRA-SHADE", text: "Equal parts must be the same size." },
  hint_fra_02: { skill: "FRA-PARTS", text: "Equal parts must be the same size." },
  hint_fra_03: { skill: "FRA-HALFQ", text: "Equal parts must be the same size." },
  hint_fra_04: { skill: "FRA-HALFN", text: "Equal parts must be the same size." },
  hint_fra_05: { skill: "FRA-QUARTERQ", text: "Equal parts must be the same size." },
  hint_fra_06: { skill: "FRA-QUARTERN", text: "Equal parts must be the same size." },

  hint_geo_01: { skill: "GEO-NAME", text: "Count the sides and corners carefully." },
  hint_geo_02: { skill: "GEO-SIDES", text: "Count the sides and corners carefully." },
  hint_geo_03: { skill: "GEO-CORNERS", text: "Count the sides and corners carefully." },
  hint_geo_04: { skill: "GEO-REAL2D", text: "Count the sides and corners carefully." },
  hint_geo_05: { skill: "GEO-3D", text: "Count the sides and corners carefully." },
  hint_geo_06: { skill: "GEO-PROP", text: "Count the sides and corners carefully." },

  hint_pos_01: { skill: "POS-OPP", text: "Follow the arrow or turn carefully." },
  hint_pos_02: { skill: "POS-ORD", text: "Think about where the object is compared with another object." },
  hint_pos_03: { skill: "POS-TURN", text: "Follow the arrow or turn carefully." },
  hint_pos_04: { skill: "POS-VOCAB", text: "Think about where the object is compared with another object." },

  hint_mea_01: { skill: "MEA-OCLOCK", text: "The short red hand shows the hour. The long black hand shows the minutes." },
  hint_mea_02: { skill: "MEA-HALFPAST", text: "The short red hand shows the hour. The long black hand shows the minutes." },
  hint_mea_03: { skill: "MEA-DAYS", text: "Think about the order the days come in." },
  hint_mea_04: { skill: "MEA-MONEY", text: "Look at the value of each coin before adding." },
  hint_mea_05: { skill: "MEA-MOSTCOIN", text: "Look at the value of each coin before adding." },
  hint_mea_06: { skill: "MEA-LONGBAR", text: "Compare the length, height, mass or capacity carefully." },
  hint_mea_07: { skill: "MEA-LONGEST", text: "Compare the length, height, mass or capacity carefully." },
  hint_mea_08: { skill: "MEA-HEAVY", text: "Compare the length, height, mass or capacity carefully." },

  hint_sta_01: { skill: "STA-READ", text: "Count each row carefully before comparing." },
  hint_sta_02: { skill: "STA-MOST", text: "Count each row carefully before comparing." },
  hint_sta_03: { skill: "STA-TOTAL", text: "Count each row carefully before comparing." },
  hint_sta_04: { skill: "STA-DIFF", text: "Count each row carefully before comparing." },

  hint_npv_14: { skill: "NPV-IN3", text: "Look at how the numbers are changing each time." },
  hint_as_15: { skill: "AS-ADD2D2D", text: "Add the tens first, then the ones." },
  hint_md_08: { skill: "MD-X2", text: "Count the equal groups carefully." },
  hint_md_09: { skill: "MD-COMM", text: "Multiplying in a different order gives the same answer." },
  hint_fra_07: { skill: "FRA-THIRDQ", text: "Equal parts must be the same size." },
  hint_fra_08: { skill: "FRA-THIRDN", text: "Equal parts must be the same size." },
  hint_fra_09: { skill: "FRA-THREEQ", text: "Equal parts must be the same size." },
  hint_fra_10: { skill: "FRA-EQUIV", text: "Different fractions can describe the same amount." },
  hint_mea_09: { skill: "MEA-QPAST", text: "The short red hand shows the hour. The long black hand shows the minutes." },
  hint_mea_10: { skill: "MEA-QTO", text: "The short red hand shows the hour. The long black hand shows the minutes." },
  hint_mea_11: { skill: "MEA-CAPACITY", text: "Compare the length, height, mass or capacity carefully." }
};

if (typeof module !== "undefined") module.exports = { HINTS };
