/* ============================================================
   PTO KS1 MATHS — QUESTION BANK GENERATOR (offline authoring tool)
   ------------------------------------------------------------
   This is NOT part of the deployed website. It runs once with Node
   to author a validated, static question bank and write questions.js.
   The website only ever loads the produced questions.js (plain data).

   Every question is built to the PTO Question Writing Standards:
     - one question, one skill
     - short, age-appropriate wording
     - every distractor is a real misconception (where numeric)
   ============================================================ */

const fs = require("fs");

/* ---- Curriculum strands (plain-English names, tips for the report) ---- */
const STRANDS = {
  NPV: { name: "Number & Place Value",
    covers: "Counting, comparing numbers, and understanding tens and ones.",
    homeTip: "Count everyday things together — stairs, buttons, pasta pieces — and ask “what’s one more?” and “what’s one less?”" },
  AS: { name: "Addition & Subtraction",
    covers: "Adding and taking away numbers up to 20 and beyond.",
    homeTip: "Practise number bonds to 10 with fingers or small toys: “how many more do we need to make 10?”" },
  MD: { name: "Multiplication & Division",
    covers: "Counting in groups, doubling, arrays, and sharing equally.",
    homeTip: "Count in 2s, 5s and 10s while walking, share snacks equally, and try doubling small amounts." },
  FRA: { name: "Fractions",
    covers: "Finding half and a quarter of a shape or a group of objects.",
    homeTip: "Share things equally: “let’s split these 8 grapes so we each get half,” or cut toast into quarters." },
  MEA: { name: "Measurement",
    covers: "Money, telling the time, length, mass and days of the week.",
    homeTip: "Play shops with real coins, spot “o’clock” and “half past” on a clock, and compare which objects are longer or heavier." },
  GEO: { name: "Geometry",
    covers: "Recognising 2D and 3D shapes and their sides and corners.",
    homeTip: "Go on a shape hunt around the house — “how many sides does the window have?” and “what shape is this tin?”" },
  POS: { name: "Position & Direction",
    covers: "Describing where things are, and half and quarter turns.",
    homeTip: "Play direction games — “take two steps forward, now turn right” — and use words like left, right, above and below." },
  STA: { name: "Statistics",
    covers: "Reading simple pictograms and charts and comparing amounts.",
    homeTip: "Sort toys or snacks into groups, line them up, and ask “which has the most?” and “how many more?”" }
};

/* ---- helpers ---- */
const uniqNums = (arr) => [...new Set(arr)];

// Build a 4-option question. Correct goes first; app shuffles per session.
// Numeric shortfalls are filled with near-value fillers so we always get 4
// distinct options with no distractor equal to the correct answer.
function finalize(correct, distractors) {
  const opts = [correct];
  for (const d of distractors) {
    if (d === correct) continue;
    if (opts.includes(d)) continue;
    opts.push(d);
    if (opts.length === 4) break;
  }
  if (opts.length < 4 && typeof correct === "number") {
    const fillers = [correct + 1, correct - 1, correct + 2, correct - 2, correct + 10, correct + 5]
      .filter(n => n >= 0);
    for (const f of fillers) {
      if (!opts.includes(f)) opts.push(f);
      if (opts.length === 4) break;
    }
  }
  if (opts.length !== 4) throw new Error("Could not build 4 options for correct=" + correct + " d=" + distractors);
  return { options: opts, correctIndex: 0 };
}

const templates = [];
function T(meta, instances) { templates.push({ meta, instances }); }

/* =========================================================
   NUMBER & PLACE VALUE
   ========================================================= */
T({ strand:"NPV", skillId:"MAT-KS1-NPV-COUNT", curriculumYear:"Year 1", misconceptionCategory:"counting-errors", subtopic:"Counting objects",
    objective:"Count a set of objects reliably", difficulty:"Foundation", type:"Recall",
    teacherNote:"Encourage pointing to each object once." },
  [3,4,5,6,7,8,9,10,12,14].map((n, i) => {
    // Rotate through familiar KS1 objects so counting feels concrete and
    // varied rather than always "counters" on a plain purple dot.
    const objects = [
      {name:"toy cars", emoji:"🚗"}, {name:"buses", emoji:"🚌"}, {name:"apples", emoji:"🍎"},
      {name:"pencils", emoji:"✏️"}, {name:"books", emoji:"📚"}, {name:"flowers", emoji:"🌸"},
      {name:"footballs", emoji:"⚽"}, {name:"sweets", emoji:"🍬"}
    ];
    const obj = objects[i % objects.length];
    return {
      text:`How many ${obj.name} can you see?`,
      // ariaLabel deliberately omits the count — for a "how many can you
      // see" question the count IS the answer, so it must never be spoken.
      illustration:{type:"dots", count:n, emoji:obj.emoji, ariaLabel:`A group of ${obj.name} to count`},
      correct:n, distractors:[n-1, n+1, n+2],
      explanation:`There are ${n} ${obj.name}. Pointing to each one as you count helps you not miss any.`,
      misconception:"Miscounts by skipping or double-counting an object." };
  }));

T({ strand:"NPV", skillId:"MAT-KS1-NPV-ONEMORE", curriculumYear:"Year 1", misconceptionCategory:"counting-sequence", subtopic:"One more",
    objective:"Find one more than a number", difficulty:"Foundation", type:"Understanding" },
  [5,7,9,11,13,14,16,18].map(n => ({
    text:`What is one more than ${n}?`,
    illustration:{type:"numberline", start:n-2, end:n+2, highlight:[n], question:n+1},
    correct:n+1, distractors:[n-1, n, n+2],
    explanation:`One more than ${n} is ${n+1}. Count on by one.`,
    misconception:"Counts back instead of on, or does not change the number." })));

T({ strand:"NPV", skillId:"MAT-KS1-NPV-ONELESS", curriculumYear:"Year 1", misconceptionCategory:"counting-sequence", subtopic:"One less",
    objective:"Find one less than a number", difficulty:"Foundation", type:"Understanding" },
  [6,8,10,12,15,17,19,20].map(n => ({
    text:`What is one less than ${n}?`,
    illustration:{type:"numberline", start:n-2, end:n+2, highlight:[n], question:n-1},
    correct:n-1, distractors:[n+1, n, n-2],
    explanation:`One less than ${n} is ${n-1}. Count back by one.`,
    misconception:"Counts on instead of back." })));

T({ strand:"NPV", skillId:"MAT-KS1-NPV-TENMORE", curriculumYear:"Year 2", misconceptionCategory:"place-value", subtopic:"Ten more",
    objective:"Find ten more than a two-digit number", difficulty:"Secure", type:"Understanding",
    teacherNote:"Only the tens digit changes." },
  [13,24,35,42,56,61,73].map(n => ({
    text:`What is ten more than ${n}?`,
    illustration:{type:"base10", tens:Math.floor(n/10), ones:n%10},
    correct:n+10, distractors:[n+1, n-10, n+20],
    explanation:`Ten more than ${n} is ${n+10}. Only the tens digit changes.`,
    misconception:"Adds one instead of ten." })));

T({ strand:"NPV", skillId:"MAT-KS1-NPV-TENLESS", curriculumYear:"Year 2", misconceptionCategory:"place-value", subtopic:"Ten less",
    objective:"Find ten less than a two-digit number", difficulty:"Secure", type:"Understanding" },
  [25,34,46,53,67,72,90].map(n => ({
    text:`What is ten less than ${n}?`,
    illustration:{type:"base10", tens:Math.floor(n/10), ones:n%10},
    correct:n-10, distractors:[n-1, n+10, n-20],
    explanation:`Ten less than ${n} is ${n-10}. Only the tens digit changes.`,
    misconception:"Subtracts one instead of ten." })));

