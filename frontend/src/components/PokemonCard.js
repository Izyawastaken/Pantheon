import React, { useState, useEffect } from 'react';
import { 
  renderStatBlock, 
  renderMovePills, 
  formatEVs, 
  formatIVs, 
  getSpriteUrl, 
  sanitizeType, 
  natureMods, 
  animateStatBars 
} from '../utils/pokemonUtils';

const PokemonCard = ({ pokemon, onClick, index }) => {
  const [statBlock, setStatBlock] = useState('');
  const [movePills, setMovePills] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCardData = async () => {
      if (!pokemon) return;
      
      setIsLoading(true);
      try {
        const [statBlockHtml, movePillsHtml] = await Promise.all([
          renderStatBlock(pokemon),
          renderMovePills(pokemon.moves || [])
        ]);
        
        setStatBlock(statBlockHtml);
        setMovePills(movePillsHtml);
      } catch (error) {
        console.error('Error loading card data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCardData();
  }, [pokemon]);

  useEffect(() => {
    if (!isLoading && statBlock) {
      // Animate stat bars after content is loaded
      setTimeout(() => {
        animateStatBars();
      }, 100);
    }
  }, [isLoading, statBlock]);

  if (!pokemon) return null;

  const teraType = sanitizeType(pokemon.teraType || "");
  const teraTypeClass = teraType ? `type-${teraType}` : "";

  // Item icon logic
  let itemIconHtml = '';
  if (pokemon.item) {
    const itemId = pokemon.item.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    const itemUrl = `items/${itemId}.png`;
    itemIconHtml = `<img class="item-icon" src="${itemUrl}" alt="${pokemon.item}" title="${pokemon.item}" loading="lazy" />`;
  }

  const finalSpriteUrl = getSpriteUrl(pokemon);

  // Nature formatting
  const getNatureDisplay = () => {
    const nature = pokemon.nature?.toLowerCase();
    const upStat = natureMods[nature]?.up;
    const statAbbrMap = { hp: "HP", atk: "ATK", def: "DEF", spa: "SPA", spd: "SPD", spe: "SPE" };
    const colorClass = upStat ? `stat-${upStat}` : '';
    const boostAbbr = upStat ? statAbbrMap[upStat] : '';
    return `<span class="info-pill nature-pill ${colorClass}"${boostAbbr ? ` data-boost="${boostAbbr}"` : ''}>${pokemon.nature || "—"}</span>`;
  };

  return (
    <div 
      className="pokemon-card" 
      onClick={onClick}
      style={{ '--card-delay': `${index * 100}ms` }}
    >
      <div className="card-header">
        <h2>{pokemon.nickname ? `${pokemon.nickname} (${pokemon.name})` : pokemon.name}</h2>
        <p className="item-line">
          @ <span dangerouslySetInnerHTML={{ __html: `${pokemon.item || "None"}${itemIconHtml}` }} />
        </p>
      </div>
      
      <img 
        src={finalSpriteUrl} 
        alt={pokemon.name} 
        data-pokemon-name={pokemon.name}
        data-shiny={pokemon.shiny ? '1' : '0'}
        crossOrigin="anonymous"
      />

      <p><strong>Ability:</strong> <span className="info-pill ability-pill">{pokemon.ability || "—"}</span></p>
      
      <p><strong>Tera Type:</strong> <span className={`info-pill ${teraTypeClass}`}>{pokemon.teraType || "—"}</span></p>
      
      <p><strong>Nature:</strong> <span dangerouslySetInnerHTML={{ __html: getNatureDisplay() }} /></p>
      
      <p><strong>EVs:</strong> <span dangerouslySetInnerHTML={{ __html: formatEVs(pokemon.evs) }} /></p>
      
      <p><strong>IVs:</strong> <span dangerouslySetInnerHTML={{ __html: formatIVs(pokemon.ivs) }} /></p>
      
      {isLoading ? (
        <div className="loading-stats">Loading stats...</div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: statBlock }} />
      )}
      
      <div className="moves">
        <strong>Moves:</strong>
        <div className="move-pill-container">
          {isLoading ? (
            <span className="loading-moves">Loading moves...</span>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: movePills }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;