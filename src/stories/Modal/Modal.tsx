import classNames from 'classnames';
import React from 'react';
import Default from '../../components/Modal/Default';
import {Button} from "../Button/Button";
import './modal.scss';

interface ModalProps extends ReactModal.Props {
  primary?: boolean;
  className?: string;
  isOpen: boolean;
  onConfirm: () => void;
  children: React.ReactNode,
}

export const Modal = ({
  primary = true,
  className, 
  isOpen,
  onConfirm,
  children,
  ...props
}: ModalProps) => {  
  const toggleModal = () => {  
    onConfirm();
  }

  const modalClassName = classNames(
    'inner', 
    { 
      [`${className}`]: !!className,
      secondary: !primary
    }
  );

  return (
    <Default
      isOpen={isOpen}
      overlayClassName="storybook-form-modal_overlay"
      className={modalClassName}
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