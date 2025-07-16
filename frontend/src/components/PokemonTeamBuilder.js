import React, { useState } from 'react';
import TeamGrid from './TeamGrid';
import PokemonEditor from './PokemonEditor';
import AccentColorPicker from './AccentColorPicker';
import ExportControls from './ExportControls';
import { mockPokemonData } from '../data/mockData';

const PokemonTeamBuilder = () => {
  const [team, setTeam] = useState(Array(6).fill(null));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleSlotClick = (index) => {
    setSelectedSlot(index);
    setIsEditorOpen(true);
  };

  const handleSavePokemon = (pokemonData) => {
    const newTeam = [...team];
    newTeam[selectedSlot] = pokemonData;
    setTeam(newTeam);
    setIsEditorOpen(false);
    setSelectedSlot(null);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedSlot(null);
  };

  const handleDeletePokemon = () => {
    const newTeam = [...team];
    newTeam[selectedSlot] = null;
    setTeam(newTeam);
    setIsEditorOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 pantheon-title">
            Pantheon
          </h1>
          <p className="text-xl text-gray-300">
            Build your ultimate Pokémon team
          </p>
        </div>

        {/* Team Grid */}
        <TeamGrid 
          team={team} 
          onSlotClick={handleSlotClick}
        />

        {/* Controls */}
        <div className="flex justify-between items-end mt-8">
          <AccentColorPicker />
          <ExportControls team={team} />
        </div>
      </div>

      {/* Pokemon Editor Modal */}
      {isEditorOpen && (
        <PokemonEditor
          pokemon={team[selectedSlot]}
          onSave={handleSavePokemon}
          onClose={handleCloseEditor}
          onDelete={handleDeletePokemon}
        />
      )}
    </div>
  );
};

export default PokemonTeamBuilder;