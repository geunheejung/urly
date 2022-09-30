import React, {useState} from 'react';
import { Label } from '../Label/Label';
import { Button } from '../Button/Button';
import {Input, InputProps} from '../Input/Input';

import './field.scss';


interface FieldProps {
  label: string;
  isRequired?: boolean;
  button: string;
  inputProps: InputProps;
}

export const Field = ({
  label,
  isRequired = false,
  button,
  inputProps,
}: FieldProps) => {
  const [ value, setValue ] = useState('');



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
          {...inputProps}
          onChange={setValue}
        />
      </div>
      <div className="right">
        {button && (
          <Button
            label={button}
          />
        )}
      </div>
    </div>
  )
}

