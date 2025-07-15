(function() {
  const min = 82, max = 344;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;

  // GŁÓWNY widget + tray-wrap
  let place = document.getElementById('visitors-widget');
  if (!place) {
    place = document.createElement('div');
    place.id = "visitors-widget";
    place.style.cssText = `
      position:fixed; left:18px; bottom:22px; z-index:3000; background:#000;
      padding:15px 30px 15px 30px;
      color:#ff0000; font-weight:800; font-size:1.23em; letter-spacing:.035em;
      border-radius:20px; border:3px solid #ffd400;
      box-shadow:0 4px 26px #1119;
      display:inline-flex; align-items:center; gap:14px;
      min-width:180px; max-width:360px; pointer-events:none; user-select:none;
      flex-direction: row;
      justify-content: center;
      overflow: visible;
    `;
    // tray-wrap: absolute na górę, overflow Viz
    let trayWrap = document.createElement('div');
    trayWrap.id = "tray-wrap";
    trayWrap.style = `
      position: absolute;
      left: 0; right: 0;
      bottom: 100%;
      width: 100%;
      display: flex; justify-content: center;
      pointer-events: none; z-index: 1; overflow: visible;
    `;
    place.appendChild(trayWrap);

    document.body.appendChild(place);
    // dodaj główny zawartość
    place.innerHTML += `
      <img src="assets/visitors.svg" alt="Online" style="width:29px;height:29px;vertical-align:middle;filter:drop-shadow(0 0 8px #ffd40090);">
      <span id="current-visitors" style="font-weight:900;color:#ff0000;font-size:1.33em;margin-left:2px;margin-right:2px;">${fake}</span>
      <span style="font-weight:500;font-size:.99em;color:#ff0000;letter-spacing:.012em;margin-left:2px;">online now</span>
    `;
  }

  // Live update
  setInterval(()=>{
    const n = fake + Math.floor(Math.random()*4) - 2;
    fake = Math.min(Math.max(n, min), max);
    document.getElementById("current-visitors").textContent = fake;
  }, 4700);

  // Style + animacja szufladki slide (slow!)
  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
@keyframes traySlideIn {
  0%   { opacity:1; transform: translateY(100%);}
  70%  { opacity:1; transform: translateY(-12px);}
  100% { opacity:1; transform: translateY(0);}
}
@keyframes traySlideOut {
  0%   { opacity:1; transform: translateY(0);}
  100% { opacity:0; transform: translateY(100%);}
}
#tray-wrap { overflow:visible; }
#fake-download-bubble {
  will-change:transform, opacity;
  z-index:6; overflow: visible !important;
}
.fake-download-box {
  background: #ff0000;
  color: #000;
  border: 2.5px solid #ffd400;
  border-radius: 16px 16px 0 0;
  font-size: 0.94em;
  line-height: 1;
  padding: 8px 14px 5px 13px;
  min-width: 90px; max-width: 115px;
  box-shadow: 0 3px 13px #ffd40025;
  letter-spacing: .02em;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 0 auto;
}
.fake-download-box .dl-ico {
  width: 32px; height:32px; margin-right:8px;
  vertical-align:middle; filter:drop-shadow(0 0 2px #ffd400bb);
}
.fake-download-box .bubble-main-num {
  font-weight: 900;
  font-size: 1.16em;
  margin-right: 7px;
  margin-left: 3px;
}
.fake-download-box .bubble-main-label {
  font-size: 0.88em;
  font-weight: 600;
  margin-left: 2px;
  margin-right: 0;
  letter-spacing: 0.014em;
  color: #000;
}
`;
  document.head.appendChild(styleSheet);

  // ---- POPRAWIONE: zawsze #tray-wrap, animuje tylko szufladę, a nie zawartość widgetu! ----
  let trayWrap = document.getElementById('tray-wrap');

  function showDownloadTray() {
    const tray = document.createElement('div');
    tray.id = "fake-download-bubble";
    tray.className = "";
    const num = Math.floor(Math.random() * 19) + 7;
    tray.innerHTML = `
      <div class="fake-download-box"
           style="font-size:.94em;">
        <img src="assets/download.svg" class="dl-ico"/>
        <span class="bubble-main-num">${num}</span>
        <span class="bubble-main-label">recently</span>
      </div>
    `;
    tray.style.transform = "translateY(100%)";
    tray.style.opacity = "1";
    tray.style.animation = "traySlideIn .7s cubic-bezier(.19,1.29,.38,1.08) 1";

    // Usuń stary bubble jeśli był i dodaj nowy
    trayWrap.innerHTML = "";
    trayWrap.appendChild(tray);

    // Po ok. 2,3-3,1s traySlideOut
    setTimeout(() => {
      tray.style.animation = "traySlideOut 0.49s cubic-bezier(.51,1.15,.81,0.99) 1";
      setTimeout(() => {
        trayWrap.innerHTML = "";
      }, 490);
    }, 2000 + Math.random()*1100);
  }

  function repeatTray() {
    const t = 12000 + Math.random() * 13000;
    setTimeout(() => {
      showDownloadTray();
      repeatTray();
    }, t);
  }
  repeatTray();
})();