
import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  before: string;
  after: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ before, after }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[3/4] select-none cursor-ew-resize overflow-hidden rounded-2xl shadow-2xl border border-slate-800"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      <div className="absolute inset-0">
        <img src={after} alt="After" className="w-full h-full object-cover" />
      </div>
      
      <div 
        className="absolute inset-0 overflow-hidden" 
        style={{ width: `${sliderPos}%` }}
      >
        <img src={before} alt="Before" className="absolute top-0 left-0 w-[1000%] max-w-none h-full object-cover" style={{ width: containerRef.current?.offsetWidth }} />
      </div>

      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59,16.59L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.59Z" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white uppercase tracking-widest border border-white/20">Original</div>
      <div className="absolute bottom-4 right-4 bg-indigo-600/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white uppercase tracking-widest border border-white/20">AI Generated</div>
    </div>
  );
};
