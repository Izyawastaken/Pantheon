import React from 'react';
import { Download, FileImage, Users } from 'lucide-react';

const ExportControls = ({ team }) => {
  const handleExportToPaste = () => {
    const teamData = team.filter(pokemon => pokemon !== null);
    const exportText = teamData.map(pokemon => {
      if (!pokemon) return '';
      
      return `${pokemon.name} ${pokemon.item ? `@ ${pokemon.item}` : ''}
Ability: ${pokemon.ability || 'Unknown'}
Level: ${pokemon.level || 50}
${pokemon.nature ? `${pokemon.nature} Nature` : 'Hardy Nature'}
${pokemon.moves.filter(move => move).map(move => `- ${move}`).join('\n')}
${pokemon.notes ? `\nNotes: ${pokemon.notes}` : ''}`;
    }).join('\n\n');

    navigator.clipboard.writeText(exportText).then(() => {
      alert('Team exported to clipboard!');
    });
  };

  const handleExportAsPNG = () => {
    // Mock implementation - in a real app, this would generate an image
    alert('PNG export functionality would be implemented here');
  };

  const handleExportEntireTeam = () => {
    // Mock implementation - in a real app, this would generate a combined image
    alert('Entire team PNG export functionality would be implemented here');
  };

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-4">Export</h3>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleExportToPaste}
          className="btn-secondary flex items-center gap-2 justify-center"
        >
          <FileImage size={16} />
          Export to Paste
        </button>
        <button
          onClick={handleExportAsPNG}
          className="btn-secondary flex items-center gap-2 justify-center"
        >
          <Download size={16} />
          Export as PNG
        </button>
        <button
          onClick={handleExportEntireTeam}
          className="btn-secondary flex items-center gap-2 justify-center"
        >
          <Users size={16} />
          Export Entire Team
        </button>
      </div>
    </div>
  );
};

export default ExportControls;