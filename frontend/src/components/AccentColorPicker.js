import React from 'react';
import { useAccentColor } from '../contexts/AccentColorContext';

const AccentColorPicker = () => {
  const { accentColor, setAccentColor } = useAccentColor();

  const presetColors = [
    '#00f0ff', // Default cyan
    '#ff0080', // Hot pink
    '#8000ff', // Purple
    '#00ff80', // Green
    '#ff8000', // Orange
    '#0080ff', // Blue
    '#ff0040', // Red
    '#80ff00', // Lime
  ];

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-4">Accent Color</h3>
      <div className="flex flex-col gap-4">
        {/* Color Input */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Custom:</label>
          <div className="relative">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="color-picker w-12 h-12 rounded-full border-2 border-gray-600 cursor-pointer"
              style={{ borderColor: accentColor }}
            />
          </div>
        </div>

        {/* Preset Colors */}
        <div>
          <label className="text-sm font-medium mb-2 block">Presets:</label>
          <div className="grid grid-cols-4 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  accentColor === color ? 'border-white' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccentColorPicker;