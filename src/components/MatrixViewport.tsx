import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import MatrixCell from './MatrixCell';
import { CellPosition } from '../types';

interface MatrixViewportProps {
  matrix: (number | null)[][];
  viewportPosition: CellPosition;
  setViewportPosition: React.Dispatch<React.SetStateAction<CellPosition>>;
  focusPosition: CellPosition | null;
  setFocusPosition: React.Dispatch<React.SetStateAction<CellPosition | null>>;
  onCellChange: (row: number, col: number, value: number | null) => void;
}

const MatrixViewport: React.FC<MatrixViewportProps> = ({
  matrix,
  viewportPosition,
  setViewportPosition,
  focusPosition,
  setFocusPosition,
  onCellChange,
}) => {
  const viewportSize = 5;

  const handleCellNavigate = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!focusPosition) return;

    const { row, col } = focusPosition;
    let newRow = row;
    let newCol = col;

    switch (direction) {
      case 'up':
        newRow = Math.max(0, row - 1);
        break;
      case 'down':
        newRow = Math.min(matrix.length - 1, row + 1);
        break;
      case 'left':
        newCol = Math.max(0, col - 1);
        break;
      case 'right':
        newCol = Math.min(matrix[0].length - 1, col + 1);
        break;
    }

    if (newRow !== row || newCol !== col) {
      setFocusPosition({ row: newRow, col: newCol });

      // Adjust viewport if necessary
      if (newRow < viewportPosition.row) {
        setViewportPosition(prev => ({ ...prev, row: newRow }));
      } else if (newRow >= viewportPosition.row + viewportSize) {
        setViewportPosition(prev => ({ ...prev, row: newRow - viewportSize + 1 }));
      }

      if (newCol < viewportPosition.col) {
        setViewportPosition(prev => ({ ...prev, col: newCol }));
      } else if (newCol >= viewportPosition.col + viewportSize) {
        setViewportPosition(prev => ({ ...prev, col: newCol - viewportSize + 1 }));
      }
    }
  };

  const renderNavigationButtons = () => {
    return (
      <>
        {viewportPosition.row > 0 && (
          <button
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-700 hover:bg-gray-600 text-white rounded-t-md p-1"
            onClick={() => setViewportPosition(prev => ({ ...prev, row: Math.max(0, prev.row - 1) }))}
          >
            <ChevronUp size={20} />
          </button>
        )}
        {viewportPosition.row + viewportSize < matrix.length && (
          <button
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-700 hover:bg-gray-600 text-white rounded-b-md p-1"
            onClick={() => setViewportPosition(prev => ({ ...prev, row: Math.min(matrix.length - viewportSize, prev.row + 1) }))}
          >
            <ChevronDown size={20} />
          </button>
        )}
        {viewportPosition.col > 0 && (
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full bg-gray-700 hover:bg-gray-600 text-white rounded-l-md p-1"
            onClick={() => setViewportPosition(prev => ({ ...prev, col: Math.max(0, prev.col - 1) }))}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {viewportPosition.col + viewportSize < matrix[0].length && (
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full bg-gray-700 hover:bg-gray-600 text-white rounded-r-md p-1"
            onClick={() => setViewportPosition(prev => ({ ...prev, col: Math.min(matrix[0].length - viewportSize, prev.col + 1) }))}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </>
    );
  };

  const visibleRows = matrix.slice(viewportPosition.row, viewportPosition.row + viewportSize);

  return (
    <div className="relative">
      {visibleRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.slice(viewportPosition.col, viewportPosition.col + viewportSize).map((cell, colIndex) => (
            <MatrixCell
              key={colIndex}
              value={cell}
              onChange={(value) => onCellChange(rowIndex + viewportPosition.row, colIndex + viewportPosition.col, value)}
              onNavigate={handleCellNavigate}
              isFocused={focusPosition?.row === rowIndex + viewportPosition.row && focusPosition?.col === colIndex + viewportPosition.col}
              dataRow={rowIndex + viewportPosition.row}
              dataCol={colIndex + viewportPosition.col}
            />
          ))}
        </div>
      ))}
      {renderNavigationButtons()}
    </div>
  );
};

export default MatrixViewport;