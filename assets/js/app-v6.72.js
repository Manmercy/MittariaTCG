const CARD_BACK_URI = 'assets/embedded/mittaria_card_back_web.jpg';

// ============================================================
// LANGUAGE / UI TEXT
// ============================================================
let currentLang = 'en';
try {
  const savedLanguage = localStorage.getItem('mittaria_language');
  if (savedLanguage === 'th' || savedLanguage === 'en') currentLang = savedLanguage;
} catch(e) {}
const UI = {
  en: {
    how:'HOW TO PLAY', play:'PLAY TEST', lang:'TH', back:'← Back', menu:'← Menu', title:'HOW TO PLAY',
    crystal:'Crystal', turn:'Turn', battle:'⚔️ Battle', end:'End Turn →', aiGates:'AI GATES', yourGates:'YOUR GATES', decks:'DECKS',
    aiDeck:'AI Deck', yourDeck:'Your Deck', aiHand:'AI Hand', yourHand:'Your Hand', gameLog:'GAME LOG', choosePosition:'Choose Position',
    sacrifice:'Sacrifice for Cost', cancel:'Cancel', confirm:'Confirm', playAgain:'Play Again', noSac:'No characters to sacrifice',
    selectEnemy:'Select Enemy Target', selectYourChar:'Select Your Character', selectRevive:'Select Character to Return to Hand', noTarget:'No valid targets',
    place:'+ Place', companion:'Companion', attackGate:'Attack Gate', atk:'ATTACK', guard:'GUARD'
  },
  th: {
    how:'วิธีเล่น', play:'ทดลองเล่น', lang:'EN', back:'← กลับ', menu:'← เมนู', title:'วิธีเล่น',
    crystal:'Cost', turn:'เทิร์น', battle:'⚔️ ต่อสู้', end:'จบเทิร์น →', aiGates:'GATE ฝั่ง AI', yourGates:'GATE ของคุณ', decks:'กองการ์ด',
    aiDeck:'Deck AI', yourDeck:'Deck คุณ', aiHand:'มือ AI', yourHand:'มือคุณ', gameLog:'บันทึกเกม', choosePosition:'เลือกตำแหน่ง',
    sacrifice:'สังเวยเพื่อจ่าย Cost', cancel:'ยกเลิก', confirm:'ยืนยัน', playAgain:'เล่นใหม่', noSac:'ไม่มี Character ให้สังเวย',
    selectEnemy:'เลือกเป้าหมายฝ่ายตรงข้าม', selectYourChar:'เลือก Character ของคุณ', selectRevive:'เลือก Character ที่จะคืนขึ้นมือ', noTarget:'ไม่มีเป้าหมายที่ใช้ได้',
    place:'+ วาง', companion:'Companion', attackGate:'โจมตี Gate', atk:'โจมตี', guard:'ป้องกัน'
  }
};
function t(key){ return (UI[currentLang] && UI[currentLang][key]) || UI.en[key] || key; }
function toggleLanguage(){
  currentLang = currentLang === 'en' ? 'th' : 'en';
  try { localStorage.setItem('mittaria_language', currentLang); } catch(e) {}
  loadAiMode();
  console.log('MITTARIA TCG Loaded:', BUILD_VERSION);
  updateLanguageUI();
  if (G?.ai && G?.player) render();
  if(document.getElementById('sc-cardlist')?.classList.contains('on')) renderCardList();
  if(document.getElementById('sc-deckbuilder')?.classList.contains('on')) renderDeckBuilder();
}
function setText(id, text){ const el=document.getElementById(id); if(el) el.textContent=text; }
function howToPlayMarkup(lang){
  if(lang === 'th') return `
    <div class="how-quick"><div class="how-quick-title">เริ่มเล่นใน 5 ขั้นตอน</div><div class="how-quick-grid"><div><b>1</b><strong>SETUP</strong><span>Deck 40 ใบ • วาง Gate 5 ใบ • จั่ว 5 ใบ</span></div><div><b>2</b><strong>DRAW</strong><span>จั่ว 2 ใบ • มือสูงสุด 7 ใบ</span></div><div><b>3</b><strong>MAIN</strong><span>ลง Character, Companion หรือ Spell</span></div><div><b>4</b><strong>BATTLE</strong><span>โจมตีเป้าหมายในเลนเดียวกัน</span></div><div><b>5</b><strong>WIN</strong><span>เปิดเลนและลด Lead LP เหลือ 0</span></div></div></div>
    <div class="how-sec how-objective"><h2>เป้าหมาย</h2><p>MITTARIA TCG เป็นเกม 1v1 ใช้สนาม 5 เลน ทำลาย Gate เพื่อเปิดทางโจมตี Lead Card จากนั้นลด LP ของ Lead ฝ่ายตรงข้ามให้เหลือ 0 เพื่อชนะ ไพ่ Gate ที่ถูกทำลายจะเปิดและกลับขึ้นมือเจ้าของ</p></div>
    <div class="how-sec how-deck important-deck-rule"><h2>การจัด Deck</h2><div class="rule-box"><h4>1 Deck = 40 ใบ</h4><p>โควต้า Playtest: <strong>Character 24</strong> / <strong>Companion 8</strong> / <strong>Spell 8</strong> และใส่การ์ดชื่อเดียวกันได้สูงสุด <strong>3 ใบ</strong></p></div></div>
    <div class="how-sec how-types"><h2>ประเภทการ์ด</h2><div class="rule-box"><h4><span class="type-badge tb-char">CHARACTER</span> ตัวหลักบนสนาม</h4><p>ใช้โจมตี ป้องกัน และสังเวยเพื่อจ่าย Crystal Cost เลือก Attack หรือ Guard Formation ตอนลง</p></div><div class="rule-box"><h4><span class="type-badge tb-comp">COMPANION</span> การ์ดสนับสนุน</h4><p>ติดกับ Character เพื่อเพิ่มพลังหรือความสามารถ และออกจากสนามพร้อมตัวที่ติดอยู่</p></div><div class="rule-box"><h4><span class="type-badge tb-spell">SPELL</span> เอฟเฟกต์ทันที</h4><p>ใช้จากมือเพื่อจั่ว ย้ายเลน ชุบชีวิต ซ่อม Gate หรือแก้สถานการณ์</p></div></div>
    <div class="how-sec how-turns"><h2>ลำดับเทิร์น</h2><div class="rule-box"><h4>① Draw</h4><p>จั่ว 2 ใบ ยกเว้นเทิร์นแรกไม่จั่ว มือสูงสุด 7 ใบ</p></div><div class="rule-box"><h4>② Main</h4><p>ลงการ์ด จ่าย Cost ติด Companion ใช้ Spell หรือเปลี่ยน Formation</p></div><div class="rule-box"><h4>③ Battle</h4><p>เลือก Character โจมตีเป้าหมายในเลนเดียวกัน ตัวที่เพิ่งลงยังโจมตีไม่ได้</p></div><div class="rule-box"><h4>④ End</h4><p>จบเทิร์นและส่งการเล่นให้อีกฝ่าย</p></div></div>
    <div class="how-sec how-crystal"><h2>Crystal Cost</h2><p>สังเวย Character บนสนามเพื่อสร้าง Crystal ตามค่า Crystal Value</p><table class="tbl"><tr><th>Character Rarity</th><th>Summon Cost</th><th>Crystal Value</th></tr><tr><td>Common</td><td>0</td><td>1</td></tr><tr><td>Rare</td><td>0</td><td>1</td></tr><tr><td>Epic</td><td>1</td><td>1</td></tr><tr><td>Legendary</td><td>2</td><td>2</td></tr></table></div>
    <div class="how-sec how-combat"><h2>การต่อสู้</h2><table class="tbl"><tr><th>เป้าหมาย</th><th>เปรียบเทียบ</th><th>ผล</th></tr><tr><td>Attack Formation</td><td>ATK vs ATK</td><td>ค่าที่สูงกว่าชนะ อีกฝ่ายถูกทำลาย</td></tr><tr><td>Guard Formation</td><td>ATK vs DEF</td><td>ถ้า ATK สูงกว่า DEF ฝ่ายรับถูกทำลาย</td></tr><tr><td>เสมอ</td><td>ค่าเท่ากัน</td><td>ไม่มีการ์ดถูกทำลาย</td></tr><tr><td>เลนว่างและมี Gate</td><td>โจมตี Gate</td><td>ทำลาย Gate 1 ใบ</td></tr><tr><td>เลนว่างและ Gate ถูกทำลายแล้ว</td><td>Direct Attack</td><td>สร้างความเสียหายต่อ Lead LP</td></tr></table></div>
    <div class="how-sec how-win"><h2>ชนะและแพ้</h2><ul><li>ลด LP ของ Lead Card ฝ่ายตรงข้ามให้เหลือ 0 = ชนะ</li><li>Deck หมดเมื่อต้องจั่ว = แพ้</li></ul></div>`;
  return `
    <div class="how-quick"><div class="how-quick-title">START IN 5 STEPS</div><div class="how-quick-grid"><div><b>1</b><strong>SETUP</strong><span>40-card Deck • 5 Gates • Draw 5</span></div><div><b>2</b><strong>DRAW</strong><span>Draw 2 • Hand limit 7</span></div><div><b>3</b><strong>MAIN</strong><span>Play Characters, Companions, and Spells</span></div><div><b>4</b><strong>BATTLE</strong><span>Attack a target in the same lane</span></div><div><b>5</b><strong>WIN</strong><span>Open a lane and reduce Lead LP to 0</span></div></div></div>
    <div class="how-sec how-objective"><h2>Objective</h2><p>MITTARIA TCG is a 1v1 game played across five lanes. Break a Gate to open its lane, then attack the enemy Lead Card. Reduce the enemy Lead LP to 0 to win. A destroyed Gate is revealed and returned to its owner's hand.</p></div>
    <div class="how-sec how-deck important-deck-rule"><h2>Build a Deck</h2><div class="rule-box"><h4>1 Deck = 40 Cards</h4><p>Playtest quota: <strong>24 Characters</strong> / <strong>8 Companions</strong> / <strong>8 Spells</strong>. Include no more than <strong>3 copies</strong> of the same card.</p></div></div>
    <div class="how-sec how-types"><h2>Card Types</h2><div class="rule-box"><h4><span class="type-badge tb-char">CHARACTER</span> Your field unit</h4><p>Characters attack, guard Gates, and can be sacrificed for Crystal Cost. Choose Attack or Guard Formation when played.</p></div><div class="rule-box"><h4><span class="type-badge tb-comp">COMPANION</span> Attach support</h4><p>Attach to a Character for a stat bonus or ability. It leaves the field with that Character.</p></div><div class="rule-box"><h4><span class="type-badge tb-spell">SPELL</span> Instant effect</h4><p>Play from hand to draw, move lanes, revive a Character, restore a Gate, or change the battle.</p></div></div>
    <div class="how-sec how-turns"><h2>Turn Structure</h2><div class="rule-box"><h4>① Draw</h4><p>Draw 2 cards. The first player draws 0 on turn one. Maximum hand size is 7.</p></div><div class="rule-box"><h4>② Main</h4><p>Play cards, pay Costs, attach Companions, cast Spells, or change Formation.</p></div><div class="rule-box"><h4>③ Battle</h4><p>Choose a Character to attack in the same lane. A newly played Character cannot attack this turn.</p></div><div class="rule-box"><h4>④ End</h4><p>End your turn and pass play to the opponent.</p></div></div>
    <div class="how-sec how-crystal"><h2>Crystal Cost</h2><p>Sacrifice Characters on your field to generate their Crystal Value.</p><table class="tbl"><tr><th>Character Rarity</th><th>Summon Cost</th><th>Crystal Value</th></tr><tr><td>Common</td><td>0</td><td>1</td></tr><tr><td>Rare</td><td>0</td><td>1</td></tr><tr><td>Epic</td><td>1</td><td>1</td></tr><tr><td>Legendary</td><td>2</td><td>2</td></tr></table></div>
    <div class="how-sec how-combat"><h2>Combat</h2><table class="tbl"><tr><th>Target</th><th>Compare</th><th>Result</th></tr><tr><td>Attack Formation</td><td>ATK vs ATK</td><td>Higher value wins; the loser is destroyed.</td></tr><tr><td>Guard Formation</td><td>ATK vs DEF</td><td>If ATK is higher, the defender is destroyed.</td></tr><tr><td>Tie</td><td>Equal values</td><td>No card is destroyed.</td></tr><tr><td>Empty lane with a Gate</td><td>Attack the Gate</td><td>Destroy one Gate.</td></tr><tr><td>Empty lane with no Gate</td><td>Direct Attack</td><td>Deal damage to the enemy Lead LP.</td></tr></table></div>
    <div class="how-sec how-win"><h2>Win or Lose</h2><ul><li>Reduce the enemy Lead Card LP to 0 to win.</li><li>If your Deck is empty when you must draw, you lose.</li></ul></div>`;
}
function updateLanguageUI(){
  document.documentElement.lang = currentLang;
  setText('btn-how', t('how')); setText('btn-card-list', currentLang === 'th' ? 'คลังการ์ด' : 'CARD GALLERY'); setText('btn-play', t('play'));
  ['btn-lang-land','btn-lang-how','btn-lang-game','btn-lang-cardlist'].forEach(id=>setText(id, `🌐 ${t('lang')}`));
  setText('btn-how-back', t('back')); setText('btn-menu', t('back')); setText('how-title', t('title'));
  setText('btn-cardlist-back', t('back')); setText('cardlist-title', currentLang === 'th' ? 'คลังการ์ด' : 'CARD GALLERY');
  setText('btn-battle', t('battle')); setText('btn-end', t('end'));
  setText('lbl-ai-gates', t('aiGates')); setText('lbl-your-gates', t('yourGates')); setText('lbl-decks', t('decks'));
  setText('lbl-ai-deck', t('aiDeck')); setText('lbl-your-deck', t('yourDeck')); setText('lbl-ai-hand', t('aiHand')); setText('lbl-your-hand', t('yourHand')); setText('lbl-game-log', t('gameLog'));
  setText('lbl-your-void', currentLang === 'th' ? 'สุสานคุณ' : 'Your Void');
  setText('lbl-ai-void', currentLang === 'th' ? 'สุสาน AI' : 'AI Void');
  const playerVoidButton = document.querySelector('.player-rail .void-action');
  const aiVoidButton = document.querySelector('.ai-rail .void-action');
  const gameLog = document.getElementById('g-log');
  if (playerVoidButton) {
    const label = currentLang === 'th' ? 'เปิดสุสานของคุณ' : 'Open Your Void';
    playerVoidButton.setAttribute('aria-label', label);
    playerVoidButton.title = label;
  }
  if (aiVoidButton) {
    const label = currentLang === 'th' ? 'เปิดสุสานของ AI' : 'Open AI Void';
    aiVoidButton.setAttribute('aria-label', label);
    aiVoidButton.title = label;
  }
  if (gameLog) gameLog.setAttribute('aria-label', currentLang === 'th' ? 'บันทึกการกระทำในเกม' : 'Game action log');
  setText('lbl-choose-position', t('choosePosition')); setText('lbl-sacrifice', t('sacrifice'));
  setText('btn-cancel-pos', t('cancel')); setText('btn-cancel-sac', t('cancel')); setText('btn-cancel-tgt', t('cancel')); setText('sac-confirm', t('confirm')); setText('btn-play-again', t('playAgain'));
  const howContent = document.querySelector('#sc-how .how-content');
  if (howContent) howContent.innerHTML = howToPlayMarkup(currentLang);
  setText('how-visual-caption', currentLang === 'th' ? 'ภาพอ้างอิงสนาม 5 เลน • กติกาชนะปัจจุบัน: ลด Lead LP ฝ่ายตรงข้ามให้เหลือ 0' : 'Five-lane table reference • Current win rule: Reduce enemy Lead LP to 0');
  const resetLocal = document.getElementById('btn-reset-local');
  if (resetLocal) {
    resetLocal.textContent = currentLang === 'th' ? '↺ ล้างข้อมูลเครื่อง' : '↺ Reset local data';
    resetLocal.title = currentLang === 'th' ? 'ล้างข้อมูลที่บันทึกในเครื่อง' : 'Reset saved local data';
  }
  const dbTitle = document.getElementById('deckbuilder-title');
  const dbHelp = document.getElementById('deckbuilder-help');
  if (dbTitle) dbTitle.textContent = currentLang === 'th' ? 'จัด DECK' : 'DECK BUILDER';
  setText('btn-deck-builder', currentLang === 'th' ? 'จัด DECK' : 'DECK BUILDER');
  setText('btn-deckbuilder-back', currentLang === 'th' ? '← กลับ' : '← Back');
  setText('btn-lang-deckbuilder', `🌐 ${t('lang')}`);
  setText('db-total-label', currentLang === 'th' ? 'ทั้งหมด' : 'Total');
  setText('db-char-label', currentLang === 'th' ? 'ตัวละคร' : 'Character');
  setText('db-comp-label', currentLang === 'th' ? 'คู่หู' : 'Companion');
  setText('db-spell-label', currentLang === 'th' ? 'เวทมนตร์' : 'Spell');
  const deckSlotLabel = document.getElementById('deck-slot-label');
  if (deckSlotLabel) deckSlotLabel.innerHTML = currentLang === 'th' ? 'DECK ของฉัน <span>เลือกแท็บเพื่อแก้ไข Deck</span>' : 'MY DECKS <span>Select a tab to edit</span>';
  setText('deck-name-label', currentLang === 'th' ? 'ชื่อ Deck' : 'Deck name');
  setText('btn-save-slot-inline', currentLang === 'th' ? 'บันทึก Deck ปัจจุบัน' : 'Save Current Deck');
  setText('btn-random-build', currentLang === 'th' ? '🎲 จัด Deck 24/8/8 อัตโนมัติ' : '🎲 Auto Build 24/8/8');
  setText('btn-clear-deck', currentLang === 'th' ? 'ล้าง Deck' : 'Clear Deck');
  setText('btn-reset-custom', currentLang === 'th' ? '↺ คืนค่า Starter Deck' : '↺ Restore Starter Deck');
  setText('btn-save-play-bottom', currentLang === 'th' ? 'บันทึก Deck และเริ่มเกม' : 'Save Deck & Start Game');
  setText('ai-mode-label', currentLang === 'th' ? 'ระดับ AI' : 'AI MODE');
  setText('btn-ai-easy', currentLang === 'th' ? 'ง่าย' : 'Easy');
  setText('btn-ai-hard', currentLang === 'th' ? 'ยาก' : 'Hard');
  const deckNameInput = document.getElementById('deck-name-input');
  if (deckNameInput) deckNameInput.placeholder = currentLang === 'th' ? 'ชื่อ Deck' : 'Deck Name';
  if (dbHelp) dbHelp.innerHTML = currentLang === 'th'
    ? '<strong>กติกาจัด Deck:</strong> Deck ต้องมี 40 ใบตามโควต้า <strong>Character 24</strong> / <strong>Companion 8</strong> / <strong>Spell 8</strong> กด + / − เพื่อปรับจำนวน และใส่ซ้ำได้สูงสุด <strong>3 ใบต่อชื่อการ์ด</strong> การ์ดสีเทาหมายถึงเพิ่มไม่ได้แล้ว'
    : '<strong>Deck Rule:</strong> Build exactly 40 cards using the fixed quota: <strong>24 Character</strong> / <strong>8 Companion</strong> / <strong>8 Spell</strong>. Use + / − to change copies. Max <strong>3 copies per card</strong>. A grey card cannot be added again.';
  updateAiModeUI();
  renderDeckSlotsUI();
}

// CHARACTER IMAGE MAP
const CHAR_IMGS = {
  mitria: 'assets/embedded/img_001_af44443f5360.png',
  ember: 'assets/embedded/img_004_55f7fad4ccae.png',
  dark_empress: 'assets/embedded/img_003_76348185c590.png',
  michio: 'assets/embedded/img_005_8bd80f72c01b.png',
  lobot: 'assets/embedded/img_006_122191207bb1.webp',
  snowball: 'assets/embedded/img_007_c0e2461d367c.webp',
  lo: 'assets/embedded/img_008_bfad0961cf9b.webp',
  nero: 'assets/embedded/img_009_31a24b44e38d.webp',
  lo_hero: 'assets/embedded/img_010_a6b2aff98044.webp',
  hong_yue: 'assets/embedded/img_011_34fbe7f590f1.webp',
  jade_brew: 'assets/embedded/img_012_d3b3a1e91ccb.webp',
  luna_veil: 'assets/embedded/img_013_7cda5d8aed43.webp',
  noct_bat: 'assets/embedded/img_014_2fc2ec151236.webp',
  aqua_pop: 'assets/embedded/img_015_b30e151e4387.webp',
  verdantia: 'assets/embedded/img_016_df8768743614.webp',
  solaria: 'assets/embedded/img_017_91a22a16719c.webp',
  aria_byte: 'assets/embedded/img_018_3a0286017e1b.webp',
  lotus_noir: 'assets/embedded/img_019_7cc48aa45152.webp',
  celestia_prime: 'assets/embedded/img_020_80eb0b7fc02b.webp',
  prism_bloom: 'assets/embedded/img_021_586ab1e89289.webp',
  celestine: 'assets/embedded/img_022_8121d5582c1a.webp',
  flare_ace: 'assets/embedded/img_023_ea821125cdd1.webp',
  pixel_pop: 'assets/embedded/img_024_0d300bbaea2d.webp'
};

