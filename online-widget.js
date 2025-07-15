(function() {
  const min = 82, max = 344;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;

  // Tworzymy główny widget jeśli nie istnieje
  let place = document.getElementById('visitors-widget');
  if (!place) {
    place = document.createElement('div');
    place.id = "visitors-widget";
    place.style.cssText = `
      position:fixed;
      left:18px; bottom:22px;
      z-index:3000;
      background:#000;
      padding:13px 22px 12px 23px;
      color:#ff0000;
      font-weight: 800;
      font-size: 1.13em;
      letter-spacing: .035em;
      border-radius: 16px 19px 22px 19px;
      border:2.7px solid #ffd400;
      box-shadow:0 4px 26px #1119;
      display:flex;
      align-items: center;
      gap: 11px;
      min-width: 98px;
      flex-direction: column-reverse;
      transition:opacity .23s;
      pointer-events:none;
      user-select: none;
    `;
    document.body.appendChild(place);
  }
  place.innerHTML = `
    <div id="fake-download-activity" style="display:none;pointer-events:none;"></div>
    <div id="main-visit-row" style="display:flex;align-items:center;gap:12px;min-width:160px;">
      <img src="assets/visitors.svg" alt="Online" style="width:28px;height:28px;vertical-align:middle;filter:drop-shadow(0 0 8px #ffd400a0);">
      <span id="current-visitors" style="font-size:1.25em;">${fake}</span>
      <span style="font-weight:400;font-size:.99em;letter-spacing:.007em;margin-left:2px;">online now</span>
    </div>
  `;

  setInterval(()=>{
    const n = fake + Math.floor(Math.random()*3) - 1;
    fake = Math.min(Math.max(n, min), max);
    document.getElementById("current-visitors").textContent = fake;
  }, 4500);

  // ==== Animacja keyframes dla widgetu i szuflady ====
  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
  @keyframes stickyWidgetB {
    0%{transform:translateY(42px) scale(0.89); opacity:0}
    100%{transform:translateY(0) scale(1); opacity:1}
  }
  @keyframes trayInSlide {
    0% { opacity:0; transform:translateY(45%) scale(0.95);}
    55%{ opacity:.88; transform:translateY(-8%) scale(1.09);}
    100%{ opacity:1; transform:translateY(0) scale(1);}
  }
  @keyframes trayOutSlide {
    0%{opacity:1; transform:translateY(0) scale(1);}
    100%{opacity:0;transform:translateY(30px) scale(0.92);}
  }
  `;
  document.head.appendChild(styleSheet);

  // Szufladka downloads (wyjeżdża spod widgetu, wyżej w DOM!)
  function showDownloadTray() {
    const tray = document.getElementById('fake-download-activity');
    const num = Math.floor(Math.random()*24) + 7;
    tray.innerHTML = `
      <div class="traybubble">
        <img src="assets/download.svg" style="width:17px;height:17px;margin-right:6px;vertical-align:middle;filter:drop-shadow(0 0 2px #ffd40090)"/>
        <span style="font-size:1.09em;font-weight:700;">${num}</span>
        <span style="font-size:0.93em;font-weight:500;margin-left:4px;">downloads recently</span>
      </div>
    `;
    tray.style.display = "flex";
    const trayEl = tray.firstElementChild;
    trayEl.style.animation = "trayInSlide .38s cubic-bezier(.41,1.32,.62,1.04) 1";

    // Ukryj po 2.7–4.2sek
    setTimeout(() => {
      trayEl.style.animation = "trayOutSlide 0.44s cubic-bezier(.38,1.2,.88,1.14)";
      setTimeout(()=>{ tray.style.display = "none"; }, 380);
    }, 2100 + Math.random()*1800);
  }
  // Powtarzanie co 16–35sek
  function repeatTray() {
    const t = 16000 + Math.random()*18000;
    setTimeout(()=>{
      showDownloadTray();
      repeatTray();
    }, t);
  }
  repeatTray();

  // Styl traybubble (szufladka): węższa i nad widgetem
  var trayStyle = document.createElement("style");
  trayStyle.innerText = `
    #fake-download-activity {
      width:100%;
      justify-content: center;
      margin-bottom: -8px;
      z-index: 10;
    }
    .traybubble {
      background: #ff0000;
      color: #fff;
      border: 2.5px solid #ffd400;
      border-radius: 12px 16px 21px 18px;
      font-size: 1em;
      padding: 6px 28px 7px 16px;
      min-width: 115px;
      max-width: 155px;
      text-align:center;
      font-family:'Montserrat','Arial',sans-serif;
      font-weight:700;
      box-shadow: 0 4px 18px #94580024;
      letter-spacing: .013em;
      margin-left:auto;
      margin-right:auto;
      display:flex;
      align-items:center;
      justify-content:center;
    }
  `;
  document.head.appendChild(trayStyle);
})();