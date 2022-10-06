import React, { useState } from 'react';
import { RULE } from '../../common';
import './input.scss';

export const enum InputType {
  Id = "ID",
  Pw  = "PASSWORD",
  Name = "NAME",
  Email = "EMAIL",
}

export interface InputProps {
  placeholder?: string;
  type?: string;
  primary?: boolean;
  defaultValue?: string;
  inputType?: InputType;
  ignore?: RegExp;
  description?: string;
  onChange?: (value: string) => void;
}

export const Input = ({
  type = 'text',
  primary = false,
  defaultValue = '',
  inputType,
  ignore,
  description,
  onChange,
  ...props
}: InputProps) => {
  const [ value, setValue ] = useState(defaultValue);
  const [ warning, setWarning ] = useState('');
  const mode = primary ? 'storybook-input--primary' : 'storybook-input--secondary';

  const validate = (value: string) => {
    let message = '';
    switch (inputType) {
      case InputType.Id:
        // 6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합
        if (!RULE.ID.test(value)) message = '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
        break;
      case InputType.Pw:
        // 10글자
        if (value.length < 10) return '최소 10자 이상 입력';
        if (!RULE.PW.test(value)) message = '영문/숫자/특수문자(공백 제외)만 허용하며, 2개 이상 조합';
        break;
      case InputType.Email:
        if (!value.length) return '이메일을 입력해주세요.';
        if (!RULE.EMAIL.test(value)) message = '이메일 형식으로 입력해주세요.'
        break;
      case InputType.Name:
        break;
      default:
        break;
    }

    return message;
  }

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = e;
    const _value = ignore ? value.replace(ignore, '') : value;
    setValue(_value);
    setWarning(validate(_value))
    if (onChange) onChange(_value);
  }

  return (
    <div className={['storybook-input', mode].join(' ')}>
      <input
        type={type}
        value={value}
        onChange={handleValue}
        {...props}
      />
      {warning && (
        <div className="warning">{warning}</div>
      )}
      {description && (
        <div className="description">{description}</div>
      )}
    </div>
  )
}

