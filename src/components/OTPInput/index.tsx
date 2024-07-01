import React, { useState, useRef, useEffect } from 'react';

interface InputOtpProps {
  length: number;
  onComplete: (code: string) => void;
  onChange: (code: string) => void;
  resetInput: boolean;
}

const InputOtp: React.FC<InputOtpProps> = ({ length, onComplete, onChange, resetInput }) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resetInput) {
      setValues(Array(length).fill(''));
    }
    inputs.current[0]?.focus();
  }, [resetInput, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, '');
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    onChange(newValues.join(''));

    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newValues.every(value => value !== '')) {
      onComplete(newValues.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !values[index]) {
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  return (
    <div className='d-flex gap-3 py-3'>
      {Array(length).fill('').map((_, index: number) => (
        <input
          key={index}
          ref={input => {
            inputs.current[index] = input;
          }}
          type="text"
          maxLength={1}
          value={values[index]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
          inputMode="numeric"
          pattern="[0-9]*"
          style={{
            width: '65px',
            height: '68px',
            textAlign: 'center',
            fontSize: '20px',
            border: '1px solid #E5E5E5',
            borderRadius: '12px'
          }}
        />
      ))}
    </div>
  );
};

export default InputOtp;
