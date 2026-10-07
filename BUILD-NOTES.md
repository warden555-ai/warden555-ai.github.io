# Hyperglyph Manuscript view — build notes

Date: 2026-10-06. Local read-only build in this clone. **Nothing was pushed.**
Existing pages' behavior untouched; only additive changes (new files + two nav links).

## What was added

- **`hyperglyph.html`** — new page: "🧩 Hyperglyph Manuscript", Shannon's slot-language reader.
  Same visual style as the rest of the site (Georgia/parchment). Sections: explainer note,
  folio selector + per-folio hyperglyph count, reading pane, Slot Alphabet chart
  (replaced the original slot legend table on 2026-10-06 evening).
- **`hyperglyph.js`** — all the logic (segmenter, rebus builder, renderer, panel).
- **`hyperglyph-data.js`** — generated file: the 202 folio-sides of dot-separated EVA token
  lines + folio order, extracted verbatim from `index.html`'s embedded DATA. Regenerate from
  index.html if the transcription updates; do not hand-edit.
- Nav links added (additive only) to the topnav of `index.html` and `manuscript.html`:
  `🧩 Hyperglyph Manuscript`.

## Interaction design (per Shannon's redirect, 2026-10-06 evening)

**NOT** click-word → split into clickable slots → click slot. Instead:

1. Only **slot-words** are blue/clickable. Everything else renders as plain text.
2. Clicking the **whole composite word** opens a panel showing:
   - the word, large;
   - its **emoji rebus** — one emoji per slot (e.g. `shedy` → ❓📦);
   - the **predicted meaning**, composed from slot meanings
     (e.g. `shedy` → "source? of thing"; `qodaiin` → "flow of life");
   - the slot breakdown as plain info (never clickable);
   - **anchor buttons** (secondary line) jumping to each slot's anchor folio *within this view*.
3. Legend table on the page maps every slot: emoji | affix | meaning | anchor | note.
   `she` is marked **UNDETERMINED** (❓) until Shannon names it.

## Clickable-token rule

A token is a hyperglyph iff it contains a multi-character slot affix
`[daiin aiin dai che she qo ol dy iin ot sh ar]`, or is exactly `k` / `p` alone.
Single letters k/p *inside* longer tokens do **not** count — otherwise 83.8% of the
manuscript lights up again (the "Christmas tree" problem this view exists to fix).
Measured: strict rule 83.8% clickable → this rule **77.1%** clickable (old view: 100%).

Honest flag: 77% is still most words, because the Voynich vocabulary is built out of
these affixes — that is a linguistic fact of the transcription, not a UI failure.
If Shannon wants it sparser, options: (a) only multi-affix composites,
(b) only top-N slot-words, (c) only standalone slots. His call.

## Segmentation approach

Greedy longest-match left-to-right over the key list
`[daiin aiin dai che she qo ol dy iin ot sh ar k p]`. Runs of characters matching
nothing collapse into a single unknown part (`?` / ❓). Documented in a comment block
at the top of `hyperglyph.js`, with worked examples.

Predicted-meaning composition: 2 parts → `"A of B"`; 3+ parts → `"A + B + C"`.
Unknown parts render as `?`. `she` reads as `source?` (provisional, from the site's
existing emoji table) with ❓ emoji and an explicit "undetermined" flag in the legend —
judgment call, documented here so Shannon can rename it.

## Anchors

Reuses the site's existing dest map (`BOXES.dest` in `manuscript-pages/boxes.js` —
"the page each glyph lives most on"), with data-driven fallbacks:
- `qo` → **87v** (override: the CONFIRMED label — standalone "qo" on a jar drawing,
  folio 87v; the dest map said 76r).
- `dai`/`iin` never stand alone and have no dest entries → inherit the anchor of their
  commonest carrier (`daiin` → 89r2, `aiin` → 67r2).
- Full anchor table is in `SLOT_INFO` at the top of `hyperglyph.js`.

## Emoji assignments (per Shannon's redirect)