// ============================================================
// CARD DATABASE
// ============================================================
const CARDS = {
  // LEGENDARY
  mitria:{id:'mitria',name:'Mitria',type:'char',rarity:'legendary',cost:2,cv:2,atk:5,def:4,el:'light',emoji:'🌟',skill:'Charm Aura: เมื่อโจมตีชนะ จั่ว 1 ใบ',bg:'linear-gradient(135deg,#0a0a30,#1a1050)',skillFn:'on_win_draw'},
  dark_empress:{id:'dark_empress',name:'Dark Empress',type:'char',rarity:'legendary',cost:2,cv:2,atk:6,def:3,el:'shadow',emoji:'👑',skill:'Dark Command: เมื่อลงสนาม ฝ่ายตรงข้าม discard 1',bg:'linear-gradient(135deg,#0a0020,#200030)',skillFn:'on_play_discard'},
  // EPIC
  lo:{id:'lo',name:'Lo',type:'companion',rarity:'epic',cost:0,cv:0,el:'light',emoji:'🕊️',effect:'+1 ATK +1 DEF',ab:1,db:1,skill:'Light Companion',bg:'linear-gradient(90deg,rgba(120,220,255,.55),rgba(80,120,255,.55))'},
  lo_hero:{id:'lo_hero',name:'Lo Hero',type:'char',rarity:'epic',cost:1,cv:1,atk:4,def:3,el:'light',emoji:'🐦',skill:'Balanced Heroic Bird',bg:'linear-gradient(135deg,#061531,#173b72)'},
  ember:{id:'ember',name:'Ember',type:'char',rarity:'epic',cost:1,cv:1,atk:4,def:3,el:'fire',emoji:'🌺',skill:'',bg:'linear-gradient(135deg,#200010,#300020)'},
  michio:{id:'michio',name:'Michio',type:'char',rarity:'epic',cost:1,cv:1,atk:3,def:4,el:'crystal',emoji:'⚙️',skill:'',bg:'linear-gradient(135deg,#001820,#002030)'},

  hong_yue:{id:'hong_yue',name:'Hong Yue',type:'char',rarity:'common',cost:0,cv:1,atk:2,def:2,el:'fire',emoji:'🪭',skill:'Moon Fan: Pair with Jade Brew for +1 DEF',pairWith:['jade_brew'],pairAtk:0,pairDef:1,bg:'linear-gradient(135deg,#5d0808,#c22727)'},
  luna_veil:{id:'luna_veil',name:'Luna Veil',type:'char',rarity:'rare',cost:0,cv:1,atk:2,def:3,el:'shadow',emoji:'🎃',skill:'Witch Pact: Pair with Noct Bat for +1 ATK',pairWith:['noct_bat'],pairAtk:1,pairDef:0,bg:'linear-gradient(135deg,#21051f,#6b2d95)'},
  verdantia:{id:'verdantia',name:'Verdantia',type:'char',rarity:'rare',cost:0,cv:1,atk:1,def:4,el:'light',emoji:'🕊️',skill:'Grace Wing: Pair with Celestine or Lo for +1 DEF',pairWith:['celestine','lo'],pairAtk:0,pairDef:1,bg:'linear-gradient(135deg,#14376d,#3b78cf)'},
  solaria:{id:'solaria',name:'Solaria',type:'char',rarity:'rare',cost:0,cv:1,atk:3,def:1,el:'fire',emoji:'🔥',skill:'Blaze Pact: Pair with Flare Ace for +1 ATK',pairWith:['flare_ace'],pairAtk:1,pairDef:0,bg:'linear-gradient(135deg,#5f2300,#ff9a2d)'},
  aria_byte:{id:'aria_byte',name:'Aria Byte',type:'char',rarity:'common',cost:0,cv:1,atk:1,def:3,el:'crystal',emoji:'🧪',skill:'Pixel Sync: Pair with Pixel Pop for +1 ATK / +1 DEF',pairWith:['pixel_pop'],pairAtk:1,pairDef:1,bg:'linear-gradient(135deg,#53316d,#ffb35c)'},
  lotus_noir:{id:'lotus_noir',name:'Lotus Noir',type:'char',rarity:'rare',cost:0,cv:1,atk:3,def:2,el:'shadow',emoji:'🌸',skill:'Lotus Veil: Pair with Aqua Pop or Dark Cloak for +1 DEF',pairWith:['aqua_pop','dark_cloak'],pairAtk:0,pairDef:1,bg:'linear-gradient(135deg,#3e112f,#88385f)'},
  celestia_prime:{id:'celestia_prime',name:'Celestia Prime',type:'char',rarity:'legendary',cost:2,cv:2,atk:6,def:5,el:'light',emoji:'⭐',skill:'Star Oath: Pair with Celestine for +1 ATK / +1 DEF',pairWith:['celestine'],pairAtk:1,pairDef:1,bg:'linear-gradient(135deg,#a9d8ff,#e9f4ff)'},
  prism_bloom:{id:'prism_bloom',name:'Prism Bloom',type:'char',rarity:'rare',cost:0,cv:1,atk:2,def:4,el:'crystal',emoji:'💠',skill:'Crystal Pulse: Pair with Aqua Pop for +1 DEF',pairWith:['aqua_pop'],pairAtk:0,pairDef:1,bg:'linear-gradient(135deg,#803258,#ffc1da)'},
  jade_brew:{id:'jade_brew',name:'Jade Brew',type:'companion',rarity:'common',cost:0,cv:0,el:'light',emoji:'☕',effect:'+1 ATK +1 DEF',ab:1,db:1,skill:'Best match for Hong Yue',bg:'linear-gradient(90deg,rgba(167,216,55,.65),rgba(51,126,72,.65))'},
  noct_bat:{id:'noct_bat',name:'Noct Bat',type:'companion',rarity:'rare',cost:0,cv:0,el:'shadow',emoji:'🦇',effect:'+2 ATK',ab:2,db:0,skill:'Best match for Luna Veil',bg:'linear-gradient(90deg,rgba(22,30,88,.7),rgba(113,33,160,.7))'},
  aqua_pop:{id:'aqua_pop',name:'Aqua Pop',type:'companion',rarity:'rare',cost:0,cv:0,el:'water',emoji:'💧',effect:'+1 ATK +2 DEF',ab:1,db:2,skill:'Best match for Lotus Noir / Prism Bloom',bg:'linear-gradient(90deg,rgba(61,170,255,.72),rgba(244,220,109,.45))'},
  celestine:{id:'celestine',name:'Celestine',type:'companion',rarity:'rare',cost:0,cv:0,el:'light',emoji:'✨',effect:'+1 ATK +2 DEF',ab:1,db:2,skill:'Best match for Celestia Prime / Verdantia',bg:'linear-gradient(90deg,rgba(206,223,255,.85),rgba(89,117,255,.65))'},
  flare_ace:{id:'flare_ace',name:'Flare Ace',type:'companion',rarity:'rare',cost:0,cv:0,el:'fire',emoji:'🔥',effect:'+2 ATK +1 DEF',ab:2,db:1,skill:'Best match for Solaria',bg:'linear-gradient(90deg,rgba(229,53,35,.78),rgba(255,184,64,.7))'},
  pixel_pop:{id:'pixel_pop',name:'Pixel Pop',type:'companion',rarity:'common',cost:0,cv:0,el:'crystal',emoji:'🕹️',effect:'+1 ATK +1 DEF',ab:1,db:1,skill:'Best match for Aria Byte',bg:'linear-gradient(90deg,rgba(57,118,255,.72),rgba(255,55,170,.72))'},
  // RARE
  shadow_minion:{id:'shadow_minion',name:'Shadow Minion',type:'char',rarity:'rare',cost:0,cv:1,atk:2,def:1,el:'shadow',emoji:'👤',skill:'',bg:'linear-gradient(135deg,#080018,#100025)'},
  crystal_guard:{id:'crystal_guard',name:'Crystal Guard',type:'char',rarity:'rare',cost:0,cv:1,atk:1,def:3,el:'crystal',emoji:'🛡️',skill:'',bg:'linear-gradient(135deg,#001020,#002030)'},
  worm_guard:{id:'worm_guard',name:'Worm Guard',type:'char',rarity:'rare',cost:0,cv:1,atk:0,def:3,el:'shadow',emoji:'🪱',skill:'',bg:'linear-gradient(135deg,#0f0800,#181000)'},  // COMMON
  light_sprite:{id:'light_sprite',name:'Light Sprite',type:'char',rarity:'common',cost:0,cv:1,atk:1,def:1,el:'light',emoji:'🧚',skill:'',bg:'linear-gradient(135deg,#181008,#201808)'},
  light_fairy:{id:'light_fairy',name:'Light Fairy',type:'char',rarity:'common',cost:0,cv:1,atk:1,def:2,el:'light',emoji:'🧚',skill:'',bg:'linear-gradient(135deg,#080f08,#0f1808)'},
  worm_scout:{id:'worm_scout',name:'Worm Scout',type:'char',rarity:'common',cost:0,cv:1,atk:2,def:0,el:'shadow',emoji:'🐛',skill:'',bg:'linear-gradient(135deg,#0f0805,#180c08)'},
  shadow_sprite:{id:'shadow_sprite',name:'Shadow Sprite',type:'char',rarity:'common',cost:0,cv:1,atk:2,def:0,el:'shadow',emoji:'👤',skill:'',bg:'linear-gradient(135deg,#080010,#100018)'},
  crystal_apprentice:{id:'crystal_apprentice',name:'Crystal Apprentice',type:'char',rarity:'common',cost:0,cv:1,atk:1,def:1,el:'crystal',emoji:'🧙',skill:'',bg:'linear-gradient(135deg,#061020,#102040)'},
  mini_mimic:{id:'mini_mimic',name:'Mini Mimic',type:'char',rarity:'common',cost:0,cv:1,atk:1,def:1,el:'neutral',emoji:'👾',skill:'',bg:'linear-gradient(135deg,#12080a,#221014)'},
  fire_imp:{id:'fire_imp',name:'Fire Imp',type:'char',rarity:'common',cost:0,cv:1,atk:2,def:1,el:'fire',emoji:'😈',skill:'',bg:'linear-gradient(135deg,#180800,#2a1200)'},
  moon_wisp:{id:'moon_wisp',name:'Moon Wisp',type:'char',rarity:'common',cost:0,cv:1,atk:0,def:2,el:'shadow',emoji:'👻',skill:'',bg:'linear-gradient(135deg,#080014,#141028)'},

  // NEW COMMON CHARACTER POOL v6_60
  river_moppet:{id:'river_moppet',name:'River Moppet',type:'char',rarity:'common',cost:0,cv:1,atk:1,def:2,el:'water',emoji:'💧',skill:'Starter blocker',bg:'linear-gradient(135deg,#06182a,#0b3a5a)'},
  ember_pup:{id:'ember_pup',name:'Ember Pup',type:'char',rarity:'common',cost:0,cv:1,atk:2,def:1,el:'fire',emoji:'🐶',skill:'Starter attacker',bg:'linear-gradient(135deg,#220a00,#4a1600)'},
  stone_turtle:{id:'stone_turtle',name:'Stone Turtle',type:'char',rarity:'common',cost:0,cv:1,atk:0,def:3,el:'earth',emoji:'🐢',skill:'High DEF common',bg:'linear-gradient(135deg,#101408,#283018)'},
  wind_pixie:{id:'wind_pixie',name:'Wind Pixie',type:'char',rarity:'common',cost:0,cv:1,atk:2,def:1,el:'air',emoji:'🧚‍♀️',skill:'Fast common attacker',bg:'linear-gradient(135deg,#081420,#163045)'},
  paper_knight:{id:'paper_knight',name:'Paper Knight',type:'char',rarity:'common',cost:0,cv:1,atk:1,def:2,el:'neutral',emoji:'🛡️',skill:'Simple guard unit',bg:'linear-gradient(135deg,#161616,#303030)'},
  gear_mouse:{id:'gear_mouse',name:'Gear Mouse',type:'char',rarity:'common',cost:0,cv:1,atk:2,def:1,el:'crystal',emoji:'🐭',skill:'Tiny tech attacker',bg:'linear-gradient(135deg,#071522,#153652)'},
  mushroom_guard:{id:'mushroom_guard',name:'Mushroom Guard',type:'char',rarity:'common',cost:0,cv:1,atk:1,def:3,el:'earth',emoji:'🍄',skill:'Durable common guard',bg:'linear-gradient(135deg,#101808,#26350c)'},
  candle_mage:{id:'candle_mage',name:'Candle Mage',type:'char',rarity:'common',cost:0,cv:1,atk:2,def:0,el:'fire',emoji:'🕯️',skill:'Fragile attacker',bg:'linear-gradient(135deg,#180808,#381010)'},
  bubble_squire:{id:'bubble_squire',name:'Bubble Squire',type:'char',rarity:'common',cost:0,cv:1,atk:1,def:2,el:'water',emoji:'🫧',skill:'Stable common defender',bg:'linear-gradient(135deg,#06101f,#123052)'},
  night_cat:{id:'night_cat',name:'Night Cat',type:'char',rarity:'common',cost:0,cv:1,atk:2,def:1,el:'shadow',emoji:'🐈‍⬛',skill:'Shadow common attacker',bg:'linear-gradient(135deg,#080810,#1c1230)'},
  sunny_seed:{id:'sunny_seed',name:'Sunny Seed',type:'char',rarity:'common',cost:0,cv:1,atk:1,def:1,el:'light',emoji:'🌱',skill:'Balanced starter',bg:'linear-gradient(135deg,#141808,#2a3510)'},
  tin_soldier:{id:'tin_soldier',name:'Tin Soldier',type:'char',rarity:'common',cost:0,cv:1,atk:2,def:2,el:'crystal',emoji:'🪖',skill:'Solid common unit',bg:'linear-gradient(135deg,#101820,#233444)'},
  // COMPANIONS
  lobot:{id:'lobot',name:'Lobot',type:'companion',rarity:'epic',cost:0,cv:0,el:'crystal',emoji:'🤖',effect:'+1 ATK +1 DEF',ab:1,db:1,skill:'Tech Support',bg:'linear-gradient(90deg,rgba(180,220,255,.5),rgba(80,130,255,.5))'},
  snowball:{id:'snowball',name:'Snowball',type:'companion',rarity:'epic',cost:0,cv:0,el:'water',emoji:'❄️',effect:'+0 ATK +2 DEF',ab:0,db:2,skill:'Frost Shield',bg:'linear-gradient(90deg,rgba(0,150,255,.5),rgba(165,225,232,.5))'},
  nero:{id:'nero',name:'Nero',type:'companion',rarity:'epic',cost:0,cv:0,el:'fire',emoji:'🦅',effect:'+2 ATK',ab:2,db:0,skill:'Blaze Wing',bg:'linear-gradient(90deg,rgba(255,80,80,.5),rgba(150,0,0,.5))'},
  dark_cloak:{id:'dark_cloak',name:'Dark Cloak',type:'companion',rarity:'rare',cost:0,cv:0,emoji:'🌒',effect:'+1 ATK +1 DEF',ab:1,db:1,bg:'linear-gradient(90deg,rgba(100,0,200,.5),rgba(50,0,100,.5))'},

  // NEW COMMON COMPANION POOL v6_60
  tiny_drone:{id:'tiny_drone',name:'Tiny Drone',type:'companion',rarity:'common',cost:0,cv:0,el:'crystal',emoji:'🛸',effect:'+1 ATK',ab:1,db:0,skill:'Simple attack support',bg:'linear-gradient(90deg,rgba(120,180,255,.36),rgba(80,100,180,.36))'},
  leaf_charm:{id:'leaf_charm',name:'Leaf Charm',type:'companion',rarity:'common',cost:0,cv:0,el:'earth',emoji:'🍃',effect:'+1 DEF',ab:0,db:1,skill:'Simple guard support',bg:'linear-gradient(90deg,rgba(90,190,100,.36),rgba(30,90,40,.36))'},
  spark_bug:{id:'spark_bug',name:'Spark Bug',type:'companion',rarity:'common',cost:0,cv:0,el:'fire',emoji:'🐞',effect:'+1 ATK',ab:1,db:0,skill:'Tiny attack buff',bg:'linear-gradient(90deg,rgba(255,120,70,.38),rgba(120,40,20,.35))'},
  ribbon_bird:{id:'ribbon_bird',name:'Ribbon Bird',type:'companion',rarity:'common',cost:0,cv:0,el:'light',emoji:'🎀',effect:'+1 DEF',ab:0,db:1,skill:'Tiny defense buff',bg:'linear-gradient(90deg,rgba(255,180,240,.34),rgba(120,80,180,.34))'},
  snail_shell:{id:'snail_shell',name:'Snail Shell',type:'companion',rarity:'common',cost:0,cv:0,el:'water',emoji:'🐌',effect:'+2 DEF',ab:0,db:2,skill:'Defensive common companion',bg:'linear-gradient(90deg,rgba(80,160,220,.34),rgba(30,70,120,.34))'},
  coffee_bean:{id:'coffee_bean',name:'Coffee Bean',type:'companion',rarity:'common',cost:0,cv:0,el:'neutral',emoji:'☕',effect:'+1 ATK',ab:1,db:0,skill:'Energy boost',bg:'linear-gradient(90deg,rgba(120,80,50,.38),rgba(60,35,20,.34))'},
  // SPELLS
  crystal_burst:{id:'crystal_burst',name:'Crystal Burst',type:'spell',rarity:'rare',cost:0,cv:0,emoji:'💎',effect:'ทำลาย any number of Characters ฝ่ายตรงข้าม',spellFn:'destroy_enemy',bg:'linear-gradient(135deg,#001530,#002050)'},
  shield_charm:{id:'shield_charm',name:'Shield Charm',type:'spell',rarity:'common',cost:0,cv:0,emoji:'🔮',effect:'+3 DEF ให้ any number of Characters ของคุณ Turn นี้',spellFn:'buff_def',bg:'linear-gradient(135deg,#001820,#002030)'},
  charm_fragment:{id:'charm_fragment',name:'Charm Fragment',type:'spell',rarity:'common',cost:0,cv:0,emoji:'🌀',effect:'จั่ว 2 ใบ',spellFn:'draw2',bg:'linear-gradient(135deg,#150800,#200c00)'},
  rebirth_charm:{id:'rebirth_charm',name:'Rebirth Charm',type:'spell',rarity:'common',cost:0,cv:0,emoji:'✨',effect:'ชุบชีวิต any number of Characters ที่ถูกทำลาย กลับขึ้นมือ',spellFn:'revive_char',bg:'linear-gradient(135deg,#101020,#202040)'},
  dark_surge:{id:'dark_surge',name:'Dark Surge',type:'spell',rarity:'rare',cost:0,cv:0,emoji:'⚡',effect:'+2 ATK ให้ Characters ทุกตัวของคุณ Turn นี้',spellFn:'atk_all',bg:'linear-gradient(135deg,#100020,#200035)'},
  shadow_veil:{id:'shadow_veil',name:'Shadow Veil',type:'spell',rarity:'rare',cost:0,cv:0,emoji:'🌫️',effect:'any number of Characters ฝ่ายตรงข้ามโจมตีไม่ได้ Turn นี้',spellFn:'veil_enemy',bg:'linear-gradient(135deg,#0a0818,#140c20)'},
  gate_recall:{id:'gate_recall',name:'Gate Recall',type:'spell',rarity:'common',cost:0,cv:0,emoji:'🛡️',effect:'เลือก 1 ใบจากมือ กลับไปเป็น Gate ที่ถูกทำลาย',spellFn:'restore_gate',bg:'linear-gradient(135deg,#081018,#182840)'},
  gate_rebuild:{id:'gate_rebuild',name:'Gate Rebuild',type:'spell',rarity:'common',cost:0,cv:0,emoji:'🏰',effect:'เลือก 1 ใบจากมือ กลับไปเป็น Gate ที่ถูกทำลาย',spellFn:'restore_gate',bg:'linear-gradient(135deg,#061420,#102a40)'},

  // NEW COMMON SPELL POOL v6_60
  pocket_map:{id:'pocket_map',name:'Pocket Map',type:'spell',rarity:'common',cost:0,cv:0,emoji:'🗺️',effect:'ย้าย Character ของคุณไป Lane ว่าง',spellFn:'move_own',bg:'linear-gradient(135deg,#081018,#202010)'},
  lucky_shard:{id:'lucky_shard',name:'Lucky Shard',type:'spell',rarity:'common',cost:0,cv:0,emoji:'🍀',effect:'จั่ว 2 ใบ',spellFn:'draw2',bg:'linear-gradient(135deg,#06180a,#183018)'},
  gate_patch:{id:'gate_patch',name:'Gate Patch',type:'spell',rarity:'common',cost:0,cv:0,emoji:'🧩',effect:'เลือก 1 ใบจากมือ กลับไปเป็น Gate ที่ถูกทำลาย',spellFn:'restore_gate',bg:'linear-gradient(135deg,#081018,#182440)'},
  recycle_rune:{id:'recycle_rune',name:'Recycle Rune',type:'spell',rarity:'common',cost:0,cv:0,emoji:'♻️',effect:'ชุบชีวิต Character ที่ถูกทำลาย กลับขึ้นมือ',spellFn:'revive_char',bg:'linear-gradient(135deg,#101018,#202030)'},
  lane_shift:{id:'lane_shift',name:'Lane Shift',type:'spell',rarity:'common',cost:0,cv:0,emoji:'↔️',effect:'ย้าย Character ของคุณไป Lane ว่าง',spellFn:'move_own',bg:'linear-gradient(135deg,#061420,#102a35)'},
  quick_reposition:{id:'quick_reposition',name:'Quick Reposition',type:'spell',rarity:'common',cost:0,cv:0,emoji:'🏃',effect:'ย้าย Character ของคุณไป Lane ว่าง',spellFn:'move_own',bg:'linear-gradient(135deg,#081018,#162030)'},
  mirror_step:{id:'mirror_step',name:'Mirror Step',type:'spell',rarity:'rare',cost:0,cv:0,emoji:'🪞',effect:'ย้าย Character ของคุณไป Lane ว่าง',spellFn:'move_own',bg:'linear-gradient(135deg,#0d0820,#1d1238)'},
};

// DECK DEFS
const P_DECK = [
  'mitria','mitria',
  'lo','lo','lo',
  'michio','michio',
  'ember','ember',
  'crystal_guard','crystal_guard','crystal_guard','crystal_guard',
  'light_sprite','light_sprite','light_sprite','light_sprite',
  'light_fairy','light_fairy','light_fairy',
  'lo_phoenix','lo_phoenix','lo_phoenix',
  'snowball','snowball','snowball',
  'crystal_burst','crystal_burst','crystal_burst',
  'shield_charm','shield_charm','shield_charm','shield_charm',
  'charm_fragment','charm_fragment','charm_fragment','charm_fragment',
];// 2+3+2+2+4+4+3+3+3+3+4+4+4 = 41... let me fix
// Actually let me count: 2+3+2+2+4+4+3+3+3+3+4+4+4 = 41. Remove 1 charm_fragment
const PLAYER_DECK_DEF = [
  'mitria','mitria',
  'lo','lo','lo',
  'michio','michio',
  'ember','ember',
  'crystal_guard','crystal_guard','crystal_guard','crystal_guard',
  'light_sprite','light_sprite','light_sprite','light_sprite',
  'light_fairy','light_fairy','light_fairy',
  'lo_phoenix','lo_phoenix','lo_phoenix',
  'snowball','snowball','snowball',
  'crystal_burst','crystal_burst','crystal_burst',
  'shield_charm','shield_charm','shield_charm','shield_charm',
  'charm_fragment','charm_fragment','charm_fragment',
]; // 2+3+2+2+4+4+3+3+3+3+4+3 = 36, need 4 more
// add nero x2, crystal_guard already 4... add nero x2, light_sprite total 4 already

