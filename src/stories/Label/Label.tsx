import React from 'react';
import './label.scss';

export interface LabelProps {
  primary?: boolean;
  label?: string;
  isRequired?: boolean;
}

export const Label = ({ primary = true, label, isRequired = false, ...props }: LabelProps) => {
  return (
    <label className={`storybook-label storybook-label--primary`}>
      {label}
      {isRequired ? <span className="asterisk">*</span> : ''}
    </label>
  );
};
