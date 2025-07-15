(function() {
  const min = 82, max = 344;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;
  let trayAnimating = false; // aby nie odpalać dwóch animacji naraz

  // GŁÓWNY WIDGET
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

  // Szufladka TRAY - zawsze obecna, w startowej pozycji transform: translateY(100%);
  let tray = document.getElementById('fake-download-bubble');
  if (!tray) {
    tray = document.createElement('div');
    tray.id = 'fake-download-bubble';
    tray.style.position = 'fixed';
    tray.style.left = '0';
    tray.style.zIndex = '2999';
    tray.style.pointerEvents = 'none';
    tray.style.opacity = '0';
    document.body.appendChild(tray);
  }

  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
@keyframes traySlideOnlyUp {
  0% {opacity: 0; transform: translateY(100%);}
  100% {opacity: 1; transform: translateY(0);}
}
@keyframes traySlideOnlyDown {
  0% {opacity: 1; transform: translateY(0);}
  100% {opacity: 0; transform: translateY(100%);}
}
.fake-download-box {
  background: #ff0000;
  color: #000;
  border: 2.5px solid #ffd400;
  border-radius: 16px 16px 0 0;
  font-size: 0.86em;
  line-height: 1;
  padding: 7px 15px 4px 13px;
  min-width: 130px; max-width: 150px;
  box-shadow: 0 3px 13px #ffd40025;
  letter-spacing: .02em;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 0 auto;
  transition: box-shadow .17s;
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
    if (trayAnimating) return;
    trayAnimating = true;

    // Wartości
    const mainRect = main.getBoundingClientRect();
    const trayW = Math.max(80, Math.min(mainRect.width * 0.7, 120));
    const num = Math.floor(Math.random()*20)+7;
    const trayH = 46; // wysokość szufladki

    // Pozycjonuj tray tak, by dolna krawędź tray dotknęła górnej widgetu
    tray.style.width = trayW + 'px';
    tray.style.height = trayH + 'px';
    tray.style.left = (mainRect.left + (mainRect.width - trayW)/2) + 'px';
    tray.style.top = (mainRect.top - trayH + 3) + 'px'; // 3px overlap by stykało się gładko

    tray.innerHTML = `
      <div class="fake-download-box" style="font-size:0.89em; pointer-events:none;">
        <img src="assets/download.svg" class="dl-ico"/>
        <span class="bubble-main-num">${num}</span>
        <span class="bubble-main-label">recently</span>
      </div>
    `;

    // Start: ukryta na dole
    tray.style.opacity = '1';
    tray.style.transform = 'translateY(100%)';
    tray.style.display = 'block';

    // Animuj tray SLIDE UP
    setTimeout(()=>{
      tray.style.transition = 'none';
      tray.style.animation = "traySlideOnlyUp 0.52s cubic-bezier(.6,1,.82,1)";
      tray.style.opacity = '1';
      tray.style.transform = 'translateY(0)';
    }, 1);

    // Po X sekundach - slideDown
    setTimeout(()=>{
      tray.style.animation = "traySlideOnlyDown 0.59s cubic-bezier(.63,0,1,1) 1";
      setTimeout(()=>{
        tray.style.display = 'none';
        tray.style.opacity = '0';
        tray.style.transform = 'translateY(100%)';
        trayAnimating = false;
      }, 570);
    }, 1800 + Math.random()*950);
  }

  function repeatTray() {
    const t = 11000 + Math.random() * 11000;
    setTimeout(() => {
      showDownloadTray();
      repeatTray();
    }, t);
  }
  repeatTray();
})();