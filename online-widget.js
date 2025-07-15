(function() {
  // Liczba online
  const min = 82, max = 344;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;

  // GŁÓWNY widget
  let place = document.getElementById('visitors-widget');
  if (!place) {
    place = document.createElement('div');
    place.id = "visitors-widget";
    place.style.cssText = `
      position:fixed;left:18px;bottom:22px;z-index:3000;background:#000;
      padding:15px 30px 15px 30px;
      color:#ff0000;font-weight:800;font-size:1.23em;letter-spacing:.035em;
      border-radius:20px;border:3px solid #ffd400;
      box-shadow:0 4px 26px #1119;
      display:inline-flex;align-items:center;gap:14px;
      min-width:180px;max-width:360px; pointer-events:none;user-select:none;
      animation:stickyWidgetB .77s cubic-bezier(.37,2,.62,1.14);
    `;
    document.body.appendChild(place);
  }
  place.innerHTML = `
    <img src="assets/visitors.svg" alt="Online" style="width:29px;height:29px;vertical-align:middle;filter:drop-shadow(0 0 8px #ffd40090);">
    <span id="current-visitors" style="font-weight:900;color:#ff0000;font-size:1.33em;margin-left:2px;margin-right:2px;">${fake}</span>
    <span style="font-weight:500;font-size:.99em;color:#ff0000;letter-spacing:.012em;margin-left:2px;">online now</span>
  `;

  setInterval(()=>{
    const n = fake + Math.floor(Math.random()*4) - 2;
    fake = Math.min(Math.max(n, min), max);
    document.getElementById("current-visitors").textContent = fake;
  }, 4700);

  // Szufladka nad widgetem (precyzyjnie wycentrowana, mniejsza, czarny tekst, duża ikonka)
  let tray = document.getElementById('fake-download-bubble');
  if (!tray) {
    tray = document.createElement('div');
    tray.id = "fake-download-bubble";
    tray.style.display = 'none';
    tray.style.position = 'fixed';
    tray.style.left = '0';
    tray.style.bottom = (22 + 61) + 'px'; // o 61px wyżej niż widget
    tray.style.width = '100%';
    tray.style.zIndex = '3050';
    tray.style.pointerEvents = 'none';
    tray.style.height = '0';
    tray.style.textAlign = 'left';
    document.body.appendChild(tray);
  }

  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
  @keyframes stickyWidgetB {
    0%{transform:translateY(35px) scale(0.88); opacity:0}
    100%{transform:translateY(0) scale(1); opacity:1}
  }
  @keyframes trayInFly {
    0%{opacity:0;transform:translateY(90%) scale(0.89);}
    60%{opacity:1;transform:translateY(-7%) scale(1.08);}
    100%{opacity:1;transform:translateY(0) scale(1);}
  }
  @keyframes trayOutFly {
    0%{opacity:1;transform:translateY(0) scale(1);}
    100%{opacity:0;transform:translateY(56px) scale(0.94);}
  }
  .fake-download-box {
    background: #ff0000;
    color: #111;
    border: 2.5px solid #ffd400;
    border-radius:14px 17px 17px 14px;
    font-size: 1.23em;
    padding: 12px 18px 11px 18px;
    min-width:112px;max-width:156px;
    box-shadow:0 4px 18px #94580021;
    letter-spacing:.016em;
    display: flex;align-items:center;justify-content:center;
    margin: 0 auto;
    animation: trayInFly .39s cubic-bezier(.3,1.23,.66,1.07) 1;
    position:relative;
    will-change: opacity, transform;
    pointer-events: none;
  }
  .fake-download-box .dl-ico {
    width: 32px; height:32px; margin-right:10px;vertical-align:middle;
    filter:drop-shadow(0 0 3px #ffd400bb);
  }
`;
  document.head.appendChild(styleSheet);

  function showDownloadTray() {
    const num = Math.floor(Math.random()*20) + 7;
    tray.innerHTML = `
      <div class="fake-download-box">
        <img src="assets/download.svg" class="dl-ico"/>
        <span style="margin-left:0.5em;margin-right:0.5em;font-size:1.13em;font-weight:900;">${num}</span>
        <span style="font-size:1em;font-weight:600;">recently</span>
      </div>
    `;
    // Pozycjonowanie dokładne — wycentruj względem #visitors-widget:
    const main = document.getElementById('visitors-widget');
    const mainRect = main.getBoundingClientRect();
    setTimeout(()=>{
      const thisTray = tray.firstElementChild;
      if(thisTray){
        // Wycentruj tray względem visitors-widget
        const trayW = thisTray.offsetWidth;
        tray.style.left = (mainRect.left + main.offsetWidth/2 - trayW/2) + 'px';
      }
    }, 40);

    tray.style.display = "block";
    const trayEl = tray.firstElementChild;
    // Po 2-3 sekundach trayOut
    setTimeout(() => {
      trayEl.style.animation = "trayOutFly 0.45s cubic-bezier(.31,1.25,.59,1) 1";
      setTimeout(() => { tray.style.display = "none"; }, 420);
    }, 2000 + Math.random()*1100);
  }

  function repeatTray() {
    const t = 12000 + Math.random() * 12000;
    setTimeout(() => {
      showDownloadTray();
      repeatTray();
    }, t);
  }
  repeatTray();
})();