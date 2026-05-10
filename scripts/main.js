// ════════════════════════════════════════════
// LANGUAGE TRANSLATIONS
// ════════════════════════════════════════════
const STRINGS = {
  tr: {
    title: 'GÖZLERİMİN<br>SESİ',
    subtitle: 'Göz Hareketleriyle İletişim · Eye Movement Communication',
    startBtn: 'BAŞLAT / START',
    calTitle: 'KALİBRASYON',
    calInfo: 'Ekranda beliren noktaya bakın ve <strong style="color:var(--primary)">bir kez göz kırpın</strong>.<br>Look at each point and blink once to select.',
    calStart: 'Kalibrasyonu Başlat',
    calSkip: 'Atla (Varsayılan)',
    headerTitle: 'GÖZLERİMİN SESİ',
    camNo: 'Kamera Yok',
    camOn: 'Kamera Açık',
    trackNo: 'Takip Yok',
    trackOn: 'Takip ✓',
    calibration: 'Kalibrasyon',
    noFace: 'Yüz bulunamadı',
    blinkLabel: 'Kırpma',
    wordLabel: 'Kelime',
    phraseLabel: 'Cümle',
    gazeTitle: 'Göz Takibi',
    blinkLabel: 'Göz Kırpma Eşiği',
    gainLabel: 'Gaze Hassasiyeti',
    smoothLabel: 'Yumuşatma',
    voiceTitle: 'Ses',
    rateLabel: 'TTS Hızı',
    pitchLabel: 'TTS Tonu',
    sidebarCal: 'KALİBRASYON / CALIBRATE',
    speak: 'Seslendir',
    delete: 'Sil',
    clear: 'Temizle',
    space: 'Boşluk',
    keyboard: 'Klavye',
    cards: 'Kartlar',
    calibrating: 'Noktaya bakın → göz kırpın',
    calibrationDone: 'Kalibrasyon tamam!',
    usingDefaults: 'Varsayılan kalibrasyon kullanılıyor',
  },
  en: {
    title: 'GÖZLERİMİN<br>SESİ',
    subtitle: 'Eye Movement Communication · Göz Hareketleriyle İletişim',
    startBtn: 'START / BAŞLAT',
    calTitle: 'CALIBRATION',
    calInfo: 'Look at each point and <strong style="color:var(--primary)">blink once to select</strong>.<br>Ekranda beliren noktaya bakın ve bir kez göz kırpın.',
    calStart: 'Start Calibration',
    calSkip: 'Skip (Default)',
    headerTitle: 'GÖZLERİMİN SESİ',
    camNo: 'No Camera',
    camOn: 'Camera On',
    trackNo: 'No Tracking',
    trackOn: 'Tracking ✓',
    calibration: 'Calibration',
    noFace: 'No face detected',
    blinkLabel: 'Blinks',
    wordLabel: 'Words',
    phraseLabel: 'Phrases',
    gazeTitle: 'Eye Tracking',
    blinkLabel: 'Blink Threshold',
    gainLabel: 'Gaze Sensitivity',
    smoothLabel: 'Smoothing',
    voiceTitle: 'Voice',
    rateLabel: 'TTS Rate',
    pitchLabel: 'TTS Pitch',
    sidebarCal: 'CALIBRATE / KALİBRASYON',
    speak: 'Speak',
    delete: 'Delete',
    clear: 'Clear',
    space: 'Space',
    keyboard: 'Keyboard',
    cards: 'Cards',
    calibrating: 'Look at point → blink once',
    calibrationDone: 'Calibration done!',
    usingDefaults: 'Using default calibration',
  }
};

