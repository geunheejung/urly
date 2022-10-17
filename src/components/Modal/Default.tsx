import classNames from 'classnames';
import React from 'react';
import ReactModal from 'react-modal';
import './default.scss';

export enum ThemeKey {
  Default,
  Popup,
}

interface IProps extends ReactModal.Props {
  themeKey?: ThemeKey
}

const Default = ({
  isOpen,
  style,
  className,
  themeKey = ThemeKey.Default,
  overlayClassName,
  onRequestClose,
  children
}: IProps) => {
  const theme = {
    [ThemeKey.Default]: 'default',
    [ThemeKey.Popup]: 'popup'
  };

  return (
    <ReactModal
      isOpen={isOpen} 
      style={style}
      ariaHideApp={false}
      className={classNames(
        `storybook-modal`, 
        `--${theme[themeKey]}`,
        { [`${className}`]: !!className }
      )}
      overlayClassName={overlayClassName}
      onRequestClose={onRequestClose}
    >
      {children}
    </ReactModal>
  )
}

export default Default;