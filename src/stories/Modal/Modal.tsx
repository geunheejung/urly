import React, { useState } from 'react';
import Default from '../../components/Modal/Default';
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
    <Default
      isOpen={isOpen}
      overlayClassName="storybook-form-modal_overlay"
      className="inner"
      onRequestClose={onConfirm}
    >
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
    </Default>
  )
}