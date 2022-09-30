import React from 'react';
import { Label } from '../Label/Label';
import { Button } from '../Button/Button';
import {Input, InputType} from '../Input/Input';

import './field.scss';

interface FieldProps {
  label: string;
  isRequired?: boolean;
  placeholder: string;
  button: string;
  inputType?: InputType,
}

export const Field = ({
  label,
  isRequired = false,
  placeholder,
  button,
  inputType,
}: FieldProps) => {
  return (
    <div className="storybook-field">
      <div className="left">
        <Label
          value={label}
          isRequired={isRequired}
        />
      </div>
      <div className="center">
        <Input
          placeholder={placeholder}
          inputType={inputType}
        />
      </div>
      <div className="right">
        {button && <Button label={button} />}
      </div>
    </div>
  )
}

