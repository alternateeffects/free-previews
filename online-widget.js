// online-widget.js
(function() {
  const min = 8, max = 34;
  let fake = Math.floor(Math.random() * (max - min + 1)) + min;

  // Stwórz kontener if needed
  let place = document.getElementById('visitors-widget');
  if (!place) {
    place = document.createElement('div');
    place.id = "visitors-widget";
    // Floating sticky style – LEWY dół!
    place.style.cssText = `
      position:fixed;
      left:18px; bottom:22px;
      z-index:3000;
      background:rgba(10,10,10,0.93);
      padding:13px 22px 12px 23px;
      color:#ffe400;
      font-weight: 800;
      font-size: 1.13em;
      letter-spacing: .035em;
      border-radius: 15px 18px 22px 18px;
      border:2.6px solid #ffdc00;
      box-shadow:0 4px 26px #1119;
      display:flex;
      align-items: center;
      gap: 10px;
      min-width: 98px;
      animation: stickyWidgetB 0.85s cubic-bezier(.4,2,.42,1.14) 1;
    `;
    document.body.appendChild(place);
  }
  place.innerHTML = `
    <span style="font-size:1.33em;filter:drop-shadow(0 0 7px #ffe40092);margin-right:2px;">👥</span>
    <span id="current-visitors">${fake}</span>
    <span style="font-weight:400;font-size:.93em;letter-spacing:.012em;margin-left:1px;">online now</span>
  `;

  // animowany fake licznik
  setInterval(()=>{
    const n = fake + Math.floor(Math.random()*3) - 1;
    fake = Math.min(Math.max(n, min), max);
    document.getElementById("current-visitors").textContent = fake;
  }, 4500);

  // (Optional: add fade-in keyframes)
  var styleSheet = document.createElement("style");
  styleSheet.innerText = `
  @keyframes stickyWidgetB {
    0%{transform:translateY(42px) scale(0.86); opacity:0}
    96%{transform:translateY(-9px) scale(1.07);}
    100%{transform:translateY(0) scale(1); opacity:1}
  }
  `;
  document.head.appendChild(styleSheet);
})();