// ════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════
const S = {
  lang: 'tr',
  text: '',
  blinkCount: 0,
  phraseCount: 0,
  isTracking: false,
  isCamOn: false,
  blinkThresh: 0.22,
  gazeGain: 3.5,
  smoothFactor: 0.12,
  ttsRate: 1.0,
  ttsPitch: 1.0,
  gx: window.innerWidth/2,
  gy: window.innerHeight/2,
  rgx: 0.5, rgy: 0.5,       // raw iris [0-1]
  calBaseX: 0.5, calBaseY: 0.5,
  isCalibrating: false,
  calStep: 0,
  calData: [],
  rawIrisX: 0.5, rawIrisY: 0.5, // pre-calibration iris
  eyesClosed: false,
  eyesClosedAt: 0,
  activeTab: 'kb',
  activeCat: 'sik',
  freq: JSON.parse(localStorage.getItem('gsFreq')||'{}'),
};

// ════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════
const KB = {
  tr: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['Q','W','E','R','T','Y','U','I','O','P','Ğ','Ü'],
    ['A','S','D','F','G','H','J','K','L','Ş','İ'],
    ['Z','X','C','V','B','N','M','Ö','Ç'],
    ['⌫','___SP___','.', ',','?','!']
  ],
  en: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M'],
    ['⌫','___SP___','.', ',','?','!']
  ]
};

const CATS = {
  tr:{sik:'⭐ Sık',ihtiyac:'🆘 İhtiyaç',duygu:'💬 Duygu',gunluk:'🌞 Günlük'},
  en:{sik:'⭐ Frequent',ihtiyac:'🆘 Needs',duygu:'💬 Feelings',gunluk:'🌞 Daily'}
};

const PHRASES = {
  tr:{
    sik:[
      {i:'👋',t:'Merhaba'},{i:'🙏',t:'Teşekkür ederim'},{i:'✅',t:'Evet'},
      {i:'❌',t:'Hayır'},{i:'🆘',t:'Yardım edin lütfen'},{i:'💊',t:'İlaç lazım'},
      {i:'💧',t:'Su istiyorum'},{i:'🍽️',t:'Acıktım'},{i:'😣',t:'Ağrım var'},
      {i:'😴',t:'Uyumak istiyorum'},{i:'🚽',t:'Tuvalete gitmem lazım'},{i:'🥶',t:'Üşüyorum'},
    ],
    ihtiyac:[
      {i:'📞',t:'Aile üyemi arayın'},{i:'👨‍⚕️',t:'Doktor çağırın'},
      {i:'🏥',t:'Hastaneye götürün'},{i:'📱',t:'Telefonum nerede?'},
      {i:'👓',t:'Gözlüğüm lazım'},{i:'🔋',t:'Şarj lazım'},
      {i:'🛏️',t:'Yatmak istiyorum'},{i:'🪑',t:'Oturmak istiyorum'},
    ],
    duygu:[
      {i:'😊',t:'Mutluyum'},{i:'😢',t:'Üzgünüm'},{i:'😰',t:'Korkuyorum'},
      {i:'😤',t:'Sinirleniyorum'},{i:'😌',t:'İyiyim'},{i:'🤔',t:'Bilmiyorum'},
      {i:'❤️',t:'Sizi seviyorum'},{i:'😲',t:'Şaşırdım'},
    ],
    gunluk:[
      {i:'🌅',t:'Günaydın'},{i:'🌙',t:'İyi geceler'},{i:'🤝',t:'Görüşürüz'},
      {i:'📺',t:'TV izlemek istiyorum'},{i:'🎵',t:'Müzik dinlemek istiyorum'},
      {i:'🌞',t:'Dışarı çıkmak istiyorum'},{i:'☕',t:'Kahve istiyorum'},
    ]
  },
  en:{
    sik:[
      {i:'👋',t:'Hello'},{i:'🙏',t:'Thank you'},{i:'✅',t:'Yes'},
      {i:'❌',t:'No'},{i:'🆘',t:'Please help me'},{i:'💊',t:'I need medication'},
      {i:'💧',t:'I want water'},{i:'🍽️',t:"I'm hungry"},{i:'😣',t:"I'm in pain"},
      {i:'😴',t:'I want to sleep'},{i:'🚽',t:'I need the bathroom'},{i:'🥶',t:"I'm cold"},
    ],
    ihtiyac:[
      {i:'📞',t:'Call my family'},{i:'👨‍⚕️',t:'Call the doctor'},
      {i:'🏥',t:'Take me to hospital'},{i:'📱',t:'Where is my phone?'},
      {i:'👓',t:'I need my glasses'},{i:'🔋',t:'Need to charge'},
      {i:'🛏️',t:'I want to lie down'},{i:'🪑',t:'I want to sit up'},
    ],
    duygu:[
      {i:'😊',t:"I'm happy"},{i:'😢',t:"I'm sad"},{i:'😰',t:"I'm scared"},
      {i:'😤',t:"I'm angry"},{i:'😌',t:"I'm fine"},{i:'🤔',t:"I don't know"},
      {i:'❤️',t:'I love you'},{i:'😲',t:"I'm surprised"},
    ],
    gunluk:[
      {i:'🌅',t:'Good morning'},{i:'🌙',t:'Good night'},{i:'🤝',t:'See you later'},
      {i:'📺',t:'I want to watch TV'},{i:'🎵',t:'I want to listen to music'},
      {i:'🌞',t:'I want to go outside'},{i:'☕',t:'I want coffee'},
    ]
  }
};

