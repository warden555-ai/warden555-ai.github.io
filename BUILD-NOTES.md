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
