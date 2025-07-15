(function() {
  // Zmienne do fake liczby online
  const min = 82, max = 344;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;

  // GŁÓWNY WIDGET sticky
  let place = document.getElementById('visitors-widget');
  if (!place) {
    place = document.createElement('div');
    place.id = "visitors-widget";
    place.style.cssText = `
      position:fixed;
      left:18px;bottom:22px;z-index:3000;background:#000;padding:15px 30px 15px 30px;
      color:#ff0000;font-weight:800;font-size:1.23em;letter-spacing:.035em;
      border-radius:20px; border:3px solid #ffd400;
      box-shadow:0 4px 26px #1119;
      display:inline-flex;align-items:center;gap:14px;
      min-width:180px; max-width:360px; pointer-events:none;user-select:none;
      animation: stickyWidgetB .77s cubic-bezier(.37,2,.62,1.14);
    `;
    document.body.appendChild(place);
  }
  
  // FAKE DOWNLOAD SHOWN? Append szufladka nad widget!
  let tray = document.getElementById('fake-download-bubble');
  if (!tray) {
    tray = document.createElement('div');
    tray.id = "fake-download-bubble";
    tray.style.display = 'none';
    tray.style.position = 'fixed';
    tray.style.left = '34px';
    tray.style.bottom = (22 + 56) + 'px'; // Trochę ponad głównym widgetem
    tray.style.zIndex = '3050';
    tray.style.pointerEvents = 'none';
    document.body.appendChild(tray);
  }

  // GŁÓWNA linia widgetu
  place.innerHTML = `
    <img src="assets/visitors.svg" alt="Online" style="width:29px;height:29px;vertical-align:middle;filter:drop-shadow(0 0 8px #ffd40090);">
    <span id="current-visitors" style="font-weight:900;color:#ff0000;font-size:1.33em;margin-left:2px;margin-right:2px;">${fake}</span>
    <span style="font-weight:500;font-size:.99em;color:#ff0000;letter-spacing:.012em;margin-left:2px;">online now</span>
  `;

  setInterval(()=>{
    const n = fake + Math.floor(Math.random()*4) - 2; // ruch +/-2
    fake = Math.min(Math.max(n, min), max);
    document.getElementById("current-visitors").textContent = fake;
  }, 4700);

  // Animacja
  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
@keyframes stickyWidgetB { 0%{transform:translateY(35px) scale(0.88); opacity:0} 100%{transform:translateY(0) scale(1); opacity:1} }
@keyframes trayInFly {
  0%{opacity:0;transform:translateY(40px) scale(0.81);}
  72%{opacity:.95;transform:translateY(-9px) scale(1.12);}
  100%{opacity:1;transform:translateY(0) scale(1);}
}
@keyframes trayOutFly {
  0%{opacity:1;transform:translateY(0) scale(1);}
  80%{opacity:.34;transform:translateY(10px) scale(0.96);}
  100%{opacity:0;transform:translateY(34px) scale(0.9);}
}
.fake-download-box {
  background: #ff0000;
  color: #fff;
  border: 2.5px solid #ffd400;
  border-radius: 14px 18px 15px 16px;
  font-size: 1.1em;
  padding: 10px 22px 11px 19px;
  min-width: 108px;
  max-width: 158px;
  text-align:center;
  font-family:'Montserrat','Arial',sans-serif;
  font-weight:900;
  box-shadow: 0 4px 18px #9458001a;
  letter-spacing: .016em;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  will-change: opacity,transform;
}
.fake-download-box .dl-ico {
  width: 18px; height:18px; margin-right:6px; vertical-align:middle; 
  filter:drop-shadow(0 0 2px #ffd400a0)
}
`;
  document.head.appendChild(styleSheet);

  // ---- SHOW TRAY ----
  function showDownloadTray() {
    const num = Math.floor(Math.random()*20) + 7;
    tray.innerHTML = `
      <div class="fake-download-box" style="animation: trayInFly .36s cubic-bezier(.36,1.13,.68,1.07) 1;">
        <img src="assets/download.svg" class="dl-ico"/>
        <span style="font-size:1.12em;font-weight:900;">${num}</span>
        <span style="font-size:0.93em;font-weight:500;margin-left:3px;">downloads recently</span>
      </div>
    `;
    tray.style.display = "block";
    // Animowane pojawienie!
    const trayEl = tray.firstElementChild;

    // Po 2,2–3,4s znika z animacją fly
    setTimeout(() => {
      trayEl.style.animation = "trayOutFly 0.45s cubic-bezier(.41,1.2,.78,1.11)";
      setTimeout(() => { tray.style.display = "none"; }, 430);
    }, 1800 + Math.random()*1450);
  }

  // ---- POWTARZAJ ----
  function repeatTray() {
    const t = 12000 + Math.random() * 12000; // co 12-24 sek
    setTimeout(() => {
      showDownloadTray();
      repeatTray();
    }, t);
  }
  repeatTray();
})();