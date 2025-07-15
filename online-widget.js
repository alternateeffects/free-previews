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
      background:#000000e6;
      padding:13px 22px 12px 23px;
      color:#ff0000;
      font-weight: 800;
      font-size: 1.13em;
      letter-spacing: .035em;
      border-radius: 15px 18px 22px 18px;
      border:2.6px solid #ffd400;
      box-shadow:0 4px 26px #1119;
      display:flex;
      align-items: center;
      gap: 11px;
      min-width: 98px;
      animation: stickyWidgetB 0.85s cubic-bezier(.4,2,.42,1.14) 1;
      transition:opacity .23s;
      pointer-events:none;
      user-select: none;
      flex-direction: column;  /* WAŻNE: dla szufladki pod spodem */
    `;
    document.body.appendChild(place);
  }
  place.innerHTML = `
    <div id="main-visit-row" style="display:flex;align-items:center;gap:10px;">
      <img src="assets/visitors.svg" alt="Online" style="width:26px;height:26px;vertical-align:middle;margin-right:4px;filter:drop-shadow(0 0 8px #ffd400a0);">
      <span id="current-visitors" style="font-size:1.22em;">${fake}</span>
      <span style="font-weight:400;font-size:.93em;letter-spacing:.014em;margin-left:2px;">online now</span>
    </div>
    <div id="fake-download-activity" style="display:none"></div>
  `;

  setInterval(()=>{
    const n = fake + Math.floor(Math.random()*3) - 1;
    fake = Math.min(Math.max(n, min), max);
    document.getElementById("current-visitors").textContent = fake;
  }, 4500);

  // Animacja keyframes (fade-in, fly, bounce)
  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
  @keyframes stickyWidgetB {
    0%{transform:translateY(42px) scale(0.89); opacity:0}
    90%{transform:translateY(-6px) scale(1.05);}
    100%{transform:translateY(0) scale(1); opacity:1}
  }
  @keyframes trayIn {
    0% {opacity:0; transform:translateY(22px) scale(0.92);}
    60% {opacity:1; transform:translateY(-4px) scale(1.04);}
    100%{opacity:1; transform:translateY(0) scale(1);}
  }
  @keyframes trayOut {
    0%{opacity:1; transform:translateY(0) scale(1);}
    80%{opacity:.44;transform:translateY(11px) scale(0.98);}
    100%{opacity:0;transform:translateY(34px) scale(0.93);}
  }
  `;
  document.head.appendChild(styleSheet);

  // Dodanie randomowej szufladki downloadów
  function showDownloadTray() {
    const tray = document.getElementById('fake-download-activity');
    // Fake download count: losowo 8-37, losowy tekst
    const num = Math.floor(Math.random()*30) + 8;
    const times = ["minute", "two minutes", "last hour", "few minutes"];
    const label = times[Math.floor(Math.random()*times.length)];
    tray.innerHTML = `
      <div style="
        display:flex;
        align-items:center;
        gap:8px;
        margin:7px 0 0 0;
        padding:8px 16px 6px 11px;
        border-radius:13px 15px 22px 13px;
        background:#ff0000;
        color:#000000;
        font-size:1em;
        box-shadow:0 2px 14px #ffd4000d;
        border:1.5px solid #ffd400;
        font-family:'Montserrat','Arial',sans-serif;
        font-weight:700;
        opacity: 1;
        animation: trayIn 0.30s cubic-bezier(.21,1.3,.48,1.2) 1;
      ">
        <img src="assets/download.svg" style="width:18px;height:18px;filter:drop-shadow(0 0 2px #ffd40090)"/>
        <span>${num}</span>
        <span style="font-size:.93em;font-weight:500;margin-left:4px;letter-spacing:0.03em;">downloads / ${label}</span>
      </div>
    `;
    tray.style.display = "flex";
    // Ukryj po 2.7–5.5sek
    setTimeout(() => {
      tray.firstElementChild.style.animation = "trayOut 0.48s cubic-bezier(.38,1.2,.88,1.14) 1";
      setTimeout(()=>{ tray.style.display = "none"; }, 440);
    }, 2600 + Math.random()*2300);
  }

  // Powtarzacz: szufladka pojawia się co 16–36 sekund
  function repeatTray() {
    const t = 16000 + Math.random()*20000;
    setTimeout(()=>{
      showDownloadTray();
      repeatTray();
    }, t);
  }
  repeatTray();
})();