qo 🌊 flow · dy 📦 thing · ol 🏺 container · aiin/dai 💧 life/water · k 🔗 connect ·
che 🔄 change · iin 💧 water · ot 🛤️ path · sh ⛲ source · ar ⚡ action · p ✨ create ·
she ❓ undetermined.

## Testing

- `node --check` clean on `hyperglyph.js` and `hyperglyph-data.js`.
- Functional test in node: segmentation, rebus, predicted meanings, clickable rule,
  clickable fraction — all correct (`shedy`→❓📦 "source? of thing",
  `qodaiin`→🌊💧 "flow of life", `qokeedy`→🌊🔗❓📦 "flow + connect + ? + thing").
- UI paths verified against a DOM stub: folio selector (202 options), panel render,
  anchor jump, legend (14 rows). No headless browser was available in this environment,
  so no screenshot — worth one eyeball pass in a real browser before pushing.

## Slot Alphabet chart (added 2026-10-06, evening — Shannon's request)

The old legend table on `hyperglyph.html` is now **🔤 Slot Alphabet — Shannon's key**:
a card-per-slot chart (big glyph, big emoji, meaning, example word, confidence
pill), phone-glanceable. Header explainer: "Read a word's emojis left to right —
that's the rebus. The predicted meaning follows."

- 16 entries: 8 confirmed · 4 provisional · 3 undetermined · 1 variant.
  Undetermined: `-she-` ("Shannon to name"), `-y` (common ending), `-k-` (common
  midfix). Variant: `o-` (prefix variant of qo-, flow).
- Example words are tappable — they open the word's rebus panel, so the chart
  doubles as a demo. Predicted meanings are computed live via `rebusFor`
  (e.g. `qodaiin` → 🌊💧 "flow of life"; `olchedy` → 🏺🔄📦 "container + change + thing").
- `o`, `y`, `-k-` are **chart-only**: they are NOT in `SLOT_KEYS` and never
  affect segmentation (verified in node test).
- `che` emoji corrected 🔁 → 🔄 so the chart and the click panels agree.
- Implementation: `ALPHABET` array + `buildAlphabet()` in `hyperglyph.js`;
  `.acard`/`.aglyph`/`.aemoji`/`.conf-*` CSS in `hyperglyph.html`.
  Anchor column dropped from the chart (anchors still live in the click panel).

## What still needs the fuller slot map

- `she` needs its true name (currently ❓ / "source?").
- Unmapped middles (e.g. the `ee` in `qokeedy`) are the next naming targets.
- The 29 currently-UNVERIFIED standalone hits (coordinate misalignment in boxes.json)
  could yield more confirmed labels → more anchors.
- Anchor quality improves as the label-vs-text classification completes; the
  `SLOT_INFO` anchor table is designed to be edited as that lands.
- Consider Shannon's sparser-clickable options above once he's seen this version.

## Fix round 2 (2026-10-06 evening — Shannon's review of the live page)

1. **Alphabet shrunk.** `.aglyph` 30px→17px (min-width 88→60px), `.aemoji`
   40px→24px (min-width 56→40px), `.acard` padding 10/14→6/10px, margin
   8→5px, gap 14→10px; `.ameaning` 18→15px, `.aexample` 16→14px.
   Roughly half size, still glanceable on a phone.
2. **Click now navigates (old-manuscript behavior).** `showHyper(t)` computes
   the word's anchor via new `anchorForWord(t)` (anchor of the first known
   slot). If the anchor differs from the current folio and exists in the
   folio selector, the view jumps there and the rebus panel renders at the
   top of the destination with a "📍 from "<word>" on folio <X> — jumped to
   its anchor" note. New helpers: `folioOptionExists(f)`, `panelHome()`
   (recovers the panel if a previous jump left it inside the reader before
   `renderHyperfolio()` wipes it), and `hyperPanelHTML(t, fromFolio)` holding
   the shared panel markup. Words with no known slots, anchors missing from
   the selector, or anchor == current folio read in place (previous
   behavior). Anchor buttons inside the panel still jump in-view via
   `goAnchor`. Explainer note on the page and the JS header comment updated.
