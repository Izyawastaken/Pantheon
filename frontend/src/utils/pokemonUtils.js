// Pokemon utility functions for advanced rendering

export const statNameMap = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SPA",
  "special-defense": "SPD",
  speed: "SPE"
};

export const natureMods = {
  lonely: { up: "atk", down: "def" },
  brave: { up: "atk", down: "spe" },
  adamant: { up: "atk", down: "spa" },
  naughty: { up: "atk", down: "spd" },
  bold: { up: "def", down: "atk" },
  relaxed: { up: "def", down: "spe" },
  impish: { up: "def", down: "spa" },
  lax: { up: "def", down: "spd" },
  timid: { up: "spe", down: "atk" },
  hasty: { up: "spe", down: "def" },
  jolly: { up: "spe", down: "spa" },
  naive: { up: "spe", down: "spd" },
  modest: { up: "spa", down: "atk" },
  mild: { up: "spa", down: "def" },
  quiet: { up: "spa", down: "spe" },
  rash: { up: "spa", down: "spd" },
  calm: { up: "spd", down: "atk" },
  gentle: { up: "spd", down: "def" },
  sassy: { up: "spd", down: "spe" },
  careful: { up: "spd", down: "spa" },
  hardy: {},
  docile: {},
  serious: {},
  bashful: {},
  quirky: {}
};

export const pokeapiNameMap = {
  "nidoran-f": "nidoran-f",
  "nidoran-m": "nidoran-m",
  "mr-mime": "mr-mime",
  "mime-jr": "mime-jr",
  "farfetchd": "farfetchd",
  "ho-oh": "ho-oh",
  "porygon-z": "porygon-z",
  "jangmo-o": "jangmo-o",
  "hakamo-o": "hakamo-o",
  "kommo-o": "kommo-o",
  "tapu-koko": "tapu-koko",
  "tapu-lele": "tapu-lele",
  "tapu-bulu": "tapu-bulu",
  "tapu-fini": "tapu-fini",
  "type-null": "type-null",
  "sirfetchd": "sirfetchd",
  "mr-rime": "mr-rime"
};

export function toSpriteId(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/nidoran♀/g, 'nidoranf')
    .replace(/nidoran♂/g, 'nidoranm')
    .replace(/farfetch'd/g, 'farfetchd')
    .replace(/sirfetch'd/g, 'sirfetchd');
}

export function sanitizeType(type) {
  return type.toLowerCase().replace(/[^a-z]/g, '');
}

export function getIVColor(percent) {
  const r = percent < 0.5 ? 255 : Math.round(510 * (1 - percent));
  const g = percent < 0.5 ? Math.round(510 * percent) : 255;
  return `rgb(${r}, ${g}, 100)`;
}

export function formatEVs(evs = {}) {
  return Object.entries(evs)
    .filter(([_, v]) => v > 0)
    .map(([k, v]) => {
      const shortKey = k.toLowerCase();
      const short = statNameMap[k] || shortKey.toUpperCase();
      const cssKey = short.toLowerCase();
      return `<span class="info-pill stat-${cssKey}">${v} ${short}</span>`;
    })
    .join(" ");
}

export function formatIVs(ivs = {}) {
  const output = Object.entries(ivs)
    .filter(([_, v]) => v < 31)
    .map(([k, v]) => `<span class="info-pill" style="background-color:${getIVColor(v / 31)};">${v} ${k.toUpperCase()}</span>`);
  return output.length ? output.join(" ") : `<span class="info-pill" style="background-color:${getIVColor(1)};">Default (31)</span>`;
}

export async function renderStatBlock(pokemon) {
  const mods = natureMods[(pokemon.nature || "").toLowerCase()] || {};
  try {
    const mappedKey = toSpriteId(pokemon.name);
    const mappedName = pokeapiNameMap[mappedKey] || mappedKey;

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${mappedName}`);
    const data = await res.json();

    return `
      <div class="stat-block">
        ${data.stats.map(s => {
          const raw = s.stat.name;
          const short = statNameMap[raw] || raw.toUpperCase();
          const base = s.base_stat;
          const k = short.toLowerCase();
          const mod = k === mods.up ? "+" : k === mods.down ? "−" : "";
          return `
            <div class="stat-line">
              <span class="stat-label ${k}">${short}</span>
              <div class="stat-bar"><div class="stat-bar-fill" data-base="${base}"></div></div>
              ${mod ? `<span class="stat-modifier ${mod === "+" ? "plus" : "minus"}">${mod}</span>` : ""}
              <span class="stat-value"
                data-base="${base}"
                data-stat="${k}"
                data-ev="${pokemon.evs[k] ?? 0}"
                data-iv="${pokemon.ivs[k] ?? 31}">
                ${base}
              </span>
            </div>`;
        }).join("")}
      </div>
    `;
  } catch {
    return `<p>Failed to load stats for ${pokemon.name}</p>`;
  }
}

export async function renderMovePills(moves) {
  return (await Promise.all(moves.map(async move => {
    if (!move) return '';
    const id = move.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/move/${id}`);
      const { type } = await res.json();
      return `<span class="move-pill type-${type.name.toLowerCase()}">${move.replace(/-/g, ' ')}</span>`;
    } catch {
      return `<span class="move-pill type-normal">${move}</span>`;
    }
  }))).join("");
}

export function animateStatBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll(".stat-bar-fill").forEach(bar => {
      const base = +bar.dataset.base;
      bar.style.width = `${Math.min(100, base / 255 * 100)}%`;
      bar.style.backgroundColor =
        base >= 130 ? "#00e676" :
        base >= 100 ? "#ffee58" :
        base >= 70 ? "#ffa726" : "#ef5350";
    });
  });
}

export function getSpriteUrl(pokemon) {
  const showdownName = toSpriteId(pokemon.name);
  let originalSpriteUrl;
  
  if (pokemon.shiny) {
    originalSpriteUrl = `https://play.pokemonshowdown.com/sprites/gen5-shiny/${showdownName}.png`;
  } else {
    originalSpriteUrl = `https://play.pokemonshowdown.com/sprites/gen5/${showdownName}.png`;
  }
  
  return `https://neopasteexportpngproxy.agastyawastaken.workers.dev/?url=${encodeURIComponent(originalSpriteUrl)}`;
}