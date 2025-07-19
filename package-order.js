// KONFIGUROWALNE
const EMAILJS_PUBLIC_KEY     = 'pwBMPOn8UbZy3p36b';
const EMAILJS_PRIVATE_KEY    = ''; // Można zostawić puste
const EMAILJS_SERVICE_ID     = 'service_b3996lm';
const EMAILJS_TEMPLATE_ID    = 'template_l1ofebk';
const PRICE_PER_CLIP         = 0.5;

const PACK_KEY = 'ae_clip_pack';
const WIDGET_ID = 'ae_pkg_widget';

// Widoczny widget (samo SVG)
function createWidget() {
  if (document.getElementById(WIDGET_ID)) return;
  const widget = document.createElement('button');
  widget.id = WIDGET_ID;
  widget.style = `
    position: fixed; right: 24px; bottom: 24px; z-index: 11000;
    width: 80px; height: 80px; padding: 0;
    outline: none; border: none; background: none; box-shadow: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center
  `;
  widget.innerHTML = `
    <img src="assets/package.svg" alt="package" style="width:80px;height:80px;display:block"/>
    <span id="ae_pkg_count" style="position:absolute;top:7px;right:11px;background:#FF1A1A;color:#fff;font-size:21px;font-weight:bold;border-radius:100px;padding:2px 13px;min-width:26px;text-align:center;border:2px solid #fff;box-shadow:0 0 8px #0008;display:none;"></span>
    <span id="ae_pkg_sum" style="position:absolute;bottom:5px;left:12px;font-size:13px;color:#FF1A1A;font-weight:700;background:#181818dc;border-radius:8px;padding:3px 12px 2px 10px;border:0;box-shadow:0 0 8px #0009;display:none;border:1px solid #FF1A1A;">$0</span>
  `;
  widget.onclick = showModal;
  document.body.appendChild(widget);
  updateWidget();
}
function updateWidget() {
  const pack = getPack();
  const cnt = pack.length;
  const sum = (cnt * PRICE_PER_CLIP).toFixed(2);
  const elCount = document.getElementById('ae_pkg_count');
  const elSum = document.getElementById('ae_pkg_sum');
  if (elCount) { elCount.textContent = cnt; elCount.style.display = cnt ? "block" : "none"; }
  if (elSum) { elSum.textContent = `$${sum}`; elSum.style.display = cnt ? "block" : "none"; }
}
function animateWidget() {
  const widg = document.getElementById(WIDGET_ID);
  if (widg) { widg.style.transform = 'scale(1.13)'; setTimeout(() => { widg.style.transform = ''; }, 170); }
}

// Koszyk
function getPack() { return JSON.parse(localStorage.getItem(PACK_KEY) || "[]"); }
function setPack(arr) { localStorage.setItem(PACK_KEY, JSON.stringify(arr)); updateWidget(); }
function addToPack(obj) {
  let pack = getPack();
  if (!pack.find(x => x.title === obj.title)) { pack.push(obj); setPack(pack); }
  animateWidget();
}
function removeFromPack(title) {
  let pack = getPack();
  setPack(pack.filter(x => x.title !== title));
}
function clearPack() { setPack([]); }

