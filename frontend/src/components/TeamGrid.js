import React from 'react';
import PokemonSlot from './PokemonSlot';

const TeamGrid = ({ team, onSlotClick }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {team.map((pokemon, index) => (
        <PokemonSlot
          key={index}
          pokemon={pokemon}
          onClick={() => onSlotClick(index)}
        />
      ))}
    </div>
  );
};

export default TeamGrid;