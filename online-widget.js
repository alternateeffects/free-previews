(function(){
  const min = 82, max = 344;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;
  let trayAnimating = false;

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

  // TRAY -- ZAWSZE OBECNY, animuje tylko box, NIE tray!
  let tray = document.getElementById('fake-download-bubble');
  if (!tray) {
    tray = document.createElement('div');
    tray.id = 'fake-download-bubble';
    tray.style.position = 'fixed';
    tray.style.left = '0';
    tray.style.zIndex = '2999';
    tray.style.pointerEvents = 'none';
    tray.style.opacity = '1';
    tray.style.transform = '';
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
  font-size: 1em;
  line-height: 1;
  padding: 10px 24px 8px 18px;
  min-width: 140px; max-width: 220px;
  box-shadow: 0 3px 13px #ffd40025;
  letter-spacing: .02em;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 0 auto;
  transition: box-shadow .17s;
  opacity: 0; transform: translateY(100%);
  will-change:transform,opacity;
}
.fake-download-box .dl-ico {
  width: 32px; height:32px; margin-right:10px; vertical-align:middle;
  filter:drop-shadow(0 0 3px #ffd400bb);
}
.fake-download-box .bubble-main-num {
  font-weight: 900;
  font-size: 1.32em;
  margin-right: 9px;
  margin-left: 2px;
}
.fake-download-box .bubble-main-label {
  font-size: 1em;
  font-weight: 400; /* no bold */
  margin-left: 4px;
  color: #000;
  letter-spacing: 0.014em;
}
`;
  document.head.appendChild(styleSheet);

  function showDownloadTray() {
    if (trayAnimating) return;
    trayAnimating = true;

    const mainRect = main.getBoundingClientRect();
    const trayW = Math.max(140, Math.min(mainRect.width * 0.86, 220));
    const num = Math.floor(Math.random()*20)+7;
    const trayH = 52;

    tray.style.width = trayW + 'px';
    tray.style.height = trayH + 'px';
    tray.style.left = (mainRect.left + (mainRect.width - trayW)/2) + 'px';
    tray.style.top = (mainRect.top - trayH + 3) + 'px';

    tray.innerHTML = `
      <div class="fake-download-box">
        <img src="assets/download.svg" class="dl-ico"/>
        <span class="bubble-main-num">${num}</span>
        <span class="bubble-main-label">recently</span>
      </div>
    `;
    // KLUCZ: ustaw tray z boxem ZAWSZE jako block, animuj tylko box
    const trayBox = tray.firstElementChild;
    trayBox.style.opacity = "0";
    trayBox.style.transform = "translateY(100%)";
    trayBox.style.animation = "traySlideOnlyUp 0.7s cubic-bezier(.51,1,.62,1)";
    trayBox.style.animationFillMode = "forwards";

    // Animacja wejścia
    setTimeout(()=>{trayBox.style.opacity="1";trayBox.style.transform="translateY(0)";}, 10);
    // Animacja wyjścia
    setTimeout(()=>{
      trayBox.style.animation = "traySlideOnlyDown 0.63s cubic-bezier(.63,0,1,1)";
      trayBox.style.animationFillMode = "forwards";
      setTimeout(()=>{
        trayBox.style.opacity="0";
        trayBox.style.transform="translateY(100%)";
        tray.innerHTML="";
        trayAnimating = false;
      }, 630);
    }, 2200 + Math.random()*970);
  }

  function repeatTray() {
    const t = 11000 + Math.random() * 9500;
    setTimeout(() => {
      showDownloadTray();
      repeatTray();
    }, t);
  }
  repeatTray();
})();