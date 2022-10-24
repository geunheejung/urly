import React, { useState } from 'react';
import { signupValidate } from '../../helper';
import './input.scss';

export const enum InputType {
  Id = 'ID',
  Pw  = 'PASSWORD',
  DoublePw = 'DOUBLE_PW',
  Name = 'NAME',
  Email = 'EMAIL',
}
export interface InputProps {
  maxLength?: number;
  placeholder?: string;
  type?: string;
  primary?: boolean;
  defaultValue?: string;
  readOnly?: boolean;
  disabled?: boolean;
  inputType?: InputType;
  ignore?: RegExp;
  warningMessage?: () => string;
  onChange?: (value: string) => void;
}

export const Input = ({
  maxLength = 17,
  type = 'text',
  primary = false,
  defaultValue = '',
  disabled = false,
  readOnly = false,
  inputType,
  ignore,
  warningMessage,  
  onChange,
  ...props
}: InputProps) => {
  const [ value, setValue ] = useState('');
  const [ warning, setWarning ] = useState('');
  const mode = primary ? 'storybook-input--primary' : 'storybook-input--secondary';

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = e;
    const _value = ignore ? value.replace(ignore, '') : value;
    setValue(_value);
    setWarning(signupValidate(_value, inputType))
    if (onChange) {      
      
      onChange(_value);
    }
  }

  
    
  
  return (
    <div className={['storybook-input', mode].join(' ')}>
      <input
        type={type}
        value={value || defaultValue}
        readOnly={readOnly}
        disabled={disabled}
        maxLength={maxLength}
        onChange={handleValue}
        {...props}
      />
      {warning && (
        <div className="warning">{
          warningMessage ? warningMessage() : warning
        }</div>
      )}
    </div>
  )
}

