import React from 'react';

interface MatrixDisplayProps {
  matrix: number[][];
}

const MatrixDisplay: React.FC<MatrixDisplayProps> = ({ matrix }) => {
  return (
    <div className="flex flex-col items-center mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex mb-2">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className="w-12 h-12 flex items-center justify-center border border-gray-700 mr-2 bg-gray-700 text-gray-100"
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MatrixDisplay;