const FINAL_P_DECK = [
  'mitria','mitria',
  'lo','lo','lo',
  'michio','michio','michio',
  'ember','ember',
  'crystal_guard','crystal_guard','crystal_guard','crystal_guard',
  'light_sprite','light_sprite','light_sprite','light_sprite',
  'light_fairy','light_fairy',
  'lo_phoenix','lo_phoenix','lo_phoenix',
  'snowball','snowball',
  'nero','nero',
  'crystal_burst','crystal_burst','crystal_burst',
  'shield_charm','shield_charm','shield_charm',
  'charm_fragment','charm_fragment','charm_fragment',
]; // 2+3+3+2+4+4+2+3+2+2+3+3+3 = 36... still short

const PDECK = [
  // Characters 24
  'light_sprite','light_sprite',
  'crystal_apprentice','crystal_apprentice',
  'fire_imp','fire_imp',
  'mini_mimic',
  'hong_yue','hong_yue',
  'aria_byte','aria_byte',
  'solaria','solaria',
  'luna_veil','lotus_noir','verdantia','prism_bloom',
  'lo_hero','lo_hero','ember','michio',
  'mitria','mitria','celestia_prime',

  // Companions 8
  'jade_brew','jade_brew',
  'pixel_pop','pixel_pop',
  'flare_ace','aqua_pop','lo','snowball',

  // Spells 8
  'lane_shift','lane_shift',
  'crystal_burst','shield_charm','charm_fragment','rebirth_charm',
  'gate_recall','quick_reposition'
];
// Count: 2+3+3+2+4+4+3+3+3+2+2+4+3+3+4+1 = 42... close enough, let me just count
// mitria x2, lo x3, michio x3, ember x2, crystal_guard x4, light_sprite x4, light_fairy x3
// lo_phoenix x3, snowball x2, nero x2, crystal_burst x4, shield_charm x3, charm_fragment x4, worm_guard x1
// 2+3+3+2+4+4+3+3+2+2+4+3+4+1 = 40 ✓

const AIDECK = [
  // Characters 24
  'worm_scout','worm_scout',
  'shadow_sprite','shadow_sprite',
  'moon_wisp','moon_wisp',
  'fire_imp','fire_imp',
  'mini_mimic',
  'hong_yue','hong_yue',
  'aria_byte','aria_byte',
  'solaria','solaria',
  'luna_veil','lotus_noir','verdantia','prism_bloom',
  'lo_hero','ember','michio',
  'dark_empress','dark_empress',

  // Companions 8
  'noct_bat','noct_bat',
  'nero','nero',
  'dark_cloak','aqua_pop','celestine','flare_ace',

  // Spells 8
  'dark_surge','dark_surge',
  'shadow_veil','shadow_veil',
  'lane_shift','gate_recall','rebirth_charm','mirror_step'
];
// dark_empress x2, lo x2, ember x3, shadow_minion x4, worm_scout x4, shadow_sprite x4
// worm_guard x3, nero x3, dark_cloak x3, crystal_burst x2, dark_surge x3, shadow_veil x3, charm_fragment x4
// 2+2+3+4+4+4+3+3+3+2+3+3+4 = 40 ✓

// ============================================================
// GAME STATE
// ============================================================
let G = {};
const BUILD_VERSION = 'v6.72 Deck Builder & Table Scale Edition';
let msgTimer = null;
let detailContext = null;
let CUSTOM_PDECK = null;
let AI_MODE = 'easy';
let CURRENT_DECK_SLOT = 1;
let DECKBUILDER_FILTER = 'all';

function makeState(deckDef) {
  return {
    deck: shuffle([...deckDef]).map((id,i) => makeInst(id, 'deck-'+i)),
    hand: [],
    gates: Array(5).fill(null),
    gatesActive: Array(5).fill(true), // true = gate alive
    lanes: Array(5).fill(null),       // char instances
    comps: Array(5).fill(null),       // companion instances
    grave: [],                       // destroyed / sacrificed / discarded cards
    gateCount: 5,
  };
}

function makeLead(id) {
  const c = CARDS[id];
  return { id, name:c.name, emoji:c.emoji, lp:10, maxLp:10, bg:c.bg };
}

let uid = 0;
function makeInst(id, iid) {
  const c = CARDS[id];
  return {
    ...c,
    iid: iid || (id + '_' + (uid++)),
    atk: c.atk || 0,
    def: c.def || 0,
    pos: 'attack',
    sick: true,
    exhausted: false,
    veiled: false,
    atkBuff: 0,
    defBuff: 0,
  };
}

// Deck is freshly randomized every time initGame() builds a new state.
function shuffle(a) {
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}


function drawGateCard(side) {
  const s = G[side];
  if (!s.deck.length) return null;
  let idx = s.deck.findIndex(c => c.rarity !== 'epic' && c.rarity !== 'legendary');
  if (idx < 0) idx = 0;
  return s.deck.splice(idx, 1)[0];
}



function setAiMode(mode) {
  AI_MODE = mode === 'hard' ? 'hard' : 'easy';
  try { localStorage.setItem('mittaria_ai_mode', AI_MODE); } catch(e) {}
  updateAiModeUI();
  showMsg(AI_MODE === 'hard' ? 'AI Mode: Hard' : 'AI Mode: Easy');
}

function loadAiMode() {
  try {
    const saved = localStorage.getItem('mittaria_ai_mode');
    if (saved === 'hard' || saved === 'easy') AI_MODE = saved;
  } catch(e) {}
  updateAiModeUI();
}

function updateAiModeUI() {
  const easy = document.getElementById('btn-ai-easy');
  const hard = document.getElementById('btn-ai-hard');
  if (easy) easy.classList.toggle('on', AI_MODE === 'easy');
  if (hard) hard.classList.toggle('on', AI_MODE === 'hard');
}

function deckSlotKey(slot) { return `mittaria_deck_slot_${slot}`; }
function deckNameKey(slot) { return `mittaria_deck_name_${slot}`; }
const DECK_TYPE_LIMITS = Object.freeze({ char:24, companion:8, spell:8 });

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
  })[char]);
}

function isLegalDeckStats(stats) {
  return stats.total === 40
    && stats.char === DECK_TYPE_LIMITS.char
    && stats.companion === DECK_TYPE_LIMITS.companion
    && stats.spell === DECK_TYPE_LIMITS.spell;
}

function showDeckQuotaMessage() {
  showMsg(currentLang === 'th'
    ? 'Deck ต้องครบ 40 ใบ: Character 24 / Companion 8 / Spell 8'
    : 'Deck must be 40 cards: 24 Character / 8 Companion / 8 Spell');
}

function loadDeckSlot(slot) {
  CURRENT_DECK_SLOT = slot;
  try {
    const saved = localStorage.getItem(deckSlotKey(slot));
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr) && arr.length === 40 && arr.every(id => CARDS[id])) {
        CUSTOM_PDECK = arr;
        deckBuilderCounts = {};
        arr.forEach(id => deckBuilderCounts[id] = (deckBuilderCounts[id] || 0) + 1);
      }
    } else {
      CUSTOM_PDECK = [...PDECK];
      deckBuilderCounts = null;
    }
    const name = localStorage.getItem(deckNameKey(slot)) || `Deck ${slot}`;
    const input = document.getElementById('deck-name-input');
    if (input) input.value = name;
  } catch(e) {}
  renderDeckBuilder();
  showMsg(currentLang === 'th' ? `กำลังแก้ไข Deck ${slot}` : `Editing Deck ${slot}`);
}

function updateDeckNameDraft(value) {
  try { localStorage.setItem(deckNameKey(CURRENT_DECK_SLOT), value || `Deck ${CURRENT_DECK_SLOT}`); } catch(e) {}
  renderDeckSlotsUI();
}

function saveDeckToSlot() {
  const arr = deckBuilderArray();
  if (!isLegalDeckStats(deckBuilderStats())) {
    showDeckQuotaMessage();
    return false;
  }
  CUSTOM_PDECK = arr;
  try {
    localStorage.setItem(deckSlotKey(CURRENT_DECK_SLOT), JSON.stringify(arr));
    const name = document.getElementById('deck-name-input')?.value || `Deck ${CURRENT_DECK_SLOT}`;
    localStorage.setItem(deckNameKey(CURRENT_DECK_SLOT), name);
    localStorage.setItem('mittaria_custom_deck_v1', JSON.stringify(arr));
  } catch(e) {}
  renderDeckSlotsUI();
  showMsg(currentLang === 'th' ? `บันทึก Deck ${CURRENT_DECK_SLOT} แล้ว` : `Deck ${CURRENT_DECK_SLOT} saved`);
  return true;
}

function renderDeckSlotsUI() {
  for (let slot=1; slot<=3; slot++) {
    const btn = document.getElementById(`deck-slot-${slot}`);
    if (!btn) continue;
    let name = `Deck ${slot}`;
    let saved = false;
    try {
      name = localStorage.getItem(deckNameKey(slot)) || name;
      saved = !!localStorage.getItem(deckSlotKey(slot));
    } catch(e) {}
    const active = slot === CURRENT_DECK_SLOT;
    btn.innerHTML = `<span>${currentLang === 'th' ? 'DECK' : 'DECK'} ${slot}</span><strong>${escapeHtml(name)}</strong><small>${active ? (currentLang === 'th' ? 'กำลังแก้ไข' : 'Editing now') : saved ? (currentLang === 'th' ? 'บันทึกแล้ว' : 'Saved deck') : (currentLang === 'th' ? 'Starter deck' : 'Starter deck')}</small>`;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
    btn.tabIndex = active ? 0 : -1;
  }
  const input = document.getElementById('deck-name-input');
  if (input) {
    try { input.value = localStorage.getItem(deckNameKey(CURRENT_DECK_SLOT)) || `Deck ${CURRENT_DECK_SLOT}`; } catch(e) {}
  }
}


function getPlayerDeckDef() {
  if (Array.isArray(CUSTOM_PDECK) && CUSTOM_PDECK.length === 40) return CUSTOM_PDECK;
  try {
    const saved = localStorage.getItem('mittaria_custom_deck_v1');
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr) && arr.length === 40 && arr.every(id => CARDS[id])) {
        CUSTOM_PDECK = arr;
        return CUSTOM_PDECK;
      }
    }
  } catch(e) {}
  return PDECK;
}

function getDeckBuilderCounts() {
  const counts = {};
  const source = Array.isArray(CUSTOM_PDECK) ? CUSTOM_PDECK : getPlayerDeckDef();
  source.forEach(id => counts[id] = (counts[id] || 0) + 1);
  return counts;
}

let deckBuilderCounts = null;

function ensureDeckBuilderCounts() {
  if (!deckBuilderCounts) deckBuilderCounts = getDeckBuilderCounts();
  return deckBuilderCounts;
}

function deckBuilderArray() {
  const counts = ensureDeckBuilderCounts();
  const arr = [];
  Object.keys(counts).forEach(id => {
    for (let i = 0; i < counts[id]; i++) arr.push(id);
  });
  return arr;
}

function deckBuilderStats() {
  const arr = deckBuilderArray();
  const stats = { total: arr.length, char:0, companion:0, spell:0 };
  arr.forEach(id => {
    const c = CARDS[id];
    if (!c) return;
    if (c.type === 'char') stats.char++;
    else if (c.type === 'companion') stats.companion++;
    else if (c.type === 'spell') stats.spell++;
  });
  return stats;
}

function setDeckCount(id, delta) {
  const counts = ensureDeckBuilderCounts();
  const current = counts[id] || 0;
  const stats = deckBuilderStats();
  const total = stats.total;
  const card = CARDS[id];
  if (delta > 0 && current >= 3) {
    showMsg(currentLang === 'th' ? 'การ์ดนี้เต็มโควต้าแล้ว' : 'Max copies reached');
    return;
  }
  if (delta > 0 && card && stats[card.type] >= DECK_TYPE_LIMITS[card.type]) {
    const typeName = card.type === 'char' ? 'Character' : card.type === 'companion' ? 'Companion' : 'Spell';
    showMsg(currentLang === 'th' ? `${typeName} เต็มโควต้าแล้ว` : `${typeName} quota reached`);
    return;
  }
  if (delta > 0 && total >= 40) {
    showMsg(currentLang === 'th' ? 'Deck เต็ม 40 ใบแล้ว' : 'Deck is full');
    return;
  }
  const next = Math.max(0, Math.min(3, current + delta));
  counts[id] = next;
  renderDeckBuilder();
}


function autoBuildDeck() {
  // Random 24 / 8 / 8 deck with max 3 copies per card.
  const all = Object.values(CARDS);
  const pools = {
    char: all.filter(c => c.type === 'char'),
    companion: all.filter(c => c.type === 'companion'),
    spell: all.filter(c => c.type === 'spell')
  };

  function weightedPick(pool, counts) {
    const expanded = [];
    pool.forEach(c => {
      const current = counts[c.id] || 0;
      if (current >= 3) return;
      let w = 1;
      if (c.rarity === 'common') w = 4;
      else if (c.rarity === 'rare') w = 3;
      else if (c.rarity === 'epic') w = 2;
      else if (c.rarity === 'legendary') w = 1;
      // favor artwork a little, but not deterministically
      if (CHAR_IMGS[c.id]) w += 1;
      for (let i=0;i<w;i++) expanded.push(c.id);
    });
    if (!expanded.length) return null;
    return expanded[Math.floor(Math.random()*expanded.length)];
  }

  function fill(type, amount, picks, counts) {
    let guard = 0;
    while (picks.filter(id => CARDS[id]?.type === type).length < amount && guard++ < 300) {
      const id = weightedPick(pools[type], counts);
      if (!id) break;
      picks.push(id);
      counts[id] = (counts[id] || 0) + 1;
    }
  }

  const picks = [];
  const counts = {};
  fill('char', 24, picks, counts);
  fill('companion', 8, picks, counts);
  fill('spell', 8, picks, counts);

  deckBuilderCounts = {};
  picks.forEach(id => deckBuilderCounts[id] = (deckBuilderCounts[id] || 0) + 1);
  CUSTOM_PDECK = picks;
  try { localStorage.setItem('mittaria_custom_deck_v1', JSON.stringify(picks)); } catch(e) {}
  renderDeckBuilder();
  showMsg(currentLang === 'th' ? 'สร้าง Deck แบบสุ่มแล้ว' : 'Random Deck built');
}



function clearCurrentDeck() {
  if (!confirm(currentLang === 'th' ? 'ล้างการ์ดทั้งหมดใน Deck นี้?' : 'Clear all cards from this deck?')) return;
  deckBuilderCounts = {};
  CUSTOM_PDECK = [];
  try { localStorage.setItem('mittaria_custom_deck_v1', JSON.stringify([])); } catch(e) {}
  renderDeckBuilder();
  showMsg(currentLang === 'th' ? 'ล้างการ์ดใน Deck แล้ว' : 'Deck cleared');
}


function resetCustomDeck() {
  CUSTOM_PDECK = [...PDECK];
  deckBuilderCounts = null;
  try { localStorage.removeItem('mittaria_custom_deck_v1'); } catch(e) {}
  renderDeckBuilder();
  showMsg(currentLang === 'th' ? 'คืนค่า Starter Deck แล้ว' : 'Starter Deck restored');
}

function saveCustomDeck() {
  return saveDeckToSlot();
}

function saveDeckAndPlay() {
  if (saveCustomDeck()) startGame();
}



function setDeckBuilderFilter(type) {
  DECKBUILDER_FILTER = type || 'all';
  renderDeckBuilder();
}


function renderDeckCurrentList() {
  const root = document.getElementById('deck-current-list');
  if (!root) return;
  const counts = ensureDeckBuilderCounts();
  const entries = Object.keys(counts).filter(id => counts[id] > 0).sort((a,b) => {
    const ca = CARDS[a], cb = CARDS[b];
    const typeOrder = { char:0, companion:1, spell:2 };
    return ((typeOrder[ca?.type] ?? 9) - (typeOrder[cb?.type] ?? 9)) || (ca?.name||'').localeCompare(cb?.name||'');
  });

  const groups = [
    ['char', 'CHARACTER', 'deck-zone-char'],
    ['companion', 'COMPANION', 'deck-zone-comp'],
    ['spell', 'SPELL', 'deck-zone-spell']
  ];

  function miniCard(id) {
    const c = CARDS[id];
    const fitClass = CHAR_IMGS[id] && /\.png$/i.test(CHAR_IMGS[id]) ? 'contain-art' : 'cover-art';
    const img = CHAR_IMGS[id] ? `<img class="${fitClass}" src="${CHAR_IMGS[id]}" alt="${c.name}">` : `<span>${c?.emoji || '🃏'}</span>`;
    return `<div class="deck-mini-card" role="button" tabindex="0" aria-label="View ${c?.name || id} details" onclick="showCardDetailFromId('${id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showCardDetailFromId('${id}')}">
      <div class="deck-mini-art">${img}</div>
      <div class="deck-mini-name">${c?.name || id}</div>
      <b>x${counts[id]}</b>
      <button title="Remove" aria-label="Remove one ${c?.name || id}" onclick="event.stopPropagation(); setDeckCount('${id}', -1)">×</button>
    </div>`;
  }

  root.innerHTML = groups.map(([type,title,cls]) => {
    const ids = entries.filter(id => CARDS[id]?.type === type);
    const typeCount = ids.reduce((sum,id)=>sum+(counts[id]||0),0);
    return `<div class="deck-zone ${cls}">
      <div class="deck-zone-title">${title} <small>${typeCount}/${DECK_TYPE_LIMITS[type]}</small></div>
      <div class="deck-zone-cards">${ids.length ? ids.map(miniCard).join('') : '<div class="deck-empty-slot">Drop / add cards from below</div>'}</div>
    </div>`;
  }).join('');
}

function renderDeckBuilder() {
  const root = document.getElementById('deckbuilder-root');
  if (!root || typeof CARDS === 'undefined') return;

  const counts = ensureDeckBuilderCounts();
  const stats = deckBuilderStats();

  const total = document.getElementById('db-total');
  const ch = document.getElementById('db-char');
  const co = document.getElementById('db-comp');
  const sp = document.getElementById('db-spell');
  const label = document.getElementById('deckbuilder-count-label');
  if (total) total.textContent = stats.total;
  if (ch) ch.textContent = `${stats.char}/${DECK_TYPE_LIMITS.char}`;
  if (co) co.textContent = `${stats.companion}/${DECK_TYPE_LIMITS.companion}`;
  if (sp) sp.textContent = `${stats.spell}/${DECK_TYPE_LIMITS.spell}`;
  if (label) label.textContent = `${stats.total} / 40`;

  const pill = document.querySelector('.db-total');
  if (pill) {
    pill.classList.toggle('good', stats.total === 40);
    pill.classList.toggle('bad', stats.total !== 40);
  }
  [['.db-char','char'],['.db-comp','companion'],['.db-spell','spell']].forEach(([selector,type]) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const atLimit = stats[type] === DECK_TYPE_LIMITS[type];
    el.classList.toggle('good', atLimit);
    el.classList.toggle('bad', !atLimit);
    el.classList.toggle('quota-full', atLimit);
  });
  renderDeckSlotsUI();
  renderDeckCurrentList();
  document.querySelectorAll('.db-pill').forEach(el => el.classList.remove('active'));
  const activePill = document.querySelector(DECKBUILDER_FILTER === 'all' ? '.db-total' : DECKBUILDER_FILTER === 'char' ? '.db-char' : DECKBUILDER_FILTER === 'companion' ? '.db-comp' : '.db-spell');
  if (activePill) activePill.classList.add('active');

  const typeOrder = { char:0, companion:1, spell:2 };
  const cards = Object.values(CARDS).sort((a,b) => {
    const to = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
    if (to) return to;
    const ro = cardRarityOrder(a.rarity) - cardRarityOrder(b.rarity);
    if (ro) return ro;
    return (a.name || '').localeCompare(b.name || '');
  });

  function art(card) {
    if (CHAR_IMGS[card.id]) {
      const fitClass = /\.png$/i.test(CHAR_IMGS[card.id]) ? 'contain-art' : 'cover-art';
      return `<img class="${fitClass}" src="${CHAR_IMGS[card.id]}" alt="${card.name}">`;
    }
    return `<span>${card.emoji || '🃏'}</span>`;
  }

  function statsText(card) {
    if (card.type === 'char') return `⚔ ${card.atk || 0} / 🛡 ${card.def || 0} / 💎 ${card.cost || 0}`;
    if (card.type === 'companion') return `+${card.ab || 0} ATK / +${card.db || 0} DEF`;
    return card.cost ? `Cost ${card.cost}` : 'Free';
  }

  function item(card) {
    const n = counts[card.id] || 0;
    const copyMaxed = n >= 3;
    const typeLimited = stats[card.type] >= DECK_TYPE_LIMITS[card.type];
    const deckFull = stats.total >= 40;
    const full = copyMaxed || typeLimited || deckFull;
    const limitLabel = copyMaxed
      ? (currentLang === 'th' ? 'ครบ 3 ใบแล้ว' : 'MAX 3 COPIES')
      : typeLimited
        ? (currentLang === 'th' ? 'ประเภทนี้เต็มแล้ว' : 'TYPE QUOTA FULL')
        : deckFull
          ? (currentLang === 'th' ? 'DECK เต็มแล้ว' : 'DECK FULL')
          : '';
    const limitClass = copyMaxed ? 'copy-maxed' : typeLimited ? 'type-limited' : deckFull ? 'deck-full' : '';
    return `
      <div class="deck-pick-card cl-${card.rarity} type-${card.type} ${n>0?'in-deck':''} ${full?'add-locked':''} ${limitClass}" role="button" tabindex="0" aria-label="View ${card.name} details" onclick="showCardDetailFromId('${card.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showCardDetailFromId('${card.id}')}">
        <div class="deck-pick-art">${art(card)}</div>
        <div class="deck-gallery-badges">
          <span>${(card.rarity || '').toUpperCase()}</span>
          <strong>${n}/3</strong>
        </div>
        ${limitLabel ? `<div class="deck-limit-state">${limitLabel}</div>` : ''}
        <div class="deck-pick-body">
          <div class="deck-pick-name">${card.name}</div>
          <div class="deck-pick-meta">${cardTypeLabel(card)} • ${elIcon(card.el)} ${card.el || 'neutral'}</div>
          <div class="deck-pick-stats">${statsText(card)}</div>
          <div class="deck-view-hint">${currentLang === 'th' ? 'แตะภาพเพื่อดูข้อมูล' : 'Tap artwork for details'}</div>
          <div class="deck-pick-controls">
            <button aria-label="Remove one ${card.name}" onclick="event.stopPropagation(); setDeckCount('${card.id}', -1)" ${n===0?'disabled':''}>−</button>
            <div class="deck-pick-count">${n}</div>
            <button aria-label="${full ? `${limitLabel}. ` : ''}Add one ${card.name}" title="${full ? limitLabel : `Add one ${card.name}`}" onclick="event.stopPropagation(); setDeckCount('${card.id}', 1)" ${full?'disabled':''}>+</button>
          </div>
        </div>
      </div>`;
  }

  let groups = [
    ['char', currentLang === 'th' ? 'CHARACTER / ตัวละคร' : 'CHARACTER'],
    ['companion', currentLang === 'th' ? 'COMPANION / คู่หู' : 'COMPANION'],
    ['spell', currentLang === 'th' ? 'SPELL / เวทมนตร์' : 'SPELL']
  ];
  if (DECKBUILDER_FILTER !== 'all') groups = groups.filter(([type]) => type === DECKBUILDER_FILTER);

  root.innerHTML = `<div class="deckbuilder-layout">${
    groups.map(([type,title]) => {
      const items = cards.filter(c => c.type === type);
      return `<section><div class="deckbuilder-section-title">${title}</div><div class="deckbuilder-card-grid">${items.map(item).join('')}</div></section>`;
    }).join('')
  }</div>`;
}

