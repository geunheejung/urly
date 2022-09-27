import React, { useState } from 'react';
import './input.scss';

interface InputProps {
  primary?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder: string;
}

export const Input = ({
  primary = false,
  defaultValue = '',
  onChange,
  ...props
}: InputProps) => {
  const [ value, setValue ] = useState(defaultValue);
  const mode = primary ? 'storybook-input--primary' : 'storybook-input--secondary';

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = e;
    setValue(value);
    if (onChange) onChange(value);
  }

  return (
    <input
      type="text"
      value={value}
      className={['storybook-input', mode].join(' ')}
      onChange={handleValue}
      {...props}
    />
  )
}

