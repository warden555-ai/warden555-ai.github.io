/* =====================================================================
   HYPERGLYPH MANUSCRIPT VIEW — Shannon's slot-language reader
   ---------------------------------------------------------------------
   Shannon's model: Voynich "words" are not words. They are SLOT-WORDS
   (hyperglyphs) — up to three slot-syllables that work like a rebus:
   small picture-pieces that combine into a pointer ("see page 17,
   figure 4"). Click a blue hyperglyph and the view jumps to the folio it
   points to, then shows its emoji rebus (one emoji per slot) plus the
   predicted meaning composed from Shannon's slot dictionary (April 2026
   sessions).

   CLICK BEHAVIOR ("showHyper") — like the old clickable manuscript:
     Click a blue hyperglyph word and the view JUMPS to the folio its slots
     point to (anchor of the word's first known slot), then shows the rebus
     panel at the top of the destination: emoji rebus + predicted meaning,
     with a "from <word> on folio <X>" note. Words with no known slots,
     or whose anchor is the folio already showing, read in place instead.

   CLICKABLE RULE ("isHyperglyph"):
     A token is clickable iff it contains one of the multi-character
     slot affixes [daiin aiin dai che she qo ol dy iin ot sh ar], OR it
     is exactly "k" or "p" standing alone.
     Single letters k/p INSIDE longer tokens do NOT count — otherwise
     ~84% of the manuscript lights up again (the "Christmas tree"
     problem this view exists to fix). Measured on boxes.json:
       strict (k/p count anywhere): 83.8% of tokens clickable
       this rule (k/p standalone only): 74.7% clickable
     vs the old view: 100%. The rebus panel does the rest of the work.

   SEGMENTATION ("segmentSlots"):
     Greedy longest-match left-to-right over SLOT_KEYS. Any run of
     characters that matches no key collapses into ONE unknown part
     ("?"). Examples:
       shedy    -> she | dy            -> ❓📦
       qokeedy  -> qo | k | ee | dy     -> 🌊🔗❓📦
       qodaiin  -> qo | daiin          -> 🌊💧
       qo (alone) -> qo                -> 🌊

   REBUS + PREDICTED MEANING ("rebusFor"):
     One emoji per part, in order. Meanings joined plainly:
       2 parts  -> "A of B"      (e.g. qo+daiin -> "flow of life")
       3+ parts -> "A + B + C"   (e.g. qo+k+ee+dy -> "flow + connect + ? + thing")
     Unknown parts render as ❓ / "?".

   ANCHORS:
     Reuses the site's existing dest map (boxes.js BOXES.dest — "the page
     where that glyph lives most"). One override: qo -> 87v, the
     CONFIRMED label (standalone "qo" photographed on a jar drawing,
     folio 87v, pharmaceutical section; dest map said 76r).
     dai/iin never stand alone and have no dest entries, so they inherit
     the anchor of their commonest carrier (daiin -> 89r2 / aiin -> 67r2).
     "she" is UNDETERMINED (❓) until Shannon names it; its provisional
     reading "source?" comes from the site's existing emoji table.

   The slot breakdown is shown for transparency but is NOT clickable —
   per Shannon: click the WHOLE word, get the rebus. Slots are never
   clicked into.
   ===================================================================== */

const SLOT_KEYS = ["daiin","aiin","dai","che","she","qo","ol","dy","iin","ot","sh","ar","k","p",
  /* appended 2026-10-06 (full inventory): checked LAST, so every pre-existing
     segmentation is unchanged — these only split previously-unknown runs */
  "ch","ee","ey","or","al","ain","y","o"];

