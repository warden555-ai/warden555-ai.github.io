# Full slot inventory — from the site transcription (boxes.json)

Date: 2026-10-06. Method: greedy longest-match segmentation of all 37,464 EVA tokens
with the extended key set (16 known + ch, ee, ey, or, al, ain, y, o appended last,
so existing segmentations are unchanged). Each part tallied by position class:
first part = prefix, last part = suffix, middle = midfix, lone part = whole.
Library page shows slots with total ≥100; the long tail (<100, mostly rare
fragments) is omitted from the page but counted here in spirit.

## Prefixes

| slot | n | example |
|---|---:|---|
| ch- | 5940 | chkaiin |
| qo- | 5260 | qopchypcho |
| che- | 4961 | chey |
| d- | 3113 | dchor |
| -ot | 2737 | oty |
| -she- | 2573 | shey |
| s- | 2221 | soiin |
| sh- | 1884 | shor |
| l- | 1656 | lchol |
| cth- | 785 | cthor |
| dai- | 770 | daiiin |
| r- | 759 | rokyd |
| ai- | 102 | aiiin |

## Middles

| slot | n | example |
|---|---:|---|
| k- | 10828 | kaiin |
| o- | 9072 | oporody |
| -ee- | 3486 | eeedy |
| -e- | 2584 | eosaiin |
| -t- | 2483 | tchy |
| p- | 1617 | pchor |
| daiin | 1367 | daiinls |
| -c- | 1126 | cphol |
| -h- | 976 | hy |
| -te- | 351 | teo |
| -f- | 349 | fochor |
| dam | 180 | damo |
| -ed- | 141 | eddy |
| -he- | 120 | ckheol |
| -a- | 105 | akarar |

## Suffixes

| slot | n | example |
|---|---:|---|
| -y | 9251 | ykey |
| -dy | 6827 | dytchdy |
| ol- | 5312 | olcfholy |
| -ar | 3221 | ary |
| -al | 3078 | aloly |
| -or | 2713 | orchey |
| -aiin | 2447 | aiinog |
| -ey | 1444 | sheeyl |
| -ain | 1293 | ainy |
| -am | 442 | amod |
| -n | 431 | dainaldy |
| -iin | 364 | daiiine |
| -air | 275 | airody |
| -m | 248 | mar |
| -es | 152 | oeeesary |

## Notes

- Dash labels keep Shannon's original convention; **grouping follows the data** (dominant position).
- Position surprises vs his original labels: `ol` is mostly a **suffix** (2814 suffix vs 1055 prefix),
  `k` is overwhelmingly a **midfix** (9611 midfix), `ot` is overwhelmingly a **prefix** (2402 prefix),
  `p` leans midfix, `she` leans prefix. His meanings are untouched — only the grouping moved.
- New heavy slots he hadn't named: `ch-` (5940, prefix), `-ee-` (3486, midfix), `d-` (3113, prefix),
  `-al` (3078, suffix), `-or` (2713, suffix), `-e-` (2584, midfix), `-t-` (2483, midfix),
  `s-` (2221, prefix), `l-` (1656, prefix), `-ey` (1444, suffix), `-ain` (1293, suffix).
- Promoted into the segmenter (appended last, existing behavior preserved): ch, ee, ey, or, al, ain, y, o.
- Single-letter candidates NOT promoted (fragmentation risk; kept as ❓ library entries): e, d, s, t, l, c, r, n.
- `daiin` (1367) is treated as a whole-word unit (Shannon's framework), not an affix.
- Emoji rule (Shannon, 2026-10-06): every slot gets a unique emoji. De-duplicated: o- 🌀 (was 🌊),
  -aiin 🫧 (was 💧), -iin 💦 (was 💧). daiin 🌧️
  (Shannon's own 'raiin' joke). Undetermined slots stay ❓.
