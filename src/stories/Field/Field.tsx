import React from 'react';
import { Label } from '../Label/Label';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';

import './field.scss';

interface FieldProps {
  field: {
    label: string;
    isRequired?: boolean;
    placeholder: string;
    button: string;
  }
}

export const Field = ({
  field: { label, isRequired = false, placeholder, button }
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
        <Input placeholder={placeholder} />
      </div>
      <div className="right">
        <Button label={button} />
      </div>
    </div>
  )
}

