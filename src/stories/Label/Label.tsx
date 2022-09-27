import React from 'react';
import './label.scss';

interface LabelProps {
  primary?: boolean;
  value: string;
  isRequired?: boolean;
}

export const Label = ({
  primary = true,
  value,
  isRequired = false,
  ...props
}: LabelProps) => {

  return (
    <label className={`storybook-label storybook-label--primary`}>
      {value}
      {isRequired ? <span className='asterisk'>*</span> : ''}
    </label>
  )
}