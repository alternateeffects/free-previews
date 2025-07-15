(function() {
  // Parametry wyświetlania online
  const min = 82, max = 344;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;

  // Widget + szufladka (tray) jako element absolutnie względem widgetu
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
    `;
    // Pozycjonowanie dla tray
    place.innerHTML = `
      <div id="tray-wrap" style="
        position: absolute;
        left: 0; right: 0;
        bottom: 100%; /* tuż "pod" widgetem */
        width: 100%;
        display: flex;
        justify-content: center;
        pointer-events: none;
        z-index: 1;">
        <div id="fake-download-bubble" style="transform:translateY(100%); opacity:0;"></div>
      </div>
      <img src="assets/visitors.svg" alt="Online" style="width:29px;height:29px;vertical-align:middle;filter:drop-shadow(0 0 8px #ffd40090);">
      <span id="current-visitors" style="font-weight:900;color:#ff0000;font-size:1.33em;margin-left:2px;margin-right:2px;">${fake}</span>
      <span style="font-weight:500;font-size:.99em;color:#ff0000;letter-spacing:.012em;margin-left:2px;">online now</span>
    `;
    document.body.appendChild(place);
  }
  // Aktualizacja liczby online
  setInterval(()=>{
    const n = fake + Math.floor(Math.random()*4) - 2;
    fake = Math.min(Math.max(n, min), max);
    document.getElementById("current-visitors").textContent = fake;
  }, 4700);

  // Animacje i styl szufladki
  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
@keyframes trayUpIn {
  0%   { opacity:0; transform: translateY(100%) }
  85%  { opacity:1; transform:translateY(-8px);}
  100% { opacity:1; transform:translateY(0);}
}
@keyframes trayOut {
  0%   { opacity:1; transform: translateY(0);}
  100% { opacity:0; transform:translateY(100%);}
}
#fake-download-bubble {
  transition: opacity .28s, transform .35s cubic-bezier(.25,1.3,.58,1.15);
  will-change: opacity,transform;
  z-index:5;
}
.fake-download-box {
  background: #ff0000;
  color: #000;
  border: 2.5px solid #ffd400;
  border-radius: 16px 16px 0px 0px; /* tylko górne! */
  font-size: 0.96em;
  line-height: 1;
  padding: 9px 16px 6px 12px;
  min-width: 110px; max-width: 140px;
  box-shadow: 0 3px 13px #ffd40025;
  letter-spacing: .02em;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto;
  /* Animacje nadjechania */
}
.fake-download-box .dl-ico {
  width: 32px; height:32px; margin-right:9px;vertical-align:middle;
  filter:drop-shadow(0 0 2px #ffd400bb);
}
.fake-download-box .bubble-main-num {
  font-weight: 900;
  font-size: 1.22em;
  margin-right: 8px;
  margin-left: 2px;
}
.fake-download-box .bubble-main-label {
  font-size: 0.91em;
  font-weight: 600;
  margin-left: 4px;
  margin-right: 0;
  letter-spacing: 0.016em;
  color: #000;
}
`;
  document.head.appendChild(styleSheet);

  // ---- Pojawianie szufladki tak, by wyjeżdżała spod widgetu ----
  function showDownloadTray() {
    const tray = document.getElementById('fake-download-bubble');
    const num = Math.floor(Math.random()*20) + 7;
    tray.innerHTML = `
      <div class="fake-download-box" style="">
        <img src="assets/download.svg" class="dl-ico"/>
        <span class="bubble-main-num">${num}</span>
        <span class="bubble-main-label">recently</span>
      </div>
    `;
    tray.style.opacity = '1';
    tray.style.transform = 'translateY(0)';
    const trayBox = tray.firstElementChild;
    trayBox.style.animation = "trayUpIn .32s cubic-bezier(.21,1.14,.62,1.01) 1";
    tray.style.display = 'block';
    // Po 2.3-3.4 sekundy trayOut
    setTimeout(() => {
      trayBox.style.animation = "trayOut .47s cubic-bezier(.38,1.19,.58,1.04) 1";
      setTimeout(() => {
        tray.style.opacity = '0';
        tray.style.transform = 'translateY(100%)';
        tray.style.display = 'block'; // NIE none, nie skacze layout
        tray.innerHTML = "";
      }, 420);
    }, 1900 + Math.random()*1300);
  }

  // Co pewien czas automatycznie:
  function repeatTray() {
    const t = 13000 + Math.random() * 11000;
    setTimeout(() => {
      showDownloadTray();
      repeatTray();
    }, t);
  }
  repeatTray();
})();