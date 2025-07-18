// === KONFIGUROWALNE DANE ===
const EMAILJS_PUBLIC_KEY     = 'pwBMPOn8UbZy3p36b';      // <-- Twój publiczny klucz
const EMAILJS_PRIVATE_KEY    = '';                     // <-- (opcjonalnie) Private key / accessToken
const EMAILJS_SERVICE_ID     = 'service_b3996lm';      // <-- Service ID
const EMAILJS_TEMPLATE_ID    = 'template_l1ofebk';     // <-- Template ID
const PRICE_PER_CLIP         = 0.5;                    // cena jednego klipu

// localStorage
const PACK_KEY = 'ae_clip_pack';

// 1. Render przycisków Add to Pack
function addPackButtons() {
  setTimeout(() => {
    document.querySelectorAll('.clip-card').forEach((card, i) => {
      let btnPack = card.querySelector('.ae-add-pack-btn');
      if (!btnPack) {
        const clip = window.allClipsData?.[i];
        const thumbJpg = `thumbs-watermarked/${clip.title}.jpg`;
        let btn = document.createElement('button');
        btn.innerHTML = `<svg style="vertical-align:middle;fill:#FF1A1A;" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#FF1A1A"/><text x="7.6" y="12" text-anchor="middle" font-size="15" font-family="Bebas Neue,Arial" fill="#181818" font-weight="900">+</text></svg>
        <span style="font-weight:bold;">add to pack</span>`;
        btn.className = 'ae-add-pack-btn';
        btn.style = `position:absolute;top:8px;right:8px;z-index:3;display:flex;align-items:center;gap:3px;font-family:Montserrat,sans-serif;font-size:13px;background:#ffe400;border:none;padding:2px 10px 2px 5px;border-radius:16px;box-shadow:0 0 4px #0003;cursor:pointer;`;
        btn.onclick = (e) => {
          e.stopPropagation();
          addToPack({
            title: clip.title,
            thumb: thumbJpg
          });
        };
        card.style.position = 'relative';
        card.appendChild(btn);
      }
    });
  }, 800);
}

// Paczka w localStorage
function getPack() { return JSON.parse(localStorage.getItem(PACK_KEY) || '[]'); }
function setPack(arr) { localStorage.setItem(PACK_KEY, JSON.stringify(arr)); updateWidget();}
function addToPack(clipObj) {
  let pack = getPack();
  if (!pack.find(c => c.title === clipObj.title)) {
    pack.push(clipObj);
    setPack(pack);
  }
  animateWidget();
}
function removeFromPack(title) {
  let pack = getPack();
  setPack(pack.filter(c => c.title !== title));
}
function clearPack() { setPack([]); }

// Widget
function createWidget() {
  const widget = document.createElement('div');
  widget.id = 'ae-pack-widget';
  widget.style = `
    position: fixed; right: 32px; bottom: 32px; 
    z-index: 11000; width: 64px; height: 64px;
    border-radius: 24px; background: #181818; 
    border: 3px solid #ffe400; box-shadow: 0 3px 16px #0008;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition:box-shadow .18s;
  `;
  widget.innerHTML = `
    <img src="assets/package.svg" alt="package" style="width:38px;height:38px;">
    <span id="ae-pack-count" style="position:absolute;top:6px;right:8px;background:#FF1A1A;color:#fff;font-size:16px;border-radius:100px;padding:2px 9px;min-width:22px;text-align:center;box-shadow:0 0 4px #0008;border:2px solid #fff;font-weight:900;display:none;"></span>
    <div id="ae-pack-price" style="position:absolute;bottom:7px;left:9px;font-size:14px;color:#ffe400;font-weight:600;background:rgba(24,24,24,.88);border-radius:9px;padding:2px 9px;box-shadow:0 2px 6px #0004;display:none;">$0.00</div>
  `;
  widget.onclick = showModal;
  document.body.appendChild(widget);
  updateWidget();
}
function updateWidget() {
  const pack = getPack();
  const count = pack.length;
  let sum = (count * PRICE_PER_CLIP).toFixed(2);
  const elCount = document.getElementById('ae-pack-count');
  const elPrice = document.getElementById('ae-pack-price');
  if (elCount) {
    elCount.textContent = count;
    elCount.style.display = count ? "block" : "none";
  }
  if (elPrice) {
    elPrice.textContent = `$${sum}`;
    elPrice.style.display = count ? "block" : "none";
  }
}
function animateWidget() {
  const widget = document.getElementById('ae-pack-widget');
  if (!widget) return;
  widget.style.transform = 'scale(1.12)';
  setTimeout(()=>{ widget.style.transform = ''; }, 180);
}

