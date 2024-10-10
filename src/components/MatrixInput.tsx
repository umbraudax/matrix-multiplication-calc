import React, { useState, useRef } from 'react';
import { Hash } from 'lucide-react';
import MatrixViewport from './MatrixViewport';
import SizeSelector from './SizeSelector';
import { CellPosition } from '../types';

interface MatrixInputProps {
  label: string;
  matrix: (number | null)[][];
  setMatrix: React.Dispatch<React.SetStateAction<(number | null)[][]>>;
}

const MatrixInput: React.FC<MatrixInputProps> = ({ label, matrix, setMatrix }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [viewportPosition, setViewportPosition] = useState<CellPosition>({ row: 0, col: 0 });
  const [focusPosition, setFocusPosition] = useState<CellPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSizeSelection = (rows: number, cols: number) => {
    const newMatrix = Array(rows).fill(null).map(() => Array(cols).fill(null));
    setMatrix(newMatrix);
    setIsSelecting(false);
    setViewportPosition({ row: 0, col: 0 });
    setFocusPosition({ row: 0, col: 0 });
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
  };

  return (
    <div className="mb-4 bg-gray-800 p-6 rounded-lg shadow-lg relative" ref={containerRef}>
      <h2 className="text-2xl font-semibold mb-4 text-white flex items-center justify-between">
        {label}
        <div className="relative">
          <button
            onClick={() => setIsSelecting(!isSelecting)}
            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors duration-200 text-white"
          >
            <Hash size={24} />
          </button>
          {isSelecting && <SizeSelector onSelect={handleSizeSelection} />}
        </div>
      </h2>
      <MatrixViewport
        matrix={matrix}
        viewportPosition={viewportPosition}
        setViewportPosition={setViewportPosition}
        focusPosition={focusPosition}
        setFocusPosition={setFocusPosition}
        onCellChange={handleCellChange}
      />
    </div>
  );
};

export default MatrixInput;