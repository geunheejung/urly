import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import './check.scss';

export interface ICheckProps {
  isChecked: boolean;
  name: string;
  value: string;
  id: string;
  text: string;
  onClick?: () => void;
}

export const Check = ({ isChecked, text, id, name, value, onClick }: ICheckProps) => {
  const handleCheck = useCallback(() => {
    if (onClick) onClick();
  }, [isChecked]);

  return (
    <div className="storybook-check">
      <label htmlFor={id}>
        <input id={id} type="radio" className="checkbox" name={name} value={value} onClick={handleCheck} />
        <div className={classNames('outer-radio', { selected: isChecked })}>
          <div className={classNames('inner-radio', { selected: isChecked })} />
        </div>
        <span className="label">{text}</span>
      </label>
    </div>
  );
};