const CAL_PTS = [
  {x:.08,y:.08},{x:.92,y:.08},{x:.5,y:.5},{x:.08,y:.92},{x:.92,y:.92}
];

// Face Mesh landmark indices
const L_EYE = [33,160,158,133,153,144];
const R_EYE = [362,385,387,263,373,380];
const L_IRIS = 468, R_IRIS = 473;
const M_LEFT=61, M_RIGHT=291, M_TOP=13, M_BTM=14;
const L_BROW_IN=55, R_BROW_IN=285, L_BROW_OUT=46, R_BROW_OUT=276;

// ════════════════════════════════════════════
// TRANSLATION FUNCTION
// ════════════════════════════════════════════
function T(key) {
  return STRINGS[S.lang]?.[key] || STRINGS['tr'][key] || key;
}

function updateAllText() {
  // Startup Screen
  document.getElementById('title-main').innerHTML = T('title');
  document.getElementById('subtitle-main').innerHTML = T('subtitle');
  document.getElementById('btn-start').textContent = T('startBtn');

  // Calibration Modal
  document.getElementById('cal-title-text').textContent = T('calTitle');
  document.getElementById('cal-info-text').innerHTML = T('calInfo');
  document.getElementById('btn-cal-start').textContent = T('calStart');
  document.getElementById('btn-cal-skip').textContent = T('calSkip');

  // Header
  document.getElementById('header-title').textContent = T('headerTitle');
  document.getElementById('cam-lbl').textContent = S.isCamOn ? T('camOn') : T('camNo');
  document.getElementById('trk-lbl').textContent = S.isTracking ? T('trackOn') : T('trackNo');
  document.getElementById('header-cal').textContent = T('calibration');

  // Sidebar
  document.getElementById('no-face-text').textContent = T('noFace');
  document.getElementById('stat-blinks-label').textContent = T('blinkLabel');
  document.getElementById('stat-words-label').textContent = T('wordLabel');
  document.getElementById('stat-phrases-label').textContent = T('phraseLabel');
  document.getElementById('sett-gaze-title').textContent = T('gazeTitle');
  document.getElementById('sett-blink-label').innerHTML = `<span>${T('blinkLabel')}</span> <span class="sett-v" id="sv-blink">${S.blinkThresh.toFixed(2)}</span>`;
  document.getElementById('sett-gain-label').innerHTML = `<span>${T('gainLabel')}</span> <span class="sett-v" id="sv-gain">${S.gazeGain.toFixed(1)}</span>`;
  document.getElementById('sett-smooth-label').innerHTML = `<span>${T('smoothLabel')}</span> <span class="sett-v" id="sv-smooth">${S.smoothFactor.toFixed(2)}</span>`;
  document.getElementById('sett-voice-title').textContent = T('voiceTitle');
  document.getElementById('sett-rate-label').innerHTML = `<span>${T('rateLabel')}</span> <span class="sett-v" id="sv-rate">${S.ttsRate.toFixed(1)}</span>`;
  document.getElementById('sett-pitch-label').innerHTML = `<span>${T('pitchLabel')}</span> <span class="sett-v" id="sv-pitch">${S.ttsPitch.toFixed(1)}</span>`;
  document.getElementById('sidebar-cal-text').textContent = T('sidebarCal');

  // Action Buttons
  document.getElementById('btn-speak-text').textContent = T('speak');
  document.getElementById('btn-bs-text').textContent = T('delete');
  document.getElementById('btn-clr-text').textContent = T('clear');
  document.getElementById('btn-sp-text').textContent = T('space');

  // Tabs
  document.getElementById('tab-kb-text').textContent = T('keyboard');
  document.getElementById('tab-cd-text').textContent = T('cards');
}

