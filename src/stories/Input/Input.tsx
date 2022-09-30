import React, { useState } from 'react';
import './input.scss';

export const RULE = {
  ID: /[ㄱ-ㅎㅏ-ㅣ가-힣|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g,
  PW: /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]/g,
}

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
  onChange?: (value: string) => void;
  inputType?: InputType;
  rule?: RegExp;
}

export const Input = ({
  type = 'text',
  primary = false,
  defaultValue = '',
  inputType,
  rule,
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
        if (value.length < 6 || value.length > 16) message = '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
        break;
      case InputType.Pw:
        // 10글자
        if (value.length < 10) return '최소 10자 이상 입력';
        if (!value.match(RULE.PW)) message = '영문/숫자/특수문자(공백 제외)만 허용하며, 2개 이상 조합';
        break;
      case InputType.Email:
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
    const _value = rule ? value.replace(rule, '') : value;
    setValue(_value);
    setWarning(validate(_value))
    if (onChange) onChange(value);
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
        <p className="warning">{warning}</p>
      )}

    </div>
  )
}

