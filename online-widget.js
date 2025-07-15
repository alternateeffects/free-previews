(function() {
  const min = 82, max = 344;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;

  // GŁÓWNY widget (widżet zawsze na wierzchu, szufladka osobno "pod spodem" na fixed)
  let main = document.getElementById('visitors-widget');
  if (!main) {
    main = document.createElement('div');
    main.id = "visitors-widget";
    main.style.cssText = `
      position:fixed;left:18px;bottom:22px;z-index:3000;background:#000;
      padding:15px 30px 15px 30px; color:#ff0000; font-weight:800;
      font-size:1.23em; letter-spacing:.035em;
      border-radius:20px; border:3px solid #ffd400; box-shadow:0 4px 26px #1119;
      display:inline-flex; align-items:center; gap:14px;
      min-width:180px; max-width:360px; pointer-events:none; user-select:none;
      flex-direction: row; justify-content: center;
      animation:stickyWidgetB .77s cubic-bezier(.37,2,.62,1.14);
      overflow:visible;
    `;
    main.innerHTML = `
      <img src="assets/visitors.svg" alt="Online" style="width:29px;height:29px;vertical-align:middle;filter:drop-shadow(0 0 8px #ffd40090);">
      <span id="current-visitors" style="font-weight:900;color:#ff0000;font-size:1.33em;margin-left:2px;margin-right:2px;">${fake}</span>
      <span style="font-weight:500;font-size:.99em;color:#ff0000;letter-spacing:.012em;margin-left:2px;">online now</span>
    `;
    document.body.appendChild(main);
  }

  setInterval(() => {
    const n = fake + Math.floor(Math.random()*4) - 2;
    fake = Math.min(Math.max(n, min), max);
    document.getElementById("current-visitors").textContent = fake;
  }, 4700);

  // Szufladka downloadów na fixed, WYJEŻDŻAJĄCA spod main
  let tray = document.getElementById('fake-download-bubble');
  if (!tray) {
    tray = document.createElement('div');
    tray.id = 'fake-download-bubble';
    tray.style.position = 'fixed';
    tray.style.zIndex = '2999'; // niżej niż widget główny
    tray.style.pointerEvents = 'none';
    tray.style.left = '0'; // Pozycja będzie wyliczana
    tray.style.display = 'none';
    document.body.appendChild(tray);
  }

  // Styl/animacja wyjeżdzania szufladki
  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
@keyframes trayReveal {
  0% {opacity:0; transform:translateY(40px);}
  60% {opacity:1;}
  100% {opacity:1; transform:translateY(0);}
}
@keyframes trayHide {
  0% {opacity:1; transform:translateY(0);}
  100% {opacity:0; transform:translateY(50px);}
}
.fake-download-box {
  background: #ff0000;
  color: #000;
  border: 2.5px solid #ffd400;
  border-radius: 16px 16px 0 0;
  font-size: 0.86em;
  line-height: 1;
  padding: 7px 15px 4px 13px;
  min-width: 80px; max-width: 110px;
  box-shadow: 0 3px 13px #ffd40025;
  letter-spacing: .02em;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 0 auto;
}
.fake-download-box .dl-ico {
  width: 29px; height:29px; margin-right:7px;vertical-align:middle;
  filter:drop-shadow(0 0 2px #ffd400bb);
}
.fake-download-box .bubble-main-num {
  font-weight: 900;
  font-size: 1.13em;
  margin-right: 7px;
  margin-left: 3px;
}
.fake-download-box .bubble-main-label {
  font-size: .82em;
  font-weight: 600;
  margin-left: 4px;
  color: #000;
}
`;
  document.head.appendChild(styleSheet);

  function showDownloadTray() {
    // Pozycjonowanie tray bezpośrednio nad głównym boxem
    const mainRect = main.getBoundingClientRect();
    // Oblicz szerokość szufladki względem szerokości widgetu głównego
    const trayW = Math.max(80, Math.min(mainRect.width * 0.7, 118));
    // Liczba downloadów
    const num = Math.floor(Math.random()*20) + 7;

    tray.style.width = trayW + 'px';
    tray.style.left = (mainRect.left + (mainRect.width - trayW)/2) + 'px';
    tray.style.top = (mainRect.top - 35) + 'px'; // 35px wyżej, by dół schował się pod widget

    tray.innerHTML = `
      <div class="fake-download-box" style="font-size:0.89em">
        <img src="assets/download.svg" class="dl-ico"/>
        <span class="bubble-main-num">${num}</span>
        <span class="bubble-main-label">recently</span>
      </div>
    `;
    tray.style.opacity = "1";
    tray.style.display = "block";
    const trayBox = tray.firstElementChild;
    trayBox.style.animation = "trayReveal .8s cubic-bezier(.19,1.26,.32,1.09)";

    setTimeout(() => {
      trayBox.style.animation = "trayHide .51s cubic-bezier(.29,1.27,.67,1.01)";
      setTimeout(() => {
        tray.style.display = 'none';
      }, 500);
    }, 2000 + Math.random() * 1100);
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