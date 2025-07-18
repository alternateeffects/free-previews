export function injectCompareSection() {
  const html = `
    <section id="compare-section" style="max-width:740px;margin:0 auto;">
      <button id="cmp-expand"
        style="margin:30px auto 0 auto;display:block;background:#ffe400;color:#212121;font-weight:bold;padding:12px 40px;border-radius:28px;border:0;font-size:1.25em;cursor:pointer;box-shadow:0 2px 14px #0003">
        See the difference — HD vs 4K
      </button>
      <div id="cmp-wrap" style="display:none;margin-top:40px;">
        <div style="position:relative;width:640px;max-width:96vw;height:360px;margin:0 auto;margin-bottom:13px;
            background:#000;border-radius:22px;box-shadow:0 2px 20px #000a;border:4px solid #ffe400;overflow:hidden;">
          <video id="cmp4k" src="compare/4K 60FPS WATERMARK.mp4" width="640" height="360" autoplay muted loop playsinline></video>
          <div id="cmpHdClip" style="position:absolute;top:0;left:0;width:50%;height:100%;overflow:hidden;pointer-events:none;">
            <video id="cmpHd" src="compare/HD 24 FPS WATERMARK.mp4" width="640" height="360" autoplay muted loop playsinline></video>
          </div>
          <div id="cmp-slider-line" style="position:absolute;top:0;bottom:0;width:6px;left:320px;background:#ffe400;box-shadow:0 0 11px #ffe40080,0 0 2px #000a;z-index:20;transition:box-shadow .2s;border-radius:20px;cursor:ew-resize;"></div>
          <div id="cmp-slider-handle"
            style="position:absolute;left:307px;top:50%;margin-top:-22px;width:58px;height:44px;background:#19191ecc;border-radius:12px;z-index:21;box-shadow:0 0 10px #ffe40070,0 2px 10px #0005;display:flex;align-items:center;justify-content:center;cursor:ew-resize;transition:box-shadow .23s;border:2.5px solid #ffe400;">
            <img src="assets/dragicon.svg" alt="Drag to compare" draggable="false" style="width:54px;height:34px;display:block;pointer-events:none;">
          </div>
          <div style="position:absolute;left:18px;top:18px;background:rgba(44,44,44,0.87);color:#fff;padding:5px 18px;border-radius:10px;font-size:15px;letter-spacing:0.02em;">Preview HD 24FPS</div>
          <div style="position:absolute;right:18px;top:18px;background:rgba(44,44,44,0.87);color:#fff;padding:5px 18px;border-radius:10px;font-size:15px;letter-spacing:0.02em;">Ultra 4K 60FPS</div>
        </div>
        <div style="text-align:center;margin-bottom:15px;font-size:16px;color:#ffc800;">Drag the handle left or right to compare!</div>
      </div>
    </section>
  `;
  const target = document.querySelector('.hero');
  target.insertAdjacentHTML('afterend', html);

  // Toggle (expand/collapse)
  let opened = false;
  const expandBtn = document.getElementById('cmp-expand');
  const cmpWrap = document.getElementById('cmp-wrap');
  expandBtn.onclick = function () {
    if (!opened) {
      cmpWrap.style.display = '';
      expandBtn.textContent = "Hide HD vs 4K comparison";
      opened = true;
      requestAnimationFrame(() => setSlider(curPercent));
    } else {
      cmpWrap.style.display = 'none';
      expandBtn.textContent = "See the difference — HD vs 4K";
      opened = false;
    }
  };

  // Slider
  const cmpHdClip = document.getElementById('cmpHdClip');
  const cmpSlider = document.getElementById('cmp-slider-line');
  const cmpHandle = document.getElementById('cmp-slider-handle');
  const cmp4k = document.getElementById('cmp4k');
  const cmpHd = document.getElementById('cmpHd');

  let curPercent = 50;

  function setSlider(p) {
    p = Math.max(0, Math.min(100, p));
    const wrapDiv = cmpHdClip.parentElement;
    const videoW = wrapDiv.clientWidth;
    cmpHdClip.style.width = p + "%";
    let leftPx = (videoW * (p / 100));
    cmpSlider.style.left = leftPx + "px";
    cmpHandle.style.left = (leftPx - cmpHandle.offsetWidth / 2 + cmpSlider.offsetWidth / 2) + "px";
    curPercent = p;
  }
  requestAnimationFrame(() => setSlider(50));

  // Drag/touch events
  let dragging = false;

  // Najlepiej: trzyma tylko kiedy przycisk myszki jest faktycznie wciśnięty!
  cmpHandle.onmousedown = function(e) {
    if (e.button !== 0) return;
    dragging = true;
    document.body.style.userSelect = "none";
    e.preventDefault(); // zapobiega drag&drop obrazka
  };

  window.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    if (e.buttons !== 1) {
      dragging = false;
      document.body.style.userSelect = "";
      return;
    }
    let rect = cmpHdClip.parentElement.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let percent = (x / rect.width) * 100;
    setSlider(percent);
  });

  window.addEventListener('mouseup', function(e) {
    if (dragging) {
      dragging = false;
      document.body.style.userSelect = "";
    }
  });

  // Touch
  cmpHandle.ontouchstart = function (e) { dragging = true; e.preventDefault(); };
  window.addEventListener('touchmove', function (e) {
    if (!dragging) return;
    let touch = e.touches[0];
    let rect = cmpHdClip.parentElement.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let percent = (x / rect.width) * 100;
    setSlider(percent);
  });
  window.addEventListener('touchend', function () { dragging = false; });

  // Synchronize looping
  function syncTimes() {
    if (Math.abs(cmp4k.currentTime - cmpHd.currentTime) > 0.13) {
      cmpHd.currentTime = cmp4k.currentTime;
    }
  }
  setInterval(syncTimes, 340);

  cmp4k.addEventListener('ended', () => {
    setTimeout(() => { if (cmpHd.currentTime > 0.3) cmpHd.currentTime = 0; }, 60);
    cmpHd.play();
  });
  cmpHd.addEventListener('ended', () => {
    setTimeout(() => { if (cmp4k.currentTime > 0.3) cmp4k.currentTime = 0; }, 60);
    cmp4k.play();
  });
}