function initGame() {
  attackerLane = -1;
  G = {
    player: makeState(getPlayerDeckDef()),
    ai: makeState(AIDECK),
    phase: 'draw',
    turn: 1,
    activePlayer: 'player',
    crystal: 0,
    selectedCard: null,
    pendingCard: null,
    pendingLane: -1,
    pendingFormationLane: -1,
    playedChar: false,
    sacSelected: [],
    sacTarget: null,
    sacNeeded: 0,
    log: [],
    aiThinking: false,
    autoPlay: false,
    redrawCount: 0,
    maxRedraw: 3,
    highDrawHelpCount: 0,
    maxHighDrawHelp: 2,
    sacrificeReady: false,
  };
  G.player.lead = makeLead('mitria');
  G.ai.lead = makeLead('dark_empress');

  // Setup gates (top 5 of deck)
  ['player','ai'].forEach(side => {
    const s = G[side];
    for (let i = 0; i < 5; i++) {
      if (s.deck.length > 0) s.gates[i] = drawGateCard(side);
    }
  });

  // Draw starting hands (5 each but player doesn't draw on turn 1)
  drawCards('ai', 5);
  drawCards('player', 5);
  ensureOpeningPlayable('ai');
  const openingFixed = ensureOpeningPlayable('player');
  G.player.hand.forEach(c => c.sick = false); // starting hand not sick

  G.phase = 'main';
  addLog('🎮 Game Start! Deck shuffled.', 'ls');
  if (openingFixed) addLog('🧩 Anti-brick: free Character added to opening hand', 'lc');
  addLog('Formation Rule: ATK target = ATK vs ATK / Guard target = ATK vs DEF.', 'lc');
  addLog('Redraw: if your hand is dead, use ↻ Redraw up to 3 times per game. Midgame assist helps Epic/Legend appear.', 'lc');
  addLog(`Turn 1 — Your turn`, 'ls');

  render();
  updatePhaseUI();
  showMsg('Your Turn — Main Phase');
  showPhaseAnnounce('YOUR TURN', 'Main Phase');
}

function drawCards(side, n) {
  const s = G[side];
  let drew = 0;
  for (let i = 0; i < n; i++) {
    if (s.deck.length === 0) {
      if (side === 'player') { endGame(false, 'Deck is empty!'); return; }
      return;
    }
    const c = s.deck.shift();
    c.sick = false;
    if (s.hand.length < 7) { s.hand.push(c); drew++; }
    else { discardToGrave(side, c); }
  }
  return drew;
}

function handHasPlayableChar(side) {
  const s = G[side];
  return s.hand.some(c => c.type === 'char' && (c.cost || 0) === 0);
}

function handIsBricked(side) {
  const s = G[side];
  const hasChar = s.hand.some(c => c.type === 'char');
  const hasFreeChar = handHasPlayableChar(side);
  const onlyCompanionOrSpell = s.hand.every(c => c.type !== 'char');
  return !hasChar || !hasFreeChar || onlyCompanionOrSpell;
}

function ensureOpeningPlayable(side) {
  // For playtest: avoid dead opening hands.
  // Move one cost-0 Character from deck into hand if the opening hand has none.
  const s = G[side];
  const hasFreeChar = handHasPlayableChar(side);
  if (hasFreeChar) return false;
  const idx = s.deck.findIndex(c => c.type === 'char' && (c.cost || 0) === 0);
  if (idx < 0) return false;
  if (s.hand.length >= 7) s.hand.pop();
  const c = s.deck.splice(idx, 1)[0];
  c.sick = false;
  s.hand.unshift(c);
  return true;
}


function ensureMidgameHighRarity(side) {
  const s = G[side];
  if (side !== 'player') return false;
  if (G.turn < 4) return false;
  if (G.highDrawHelpCount >= G.maxHighDrawHelp) return false;
  if (s.hand.some(c => c.rarity === 'epic' || c.rarity === 'legendary')) return false;
  const idx = s.deck.findIndex(c => (c.rarity === 'epic' || c.rarity === 'legendary') && c.type === 'char');
  if (idx < 0 || s.hand.length >= 7) return false;
  const c = s.deck.splice(idx, 1)[0];
  c.sick = false;
  s.hand.push(c);
  G.highDrawHelpCount++;
  addLog(`🌟 Midgame draw assist: ${c.name} added to hand (${G.highDrawHelpCount}/${G.maxHighDrawHelp})`, 'lc');
  return true;
}

function smoothDraw(side) {
  // Soft anti-brick rule for prototype:
  // after drawing, if player has no free Character and board is empty, fetch one from deck.
  const s = G[side];
  const hasBoard = s.lanes.some(Boolean);
  if (hasBoard || handHasPlayableChar(side)) return false;
  return ensureOpeningPlayable(side);
}

function redrawHand() {
  if (G.phase !== 'main' || G.activePlayer !== 'player' || G.aiThinking) {
    showMsg(currentLang === 'th' ? 'Redraw ใช้ได้เฉพาะ Main Phase ของคุณ' : 'Redraw is only available during your Main Phase');
    return;
  }
  if (G.redrawCount >= G.maxRedraw) {
    showMsg(currentLang === 'th' ? 'ใช้ Redraw ครบแล้วในเกมนี้' : 'No Redraw uses left this game.');
    return;
  }
  const s = G.player;
  while (s.hand.length) {
    const card = s.hand.pop();
    card.sick = false;
    s.deck.push(card);
  }
  s.deck = shuffle(s.deck);
  drawCards('player', 5);
  const fixed = ensureOpeningPlayable('player');
  G.redrawCount++;
  addLog(`↻ Redraw Hand used (${G.redrawCount}/${G.maxRedraw})${fixed ? ' — free Character added' : ''}`, 'lp');
  showMsg(currentLang === 'th' ? 'Redraw มือใหม่แล้ว' : 'Hand redrawn');
  G.selectedCard = null;
  render();
  updatePhaseUI();
}

function restartGame() {
  if (!confirm(currentLang === 'th' ? 'เริ่มเกมใหม่?' : 'Restart the game?')) return;
  startGame();
}


function sendToGrave(side, card) {
  if (!card) return;
  const g = makeInst(card.id);
  g.sick = false;
  g.exhausted = false;
  g.veiled = false;
  g.atkBuff = 0;
  g.defBuff = 0;
  G[side].grave.push(g);
}

function removeLaneToGrave(side, laneIdx) {
  const c = G[side].lanes[laneIdx];
  if (!c) return null;
  sendToGrave(side, c);
  if (G[side].comps[laneIdx]) sendToGrave(side, G[side].comps[laneIdx]);
  G[side].lanes[laneIdx] = null;
  G[side].comps[laneIdx] = null;
  return c;
}

function discardToGrave(side, card) {
  sendToGrave(side, card);
}



function getPairBonus(host, comp) {
  if (!host || !comp) return { atk:0, def:0, text:'' };
  const list = Array.isArray(host.pairWith) ? host.pairWith : [];
  if (!list.includes(comp.id)) return { atk:0, def:0, text:'' };
  return {
    atk: host.pairAtk || 0,
    def: host.pairDef || 0,
    text: host.skill || ''
  };
}

function attachCompToLane(side, laneIdx, compCardLike, removeFromHand=true) {
  const host = G[side].lanes[laneIdx];
  if (!host) return false;

  const inst = makeInst(compCardLike.id);
  const oldComp = G[side].comps[laneIdx];

  // Separate temporary buffs from persistent Companion buffs.
  const oldPersistentAtk = n(oldComp?.ab) + n(host.pairBuffAtk);
  const oldPersistentDef = n(oldComp?.db) + n(host.pairBuffDef);
  const tempAtk = Math.max(0, n(host.atkBuff) - oldPersistentAtk);
  const tempDef = Math.max(0, n(host.defBuff) - oldPersistentDef);

  if (oldComp) sendToGrave(side, oldComp);

  const pair = getPairBonus(host, inst);
  host.pairBuffAtk = n(pair.atk);
  host.pairBuffDef = n(pair.def);

  G[side].comps[laneIdx] = inst;
  host.atkBuff = tempAtk + n(inst.ab) + n(pair.atk);
  host.defBuff = tempDef + n(inst.db) + n(pair.def);

  if (removeFromHand) {
    G[side].hand = G[side].hand.filter(c => c.iid !== compCardLike.iid);
  }
  return { inst, oldComp, pair };
}


// ============================================================
// PHASE CONTROL
// ============================================================



function n(v) {
  const x = Number(v || 0);
  return Number.isFinite(x) ? x : 0;
}

function resetLaneBuffs(side, laneIdx) {
  const host = G[side]?.lanes?.[laneIdx];
  if (!host) return;
  host.atkBuff = 0;
  host.defBuff = 0;
  host.pairBuffAtk = 0;
  host.pairBuffDef = 0;
}

function recalcLaneCompBuff(side, laneIdx) {
  const host = G[side]?.lanes?.[laneIdx];
  if (!host) return;
  const comp = G[side]?.comps?.[laneIdx];

  // Clear all temporary buffs, then re-apply persistent Companion + Pair bonus.
  host.atkBuff = 0;
  host.defBuff = 0;
  host.pairBuffAtk = 0;
  host.pairBuffDef = 0;

  if (!comp) return;

  const pair = getPairBonus(host, comp);
  host.pairBuffAtk = n(pair.atk);
  host.pairBuffDef = n(pair.def);
  host.atkBuff = n(comp.ab) + n(pair.atk);
  host.defBuff = n(comp.db) + n(pair.def);
}

function recalcAllCompBuffs(side) {
  for (let i = 0; i < 5; i++) recalcLaneCompBuff(side, i);
}

function getEffAtk(card) {
  return n(card?.atk) + n(card?.atkBuff);
}

function getEffDef(card) {
  return n(card?.def) + n(card?.defBuff);
}

function getDefenseValue(card) {
  if (!card) return 0;
  return card.pos === 'attack' ? getEffAtk(card) : getEffDef(card);
}

function getDefenseLabel(card) {
  return card?.pos === 'attack' ? 'ATK' : 'DEF';
}

function getFormationRule(card) {
  return card?.pos === 'attack' ? 'ATK Formation: ATK vs ATK' : 'Guard Formation: ATK vs DEF';
}

function compareCombat(attacker, defender) {
  const atkValue = getEffAtk(attacker);
  const defValue = getDefenseValue(defender);
  const result = atkValue > defValue ? 'attacker_wins' : atkValue < defValue ? 'defender_wins' : 'standoff';
  return {
    atkValue,
    defValue,
    defLabel: getDefenseLabel(defender),
    rule: getFormationRule(defender),
    result
  };
}


function getCombatPreview(myLane, theirLane) {
  const atk = G.player?.lanes?.[myLane];
  const def = G.ai?.lanes?.[theirLane];
  if (!atk) return null;

  const myAtk = getEffAtk(atk);

  if (!def) {
    if (G.ai.gatesActive[theirLane]) {
      return {
        html: `<strong>PREVIEW</strong> ${atk.name} ATK ${myAtk} → Gate ${theirLane+1} <span class="bp-rule">[Attack Gate]</span> <span class="bp-result gate">DESTROY GATE</span>`,
        plain: `${atk.name} ATK ${myAtk} attacks Gate ${theirLane+1}`
      };
    }
    return {
      html: `<strong>PREVIEW</strong> ${atk.name} ATK ${myAtk} → Enemy Lead <span class="bp-rule">[Direct Lead Damage]</span> <span class="bp-result kill">-${myAtk} LP</span>`,
      plain: `${atk.name} deals ${myAtk} damage to enemy Lead`
    };
  }

  const cmp = compareCombat(atk, def);
  let result = 'STANDOFF';
  let resultClass = 'standoff';
  if (cmp.result === 'attacker_wins') { result = `${def.name} DESTROYED`; resultClass = 'kill'; }
  else if (cmp.result === 'defender_wins') { result = `${atk.name} DESTROYED`; resultClass = 'dead'; }

  return {
    html: `<strong>PREVIEW</strong> ${atk.name} ATK ${cmp.atkValue} vs ${def.name} ${cmp.defLabel} ${cmp.defValue} <span class="bp-rule">[${cmp.rule}]</span> <span class="bp-result ${resultClass}">${result}</span>`,
    plain: `${atk.name} ATK ${cmp.atkValue} vs ${def.name} ${cmp.defLabel} ${cmp.defValue} [${cmp.rule}] = ${result}`
  };
}

function updateBattlePreview(laneIdx=null) {
  const el = document.getElementById('battle-preview');
  if (!el) return;
  if (G.phase !== 'battle' || attackerLane < 0) {
    el.classList.remove('on');
    el.innerHTML = '';
    return;
  }
  const lane = laneIdx ?? attackerLane;
  const pv = getCombatPreview(attackerLane, lane);
  if (!pv) {
    el.classList.remove('on');
    el.innerHTML = '';
    return;
  }
  el.innerHTML = pv.html;
  el.classList.add('on');
}



function getCardInfoHtml(card) {
  if (!card) return '';
  const type = card.type || 'card';
  if (type === 'char') {
    const atk = getEffAtk(card);
    const def = getEffDef(card);
    return `<strong>CARD</strong> <span class="ci-type">Character</span> ${card.emoji || ''} ${card.name} — ATK ${atk} / DEF ${def} / Cost ${card.cost || 0} <span class="ci-eff">${card.skill || ''}</span>`;
  }
  if (type === 'companion') {
    return `<strong>CARD</strong> <span class="ci-type">Companion</span> ${card.emoji || ''} ${card.name} — <span class="ci-eff">${card.effect || card.skill || 'Support'}</span> | Select your Character lane to attach or replace.`;
  }
  if (type === 'spell') {
    return `<strong>CARD</strong> <span class="ci-type">Spell</span> ${card.emoji || ''} ${card.name} — <span class="ci-eff">${card.effect || card.skill || 'Use spell effect'}</span>`;
  }
  return `<strong>CARD</strong> ${card.name}`;
}

function updateCardInfo() {
  const el = document.getElementById('card-info-bar');
  if (!el) return;
  if (!G || !G.selectedCard || G.phase !== 'main') {
    el.classList.remove('on');
    el.innerHTML = '';
    return;
  }
  el.innerHTML = getCardInfoHtml(G.selectedCard);
  el.classList.add('on');
}


function getStepHelpText() {
  if (!G || !G.phase) return currentLang === 'th' ? 'กด Play Test เพื่อเริ่มเกม' : 'Click Play Test to start.';

  const hasSelectedHand = G.selectedCard && G.player && G.player.hand && G.player.hand.some(c => c.iid === G.selectedCard.iid);
  const selected = G.selectedCard;

  if (G.aiThinking || G.phase === 'ai') {
    return currentLang === 'th'
      ? 'AI กำลังเล่นเทิร์นของตัวเอง รอสักครู่'
      : 'AI is taking its turn. Please wait.';
  }

  if (G.phase === 'draw') {
    return currentLang === 'th'
      ? 'เริ่มเทิร์น: จั่วการ์ด แล้วเข้าสู่ Main Phase'
      : 'Start of turn: draw cards, then enter Main Phase.';
  }

  if (G.phase === 'main') {
    if (selected && selected.type === 'char' && hasSelectedHand) {
      return currentLang === 'th'
        ? 'เลือก Lane ว่างฝั่งคุณเพื่อวาง Character จากนั้นเลือก Attack หรือ Guard'
        : 'Select an empty lane on your side to place the Character, then choose Attack or Guard.';
    }
    if (selected && selected.type === 'companion' && hasSelectedHand) {
      return currentLang === 'th'
        ? 'เลือก Character ฝั่งคุณเพื่อใส่หรือ Replace Companion — ดูความสามารถที่แถบ CARD'
        : 'Select one of your Characters to attach or replace the Companion — check the CARD info bar.';
    }
    if (selected && selected.type === 'spell' && hasSelectedHand) {
      return currentLang === 'th'
        ? 'เลือกเป้าหมายของ Spell หรือทำตามหน้าต่างที่เปิดขึ้น'
        : 'Choose the Spell target or follow the opened prompt.';
    }
    return currentLang === 'th'
      ? 'Main Phase: เล่นการ์ด / ใช้ Formation Command / ถ้ามือตันให้กด ↻ จั่วใหม่ / หรือกด Battle'
      : 'Main Phase: play a hand card, use Formation Command, press ↻ Redraw if bricked, or press Battle.';
  }

  if (G.phase === 'battle') {
    if (attackerLane >= 0) {
      return currentLang === 'th'
        ? 'เลือกเป้าหมายใน Lane เดียวกัน แล้วดู PREVIEW: ATK เป้าหมาย = วัด ATK / GRD เป้าหมาย = วัด DEF'
        : 'Choose a target in the same lane and check PREVIEW: ATK target uses ATK / GRD target uses DEF.';
    }
    return currentLang === 'th'
      ? 'Battle Phase: คลิก Character ฝั่งคุณที่เป็น ATK Formation ถ้าเป้าหมายเป็น ATK = วัด ATK vs ATK / ถ้าเป็น GRD = วัด ATK vs DEF'
      : 'Battle Phase: click your ATK Formation Character. If target is ATK = ATK vs ATK; if target is GRD = ATK vs DEF.';
  }

  return currentLang === 'th'
    ? 'กด End Turn เพื่อจบเทิร์น'
    : 'Press End Turn to finish your turn.';
}

function updateStepHelp() {
  const el = document.getElementById('step-help');
  if (!el) return;
  el.innerHTML = `<strong>${currentLang === 'th' ? 'ต่อไป' : 'NEXT'}</strong> ${getStepHelpText()}`;
}



function mainPhaseAction() {
  if (!G || G.aiThinking || G.activePlayer !== 'player') return;
  if (G.phase === 'draw') {
    drawCards('player', 2);
    G.phase = 'main';
    addLog('🃏 You draw 2 cards', 'lp');
    showPhaseAnnounce('DRAW 2', 'Main Phase begins');
    updatePhaseUI();
    render();
    return;
  }
  if (G.phase === 'main') {
    goToBattle();
    return;
  }
  if (G.phase === 'battle') {
    endTurn();
    return;
  }
}

function updatePhaseUI() {
  const pill = document.getElementById('phase-pill');
  const btnMain = document.getElementById('btn-main-action');
  const btnR = document.getElementById('btn-redraw');
  const btnReset = document.getElementById('btn-reset-game');
  const btnAuto = document.getElementById('btn-auto');
  const turnEl = document.getElementById('g-turn');

  if (turnEl) turnEl.textContent = `${t('turn')} ${G.turn}`;
  if (btnR) {
    const redrawLabel = currentLang === 'th' ? 'จั่วใหม่' : 'Redraw';
    btnR.innerHTML = `↻ <span>${redrawLabel} ${G.redrawCount||0}/${G.maxRedraw||3}</span>`;
    btnR.setAttribute('aria-label',`${redrawLabel} ${G.redrawCount||0} of ${G.maxRedraw||3}`);
    btnR.title = btnR.getAttribute('aria-label');
  }
  if (btnReset) {
    const restartLabel = currentLang === 'th' ? 'เริ่มใหม่' : 'Restart';
    btnReset.innerHTML = `⟳ <span>${restartLabel}</span>`;
    btnReset.setAttribute('aria-label',restartLabel);
    btnReset.title = restartLabel;
  }
  if (btnAuto) {
    btnAuto.innerHTML = `<span class="auto-bot" aria-hidden="true">🤖</span><span>AI Autoplay</span>`;
    btnAuto.title = G?.autoPlay ? 'AI Autoplay: On' : 'AI Autoplay: Off';
    btnAuto.setAttribute('aria-label',btnAuto.title);
    btnAuto.setAttribute('aria-pressed',G?.autoPlay ? 'true' : 'false');
  }

  const phases = {
    draw: ['DRAW', 'ph-draw'],
    main: ['MAIN', 'ph-main'],
    battle: ['BATTLE', 'ph-battle'],
    end: ['END', 'ph-end'],
    ai: ['AI TURN', 'ph-ai'],
  };
  const [txt, cls] = phases[G.phase] || ['', ''];
  if (pill) {
    pill.textContent = txt;
    pill.className = 'phase-pill ' + cls;
  }

  const isPlayer = G.activePlayer === 'player' && !G.aiThinking;
  if (btnMain) {
    btnMain.className = 'game-action-button btn-main-action';
    if (!isPlayer || G.phase === 'ai' || G.phase === 'done') {
      btnMain.disabled = true;
      btnMain.textContent = currentLang === 'th' ? 'รอ AI' : 'WAIT';
      btnMain.classList.add('main-action-wait');
    } else if (G.phase === 'draw') {
      btnMain.disabled = false;
      btnMain.textContent = currentLang === 'th' ? 'จั่วการ์ด' : 'DRAW';
      btnMain.classList.add('main-action-draw');
    } else if (G.phase === 'main') {
      btnMain.disabled = false;
      btnMain.textContent = currentLang === 'th' ? '⚔️ ต่อสู้' : '⚔️ BATTLE';
      btnMain.classList.add('main-action-battle');
    } else if (G.phase === 'battle') {
      btnMain.disabled = false;
      btnMain.textContent = currentLang === 'th' ? 'จบเทิร์น →' : 'END TURN →';
      btnMain.classList.add('main-action-end');
    }
  }

  if (btnR) btnR.disabled = !(isPlayer && G.phase === 'main' && G.redrawCount < G.maxRedraw);
  if (btnReset) btnReset.disabled = false;
  updateStepHelp();
  updateCardInfo();
}