T({ strand:"NPV", skillId:"MAT-KS1-NPV-SEQ", curriculumYear:"Year 1", misconceptionCategory:"counting-in-steps", subtopic:"Counting sequence",
    objective:"Find a missing number in a count in ones", difficulty:"Secure", type:"Understanding" },
  [7,12,18,23,29,34,45].map(s => ({
    text:`Which number is missing? ${s}, ${s+1}, __, ${s+3}`,
    illustration:{type:"numberline", start:s, end:s+3, highlight:[s,s+1,s+3], question:s+2},
    correct:s+2, distractors:[s+1, s+3, s+4],
    explanation:`The numbers go up by one: ${s}, ${s+1}, ${s+2}, ${s+3}.`,
    misconception:"Loses track of the counting order." })));

T({ strand:"NPV", skillId:"MAT-KS1-NPV-IN2", curriculumYear:"Year 1", misconceptionCategory:"counting-in-steps", subtopic:"Count in 2s",
    objective:"Continue a count in twos", difficulty:"Secure", type:"Recall" },
  [2,6,10,14,20].map(a => ({
    text:`What comes next? ${a}, ${a+2}, ${a+4}, __`,
    correct:a+6, distractors:[a+5, a+8, a+7],
    explanation:`Counting in 2s, the next number is ${a+6}.`,
    misconception:"Adds one instead of two, or skips a step." })));

T({ strand:"NPV", skillId:"MAT-KS1-NPV-IN5", curriculumYear:"Year 1", misconceptionCategory:"counting-in-steps", subtopic:"Count in 5s",
    objective:"Continue a count in fives", difficulty:"Secure", type:"Recall" },
  [5,15,25,35,45].map(a => ({
    text:`What comes next? ${a}, ${a+5}, ${a+10}, __`,
    correct:a+15, distractors:[a+11, a+20, a+16],
    explanation:`Counting in 5s, the next number is ${a+15}.`,
    misconception:"Does not add five each time." })));

T({ strand:"NPV", skillId:"MAT-KS1-NPV-IN10", curriculumYear:"Year 1", misconceptionCategory:"counting-in-steps", subtopic:"Count in 10s",
    objective:"Continue a count in tens", difficulty:"Foundation", type:"Recall" },
  [10,20,30,40,60].map(a => ({
    text:`What comes next? ${a}, ${a+10}, ${a+20}, __`,
    correct:a+30, distractors:[a+21, a+40, a+31],
    explanation:`Counting in 10s, the next number is ${a+30}.`,
    misconception:"Does not add ten each time." })));

const greatestSets = [[32,19,27,23],[45,54,49,41],[63,36,58,60],[71,17,68,70],
                      [28,82,25,29],[56,65,51,50],[84,48,80,79],[37,73,31,35]];
T({ strand:"NPV", skillId:"MAT-KS1-NPV-CMPMAX", curriculumYear:"Year 2", misconceptionCategory:"number-comparison", subtopic:"Comparing",
    objective:"Identify the greatest of four numbers", difficulty:"Secure", type:"Reasoning",
    teacherNote:"Compare the tens first, not the ones." },
  greatestSets.map(set => {
    const max = Math.max(...set); const d = set.filter(x => x !== max);
    return { text:"Which number is the greatest?", correct:max, distractors:d,
      explanation:`${max} is the greatest — it has the most tens.`,
      misconception:"Compares only the ones digit." }; }));

const smallestSets = [[32,19,27,23],[45,54,49,41],[63,36,58,60],[28,82,25,29],
                      [56,65,51,50],[84,48,80,79]];
T({ strand:"NPV", skillId:"MAT-KS1-NPV-CMPMIN", curriculumYear:"Year 2", misconceptionCategory:"number-comparison", subtopic:"Comparing",
    objective:"Identify the smallest of four numbers", difficulty:"Secure", type:"Reasoning" },
  smallestSets.map(set => {
    const min = Math.min(...set); const d = set.filter(x => x !== min);
    return { text:"Which number is the smallest?", correct:min, distractors:d,
      explanation:`${min} is the smallest — it has the fewest tens.`,
      misconception:"Compares only the ones digit." }; }));

T({ strand:"NPV", skillId:"MAT-KS1-NPV-TENS", curriculumYear:"Year 2", misconceptionCategory:"place-value", subtopic:"Place value",
    objective:"State how many tens are in a two-digit number", difficulty:"Secure", type:"Understanding" },
  [24,37,45,53,68,72,86,91].map(n => {
    const tens = Math.floor(n/10), ones = n%10;
    return { text:`How many tens are in ${n}?`, correct:tens,
      illustration:{type:"base10", tens, ones, ariaLabel:`Place value blocks for the number ${n}`},
      distractors:[ones, tens+1, ones+1],
      explanation:`${n} has ${tens} tens and ${ones} ones.`,
      misconception:"Reads the ones digit as the number of tens." }; }));

T({ strand:"NPV", skillId:"MAT-KS1-NPV-BUILD", curriculumYear:"Year 2", misconceptionCategory:"place-value", subtopic:"Place value",
    objective:"Combine tens and ones into a number", difficulty:"Greater Depth", type:"Understanding",
    teacherNote:"Watch for reversing tens and ones." },
  [[4,3],[2,6],[5,1],[7,0],[3,8],[6,4]].map(([t,o]) => {
    const n = t*10+o;
    return { text:`What number is made from ${t} tens and ${o} ones?`, correct:n,
      illustration:{type:"base10", tens:t, ones:o},
      distractors:[o*10+t, t+o, n+10],
      explanation:`${t} tens and ${o} ones make ${n}.`,
      misconception:"Reverses the tens and ones, or adds the digits." }; }));

/* =========================================================
   ADDITION & SUBTRACTION
   ========================================================= */