const SLOT_INFO = {
  qo:    {emoji:"\uD83C\uDF0A", meaning:"flow",       note:"often with water, cycles",                 anchor:"87v"},
  dy:    {emoji:"\uD83D\uDCE6", meaning:"thing",      note:"common noun suffix",                       anchor:"45r"},
  ol:    {emoji:"\uD83C\uDFFA", meaning:"container",  note:"vessel; often plant / liquid themes",      anchor:"78v"},
  aiin:  {emoji:"\uD83E\uDEE7", meaning:"life/water", note:"",                                        anchor:"67r2"},
  dai:   {emoji:"\uD83D\uDCA7", meaning:"life",       note:"",                                        anchor:"89r2"},
  daiin: {emoji:"\uD83C\uDF27\uFE0F", meaning:"life",       note:"whole-unit form of dai+iin \u2014 Shannon's 'raiin'",               anchor:"89r2"},
  k:     {emoji:"\uD83D\uDD17", meaning:"connect",    note:"link; relationships, patterns",            anchor:"57v"},
  che:   {emoji:"\uD83D\uDD04", meaning:"change",     note:"",                                        anchor:"105v"},
  iin:   {emoji:"\uD83D\uDCA6", meaning:"water",      note:"bound suffix — never stands alone",        anchor:"67r2"},
  ot:    {emoji:"\uD83D\uDEE4\uFE0F", meaning:"path", note:"",                                        anchor:"67r1"},
  sh:    {emoji:"\u26F2",       meaning:"source",     note:"",                                        anchor:"66r"},
  ar:    {emoji:"\u26A1",       meaning:"action",     note:"",                                        anchor:"67r2"},
  p:     {emoji:"\u2728",       meaning:"create",     note:"",                                        anchor:"49v"},
  she:   {emoji:"\u2753",       meaning:"source?",    note:"UNDETERMINED — Shannon hasn't named it yet", anchor:"43r"},
  ch:    {emoji:"\u2753", meaning:"undetermined", note:"inventory 2026-10-06", anchor:null},
  ee:    {emoji:"\u2753", meaning:"undetermined", note:"inventory 2026-10-06", anchor:null},
  ey:    {emoji:"\u2753", meaning:"undetermined", note:"inventory 2026-10-06", anchor:null},
  or:    {emoji:"\u2753", meaning:"undetermined", note:"inventory 2026-10-06", anchor:null},
  al:    {emoji:"\u2753", meaning:"undetermined", note:"inventory 2026-10-06", anchor:null},
  ain:   {emoji:"\u2753", meaning:"undetermined", note:"inventory 2026-10-06", anchor:null},
  y:     {emoji:"\u2753", meaning:"undetermined", note:"inventory 2026-10-06", anchor:null},
  o:     {emoji:"\uD83C\uDF00", meaning:"flow",  note:"variant of qo- \u2014 Shannon's label", anchor:null}
};

/* Multi-char affixes that make a token a hyperglyph by containment. */
const MULTI = ["daiin","aiin","dai","che","she","qo","ol","dy","iin","ot","sh","ar",
  "ch","ee","ey","or","al","ain"];

/* =====================================================================
   SLOT ALPHABET — Shannon's key (display only; drives the chart, never
   the segmenter). Dash convention: "qo-" prefix, "-dy" suffix, "-she-"
   midfix. Confidence: confirmed / provisional / undetermined / variant.
   o, y, -k- are chart-only entries and are NOT in SLOT_KEYS.
   ===================================================================== */
const ALPHABET = [
  {slot:"qo-",   emoji:"\uD83C\uDF0A", meaning:"flow",                example:"qodaiin",  conf:"confirmed",    note:"often with water, cycles"},
  {slot:"-dy",   emoji:"\uD83D\uDCE6", meaning:"thing",               example:"shedy",    conf:"confirmed",    note:"common noun suffix"},
  {slot:"ol-",   emoji:"\uD83C\uDFFA", meaning:"container / vessel",  example:"olchedy",  conf:"confirmed",    note:"often plant / liquid themes"},
  {slot:"dai-",  emoji:"\uD83D\uDCA7", meaning:"life",                example:"daiin",    conf:"confirmed",    note:""},
  {slot:"-aiin", emoji:"\uD83E\uDEE7", meaning:"life / water",        example:"daiin",    conf:"confirmed",    note:""},
  {slot:"-iin",  emoji:"\uD83D\uDCA6", meaning:"water",               example:"daiin",    conf:"confirmed",    note:"bound suffix — never stands alone"},
  {slot:"k-",    emoji:"\uD83D\uDD17", meaning:"connect / link",      example:"qokeedy",  conf:"confirmed",    note:"relationships, patterns"},
  {slot:"che-",  emoji:"\uD83D\uDD04", meaning:"change",              example:"olchedy",  conf:"confirmed",    note:""},
  {slot:"-ot",   emoji:"\uD83D\uDEE4\uFE0F", meaning:"path",          example:null,       conf:"provisional",  note:""},
  {slot:"sh-",   emoji:"\u26F2",       meaning:"source",              example:"shedy",    conf:"provisional",  note:""},
  {slot:"-ar",   emoji:"\u26A1",       meaning:"action",              example:null,       conf:"provisional",  note:""},
  {slot:"p-",    emoji:"\u2728",       meaning:"create",              example:null,       conf:"provisional",  note:""},
  {slot:"-she-", emoji:"\u2753",       meaning:"undetermined",        example:"shedy",    conf:"undetermined", note:"Shannon to name"},
  {slot:"o-",    emoji:"\uD83C\uDF00", meaning:"flow",                example:null,       conf:"variant",      note:"prefix variant of qo-"},
  {slot:"-y",    emoji:"\u2753",       meaning:"undetermined",        example:null,       conf:"undetermined", note:"common ending"},
  {slot:"-k-",   emoji:"\u2753",       meaning:"undetermined",        example:null,       conf:"undetermined", note:"common midfix"}
];

