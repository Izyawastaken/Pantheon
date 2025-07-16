import React, { useState, useEffect } from 'react';
import './App.css';
import PokemonTeamBuilder from './components/PokemonTeamBuilder';
import { AccentColorProvider } from './contexts/AccentColorContext';

function App() {
  return (
    <AccentColorProvider>
      <div className="App">
        <PokemonTeamBuilder />
      </div>
    </AccentColorProvider>
  );
}

export default App;