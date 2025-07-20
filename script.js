document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const SUPABASE_URL = 'https://pywievpwcedaareqkuxm.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5d2lldnB3Y2VkYWFyZXFrdXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMTA5MjMsImV4cCI6MjA2Nzg4NjkyM30.wHvcWCjkejn811z_ELF-9zvoR8_UjIYJd2e57A8QBIs';
    const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/';
    const NEOPASTE_VIEW_URL = 'https://neothon.neotw.com/view.html';

    // --- DOM ELEMENT REFERENCES ---
    const teamGrid = document.querySelector('.team-grid');
    const editorModal = document.getElementById('editor-modal');
    const spotlightModal = document.getElementById('spotlight-modal');
    const hoverSound = document.getElementById('hover-sound');
    const clickSound = document.getElementById('click-sound');

    // --- APPLICATION STATE ---
    let team = Array(6).fill(null);
    let pokemonSpeciesList = [];
    let itemList = [];
    let currentlyEditingSlot = -1;
    let pokemonInEditor = null;
    let animatedSprites = true; // Default to animated sprites
    const natureList = [
        'Adamant', 'Bashful', 'Bold', 'Brave', 'Calm', 'Careful', 'Docile', 'Gentle', 
        'Hardy', 'Hasty', 'Impish', 'Jolly', 'Lax', 'Lonely', 'Mild', 'Modest', 
        'Naive', 'Naughty', 'Quiet', 'Quirky', 'Rash', 'Relaxed', 'Sassy', 'Serious', 'Timid'
    ];
    const defaultPokemonScaffold = {
        species: '', nickname: '', item: '', ability: '', teraType: 'Normal', nature: 'Serious', shiny: false,
        abilities: [],
        stats: [
            { stat: { name: 'hp' }, base_stat: 1 }, { stat: { name: 'attack' }, base_stat: 1 },
            { stat: { name: 'defense' }, base_stat: 1 }, { stat: { name: 'special-attack' }, base_stat: 1 },
            { stat: { name: 'special-defense' }, base_stat: 1 }, { stat: { name: 'speed' }, base_stat: 1 },
        ],
        evs: { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 },
        ivs: { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 31 },
        moves: [],
    };
    const natureMods = {
        adamant: { up: "attack", down: "special-attack" },
        modest: { up: "special-attack", down: "attack" },
        timid: { up: "speed", down: "attack" },
        jolly: { up: "speed", down: "special-attack" },
        bold: { up: "defense", down: "attack" },
        calm: { up: "special-defense", down: "attack" },
        careful: { up: "special-defense", down: "special-attack" },
        impish: { up: "defense", down: "special-attack" },
    };

    // --- UTILITY FUNCTIONS ---
    function playHoverSound() {
        if (hoverSound) {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(() => {});
        }
    }
    
    function playClickSound() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        }
    }

    function toSpriteId(name) {
        if (!name) return '';
        return name.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9-]/g, "");
    }

    function getSpriteUrl(speciesName, shiny = false) {
        if (!speciesName) return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        const showdownName = toSpriteId(speciesName);
        
        const staticSrc = `https://play.pokemonshowdown.com/sprites/gen5${shiny ? "-shiny" : ""}/${showdownName}.png`;

        if (animatedSprites) {
            const gen5AniSrc = `https://play.pokemonshowdown.com/sprites/gen5ani-shiny/${showdownName}.gif`;
            const fallbackAniSrc = `https://play.pokemonshowdown.com/sprites/ani-shiny/${showdownName}.gif`;

            // We'll return the animated one and handle fallbacks via the `onerror` attribute on the img tag itself
            // For simplicity in this function, we just return the preferred animated URL
            return `https://neopasteexportpngproxy.agastyawastaken.workers.dev/?url=${encodeURIComponent(gen5AniSrc)}`;
        }

        return `https://neopasteexportpngproxy.agastyawastaken.workers.dev/?url=${encodeURIComponent(staticSrc)}`;
    }

    // --- INITIALIZATION ---
    function initialize() {
        const { createClient } = supabase;
        window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        loadStateFromLocalStorage();
        renderTeamGrid();
        fetchPokemonSpecies();
        fetchItems();
        setupEventListeners();
    }

    // --- STATE MANAGEMENT ---
    function loadStateFromLocalStorage() {
        const savedTeam = localStorage.getItem('pantheonTeam');
        team = savedTeam ? JSON.parse(savedTeam) : Array(6).fill(null);
    }

    function saveStateToLocalStorage() {
        localStorage.setItem('pantheonTeam', JSON.stringify(team));
        const accentColor = document.documentElement.style.getPropertyValue('--accent');
        if (accentColor) {
            localStorage.setItem('pantheon-accent', accentColor);
        }
    }

    // --- RENDERING ---
    function renderTeamGrid() {
        if (!teamGrid) return;
        teamGrid.innerHTML = '';
        team.forEach((pokemon, index) => {
            const card = document.createElement('div');
            card.classList.add('pokemon-card');
            card.dataset.index = index;
            if (pokemon) {
                card.innerHTML = createFullCardHtml(pokemon);
                card.draggable = true;
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-pokemon-btn';
                deleteBtn.innerHTML = '&times;';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    team[index] = null;
                    saveStateToLocalStorage();
                    renderTeamGrid();
                };
                card.appendChild(deleteBtn);
            } else {
                card.classList.add('empty');
                card.textContent = '+';
            }
            teamGrid.appendChild(card);
        });
        animateStatBars();
    }

    function createFullCardHtml(pokemon) {
        if (!pokemon) return '';
        const { species, nickname, item, ability, teraType, nature, evs, ivs, moves, stats, shiny } = pokemon;

        const teraTypeClass = teraType ? `type-${teraType.toLowerCase()}` : "";
        const natureClass = nature ? `nature-${nature.toLowerCase()}` : "";
        const finalSpriteUrl = getSpriteUrl(species, shiny);

        return `
            <div class="card-header">
                <h2>${nickname ? `${nickname} (${species})` : species}</h2>
                <p class="item-line">@ <span>${item || "None"}</span></p>
            </div>
            <img src="${finalSpriteUrl}" alt="${species}" crossorigin="anonymous" />

            <p><strong>Ability:</strong> <span class="info-pill ability-pill">${ability || "—"}</span></p>
            <p><strong>Tera Type:</strong> <span class="info-pill ${teraTypeClass}">${teraType || "—"}</span></p>
            <p><strong>Nature:</strong> <span class="info-pill nature-pill ${natureClass}">${nature || "—"}</span></p>
            <p><strong>EVs:</strong> ${formatEVs(evs)}</p>
            <p><strong>IVs:</strong> ${formatIVs(ivs)}</p>
            ${renderStatBlock(stats, nature)}
            <div class="moves">
                <strong>Moves:</strong>
                <div class="move-pill-container">${renderMovePills(moves, pokemon.moveDetails)}</div>
            </div>
        `;
    }
    
    function formatEVs(evs = {}) {
        const statNameMap = { hp: "HP", attack: "Atk", defense: "Def", "special-attack": "SpA", "special-defense": "SpD", speed: "Spe" };
        return Object.entries(evs)
            .filter(([, value]) => value > 0)
            .map(([key, value]) => {
                const shortKey = key.toLowerCase().replace('special-', 'sp');
                return `<span class="info-pill stat-${shortKey}">${value} ${statNameMap[key]}</span>`;
            })
            .join(' ');
    }

    function formatIVs(ivs = {}) {
        const output = Object.entries(ivs)
            .filter(([, value]) => value < 31)
            .map(([key, value]) => `<span class="info-pill">${value} ${key.toUpperCase()}</span>`);
        return output.length ? output.join(" ") : `<span class="info-pill">Default (31)</span>`;
    }

    function renderStatBlock(stats, nature) {
        const statNameMap = { hp: "HP", attack: "Atk", defense: "Def", "special-attack": "SpA", "special-defense": "SpD", speed: "Spe" };
        const mods = natureMods[nature?.toLowerCase()] || {};

        return `
            <div class="stat-block">
                ${stats.map(s => {
                    const raw = s.stat.name;
                    const short = statNameMap[raw] || raw.toUpperCase();
                    const base = s.base_stat;
                    const mod = raw === mods.up ? "+" : raw === mods.down ? "−" : "";
                    return `
                        <div class="stat-line">
                            <span class="stat-label ${raw.replace('special-','sp')}">${short}</span>
                            <div class="stat-bar"><div class="stat-bar-fill" data-base="${base}"></div></div>
                            <span class="stat-value">${base}</span>
                            ${mod ? `<span class="stat-modifier ${mod === "+" ? "plus" : "minus"}">${mod}</span>` : ""}
                        </div>`;
                }).join("")}
            </div>
        `;
    }

    function renderMovePills(moves, moveDetails) {
        if (!moves || !moveDetails) return '';
        return moves.map(move => {
            const detail = moveDetails.find(md => md.name === move);
            const type = detail ? detail.type : 'normal';
            return `<span class="move-pill type-${type}">${move.replace(/-/g, ' ')}</span>`;
        }).join("");
    }
    
    function animateStatBars(container = document) {
        requestAnimationFrame(() => {
            container.querySelectorAll(".stat-bar-fill").forEach(bar => {
                const base = +bar.dataset.base;
                bar.style.width = `${Math.min(100, base / 255 * 100)}%`;
                bar.style.backgroundColor =
                    base >= 130 ? "#00e676" :
                    base >= 100 ? "#ffee58" :
                    base >= 70  ? "#ffa726" : "#ef5350";
            });
        });
    }

    // --- API FETCH ---
    async function fetchPokemonSpecies() {
        try {
            const response = await fetch(`${POKEAPI_BASE_URL}pokemon-species?limit=1500`);
            if (!response.ok) throw new Error('Failed to fetch Pokémon species list.');
            const data = await response.json();
            pokemonSpeciesList = data.results.map(p => p.name);
        } catch (error) {
            console.error("Error fetching Pokémon species:", error);
        }
    }

    async function fetchItems() {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/item?limit=2000`);
            if (!response.ok) throw new Error('Failed to fetch item list.');
            const data = await response.json();
            itemList = data.results.map(i => i.name.replace(/-/g, ' '));
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        if (teamGrid) {
            teamGrid.addEventListener('click', e => {
                if (document.body.classList.contains('export-mode')) return;
                const card = e.target.closest('.pokemon-card');
                if (card) {
                    playClickSound();
                    currentlyEditingSlot = parseInt(card.dataset.index, 10);
                    const pokemon = team[currentlyEditingSlot];
                    if (pokemon) {
                        openEditorModal(pokemon);
                    } else {
                        openSpotlightModal();
                    }
                }
            });
        }

        const exportNeoPasteBtn = document.getElementById('export-neopaste-btn');
        if (exportNeoPasteBtn) exportNeoPasteBtn.addEventListener('click', exportToNeoPaste);
        
        const exportClipboardBtn = document.getElementById('export-clipboard-btn');
        if (exportClipboardBtn) exportClipboardBtn.addEventListener('click', exportToClipboard);
        
        const exportPngBtn = document.getElementById('export-png-btn');
        if (exportPngBtn) exportPngBtn.addEventListener('click', exportToPngHandler);
        
        const toggleSpritesBtn = document.getElementById('toggle-sprites-btn');
        if (toggleSpritesBtn) {
            toggleSpritesBtn.addEventListener('click', () => {
                animatedSprites = !animatedSprites;
                renderTeamGrid(); // Re-render the grid to update all sprites
            });
        }

        const ACCENT_KEY = 'pantheon-accent';
        const accentInput = document.getElementById('accentColorPicker');
        const accentCircle = document.querySelector('.accent-circle');
        if (accentInput && accentCircle) {
            const setAccent = (color) => {
                document.documentElement.style.setProperty('--accent', color);
                localStorage.setItem(ACCENT_KEY, color);
                accentCircle.style.background = color;
                accentInput.value = color;
            };
            accentInput.addEventListener('input', e => setAccent(e.target.value));
            const savedAccent = localStorage.getItem(ACCENT_KEY) || getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
            setAccent(savedAccent);
        }
        
        document.querySelectorAll('.fancy-btn, .pokemon-card, .search-result-item').forEach(el => {
            el.addEventListener('mouseenter', playHoverSound);
        });
    }

    // --- MODALS & WORKFLOW ---
    function openSpotlightModal() {
        if (!spotlightModal) return;
        spotlightModal.classList.add('visible');
        const searchInput = document.getElementById('spotlight-search');
        const searchResults = document.getElementById('spotlight-results');
        
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        if (searchResults) searchResults.innerHTML = '';

        const inputHandler = () => handleSpotlightSearch(searchInput, searchResults);
        const resultClickHandler = (e) => handleSpotlightResultClick(e);
        
        searchInput.addEventListener('input', inputHandler);
        searchResults.addEventListener('click', resultClickHandler);

        const closeHandler = (e) => {
            if (e.target === spotlightModal) {
                closeSpotlightModal(inputHandler, resultClickHandler, closeHandler);
            }
        };
        spotlightModal.addEventListener('click', closeHandler);
    }

    function handleSpotlightSearch(input, resultsContainer) {
        if (!input || !resultsContainer) return;
        const query = input.value.toLowerCase();
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }
        const filtered = pokemonSpeciesList.filter(p => p.startsWith(query)).slice(0, 10);
        resultsContainer.innerHTML = filtered.map(p => `<div class="search-result-item" data-name="${p}">${p}</div>`).join('');
    }

    async function handleSpotlightResultClick(event) {
        if (event.target.classList.contains('search-result-item')) {
            const pokemonName = event.target.dataset.name;
            closeSpotlightModal();
            try {
                const response = await fetch(`${POKEAPI_BASE_URL}pokemon/${pokemonName}`);
                if (!response.ok) throw new Error('Pokémon not found');
                const data = await response.json();

                // Fetch all possible moves for the species
                const speciesResponse = await fetch(data.species.url);
                const speciesData = await speciesResponse.json();
                const movesResponse = await fetch(speciesData.varieties.find(v => v.is_default).pokemon.url);
                const pokemonDataWithMoves = await movesResponse.json();
                const allMoves = pokemonDataWithMoves.moves.map(m => m.move.name);

                // Pre-fetch all move details for color-coding
                const moveDetails = await Promise.all(
                    pokemonDataWithMoves.moves.map(async (m) => {
                        const moveRes = await fetch(m.move.url);
                        const moveData = await moveRes.json();
                        return { name: moveData.name, type: moveData.type.name };
                    })
                );

                const newPokemon = {
                    ...defaultPokemonScaffold,
                    species: data.name,
                    ability: data.abilities[0]?.ability.name,
                    abilities: data.abilities,
                    stats: data.stats,
                    types: data.types.map(t => t.type.name),
                    allMoves: allMoves, // Store all legal moves
                    moveDetails: moveDetails // Store details for color-coding
                };
                openEditorModal(newPokemon);
            } catch(error) {
                console.error("Error fetching pokemon details:", error);
                alert('Could not fetch data for that Pokémon.');
            }
        }
    }
    
    function closeSpotlightModal(inputHandler, resultClickHandler, closeHandler) {
        if (!spotlightModal) return;
        spotlightModal.classList.remove('visible');
        const searchInput = document.getElementById('spotlight-search');
        const searchResults = document.getElementById('spotlight-results');
        
        if (searchInput && inputHandler) searchInput.removeEventListener('input', inputHandler);
        if (searchResults && resultClickHandler) searchResults.removeEventListener('click', resultClickHandler);
        if (closeHandler) spotlightModal.removeEventListener('click', closeHandler);
    }

    function openEditorModal(pokemon) {
        if (!editorModal) return;
        editorModal.classList.add('visible');
        pokemonInEditor = pokemon;
        populateEditor();
        setupEditorEventListeners();
    }

    function closeEditorModal() {
        if (!editorModal) return;
        editorModal.classList.remove('visible');
        const editorMain = editorModal.querySelector('.editor-main');
        if (editorMain) editorMain.innerHTML = '';
        pokemonInEditor = null;
        currentlyEditingSlot = -1;
    }

    function populateEditor() {
        if (!editorModal) return;
        const editorMain = editorModal.querySelector('.editor-main');
        if (!editorMain) return;
        editorMain.innerHTML = createEditorHtml(pokemonInEditor);
        animateStatBars(editorModal);
    }
    
    function createEditorHtml(pokemon) {
        if (!pokemon) return '';
        const statNameMap = { hp: "HP", attack: "Atk", defense: "Def", "special-attack": "SpA", "special-defense": "SpD", speed: "Spe" };
        
        return `
            <div class="editor-sprite-section">
                <img id="editor-sprite" src="${getSpriteUrl(pokemon.species, pokemon.shiny)}" alt="${pokemon.species || 'No Pokémon selected'}">
                <div class="form-group shiny-toggle">
                    <input type="checkbox" id="shiny" ${pokemon.shiny ? 'checked' : ''}>
                    <label for="shiny">Shiny</label>
                </div>
                <div class="moves-list-container">
                    <h3>All Moves</h3>
                    <div class="moves-list">
                        ${pokemon.allMoves.map(move => `<span>${move}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="editor-details-section">
                <div class="form-group">
                    <label for="nickname">Nickname</label>
                    <input type="text" id="nickname" value="${pokemon.nickname || ''}" placeholder="${pokemon.species || 'Nickname'}">
                </div>
                 <div class="form-group">
                    <label for="item">Item</label>
                    <div class="move-input-wrapper">
                        <input type="text" id="item" value="${pokemon.item || ''}" placeholder="e.g., Choice Scarf">
                        <div class="autocomplete-results"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="ability">Ability</label>
                    <select id="ability" ${!pokemon.abilities || pokemon.abilities.length === 0 ? 'disabled' : ''}>
                        ${pokemon.abilities.map(a => `<option value="${a.ability.name}" ${a.ability.name === pokemon.ability ? 'selected' : ''}>${a.ability.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="nature">Nature</label>
                    <select id="nature">
                        ${natureList.map(n => `<option value="${n}" ${n === pokemon.nature ? 'selected' : ''}>${n}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Stats (EVs/IVs)</label>
                    <div class="stats-grid">
                        ${["hp", "attack", "defense", "special-attack", "special-defense", "speed"].map(stat => `
                            <div class="stat-input-group">
                                <label class="stat-label ${stat}">${statNameMap[stat]}</label>
                                <input type="range" class="ev-slider" data-stat="${stat}" min="0" max="252" step="4" value="${pokemon.evs[stat] || 0}">
                                <input type="number" class="ev-display" value="${pokemon.evs[stat] || 0}" readonly>
                                <input type="number" class="iv-input" value="${pokemon.ivs[stat] || 31}" min="0" max="31" step="1">
                            </div>
                        `).join('')}
                        <div class="ev-total">Total EVs: <span>0</span>/508</div>
                    </div>
                </div>
                 <div class="form-group">
                    <label>Moves</label>
                    <div class="moves-grid">
                        ${[0,1,2,3].map(i => `
                            <div class="move-input-wrapper">
                                <input type="text" class="move-input" placeholder="Move ${i+1}" value="${pokemon.moves[i] || ''}" data-move-index="${i}">
                                <div class="autocomplete-results"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }


    /**
     * Sets up event listeners specific to the editor modal.
     */
    function setupEditorEventListeners() {
        if (!editorModal) return;

        const closeModalBtn = editorModal.querySelector('.close-modal-btn');
        if (closeModalBtn) closeModalBtn.onclick = closeEditorModal;
        
        const cancelBtn = document.getElementById('cancel-edit-btn');
        if (cancelBtn) cancelBtn.onclick = closeEditorModal;

        const saveBtn = document.getElementById('save-pokemon-btn');
        if (saveBtn) saveBtn.onclick = savePokemon;

        // EV/IV handling
        const evSliders = editorModal.querySelectorAll('.ev-slider');
        const evDisplays = editorModal.querySelectorAll('.ev-display');
        const evTotalSpan = editorModal.querySelector('.ev-total span');
        const ivInputs = editorModal.querySelectorAll('.iv-input');

        function updateEvTotal() {
            let total = 0;
            evSliders.forEach(slider => {
                total += parseInt(slider.value);
            });
            evTotalSpan.textContent = total;
            evTotalSpan.parentElement.classList.toggle('over', total > 508);
            return total;
        }

        evSliders.forEach((slider, i) => {
            const display = evDisplays[i];
            slider.addEventListener('input', () => {
                const total = updateEvTotal();
                if (total > 508) {
                    slider.value = Math.max(0, slider.value - (total - 508));
                    updateEvTotal();
                }
                display.value = slider.value;
            });
        });

        ivInputs.forEach(input => {
            input.addEventListener('input', () => {
                input.value = Math.min(31, Math.max(0, parseInt(input.value) || 0));
            });
        });
        
        // Shiny checkbox sprite update
        const shinyCheckbox = document.getElementById('shiny');
        if (shinyCheckbox) {
            shinyCheckbox.addEventListener('change', e => {
                const isShiny = e.target.checked;
                const sprite = document.getElementById('editor-sprite');
                if (sprite && pokemonInEditor) {
                    sprite.src = getSpriteUrl(pokemonInEditor.species, isShiny);
                }
            });
        }

        // Move Autocomplete
        editorModal.querySelectorAll('.move-input').forEach(input => {
            input.addEventListener('input', e => {
                const query = e.target.value.toLowerCase();
                const resultsContainer = e.target.nextElementSibling;
                resultsContainer.innerHTML = '';

                if (query.length < 2) return;

                const filteredMoves = pokemonInEditor.allMoves
                    .filter(move => move.startsWith(query))
                    .slice(0, 5);
                
                filteredMoves.forEach(move => {
                    const div = document.createElement('div');
                    div.textContent = move;
                    div.addEventListener('click', () => {
                        e.target.value = move;
                        resultsContainer.innerHTML = '';
                    });
                    resultsContainer.appendChild(div);
                });
            });
        });

        // Item Autocomplete
        const itemInput = document.getElementById('item');
        if (itemInput) {
            itemInput.addEventListener('input', e => {
                const query = e.target.value.toLowerCase();
                const resultsContainer = e.target.nextElementSibling;
                resultsContainer.innerHTML = '';

                if (query.length < 2) return;

                const filteredItems = itemList
                    .filter(item => item.toLowerCase().startsWith(query))
                    .slice(0, 5);
                
                filteredItems.forEach(item => {
                    const div = document.createElement('div');
                    div.textContent = item;
                    div.addEventListener('click', () => {
                        e.target.value = item;
                        resultsContainer.innerHTML = '';
                    });
                    resultsContainer.appendChild(div);
                });
            });
        }
    }

    // --- SAVE & EXPORT ---
    function savePokemon() {
        if (!pokemonInEditor || !pokemonInEditor.species) {
            closeEditorModal();
            return;
        }
        const nickname = document.getElementById('nickname').value;
        const item = document.getElementById('item').value;
        const ability = document.getElementById('ability').value;
        const nature = document.getElementById('nature').value;
        const shiny = document.getElementById('shiny').checked;
        
        const evs = {};
        document.querySelectorAll('.ev-slider').forEach(slider => {
            evs[slider.dataset.stat] = parseInt(slider.value, 10) || 0;
        });
        
        const ivs = {};
        document.querySelectorAll('.iv-input').forEach(input => {
            ivs[input.dataset.stat] = parseInt(input.value, 10) || 31;
        });
        
        const moves = Array.from(document.querySelectorAll('.move-input')).map(input => input.value).filter(Boolean);
        const finalPokemon = { ...pokemonInEditor, nickname, item, ability, nature, shiny, evs, ivs, moves };
        
        team[currentlyEditingSlot] = finalPokemon;
        playClickSound();
        renderTeamGrid();
        saveStateToLocalStorage();
        closeEditorModal();
    }
    
    async function exportToNeoPaste() {
        playClickSound();
        if (!team.some(p => p !== null)) return alert("Your team is empty!");
        try {
            const { data, error } = await window.supabaseClient.from('teams').insert([{ team_data: team }]).select();
            if (error) throw error;
            window.open(`${NEOPASTE_VIEW_URL}?id=${data[0].id}`, '_blank');
        } catch (error) {
            console.error("Error exporting to Supabase:", error);
            alert("Failed to export team.");
        }
    }

    async function exportToClipboard() {
        playClickSound();
        if (!team.some(p => p !== null)) return alert("Your team is empty!");
        try {
            const { data, error } = await window.supabaseClient.from('teams').insert([{ team_data: team }]).select();
            if (error) throw error;
            const pasteLink = `${NEOPASTE_VIEW_URL}?id=${data[0].id}`;
            navigator.clipboard.writeText(pasteLink).then(() => alert("NeoPaste link copied!"), () => alert("Failed to copy link."));
        } catch (error) {
            console.error("Error exporting for clipboard:", error);
            alert("Failed to save team for clipboard export.");
        }
    }

    function exportToPngHandler() {
        playClickSound();
        document.body.classList.add('export-mode');
        const exportHandler = (e) => {
            const card = e.target.closest('.pokemon-card:not(.empty)');
            if (card) {
                e.preventDefault();
                e.stopPropagation();
                exportCardToPng(card);
            }
            document.body.classList.remove('export-mode');
            teamGrid.removeEventListener('click', exportHandler, true);
        };
        teamGrid.addEventListener('click', exportHandler, true);
    }

    function exportCardToPng(cardElement) {
        const pokemon = team[cardElement.dataset.index];
        if (pokemon) {
            cardElement.classList.add('force-glow');
            html2canvas(cardElement, { backgroundColor: null, useCORS: true, scale: 2 })
                .then(canvas => {
                    const link = document.createElement('a');
                    link.download = `${pokemon.species}-card.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                })
                .finally(() => cardElement.classList.remove('force-glow'));
        }
    }

    // --- START ---
    initialize();
}); 