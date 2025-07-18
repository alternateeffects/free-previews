// compare-clip.js
export function injectCompareSection() {
  const html = `
  <section class="compare-section" style="margin:60px auto 0 auto;max-width:740px;">
    <h2 style="text-align:center; color:#ffe400;">Porównaj jakość — HD vs Ultra 4K</h2>
    <div style="position:relative;width:640px;max-width:93vw;height:360px;margin:40px auto 8px;background:#000;">
      <video id="vid4k" src="compare/4K 60FPS WATERMARK.mp4" width="640" height="360" autoplay muted loop playsinline></video>
      <div class="clip-top" id="clipHd" style="position:absolute;top:0;left:0;width:50%;height:100%;overflow:hidden;pointer-events:none;">
        <video id="vidHd" src="compare/HD 24 FPS WATERMARK.mp4" width="640" height="360" autoplay muted loop playsinline></video>
      </div>
      <div style="position:absolute;top:0;bottom:0;width:4px;left:320px;background:#ffe400;border-radius:3px;" id="sliderLine"></div>
      <div style="position:absolute;left:12px;top:12px;background:rgba(40,40,40,0.85);color:#fff;padding:4px 14px;border-radius:6px;font-size:14px;">HD 24FPS (preview, watermark)</div>
      <div style="position:absolute;right:12px;top:12px;background:rgba(40,40,40,0.85);color:#fff;padding:4px 14px;border-radius:6px;font-size:14px;">4K 60FPS (ultra, watermark)</div>
    </div>
    <input type="range" min="0" max="100" value="50" id="sliderCompare" style="width:100%">
    <p style="text-align:center;color:#bbb;font-size:15px">Przesuń suwak, żeby porównać wersje.</p>
  </section>
  `;
  const target = document.querySelector('.hero');
  target.insertAdjacentHTML('afterend', html);

  // === kod suwaka i synchronizacji ===
  const slider = document.getElementById('sliderCompare');
  const clipHd = document.getElementById('clipHd');
  const sliderLine = document.getElementById('sliderLine');
  slider.oninput = function() {
    let percent = this.value;
    clipHd.style.width = percent + "%";
    sliderLine.style.left = (6.4 * percent) + "px";
  };
  const vid4k = document.getElementById('vid4k');
  const vidHd = document.getElementById('vidHd');
  vid4k.addEventListener('play', () => { vidHd.play(); });
  vid4k.addEventListener('pause', () => { vidHd.pause(); });
  vidHd.addEventListener('play', () => { vid4k.play(); });
  vidHd.addEventListener('pause', () => { vid4k.pause(); });
  setInterval(() => {
    if (Math.abs(vid4k.currentTime - vidHd.currentTime) > 0.2) {
      vidHd.currentTime = vid4k.currentTime;
    }
  }, 600);
}