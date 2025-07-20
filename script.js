/****************************************************************
 * Pantheon - Pokémon Team Builder App Script
 * All logic for accent color, modal, team state, export & UI
 * Pure, modular, heavily documented
 ****************************************************************/

// --- GLOBALS ---
const kDefaultAccent = "#00f0ff";
const kTeamSize = 6;
const kStatNames = ["HP", "Attack", "Defense", "Sp. Attack", "Sp. Defense", "Speed"];
let teamState = Array(kTeamSize).fill(null); // Array of team slots, each is null or Pokémon entry object
let editingSlot = null; // Which slot is being edited (index)

// --- DOM ---
const teamGrid = document.getElementById("teamGrid");
const modal = document.getElementById("pokemonModal");
const modalClose = document.querySelector(".modal-close");
const modalSave = document.getElementById("modalSave");
const modalCancel = document.getElementById("modalCancel");
const accentPicker = document.getElementById("accentPicker");

// Save exported team as images
const exportNeoPasteBtn = document.getElementById("exportNeoPaste");
const exportPNGBtn = document.getElementById("exportPNG");
const exportTeamBtn = document.getElementById("exportTeam");

// --- Accent Color Logic ---
// On color pick, set accent var and store in localStorage
function setAccentColor(hex) {
  document.documentElement.style.setProperty("--accent", hex);
  try { localStorage.setItem("pantheon_accent", hex); } catch (e) {}
}
// On load, get accent or default
function restoreAccent() {
  let stored = null;
  try { stored = localStorage.getItem("pantheon_accent"); } catch (e) {}
  if (!stored) stored = kDefaultAccent;
  accentPicker.value = stored;
  setAccentColor(stored);
}
// On color input
accentPicker.addEventListener("input", e => {
  setAccentColor(e.target.value || kDefaultAccent);
});
restoreAccent();

// --- Team Grid Creation ---
function renderTeamGrid() {
  teamGrid.innerHTML = "";
  for (let i=0;i<kTeamSize;i++) {
    const slot = document.createElement("div");
    slot.className = "team-slot";
    slot.tabIndex = 0;
    slot.setAttribute("role", "button");
    slot.dataset.idx = i;
    if (!teamState[i]) {
      slot.innerHTML = `
        <div class="plus-icon">＋</div>
        <div class="slot-caption">Click to add Pokémon</div>
      `;
    } else {
      const pk = teamState[i];
      slot.innerHTML = `
        <img src="${pk.sprite || 'placeholder.png'}" class="slot-thumb" alt="Pokémon"/>
        <div class="slot-name">${escapeHTML(pk.name)}</div>
        <button class="slot-delete-btn" tabindex="0" aria-label="Remove Pokémon" style="background:none;border:none;color:#fff;position:absolute;top:12px;right:18px;font-size:1.3rem;cursor:pointer;">×</button>
      `;
    }
    // Slot open (edit/add)
    slot.addEventListener("click", slotOpenModal);
    slot.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") slotOpenModal.call(slot, e);
    });
    // Inline remove button
    slot.querySelector('.slot-delete-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      teamState[i] = null;
      renderTeamGrid();
    });
    teamGrid.appendChild(slot);
  }
}

