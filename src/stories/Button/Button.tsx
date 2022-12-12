import React from 'react';
import classNames from 'classnames';
import ClipLoader from 'react-spinners/ClipLoader';
import _isUndefined from 'lodash/isUndefined';
import './button.scss';

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  primary?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  children,
  isLoading,
  type = 'button',
  ...props
}: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  const _isLoading = !_isUndefined(isLoading) && isLoading;
  const content = children ? children : <span>{label}</span>;

  return (
    <button
      type={type}
      className={classNames('storybook-button', `storybook-button--${size}`, mode, { loading: _isLoading })}
      style={{ backgroundColor }}
      {...props}
    >
      {_isLoading ? <ClipLoader color="#fff" size={20} /> : content}
    </button>
  );
};
