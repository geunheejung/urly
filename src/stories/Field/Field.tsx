import React, {useState} from 'react';
import { Label, LabelProps } from '../Label/Label';
import { Button } from '../Button/Button';
import {Input, InputProps} from '../Input/Input';
import { Modal } from '../Modal/Modal';
import './field.scss';
import classNames from 'classnames';

interface FieldProps {
  className?: string;
  label: string;
  isRequired?: boolean;
  button?: string;
  modalContent?: (value: string) => React.ReactNode | string;
  inputProps: InputProps;
}

interface CompoundProps {
  children: React.ReactNode;
  className?: string;
}

const Wrapper = ({ className = '', children }: CompoundProps) => <div className={`storybook-field ${className}`}>{children}</div>
const Left = (props: LabelProps) => <div className="left"><Label {...props} /></div>;
const Center = ({ className = '', children }: CompoundProps) => <div className={`center ${className}`}>{children}</div>
const Right = ({ className = '', children }: CompoundProps) => <div className={`right ${className}`}>{children}</div>

export const Field = ({
  className,
  label,
  isRequired = false,
  button,
  modalContent,
  inputProps,
}: FieldProps) => {
  const [ value, setValue ] = useState('');
  const [ isOpen, setIsOpen ] = useState(false);

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
    <div 
    className={classNames('storybook-field', { [`${className}`]: className })}>
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
