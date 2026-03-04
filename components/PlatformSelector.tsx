import React from 'react';
import { PLATFORMS } from '../constants';
import { PlatformSpec } from '../types';

interface PlatformSelectorProps {
  selectedPlatform: PlatformSpec | null;
  onSelect: (platform: PlatformSpec) => void;
  disabled?: boolean;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatform, onSelect, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Select Target Format</h2>
        <span className="text-xs text-slate-500 font-mono">
          {PLATFORMS.length} Formats Available
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform?.id === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => onSelect(platform)}
              disabled={disabled}
              className={`
                relative group flex flex-col p-3 rounded-lg border text-left transition-all duration-200
                ${isSelected 
                  ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' 
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-750'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex justify-between items-start w-full mb-2">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {platform.ratioLabel}
                </span>
                {isSelected && (
                  <span className="text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              <h3 className={`text-sm font-medium mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {platform.name}
              </h3>
              <div className="text-xs text-slate-400 font-mono">
                {platform.width} x {platform.height}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                {platform.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};