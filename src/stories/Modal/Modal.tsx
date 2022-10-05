import React, { useState } from 'react';
import classNames from 'classnames';
import {Button} from "../Button/Button";
import './modal.scss';

interface ModalProps {
  primary?: boolean;
  isOpen: boolean;
  onConfirm: () => void;
  children: React.ReactNode,
}

export const Modal = ({
  primary = true,
  isOpen,
  onConfirm,
  children,
  ...props
}: ModalProps) => {
  const toggleModal = () => {
    onConfirm();
  }

  return (
    <div className={classNames(`storybook-modal storybook-modal--primary`, { hide: isOpen })}>
      <div className="inner">
        <div className="content">
        {children}
        </div>
        <div className="confirm">
          <Button
            label="확인"
            size="large"
            onClick={toggleModal}
          />
        </div>
      </div>
    </div>
  )
}