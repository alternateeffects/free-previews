// online-widget.js
(function() {
  const min = 82, max = 340;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;

  // Tworzymy widget jeśli jeszcze nie istnieje
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
    `;
    document.body.appendChild(place);
  }
  place.innerHTML = `
    <img src="assets/visitors.svg" alt="Online" style="width:26px;height:26px;vertical-align:middle;margin-right:4px;filter:drop-shadow(0 0 8px #ffd400a0);">
    <span id="current-visitors" style="font-size:1.22em;">${fake}</span>
    <span style="font-weight:400;font-size:.93em;letter-spacing:.014em;margin-left:2px;">online now</span>
  `;

  // animowany fake licznik
  setInterval(()=>{
    const n = fake + Math.floor(Math.random()*3) - 1;
    fake = Math.min(Math.max(n, min), max);
    document.getElementById("current-visitors").textContent = fake;
  }, 4500);

  // Keyframes (fade-in pojawienie)
  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
  @keyframes stickyWidgetB {
    0%{transform:translateY(42px) scale(0.89); opacity:0}
    90%{transform:translateY(-6px) scale(1.05);}
    100%{transform:translateY(0) scale(1); opacity:1}
  }
  `;
  document.head.appendChild(styleSheet);
})();