// Modal
let aeModal = null;
function showModal() {
  if (aeModal) {
    aeModal.style.display = "flex"; return;
  }
  aeModal = document.createElement('div');
  aeModal.id = 'ae-pack-modal';
  aeModal.style = `
    position:fixed; left:0; top:0; width:100vw; height:100vh; z-index:12000; background:rgba(12,12,12,0.79); display:flex; align-items:center; justify-content:center;
  `;
  const cont = document.createElement('div');
  cont.style = `
    background:#181818; border-radius:18px; max-width:485px; width:95vw; padding:2px 24px 28px 24px; position:relative; box-shadow:0 0 36px #000c; color:#fff; overflow-x:hidden;
  `;
  cont.innerHTML = `
    <div style="padding:18px 0 6px 0; display:flex; justify-content:space-between; align-items:center;">
      <span style="letter-spacing:2px;font-size:20px;font-weight:900;color:#ffe400;">
        <img src="assets/package.svg" alt="" style="height:28px;vertical-align:middle;transform:translateY(-3px);margin-right:9px;">Your Pack
      </span>
      <button type="button" id="ae-pack-close" style="border:none;background:none;font-size:34px;line-height:1;color:#ffe400;cursor:pointer;padding:0 3px 0 13px;">×</button>
    </div>
    <div style="border-bottom:2px solid #ffe400;margin-bottom:15px;"></div>
    <div id="ae-pack-items"></div>
    <div style="margin:22px 0 12px 0;border-top:2px solid #333;"></div>
    <form id="ae-pack-form" autocomplete="off">
      <div style="margin:13px 0;">
        <input required type="text" name="name" placeholder="Your name" style="width:100%;padding:11px 12px 11px 18px;border-radius:9px;border:none;font-size:16px;background:#fff;color:#191919;margin-bottom:8px;outline:2px solid #ffe400;"/>
        <input required type="email" name="email" placeholder="Your email" style="width:100%;padding:11px 12px 11px 18px;border-radius:9px;border:none;font-size:16px;background:#fff;color:#191919;outline:2px solid #ffe400;"/>
      </div>
      <div style="margin-bottom:14px;">
        <textarea name="notes" placeholder="Additional notes (optional)" style="width:100%;min-height:44px;padding:8px 12px;border-radius:8px;font-size:15px;background:#232323;color:#fff;border:none;resize:vertical;outline:2px solid #333;"></textarea>
      </div>
      <div style="margin-bottom:17px;font-size:17px;text-align:right;"><strong style="color:#ffe400;">TOTAL: $<span id="ae-pack-modal-total">0.00</span></strong></div>
      <button type="submit" style="font-size:18px;padding:12px 34px;border-radius:14px;background:#ffe400;color:#191919;font-weight:900;letter-spacing:1px;border:none;cursor:pointer;box-shadow:0 1.5px 4px #000a;">Send order</button>
      <span id="ae-pack-modal-msg" style="display:block;margin-top:17px;font-size:15px;color:#e6362b;"></span>
    </form>
  `;
  aeModal.appendChild(cont);
  document.body.appendChild(aeModal);
  cont.querySelector("#ae-pack-close").onclick = function() {
    aeModal.style.display = "none";
  };
  aeModal.onclick = function(e) {
    if (e.target === aeModal) aeModal.style.display = "none";
  };
  renderPackModal();
}
function renderPackModal() {
  const pack = getPack();
  const itemsCont = document.getElementById('ae-pack-items');
  if (!itemsCont) return;
  if (!pack.length) {
    itemsCont.innerHTML = `<div style="text-align:center;color:#bbb;padding:44px;">Your pack is empty. Select clips by clicking <span style="color:#ffe400;font-weight:900;">ADD TO PACK</span>.</div>`;
    document.getElementById('ae-pack-modal-total').textContent = '0.00';
    return;
  }
  let html = '';
  for (let clip of pack) {
    html += `
      <div style="display:flex;align-items:center;padding:7px 0 7px 0;border-bottom:1.5px solid #222;">
        <img src="${clip.thumb}" alt="thumb" style="height:54px;width:auto;border-radius:8px;background:#111;margin-right:13px;">
        <div style="flex:1;min-width:0;overflow-wrap:break-word;">${clip.title}</div>
        <button type="button" class="ae-pack-remove" data-title="${clip.title}" style="margin-left:12px;background:#FF1A1A;border:none;color:#fff;border-radius:12px;width:32px;height:32px;font-size:21px;font-weight:900;cursor:pointer;box-shadow:0 0 5px #FF1A1A80;">–</button>
      </div>
    `;
  }
  itemsCont.innerHTML = html;
  document.querySelectorAll('.ae-pack-remove').forEach(btn => {
    btn.onclick = function() {
      removeFromPack(this.dataset.title);
      renderPackModal();
    };
  });
  document.getElementById('ae-pack-modal-total').textContent = (pack.length * PRICE_PER_CLIP).toFixed(2);
}

// Wysyłka przez modern API EmailJS
function sendOrderViaEmailJS({name, email, notes, clips}) {
  const params = {
    name: name,
    email: email,
    notes: notes,
    clips: "<ul>"+clips.map(c=>`<li>${c.title}</li>`).join('')+"</ul>",
    each_clips: clips.map(c=>c.title)
  };
  const body = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: params
  };
  if (EMAILJS_PRIVATE_KEY) {
    body.accessToken = EMAILJS_PRIVATE_KEY;
  }
  return fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  }).then(res => {
    if (!res.ok) throw new Error("EmailJS: send failed " + res.status);
    return res.text();
  });
}

// Submit formularza
document.addEventListener('submit', function(e) {
  if (e.target.id === 'ae-pack-form') {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const notes = form.notes.value.trim();
    const pack = getPack();
    if (!name || !email || !pack.length) return;
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = "Sending...";
    const msg = form.querySelector('#ae-pack-modal-msg');
    msg.textContent = "";
    sendOrderViaEmailJS({
      name: name,
      email: email,
      notes: notes,
      clips: pack
    }).then(function() {
      msg.style.color="#19d43a";
      msg.textContent = "Thank you! Your order has been sent. We'll contact you soon.";
      clearPack();
      renderPackModal();
      btn.disabled = false;
      btn.textContent = "Send order";
    }, function() {
      msg.style.color="#e6362b";
      msg.textContent = "Failed to send the order, please try again or email us directly.";
      btn.disabled = false;
      btn.textContent = "Send order";
    });
  }
}, false);

(function startPackWidget(){
  createWidget();
  setInterval(addPackButtons, 1600);
})();
