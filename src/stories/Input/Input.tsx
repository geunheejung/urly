import React, { useCallback, useEffect, useState } from 'react';
import _throttle from 'lodash/throttle';
import { signupValidate } from '../../services/helper';
import { formatter } from '@/hooks/useTimer';
import './input.scss';

export const enum InputType {
  Id = 'id',
  Pw = 'password',
  DoublePw = 'double_pw',
  Name = 'name',
  Email = 'email',
  Phone = 'phone',
  Terms = 'terms',
  Address = 'address',
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
  ms?: number;
  warningMessage?: () => string;
  onChange?: (value: string) => void;
}

const Input = ({
  maxLength = 17,
  type = 'text',
  primary = false,
  defaultValue = '',
  disabled = false,
  readOnly = false,
  inputType,
  ignore,
  ms,
  warningMessage,
  onChange,
  ...props
}: InputProps) => {
  const [value, setValue] = useState('');
  const [warning, setWarning] = useState('');
  const mode = primary ? 'storybook-input--primary' : 'storybook-input--secondary';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = e;
      if (ignore && ignore.test(value)) return;
      if (maxLength < value.length) return;

      setValue(value);
      setWarning(signupValidate(value, inputType));

      if (onChange) {
        onChange(value);
      }
    },
    [ignore, value, inputType, onChange],
  );

  const _warning = warningMessage || warning;
  const _handleChange = _throttle(handleChange, 100);

  useEffect(() => {
    if (value !== defaultValue) setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className={['storybook-input', mode].join(' ')}>
      <div className="field">
        <input
          id={`member${inputType}`}
          type={type}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          maxLength={maxLength}
          onChange={_handleChange}
          {...props}
        />
        {ms && <span className="timer">{formatter(ms)}</span>}
      </div>
      {_warning && <div className="warning">{warningMessage ? warningMessage() : warning}</div>}
    </div>
  );
};

export default Input;