T({ strand:"AS", skillId:"MAT-KS1-AS-BOND10", curriculumYear:"Year 1", misconceptionCategory:"number-bonds", subtopic:"Number bonds to 10",
    objective:"Recall number bonds to 10", difficulty:"Foundation", type:"Recall",
    teacherNote:"Bonds to 10 are worth knowing by heart." },
  [1,2,3,4,6,7,8,9].map(a => ({
    text:`${a} + __ = 10`, correct:10-a, distractors:[10-a+1, 10-a-1, a],
    explanation:`${a} and ${10-a} make 10.`,
    misconception:"Bond to 10 not yet secure." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-BOND20", curriculumYear:"Year 1", misconceptionCategory:"number-bonds", subtopic:"Number bonds to 20",
    objective:"Recall number bonds to 20", difficulty:"Secure", type:"Recall" },
  [11,12,13,14,16,17,18].map(a => ({
    text:`${a} + __ = 20`, correct:20-a, distractors:[20-a+1, 20-a-1, a],
    explanation:`${a} and ${20-a} make 20.`,
    misconception:"Bond to 20 not yet secure." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-ADD10", curriculumYear:"Year 1", misconceptionCategory:"addition-strategy", subtopic:"Add within 10",
    objective:"Add two numbers within 10", difficulty:"Foundation", type:"Fluency" },
  [[2,3],[4,3],[5,4],[6,2],[3,3],[1,7],[2,6]].map(([a,b]) => ({
    text:`${a} + ${b} = ?`, correct:a+b, distractors:[a+b-1, a+b+1, Math.abs(a-b)],
    explanation:`${a} + ${b} = ${a+b}. Count on from ${a}.`,
    misconception:"Miscounts when counting on, or subtracts." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-ADD20", curriculumYear:"Year 1", misconceptionCategory:"addition-strategy", subtopic:"Add within 20",
    objective:"Add two numbers within 20", difficulty:"Secure", type:"Fluency" },
  [[12,5],[11,7],[13,6],[8,9],[14,5],[7,8],[15,4],[6,9]].map(([a,b]) => ({
    text:`${a} + ${b} = ?`, correct:a+b, distractors:[a+b-1, a+b+1, Math.abs(a-b)],
    explanation:`${a} + ${b} = ${a+b}. Start at ${a} and count on ${b}.`,
    misconception:"Miscounts when counting on, or subtracts." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-ADD2D1", curriculumYear:"Year 2", misconceptionCategory:"addition-strategy", subtopic:"Add ones to a two-digit number",
    objective:"Add a one-digit number to a two-digit number", difficulty:"Secure", type:"Application" },
  [[23,4],[31,5],[42,6],[54,3],[65,4],[72,5]].map(([a,b]) => ({
    text:`${a} + ${b} = ?`, correct:a+b, distractors:[a+b-1, a+b+1, a+b*10-(b*10-b)],
    explanation:`${a} + ${b} = ${a+b}. Only the ones change.`,
    misconception:"Adds the ones to the tens digit." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-ADD10s", curriculumYear:"Year 2", misconceptionCategory:"addition-strategy", subtopic:"Add multiples of ten",
    objective:"Add two multiples of ten", difficulty:"Secure", type:"Fluency" },
  [[20,30],[40,10],[50,20],[30,30],[60,20],[10,70]].map(([a,b]) => ({
    text:`${a} + ${b} = ?`, correct:a+b, distractors:[a+b-10, a+b+10, (a/10)+(b/10)],
    explanation:`${a} + ${b} = ${a+b}. Add the tens.`,
    misconception:"Adds the tens digits only (e.g. 2+3=5)." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-SUB10", curriculumYear:"Year 1", misconceptionCategory:"subtraction-strategy", subtopic:"Subtract within 10",
    objective:"Subtract within 10", difficulty:"Foundation", type:"Fluency" },
  [[7,3],[9,4],[8,5],[6,2],[10,4],[5,3],[9,7]].map(([a,b]) => ({
    text:`${a} − ${b} = ?`, correct:a-b, distractors:[a-b-1, a-b+1, a+b],
    explanation:`${a} − ${b} = ${a-b}. Count back from ${a}.`,
    misconception:"Adds instead of subtracting." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-SUB20", curriculumYear:"Year 1", misconceptionCategory:"subtraction-strategy", subtopic:"Subtract within 20",
    objective:"Subtract within 20", difficulty:"Secure", type:"Fluency" },
  [[18,6],[15,7],[17,8],[14,5],[19,6],[16,9],[13,4],[20,7]].map(([a,b]) => ({
    text:`${a} − ${b} = ?`, correct:a-b, distractors:[a-b-1, a-b+1, a+b],
    explanation:`${a} − ${b} = ${a-b}. Start at ${a} and count back ${b}.`,
    misconception:"Miscounts, or adds instead of subtracting." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-SUB2D1", curriculumYear:"Year 2", misconceptionCategory:"subtraction-strategy", subtopic:"Subtract ones from a two-digit number",
    objective:"Subtract a one-digit number from a two-digit number", difficulty:"Secure", type:"Application" },
  [[27,5],[34,3],[46,4],[53,2],[68,6],[75,4]].map(([a,b]) => ({
    text:`${a} − ${b} = ?`, correct:a-b, distractors:[a-b-1, a-b+1, a+b],
    explanation:`${a} − ${b} = ${a-b}. Only the ones change.`,
    misconception:"Adds instead of subtracting." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-MISSADD", curriculumYear:"Year 1", misconceptionCategory:"missing-number", subtopic:"Missing number (addition)",
    objective:"Find a missing addend", difficulty:"Greater Depth", type:"Reasoning" },
  [[7,13],[6,14],[8,15],[9,16],[5,12],[4,11]].map(([a,c]) => ({
    text:`${a} + __ = ${c}`, correct:c-a, distractors:[c-a-1, c-a+1, c+a],
    explanation:`${a} + ${c-a} = ${c}. Count on from ${a} up to ${c}.`,
    misconception:"Adds the two numbers shown instead of finding the difference." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-MISSSUB", curriculumYear:"Year 1", misconceptionCategory:"missing-number", subtopic:"Missing number (subtraction)",
    objective:"Find a missing minuend", difficulty:"Greater Depth", type:"Reasoning" },
  [[3,5],[4,6],[5,7],[6,4],[2,9],[7,3]].map(([b,c]) => ({
    text:`__ − ${b} = ${c}`, correct:b+c, distractors:[b+c-1, b+c+1, Math.abs(c-b)],
    explanation:`${b+c} − ${b} = ${c}.`,
    misconception:"Subtracts instead of adding to find the whole." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-WORDADD", curriculumYear:"Year 1", misconceptionCategory:"word-problem-operation", subtopic:"Addition problem",
    objective:"Solve a one-step addition problem", difficulty:"Secure", type:"Application" },
  [[4,5],[6,3],[7,8],[5,9],[3,6]].map(([a,b], i) => {
    const names = ["Emily", "Oliver", "Sophie", "Ben", "Emily"];
    const name = names[i % names.length];
    return {
      text:`${name} has ${a} red apples and ${b} green apples. How many altogether?`,
      illustration:{type:"emojigroups", groups:[{emoji:"🍎", count:a}, {emoji:"🍏", count:b}]},
      correct:a+b, distractors:[a+b-1, a+b+1, Math.abs(a-b)],
      explanation:`${a} + ${b} = ${a+b} apples.`,
      misconception:"Subtracts instead of combining the groups." };
  }));

T({ strand:"AS", skillId:"MAT-KS1-AS-WORDSUB", curriculumYear:"Year 1", misconceptionCategory:"word-problem-operation", subtopic:"Subtraction problem",
    objective:"Solve a one-step subtraction problem", difficulty:"Secure", type:"Application" },
  [[8,3],[10,4],[9,5],[7,2],[12,5]].map(([a,b], i) => {
    const names = ["Oliver", "Sophie", "Ben", "Emily", "Oliver"];
    const name = names[i % names.length];
    return {
      text:`${name} has ${a} cakes. ${b} are eaten. How many are left?`,
      illustration:{type:"dots", count:a, emoji:"🍰"},
      correct:a-b, distractors:[a-b-1, a-b+1, a+b],
      explanation:`${a} − ${b} = ${a-b} cakes left.`,
      misconception:"Adds instead of taking away." };
  }));

T({ strand:"AS", skillId:"MAT-KS1-AS-COMM", curriculumYear:"Year 2", misconceptionCategory:"commutativity", subtopic:"Commutativity",
    objective:"Understand that addition can be done in any order", difficulty:"Secure", type:"Understanding" },
  [[3,4],[5,2],[6,3],[8,1],[2,7]].map(([a,b]) => ({
    text:`If ${a} + ${b} = ${a+b}, what is ${b} + ${a}?`,
    correct:a+b, distractors:[a+b-1, a+b+1, Math.abs(a-b)],
    explanation:`Adding in a different order gives the same total: ${a+b}.`,
    misconception:"Thinks changing the order changes the answer." })));

/* =========================================================
   MULTIPLICATION & DIVISION
   ========================================================= */
T({ strand:"MD", skillId:"MAT-KS1-MD-DOUBLE", curriculumYear:"Year 1", misconceptionCategory:"doubling", subtopic:"Doubling",
    objective:"Double a number", difficulty:"Foundation", type:"Understanding" },
  [1,2,3,4,5,6,7,8].map(n => ({
    text:`Double ${n} is __`,
    illustration:{type:"dots", count:n, color:"#652da0"},
    correct:2*n, distractors:[n+2, 2*n-1, 2*n+2],
    explanation:`Double ${n} means ${n} + ${n} = ${2*n}.`,
    misconception:"Adds two instead of doubling." })));

T({ strand:"MD", skillId:"MAT-KS1-MD-GROUPS", curriculumYear:"Year 1", misconceptionCategory:"grouping-sharing", subtopic:"Equal groups",
    objective:"Find the total of equal groups", difficulty:"Secure", type:"Understanding",
    teacherNote:"Repeated addition supports this." },
  [[2,3],[3,2],[2,5],[4,2],[3,3],[2,4]].map(([g,s]) => ({
    text:`How many eggs altogether?`,
    illustration:{type:"array", rows:g, cols:s, emoji:"🥚"},
    correct:g*s, distractors:[g+s, g*s+s, g*s-s],
    explanation:`${g} groups of ${s} is ${g*s}.`,
    misconception:"Adds the two numbers instead of finding the total." })));

T({ strand:"MD", skillId:"MAT-KS1-MD-ARRAY", curriculumYear:"Year 2", misconceptionCategory:"grouping-sharing", subtopic:"Arrays",
    objective:"Count the total in an array", difficulty:"Secure", type:"Understanding" },
  [[2,5],[3,4],[2,6],[4,3],[5,2]].map(([r,c]) => ({
    text:`How many oranges are in this array?`,
    illustration:{type:"array", rows:r, cols:c, emoji:"🍊"},
    correct:r*c, distractors:[r+c, r*c+c, r*c-c],
    explanation:`${r} rows of ${c} is ${r*c} oranges.`,
    misconception:"Counts only one row or adds the sides." })));

T({ strand:"MD", skillId:"MAT-KS1-MD-X5", curriculumYear:"Year 2", misconceptionCategory:"times-tables", subtopic:"Groups of five",
    objective:"Multiply by five", difficulty:"Secure", type:"Application" },
  [1,2,3,4,5].map(n => ({
    text:`What is ${n} groups of 5?`, correct:5*n, distractors:[5*n-1, 5*n+1, 5*n-5],
    explanation:`${n} groups of 5 is ${5*n}. Count in 5s.`,
    misconception:"Loses count when counting in fives." })));

T({ strand:"MD", skillId:"MAT-KS1-MD-X10", curriculumYear:"Year 2", misconceptionCategory:"times-tables", subtopic:"Groups of ten",
    objective:"Multiply by ten", difficulty:"Secure", type:"Application" },
  [1,2,3,4,5].map(n => ({
    text:`What is ${n} groups of 10?`, correct:10*n, distractors:[10*n-1, 10*n+1, n],
    explanation:`${n} groups of 10 is ${10*n}. Count in 10s.`,
    misconception:"Loses count when counting in tens." })));

T({ strand:"MD", skillId:"MAT-KS1-MD-SHARE", curriculumYear:"Year 1", misconceptionCategory:"grouping-sharing", subtopic:"Sharing equally",
    objective:"Share a quantity equally", difficulty:"Secure", type:"Application",
    teacherNote:"Sharing links to division." },
  [[10,2],[12,2],[8,2],[6,3],[9,3],[12,3],[20,2],[10,5]].map(([t,g]) => ({
    text:`Share ${t} sweets equally between ${g} children. How many each?`,
    illustration:{type:"dots", count:t, emoji:"🍬"},
    correct:t/g, distractors:[t/g+1, t/g-1, t-g],
    explanation:`${t} shared between ${g} is ${t/g} each.`,
    misconception:"Subtracts instead of sharing equally." })));

T({ strand:"MD", skillId:"MAT-KS1-MD-GROUP", curriculumYear:"Year 1", misconceptionCategory:"grouping-sharing", subtopic:"Grouping",
    objective:"Find how many equal groups", difficulty:"Greater Depth", type:"Reasoning" },
  [[6,2],[10,2],[8,2],[9,3],[12,3],[15,5]].map(([t,s]) => ({
    text:`How many groups of ${s} toy cars are in ${t}?`,
    illustration:{type:"dots", count:t, emoji:"🚗"},
    correct:t/s, distractors:[t/s+1, t/s-1, t-s],
    explanation:`${t} split into groups of ${s} makes ${t/s} groups.`,
    misconception:"Subtracts instead of grouping." })));

/* =========================================================
   FRACTIONS
   ========================================================= */
T({ strand:"FRA", skillId:"MAT-KS1-FRA-SHADE", curriculumYear:"Year 1", misconceptionCategory:"equal-parts", subtopic:"Fraction of a shape",
    objective:"Name the fraction that is shaded", difficulty:"Secure", type:"Understanding" },
  [[2,1,"one half"],[4,1,"one quarter"],[4,3,"three quarters"],
   [2,1,"one half"],[4,1,"one quarter"],[4,3,"three quarters"]].map(([parts,shaded,name],i) => ({
    text:"What fraction of the shape is shaded?",
    illustration: i % 3 === 2
      ? {type:"fraction", parts, shaded, shape:"pie"}
      : {type:"fraction", parts, shaded, tall:(i%2===0)},
    correct:name, distractors:["one half","one quarter","three quarters","one whole"].filter(x=>x!==name).slice(0,3),
    explanation:`${shaded} of the ${parts} equal parts is shaded — that is ${name}.`,
    misconception:"Counts parts without checking they are equal, or confuses half and quarter." })));

T({ strand:"FRA", skillId:"MAT-KS1-FRA-HALFQ", curriculumYear:"Year 1", misconceptionCategory:"equal-parts", subtopic:"Half of a quantity",
    objective:"Find half of a set of objects", difficulty:"Secure", type:"Understanding" },
  [4,6,8,10,12,16].map(n => ({
    text:`What is half of these ${n} stickers?`,
    illustration:{type:"dots", count:n, emoji:"⭐"},
    correct:n/2, distractors:[n/2+1, n/2-1, 2*n],
    explanation:`Half of ${n} is ${n/2} — share them into two equal groups.`,
    misconception:"Doubles instead of halving." })));

T({ strand:"FRA", skillId:"MAT-KS1-FRA-QUARTERQ", curriculumYear:"Year 1", misconceptionCategory:"equal-parts", subtopic:"Quarter of a quantity",
    objective:"Find a quarter of a set of objects", difficulty:"Greater Depth", type:"Understanding" },
  [4,8,12,16,20].map(n => ({
    text:`What is a quarter of these ${n} cookies?`,
    illustration:{type:"dots", count:n, emoji:"🍪"},
    correct:n/4, distractors:[n/4+1, n/2, n/4-1],
    explanation:`A quarter of ${n} is ${n/4} — share them into four equal groups.`,
    misconception:"Finds a half instead of a quarter." })));

T({ strand:"FRA", skillId:"MAT-KS1-FRA-HALFN", curriculumYear:"Year 1", misconceptionCategory:"equal-parts", subtopic:"Half of a number",
    objective:"Find half of a number", difficulty:"Secure", type:"Application" },
  [8,10,14,18,22,30].map(n => ({
    text:`What is half of ${n}?`,
    illustration:{type:"dots", count:n, color:"#652da0"},
    correct:n/2, distractors:[n/2+1, n/2-1, 2*n],
    explanation:`Half of ${n} is ${n/2}.`,
    misconception:"Doubles instead of halving." })));

T({ strand:"FRA", skillId:"MAT-KS1-FRA-QUARTERN", curriculumYear:"Year 1", misconceptionCategory:"equal-parts", subtopic:"Quarter of a number",
    objective:"Find a quarter of a number", difficulty:"Greater Depth", type:"Application" },
  [8,12,16,20,24].map(n => ({
    text:`What is a quarter of ${n}?`,
    illustration:{type:"dots", count:n, color:"#e0483f"},
    correct:n/4, distractors:[n/4+1, n/2, n/4-1],
    explanation:`A quarter of ${n} is ${n/4}.`,
    misconception:"Finds a half instead of a quarter." })));

T({ strand:"FRA", skillId:"MAT-KS1-FRA-PARTS", curriculumYear:"Year 1", misconceptionCategory:"equal-parts", subtopic:"Equal parts",
    objective:"Count the equal parts a shape is divided into", difficulty:"Foundation", type:"Understanding" },
  [[2,false],[3,true],[4,false],[2,true],[4,true],[3,false]].map(([parts,tall],i) => ({
    text:"Into how many equal parts is this shape divided?",
    illustration: i % 3 === 2
      ? {type:"fraction", parts, shaded:0, shape:"pie"}
      : {type:"fraction", parts, shaded:0, tall},
    correct:parts, distractors:[parts+1, parts-1, parts+2],
    explanation:`The shape is divided into ${parts} equal parts.`,
    misconception:"Miscounts the parts." })));

/* =========================================================
   MEASUREMENT
   ========================================================= */
const coinSets = [[10,5,2],[10,10],[5,5,2],[20,5],[10,2,2],[5,2,1],[10,10,5],[2,2,2],[20,10],[5,5,5]];
T({ strand:"MEA", skillId:"MAT-KS1-MEA-MONEY", curriculumYear:"Year 1", misconceptionCategory:"money-value", subtopic:"Money",
    objective:"Find the total value of coins", difficulty:"Secure", type:"Application",
    teacherNote:"Add the largest coins first." },
  coinSets.map(set => {
    const sum = set.reduce((a,b)=>a+b,0);
    const missedOne = sum - set[set.length-1];
    return { text:"How much money is here?",
      illustration:{type:"coins", values:set},
      correct:`${sum}p`, distractors:[`${missedOne}p`, `${set.length}p`, `${sum+1}p`],
      explanation:`Altogether that is ${sum}p.`,
      misconception:"Misses a coin, or counts the number of coins instead of their value." }; }));

const amountSets = [[5,10,2,20],[1,2,5,10],[20,50,10,5],[2,5,1,10],[10,20,5,2]];
T({ strand:"MEA", skillId:"MAT-KS1-MEA-MOSTCOIN", curriculumYear:"Year 1", misconceptionCategory:"money-value", subtopic:"Money",
    objective:"Identify the largest amount", difficulty:"Foundation", type:"Recall" },
  amountSets.map(set => {
    const max = Math.max(...set);
    return { text:"Which is the largest amount of money?",
      illustration:{type:"coins", values:set},
      correct:`${max}p`, distractors:set.filter(x=>x!==max).map(x=>`${x}p`),
      explanation:`${max}p is the largest amount.`,
      misconception:"Thinks a coin with a smaller number is worth more." }; }));

T({ strand:"MEA", skillId:"MAT-KS1-MEA-OCLOCK", curriculumYear:"Year 1", misconceptionCategory:"time-reading", subtopic:"Time (o'clock)",
    objective:"Read o'clock times", difficulty:"Secure", type:"Understanding",
    teacherNote:"The short hand shows the hour." },
  [1,2,3,5,7,9,10,12].map(h => {
    const next = h === 12 ? 1 : h + 1;   // wrap correctly around the clock face
    const prev = h === 1 ? 12 : h - 1;   // (fixes 12 producing "11 o'clock" twice)
    return {
    text:"What time does the clock show?",
    illustration:{type:"clock", hour:h, minute:0},
    correct:`${h} o’clock`,
    distractors:[`${next} o’clock`, `${prev} o’clock`, `half past ${h}`],
    explanation:`The short hand points to ${h} and the long hand points to 12, so it is ${h} o’clock.`,
    misconception:"Reads the time from the long hand." }; }));

T({ strand:"MEA", skillId:"MAT-KS1-MEA-HALFPAST", curriculumYear:"Year 1", misconceptionCategory:"time-reading", subtopic:"Time (half past)",
    objective:"Read half past times", difficulty:"Greater Depth", type:"Understanding" },
  [1,2,4,6,8,11].map(h => ({
    text:"What time does the clock show?",
    illustration:{type:"clock", hour:h, minute:30},
    correct:`half past ${h}`,
    distractors:[`half past ${h===12?1:h+1}`, `${h} o’clock`, `half past ${h===1?12:h-1}`],
    explanation:`The long hand points to 6, so it is half past ${h}.`,
    misconception:"Reads it as o'clock, or uses the wrong hour." })));

const dayList = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
T({ strand:"MEA", skillId:"MAT-KS1-MEA-DAYS", curriculumYear:"Year 1", misconceptionCategory:"time-sequence", subtopic:"Days of the week",
    objective:"Know the order of the days of the week", difficulty:"Foundation", type:"Recall" },
  dayList.map((d,i) => {
    const next = dayList[(i+1)%7];
    const others = dayList.filter(x=>x!==next && x!==d).slice(0,3);
    return { text:`Which day comes after ${d}?`, correct:next, distractors:others,
      explanation:`After ${d} comes ${next}.`,
      misconception:"Does not know the order of the days." }; }));

T({ strand:"MEA", skillId:"MAT-KS1-MEA-LONGEST", curriculumYear:"Year 1", misconceptionCategory:"time-duration", subtopic:"Time (duration)",
    objective:"Compare units of time", difficulty:"Secure", type:"Reasoning" },
  [["a day","a minute","an hour","a second"],
   ["a week","a day","an hour","a minute"],
   ["an hour","a minute","a second","a moment"],
   ["a year","a week","a day","an hour"]].map(set => ({
    text:"Which takes the longest time?", correct:set[0], distractors:set.slice(1),
    explanation:`${set[0]} is the longest of these.`,
    misconception:"Confuses the length of different time units." })));

const barSets = [[["A",40],["B",70],["C",55]],[["A",80],["B",50],["C",30]],
                 [["A",30],["B",45],["C",75]],[["A",60],["B",90],["C",40]],
                 [["A",85],["B",35],["C",60]]];
T({ strand:"MEA", skillId:"MAT-KS1-MEA-LONGBAR", curriculumYear:"Year 1", misconceptionCategory:"measurement-comparison", subtopic:"Length",
    objective:"Compare lengths", difficulty:"Foundation", type:"Understanding" },
  barSets.map(bars => {
    const longest = bars.reduce((m,b)=> b[1]>m[1]?b:m)[0];
    return { text:"Which bar is the longest?",
      illustration:{type:"bars", bars:bars.map(([label,length])=>({label,length}))},
      correct:longest, distractors:bars.filter(b=>b[0]!==longest).map(b=>b[0]).concat(["All the same"]).slice(0,3),
      explanation:`Bar ${longest} is the longest.`,
      misconception:"Compares the wrong end of the bars." }; }));

T({ strand:"MEA", skillId:"MAT-KS1-MEA-HEAVY", curriculumYear:"Year 1", misconceptionCategory:"measurement-comparison", subtopic:"Mass",
    objective:"Compare mass in everyday contexts", difficulty:"Foundation", type:"Understanding" },
  [["a car","a shoe","a pencil","a feather"],
   ["an elephant","a dog","a cat","a mouse"],
   ["a brick","a leaf","a sock","a balloon"]].map(set => ({
    text:"Which is the heaviest?", correct:set[0], distractors:set.slice(1),
    explanation:`${set[0]} is the heaviest of these.`,
    misconception:"Judges by size rather than weight." })));

/* =========================================================
   GEOMETRY (shape)
   ========================================================= */
const shapeSides = {triangle:3, square:4, rectangle:4, pentagon:5, hexagon:6};
const shapeNames = Object.keys(shapeSides).concat(["circle"]);
T({ strand:"GEO", skillId:"MAT-KS1-GEO-NAME", curriculumYear:"Year 1", misconceptionCategory:"shape-properties", subtopic:"Naming 2D shapes",
    objective:"Name common 2D shapes", difficulty:"Foundation", type:"Recall" },
  shapeNames.map(sh => ({
    text:"What is the name of this shape?",
    illustration:{type:"shape", shape:sh},
    correct:sh, distractors:shapeNames.filter(x=>x!==sh).slice(0,3),
    explanation:`This shape is a ${sh}.`,
    misconception:"Confuses similar-looking shapes." })));

T({ strand:"GEO", skillId:"MAT-KS1-GEO-SIDES", curriculumYear:"Year 2", misconceptionCategory:"shape-properties", subtopic:"Sides of 2D shapes",
    objective:"Count the sides of a 2D shape", difficulty:"Secure", type:"Understanding" },
  Object.keys(shapeSides).map(sh => {
    const s = shapeSides[sh];
    return { text:"How many sides does this shape have?",
      illustration:{type:"shape", shape:sh},
      correct:s, distractors:[s+1, s-1, s+2],
      explanation:`A ${sh} has ${s} straight sides.`,
      misconception:"Miscounts the sides." }; }));

T({ strand:"GEO", skillId:"MAT-KS1-GEO-CORNERS", curriculumYear:"Year 2", misconceptionCategory:"shape-properties", subtopic:"Corners of 2D shapes",
    objective:"Count the corners of a 2D shape", difficulty:"Secure", type:"Understanding" },
  Object.keys(shapeSides).map(sh => {
    const s = shapeSides[sh];
    return { text:"How many corners does this shape have?",
      illustration:{type:"shape", shape:sh},
      correct:s, distractors:[s+1, s-1, s+2],
      explanation:`A ${sh} has ${s} corners.`,
      misconception:"Counts sides and corners differently by mistake." }; }));

T({ strand:"GEO", skillId:"MAT-KS1-GEO-REAL2D", curriculumYear:"Year 1", misconceptionCategory:"shape-properties", subtopic:"Shapes in real life",
    objective:"Recognise 2D shapes in everyday objects", difficulty:"Foundation", type:"Application" },
  [["a clock","a book","a box","a ruler","circle"],
   ["a window","a ball","a cone","a tin","square"],
   ["a slice of pizza","a plate","a door","a coin","triangle"]].map(set => {
    const items = set.slice(0,4);
    return { text:`Which of these is shaped most like a ${set[4]}?`,
      correct:items[0], distractors:items.slice(1),
      explanation:`${items[0]} is most like a ${set[4]}.`,
      misconception:"Does not link shapes to real objects." }; }));

T({ strand:"GEO", skillId:"MAT-KS1-GEO-3D", curriculumYear:"Year 1", misconceptionCategory:"shape-properties", subtopic:"Naming 3D shapes",
    objective:"Recognise 3D shapes in everyday objects", difficulty:"Secure", type:"Recall",
    teacherNote:"Uses real-world objects rather than drawings." },
  [["a ball","a book","a tin","a party hat","sphere"],
   ["a dice","a ball","a tin","an egg","cube"],
   ["a tin of beans","a ball","a book","a dice","cylinder"],
   ["a party hat","a ball","a box","a book","cone"]].map(set => {
    const items = set.slice(0,4);
    return { text:`Which object is shaped like a ${set[4]}?`,
      correct:items[0], distractors:items.slice(1),
      explanation:`${items[0]} is shaped like a ${set[4]}.`,
      misconception:"Confuses 3D shapes with each other." }; }));

T({ strand:"GEO", skillId:"MAT-KS1-GEO-PROP", curriculumYear:"Year 2", misconceptionCategory:"shape-properties", subtopic:"Shape properties",
    objective:"Identify a shape from a property", difficulty:"Greater Depth", type:"Reasoning" },
  [["square","rectangle","triangle","circle","which has 4 equal sides"],
   ["triangle","square","circle","hexagon","which has 3 sides"],
   ["hexagon","pentagon","square","triangle","which has 6 sides"],
   ["circle","square","triangle","pentagon","which is completely round"]].map(set => {
    const items = set.slice(0,4);
    return { text:`Which shape is the one that ${set[4]}?`,
      correct:items[0], distractors:items.slice(1),
      explanation:`The ${items[0]} is the shape that ${set[4]}.`,
      misconception:"Does not connect properties to the correct shape." }; }));

/* =========================================================
   POSITION & DIRECTION
   ========================================================= */
T({ strand:"POS", skillId:"MAT-KS1-POS-OPP", curriculumYear:"Year 1", misconceptionCategory:"position-direction-language", subtopic:"Direction words",
    objective:"Know opposite directions", difficulty:"Foundation", type:"Recall" },
  [["left","right","up","down"],["up","down","left","right"],
   ["forwards","backwards","left","right"],["top","bottom","left","right"]].map(set => ({
    text:`What is the opposite of ${set[0]}?`,
    illustration:{type:"arrow", direction:set[0]},
    correct:set[1], distractors:[set[2],set[3],set[0]],
    explanation:`The opposite of ${set[0]} is ${set[1]}.`,
    misconception:"Confuses opposite directions." })));

T({ strand:"POS", skillId:"MAT-KS1-POS-TURN", curriculumYear:"Year 1", misconceptionCategory:"position-direction-language", subtopic:"Turns",
    objective:"Understand quarter and half turns", difficulty:"Greater Depth", type:"Reasoning" },
  [["How many quarter turns make a half turn?",2,[1,3,4]],
   ["How many quarter turns make a full turn?",4,[2,3,1]],
   ["How many quarter turns make a three-quarter turn?",3,[2,4,1]]].map(([text,correct,d]) => ({
    text,
    illustration:{type:"turns", quarters:1}, // shows what ONE quarter turn looks like (a fixed
                                              // reference), not the answer itself — the child still
                                              // has to work out how many of these make up the turn asked about
    correct, distractors:d,
    explanation:`${text.replace("How many quarter turns make ","").replace("?","")} is ${correct} quarter turns.`,
    misconception:"Does not relate quarter turns to bigger turns." })));

T({ strand:"POS", skillId:"MAT-KS1-POS-ORD", curriculumYear:"Year 2", misconceptionCategory:"position-direction-language", subtopic:"Ordinal position",
    objective:"Use ordinal position words", difficulty:"Secure", type:"Understanding" },
  [["Which comes straight after 1st?","2nd",["3rd","4th","1st"]],
   ["Which comes straight after 3rd?","4th",["2nd","5th","3rd"]],
   ["Which comes straight before 3rd?","2nd",["4th","1st","3rd"]],
   ["Which comes straight before 5th?","4th",["6th","3rd","5th"]]].map(([text,correct,d]) => ({
    text, correct, distractors:d,
    explanation:`The answer is ${correct}.`,
    misconception:"Muddles the order of ordinal positions." })));

T({ strand:"POS", skillId:"MAT-KS1-POS-VOCAB", curriculumYear:"Year 1", misconceptionCategory:"position-direction-language", subtopic:"Position words",
    objective:"Use everyday position words", difficulty:"Foundation", type:"Understanding" },
  [["The sky is ___ the ground.","above",["below","next to","behind"]],
   ["Your feet are ___ your head.","below",["above","beside","in front of"]],
   ["The roof is ___ the house.","on top of",["under","beside","behind"]]].map(([text,correct,d]) => ({
    text, correct, distractors:d,
    explanation:`The correct word is “${correct}”.`,
    misconception:"Uses the wrong position word." })));

/* =========================================================
   STATISTICS
   ========================================================= */
const picto = [
  {rows:[["Apples",5],["Pears",3],["Plums",4]]},
  {rows:[["Cats",6],["Dogs",2],["Fish",5]]},
  {rows:[["Red",4],["Blue",6],["Green",3]]},
  {rows:[["Buses",3],["Cars",7],["Bikes",5]]},
];
T({ strand:"STA", skillId:"MAT-KS1-STA-READ", curriculumYear:"Year 2", misconceptionCategory:"data-interpretation", subtopic:"Reading a pictogram",
    objective:"Read a value from a pictogram", difficulty:"Secure", type:"Understanding" },
  picto.map(({rows}, i) => {
    const [label,count] = rows[0];
    const illRows = rows.map(([l,c])=>({label:l,count:c}));
    return { text:`The ${i%2===0?"pictogram":"chart"} shows how many there are. How many ${label.toLowerCase()} are there?`,
      illustration: i%2===0 ? {type:"pictogram", rows:illRows} : {type:"tally", rows:illRows},
      correct:count, distractors:[count+1, count-1, rows[1][1]],
      explanation:`There are ${count} ${label.toLowerCase()}.`,
      misconception:"Reads the wrong row or miscounts the pictures." }; }));

T({ strand:"STA", skillId:"MAT-KS1-STA-MOST", curriculumYear:"Year 2", misconceptionCategory:"data-interpretation", subtopic:"Comparing data",
    objective:"Find the category with the most", difficulty:"Secure", type:"Reasoning" },
  picto.map(({rows}, i) => {
    const most = rows.reduce((m,r)=> r[1]>m[1]?r:m);
    const illRows = rows.map(([l,c])=>({label:l,count:c}));
    return { text:"Which has the most?",
      illustration: i%2===0 ? {type:"tally", rows:illRows} : {type:"pictogram", rows:illRows},
      correct:most[0], distractors:rows.filter(r=>r[0]!==most[0]).map(r=>r[0]).concat(["All the same"]).slice(0,3),
      explanation:`${most[0]} has the most, with ${most[1]}.`,
      misconception:"Chooses a row without comparing the amounts." }; }));

T({ strand:"STA", skillId:"MAT-KS1-STA-TOTAL", curriculumYear:"Year 2", misconceptionCategory:"data-interpretation", subtopic:"Totalling data",
    objective:"Find a total from a pictogram", difficulty:"Greater Depth", type:"Application" },
  picto.slice(0,3).map(({rows}, i) => {
    const total = rows.reduce((a,r)=>a+r[1],0);
    const illRows = rows.map(([l,c])=>({label:l,count:c}));
    return { text:"How many are there altogether?",
      illustration: i%2===0 ? {type:"pictogram", rows:illRows} : {type:"tally", rows:illRows},
      correct:total, distractors:[total+1, total-1, rows[0][1]+rows[1][1]],
      explanation:`Adding every row gives ${total} altogether.`,
      misconception:"Adds only some of the rows." }; }));

T({ strand:"STA", skillId:"MAT-KS1-STA-DIFF", curriculumYear:"Year 2", misconceptionCategory:"data-interpretation", subtopic:"Comparing data",
    objective:"Find how many more", difficulty:"Greater Depth", type:"Reasoning" },
  picto.slice(0,3).map(({rows}, i) => {
    const a = rows[0], b = rows[1]; const diff = Math.abs(a[1]-b[1]);
    const more = a[1]>=b[1] ? a : b, fewer = a[1]>=b[1] ? b : a;
    const illRows = rows.map(([l,c])=>({label:l,count:c}));
    return { text:`How many more ${more[0].toLowerCase()} than ${fewer[0].toLowerCase()} are there?`,
      illustration: i%2===0 ? {type:"tally", rows:illRows} : {type:"pictogram", rows:illRows},
      correct:diff, distractors:[diff+1, diff-1, a[1]+b[1]],
      explanation:`There are ${diff} more ${more[0].toLowerCase()} than ${fewer[0].toLowerCase()}.`,
      misconception:"Adds the two rows instead of finding the difference." }; }));

/* =========================================================
   NEW SKILLS ADDED FOR FULL KS1 NATIONAL CURRICULUM COVERAGE
   ========================================================= */

T({ strand:"NPV", skillId:"MAT-KS1-NPV-IN3", curriculumYear:"Year 2", misconceptionCategory:"counting-in-steps", subtopic:"Count in 3s",
    objective:"Continue a count in threes", difficulty:"Secure", type:"Recall" },
  [3,6,12,15,21].map(a => ({
    text:`What comes next? ${a}, ${a+3}, ${a+6}, __`,
    correct:a+9, distractors:[a+8, a+12, a+7],
    explanation:`Counting in 3s, the next number is ${a+9}.`,
    misconception:"Does not add three each time." })));

T({ strand:"AS", skillId:"MAT-KS1-AS-ADD2D2D", curriculumYear:"Year 2", misconceptionCategory:"addition-strategy", subtopic:"Add two two-digit numbers",
    objective:"Add two two-digit numbers together", difficulty:"Greater Depth", type:"Application" },
  [[23,14],[35,22],[41,36],[27,31],[52,25]].map(([a,b]) => ({
    text:`What is ${a} + ${b}?`, correct:a+b, distractors:[a+b+10, a+b-10, a+b+1],
    explanation:`${a} + ${b} = ${a+b}. Try adding the tens first, then the ones.`,
    misconception:"Adds the tens and ones correctly but forgets to carry, or misaligns place value." })));

T({ strand:"MD", skillId:"MAT-KS1-MD-X2", curriculumYear:"Year 2", misconceptionCategory:"times-tables", subtopic:"Groups of two",
    objective:"Recall multiplication facts for the 2 times table", difficulty:"Secure", type:"Recall" },
  [1,2,3,4,5,6].map(n => ({
    text:`What is 2 × ${n}?`, correct:2*n, distractors:[2*n+1, 2*n-1, n],
    explanation:`2 × ${n} = ${2*n}.`,
    misconception:"Confuses the 2 times table with adding 2 once, or counts the wrong number of groups." })));

T({ strand:"MD", skillId:"MAT-KS1-MD-COMM", curriculumYear:"Year 2", misconceptionCategory:"commutativity", subtopic:"Commutativity",
    objective:"Understand that multiplication can be done in any order", difficulty:"Greater Depth", type:"Reasoning" },
  [[3,4],[2,5],[6,2],[4,3],[5,3]].map(([a,b]) => ({
    text:`${a} × ${b} gives the same answer as which calculation?`,
    correct:`${b} × ${a}`, distractors:[`${a} + ${b}`, `${a} × ${a}`, `${b} + ${b}`],
    explanation:`Multiplication can be done in any order, so ${a} × ${b} = ${b} × ${a}.`,
    misconception:"Does not yet realise multiplication can be reordered without changing the answer." })));

T({ strand:"FRA", skillId:"MAT-KS1-FRA-THIRDQ", curriculumYear:"Year 2", misconceptionCategory:"equal-parts", subtopic:"Third of a quantity",
    objective:"Find a third of a set of objects", difficulty:"Greater Depth", type:"Understanding" },
  [3,6,9,12,15].map(n => ({
    text:`What is a third of these ${n} sweets?`,
    illustration:{type:"dots", count:n, emoji:"🍬"},
    correct:n/3, distractors:[n/3+1, n/2, n/3-1],
    explanation:`A third of ${n} is ${n/3} — share them into three equal groups.`,
    misconception:"Finds a half or a quarter instead of a third." })));

T({ strand:"FRA", skillId:"MAT-KS1-FRA-THIRDN", curriculumYear:"Year 2", misconceptionCategory:"equal-parts", subtopic:"Third of a number",
    objective:"Find a third of a number", difficulty:"Greater Depth", type:"Application" },
  [9,12,15,18,21].map(n => ({
    text:`What is a third of ${n}?`,
    illustration:{type:"dots", count:n, color:"#43a047"},
    correct:n/3, distractors:[n/3+1, n/2, n/3-1],
    explanation:`A third of ${n} is ${n/3}.`,
    misconception:"Finds a half or a quarter instead of a third." })));

T({ strand:"FRA", skillId:"MAT-KS1-FRA-THREEQ", curriculumYear:"Year 2", misconceptionCategory:"equal-parts", subtopic:"Three-quarters of a quantity",
    objective:"Find three-quarters of a quantity", difficulty:"Greater Depth", type:"Application" },
  [4,8,12,16,20].map(n => ({
    text:`What is three-quarters of ${n}?`,
    illustration:{type:"fraction", parts:4, shaded:3},
    correct:(n/4)*3, distractors:[n/4, n/2, (n/4)*3+1],
    explanation:`A quarter of ${n} is ${n/4}, so three-quarters is ${(n/4)*3}.`,
    misconception:"Finds one quarter instead of three-quarters, or finds a half." })));

T({ strand:"FRA", skillId:"MAT-KS1-FRA-EQUIV", curriculumYear:"Year 2", misconceptionCategory:"fraction-equivalence", subtopic:"Fraction equivalence",
    objective:"Recognise the equivalence of two quarters and one half", difficulty:"Greater Depth", type:"Reasoning" },
  [1,2,3].map(i => ({
    text:"Which fraction is the same amount as one half?",
    illustration:{type:"fraction", parts:4, shaded:2},
    correct:"Two quarters", distractors:["One quarter", "Three quarters", "One third"],
    explanation:"Two quarters cover exactly the same amount as one half.",
    misconception:"Does not yet see that different fractions can describe the same amount." })));

T({ strand:"MEA", skillId:"MAT-KS1-MEA-QPAST", curriculumYear:"Year 2", misconceptionCategory:"time-reading", subtopic:"Time (quarter past)",
    objective:"Read quarter past times", difficulty:"Greater Depth", type:"Understanding" },
  [1,2,4,6,8,11].map(h => ({
    text:"What time does the clock show?",
    illustration:{type:"clock", hour:h, minute:15},
    correct:`quarter past ${h}`,
    distractors:[`quarter to ${h===12?1:h+1}`, `half past ${h}`, `${h} o’clock`],
    explanation:`The long hand points to 3, so it is quarter past ${h}.`,
    misconception:"Confuses quarter past with quarter to, or with half past." })));

T({ strand:"MEA", skillId:"MAT-KS1-MEA-QTO", curriculumYear:"Year 2", misconceptionCategory:"time-reading", subtopic:"Time (quarter to)",
    objective:"Read quarter to times", difficulty:"Greater Depth", type:"Understanding" },
  [1,2,4,6,8,11].map(h => {
    const next = h===12?1:h+1;
    return {
      text:"What time does the clock show?",
      illustration:{type:"clock", hour:h, minute:45},
      correct:`quarter to ${next}`,
      distractors:[`quarter past ${h}`, `half past ${h}`, `${next} o’clock`],
      explanation:`The long hand points to 9, so it is quarter to ${next}.`,
      misconception:"Confuses quarter to with quarter past, or names the wrong hour." }; }));

T({ strand:"MEA", skillId:"MAT-KS1-MEA-CAPACITY", curriculumYear:"Year 1", misconceptionCategory:"measurement-comparison", subtopic:"Capacity",
    objective:"Compare capacity and volume in everyday contexts", difficulty:"Foundation", type:"Understanding" },
  [["a bucket","a cup","an egg cup","a teaspoon"],
   ["a bathtub","a sink","a bowl","a mug"],
   ["a jug","a glass","a bottle cap","a spoon"]].map(set => ({
    text:"Which holds the most?", correct:set[0], distractors:set.slice(1),
    explanation:`${set[0]} holds the most of these.`,
    misconception:"Judges capacity by height alone rather than overall volume." })));

/* =========================================================
   BUILD + VALIDATE
   ========================================================= */
const SUPPORTED_ILLUS = new Set(["dots","array","coins","shape","clock","fraction","bars","pictogram","tally","base10","numberline","turns","arrow","emojigroups"]);
const questions = [];
const counters = {};
const seenIds = new Set();

for (const { meta, instances } of templates) {
  const code = meta.strand;
  for (const inst of instances) {
    counters[code] = (counters[code] || 0) + 1;
    const id = `MAT-KS1-${code}-${String(counters[code]).padStart(4,"0")}`;
    if (seenIds.has(id)) throw new Error("Duplicate id " + id);
    seenIds.add(id);
    const { options, correctIndex } = finalize(inst.correct, inst.distractors);
    // validate options
    if (options.length !== 4) throw new Error("bad options " + id);
    if (new Set(options.map(String)).size !== 4) throw new Error("duplicate options " + id + " " + options);
    if (inst.illustration && !SUPPORTED_ILLUS.has(inst.illustration.type))
      throw new Error("unsupported illustration " + inst.illustration.type + " in " + id);
    if (!inst.text || !inst.text.trim()) throw new Error("empty text " + id);
    questions.push({
      id, strand: code, skillId: meta.skillId, subtopic: meta.subtopic,
      objective: meta.objective, difficulty: meta.difficulty, type: meta.type,
      curriculumYear: meta.curriculumYear || null,
      misconceptionCategory: meta.misconceptionCategory || null,
      teacherNote: meta.teacherNote || null,
      text: inst.text, illustration: inst.illustration || null,
      options, correctIndex,
      explanation: inst.explanation, misconception: inst.misconception
    });
  }
}

// ---- write questions.js ----
const header = `/* ============================================================
   PTO KS1 MATHS SKILLS CHECK — QUESTION BANK  (Version 1.1)
   ------------------------------------------------------------
   Plain data. Loaded directly by the website (no build step).
   ${questions.length} questions across the full KS1 Maths curriculum.

   Each assessment randomly selects 30 questions with balanced
   curriculum coverage (see app.js -> selectAssessment).

   To EDIT a question: find it below and change the text/options.
   To ADD questions in bulk: use tools/generate-questions.js and
   re-run it with Node (optional — not needed to run the site).
   ============================================================ */

const PTO_STRANDS = ${JSON.stringify(STRANDS, null, 2)};

const PTO_QUESTIONS = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync(process.argv[2] || "questions.js", header);

// ---- report ----
console.log("TOTAL questions:", questions.length);
console.log("By strand:");
for (const k of Object.keys(STRANDS)) {
  const n = questions.filter(q => q.strand === k).length;
  const skills = new Set(questions.filter(q=>q.strand===k).map(q=>q.skillId)).size;
  console.log(`  ${k.padEnd(4)} ${String(n).padStart(3)}  (${skills} skills)`);
}
console.log("Illustration types used:",
  [...new Set(questions.filter(q=>q.illustration).map(q=>q.illustration.type))].join(", "));
console.log("Questions with illustrations:", questions.filter(q=>q.illustration).length);
