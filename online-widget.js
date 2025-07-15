(function() {
  const min = 82, max = 344;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;

  // GŁÓWNY widget
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
      animation:stickyWidgetB .77s cubic-bezier(.37,2,.62,1.14);
      flex-direction: row;
    `;
    // Dołącz PUSTY tray-container (relative!)
    let trayWrap = document.createElement('div');
    trayWrap.id = "tray-wrap";
    trayWrap.style = "position: absolute; left: 0; right: 0; bottom: 100%; width: 100%; display: flex; justify-content: center; pointer-events: none;";
    place.appendChild(trayWrap);

    document.body.appendChild(place);
  }

  // Główna linia widgetu (NIE wrzucamy tray tu!)
  place.innerHTML += `
    <img src="assets/visitors.svg" alt="Online" style="width:29px;height:29px;vertical-align:middle;filter:drop-shadow(0 0 8px #ffd40090);">
    <span id="current-visitors" style="font-weight:900;color:#ff0000;font-size:1.33em;margin-left:2px;margin-right:2px;">${fake}</span>
    <span style="font-weight:500;font-size:.99em;color:#ff0000;letter-spacing:.012em;margin-left:2px;">online now</span>
  `;

  setInterval(()=>{
    const n = fake + Math.floor(Math.random()*4) - 2;
    fake = Math.min(Math.max(n, min), max);
    document.getElementById("current-visitors").textContent = fake;
  }, 4700);

  // Animacje
  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
  @keyframes stickyWidgetB {
    0%{transform:translateY(35px) scale(0.88); opacity:0}
    100%{transform:translateY(0) scale(1); opacity:1}
  }
  @keyframes trayInFly {
    0% { opacity:0; transform: translateY(36px) scale(0.89);}
    60%{opacity:.95;transform:translateY(-7px) scale(1.08);}
    100%{opacity:1;transform:translateY(0) scale(1);}
  }
  @keyframes trayOutFly {
    0%{opacity:1;transform:translateY(0) scale(1);}
    100%{opacity:0;transform:translateY(44px) scale(0.94);}
  }
  .fake-download-box {
    background: #ff0000;
    color: #111;
    border: 2.5px solid #ffd400;
    border-radius: 14px 17px 17px 14px;
    font-size: 1.22em;
    padding: 11px 18px 10px 19px;
    min-width: 102px; max-width: 152px;
    box-shadow: 0 4px 18px #94580025;
    letter-spacing: .016em;
    display: flex; align-items: center; justify-content: center;
    margin-top: 0px; margin-bottom: 2px;
    animation: trayInFly .38s cubic-bezier(.3,1.23,.66,1.07) 1;
    position: relative;
    will-change: opacity, transform;
    pointer-events: none;
  }
  .fake-download-box .dl-ico {
    width: 32px; height:32px; margin-right:10px;vertical-align:middle;
    filter:drop-shadow(0 0 3px #ffd400bb);
  }
  `;
  document.head.appendChild(styleSheet);

  // Przygotuj tray-container w widget! (RELATIVE/TRAY na górze)
  let trayWrap = document.getElementById('tray-wrap');
  if (!trayWrap) {
    trayWrap = document.createElement('div');
    trayWrap.id = "tray-wrap";
    trayWrap.style = "position: absolute; left: 0; right: 0; bottom: 100%; width: 100%; display: flex; justify-content: center; pointer-events: none;";
    place.insertBefore(trayWrap, place.firstChild);
  }

  // ---- SHOW TRAY ----
  function showDownloadTray() {
    // Usuń stare jeśli istnieje
    trayWrap.innerHTML = "";
    const num = Math.floor(Math.random()*20) + 7;
    const trayDiv = document.createElement('div');
    trayDiv.className = "fake-download-box";
    trayDiv.innerHTML = `
      <img src="assets/download.svg" class="dl-ico"/>
      <span style="margin-left:0.7em;margin-right:0.7em;font-size:1.13em;font-weight:900;">${num}</span>
      <span style="font-size:1em;font-weight:600;">recently</span>
    `;
    trayWrap.appendChild(trayDiv);

    // timeout na znikanie
    setTimeout(() => {
      trayDiv.style.animation = "trayOutFly 0.44s cubic-bezier(.41,1.25,.62,1.06) 1";
      setTimeout(() => { trayWrap.innerHTML=""; }, 420);
    }, 2100 + Math.random()*1000);
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