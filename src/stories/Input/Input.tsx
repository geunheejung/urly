import React, { useState } from 'react';
import './input.scss';

export const enum InputType {
  Id = "ID",
  Pw  = "PASSWORD",
  Name = "NAME",
  Email = "EMAIL",
}

interface InputProps {
  primary?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder: string;
  inputType?: InputType;
  regexp?: RegExp;
}

export const Input = ({
  primary = false,
  defaultValue = '',
  inputType,
  regexp,
  onChange,
  ...props
}: InputProps) => {
  const [ value, setValue ] = useState(defaultValue);
  const [ warning, setWarning ] = useState('');
  const mode = primary ? 'storybook-input--primary' : 'storybook-input--secondary';

  const validate = () => {
    let _warning = '';
    switch (inputType) {
      case InputType.Id:
        // 6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합
        if (value.length < 6 || value.length > 16) _warning = '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
        break;
      case InputType.Pw:
        break;
      case InputType.Email:
        break;
      case InputType.Name:
        break;
      default:
        break;
    }

    setWarning(_warning);
  }

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = e;
    const _value = regexp ? value.replace(regexp, '') : value;
    setValue(_value);
    validate();
    if (onChange) onChange(value);
  }

  return (
    <div className={['storybook-input', mode].join(' ')}>
      <input
        type="text"
        value={value}
        onChange={handleValue}
        {...props}
      />
      {warning && (
        <p className="warning">{warning}</p>
      )}

    </div>
  )
}

