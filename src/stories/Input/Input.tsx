import { debug } from 'console';
import React, { useState } from 'react';
import _throttle from 'lodash/throttle';
import { signupValidate } from '../../helper';
import './input.scss';

export const enum InputType {
  Id = 'ID',
  Pw = 'PASSWORD',
  DoublePw = 'DOUBLE_PW',
  Name = 'NAME',
  Email = 'EMAIL',
  Phone = 'PHONE',
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
  const [value, setValue] = useState('');
  const [warning, setWarning] = useState('');
  const mode = primary ? 'storybook-input--primary' : 'storybook-input--secondary';

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (ignore && ignore.test(value)) return;

    setValue(value);
    setWarning(signupValidate(value, inputType));

    if (onChange) {
      onChange(value);
    }
  };

  const _handleChange = _throttle(handleValue, 300);

  const _warning = warningMessage || warning;

  return (
    <div className={['storybook-input', mode].join(' ')}>
      <input
        type={type}
        value={value || defaultValue}
        readOnly={readOnly}
        disabled={disabled}
        maxLength={maxLength}
        onChange={_handleChange}
        {...props}
      />
      {_warning && <div className="warning">{warningMessage ? warningMessage() : warning}</div>}
    </div>
  );
};