3. **Mentors findable.** `🤝 Mentors` link added to the topnav of
   `index.html` and `hyperglyph.html`, pointing at `backstory.html#mentors`
   (the section added earlier this evening).

Testing: `node --check` clean; DOM-stub functional tests all pass —
jump-to-anchor with from-note and panel-at-top, in-place fallback for
unknown/unlisted/same-folio anchors, panel recovery after consecutive
jumps, reader content intact, segmentation and clickable rule unchanged.

## Full inventory + Glyph Library page (2026-10-06 night — Shannon: "all of them")

**Inventory.** Greedy longest-match segmentation of all 37,464 EVA tokens in
`manuscript-pages/boxes.json`, parts tallied by position (first=prefix,
last=suffix, middle=midfix). Full tables: `slot-inventory-full.md`
(43 slots at n≥100 shown; 415 rarer fragments omitted from the page).

**New slots promoted into the segmenter** (appended LAST in SLOT_KEYS, so every
pre-existing segmentation is byte-identical): `ch ee ey or al ain y o`.
Verified: shedy→she|dy, qodaiin→qo|daiin, chedy→che|dy, qokeedy→qo|k|ee|dy
all unchanged in their known parts; only previously-unknown runs split finer.
Single-letter candidates NOT promoted (fragmentation risk — kept as ❓ library
entries): e d s t l c r n f h m a.

**New heavy slots Shannon hadn't named** (all ❓, all his to name):
ch- (5940, prefix), -ee- (3486, midfix), d- (3113, prefix), -al (3078, suffix),
-or (2713, suffix), -e- (2584, midfix), -t- (2483, midfix), s- (2221, prefix),
l- (1656, prefix), -ey (1444, suffix), -ain (1293, suffix).

**Position surprises** (his meanings untouched; only grouping follows the data):
`ol` is mostly a SUFFIX (2814 suffix vs 1055 prefix), `k` is overwhelmingly a
MIDFIX (9611 midfix), `ot` is overwhelmingly a PREFIX (2402 prefix), `p` leans
midfix, `she` leans prefix. His dash labels are kept as-is everywhere; the
Glyph Library groups by dominant position.

**Unique-emoji rule** (Shannon: no repeats anywhere in the library).
De-duplicated: o- 🌀 (was 🌊), -aiin 🫧 (was 💧), -iin 💦 (was 💧).
daiin (whole-unit, SLOT_INFO only) → 🌧️ — Shannon's own "raiin" joke.
Undetermined slots stay ❓ (repeats of ❓ allowed — they're all unnamed).
Verified zero duplicate emojis across ALPHABET and SLOT_INFO.

**Clickable-token rule refined.** `isHyperglyph` now uses segmented-part
matching instead of substring containment: a word is clickable iff the
segmenter finds a real multi-char slot in it (or it's a standalone k/p/y/o).
Zero regressions vs the old rule (no previously-clickable word lost);
newly clickable are principled additions: or al dal chor okeey chy y okain
ain o dor cho. Clickable fraction: 77.1% → **92.9%** — honest linguistic
fact (the new affixes really are everywhere), but high: Shannon's sparser
options (multi-affix composites only / top-N / standalone-only) still open.

**Glyph Library page** (`glyph-library.html`): standalone page, 43 slots in
stacked glyph-over-emoji cells with counts, grouped Prefixes (13) / Middles
(15) / Suffixes (15), sorted by frequency. ❓ = Shannon hasn't named it.
Nav: 📚 Glyph Library linked from index.html, manuscript.html, hyperglyph.html
topnavs. The small Emoji Library grid on hyperglyph.html is unchanged (his
16-slot quick key, deduped emojis applied).

Testing: node --check clean; rebus sanity (shedy→❓📦 "source? of thing",
qokeedy→🌊🔗❓📦, qodaiin→🌊🌧️ "flow of life", daiin→🌧️ "life"); emoji
uniqueness asserted in node; library page structurally validated (43 cells,
3 sections). No headless browser — eyeball pass still recommended.