function isHyperglyph(w){
  if(w==="k"||w==="p"||w==="y"||w==="o") return true;  /* standalone single-letter slots */
  /* A word is a hyperglyph iff the segmenter actually finds a multi-char
     slot in it — not mere substring containment, which over-matches now
     that the inventory added short affixes like "or"/"al" (inventory
     2026-10-06: this keeps the Christmas-tree problem fixed). */
  const parts=segmentSlots(w);
  for(const p of parts){ if(p.key && MULTI.indexOf(p.key)!==-1) return true; }
  return false;
}

function segmentSlots(t){
  const parts=[]; let i=0;
  while(i<t.length){
    let hit=null;
    for(const k of SLOT_KEYS){ if(t.startsWith(k,i)){ hit=k; break; } }
    if(hit){ parts.push({key:hit}); i+=hit.length; }
    else{
      let j=i+1;
      while(j<t.length){
        let h2=null;
        for(const k of SLOT_KEYS){ if(t.startsWith(k,j)){ h2=k; break; } }
        if(h2) break;
        j++;
      }
      parts.push({key:null, raw:t.slice(i,j)});
      i=j;
    }
  }
  return parts;
}

function rebusFor(t){
  const parts=segmentSlots(t.toLowerCase());
  const emojis=parts.map(p=>p.key?SLOT_INFO[p.key].emoji:"\u2753").join("");
  const meanings=parts.map(p=>p.key?SLOT_INFO[p.key].meaning:"?");
  const predicted = meanings.length===2
    ? meanings[0]+" of "+meanings[1]
    : meanings.join(" + ");
  return {parts:parts, emojis:emojis, predicted:predicted};
}

function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

/* ---------------- rendering (browser only) ---------------- */

function currentFolio(){
  const sel=document.getElementById("foliosel");
  return sel?sel.value:"1r";
}

/* The folio a hyperglyph word points to: the anchor of its first known
   slot. Null when the word has no known slots at all. */
function anchorForWord(t){
  const parts=segmentSlots(t.toLowerCase());
  for(const p of parts){
    if(p.key && SLOT_INFO[p.key] && SLOT_INFO[p.key].anchor) return SLOT_INFO[p.key].anchor;
  }
  return null;
}

function folioOptionExists(f){
  const sel=document.getElementById("foliosel");
  if(!sel) return false;
  for(const o of sel.options){ if(o.value===f) return true; }
  return false;
}

/* The panel's home is the slot right above the reader. A previous jump
   may have moved it inside the reader — pull it back out first. */
function panelHome(){
  const panel=document.getElementById("hpanel");
  const rd=document.getElementById("reader");
  if(panel && rd && panel.parentNode===rd) rd.parentNode.insertBefore(panel, rd);
}

function goAnchor(f){
  const sel=document.getElementById("foliosel");
  if(sel){
    let found=false;
    for(const o of sel.options){ if(o.value===f){ found=true; break; } }
    if(found){ sel.value=f; renderHyperfolio(); }
  }
  const rd=document.getElementById("reader");
  if(rd) rd.scrollIntoView({behavior:"smooth",block:"start"});
}

function renderHyperfolio(){
  const f=currentFolio();
  const lines=(typeof HGLYPH_FOLIOS!=="undefined" && HGLYPH_FOLIOS[f])||[];
  const pane=document.getElementById("reader");
  const stats=document.getElementById("foliostats");
  let nTok=0, nHyp=0;
  const html=lines.map(ln=>{
    const toks=ln.split(".").map(w=>w.trim()).filter(w=>w);
    const tline=toks.map(w=>{
      nTok++;
      if(isHyperglyph(w)){
        nHyp++;
        return '<span class="hlink" onclick="showHyper(\''+esc(w)+'\')">'+esc(w)+"</span>";
      }
      return '<span class="hplain">'+esc(w)+"</span>";
    }).join(" ");
    return '<div class="tline">'+tline+"</div>";
  }).join("");
  pane.innerHTML='<h3 style="margin:6px 0">Folio '+esc(f)+
    ' <span class="tag">'+lines.length+" lines</span></h3>"+html;
  if(stats) stats.textContent=nHyp+" hyperglyphs of "+nTok+" tokens on this folio";
}