function goToBattle() {
  if (G.phase !== 'main') return;
  G.phase = 'battle';
  attackerLane = -1;
  G.selectedCard = null;
  updateBattlePreview();
  updatePhaseUI();
  render();
  showMsg('Battle Phase — Select a Character to attack');
  showPhaseAnnounce('BATTLE PHASE', 'Select a Character to attack');
  addLog('⚔️ Battle Phase', 'ls');
}

function endTurn() {
  if (G.phase !== 'battle') return;
  G.selectedCard = null;
  attackerLane = -1;
  updateBattlePreview();
  // remove buffs, reset veil
  ['player','ai'].forEach(side => {
    G[side].lanes.forEach(c => {
      if (c) { c.atkBuff = 0; c.defBuff = 0; c.pairBuffAtk = 0; c.pairBuffDef = 0; c.veiled = false; c.exhausted = false; c.formationLocked = false; c.originalFormationThisTurn = null; }
    });
    recalcAllCompBuffs(side);
  });
  // remove sickness from player chars
  G.player.lanes.forEach(c => { if (c) c.sick = false; });
  G.playedChar = false;
  G.crystal = 0;
  addLog('— End of your turn —', 'ls');
  showPhaseAnnounce('END TURN', 'AI turn begins');
  doAiTurn();
}

// ============================================================
// PLAYER ACTIONS
// ============================================================
function selectHandCard(idx) {
  if (G.phase !== 'main' || G.activePlayer !== 'player' || G.aiThinking) return;
  const card = G.player.hand[idx];
  if (!card) return;

  // Deselect if same
  if (G.selectedCard && G.selectedCard.iid === card.iid) {
    G.selectedCard = null;
    render();
    return;
  }

  // Check if companion / spell can be played
  if (card.type === 'companion') {
    G.selectedCard = card;
    render();
    showMsg(`${card.name}: ${card.effect || card.skill || ''} — Select a Character lane. Existing Companion will be replaced.`);
    return;
  }
  if (card.type === 'spell') {
    G.selectedCard = card;
    render();
    showMsg(`${card.name}: ${card.effect || card.skill || ''}`);
    playSpell(card);
    return;
  }
  // character: playtest mode allows any number of characters per turn,
  // limited only by empty lanes, hand size, and sacrifice cost.
  G.selectedCard = card;
  G.pendingCard = card;
  G.pendingLane = -1;
  G.sacrificeReady = false;

  if ((card.cost || 0) > 0) {
    render();
    openSacModal(card, card.cost, -1);
    return;
  }

  render();
  showMsg(currentLang === 'th' ? 'เลือก Lane สีเขียวเพื่อวาง Character' : 'Select a green Lane to place character');
}

function clickPlayerLane(laneIdx) {
  if (!G.selectedCard || G.aiThinking) return;
  G.pendingFormationLane = -1;
  const card = G.selectedCard;

  if (card.type === 'companion') {
    if (!G.player.lanes[laneIdx]) { showMsg('No character in this lane'); return; }
    const result = attachCompToLane('player', laneIdx, card, true);
    if (!result) return;
    G.selectedCard = null;
    if (result.oldComp) {
      addLog(`♻️ Replaced ${result.oldComp.name} with ${result.inst.name} in Lane ${laneIdx+1}`, 'lp');
    } else {
      addLog(`🎮 You attached ${result.inst.name} to Lane ${laneIdx+1}`, 'lp');
    }
    if ((result.pair?.atk || 0) > 0 || (result.pair?.def || 0) > 0) {
      addLog(`✨ Pair Bonus activated on ${G.player.lanes[laneIdx].name}: +${result.pair.atk||0} ATK / +${result.pair.def||0} DEF`, 'lp');
    }
    addLog(`📊 ${G.player.lanes[laneIdx].name} final stats: ATK ${getEffAtk(G.player.lanes[laneIdx])} / DEF ${getEffDef(G.player.lanes[laneIdx])}`, 'lc');
    render();
    return;
  }

  if (card.type !== 'char') return;

  const cost = card.cost || 0;
  if (G.player.lanes[laneIdx]) {
    showMsg(currentLang === 'th' ? 'เลนนี้มีตัวอยู่แล้ว เลือก Lane ว่างหรือเลนที่บูชายัญไปแล้ว' : 'Lane occupied. Select an empty lane or the lane you sacrificed.');
    return;
  }

  if (cost > 0 && !G.sacrificeReady) {
    G.pendingCard = card;
    G.pendingLane = -1;
    openSacModal(card, cost, -1);
    return;
  }

  G.pendingCard = card;
  G.pendingLane = laneIdx;
  openPosModal(card);
}

function confirmPosition(pos) {
  // Formation Command: switch existing board character during Main Phase.
  if (G.pendingFormationLane >= 0) {
    const lane = G.pendingFormationLane;
    const c = G.player.lanes[lane];
    document.getElementById('ov-pos').classList.remove('on');
    G.pendingFormationLane = -1;

    if (!c) return;
    if (c.sick) {
      showMsg(currentLang === 'th' ? 'ตัวที่เพิ่งลงยังเปลี่ยน Formation ไม่ได้' : 'Newly played cards cannot switch formation yet');
      return;
    }

    if (!c.originalFormationThisTurn) c.originalFormationThisTurn = c.pos;
    c.pos = pos;
    c.formationLocked = c.pos !== c.originalFormationThisTurn;
    addLog(`${pos === 'attack' ? '⚔️' : '🛡️'} Formation Command: ${c.name} set to ${pos === 'attack' ? 'Attack' : 'Guard'} Formation`, 'lp');
    if (c.formationLocked) addLog(`⏳ ${c.name} cannot attack this turn after switching Formation`, 'lc');
    else addLog(`✅ ${c.name} returned to original Formation and can attack this turn`, 'lc');
    render();
    return;
  }

  // Do NOT use closeModal() here because it clears pendingCard/pendingLane.
  // We need those values to actually place the selected card.
  const card = G.pendingCard;
  const lane = G.pendingLane;
  document.getElementById('ov-pos').classList.remove('on');
  if (!card || lane < 0) return;

  const inst = makeInst(card.id);
  inst.pos = pos;
  inst.sick = true;
  G.player.lanes[lane] = inst;
  G.player.hand = G.player.hand.filter(c => c.iid !== card.iid);
  if (G.crystal > 0) G.crystal = Math.max(0, G.crystal - (card.cost || 0));
  G.playedChar = true;
  G.selectedCard = null;
  G.pendingCard = null;
  G.pendingLane = -1;
  G.sacrificeReady = false;

  addLog(`🎮 You played ${inst.emoji} ${inst.name} (${pos}) → Lane ${lane+1}`, 'lp');
  addLog(`💤 ${inst.name} cannot attack this turn`, 'lc');

  // Skill: on_play_discard (dark empress style for player too if applicable)
  render();
}

function openSacModal(card, needed, preselectLane=-1) {
  G.sacNeeded = needed;
  G.sacSelected = [];
  if (preselectLane >= 0 && G.player.lanes[preselectLane]) G.sacSelected = [preselectLane];
  G.sacTarget = card;

  document.getElementById('sac-info').innerHTML =
    currentLang === 'th'
      ? `การลง <strong>${card.emoji} ${card.name}</strong> ต้องจ่าย <strong>${needed} Cost</strong><br>${preselectLane >= 0 ? 'เลนที่ต้องการลงทับถูกเลือกเป็นวัตถุดิบบูชายัญแล้ว<br>' : ''}เลือก Character บนสนามเพื่อจ่าย Cost จากนั้นค่อยเลือก Lane ที่จะลง:`
      : `Playing <strong>${card.emoji} ${card.name}</strong> requires <strong>${needed} Cost</strong>.<br>${preselectLane >= 0 ? 'The target lane is preselected as sacrifice.<br>' : ''}Sacrifice characters from your field, then select a Lane to place the card:`;

  buildSacGrid();
  updateSacBar();
  document.getElementById('ov-sac').classList.add('on');
}

function buildSacGrid() {
  const grid = document.getElementById('sac-grid');
  grid.innerHTML = '';
  G.player.lanes.forEach((c, i) => {
    if (!c) return;
    const el = document.createElement('div');
    el.className = 'sac-item' + (G.sacSelected.includes(i) ? ' sac-sel' : '');
    el.innerHTML = `${c.emoji} ${c.name}<br><small>💎${c.cv} Crystal</small>`;
    el.onclick = () => toggleSac(i);
    grid.appendChild(el);
  });
  if (grid.innerHTML === '') {
    grid.innerHTML = `<div style="color:var(--dim);font-size:12px">${t('noSac')}</div>`;
  }
}

function toggleSac(laneIdx) {
  const i = G.sacSelected.indexOf(laneIdx);
  if (i >= 0) G.sacSelected.splice(i, 1);
  else G.sacSelected.push(laneIdx);
  buildSacGrid();
  updateSacBar();
}

function updateSacBar() {
  const total = G.sacSelected.reduce((s, i) => s + (G.player.lanes[i]?.cv || 0), 0);
  document.getElementById('sac-crystal-bar').textContent = `Cost: ${total} / ${G.sacNeeded}`;
  document.getElementById('sac-confirm').disabled = total < G.sacNeeded;
}

function confirmSacrifice() {
  const total = G.sacSelected.reduce((s, i) => s + (G.player.lanes[i]?.cv || 0), 0);
  if (total < G.sacNeeded) return;

  G.sacSelected.forEach(i => {
    const c = G.player.lanes[i];
    addLog(`💎 Sacrificed ${c.emoji} ${c.name} from Lane ${i+1}`, 'lp');
    removeLaneToGrave('player', i);
  });
  G.crystal += total;
  document.getElementById('ov-sac').classList.remove('on');
  G.sacSelected = [];
  G.sacrificeReady = true;
  G.selectedCard = G.pendingCard;
  G.pendingLane = -1;
  render();
  showMsg(currentLang === 'th' ? 'เลือก Lane สีเขียวเพื่อวางการ์ดที่จ่าย Cost แล้ว' : 'Select a green Lane to place the paid Cost card');
}


function quickSwitchFormation(laneIdx) {
  if (G.phase !== 'main' || G.activePlayer !== 'player' || G.aiThinking) return;
  const c = G.player.lanes[laneIdx];
  if (!c) return;
  if (c.sick) {
    showMsg(currentLang === 'th' ? 'ตัวที่เพิ่งลงยังเปลี่ยน Formation ไม่ได้' : 'Newly played cards cannot switch formation yet');
    return;
  }
  if (!c.originalFormationThisTurn) c.originalFormationThisTurn = c.pos;
  c.pos = c.pos === 'attack' ? 'guard' : 'attack';
  c.formationLocked = c.pos !== c.originalFormationThisTurn;
  addLog(`🔄 ${c.name} switched to ${c.pos === 'attack' ? 'ATK' : 'GRD'} Formation`, 'lp');
  if (c.formationLocked) addLog(`⏳ ${c.name} cannot attack this turn after switching Formation`, 'lc');
  else addLog(`✅ ${c.name} returned to original Formation and can attack this turn`, 'lc');
  showMsg(`${c.name}: ${c.pos === 'attack' ? 'ATK' : 'GRD'} Formation${c.formationLocked ? ' — cannot attack this turn' : ' — original formation restored'}`);
  render();
  updatePhaseUI();
}

function toggleFormation(laneIdx) {
  if (G.phase !== 'main' || G.activePlayer !== 'player' || G.aiThinking) return;
  const c = G.player.lanes[laneIdx];
  if (!c) return;
  if (c.sick) {
    showMsg(currentLang === 'th' ? 'ตัวที่เพิ่งลงยังเปลี่ยน Formation ไม่ได้' : 'Newly played cards cannot switch formation yet');
    return;
  }

  G.pendingFormationLane = laneIdx;
  G.pendingCard = null;
  G.pendingLane = -1;

  document.getElementById('lbl-choose-position').textContent = currentLang === 'th' ? 'FORMATION COMMAND' : 'FORMATION COMMAND';
  document.getElementById('pos-card-info').innerHTML =
    currentLang === 'th'
      ? `<strong>${c.emoji} ${c.name}</strong><br>ATK = วัด ATK vs ATK เมื่อโดนตี<br>GRD = วัด ATK vs DEF เมื่อโดนตี`
      : `<strong>${c.emoji} ${c.name}</strong><br>ATK = uses ATK when attacked<br>GRD = uses DEF when attacked`;

  document.getElementById('ov-pos').classList.add('on');
}

function openPosModal(card) {
  document.getElementById('lbl-choose-position').textContent = currentLang === 'th' ? 'เลือก Formation ตอนลงการ์ด' : 'Choose Formation';
  document.getElementById('pos-card-info').innerHTML =
    `<strong>${card.emoji} ${card.name}</strong> — ATK ${card.atk} / DEF ${card.def}`;
  document.getElementById('ov-pos').classList.add('on');
}

// COMBAT
let attackerLane = -1;


function cancelAttack() {
  if (G.phase !== 'battle' || attackerLane < 0) return;
  const c = G.player.lanes[attackerLane];
  attackerLane = -1;
  G.selectedCard = null;
  updateBattlePreview();
  render();
  updatePhaseUI();
  showMsg(currentLang === 'th' ? 'ยกเลิกการโจมตีแล้ว' : 'Attack cancelled');
  addLog(`↩️ Attack cancelled${c ? ': ' + c.name : ''}`, 'lc');
}


function clickPlayerCharForAttack(laneIdx) {
  if (G.phase !== 'battle' || G.aiThinking) return;
  if (attackerLane === laneIdx && G.selectedCard) {
    cancelAttack();
    return;
  }
  const c = G.player.lanes[laneIdx];
  if (!c) return;
  if (c.sick) {
    showMsg(currentLang === 'th' ? 'การ์ดที่เพิ่งลงยังโจมตีไม่ได้ในเทิร์นนี้' : 'Newly played cards cannot attack this turn');
    return;
  }
  if (c.formationLocked) {
    showMsg(currentLang === 'th' ? 'การ์ดที่สลับ Formation แล้วจะโจมตีไม่ได้ในเทิร์นนี้' : 'Cards that switched Formation cannot attack this turn');
    return;
  }
  if (c.pos !== 'attack') {
    showMsg(currentLang === 'th' ? 'Guard Formation โจมตีไม่ได้ — เปลี่ยนเป็น Attack ใน Main Phase ก่อน' : 'Guard Formation cannot attack — switch to Attack in Main Phase first');
    return;
  }
  if (c.exhausted) {
    showMsg(currentLang === 'th' ? 'การ์ดใบนี้โจมตีไปแล้ว' : 'This card already attacked');
    return;
  }
  if (c.veiled) {
    showMsg(currentLang === 'th' ? 'การ์ดใบนี้ถูกปิดผนึกอยู่' : 'This card is veiled');
    return;
  }

  attackerLane = laneIdx;
  G.selectedCard = c;
  render();
  updatePhaseUI();
  showMsg(`${c.emoji} ${c.name} ready to attack — select target lane or click again to cancel`);
}

function clickAiLane(laneIdx) {
  if (G.phase !== 'battle' || attackerLane < 0 || G.aiThinking) return;
  if (laneIdx !== attackerLane) {
    showMsg(currentLang === 'th' ? 'โจมตีได้เฉพาะ Lane เดียวกันเท่านั้น' : 'Can only attack the same lane!');
    return;
  }

  const pv = getCombatPreview(attackerLane, laneIdx);
  if (pv) {
    addLog(`🔎 ${pv.plain}`, 'lc');
    updateBattlePreview(laneIdx);
  }

  resolveCombat(attackerLane, laneIdx);
  attackerLane = -1;
  G.selectedCard = null;
  updateBattlePreview();
  render();
  updatePhaseUI();
}

function resolveCombat(myLane, theirLane) {
  const atk = G.player.lanes[myLane];
  const def = G.ai.lanes[theirLane];

  if (!atk) return;
  atk.exhausted = true;

  if (!def) {
    // Attack Gate
    if (G.ai.gatesActive[theirLane]) {
      destroyGate('ai', theirLane);
      addLog(`💥 Lane ${theirLane+1}: Gate destroyed! AI gets the card`, 'lc');
      showDmgFloat('-1 GATE', theirLane, 'ai');
      // Skill: mitria on_win_draw
      if (atk.skillFn === 'on_win_draw') drawCards('player', 1);
    } else {
      const myAtk = getEffAtk(atk);
      damageLead('ai', myAtk, theirLane);
      if (atk.skillFn === 'on_win_draw') drawCards('player', 1);
    }
  } else {
    // Attack character
    const cmp = compareCombat(atk, def);

    addLog(`⚔️ L${myLane+1}: ${atk.emoji}${atk.name} ATK ${cmp.atkValue} vs ${def.emoji}${def.name} ${cmp.defLabel} ${cmp.defValue} [${cmp.rule}]`, 'lc');
    showDmgFloat('-' + cmp.atkValue, theirLane, 'ai');

    if (cmp.result === 'attacker_wins') {
      removeLaneToGrave('ai', theirLane);
      addLog(`✅ Result: ${cmp.atkValue} > ${cmp.defValue} — ${def.name} destroyed!`, 'lp');
      showBattleResultBig('win', 'BREAK', `${atk.name} destroyed ${def.name}`);
      showDmgFloat('KILL!', theirLane, 'ai');
      if (atk.skillFn === 'on_win_draw') drawCards('player', 1);
    } else if (cmp.result === 'defender_wins') {
      showDmgFloat('-' + cmp.defValue, myLane, 'player');
      removeLaneToGrave('player', myLane);
      addLog(`❌ Result: ${cmp.atkValue} < ${cmp.defValue} — ${atk.name} destroyed!`, 'la');
      showBattleResultBig('defeat', 'COUNTER', `${atk.name} was destroyed`);
    } else {
      showDmgFloat('-' + cmp.defValue, myLane, 'player');
      addLog(`⚡ Result: ${cmp.atkValue} = ${cmp.defValue} — STANDOFF / neither destroyed`, 'lc');
      showBattleResultBig('standoff', 'STAND OFF', `${atk.name} vs ${def.name}`);
    }
  }
  checkWin();
  render();
}

function destroyGate(side, laneIdx) {
  const s = G[side];
  if (!s.gatesActive[laneIdx]) return;
  s.gatesActive[laneIdx] = false;
  const gateCard = s.gates[laneIdx];
  if (gateCard && s.hand.length < 7) {
    gateCard.sick = false;
    s.hand.push(gateCard);
  }
  s.gateCount = s.gatesActive.filter(Boolean).length;
}

function damageLead(side, amount, laneIdx) {
  const lead = G[side].lead;
  lead.lp = Math.max(0, lead.lp - amount);
  const targetName = side === 'ai' ? 'AI Lead' : 'Your Lead';
  addLog(`💔 ${targetName} takes ${amount} damage! LP ${lead.lp}/${lead.maxLp}`, side === 'ai' ? 'lp' : 'la');
  showDmgFloat('-' + amount + ' LP', laneIdx, side);
}


function showBattleResultBig(kind, main, sub='') {
  if (!document.getElementById('sc-game')?.classList.contains('on')) return;
  document.querySelectorAll('.battle-result-big').forEach(e => e.remove());
  const el = document.createElement('div');
  el.className = `battle-result-big ${kind}`;
  el.innerHTML = `${main}${sub ? `<small>${sub}</small>` : ''}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}


function showPhaseAnnounce(main, sub='') {
  if (!document.getElementById('sc-game')?.classList.contains('on')) return;
  document.querySelectorAll('.phase-announce').forEach(e => e.remove());
  const el = document.createElement('div');
  el.className = 'phase-announce';
  el.innerHTML = `${main}${sub ? `<small>${sub}</small>` : ''}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1250);
}