// --- Modal Logic ---
function slotOpenModal(e) {
  editingSlot = parseInt(this.dataset.idx,10);
  const store = teamState[editingSlot];

  // Fill modal fields
  document.getElementById('pokeSprite').src = store?.sprite||'placeholder.png';
  document.getElementById('pokeName').value = store?.name||"";
  const moves = modal.querySelectorAll('.move-input');
  for (let j=0;j<4;j++) moves[j].value = store?.moves?.[j] || "";
  modal.querySelector('.item-input').value = store?.item || "";
  modal.querySelector('.ability-input').value = store?.ability || "";
  document.getElementById('natureSel').value = store?.nature||"Hardy";
  document.getElementById('modalNotes').value = store?.notes||"";
  // Stats and IV
  let stats = store?.stats || [50,50,50,50,50,50];
  let ivs = store?.ivs || [31,31,31,31,31,31];
  const stsec = modal.querySelector('.stats-section');
  stsec.innerHTML = "";
  for (let i=0;i<kStatNames.length;i++) {
    const row = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = `
      <span class="stat-label">${kStatNames[i]}</span>
      <input type="range" min="1" max="255" value="${stats[i]}" class="stat-slider" id="stat-${i}"/>
      <input type="number" min="0" max="31" value="${ivs[i]}" class="stat-iv" id="iv-${i}"/>
    `;
    // Range sync
    row.querySelector('.stat-slider').addEventListener('input', e => {
      stats[i] = parseInt(e.target.value,10);
    });
    row.querySelector('.stat-iv').addEventListener('input', e => {
      let v = parseInt(e.target.value,10);
      if (isNaN(v)) v=0; if (v<0) v=0;if (v>31) v=31;
      e.target.value = v; ivs[i] = v;
    });
    stsec.appendChild(row);
  }
  
  // Modal open
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function modalCloseFn() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}
modalClose.addEventListener("click", modalCloseFn);
modalCancel.addEventListener("click", modalCloseFn);
document.addEventListener("keydown", e => {
  if (modal.classList.contains("hidden")) return;
  if (e.key === "Escape") modalCloseFn();
});

// --- Modal Save ---
modalSave.addEventListener("click", function() {
  const name = document.getElementById('pokeName').value.trim();
  const moves = [...modal.querySelectorAll('.move-input')].map(x=>x.value.trim()).slice(0,4);
  const item = modal.querySelector('.item-input').value.trim();
  const ability = modal.querySelector('.ability-input').value.trim();
  const stats = [...modal.querySelectorAll('.stat-slider')].map(x=>parseInt(x.value,10));
  const ivs = [...modal.querySelectorAll('.stat-iv')].map(x=>parseInt(x.value,10));
  const notes = document.getElementById('modalNotes').value.trim();
  const nature = document.getElementById('natureSel').value;
  // Optional: sprite path
  let sprite = "placeholder.png";
  if (name) {
    sprite = getPokeSpriteURL(name);
  }
  teamState[editingSlot] = {
    name, moves, item, ability, stats, ivs, notes, nature, sprite
  };
  renderTeamGrid();
  modalCloseFn();
});

// --- Poké Sprite Finder ---
// Fetches a sprite URL, fallback if needed
function getPokeSpriteURL(name) {
  // Simple name to Dex string
  let n = (name||"").toLowerCase().trim().replace(/[^a-z0-9]/g,"-");
  return `https://img.pokemondb.net/sprites/home/normal/${n}.png`;
}

// --- Utility ---

function escapeHTML(str) {
  return (str||"").replace(/[&<>'"]/g,
    c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"\'":'&#39;','"':'&quot;'}[c]));
}

// --- Initial Render ---
renderTeamGrid();

// --- Export Functions ---
exportNeoPasteBtn.onclick = function() {
  alert('Export to NeoPaste not implemented – copy data from UI for now.');
}
exportPNGBtn.onclick = function() {
  alert('PNG export not available in this demo.\nUse screen capture for now.');
}
exportTeamBtn.onclick = function() {
  alert('Team export is premium-only for now.');
}

// --- Fallbacks, Placeholders ---
// If modal fails to open
modal.addEventListener('error',function() {
  alert('Modal failed! Try again or reload.');
});

// On sprite error, placeholder is used automatically

// --- Responsive: Resize modal if too large ---
window.addEventListener("resize", () => {
  if (!modal.classList.contains("hidden")) {
    const mc = modal.querySelector(".modal-content");
    mc.style.maxHeight = `${window.innerHeight-30}px`;
  }
});

/** End of Pantheon Script **/

