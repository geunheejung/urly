import React, {useState} from 'react';
import { Label } from '../Label/Label';
import { Button } from '../Button/Button';
import {Input, InputProps} from '../Input/Input';
import { Modal } from '../Modal/Modal';
import './field.scss';

interface FieldProps {
  label: string;
  isRequired?: boolean;
  button: string;
  modalContent?: (value: string) => React.ReactNode | string;
  inputProps: InputProps;
}

export const Field = ({
  label,
  isRequired = false,
  button,
  modalContent,
  inputProps,
}: FieldProps) => {
  const [ value, setValue ] = useState('');
  const [ isOpen, setIsOpen ] = useState(true);

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleClick = () => {
    toggleModal()
  }

  const toggleModal = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="storybook-field">
      <div className="left">
        <Label
          value={label}
          isRequired={isRequired}
        />
      </div>
      <div className="center">
        <Input
          {...inputProps}
          onChange={handleChange}
        />
      </div>
      <div className="right">
        {button && (
          <Button
            label={button}
            onClick={handleClick}
          />
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onConfirm={toggleModal}
      >
        {modalContent && modalContent(value)}
      </Modal>
    </div>
  )
}