// ════════════════════════════════════════════
// BOOT / MEDIAPIPE
// ════════════════════════════════════════════
let faceMesh, mpCam;
const vid = document.getElementById('video');
const cvs = document.getElementById('cam-canvas');
const ctx = cvs.getContext('2d');

async function loadMP(){
  const fill = document.getElementById('s-fill');
  const status = document.getElementById('s-status');
  let p = 0;
  const iv = setInterval(()=>{ p = Math.min(p + Math.random()*12, 88); fill.style.width=p+'%'; },180);

  faceMesh = new FaceMesh({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${f}`});
  faceMesh.setOptions({maxNumFaces:1,refineLandmarks:true,minDetectionConfidence:.5,minTrackingConfidence:.5});
  faceMesh.onResults(onResults);

  status.textContent = 'Model yükleniyor… / Loading model…';
  try {
    await faceMesh.initialize();
    clearInterval(iv);
    fill.style.width='100%';
    status.textContent = '✅ Hazır! / Ready!';
    setTimeout(()=>document.getElementById('s-startbtn').style.display='block', 400);
  } catch(e){
    clearInterval(iv);
    status.textContent = '❌ Hata — Sayfayı yenileyin / Reload page';
  }
}

async function startApp(){
  document.getElementById('startup').classList.add('fade');
  await initCam();
  buildKeyboard();
  buildCatBar();
  renderCards();
  gazeLoop();
}

async function initCam(){
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'}});
    vid.srcObject = stream;
    cvs.width = 260; cvs.height = 195;
    mpCam = new Camera(vid,{onFrame:async()=>{ await faceMesh.send({image:vid}); },width:640,height:480});
    mpCam.start();
    S.isCamOn = true;
    document.getElementById('cam-dot').classList.add('on');
    document.getElementById('cam-lbl').textContent = T('camOn');
  } catch(e){
    toast('⚠️ ' + (S.lang==='tr'?'Kamera izni gerekli!':'Camera permission required!'));
  }
}

// ════════════════════════════════════════════
// FACE MESH PROCESSING
// ════════════════════════════════════════════
function d2(a,b){ return Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2); }

function ear(lm,idx){
  const [p1,p2,p3,p4,p5,p6]=idx.map(i=>lm[i]);
  return (d2(p2,p6)+d2(p3,p5))/(2*d2(p1,p4));
}

function emotion(lm){
  const mW = d2(lm[M_LEFT],lm[M_RIGHT]);
  const mOpen = d2(lm[M_TOP],lm[M_BTM])/mW;
  const mCy = (lm[M_LEFT].y+lm[M_RIGHT].y)/2;
  const liftL = mCy - lm[M_LEFT].y;
  const liftR = mCy - lm[M_RIGHT].y;
  const cornerElev = (liftL+liftR)/2;
  const browSlope = ((lm[L_BROW_IN].y-lm[L_BROW_OUT].y)+(lm[R_BROW_IN].y-lm[R_BROW_OUT].y))/2;
  const browLift = lm[159].y - lm[L_BROW_IN].y;

  const emojisMap = {
    tr: {surprised:'😲', angry:'😠', happy:'😊', sad:'😢', neutral:'😐'},
    en: {surprised:'😲', angry:'😠', happy:'😊', sad:'😢', neutral:'😐'}
  };
  const labelsMap = {
    tr: {surprised:'ŞAŞKIN', angry:'KIZGIN', happy:'MUTLU', sad:'ÜZGÜN', neutral:'NÖTR'},
    en: {surprised:'SURPRISED', angry:'ANGRY', happy:'HAPPY', sad:'SAD', neutral:'NEUTRAL'}
  };

  if(mOpen>.45 && browLift>.035) return {icon:emojisMap[S.lang].surprised,lbl:labelsMap[S.lang].surprised,color:'#ffcc00',conf:Math.min(mOpen*120,100)};
  if(browSlope>.013) return {icon:emojisMap[S.lang].angry,lbl:labelsMap[S.lang].angry,color:'#ff4455',conf:Math.min(browSlope*4000,100)};
  if(cornerElev<-.008 && mOpen<.28) return {icon:emojisMap[S.lang].happy,lbl:labelsMap[S.lang].happy,color:'#00e87a',conf:Math.min(Math.abs(cornerElev)*3000,100)};
  if(cornerElev>.012 && browLift<.015) return {icon:emojisMap[S.lang].sad,lbl:labelsMap[S.lang].sad,color:'#4488ff',conf:Math.min(cornerElev*3000,100)};
  return {icon:emojisMap[S.lang].neutral,lbl:labelsMap[S.lang].neutral,color:'#556677',conf:55};
}

function onResults(r){
  ctx.clearRect(0,0,cvs.width,cvs.height);
  const noface = document.getElementById('no-face');

  if(!r.multiFaceLandmarks||!r.multiFaceLandmarks.length){
    S.isTracking=false;
    document.getElementById('trk-dot').classList.remove('on');
    document.getElementById('trk-lbl').textContent = T('trackNo');
    noface.classList.add('show');
    return;
  }
  noface.classList.remove('show');
  S.isTracking=true;
  document.getElementById('trk-dot').classList.add('on');
  document.getElementById('trk-lbl').textContent = T('trackOn');

  const lm = r.multiFaceLandmarks[0];

  // Draw eye mesh on canvas
  drawEyes(lm);

  // EAR blink
  const avgEar = (ear(lm,L_EYE)+ear(lm,R_EYE))/2;
  handleBlink(avgEar);

  // Iris gaze
  if(lm.length>473){
    const li=lm[L_IRIS], ri=lm[R_IRIS];
    const ix = 1-(li.x+ri.x)/2; // flip x (mirrored video)
    const iy = (li.y+ri.y)/2;
    S.rawIrisX=ix; S.rawIrisY=iy;
    updateGaze(ix,iy);
  }

  // Emotion
  const em=emotion(lm);
  document.getElementById('emo-icon').textContent=em.icon;
  document.getElementById('emo-label').textContent=em.lbl;
  document.getElementById('emo-label').style.color=em.color;
  document.getElementById('emo-fill').style.width=em.conf+'%';
  document.getElementById('emo-fill').style.background=em.color;
}

function drawEyes(lm){
  const w=cvs.width, h=cvs.height;
  ctx.save();
  ctx.strokeStyle='rgba(0,212,255,.4)';
  ctx.lineWidth=.8;
  [[...L_EYE],[...R_EYE]].forEach(idx=>{
    ctx.beginPath();
    idx.forEach((i,j)=>{
      const p=lm[i];
      j===0?ctx.moveTo(p.x*w,p.y*h):ctx.lineTo(p.x*w,p.y*h);
    });
    ctx.closePath();ctx.stroke();
  });
  if(lm.length>473){
    [L_IRIS,R_IRIS].forEach(i=>{
      const p=lm[i];
      ctx.beginPath();
      ctx.arc(p.x*w,p.y*h,3.5,0,Math.PI*2);
      ctx.fillStyle='rgba(0,212,255,.95)';
      ctx.shadowColor='#00d4ff';ctx.shadowBlur=8;
      ctx.fill();ctx.shadowBlur=0;
    });
  }
  ctx.restore();
}

// ════════════════════════════════════════════
// BLINK
// ════════════════════════════════════════════
const MIN_BLINK=80, MAX_BLINK=480;

function handleBlink(avgEar){
  const now=Date.now();
  const bd=document.getElementById('blink-dot');
  if(avgEar<S.blinkThresh){
    if(!S.eyesClosed){ S.eyesClosed=true; S.eyesClosedAt=now; bd.classList.add('on'); }
  } else {
    if(S.eyesClosed){
      S.eyesClosed=false; bd.classList.remove('on');
      const dur=now-S.eyesClosedAt;
      if(dur>=MIN_BLINK && dur<=MAX_BLINK) onBlink();
    }
  }
}

function onBlink(){
  S.blinkCount++;
  document.getElementById('s-blinks').textContent=S.blinkCount;

  const cur=document.getElementById('gaze-cursor');
  cur.classList.add('sel');
  setTimeout(()=>cur.classList.remove('sel'),280);

  if(S.isCalibrating){ recordCalPt(); return; }

  selectAtGaze();
}

// ════════════════════════════════════════════
// GAZE
// ════════════════════════════════════════════
function updateGaze(ix,iy){
  const mx=(ix-S.calBaseX)*S.gazeGain+0.5;
  const my=(iy-S.calBaseY)*S.gazeGain+0.5;
  const tx=Math.max(0,Math.min(1,mx))*window.innerWidth;
  const ty=Math.max(0,Math.min(1,my))*window.innerHeight;
  S.gx+=(tx-S.gx)*S.smoothFactor;
  S.gy+=(ty-S.gy)*S.smoothFactor;
  const cur=document.getElementById('gaze-cursor');
  cur.style.left=S.gx+'px';
  cur.style.top=S.gy+'px';
}

let lastHov=null;
function gazeLoop(){
  const cur=document.getElementById('gaze-cursor');
  cur.style.display='none';
  const el=document.elementFromPoint(S.gx,S.gy);
  cur.style.display='';
  if(el!==lastHov){
    if(lastHov) lastHov.classList.remove('gh');
    const hoverable=el&&el.classList&&(el.classList.contains('key')||el.classList.contains('pcard')||el.classList.contains('act-btn')||el.classList.contains('cat-btn')||el.classList.contains('tab-btn'));
    if(hoverable){ el.classList.add('gh'); lastHov=el; }
    else lastHov=null;
  }
  requestAnimationFrame(gazeLoop);
}

function selectAtGaze(){
  const cur=document.getElementById('gaze-cursor');
  cur.style.display='none';
  const el=document.elementFromPoint(S.gx,S.gy);
  cur.style.display='';
  if(!el) return;
  el.classList.add('sel');
  setTimeout(()=>el.classList.remove('sel'),260);
  if(el.classList.contains('key')) pressKey(el.dataset.k);
  else if(el.classList.contains('pcard')) selectPhrase(el.dataset.t);
  else if(el.classList.contains('act-btn')||el.classList.contains('cat-btn')||el.classList.contains('tab-btn')) el.click();
}

// ════════════════════════════════════════════
// CALIBRATION
// ════════════════════════════════════════════
function showCalOverlay(){
  S.calStep=0;
  document.getElementById('cal-prog').textContent='0 / '+CAL_PTS.length;
  document.getElementById('cal-overlay').classList.add('show');
}

function skipCalibration(){
  document.getElementById('cal-overlay').classList.remove('show');
  toast(T('usingDefaults'));
}

function beginCalibration(){
  document.getElementById('cal-overlay').classList.remove('show');
  S.isCalibrating=true;
  S.calStep=0;
  S.calData=[];
  showCalDot();
}

function showCalDot(){
  if(S.calStep>=CAL_PTS.length){ finishCal(); return; }
  const pt=CAL_PTS[S.calStep];
  const dot=document.getElementById('cal-dot');
  dot.style.display='block';
  dot.style.left=(pt.x*window.innerWidth)+'px';
  dot.style.top=(pt.y*window.innerHeight)+'px';
  toast(`${S.calStep+1}/${CAL_PTS.length}: ${T('calibrating')}`);
}

function recordCalPt(){
  const pt=CAL_PTS[S.calStep];
  S.calData.push({sx:pt.x,sy:pt.y,ix:S.rawIrisX,iy:S.rawIrisY});
  document.getElementById('cal-dot').style.display='none';
  document.getElementById('cal-prog').textContent=(S.calStep+1)+' / '+CAL_PTS.length;
  S.calStep++;
  setTimeout(showCalDot,600);
}

function finishCal(){
  S.isCalibrating=false;
  document.getElementById('cal-dot').style.display='none';
  if(S.calData.length>=3){
    const ctr=S.calData.find(d=>d.sx===.5&&d.sy===.5);
    if(ctr){ S.calBaseX=ctr.ix; S.calBaseY=ctr.iy; }
    const tl=S.calData.find(d=>d.sx<.2&&d.sy<.2);
    const br=S.calData.find(d=>d.sx>.7&&d.sy>.7);
    if(tl&&br&&ctr){
      const spanX=Math.abs(br.ix-tl.ix), spanY=Math.abs(br.iy-tl.iy);
      if(spanX>.005) S.gazeGain=Math.min(6,0.8/spanX);
      if(spanY>.005) S.gazeGain=Math.min(S.gazeGain,(S.gazeGain+0.8/spanY)/2);
      document.getElementById('sl-gain').value=S.gazeGain.toFixed(1);
      document.getElementById('sv-gain').textContent=S.gazeGain.toFixed(1);
    }
  }
  toast('✅ '+T('calibrationDone'));
}

// ════════════════════════════════════════════
// KEYBOARD
// ════════════════════════════════════════════
function buildKeyboard(){
  const panel=document.getElementById('kb-panel');
  panel.innerHTML='';
  KB[S.lang].forEach(row=>{
    const rowEl=document.createElement('div');
    rowEl.className='kb-row';
    row.forEach(k=>{
      const btn=document.createElement('button');
      btn.className='key';
      if(k==='___SP___'){
        btn.className+=' xwide';
        btn.textContent= S.lang==='tr'?'BOŞLUK':'SPACE';
        btn.dataset.k=' ';
      } else if(k==='⌫'){
        btn.className+=' wide';
        btn.textContent='⌫ ' + (S.lang==='tr'?'SİL':'DEL');
        btn.dataset.k='bs';
      } else {
        btn.textContent=k;
        btn.dataset.k=k;
      }
      btn.addEventListener('click',()=>pressKey(btn.dataset.k));
      rowEl.appendChild(btn);
    });
    panel.appendChild(rowEl);
  });
}

function pressKey(k){
  if(k==='bs') doBackspace();
  else { S.text+=k; updText(); }
}

function doBackspace(){ S.text=S.text.slice(0,-1); updText(); }
function doClear(){ S.text=''; updText(); }
function doSpace(){ S.text+=' '; updText(); }

function updText(){
  document.getElementById('typed').textContent=S.text;
  const words=S.text.trim().split(/\s+/).filter(w=>w);
  document.getElementById('s-words').textContent=words.length;
}

// ════════════════════════════════════════════
// TTS
// ════════════════════════════════════════════
function speak(txt,lang){
  if(!txt.trim()) return;
  const syn=window.speechSynthesis;
  syn.cancel();
  const u=new SpeechSynthesisUtterance(txt);
  u.lang=lang||( S.lang==='tr'?'tr-TR':'en-US' );
  u.rate=S.ttsRate; u.pitch=S.ttsPitch;
  const code=S.lang==='tr'?'tr':'en';
  const v=syn.getVoices().find(x=>x.lang.startsWith(code));
  if(v) u.voice=v;
  syn.speak(u);
}
function speakText(){ speak(S.text); }

// ════════════════════════════════════════════
// PHRASE CARDS
// ════════════════════════════════════════════
function buildCatBar(){
  const bar=document.getElementById('cat-bar');
  bar.innerHTML='';
  Object.entries(CATS[S.lang]).forEach(([k,lbl])=>{
    const btn=document.createElement('button');
    btn.className='cat-btn'+(k===S.activeCat?' on':'');
    btn.textContent=lbl;
    btn.dataset.cat=k;
    btn.addEventListener('click',()=>pickCat(k));
    bar.appendChild(btn);
  });
}

function pickCat(cat){
  S.activeCat=cat;
  document.querySelectorAll('.cat-btn').forEach(b=>b.classList.toggle('on',b.dataset.cat===cat));
  renderCards();
}

function renderCards(){
  const grid=document.getElementById('cards-grid');
  grid.innerHTML='';
  const phrases=[...(PHRASES[S.lang][S.activeCat]||[])];
  phrases.sort((a,b)=>(S.freq[b.t]||0)-(S.freq[a.t]||0));
  phrases.forEach(p=>{
    const card=document.createElement('div');
    card.className='pcard';
    card.dataset.t=p.t;
    const freq=S.freq[p.t]||0;
    card.innerHTML=`<div class="pcard-icon">${p.i}</div><div class="pcard-text">${p.t}</div>${freq?`<div class="pcard-freq">${freq}</div>`:''}`;
    card.addEventListener('click',()=>selectPhrase(p.t));
    grid.appendChild(card);
  });
}

function selectPhrase(txt){
  S.freq[txt]=(S.freq[txt]||0)+1;
  localStorage.setItem('gsFreq',JSON.stringify(S.freq));
  S.phraseCount++;
  document.getElementById('s-phrases').textContent=S.phraseCount;
  speak(txt);
  S.text=txt; updText();
  renderCards();
  toast('🔊 '+txt);
}

// ════════════════════════════════════════════
// TABS & LANG
// ════════════════════════════════════════════
function switchTab(tab){
  S.activeTab=tab;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('on',b.id==='tab-'+tab));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('on',p.id==='panel-'+tab));
}

function setLang(l){
  S.lang=l;
  document.getElementById('btn-tr').classList.toggle('on',l==='tr');
  document.getElementById('btn-en').classList.toggle('on',l==='en');
  updateAllText();
  buildKeyboard();
  buildCatBar();
  renderCards();
  toast(l==='tr'?'🇹🇷 TR':'🇬🇧 EN');
}

// ════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════
function updSett(){
  S.blinkThresh=parseFloat(document.getElementById('sl-blink').value);
  S.gazeGain=parseFloat(document.getElementById('sl-gain').value);
  S.smoothFactor=parseFloat(document.getElementById('sl-smooth').value);
  S.ttsRate=parseFloat(document.getElementById('sl-rate').value);
  S.ttsPitch=parseFloat(document.getElementById('sl-pitch').value);
  document.getElementById('sv-blink').textContent=S.blinkThresh.toFixed(2);
  document.getElementById('sv-gain').textContent=S.gazeGain.toFixed(1);
  document.getElementById('sv-smooth').textContent=S.smoothFactor.toFixed(2);
  document.getElementById('sv-rate').textContent=S.ttsRate.toFixed(1);
  document.getElementById('sv-pitch').textContent=S.ttsPitch.toFixed(1);
}

// ════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════
let toastTmr;
function toast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg;el.classList.add('show');
  clearTimeout(toastTmr);
  toastTmr=setTimeout(()=>el.classList.remove('show'),2600);
}

// ════════════════════════════════════════════
// BOOT
// ════════════════════════════════════════════
window.speechSynthesis.onvoiceschanged=()=>{};
loadMP();