function showDmgFloat(txt, lane, side='ai') {
  const el = document.createElement('div');
  el.className = 'dmg-pop';
  el.textContent = txt;
  const row = document.getElementById(side === 'player' ? 'p-chars-row' : 'ai-chars-row');
  const target = row?.children?.[lane];
  const rect = target?.getBoundingClientRect();
  el.style.left = rect ? `${rect.left + rect.width / 2}px` : '50%';
  el.style.top = rect ? `${rect.top + rect.height / 2}px` : '50%';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// ============================================================
// SPELLS
// ============================================================
function playSpell(card) {
  const fn = card.spellFn;
  if (!fn) { playSpellFinish(card); return; }

  if (fn === 'draw2') {
    drawCards('player', 2);
    playSpellFinish(card);
    addLog(`🌀 Charm Fragment: Drew 2 cards`, 'lp');
  } else if (fn === 'destroy_enemy') {
    // show target modal
    openTargetModal(card, 'enemy_char');
  } else if (fn === 'revive_char') {
    if (!G.player.grave.some(c => c.type === 'char')) { showMsg(currentLang === 'th' ? 'ยังไม่มี Character ในสุสาน' : 'No Character in graveyard'); G.selectedCard = null; render(); return; }
    openTargetModal(card, 'revive_char');
  } else if (fn === 'buff_def') {
    openTargetModal(card, 'my_char');
  } else if (fn === 'atk_all') {
    G.player.lanes.forEach(c => { if (c) c.atkBuff = (c.atkBuff||0) + 2; });
    playSpellFinish(card);
    addLog(`⚡ Dark Surge: +2 ATK to all your characters this turn`, 'lp');
  } else if (fn === 'veil_enemy') {
    openTargetModal(card, 'enemy_char_veil');
  } else if (fn === 'restore_gate') {
    const hasBrokenGate = G.player.gatesActive.some(active => !active);
    const hasHandCard = G.player.hand.some(c => c.iid !== card.iid);
    if (!hasBrokenGate) {
      showMsg(currentLang === 'th' ? 'ยังไม่มี Gate ที่ถูกทำลาย' : 'No destroyed Gate to restore');
      G.selectedCard = null; render(); return;
    }
    if (!hasHandCard) {
      showMsg(currentLang === 'th' ? 'ต้องมีการ์ดอื่นบนมือเพื่อเปลี่ยนเป็น Gate' : 'Need another hand card to turn into a Gate');
      G.selectedCard = null; render(); return;
    }
    openTargetModal(card, 'hand_to_gate');
  } else if (fn === 'move_own') {
    const hasChar = G.player.lanes.some(Boolean);
    const hasEmpty = G.player.lanes.some(c => !c);
    if (!hasChar || !hasEmpty) { showMsg(currentLang === 'th' ? 'ต้องมีตัวละครและ Lane ว่าง' : 'Need a character and an empty lane'); G.selectedCard=null; render(); return; }
    openTargetModal(card, 'move_from');
  } else {
    playSpellFinish(card);
  }
}

function openTargetModal(card, mode) {
  G._spellCard = card;
  G._spellMode = mode;
  const list = document.getElementById('tgt-list');
  list.innerHTML = '';
  const title = document.getElementById('tgt-title');

  if (mode === 'enemy_char' || mode === 'enemy_char_veil') {
    title.textContent = t('selectEnemy');
    G.ai.lanes.forEach((c, i) => {
      if (!c) return;
      const el = document.createElement('div');
      el.className = 'tgt-item';
      const protectedLegend = mode === 'enemy_char' && c.rarity === 'legendary';
      el.innerHTML = `<span style="font-size:18px">${c.emoji}</span> ${c.name} — ATK${getEffAtk(c)} / DEF${getEffDef(c)} ${protectedLegend ? '<small style="color:#ffd36e">Legendary: protected</small>' : ''}`;
      if (protectedLegend) {
        el.style.opacity = '.45';
        el.style.cursor = 'not-allowed';
        el.title = 'Crystal Burst cannot destroy Legendary cards';
      } else {
        el.onclick = () => applySpell(i);
      }
      list.appendChild(el);
    });
  } else if (mode === 'my_char') {
    title.textContent = currentLang === 'th' ? 'เลือก Character ของคุณ (+3 DEF)' : 'Select Your Character (+3 DEF)';
    G.player.lanes.forEach((c, i) => {
      if (!c) return;
      const el = document.createElement('div');
      el.className = 'tgt-item';
      el.innerHTML = `<span style="font-size:18px">${c.emoji}</span> ${c.name} — ATK${c.atk} / DEF${c.def+c.defBuff}`;
      el.onclick = () => applySpell(i);
      list.appendChild(el);
    });
  } else if (mode === 'move_from') {
    title.textContent = currentLang === 'th' ? 'เลือก Character ที่ต้องการย้าย' : 'Select Character to move';
    G.player.lanes.forEach((c, i) => {
      if (!c) return;
      const el = document.createElement('div');
      el.className = 'tgt-item';
      el.innerHTML = `<span style="font-size:18px">${c.emoji}</span> ${c.name} — Lane ${i+1}`;
      el.onclick = () => applySpell(i);
      list.appendChild(el);
    });
  } else if (mode === 'move_to') {
    title.textContent = currentLang === 'th' ? 'เลือก Lane ว่างปลายทาง' : 'Select empty destination lane';
    G.player.lanes.forEach((c, i) => {
      if (c) return;
      const el = document.createElement('div');
      el.className = 'tgt-item';
      el.innerHTML = `↔️ Lane ${i+1}`;
      el.onclick = () => applySpell(i);
      list.appendChild(el);
    });
  } else if (mode === 'hand_to_gate') {
    title.textContent = currentLang === 'th' ? 'เลือก 1 ใบจากมือ เพื่อเปลี่ยนเป็น Gate' : 'Choose 1 card from hand to become a Gate';
    G.player.hand.forEach((c, i) => {
      if (c.iid === card.iid) return;
      const el = document.createElement('div');
      el.className = 'tgt-item';
      const tag = c.type ? c.type.toUpperCase() : 'CARD';
      el.innerHTML = `<span style="font-size:18px">${c.emoji || '🃏'}</span> ${c.name} <small style="margin-left:auto;color:var(--dim)">${tag}</small>`;
      el.onclick = () => applySpell(i);
      list.appendChild(el);
    });
  } else if (mode === 'gate_to_restore') {
    title.textContent = currentLang === 'th' ? 'เลือก Gate ที่จะซ่อมกลับมา' : 'Choose destroyed Gate to restore';
    G.player.gatesActive.forEach((active, i) => {
      if (active) return;
      const el = document.createElement('div');
      el.className = 'tgt-item';
      el.innerHTML = `🛡️ Gate ${i+1}`;
      el.onclick = () => applySpell(i);
      list.appendChild(el);
    });
  } else if (mode === 'revive_char') {
    title.textContent = t('selectRevive');
    G.player.grave.forEach((c, i) => {
      if (c.type !== 'char') return;
      const el = document.createElement('div');
      el.className = 'tgt-item';
      el.innerHTML = `<span style="font-size:18px">${c.emoji}</span> ${c.name} — ATK${c.atk} / DEF${c.def}`;
      el.onclick = () => applySpell(i);
      list.appendChild(el);
    });
  }

  if (list.innerHTML === '') {
    list.innerHTML = `<p style="color:var(--dim);font-size:12px">${t('noTarget')}</p>`;
  }
  document.getElementById('ov-tgt').classList.add('on');
}

function applySpell(targetIdx) {
  const card = G._spellCard;
  const mode = G._spellMode;
  closeModal('ov-tgt');

  if (mode === 'enemy_char') {
    const c = G.ai.lanes[targetIdx];
    if (c) {
      if (c.rarity === 'legendary') {
        addLog(`💎 Crystal Burst: ${c.name} is Legendary and resists destruction!`, 'lc');
        showMsg(currentLang === 'th' ? 'Crystal Burst ทำลาย Legendary ไม่ได้' : 'Crystal Burst cannot destroy Legendary cards');
      } else {
        addLog(`💎 Crystal Burst: Destroyed ${c.name}!`, 'lp');
        removeLaneToGrave('ai', targetIdx);
      }
    }
  } else if (mode === 'enemy_char_veil') {
    const c = G.ai.lanes[targetIdx];
    if (c) { c.veiled = true; addLog(`🌫️ Shadow Veil: ${c.name} cannot attack this turn`, 'lp'); }
  } else if (mode === 'my_char') {
    const c = G.player.lanes[targetIdx];
    if (c) { c.defBuff = (c.defBuff||0) + 3; addLog(`🔮 Shield Charm: +3 DEF to ${c.name}`, 'lp'); }
  } else if (mode === 'hand_to_gate') {
    G._gateHandIdx = targetIdx;
    openTargetModal(card, 'gate_to_restore');
    return;
  } else if (mode === 'gate_to_restore') {
    const handIdx = G._gateHandIdx;
    if (handIdx >= 0 && !G.player.gatesActive[targetIdx] && G.player.hand[handIdx] && G.player.hand[handIdx].iid !== card.iid) {
      const gateCard = G.player.hand.splice(handIdx, 1)[0];
      gateCard.sick = false;
      G.player.gates[targetIdx] = gateCard;
      G.player.gatesActive[targetIdx] = true;
      G.player.gateCount = G.player.gatesActive.filter(Boolean).length;
      addLog(`🛡️ ${card.name}: ${gateCard.emoji || '🃏'} ${gateCard.name} became Gate ${targetIdx+1}`, 'lp');
      showDmgFloat('+1 GATE', targetIdx, 'player');
    } else {
      showMsg(currentLang === 'th' ? 'ไม่สามารถซ่อม Gate ได้' : 'Cannot restore Gate');
      G._gateHandIdx = -1;
      return;
    }
    G._gateHandIdx = -1;
  } else if (mode === 'revive_char') {
    const revived = G.player.grave.splice(targetIdx, 1)[0];
    if (revived && G.player.hand.length < 7) {
      revived.sick = false;
      G.player.hand.push(revived);
      addLog(`✨ Rebirth Charm: ${revived.name} returned to your hand`, 'lp');
    } else if (revived) {
      G.player.grave.push(revived);
      showMsg(currentLang === 'th' ? 'มือเต็มแล้ว' : 'Hand is full');
      return;
    }
  } else if (mode === 'move_from') {
    G._moveFrom = targetIdx;
    openTargetModal(card, 'move_to');
    return;
  } else if (mode === 'move_to') {
    const from = G._moveFrom;
    if (from >= 0 && from !== targetIdx && G.player.lanes[from] && !G.player.lanes[targetIdx]) {
      G.player.lanes[targetIdx] = G.player.lanes[from];
      G.player.comps[targetIdx] = G.player.comps[from];
      G.player.lanes[from] = null;
      G.player.comps[from] = null;
      addLog(`↔️ ${card.name}: moved Character from Lane ${from+1} to Lane ${targetIdx+1}`, 'lp');
    }
    G._moveFrom = -1;
  }

  playSpellFinish(card);
  checkWin();
  render();
}

function playSpellFinish(card) {
  G.player.hand = G.player.hand.filter(c => c.iid !== card.iid);
  discardToGrave('player', card);
  G.selectedCard = null;
  render();
}

// ============================================================
// AI TURN
// ============================================================
function doAiTurn() {
  G.phase = 'ai';
  G.activePlayer = 'ai';
  G.aiThinking = true;
  G.turn++;
  updatePhaseUI();
  render();
  addLog(`— Turn ${G.turn}: AI Turn —`, 'ls');
  showPhaseAnnounce('AI TURN', 'Opponent is thinking');

  // Draw
  setTimeout(() => {
    const aiDrawN = 2;
    drawCards('ai', aiDrawN);
    addLog(`🤖 AI draws ${aiDrawN} cards`, 'la');
    showPhaseAnnounce('AI DRAW', `AI draws ${aiDrawN} cards`);
    render();

    // Main phase: play cards
    setTimeout(() => aiMainPhase(), 600);
  }, 500);
}

function aiCardScore(c) {
  if (!c) return 0;
  return n(c.atk) * 2 + n(c.def) + (c.rarity === 'legendary' ? 8 : c.rarity === 'epic' ? 5 : c.rarity === 'rare' ? 3 : 0);
}

function aiLaneThreatScore(laneIdx) {
  const playerChar = G.player.lanes[laneIdx];
  const aiGateAlive = G.ai.gatesActive[laneIdx];

  // A lane with an enemy attacker and an exposed/active AI Gate is dangerous.
  let score = 0;
  if (aiGateAlive) score += 4;
  if (playerChar) {
    score += getEffAtk(playerChar) * 2;
    if (playerChar.pos === 'attack') score += 5;
    if (playerChar.rarity === 'legendary') score += 6;
    else if (playerChar.rarity === 'epic') score += 4;
  } else if (aiGateAlive) {
    score += 2; // keep some body in front of Gates even before danger appears.
  }
  return score;
}

function aiBestLaneForCharacter(card) {
  // New priority: defend AI Gates first, then pressure empty lanes.
  let bestLane = -1;
  let bestScore = -999;
  for (let i = 0; i < 5; i++) {
    if (G.ai.lanes[i]) continue;

    const target = G.player.lanes[i];
    let score = aiLaneThreatScore(i);

    if (!target) {
      score += G.player.gatesActive[i] ? 5 : 8; // pressure is good, but defense now matters more.
    } else {
      const fake = { ...card, atkBuff:0, defBuff:0, pos:'attack' };
      const cmp = compareCombat(fake, target);
      if (cmp.result === 'attacker_wins') score += 8;
      else if (cmp.result === 'standoff') score += 3;
      else score += 1; // still valuable as a blocker.
    }

    score += aiCardScore(card) * .5;
    if (score > bestScore) { bestScore = score; bestLane = i; }
  }
  return bestLane;
}

function aiChooseFormationForLane(inst, laneIdx) {
  const threat = G.player.lanes[laneIdx];
  if (!threat) return inst.atk >= inst.def ? 'attack' : 'guard';

  // If the player is likely to attack this lane, Guard protects the Gate better when DEF is useful.
  const incoming = getEffAtk(threat);
  if (inst.def >= incoming || inst.def >= inst.atk) return 'guard';

  // If AI can win the duel by attacking, stay Attack.
  const fake = { ...inst, atkBuff:0, defBuff:0, pos:'attack' };
  const cmp = compareCombat(fake, threat);
  if (cmp.result === 'attacker_wins') return 'attack';

  return 'guard';
}

function aiMainPhase() {
  // Remove sickness from AI chars
  G.ai.lanes.forEach(c => { if (c) c.sick = false; });

  // Play spells first. Easy AI uses fewer tactical spells; Hard AI uses all.
  G.ai.hand.slice().forEach(c => {
    if (c.type === 'spell') {
      if (AI_MODE === 'easy' && !['draw2','revive_char'].includes(c.spellFn)) return;
      aiPlaySpell(c);
    }
  });
  G.ai.hand.filter(c => c.type === 'spell').forEach(c => discardToGrave('ai', c));
  G.ai.hand = G.ai.hand.filter(c => c.type !== 'spell');

  // Play / replace companions on best matching or strongest lanes.
  const compHand = G.ai.hand.filter(c => c.type === 'companion')
    .sort((a,b) => (n(b.ab)+n(b.db)) - (n(a.ab)+n(a.db)));
  if (AI_MODE === 'easy') {
    compHand.slice(0,1).forEach(comp => {
      const lane = G.ai.lanes.findIndex((c,i) => c && !G.ai.comps[i]);
      if (lane >= 0) {
        const result = attachCompToLane('ai', lane, comp, true);
        addLog(`🤖 AI attached ${result.inst.name} to Lane ${lane+1}`, 'la');
      }
    });
  } else compHand.forEach(comp => {
    let bestLane = -1;
    let bestScore = -999;
    for (let i = 0; i < 5; i++) {
      const host = G.ai.lanes[i];
      if (!host) continue;
      const old = G.ai.comps[i];
      const pair = getPairBonus(host, comp);
      const newScore = n(comp.ab) + n(comp.db) + n(pair.atk) + n(pair.def) + (Array.isArray(host.pairWith) && host.pairWith.includes(comp.id) ? 4 : 0);
      const oldScore = old ? n(old.ab) + n(old.db) + n(host.pairBuffAtk) + n(host.pairBuffDef) : -1;
      const score = newScore - oldScore + aiCardScore(host) * .08;
      if ((!old || newScore > oldScore) && score > bestScore) { bestScore = score; bestLane = i; }
    }
    if (bestLane >= 0) {
      const result = attachCompToLane('ai', bestLane, comp, true);
      if (result.oldComp) addLog(`🤖 AI replaced ${result.oldComp.name} with ${result.inst.name} in Lane ${bestLane+1}`, 'la');
      else addLog(`🤖 AI attached ${result.inst.name} to Lane ${bestLane+1}`, 'la');
      if (n(result.pair?.atk) || n(result.pair?.def)) {
        addLog(`🤖 Pair Bonus: ${G.ai.lanes[bestLane].name} gains +${n(result.pair.atk)} ATK / +${n(result.pair.def)} DEF`, 'la');
      }
    }
  });

  // AI usually plays 1 character, but may play 2 when behind on board to keep the match close.
  let played = 0;
  const aiBoardCount = G.ai.lanes.filter(Boolean).length;
  const playerBoardCount = G.player.lanes.filter(Boolean).length;
  const aiGateCount = G.ai.gatesActive.filter(Boolean).length;
  const playerGateCount = G.player.gatesActive.filter(Boolean).length;
  const maxAiPlays = AI_MODE === 'hard' && (aiBoardCount < playerBoardCount || aiGateCount < playerGateCount) ? 2 : 1;
  while (played < maxAiPlays) {
    const charCards = G.ai.hand.filter(c => c.type === 'char').sort((a,b) => aiCardScore(b) - aiCardScore(a));
    if (!charCards.length) break;

    let candidate = charCards.find(c => (c.cost || 0) === 0);
    if (!candidate) candidate = aiTryTribute(charCards);
    if (!candidate) break;

    const lane = aiBestLaneForCharacter(candidate);
    if (lane < 0) break;

    const inst = makeInst(candidate.id);
    inst.sick = true;
    inst.pos = aiChooseFormationForLane(inst, lane);

    G.ai.lanes[lane] = inst;
    G.ai.hand = G.ai.hand.filter(c => c.iid !== candidate.iid);
    addLog(`🤖 AI played ${inst.emoji} ${inst.name} (${inst.pos}) → Lane ${lane+1}`, 'la');
    played++;

    if (inst.skillFn === 'on_play_discard' && G.player.hand.length > 0) {
      const discIdx = Math.floor(Math.random() * G.player.hand.length);
      const disc = G.player.hand.splice(discIdx, 1)[0];
      discardToGrave('player', disc);
      addLog(`👑 Dark Empress: You discard ${disc.emoji} ${disc.name}!`, 'la');
    }
  }

  render();
  setTimeout(() => aiBattlePhase(), 800);
}

function aiTryTribute(charCards) {
  const expensiveCards = charCards.filter(c => c.cost > 0).sort((a,b) => b.atk - a.atk);
  if (!expensiveCards.length) return null;

  for (const card of expensiveCards) {
    const needed = card.cost;
    const fieldChars = G.ai.lanes.map((c,i) => c ? {lane:i, cv:c.cv} : null).filter(Boolean);
    const totalCv = fieldChars.reduce((s,f) => s+f.cv, 0);
    if (totalCv >= needed) {
      // Sacrifice weakest characters
      let rem = needed;
      const toSac = [];
      const sorted = fieldChars.sort((a,b) => a.cv - b.cv);
      for (const f of sorted) {
        if (rem <= 0) break;
        toSac.push(f.lane);
        rem -= f.cv;
      }
      toSac.forEach(i => {
        const c = G.ai.lanes[i];
        addLog(`🤖 AI sacrifices ${c.emoji} ${c.name}`, 'la');
        removeLaneToGrave('ai', i);
      });
      return card;
    }
  }
  return null;
}

function aiPlaySpell(spell) {
  if (!spell.spellFn) return;
  if (spell.spellFn === 'draw2') {
    drawCards('ai', 2);
    addLog(`🤖 AI used ${spell.name}: drew 2`, 'la');
  } else if (spell.spellFn === 'atk_all') {
    G.ai.lanes.forEach(c => { if(c) c.atkBuff = (c.atkBuff||0)+2; });
    addLog(`🤖 AI used Dark Surge: +2 ATK all characters`, 'la');
  } else if (spell.spellFn === 'revive_char') {
    const idx = G.ai.grave.findIndex(c => c.type === 'char');
    if (idx >= 0 && G.ai.hand.length < 7) {
      const c = G.ai.grave.splice(idx,1)[0];
      c.sick = false;
      G.ai.hand.push(c);
      addLog(`🤖 AI used ${spell.name}: returned ${c.name} to hand`, 'la');
    }
  } else if (spell.spellFn === 'destroy_enemy') {
    const targets = G.player.lanes.map((c,i) => c && c.rarity !== 'legendary' ? i : -1).filter(i => i>=0);
    if (targets.length > 0) {
      const t = targets[Math.floor(Math.random()*targets.length)];
      const c = G.player.lanes[t];
      addLog(`🤖 AI used Crystal Burst: Destroyed ${c.name}!`, 'la');
      removeLaneToGrave('player', t);
    } else {
      addLog(`🤖 AI used Crystal Burst, but no non-Legendary target was available`, 'lc');
    }
  } else if (spell.spellFn === 'veil_enemy') {
    const targets = G.player.lanes.map((c,i) => c ? i : -1).filter(i => i>=0);
    if (targets.length > 0) {
      const t = targets[0];
      G.player.lanes[t].veiled = true;
      addLog(`🤖 AI used Shadow Veil: ${G.player.lanes[t].name} veiled`, 'la');
    }
  } else if (spell.spellFn === 'restore_gate') {
    const gateIdx = G.ai.gatesActive.findIndex(active => !active);
    const handCard = G.ai.hand.find(c => c.iid !== spell.iid && c.type !== 'spell') || G.ai.hand.find(c => c.iid !== spell.iid);
    if (gateIdx >= 0 && handCard) {
      G.ai.hand = G.ai.hand.filter(c => c.iid !== handCard.iid);
      handCard.sick = false;
      G.ai.gates[gateIdx] = handCard;
      G.ai.gatesActive[gateIdx] = true;
      G.ai.gateCount = G.ai.gatesActive.filter(Boolean).length;
      addLog(`🤖 AI used ${spell.name}: restored Gate ${gateIdx+1}`, 'la');
      showDmgFloat('+1 GATE', gateIdx, 'ai');
    }
  } else if (spell.spellFn === 'move_own') {
    const froms = G.ai.lanes.map((c,i) => c ? i : -1).filter(i => i>=0);
    const tos = G.ai.lanes.map((c,i) => !c ? i : -1).filter(i => i>=0);
    if (froms.length && tos.length) {
      const from = froms[Math.floor(Math.random()*froms.length)];
      const to = tos[Math.floor(Math.random()*tos.length)];
      G.ai.lanes[to] = G.ai.lanes[from];
      G.ai.comps[to] = G.ai.comps[from];
      G.ai.lanes[from] = null;
      G.ai.comps[from] = null;
      addLog(`🤖 AI used ${spell.name}: moved Lane ${from+1} → ${to+1}`, 'la');
    }
  }
}


function aiAdjustFormationsForDefense() {
  if (AI_MODE !== 'hard') return;
  G.ai.lanes.forEach((c, i) => {
    if (!c || c.sick) return;
    const threat = G.player.lanes[i];
    if (!threat || !G.ai.gatesActive[i]) return;

    const incoming = getEffAtk(threat);
    const shouldGuard = (c.def > c.atk && c.def >= incoming) || getEffAtk(c) < getDefenseValue(threat);
    if (shouldGuard && c.pos !== 'guard') {
      c.pos = 'guard';
      c.formationLocked = true;
      addLog(`🛡️ AI switches ${c.name} to Guard to protect Gate ${i+1}`, 'la');
    }
  });
}


function aiBattlePhase() {
  aiAdjustFormationsForDefense();
  render();
  addLog(`🤖 AI Battle Phase`, 'la');
  let attacked = false;

  // Sort attackers by ATK, strongest first.
  const attackers = G.ai.lanes
    .map((c, laneIdx) => ({ c, laneIdx }))
    .filter(x => x.c && !x.c.sick && !x.c.veiled && !x.c.formationLocked && x.c.pos === 'attack')
    .sort((a,b) => getEffAtk(b.c) - getEffAtk(a.c));

  attackers.forEach(({ c, laneIdx }) => {
    const target = G.player.lanes[laneIdx];
    const gateActive = G.player.gatesActive[laneIdx];

    if (!target) {
      if (gateActive) {
        destroyGate('player', laneIdx);
        addLog(`💥 AI L${laneIdx+1}: Gate destroyed!`, 'la');
        showDmgFloat('-1 GATE', laneIdx, 'player');
        attacked = true;
      } else {
        const myAtk = getEffAtk(c);
        damageLead('player', myAtk, laneIdx);
        attacked = true;
      }
    } else {
      const cmp = compareCombat(c, target);

      // Smarter AI: avoid suicide unless attacking a very important target.
      const importantTarget = target.rarity === 'legendary' || target.rarity === 'epic';
      if (AI_MODE === 'hard' && cmp.result === 'defender_wins' && !importantTarget) {
        addLog(`🤖 AI holds ${c.name} in Lane ${laneIdx+1} to avoid bad trade`, 'la');
        return;
      }

      addLog(`⚔️ AI L${laneIdx+1}: ${c.emoji}${c.name} ATK ${cmp.atkValue} vs ${target.emoji}${target.name} ${cmp.defLabel} ${cmp.defValue} [${cmp.rule}]`, 'lc');
      showDmgFloat('-' + cmp.atkValue, laneIdx, 'player');

      if (cmp.result === 'attacker_wins') {
        removeLaneToGrave('player', laneIdx);
        addLog(`❌ Result: ${cmp.atkValue} > ${cmp.defValue} — Your ${target.name} destroyed!`, 'la');
        showBattleResultBig('defeat', 'BREAK', `AI destroyed ${target.name}`);
      } else if (cmp.result === 'defender_wins') {
        showDmgFloat('-' + cmp.defValue, laneIdx, 'ai');
        removeLaneToGrave('ai', laneIdx);
        addLog(`✅ Result: ${cmp.atkValue} < ${cmp.defValue} — AI ${c.name} destroyed!`, 'lp');
        showBattleResultBig('win', 'COUNTER', `${target.name} destroyed AI ${c.name}`);
      } else {
        showDmgFloat('-' + cmp.defValue, laneIdx, 'ai');
        addLog(`⚡ Result: ${cmp.atkValue} = ${cmp.defValue} — STANDOFF`, 'lc');
        showBattleResultBig('standoff', 'STAND OFF', `${c.name} vs ${target.name}`);
      }
      attacked = true;
    }
  });

  if (!attacked) addLog(`🤖 AI has no strong attacks`, 'la');

  checkWin();
  render();

  setTimeout(() => {
    // AI end turn
    G.ai.lanes.forEach(c => { if(c){ c.atkBuff=0; c.defBuff=0; c.pairBuffAtk=0; c.pairBuffDef=0; c.exhausted=false; c.veiled=false; c.sick=false; c.formationLocked=false; c.originalFormationThisTurn=null; } });
    G.player.lanes.forEach(c => { if(c){ c.atkBuff=0; c.defBuff=0; c.pairBuffAtk=0; c.pairBuffDef=0; c.veiled=false; c.formationLocked=false; c.originalFormationThisTurn=null; } });
    recalcAllCompBuffs('ai');
    recalcAllCompBuffs('player');
    G.activePlayer = 'player';
    G.phase = 'main';
    G.aiThinking = false;
    G.playedChar = false;
    G.crystal = 0;
    G.turn++;

    // Player draw
    if (G.player.deck.length === 0) { endGame(false, 'Deck is empty!'); return; }
    drawCards('player', 2);
    showPhaseAnnounce('DRAW 2', 'Your new turn begins');
    ensureMidgameHighRarity('player');
    G.player.lanes.forEach(c => { if(c) c.sick = false; });

    addLog(`— Turn ${G.turn}: Your Turn —`, 'ls');
    showPhaseAnnounce('YOUR TURN', 'Main Phase');
  addLog(currentLang === 'th' ? 'กติกาใหม่: ลง Character ได้หลายใบ Guard โจมตีไม่ได้ ใช้ Formation Command ใน Main Phase ใบที่เพิ่งลงยังโจมตีไม่ได้ และมี Spell ซ่อม Gate' : 'New rule: play multiple Characters, Guard cannot attack, use Formation Command in Main Phase, newly played cards cannot attack, and Gate restore spells are enabled', 'lc');
    updatePhaseUI();
    render();
    showMsg('Your Turn — Main Phase');
    if (G.autoPlay) setTimeout(autoPlayTick, 500);
  }, 1000);
}

// ============================================================
// WIN CHECK
// ============================================================
function checkWin() {
  if (G.ai.lead && G.ai.lead.lp <= 0) { endGame(true, 'AI Lead Card LP reached 0!'); }
  else if (G.player.lead && G.player.lead.lp <= 0) { endGame(false, 'Your Lead Card LP reached 0!'); }
}

function endGame(playerWins, reason) {
  G.phase = 'done';
  G.aiThinking = true;
  const icon = document.getElementById('win-icon');
  const ttl = document.getElementById('win-ttl');
  const sub = document.getElementById('win-sub');
  if (playerWins) {
    icon.textContent = '🏆';
    ttl.textContent = 'VICTORY';
    ttl.className = 'win-ttl victory';
    addLog(`🏆 YOU WIN! ${reason}`, 'ls');
  } else {
    icon.textContent = '💀';
    ttl.textContent = 'DEFEAT';
    ttl.className = 'win-ttl defeat';
    addLog(`💀 DEFEAT. ${reason}`, 'la');
  }
  sub.textContent = reason;
  document.getElementById('ov-win').classList.add('on');
}

// ============================================================
// RENDER
// ============================================================
function render() {
  renderAiHand();
  renderLanes('ai', 'ai-gates-row', 'ai-chars-row', 'ai-comp-row');
  renderLanes('player', 'p-gates-row', 'p-chars-row', 'p-comp-row');
  renderPlayerHand();
  renderSidebar();
  updatePhaseUI();
}

function renderAiHand() {
  const row = document.getElementById('ai-hand-row');
  row.innerHTML = '';
  G.ai.hand.forEach(() => {
    const el = document.createElement('div');
    el.className = 'mini-card-back';
    el.innerHTML = `<img src="${CARD_BACK_URI}" class="back-logo" alt="MITTARIA card back">`;
    row.appendChild(el);
  });
}

function renderLanes(side, gatesId, charsId, compId) {
  const gateRow = document.getElementById(gatesId);
  const charRow = document.getElementById(charsId);
  const compRow = document.getElementById(compId);
  gateRow.innerHTML = '';
  charRow.innerHTML = '';
  compRow.innerHTML = '';

  const s = G[side];

  for (let i = 0; i < 5; i++) {
    // GATE
    const gSlot = document.createElement('div');
    gSlot.className = 'lane-col';
    if (s.gatesActive[i]) {
      const gEl = document.createElement('div');
      gEl.className = 'gate-slot' + (s.lanes[i]?.pos === 'guard' ? ' guard-protected' : '');
      const canHitGate = side === 'ai' && G.phase === 'battle' && attackerLane === i && !s.lanes[i];
      gEl.innerHTML = `<div class="gate-facedown${canHitGate ? ' attackable' : ''}" style="${canHitGate ? 'cursor:pointer;box-shadow:0 0 14px rgba(255,80,80,.45);' : ''}"><img src="${CARD_BACK_URI}" class="back-logo" alt="MITTARIA card back"></div>`;
      if (canHitGate) {
        gEl.title = 'Attack Gate';
        gEl.onclick = () => clickAiLane(i);
      }
      gSlot.appendChild(gEl);
    } else {
      const emp = document.createElement('div');
      emp.className = 'gate-empty' + (s.lanes[i]?.pos === 'guard' ? ' guard-protected' : '');
      emp.textContent = '×';
      // If player's battle phase and this is AI's empty gate lane, mark attackable
      if (side === 'ai' && G.phase === 'battle' && attackerLane === i && !s.lanes[i]) {
        emp.classList.add('attackable');
        emp.onclick = () => clickAiLane(i);
      }
      gSlot.appendChild(emp);
    }
    gateRow.appendChild(gSlot);

    // CHAR SLOT
    const cSlot = document.createElement('div');
    cSlot.className = 'lane-col';
    const char = s.lanes[i];

    if (char) {
      const bcEl = buildBoardCard(char, side, i);
      cSlot.appendChild(bcEl);
    } else {
      const emp = document.createElement('div');
      emp.className = 'char-slot';
      emp.textContent = side === 'player' ? t('place') : '';

      if (side === 'player' && G.phase === 'main' && G.selectedCard && G.selectedCard.type === 'char') {
        emp.classList.add('droppable');
        if (G.sacrificeReady) emp.classList.add('sacrifice-ready');
        emp.onclick = () => clickPlayerLane(i);
      } else if (side === 'ai' && G.phase === 'battle' && attackerLane === i) {
        // Empty enemy lane: click here to attack Gate first, then Lead after Gate is gone.
        emp.classList.add('droppable');
        emp.textContent = s.gatesActive[i] ? t('attackGate') : 'Attack Lead';
        emp.onclick = () => clickAiLane(i);
      }
      cSlot.appendChild(emp);
    }
    charRow.appendChild(cSlot);

    // COMPANION SLOT
    const cpSlot = document.createElement('div');
    cpSlot.className = 'lane-col';
    const comp = s.comps[i];
    if (comp) {
      const cb = document.createElement('div');
      cb.className = 'comp-bar';
      cb.innerHTML = `<div class="comp-name">COMP • ${comp.emoji} ${comp.name}</div><div class="comp-eff">${comp.effect || comp.skill || ''}</div><div class="card-action-overlay"><button class="action-icon-btn" title="Companion Info" onclick="event.stopPropagation(); showCardDetailByIid('${side}Comp', '${comp.iid}')">🔍</button></div>`;
      cb.style.position = 'relative';
      cb.title = `${comp.name} — ${comp.effect || comp.skill || ''}`;
      if (side === 'player' && G.phase === 'main' && G.selectedCard?.type === 'companion' && s.lanes[i]) {
        cb.classList.add('droppable');
        cb.title = currentLang === 'th'
          ? `Replace Companion: ${comp.name} (${comp.effect || comp.skill || ''})`
          : `Replace Companion: ${comp.name} (${comp.effect || comp.skill || ''})`;
        cb.onclick = () => clickPlayerLane(i);
      }
      cpSlot.appendChild(cb);
    } else {
      const cs = document.createElement('div');
      cs.className = 'comp-slot';
      cs.textContent = t('companion');
      if (side === 'player' && G.phase === 'main' && G.selectedCard?.type === 'companion' && s.lanes[i]) {
        cs.classList.add('droppable');
        cs.onclick = () => clickPlayerLane(i);
      }
      cpSlot.appendChild(cs);
    }
    compRow.appendChild(cpSlot);
  }
}

function buildBoardCard(char, side, laneIdx) {
  const bc = document.createElement('div');
  bc.className = `bc rr-${char.rarity} ${char.pos === 'guard' ? 'pos-guard' : 'pos-attack'}`;

  const canAttack = side === 'player' && G.phase === 'battle' && char.pos === 'attack' && !char.sick && !char.exhausted && !char.veiled && !char.formationLocked;
  const canFormation = side === 'player' && G.phase === 'main' && !G.aiThinking && !G.selectedCard;
  const isAttacker = side === 'player' && G.selectedCard?.iid === char.iid && G.phase === 'battle';
  const isTarget = side === 'ai' && G.phase === 'battle' && attackerLane >= 0 && laneIdx === attackerLane;

  if (canFormation) bc.classList.add('can-formation');
  if (canAttack) bc.classList.add('can-atk');
  if (isAttacker) bc.classList.add('selected-atk');
  if (char.sick) bc.classList.add('sick');
  if (char.exhausted) bc.classList.add('exhausted');
  if (char.formationLocked) bc.classList.add('formation-locked');
  if (isTarget) bc.classList.add('target-able');

  if (side === 'player' && G.phase === 'main' && !G.selectedCard) {
    bc.onclick = () => quickSwitchFormation(laneIdx);
    bc.title = currentLang === 'th' ? 'คลิกเพื่อสลับ Formation' : 'Click to switch Formation';
  } else if (side === 'player' && G.phase === 'battle') {
    bc.onclick = () => clickPlayerCharForAttack(laneIdx);
  }
  if (side === 'ai' && G.phase === 'battle' && attackerLane === laneIdx) {
    bc.onclick = () => clickAiLane(laneIdx);
    bc.onmouseenter = () => updateBattlePreview(laneIdx);
    const atkVal = char.atk + (char.atkBuff||0);
    const defVal = char.def + (char.defBuff||0);
    bc.title = char.pos === 'attack'
      ? `ATK Formation: battle uses ATK vs ATK (${char.name} ATK ${atkVal})`
      : `Guard Formation: battle uses ATK vs DEF (${char.name} DEF ${defVal})`;
  }

  const effAtk = getEffAtk(char);
  const effDef = getEffDef(char);

  bc.innerHTML = `
    <div class="bc-wrap" style="background:${char.bg||'linear-gradient(135deg,#0a0a20,#15152a)'}">
      <span class="type-badge type-char">CHAR</span>
      <span class="hover-formation-icon">${char.pos === 'attack' ? '⚔' : ''}</span>
      <div class="card-action-overlay">
        <button class="action-icon-btn" title="Card Info" onclick="event.stopPropagation(); showCardDetailByIid('${side}', '${char.iid}')">🔍</button>
      </div>
      <div class="bc-hdr">
        <span class="bc-name">${char.name}</span>
        <span class="bc-el">${elIcon(char.el)}</span>
      </div>
      <div class="bc-art" style="overflow:hidden;padding:0;${CHAR_IMGS[char.id]?'':''}">
        ${CHAR_IMGS[char.id]
          ? `<img src="${CHAR_IMGS[char.id]}" style="width:100%;height:100%;object-fit:cover;object-position:top center;" alt="${char.name}">`
          : `<div class="no-img-creature"><span>${char.emoji}</span><small>CHAR</small></div>`
        }
        <span class="bc-pos-badge ${char.pos==='attack'?'pos-a':'pos-g'}" style="position:absolute;bottom:2px;right:2px;z-index:2">${char.pos==='attack'?'ATK':'GRD'}</span>
        ${side === 'ai' && G.phase === 'battle' && attackerLane === laneIdx
          ? `<span style="position:absolute;bottom:2px;left:2px;z-index:2;font-size:7px;background:rgba(0,0,0,.72);border:1px solid rgba(255,255,255,.16);border-radius:3px;padding:1px 3px;color:#fff">${char.pos === 'attack' ? 'uses ATK' : 'uses DEF'}</span>`
          : ''}
      </div>
      <div class="bc-stats">
        <span class="s-a">⚔${effAtk}</span>
        <span class="s-d">🛡${effDef}</span>
        <span class="s-c">💎${char.cv}</span>
      </div>
    </div>
  `;
  return bc;
}

function renderPlayerHand() {
  const row = document.getElementById('p-hand-row');
  row.innerHTML = '';
  G.player.hand.forEach((card, i) => {
    const hc = document.createElement('div');
    hc.className = `hc rr-${card.rarity}`;

    const isSelected = G.selectedCard?.iid === card.iid;
    const canPlay = G.phase === 'main' && !G.aiThinking;
    const charUnplay = false;

    if (isSelected) hc.classList.add('selected');
    if (isSelected && G.sacrificeReady) hc.classList.add('sacrifice-mode');
    if (!canPlay || charUnplay) hc.classList.add('unplay');

    hc.onclick = () => (canPlay && !charUnplay) ? selectHandCard(i) : null;

    const effAtk = card.atk || 0;
    const effDef = card.def || 0;
    const costTxt = card.type === 'char' ? `💎${card.cost}` : '';
    const statsTxt = card.type === 'char'
      ? `<span class="s-a">⚔${effAtk}</span><span class="s-d">🛡${effDef}</span><span class="s-c">${costTxt}</span>`
      : `<span style="color:var(--cyan);font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${card.type === 'companion' ? (card.effect || 'COMPANION') : (card.effect || 'SPELL')}</span>`;

    hc.innerHTML = `
      <button class="info-btn" onclick="event.stopPropagation(); showCardDetailByIid('playerHand', '${card.iid}')">🔍</button>
      <div class="hc-wrap" style="background:${card.bg||'linear-gradient(135deg,#0a0a20,#15152a)'}">
        <span class="type-badge type-${card.type === 'char' ? 'char' : card.type === 'companion' ? 'companion' : 'spell'}">${card.type === 'char' ? 'CHAR' : card.type === 'companion' ? 'COMP' : 'SPELL'}</span>
        <div class="hc-hdr">
          <span class="hc-name">${card.name}</span>
          <span style="font-size:8px">${elIcon(card.el)}</span>
        </div>
        <div class="hc-art" style="${CHAR_IMGS[card.id]?'padding:0;overflow:hidden;':''}">
          ${CHAR_IMGS[card.id]
            ? `<img src="${CHAR_IMGS[card.id]}" style="width:100%;height:100%;object-fit:cover;object-position:top center;" alt="${card.name}">`
            : card.type === 'char'
              ? `<div class="no-img-creature"><span>${card.emoji}</span><small>CHAR</small></div>`
              : `<span style="font-size:22px">${card.emoji}</span>`
          }
        </div>
        <div class="hc-foot">${statsTxt}</div>
      </div>
    `;
    row.appendChild(hc);
  });
}

function renderSidebar() {
  renderLeadBox('ai');
  renderLeadBox('player');
  // Gate pips
  ['ai','player'].forEach(side => {
    const id = side === 'ai' ? 'ai-gate-pips' : 'p-gate-pips';
    const row = document.getElementById(id);
    row.innerHTML = '';
    G[side].gatesActive.forEach(active => {
      const pip = document.createElement('div');
      pip.className = 'gate-pip' + (active ? '' : ' gone');
      row.appendChild(pip);
    });
  });

  document.getElementById('ai-deck-cnt').textContent = G.ai.deck.length;
  document.getElementById('p-deck-cnt').textContent = G.player.deck.length;
  document.getElementById('ai-hand-cnt').textContent = G.ai.hand.length;
  document.getElementById('p-hand-cnt').textContent = G.player.hand.length;
  const av = document.getElementById('ai-void-cnt');
  const pv = document.getElementById('p-void-cnt');
  if (av) av.textContent = G.ai.grave.length;
  if (pv) pv.textContent = G.player.grave.length;
}


function renderLeadBox(side) {
  const el = document.getElementById(side === 'ai' ? 'ai-lead-box' : 'p-lead-box');
  if (!el || !G[side] || !G[side].lead) return;
  const lead = G[side].lead;
  const pct = Math.max(0, Math.min(100, (lead.lp / lead.maxLp) * 100));
  const label = side === 'ai' ? 'AI' : 'YOU';
  el.innerHTML = `
    <div class="lead-box">
      <div class="lead-art">${CHAR_IMGS[lead.id] ? `<img src="${CHAR_IMGS[lead.id]}" alt="${lead.name}">` : lead.emoji}</div>
      <div class="lead-info">
        <div class="lead-name">${label}: ${lead.name}</div>
        <div class="lead-lp">${lead.lp}<small> / ${lead.maxLp} LP</small></div>
        <div class="lead-bar"><div class="lead-bar-fill" style="width:${pct}%"></div></div>
      </div>
    </div>
  `;
}


function cardTypeLabel(card) {
  if (currentLang === 'th') {
    if (card.type === 'char') return 'Character';
    if (card.type === 'companion') return 'Companion';
    if (card.type === 'spell') return 'Spell';
  }
  return (card.type || 'card').toUpperCase();
}

function getCardDetailText(card) {
  const details = {
    mitria: {
      th: 'Charm Aura: เมื่อโจมตีชนะ จั่ว 1 ใบ | Lead หลักฝ่าย Light / Charm',
      en: 'Charm Aura: When this card wins an attack, draw 1 card. Main Light / Charm Lead.'
    },
    dark_empress: {
      th: 'Dark Command: เมื่อลงสนาม ฝ่ายตรงข้าม discard 1 ใบ | Legendary ฝ่าย Shadow',
      en: 'Dark Command: When played, the opponent discards 1 card. Shadow Legendary.'
    },
    lobot: {
      th: 'Lobot companion: เพิ่ม +1 ATK / +1 DEF แบบสมดุล เหมาะกับทุก Lane',
      en: 'Lobot companion: grants a balanced +1 ATK / +1 DEF for flexible support.'
    },
    snowball: {
      th: 'Snowball companion: สายป้องกัน เพิ่ม +0 ATK / +2 DEF',
      en: 'Snowball companion: a defensive support that grants +0 ATK / +2 DEF.'
    },
    lo: {
      th: 'Lo companion: ซัพพอร์ตสายแสง เพิ่ม +1 ATK / +1 DEF',
      en: 'Lo companion: a light support companion granting +1 ATK / +1 DEF.'
    },
    lo_hero: {
      th: 'Lo Hero: Epic Character สายแสง สมดุล ATK 3 / DEF 3',
      en: 'Lo Hero: a balanced Epic Light character with 3 ATK / 3 DEF.'
    },
    nero: {
      th: 'Nero companion: สายบุก เพิ่ม +2 ATK',
      en: 'Nero companion: an offensive support companion that grants +2 ATK.'
    },

    hong_yue: {
      th: 'Hong Yue: Character สายไฟ/เสน่ห์ ATK 3 / DEF 2 | จับคู่ Jade Brew แล้วได้ +1 DEF',
      en: 'Hong Yue: a fire/charm Character with 3 ATK / 2 DEF | Pair with Jade Brew for +1 DEF.'
    },
    luna_veil: {
      th: 'Luna Veil: Character สายแม่มด ATK 3 / DEF 3 | จับคู่ Noct Bat แล้วได้ +1 ATK',
      en: 'Luna Veil: a witch Character with 3 ATK / 3 DEF | Pair with Noct Bat for +1 ATK.'
    },
    verdantia: {
      th: 'Verdantia: Character สายแสงตั้งรับ ATK 2 / DEF 4 | จับคู่ Celestine หรือ Lo แล้วได้ +1 DEF',
      en: 'Verdantia: a defensive light Character with 2 ATK / 4 DEF | Pair with Celestine or Lo for +1 DEF.'
    },
    solaria: {
      th: 'Solaria: Character สายไฟบุก ATK 4 / DEF 2 | จับคู่ Flare Ace แล้วได้ +1 ATK',
      en: 'Solaria: an aggressive fire Character with 4 ATK / 2 DEF | Pair with Flare Ace for +1 ATK.'
    },
    aria_byte: {
      th: 'Aria Byte: Character สายคริสตัล/เทค ATK 2 / DEF 3 | จับคู่ Pixel Pop แล้วได้ +1 ATK / +1 DEF',
      en: 'Aria Byte: a crystal-tech Character with 2 ATK / 3 DEF | Pair with Pixel Pop for +1 ATK / +1 DEF.'
    },
    lotus_noir: {
      th: 'Lotus Noir: Character สายเงา/ดอกบัว ATK 3 / DEF 3 | จับคู่ Aqua Pop หรือ Dark Cloak แล้วได้ +1 DEF',
      en: 'Lotus Noir: a shadow-lotus Character with 3 ATK / 3 DEF | Pair with Aqua Pop or Dark Cloak for +1 DEF.'
    },
    celestia_prime: {
      th: 'Celestia Prime: Legendary Character ATK 4 / DEF 4 | จับคู่ Celestine แล้วได้ +1 ATK / +1 DEF',
      en: 'Celestia Prime: a Legendary Character with 4 ATK / 4 DEF | Pair with Celestine for +1 ATK / +1 DEF.'
    },
    prism_bloom: {
      th: 'Prism Bloom: Character สายคริสตัล ATK 3 / DEF 4 | จับคู่ Aqua Pop แล้วได้ +1 DEF',
      en: 'Prism Bloom: a crystal Character with 3 ATK / 4 DEF | Pair with Aqua Pop for +1 DEF.'
    },
    jade_brew: {
      th: 'Jade Brew companion: เพิ่ม +1 ATK / +1 DEF | จับคู่เด่นกับ Hong Yue',
      en: 'Jade Brew companion: grants +1 ATK / +1 DEF | Great with Hong Yue.'
    },
    noct_bat: {
      th: 'Noct Bat companion: เพิ่ม +2 ATK | จับคู่เด่นกับ Luna Veil',
      en: 'Noct Bat companion: grants +2 ATK | Great with Luna Veil.'
    },
    aqua_pop: {
      th: 'Aqua Pop companion: เพิ่ม +1 ATK / +2 DEF | จับคู่เด่นกับ Lotus Noir หรือ Prism Bloom',
      en: 'Aqua Pop companion: grants +1 ATK / +2 DEF | Great with Lotus Noir or Prism Bloom.'
    },
    celestine: {
      th: 'Celestine companion: เพิ่ม +1 ATK / +2 DEF | จับคู่เด่นกับ Celestia Prime หรือ Verdantia',
      en: 'Celestine companion: grants +1 ATK / +2 DEF | Great with Celestia Prime or Verdantia.'
    },
    flare_ace: {
      th: 'Flare Ace companion: เพิ่ม +2 ATK / +1 DEF | จับคู่เด่นกับ Solaria',
      en: 'Flare Ace companion: grants +2 ATK / +1 DEF | Great with Solaria.'
    },
    pixel_pop: {
      th: 'Pixel Pop companion: เพิ่ม +1 ATK / +1 DEF | จับคู่เด่นกับ Aria Byte',
      en: 'Pixel Pop companion: grants +1 ATK / +1 DEF | Great with Aria Byte.'
    },
  };
  if (details[card.id]) return details[card.id][currentLang] || details[card.id].en;
  return card.skill || card.effect || (currentLang === 'th' ? 'ไม่มีเอฟเฟกต์พิเศษ' : 'No special effect');
}

function getCardImageHtml(card) {
  if (typeof CHAR_IMGS !== 'undefined' && CHAR_IMGS && CHAR_IMGS[card.id]) {
    const fitClass = /\.png$/i.test(CHAR_IMGS[card.id]) ? 'contain-art' : 'cover-art';
    return `<img class="${fitClass}" src="${CHAR_IMGS[card.id]}" alt="${card.name}">`;
  }
  return `<div class="cl-emoji">${card.emoji || '🃏'}</div>`;
}


function cardRarityOrder(r) {
  return { legendary:0, epic:1, rare:2, common:3 }[r] ?? 9;
}

function getCardStatsHtml(card) {
  if (card.type === 'char') {
    return `<div class="cl-stats"><span class="s-a">⚔ ${card.atk||0}</span><span class="s-d">🛡 ${card.def||0}</span><span class="s-c">Cost ${card.cost||0}</span><span class="s-c">CV ${card.cv||0}</span></div>`;
  }
  if (card.type === 'companion') {
    return `<div class="cl-stats"><span class="s-a">+ATK ${card.ab||0}</span><span class="s-d">+DEF ${card.db||0}</span></div>`;
  }
  return `<div class="cl-stats"><span class="s-c">Cost ${card.cost||0}</span></div>`;
}

function renderCardList() {
  const root = document.getElementById('card-list-root');
  if (!root || typeof CARDS === 'undefined') return;

  const cards = Object.values(CARDS).sort((a,b) => {
    const ro = cardRarityOrder(a.rarity) - cardRarityOrder(b.rarity);
    if (ro !== 0) return ro;
    const to = (a.type || '').localeCompare(b.type || '');
    if (to !== 0) return to;
    return (a.name || '').localeCompare(b.name || '');
  });

  const groups = [
    ['legendary', currentLang === 'th' ? 'LEGENDARY' : 'LEGENDARY'],
    ['epic', currentLang === 'th' ? 'EPIC' : 'EPIC'],
    ['rare', currentLang === 'th' ? 'RARE' : 'RARE'],
    ['common', currentLang === 'th' ? 'COMMON' : 'COMMON'],
  ];

  function renderCardListItem(card) {
    return `
      <div class="cl-card cl-${card.rarity} type-${card.type}" role="button" tabindex="0" aria-label="View ${card.name} card details" onclick="showCardDetailFromId('${card.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showCardDetailFromId('${card.id}')}">
        <div class="cl-art">
          ${getCardImageHtml(card)}
        </div>
        <div class="cl-body">
          <div class="cl-top">
            <div class="cl-name">${card.name}</div>
            <div class="cl-tag">${cardTypeLabel(card)}</div>
          </div>
          <div class="cl-meta">
            <span class="cl-pill">${(card.rarity || '').toUpperCase()}</span>
            <span class="cl-pill">${elIcon(card.el)} ${card.el || 'neutral'}</span>
          </div>
          ${getCardStatsHtml(card)}
          <div class="cl-open-hint">${currentLang === 'th' ? 'แตะเพื่อดูข้อมูลการ์ด' : 'Tap to view card details'} →</div>
        </div>
      </div>`;
  }

  const featured = ['mitria','dark_empress'].map(id => CARDS[id]).filter(Boolean);
  const featuredHtml = featured.length ? `
    <div class="cl-section-title">${currentLang === 'th' ? 'FEATURED LEGENDARY' : 'FEATURED LEGENDARY'}</div>
    <div class="cardlist-grid featured-grid">${featured.map(renderCardListItem).join('')}</div>
  ` : '';

  const html = featuredHtml + groups.map(([rarity, title]) => {
    const items = cards.filter(c => c.rarity === rarity && !['mitria','dark_empress'].includes(c.id));
    if (!items.length) return '';
    return `
      <div class="cl-section-title">${title}</div>
      <div class="cardlist-grid">
        ${items.map(renderCardListItem).join('')}
      </div>`;
  }).join('');

  root.innerHTML = html;
  const label = document.getElementById('card-count-label');
  if (label) label.textContent = currentLang === 'th' ? `ทั้งหมด ${cards.length} ใบ` : `${cards.length} Cards`;
}


function elIcon(el) {
  const map = { light:'☀️', fire:'🔥', shadow:'🌑', crystal:'💎', wind:'🌬️', earth:'🌿' };
  return map[el] || '⬡';
}

// ============================================================
// LOG
// ============================================================
function addLog(msg, cls) {
  if (!G.log) G.log = [];
  G.log.unshift(msg);
  const container = document.getElementById('log-entries');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `log-entry ${cls||''}`;
  el.textContent = msg;
  container.prepend(el);
  container.scrollTop = 0;
}

// ============================================================
// HELPERS
// ============================================================


function findCardByIid(area, iid) {
  if (!iid) return null;
  if (area === 'playerHand') return G.player?.hand?.find(c => c.iid === iid);
  if (area === 'aiHand') return G.ai?.hand?.find(c => c.iid === iid);
  if (area === 'player') return G.player?.lanes?.find(c => c && c.iid === iid);
  if (area === 'ai') return G.ai?.lanes?.find(c => c && c.iid === iid);
  if (area === 'playerComp') return G.player?.comps?.find(c => c && c.iid === iid);
  if (area === 'aiComp') return G.ai?.comps?.find(c => c && c.iid === iid);
  return null;
}


function showCardDetailFromId(id) {
  const card = CARDS[id];
  detailContext = { area: 'cardList', iid: id };
  if (card) showCardDetail(card);
}

function showCardDetailByIid(area, iid) {
  const card = findCardByIid(area, iid);
  detailContext = { area, iid };
  if (card) showCardDetail(card);
}


function detailContextLane() {
  if (!detailContext || detailContext.area !== 'player') return -1;
  return G.player.lanes.findIndex(c => c && c.iid === detailContext.iid);
}

function canSwitchFormationFromDetail() {
  const lane = detailContextLane();
  if (lane < 0) return false;
  const c = G.player.lanes[lane];
  return G.phase === 'main' && G.activePlayer === 'player' && !G.aiThinking && c && !c.sick;
}

function switchFormationFromDetail() {
  const lane = detailContextLane();
  if (lane < 0) return;
  const c = G.player.lanes[lane];
  if (!c) return;
  if (!canSwitchFormationFromDetail()) {
    showMsg(currentLang === 'th' ? 'ตอนนี้ยังเปลี่ยน Formation ไม่ได้' : 'Cannot switch Formation now');
    return;
  }
  c.pos = c.pos === 'attack' ? 'guard' : 'attack';
  c.formationLocked = true;
  addLog(`🔄 ${c.name} switched to ${c.pos === 'attack' ? 'ATK' : 'GRD'} Formation`, 'lp');
  addLog(`⏳ ${c.name} cannot attack this turn after switching Formation`, 'lc');
  showMsg(`${c.name}: ${c.pos === 'attack' ? 'ATK' : 'GRD'} Formation — cannot attack this turn`);
  showCardDetail(c);
  render();
  updatePhaseUI();
}

function showCardDetail(card) {
  if (!card) return;
  const ov = document.getElementById('ov-card-detail');
  const title = document.getElementById('card-detail-title');
  const body = document.getElementById('card-detail-body');
  if (!ov || !title || !body) return;

  title.textContent = card.name || 'CARD DETAIL';

  const art = CHAR_IMGS[card.id]
    ? `<img src="${CHAR_IMGS[card.id]}" alt="${card.name}">`
    : `<span>${card.emoji || '🃏'}</span>`;

  let statHtml = '';
  if (card.type === 'char') {
    statHtml = `
      <div class="card-detail-row"><strong>Type:</strong> Character</div>
      <div class="card-detail-row"><strong>Rarity:</strong> ${(card.rarity || '').toUpperCase()}</div>
      <div class="card-detail-row"><strong>Element:</strong> ${elIcon(card.el)} ${card.el || 'neutral'}</div>
      <div class="card-detail-row"><strong>Stats:</strong> ATK ${card.atk || 0} / DEF ${card.def || 0} / Cost ${card.cost || 0} / CV ${card.cv || 0}</div>
      <div class="card-detail-row"><strong>Formation Rule:</strong> ATK = uses ATK when attacked / GRD = uses DEF when attacked</div>
      ${card.formationLocked ? `<div class="card-detail-row"><strong>Status:</strong> Switched Formation this turn — cannot attack</div>` : ''}
    `;
  } else if (card.type === 'companion') {
    statHtml = `
      <div class="card-detail-row"><strong>Type:</strong> Companion</div>
      <div class="card-detail-row"><strong>Rarity:</strong> ${(card.rarity || '').toUpperCase()}</div>
      <div class="card-detail-row"><strong>Element:</strong> ${elIcon(card.el)} ${card.el || 'neutral'}</div>
      <div class="card-detail-row"><strong>Buff:</strong> +${card.ab || 0} ATK / +${card.db || 0} DEF</div>
      <div class="card-detail-row"><strong>Use:</strong> Attach to your Character. If one already exists, it replaces the old Companion.</div>
    `;
  } else {
    statHtml = `
      <div class="card-detail-row"><strong>Type:</strong> Spell</div>
      <div class="card-detail-row"><strong>Rarity:</strong> ${(card.rarity || '').toUpperCase()}</div>
      <div class="card-detail-row"><strong>Cost:</strong> ${card.cost || 0}</div>
    `;
  }

  const effect = getCardDetailText ? getCardDetailText(card) : (card.skill || card.effect || 'No special effect');

  body.innerHTML = `
    <div class="card-detail-wrap">
      <div class="card-detail-art">${art}</div>
      <div class="card-detail-info">
        <div class="card-detail-name">${card.emoji || ''} ${card.name}</div>
        ${statHtml}
        <div class="card-detail-effect"><strong>Skill / Effect</strong><br>${effect}</div>
        ${card.type === 'char' && detailContext?.area === 'player'
          ? `<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn btn-a btn-small-action" onclick="switchFormationFromDetail()">${card.pos === 'attack' ? 'Switch to Guard 🛡' : 'Switch to Attack ⚔'}</button>
              <span style="font-size:11px;color:var(--dim);align-self:center">${canSwitchFormationFromDetail() ? 'Main Phase action' : 'Cannot switch now'}</span>
            </div>`
          : ''}
      </div>
    </div>
  `;

  ov.classList.add('on');
}

function closeCardDetail() {
  const ov = document.getElementById('ov-card-detail');
  if (ov) ov.classList.remove('on');
}


function openVoid(side) {
  const ov = document.getElementById('ov-void');
  const title = document.getElementById('void-title');
  const list = document.getElementById('void-list');
  if (!ov || !title || !list) return;
  const s = G[side];
  title.textContent = side === 'player' ? 'YOUR VOID / สุสาน' : 'AI VOID / สุสาน';
  if (!s.grave.length) {
    list.innerHTML = `<div style="color:var(--dim);font-size:13px">No cards in Void.</div>`;
  } else {
    list.innerHTML = s.grave.map(c => `
      <div class="void-card" onclick="showCardDetailFromId('${c.id}')">
        <div style="font-size:26px">${c.emoji || '🃏'}</div>
        <div class="v-name">${c.name}</div>
        <div class="v-meta">${(c.type||'').toUpperCase()} • ${(c.rarity||'').toUpperCase()}</div>
      </div>`).join('');
  }
  ov.classList.add('on');
}

function closeVoid() {
  const ov = document.getElementById('ov-void');
  if (ov) ov.classList.remove('on');
}

function toggleAutoPlay() {
  if (!G || G.phase === 'done') return;
  G.autoPlay = !G.autoPlay;
  addLog(G.autoPlay ? '▶ Auto Play enabled' : '⏸ Auto Play disabled', 'lc');
  updatePhaseUI();
  if (G.autoPlay) setTimeout(autoPlayTick, 300);
}

function autoPlayTick() {
  if (!document.getElementById('sc-game')?.classList.contains('on')) { if (G) G.autoPlay = false; return; }
  if (!G || !G.autoPlay || G.phase === 'done') return;
  if (G.aiThinking || G.activePlayer !== 'player') {
    setTimeout(autoPlayTick, 600);
    return;
  }

  if (G.phase === 'main') {
    // Try to attach best companion first.
    const comp = G.player.hand.find(c => c.type === 'companion');
    const compLane = G.player.lanes.findIndex((c,i) => c && (!G.player.comps[i] || (n(comp?.ab)+n(comp?.db)) > (n(G.player.comps[i]?.ab)+n(G.player.comps[i]?.db))));
    if (comp && compLane >= 0) {
      G.selectedCard = comp;
      clickPlayerLane(compLane);
      setTimeout(autoPlayTick, 450);
      return;
    }

    // Play best free Character to best empty lane.
    const char = G.player.hand
      .filter(c => c.type === 'char' && (c.cost || 0) === 0)
      .sort((a,b) => (n(b.atk)*2+n(b.def)) - (n(a.atk)*2+n(a.def)))[0];
    const lane = G.player.lanes.findIndex(c => !c);
    if (char && lane >= 0) {
      G.selectedCard = char;
      G.pendingCard = char;
      G.pendingLane = lane;
      const inst = makeInst(char.id);
      confirmAutoPlace(lane, char, inst.atk >= inst.def ? 'attack' : 'guard');
      setTimeout(autoPlayTick, 450);
      return;
    }

    goToBattle();
    setTimeout(autoPlayTick, 600);
    return;
  }

  if (G.phase === 'battle') {
    const lane = G.player.lanes.findIndex((c,i) => c && c.pos === 'attack' && !c.sick && !c.exhausted && !c.veiled && !c.formationLocked);
    if (lane >= 0) {
      clickPlayerCharForAttack(lane);
      setTimeout(() => {
        clickAiLane(lane);
        setTimeout(autoPlayTick, 700);
      }, 250);
      return;
    }
    endTurn();
    setTimeout(autoPlayTick, 900);
  }
}

function confirmAutoPlace(lane, card, pos) {
  if (!card || lane < 0 || G.player.lanes[lane]) return;
  const inst = makeInst(card.id);
  inst.pos = pos;
  inst.sick = true;
  G.player.lanes[lane] = inst;
  G.player.hand = G.player.hand.filter(c => c.iid !== card.iid);
  G.playedChar = true;
  G.selectedCard = null;
  G.pendingCard = null;
  G.pendingLane = -1;
  addLog(`🤖 Auto played ${inst.emoji} ${inst.name} (${pos}) → Lane ${lane+1}`, 'lp');
  render();
  updatePhaseUI();
}


function resetLocalData() {
  if (!confirm(currentLang === 'th' ? 'ล้างข้อมูล Deck/Settings ที่ค้างในเครื่องนี้?' : 'Clear local Deck/Settings data on this device?')) return;
  try {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('mittaria_')) localStorage.removeItem(k);
    });
  } catch(e) {}
  CUSTOM_PDECK = null;
  deckBuilderCounts = null;
  AI_MODE = 'easy';
  CURRENT_DECK_SLOT = 1;
  updateAiModeUI();
  showMsg(currentLang === 'th' ? 'ล้างข้อมูล Local แล้ว โหลดหน้าใหม่ได้เลย' : 'Local data cleared. You can refresh the page.');
}


