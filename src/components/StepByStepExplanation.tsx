import React, { useState } from 'react';

interface StepByStepExplanationProps {
  steps: Array<{
    description: string;
    matrices: number[][][];
    resultMatrix: number[][];
    highlightCells: {
      [key: string]: [number, number];
    };
  }>;
  matrices: (number | null)[][][];
}

const StepByStepExplanation: React.FC<StepByStepExplanationProps> = ({ steps, matrices }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const renderMatrix = (matrix: number[][], highlightCell: [number, number] | null, label: string) => (
    <div className="flex flex-col items-center" key={label}>
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      {matrix.map((row, rowIndex) => (
        <div key={`${label}-row-${rowIndex}`} className="flex mb-1">
          {row.map((cell, colIndex) => (
            <div
              key={`${label}-cell-${rowIndex}-${colIndex}`}
              className={`matrix-cell ${
                highlightCell && highlightCell[0] === rowIndex && highlightCell[1] === colIndex
                  ? 'matrix-cell-highlight'
                  : ''
              }`}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">Step-by-Step Explanation</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="btn-secondary"
        >
          Previous Step
        </button>
        <span className="text-white">
          Step {currentStep + 1} of {steps.length}
        </span>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="btn-secondary"
        >
          Next Step
        </button>
      </div>
      {steps.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap justify-around w-full mb-4">
            {matrices.map((matrix, index) => (
              <div key={`matrix-${index}`}>
                {renderMatrix(
                  steps[currentStep].matrices[index],
                  steps[currentStep].highlightCells[`matrix${index}`] || null,
                  `Matrix ${String.fromCharCode(65 + index)}`
                )}
              </div>
            ))}
          </div>
          <div className="step-arrow">↓</div>
          {renderMatrix(steps[currentStep].resultMatrix, steps[currentStep].highlightCells.result, 'Result Matrix')}
          <p className="text-white mt-4">{steps[currentStep].description}</p>
        </div>
      )}
    </div>
  );
};

export default StepByStepExplanation;