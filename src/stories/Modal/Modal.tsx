import classNames from 'classnames';
import _isBoolean from 'lodash/isBoolean';
import React, { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import Default from '../../components/Modal/Default';

import { Button } from '../Button/Button';
import './modal.scss';

interface ModalProps extends ReactModal.Props {
  primary?: boolean;
  className?: string;
  overlayClassName?: string;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  children: React.ReactNode;
}

export const Modal = ({
  primary = true,
  className,
  isOpen,
  isLoading,
  onConfirm,
  children,
  overlayClassName,
  ...props
}: ModalProps) => {
  const toggleModal = () => {
    onConfirm();
  };

  const modalClassName = classNames('inner', {
    [`${className}`]: !!className,
    secondary: !primary,
  });

  const _overlayModalClassName = classNames('storybook-form-modal_overlay', {
    [`${overlayClassName}`]: !!overlayClassName,
  });

  if (_isBoolean(isLoading) && isLoading) return <ClipLoader color="#ccc" size={50} className="loader" />;

  return (
    <Default
      isOpen={isOpen}
      overlayClassName={_overlayModalClassName}
      className={modalClassName}
      onRequestClose={onConfirm}
      {...props}
    >
      <div className="content">{children}</div>
      <div className="confirm">
        <Button label="확인" size="large" onClick={toggleModal} />
      </div>
    </Default>
  );
};