function showMsg(txt) {
  const el = document.getElementById('msg-float');
  if (!el) return;
  if (msgTimer) clearTimeout(msgTimer);
  el.classList.remove('show');
  // Force reflow so the latest message replaces the old one cleanly.
  void el.offsetWidth;
  el.textContent = txt;
  el.classList.add('show');
  msgTimer = setTimeout(() => {
    el.classList.remove('show');
    msgTimer = null;
  }, 2200);
}

function closeModal(id) {
  document.getElementById(id).classList.remove('on');
  G.pendingCard = null;
  G.pendingFormationLane = -1;
  G.selectedCard = null;
  G.sacSelected = [];
  G.sacrificeReady = false;
  render();
}

function setMobileHudState(side, open) {
  const rail = document.querySelector(side === 'player' ? '.player-rail' : '.ai-rail');
  const toggle = document.getElementById(side === 'player' ? 'player-hud-toggle' : 'ai-hud-toggle');
  if (!rail || !toggle) return;
  rail.classList.toggle('hud-open', !!open);
  toggle.textContent = open ? '−' : '+';
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  toggle.setAttribute('aria-label', `${open ? 'Collapse' : 'Expand'} ${side === 'player' ? 'Player' : 'AI'} status`);
}

function toggleMobileHud(side) {
  const rail = document.querySelector(side === 'player' ? '.player-rail' : '.ai-rail');
  if (!rail) return;
  const willOpen = !rail.classList.contains('hud-open');
  setMobileHudState('player', side === 'player' && willOpen);
  setMobileHudState('ai', side === 'ai' && willOpen);
}

