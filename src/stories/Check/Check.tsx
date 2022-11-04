import React, { Children, ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import { AiFillCheckCircle, AiOutlineCheckCircle } from 'react-icons/ai';
import './check.scss';

export enum ToggleType {
  Radio = 'radio',
  Check = 'check',
}
export interface ICheckProps {
  className?: string;
  isChecked?: boolean;
  name?: string;
  value?: string;
  id: string;
  text?: string;
  type?: ToggleType;
  children?: ReactNode;
  onClick?: (value: string) => void;
}

export const Check = ({
  className = '',
  isChecked = false,
  text,
  id,
  name,
  value = '',
  type = ToggleType.Radio,
  onClick,
  children,
}: ICheckProps) => {
  const handleCheck = useCallback(() => {
    if (onClick) onClick(value || '');
  }, [isChecked]);

  const renderToggle = () => {
    switch (type) {
      case ToggleType.Radio:
        return (
          <div className={classNames('outer-checkbox radio', { selected: isChecked })}>
            <div className="inner-checkbox" />
          </div>
        );
      case ToggleType.Check:
        return (
          <div className="outer-checkbox check">
            {isChecked ? <AiFillCheckCircle className="selected" /> : <AiOutlineCheckCircle />}
          </div>
        );
      default:
        break;
    }
  };

  return (
    <div className={classNames('storybook-check', { [className]: !!className })}>
      <label htmlFor={id}>
        <input id={id} type="radio" name={name} value={value} onClick={handleCheck} />
        {renderToggle()}
        <div className="content">{children ? children : <span className="label">{text}</span>}</div>
      </label>
    </div>
  );
};

Check.Box = (props: ICheckProps) => {
  return <Check {...props} type={ToggleType.Check} />;
};