function showHyper(t){
  const from=currentFolio();
  const dest=anchorForWord(t);
  const panel=document.getElementById("hpanel");
  const rd=document.getElementById("reader");
  panelHome(); /* pull the panel out of the reader if a previous jump left it there */
  if(dest && dest!==from && folioOptionExists(dest)){
    /* Like the old clickable manuscript: jump to the folio the word points to,
       and read its rebus there. */
    document.getElementById("foliosel").value=dest;
    renderHyperfolio();
    panel.hidden=false;
    panel.innerHTML=hyperPanelHTML(t, from);
    rd.insertBefore(panel, rd.firstChild);
  } else {
    /* No meaningful anchor (or already there) — read it where it stands. */
    panel.hidden=false;
    panel.innerHTML=hyperPanelHTML(t, null);
  }
  panel.scrollIntoView({behavior:"smooth",block:"start"});
}

function hyperPanelHTML(t, fromFolio){
  const r=rebusFor(t);
  const panelNote=fromFolio
    ? '<div class="tag" style="margin-bottom:6px">\uD83D\uDCCD from &quot;'+esc(t)+
      '&quot; on folio '+esc(fromFolio)+' — jumped to its anchor</div>'
    : '';
  const slotLine=r.parts.map(p=>{
    if(p.key){
      const info=SLOT_INFO[p.key];
      return '<span class="hslot"><span class="hem">'+info.emoji+'</span> <b>'+esc(p.key)+
        '</b> <span class="tag">'+esc(info.meaning)+"</span></span>";
    }
    return '<span class="hslot"><span class="hem">\u2753</span> <b>'+esc(p.raw)+
      '</b> <span class="tag">unmapped</span></span>';
  }).join(" ");
  const seen={};
  const anchors=r.parts.filter(p=>p.key&&SLOT_INFO[p.key].anchor&&!seen[p.key]&&(seen[p.key]=1))
    .map(p=>{
      const info=SLOT_INFO[p.key];
      return '<button class="anchorbtn" onclick="goAnchor(\''+info.anchor+"\')\">"+
        info.emoji+" "+esc(p.key)+" \u2192 "+esc(info.anchor)+"</button>";
    }).join(" ");
  return panelNote+
    '<div class="hwordrow"><span class="hword">'+esc(t)+"</span>"+
    '<span class="hrebus">'+r.emojis+"</span></div>"+
    '<div class="hpredicted">predicted: <b>'+esc(r.predicted)+"</b></div>"+
    '<div class="hslotsline"><span class="tag">slots:</span> '+slotLine+"</div>"+
    (anchors?'<div class="hanchors"><span class="tag">anchors:</span> '+anchors+"</div>":"")+
    '<div class="tag" style="margin-top:6px">Click another blue word to read it. Blue words are the only links on this page.</div>';
}

function buildAlphabet(){
  const host=document.getElementById("alphabet");
  if(!host) return;
  host.innerHTML=ALPHABET.map(a=>
    '<div class="acell"><div class="aglyph">'+esc(a.slot)+"</div>"+
    '<div class="aemoji">'+a.emoji+"</div></div>"
  ).join("");
}

function initHyperglyph(){
  const sel=document.getElementById("foliosel");
  if(sel && typeof HGLYPH_ORDER!=="undefined"){
    HGLYPH_ORDER.forEach(f=>{
      const o=document.createElement("option"); o.value=f; o.textContent=f;
      sel.appendChild(o);
    });
    sel.value="1r";
    /* Deep link from the Glyph Library pictures panel: hyperglyph.html#folio=45r */
    const hm=String(location.hash||"").match(/folio=([0-9]+[rv][12]?)/);
    if(hm && folioOptionExists(hm[1])) sel.value=hm[1];
    sel.addEventListener("change",renderHyperfolio);
  }
  buildAlphabet();
  renderHyperfolio();
}

if(typeof document!=="undefined"){
  document.addEventListener("DOMContentLoaded",initHyperglyph);
}