function collapseMobileHuds() {
  setMobileHudState('player', false);
  setMobileHudState('ai', false);
}

function setGameLogCollapsed(collapsed) {
  const log = document.getElementById('g-log');
  const center = document.querySelector('#sc-game .game-center');
  const toggle = document.getElementById('log-toggle');
  if (!log || !center || !toggle) return;
  log.classList.toggle('log-collapsed', !!collapsed);
  center.classList.toggle('log-is-collapsed', !!collapsed);
  toggle.textContent = collapsed ? '+' : '−';
  toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  const label = currentLang === 'th'
    ? (collapsed ? 'ขยายบันทึกเกม' : 'ย่อบันทึกเกม')
    : (collapsed ? 'Expand game log' : 'Collapse game log');
  toggle.setAttribute('aria-label', label);
  toggle.title = label;
}

function toggleGameLog() {
  const log = document.getElementById('g-log');
  if (log) setGameLogCollapsed(!log.classList.contains('log-collapsed'));
}

function showScreen(id) {
  if (id !== 'sc-game' && G && typeof G === 'object') {
    G.autoPlay = false;
    G.aiThinking = false;
    document.querySelectorAll('.phase-announce,.battle-result-big').forEach(e => e.remove());
  }
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  updateLanguageUI();
  if (id === 'sc-cardlist') renderCardList();
  if (id === 'sc-deckbuilder') {
    renderDeckBuilder();
    setTimeout(() => {
      const root = document.getElementById('deckbuilder-root');
      if (root && !root.innerHTML.trim()) renderDeckBuilder();
    }, 50);
  }
}

function startGame() {
  loadAiMode();
  collapseMobileHuds();
  document.getElementById('ov-win').classList.remove('on');
  showScreen('sc-game');
  initGame();
  setGameLogCollapsed(window.matchMedia('(max-width: 1180px)').matches);
}

updateLanguageUI();

// ============================================================
// STARS
// ============================================================
(function() {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const stars = [];
  for (let i = 0; i < 120; i++) {
    stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      r: Math.random()*1.5, a: Math.random(), speed: .002+Math.random()*.008 });
  }
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s => {
      s.a += s.speed;
      const alpha = .2 + .8*Math.abs(Math.sin(s.a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
