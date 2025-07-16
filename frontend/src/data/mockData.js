// Mock Pokémon data for demonstration
export const mockPokemonData = [
  {
    name: 'Pikachu',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    baseStats: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90 }
  },
  {
    name: 'Charizard',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    baseStats: { hp: 78, attack: 84, defense: 78, spAttack: 109, spDefense: 85, speed: 100 }
  },
  {
    name: 'Blastoise',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
    baseStats: { hp: 79, attack: 83, defense: 100, spAttack: 85, spDefense: 105, speed: 78 }
  },
  {
    name: 'Venusaur',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
    baseStats: { hp: 80, attack: 82, defense: 83, spAttack: 100, spDefense: 100, speed: 80 }
  },
  {
    name: 'Alakazam',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png',
    baseStats: { hp: 55, attack: 50, defense: 45, spAttack: 135, spDefense: 95, speed: 120 }
  },
  {
    name: 'Machamp',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png',
    baseStats: { hp: 90, attack: 130, defense: 80, spAttack: 65, spDefense: 85, speed: 55 }
  },
  {
    name: 'Gengar',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
    baseStats: { hp: 60, attack: 65, defense: 60, spAttack: 130, spDefense: 75, speed: 110 }
  },
  {
    name: 'Dragonite',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png',
    baseStats: { hp: 91, attack: 134, defense: 95, spAttack: 100, spDefense: 100, speed: 80 }
  },
  {
    name: 'Mewtwo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    baseStats: { hp: 106, attack: 110, defense: 90, spAttack: 154, spDefense: 90, speed: 130 }
  },
  {
    name: 'Mew',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png',
    baseStats: { hp: 100, attack: 100, defense: 100, spAttack: 100, spDefense: 100, speed: 100 }
  },
  {
    name: 'Garchomp',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
    baseStats: { hp: 108, attack: 130, defense: 95, spAttack: 80, spDefense: 85, speed: 102 }
  },
  {
    name: 'Lucario',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png',
    baseStats: { hp: 70, attack: 110, defense: 70, spAttack: 115, spDefense: 70, speed: 90 }
  },
  {
    name: 'Rayquaza',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png',
    baseStats: { hp: 105, attack: 150, defense: 90, spAttack: 150, spDefense: 90, speed: 95 }
  },
  {
    name: 'Arceus',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/493.png',
    baseStats: { hp: 120, attack: 120, defense: 120, spAttack: 120, spDefense: 120, speed: 120 }
  },
  {
    name: 'Greninja',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png',
    baseStats: { hp: 72, attack: 95, defense: 67, spAttack: 103, spDefense: 71, speed: 122 }
  }
];

export const mockNatures = [
  'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
  'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
  'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
  'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
  'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
];

export const mockMoves = [
  'Thunderbolt', 'Flamethrower', 'Surf', 'Earthquake',
  'Psychic', 'Shadow Ball', 'Dragon Claw', 'Ice Beam',
  'Solar Beam', 'Hyper Beam', 'Focus Blast', 'Stone Edge',
  'Thunder Wave', 'Toxic', 'Stealth Rock', 'Recover',
  'Protect', 'Substitute', 'Swords Dance', 'Calm Mind',
  'Dragon Dance', 'Nasty Plot', 'Bulk Up', 'Agility',
  'U-turn', 'Volt Switch', 'Scald', 'Will-O-Wisp',
  'Roost', 'Rapid Spin', 'Defog', 'Knock Off',
  'Outrage', 'Close Combat', 'Brave Bird', 'Flare Blitz'
];

export const mockItems = [
  'Leftovers', 'Life Orb', 'Choice Band', 'Choice Scarf',
  'Choice Specs', 'Focus Sash', 'Assault Vest', 'Rocky Helmet',
  'Sitrus Berry', 'Lum Berry', 'Expert Belt', 'Muscle Band',
  'Wise Glasses', 'Scope Lens', 'King\'s Rock', 'Flame Orb',
  'Toxic Orb', 'Air Balloon', 'Weakness Policy', 'Eviolite',
  'Heavy-Duty Boots', 'Throat Spray', 'Blunder Policy', 'Room Service'
];

export const mockAbilities = [
  'Overgrow', 'Blaze', 'Torrent', 'Shield Dust',
  'Compound Eyes', 'Tinted Lens', 'Swarm', 'Keen Eye',
  'Tangled Feet', 'Big Pecks', 'Pressure', 'Super Luck',
  'Aftermath', 'Anticipation', 'Forewarn', 'Unaware',
  'Filter', 'Slow Start', 'Scrappy', 'Storm Drain',
  'Ice Body', 'Solid Rock', 'Snow Warning', 'Honey Gather',
  'Frisk', 'Reckless', 'Multitype', 'Flower Gift',
  'Bad Dreams', 'Pickpocket', 'Sheer Force', 'Contrary',
  'Unnerve', 'Defiant', 'Defeatist', 'Cursed Body'
];