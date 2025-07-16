import React from 'react';
import { Plus } from 'lucide-react';

const PokemonSlot = ({ pokemon, onClick }) => {
  return (
    <div
      className="pokemon-slot group cursor-pointer"
      onClick={onClick}
    >
      <div className="glass-panel h-64 flex flex-col items-center justify-center p-6 transition-all duration-300 hover:scale-105 hover:shadow-accent">
        {pokemon ? (
          <>
            <div className="w-24 h-24 mb-4 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              <img 
                src={pokemon.sprite} 
                alt={pokemon.name}
                className="w-20 h-20 object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold text-center">{pokemon.name}</h3>
            <p className="text-sm text-gray-400 text-center">Level {pokemon.level || 50}</p>
          </>
        ) : (
          <>
            <Plus className="w-12 h-12 text-gray-400 mb-4 group-hover:text-accent transition-colors" />
            <p className="text-gray-400 text-center group-hover:text-accent transition-colors">
              Click to add Pokémon
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonSlot;