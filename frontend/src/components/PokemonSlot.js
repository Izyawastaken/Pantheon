import React from 'react';
import { Plus } from 'lucide-react';
import PokemonCard from './PokemonCard';

const PokemonSlot = ({ pokemon, onClick, index }) => {
  if (pokemon) {
    return (
      <PokemonCard 
        pokemon={pokemon} 
        onClick={onClick} 
        index={index}
      />
    );
  }

  return (
    <div
      className="pokemon-slot group cursor-pointer"
      onClick={onClick}
      style={{ '--card-delay': `${index * 100}ms` }}
    >
      <div className="glass-panel h-64 flex flex-col items-center justify-center p-6 transition-all duration-300 hover:scale-105 hover:shadow-accent">
        <Plus className="w-12 h-12 text-gray-400 mb-4 group-hover:text-accent transition-colors" />
        <p className="text-gray-400 text-center group-hover:text-accent transition-colors">
          Click to add Pokémon
        </p>
      </div>
    </div>
  );
};

export default PokemonSlot;