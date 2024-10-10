import React, { useRef, useEffect } from 'react';

interface MatrixCellProps {
  value: number | null;
  onChange: (value: number | null) => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isFocused: boolean;
  dataRow: number;
  dataCol: number;
}

const MatrixCell: React.FC<MatrixCellProps> = ({ value, onChange, onNavigate, isFocused, dataRow, dataCol }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input (null), negative sign, or valid number
    if (inputValue === '' || inputValue === '-' || !isNaN(Number(inputValue))) {
      const newValue = inputValue === '' ? null : inputValue === '-' ? inputValue : Number(inputValue);
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      onNavigate(e.key.toLowerCase().replace('arrow', '') as 'up' | 'down' | 'left' | 'right');
    }
  };

  const handleBlur = () => {
    // Convert lone '-' to null when losing focus
    if (value === '-') {
      onChange(null);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value === null ? '' : value.toString()}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={`matrix-input w-12 h-12 text-center bg-gray-800 border ${
        isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-700'
      } text-white transition-all duration-200 ease-in-out`}
      data-row={dataRow}
      data-col={dataCol}
      style={{ caretColor: 'transparent' }}
    />
  );
};

export default MatrixCell;