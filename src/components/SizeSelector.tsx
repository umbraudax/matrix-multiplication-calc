import React, { useState, useRef } from 'react';

interface SizeSelectorProps {
  onSelect: (rows: number, cols: number) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ onSelect }) => {
  const [hoverSize, setHoverSize] = useState<{ rows: number; cols: number }>({ rows: 1, cols: 1 });
  const selectorRef = useRef<HTMLDivElement>(null);

  const selectorSize = 20;

  const handleMouseEnter = (row: number, col: number) => {
    setHoverSize({ rows: row, cols: col });
  };

  const handleMouseLeave = () => {
    setHoverSize({ rows: 1, cols: 1 });
  };

  const handleClick = () => {
    onSelect(hoverSize.rows, hoverSize.cols);
  };

  return (
    <div
      ref={selectorRef}
      className="absolute right-0 top-full mt-2 bg-gray-800 p-4 rounded-lg shadow-lg z-10"
      style={{ width: '240px' }}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${selectorSize}, 1fr)`,
          width: '200px',
          height: '200px'
        }}
      >
        {Array.from({ length: selectorSize * selectorSize }, (_, i) => {
          const row = Math.floor(i / selectorSize) + 1;
          const col = (i % selectorSize) + 1;
          return (
            <div
              key={i}
              className={`w-full h-full ${
                row <= hoverSize.rows && col <= hoverSize.cols
                  ? 'bg-blue-500'
                  : 'bg-gray-600'
              } cursor-pointer`}
              onMouseEnter={() => handleMouseEnter(row, col)}
              onClick={handleClick}
            />
          );
        })}
      </div>
      <div className="mt-2 text-center text-white">
        {hoverSize.rows} x {hoverSize.cols}
      </div>
    </div>
  );
};

export default SizeSelector;