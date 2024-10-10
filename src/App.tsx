import React, { useState, useCallback } from 'react';
import { Calculator, RotateCcw, Plus, Minus } from 'lucide-react';
import MatrixInput from './components/MatrixInput';
import MatrixDisplay from './components/MatrixDisplay';
import StepByStepExplanation from './components/StepByStepExplanation';

interface Step {
  description: string;
  matrices: number[][][];
  resultMatrix: number[][];
  highlightCells: {
    [key: string]: [number, number];
  };
}

function App() {
  const [matrices, setMatrices] = useState<(number | null)[][][]>([
    [[null, null], [null, null]],
    [[null, null], [null, null]]
  ]);
  const [result, setResult] = useState<number[][]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const addMatrix = () => {
    setMatrices([...matrices, [[null, null], [null, null]]]);
  };

  const removeMatrix = () => {
    if (matrices.length > 2) {
      setMatrices(matrices.slice(0, -1));
    }
  };

  const resetCalculator = () => {
    setMatrices([
      [[null, null], [null, null]],
      [[null, null], [null, null]]
    ]);
    setResult([]);
    setSteps([]);
  };

  const multiplyMatrices = useCallback(() => {
    setIsCalculating(true);

    const matrixValues = matrices.map(matrix => 
      matrix.map(row => 
        row.map(cell => cell === null ? 0 : Number(cell))
      )
    );

    for (let i = 0; i < matrixValues.length - 1; i++) {
      if (matrixValues[i][0].length !== matrixValues[i + 1].length) {
        alert(`Cannot multiply matrices ${i + 1} and ${i + 2}. The number of columns in Matrix ${i + 1} must equal the number of rows in Matrix ${i + 2}.`);
        setIsCalculating(false);
        return;
      }
    }

    let result = matrixValues[0];
    const newSteps: Step[] = [];

    for (let m = 1; m < matrixValues.length; m++) {
      const matrixA = result;
      const matrixB = matrixValues[m];
      const newResult: number[][] = [];

      for (let i = 0; i < matrixA.length; i++) {
        newResult[i] = [];
        for (let j = 0; j < matrixB[0].length; j++) {
          let sum = 0;
          for (let k = 0; k < matrixB.length; k++) {
            sum += matrixA[i][k] * matrixB[k][j];
            newSteps.push({
              description: `Multiplying ${matrixA[i][k]} (A[${i+1},${k+1}]) with ${matrixB[k][j]} (B[${k+1},${j+1}]) and adding to the sum.`,
              matrices: matrixValues,
              resultMatrix: newResult,
              highlightCells: {
                [`matrix${m-1}`]: [i, k],
                [`matrix${m}`]: [k, j],
                result: [i, j]
              }
            });
          }
          newResult[i][j] = sum;
          newSteps.push({
            description: `Setting the result at position [${i+1},${j+1}] to ${sum}.`,
            matrices: matrixValues,
            resultMatrix: newResult,
            highlightCells: {
              result: [i, j]
            }
          });
        }
      }
      result = newResult;
    }

    setResult(result);
    setSteps(newSteps);
    setIsCalculating(false);
  }, [matrices]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Matrix Multiplication Calculator</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {matrices.map((matrix, index) => (
            <MatrixInput
              key={index}
              label={`Matrix ${String.fromCharCode(65 + index)}`}
              matrix={matrix}
              setMatrix={(newMatrix) => {
                const newMatrices = [...matrices];
                newMatrices[index] = newMatrix;
                setMatrices(newMatrices);
              }}
            />
          ))}
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={addMatrix} className="btn-secondary flex items-center">
            <Plus className="mr-2" /> Add Matrix
          </button>
          <button onClick={removeMatrix} className="btn-secondary flex items-center" disabled={matrices.length <= 2}>
            <Minus className="mr-2" /> Remove Matrix
          </button>
          <button onClick={multiplyMatrices} className="btn-primary flex items-center" disabled={isCalculating}>
            <Calculator className="mr-2" /> Calculate
          </button>
          <button onClick={resetCalculator} className="btn-secondary flex items-center">
            <RotateCcw className="mr-2" /> Reset
          </button>
        </div>
        {result.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Result:</h2>
            <MatrixDisplay matrix={result} />
          </div>
        )}
        {steps.length > 0 && (
          <StepByStepExplanation steps={steps} matrices={matrices} />
        )}
      </div>
    </div>
  );
}

export default App;