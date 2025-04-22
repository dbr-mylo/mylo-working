
import React from 'react';

export const GraphLegend = () => {
  return (
    <div className="absolute top-2 right-2 flex gap-2 text-xs">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-[#93c5fd]" />
        <span>Required (with value)</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-[#c7d2fe]" />
        <span>Optional (with value)</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-[#fca5a5]" />
        <span>Required (no value)</span>
      </div>
    </div>
  );
};
