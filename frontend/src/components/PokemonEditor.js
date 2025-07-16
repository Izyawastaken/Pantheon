import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { mockPokemonData, mockNatures } from '../data/mockData';

const PokemonEditor = ({ pokemon, onSave, onClose, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    sprite: '',
    moves: ['', '', '', ''],
    item: '',
    ability: '',
    nature: 'Hardy',
    level: 50,
    stats: {
      hp: 100,
      attack: 100,
      defense: 100,
      spAttack: 100,
      spDefense: 100,
      speed: 100
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

  useEffect(() => {
    if (pokemon) {
      setFormData(pokemon);
    }
  }, [pokemon]);

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

  const handleStatChange = (stat, value) => {
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: parseInt(value)
      }
    }));
  };

  const handleIVChange = (stat, value) => {
    setFormData(prev => ({
      ...prev,
      ivs: {
        ...prev.ivs,
        [stat]: parseInt(value)
      }
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    // Find sprite from mock data if name matches
    const foundPokemon = mockPokemonData.find(p => 
      p.name.toLowerCase() === formData.name.toLowerCase()
    );
    
    const pokemonToSave = {
      ...formData,
      sprite: foundPokemon ? foundPokemon.sprite : formData.sprite || '/api/placeholder/96/96'
    };
    
    onSave(pokemonToSave);
  };

  const statLabels = [
    { key: 'hp', label: 'HP' },
    { key: 'attack', label: 'Attack' },
    { key: 'defense', label: 'Defense' },
    { key: 'spAttack', label: 'Sp. Attack' },
    { key: 'spDefense', label: 'Sp. Defense' },
    { key: 'speed', label: 'Speed' }
  ];

  const getStatColor = (value) => {
    if (value < 70) return 'from-red-500 to-red-600';
    if (value < 120) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Edit Pokémon</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Pokemon Sprite */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gray-800 flex items-center justify-center overflow-hidden mb-4">
              <img 
                src={formData.sprite || '/api/placeholder/96/96'} 
                alt={formData.name || 'Pokemon'}
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>

          {/* Pokemon Name */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Pokémon Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="glass-input w-full text-2xl font-semibold text-center"
            />
          </div>

          {/* Moves Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Moves</h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.moves.map((move, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Move ${index + 1}`}
                  value={move}
                  onChange={(e) => handleMovesChange(index, e.target.value)}
                  className="glass-input"
                />
              ))}
            </div>
          </div>

          {/* Item and Ability */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Item</label>
              <input
                type="text"
                placeholder="Held Item"
                value={formData.item}
                onChange={(e) => handleInputChange('item', e.target.value)}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ability</label>
              <input
                type="text"
                placeholder="Ability"
                value={formData.ability}
                onChange={(e) => handleInputChange('ability', e.target.value)}
                className="glass-input w-full"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Stats</h3>
            <div className="space-y-4">
              {statLabels.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4">
                  <label className="w-20 text-sm font-medium">{label}</label>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={formData.stats[key]}
                      onChange={(e) => handleStatChange(key, e.target.value)}
                      className="stat-slider w-full"
                      style={{
                        background: `linear-gradient(to right, 
                          rgb(239, 68, 68) 0%, 
                          rgb(234, 179, 8) 50%, 
                          rgb(34, 197, 94) 100%)`
                      }}
                    />
                    <div className="absolute top-0 left-0 w-full h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getStatColor(formData.stats[key])} rounded-full transition-all duration-300`}
                        style={{ width: `${(formData.stats[key] / 200) * 100}%` }}
                      />
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="31"
                    value={formData.ivs[key]}
                    onChange={(e) => handleIVChange(key, e.target.value)}
                    className="glass-input w-16 text-center"
                    placeholder="IV"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Nature */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Nature</label>
            <select
              value={formData.nature}
              onChange={(e) => handleInputChange('nature', e.target.value)}
              className="glass-select w-full"
            >
              {mockNatures.map(nature => (
                <option key={nature} value={nature}>{nature}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="glass-input w-full h-24 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            {pokemon && (
              <button
                onClick={onDelete}
                className="btn-danger flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
              disabled={!formData.name.trim()}
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonEditor;