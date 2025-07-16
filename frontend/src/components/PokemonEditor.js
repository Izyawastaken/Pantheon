import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Sparkles } from 'lucide-react';
import { useAccentColor } from '../contexts/AccentColorContext';
import { mockPokemonData, mockNatures, mockMoves, mockItems, mockAbilities } from '../data/mockData';

const PokemonEditor = ({ pokemon, onSave, onClose, onDelete }) => {
  const { accentColor } = useAccentColor();
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    sprite: '',
    gender: 'Unknown',
    level: 50,
    shiny: false,
    teraType: 'Normal',
    moves: ['', '', '', ''],
    item: '',
    ability: '',
    nature: 'Hardy',
    baseStats: {
      hp: 100,
      attack: 100,
      defense: 100,
      spAttack: 100,
      spDefense: 100,
      speed: 100
    },
    evs: {
      hp: 0,
      attack: 0,
      defense: 0,
      spAttack: 0,
      spDefense: 0,
      speed: 0
    },
    ivs: {
      hp: 31,
      attack: 31,
      defense: 31,
      spAttack: 31,
      spDefense: 31,
      speed: 31
    },
    notes: ''
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (pokemon) {
      setFormData({
        ...formData,
        ...pokemon
      });
    }
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pokemon]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMovesChange = (index, value) => {
    const newMoves = [...formData.moves];
    newMoves[index] = value;
    setFormData(prev => ({
      ...prev,
      moves: newMoves
    }));
  };

  const handleEVChange = (stat, value) => {
    const newValue = Math.max(0, Math.min(252, parseInt(value) || 0));
    setFormData(prev => ({
      ...prev,
      evs: {
        ...prev.evs,
        [stat]: newValue
      }
    }));
  };

  const handleIVChange = (stat, value) => {
    const newValue = Math.max(0, Math.min(31, parseInt(value) || 0));
    setFormData(prev => ({
      ...prev,
      ivs: {
        ...prev.ivs,
        [stat]: newValue
      }
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    const foundPokemon = mockPokemonData.find(p => 
      p.name.toLowerCase() === formData.name.toLowerCase()
    );
    
    const pokemonToSave = {
      ...formData,
      sprite: foundPokemon ? foundPokemon.sprite : formData.sprite || '/api/placeholder/96/96'
    };
    
    setIsVisible(false);
    setTimeout(() => {
      onSave(pokemonToSave);
    }, 300);
  };

  const handleDelete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDelete();
    }, 300);
  };

  const statLabels = [
    { key: 'hp', label: 'HP', color: '#4ade80' },
    { key: 'attack', label: 'Atk', color: '#f97316' },
    { key: 'defense', label: 'Def', color: '#3b82f6' },
    { key: 'spAttack', label: 'SpA', color: '#a855f7' },
    { key: 'spDefense', label: 'SpD', color: '#06b6d4' },
    { key: 'speed', label: 'Spe', color: '#ec4899' }
  ];

  const calculateFinalStat = (stat) => {
    const base = formData.baseStats[stat];
    const iv = formData.ivs[stat];
    const ev = formData.evs[stat];
    const level = formData.level;
    
    if (stat === 'hp') {
      return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
    } else {
      return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
    }
  };

  const getTotalEVs = () => {
    return Object.values(formData.evs).reduce((sum, ev) => sum + ev, 0);
  };

  const getRemainingEVs = () => {
    return 508 - getTotalEVs();
  };

  const genders = ['Male', 'Female', 'Unknown'];
  const teraTypes = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

  return (
    <div className={`pokemon-editor-overlay ${isVisible ? 'active' : ''}`}>
      <div className={`pokemon-editor-modal ${isVisible ? 'active' : ''}`}>
        {/* Header Section */}
        <div className="editor-header">
          <button
            onClick={handleClose}
            className="close-button"
          >
            <X size={24} />
          </button>
          
          <div className="pokemon-image-section">
            <div className="pokemon-image-container">
              <div className="pokemon-image-ring">
                <img 
                  src={formData.sprite || '/api/placeholder/128/128'} 
                  alt={formData.name || 'Pokemon'}
                  className="pokemon-image"
                />
                {formData.shiny && (
                  <div className="shiny-indicator">
                    <Sparkles size={20} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="pokemon-basic-info">
              <div className="input-group">
                <label>Pokémon Name</label>
                <select
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="glass-select-large"
                >
                  <option value="">Select Pokémon</option>
                  {mockPokemonData.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label>Nickname</label>
                <input
                  type="text"
                  placeholder="Optional nickname"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className="glass-input-large"
                />
              </div>
              
              <div className="input-row">
                <div className="input-group">
                  <label>Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="glass-select-small"
                  >
                    {genders.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                
                <div className="input-group">
                  <label>Level</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', parseInt(e.target.value))}
                    className="glass-input-small"
                  />
                </div>
                
                <div className="input-group">
                  <label>Shiny</label>
                  <button
                    onClick={() => handleInputChange('shiny', !formData.shiny)}
                    className={`shiny-toggle ${formData.shiny ? 'active' : ''}`}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>
                
                <div className="input-group">
                  <label>Tera Type</label>
                  <select
                    value={formData.teraType}
                    onChange={(e) => handleInputChange('teraType', e.target.value)}
                    className="glass-select-small"
                  >
                    {teraTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Body Section */}
        <div className="editor-body">
          {/* Item/Ability/Nature Row */}
          <div className="main-attributes">
            <div className="attribute-group">
              <label>Item</label>
              <select
                value={formData.item}
                onChange={(e) => handleInputChange('item', e.target.value)}
                className="glass-select-medium"
              >
                <option value="">No Item</option>
                {mockItems.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            
            <div className="attribute-group">
              <label>Ability</label>
              <select
                value={formData.ability}
                onChange={(e) => handleInputChange('ability', e.target.value)}
                className="glass-select-medium"
              >
                <option value="">Select Ability</option>
                {mockAbilities.map(ability => (
                  <option key={ability} value={ability}>{ability}</option>
                ))}
              </select>
            </div>
            
            <div className="attribute-group">
              <label>Nature</label>
              <select
                value={formData.nature}
                onChange={(e) => handleInputChange('nature', e.target.value)}
                className="glass-select-medium"
              >
                {mockNatures.map(nature => (
                  <option key={nature} value={nature}>{nature}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Moves Row */}
          <div className="moves-section">
            <label className="section-label">Moves</label>
            <div className="moves-grid">
              {formData.moves.map((move, index) => (
                <div key={index} className="move-slot">
                  <select
                    value={move}
                    onChange={(e) => handleMovesChange(index, e.target.value)}
                    className="glass-select-move"
                  >
                    <option value="">Move {index + 1}</option>
                    {mockMoves.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="editor-stats">
          <div className="stats-header">
            <h3>Stats & Spread</h3>
            <div className="remaining-evs">
              Remaining: <span style={{ color: accentColor }}>{getRemainingEVs()}</span>
            </div>
          </div>
          
          <div className="stats-grid">
            {statLabels.map(({ key, label, color }) => (
              <div key={key} className="stat-row">
                <div className="stat-label">
                  <span className="stat-name">{label}</span>
                  <span className="base-stat">{formData.baseStats[key]}</span>
                </div>
                
                <div className="stat-slider-container">
                  <div className="ev-slider-wrapper">
                    <input
                      type="range"
                      min="0"
                      max="252"
                      value={formData.evs[key]}
                      onChange={(e) => handleEVChange(key, e.target.value)}
                      className="ev-slider"
                      style={{ 
                        '--stat-color': color,
                        '--fill-width': `${(formData.evs[key] / 252) * 100}%`
                      }}
                    />
                  </div>
                  
                  <input
                    type="number"
                    min="0"
                    max="252"
                    value={formData.evs[key]}
                    onChange={(e) => handleEVChange(key, e.target.value)}
                    className="ev-input"
                  />
                  
                  <input
                    type="number"
                    min="0"
                    max="31"
                    value={formData.ivs[key]}
                    onChange={(e) => handleIVChange(key, e.target.value)}
                    className="iv-input"
                  />
                  
                  <span className="final-stat">{calculateFinalStat(key)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="editor-actions">
          {pokemon && (
            <button
              onClick={handleDelete}
              className="btn-delete"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
          <button
            onClick={handleClose}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-save"
            disabled={!formData.name.trim()}
            style={{ '--accent-color': accentColor }}
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonEditor;