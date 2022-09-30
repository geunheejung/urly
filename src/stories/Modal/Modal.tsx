import React, { useState } from 'react';
import classNames from 'classnames';
import {Button} from "../Button/Button";
import './modal.scss';

interface ModalProps {
  primary?: boolean;
  isOpen: boolean;
  value: string;
  onConfirm: () => void;
}

export const Modal = ({
  primary = true,
  isOpen,
  value,
  onConfirm,
  ...props
}: ModalProps) => {
  const [ _isOpen, setIsOpen ] = useState(isOpen);

  const toggleModal = () => {
    setIsOpen(!_isOpen);
    onConfirm();
  }

  return (
    <div className={classNames(`storybook-modal storybook-modal--primary`, { hide: _isOpen })}>
      <div className="inner">
        <div className="content">
        {value}
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