// Modal
let aeModal = null;
function showModal() {
  if (aeModal) { aeModal.style.display = "flex"; renderModalBody(); return; }
  aeModal = document.createElement('div');
  aeModal.id = 'ae_pkg_modal';
  aeModal.style = `
    position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:99999;
    background:rgba(12,12,12,0.83);display:flex;align-items:center;justify-content:center;
  `;
  document.body.appendChild(aeModal);

  const cont = document.createElement('div');
  cont.style = `background:#181818; border-radius:22px; max-width:480px;width:83vw; min-width:320px;padding:0;overflow:hidden;box-shadow:0 8px 36px #000a; color:#fff;display:flex;flex-direction:column;`;
  aeModal.appendChild(cont);

  cont.innerHTML = `
    <div style="background:#FF1A1A;padding:23px 28px 18px 28px;display:flex;align-items:center;">
      <img src="assets/package.svg" style="height:32px;vertical-align:middle;margin-right:12px;">
      <span style="font-size:23px;letter-spacing:2px;font-weight:900;color:#181818;">Your Pack</span>
      <button type="button" id="ae_pkg_close" style="margin-left:auto;border:none;background:none;font-size:32px;line-height:1;color:#181818;font-weight:bold;cursor:pointer;padding:0 6px 0 20px;">×</button>
    </div>
    <div style="padding:0 25px 15px 25px;">
      <div style="border-bottom:0px solid #FF1A1A;margin-bottom:18px;"></div>
      <div id="ae_pkg_items" style="max-height:140px;overflow-y:auto;margin-bottom:14px;scrollbar-width:thin;scrollbar-color:#FF1A1A00 transparent;"></div>
      <div style="margin:23px 0 13px 0;border-top:2px solid #FF1A1A;"></div>
      <form id="ae_pkg_form" autocomplete="off" style="margin-bottom:0;margin-top:0;">
        <input required type="text" name="name" placeholder="Your name" style="width:90%;padding:12px 10px 12px 15px;margin-bottom:13px;border-radius:9px;border:2.5px solid #FF1A1A;font-size:16px;background:#222;color:#fff;outline:none;display:block;margin-left:auto;margin-right:auto;"/>
        <input required type="email" name="email" placeholder="Your email" style="width:90%;padding:12px 10px 12px 15px;margin-bottom:13px;border-radius:9px;border:2.5px solid #FF1A1A;font-size:16px;background:#222;color:#fff;outline:none;display:block;margin-left:auto;margin-right:auto;"/>
        <textarea name="notes" placeholder="Additional notes (optional)" style="width:89%;min-height:44px;padding:10px 16px;border-radius:9px;font-size:15px;background:#232323;color:#fff;border:2px solid #444;resize:vertical;outline:none;margin-bottom:13px;display:block;margin-left:auto;margin-right:auto;"></textarea>
        <div style="margin-bottom:16px;font-size:17px;text-align:right;">
          <strong style="color:#FF1A1A;">TOTAL: $<span id="ae_pkg_total">0.00</span></strong>
        </div>
        <button type="submit" style="font-size:18px;padding:13px 37px;border-radius:13px;background:#FF1A1A;color:#000000;font-weight:900;letter-spacing:1px;border:none;cursor:pointer;box-shadow:0 2px 8px #000a;margin-bottom:2px;margin-top:2px;transition:background .15s;">
          Send order
        </button>
        <div id="ae_pkg_msg" style="display:block;margin-top:15px;font-size:15px;min-height:21px;text-align:center;"></div>
      </form>
    </div>
    <div style="background:#FF1A1A;padding:11px 24px 9px 24px;text-align:center;font-size:13px;color:#181818;font-weight:700;">Alternate Effects — stock.alternateeffects.com</div>
  `;
  aeModal.querySelector('#ae_pkg_close').onclick = ()=>{aeModal.style.display="none";};
  aeModal.onclick = (e) => { if(e.target === aeModal) aeModal.style.display="none"; };
  renderModalBody();
}
function renderModalBody() {
  const pack = getPack();
  const itemsDiv = aeModal.querySelector('#ae_pkg_items');
  if (!pack.length) {
    itemsDiv.innerHTML = `<div style="text-align:center;color:#ffe400;font-size:18px;font-weight:700;padding:30px 8px 28px 8px;letter-spacing:1px;">
      Your pack is empty.<br><span style="font-size:16px;font-weight:500;color:#fff;">Select clips by clicking <span style="color:#ffe400;font-weight:900;">ADD TO PACK</span>.</span></div>`;
    aeModal.querySelector('#ae_pkg_total').textContent = "0.00";
    return;
  }
  let html = '';
  for(let clip of pack) {
    html += `
      <div style="display:flex;align-items:center;padding:11px 0 7px 0;border-bottom:1.3px solid #242424;">
        <img src="${clip.thumb}" alt="thumb" style="height:54px;width:auto;min-width:54px;border-radius:8px;background:#fff;margin-right:13px;">
        <div style="flex:1;min-width:0;overflow-wrap:break-word;color:#fff;font-size:16px;font-weight:700;">${clip.title}</div>
        <button type="button" class="ae_pkg_remove" data-title="${clip.title}" style="margin-left:12px;background:#FF1A1A;border:none;color:#000;border-radius:9px;width:32px;height:32px;font-size:20px;font-weight:900;cursor:pointer;box-shadow:0 0 5px #FF1A1A80;display:flex;align-items:center;justify-content:center;">–</button>
      </div>
    `;
  }
  itemsDiv.innerHTML = html;
  aeModal.querySelectorAll('.ae_pkg_remove').forEach(btn => {
    btn.onclick = function() {
      removeFromPack(this.dataset.title);
      renderModalBody();
      updateWidget();
    };
  });
  aeModal.querySelector('#ae_pkg_total').textContent = (pack.length * PRICE_PER_CLIP).toFixed(2);
}

// --- Add to pack logic dla HTML
export function addToPackJs(obj) {
  addToPack(obj);
}
window.addToPackJs = addToPackJs;

// --- Obsługa wysyłki przez FETCH
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

// --- Obsługa submit modala
document.addEventListener('submit', function(e) {
  if (e.target.id === 'ae_pkg_form') {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const notes = form.notes.value.trim();
    const pack = getPack();
    const msg = form.querySelector('#ae_pkg_msg');
    if (!name || !email || !pack.length) {
      msg.textContent = "Please fill all required fields and add at least one clip.";
      msg.style.color="#FF1A1A";
      return;
    }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = "Sending...";
    msg.textContent = "";
    sendOrderViaEmailJS({
      name: name,
      email: email,
      notes: notes,
      clips: pack
    }).then(() => {
      msg.style.color="#19d43a";
      msg.textContent = "Thank you! Your order has been sent. We'll contact you soon.";
      clearPack();
      renderModalBody();
      updateWidget();
      btn.disabled = false; btn.textContent = "Send order";
    }, ()=> {
      msg.style.color="#FF1A1A";
      msg.textContent = "Failed to send the order, please try again or email us directly.";
      btn.disabled = false; btn.textContent = "Send order";
    });
  }
}, false);

// --- Inicjalizacja widgetu
(function startPackWidget(){
  createWidget();
  setInterval(updateWidget, 1600);
})();