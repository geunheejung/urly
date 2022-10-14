import React, {useState} from 'react';
import { Label, LabelProps } from '../Label/Label';
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

const Wrapper = ({ children }: { children: React.ReactNode }) => <div className="storybook-field">{children}</div>
const Left = (props: LabelProps) => <div className="left"><Label {...props} /></div>;
const Center = ({ children }: { children: React.ReactNode }) => <div className="center">{children}</div>
const Right = ({ children }: { children: React.ReactNode }) => <div className="right">{children}</div>

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
      <Left
        label={label}
        isRequired={isRequired}
      />
      <Center>
        <Input
          {...inputProps}
          onChange={handleChange}
        />
      </Center>
      <Right>
        {button && <Button label={button} onClick={handleClick}/>}
      </Right>
      <Modal
        isOpen={isOpen}
        onConfirm={toggleModal}
      >
        {modalContent && modalContent(value)}
      </Modal>
    </div>
  )
}

Field.Wrapper = Wrapper;
Field.Left = Left;
Field.Center = Center;
Field.Right = Right;
