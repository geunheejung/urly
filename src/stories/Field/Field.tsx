import React, { ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import { Label, LabelProps } from '../Label/Label';
import { Button, ButtonProps } from '../Button/Button';
import { Input, InputProps } from '../Input/Input';
import { Modal } from '../Modal/Modal';
import './field.scss';

interface FieldProps {
  disabled?: boolean;
  inputProps: InputProps;
  buttonProps?: ButtonProps;
  className?: string;
  label: string;
  isRequired?: boolean;
  button?: string;
  onChange?: (value: string) => void;
  onClick?: (value: string, openModal: () => void) => void;
  modalContent?: (value: string) => ReactNode;
}

export const Field = ({
  inputProps,
  buttonProps,
  onClick,
  label,
  className,
  isRequired = false,
  button,
  modalContent,
  onChange,
}: FieldProps) => {
  const [value, setValue] = useState('');
  const [_isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (onClick) return onClick(value, toggleModal);
    toggleModal();
  }, [value, _isOpen]);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [_isOpen]);

  const handleChange = useCallback(
    (value: string) => {
      setValue(value);

      if (onChange) onChange(value);
    },
    [value],
  );

  return (
    <div className={classNames('storybook-field', { [`${className}`]: className })}>
      <Left label={label} isRequired={isRequired} />
      <Center>
        <Input onChange={handleChange} {...inputProps} />
      </Center>
      <Right>{button && <Button label={button} onClick={handleClick} {...buttonProps} />}</Right>

      <Modal isOpen={_isOpen} onConfirm={toggleModal}>
        {modalContent && modalContent(value)}
      </Modal>
    </div>
  );
};

interface CompoundProps {
  children: React.ReactNode;
  className?: string;
}

const Wrapper = ({ className = '', children }: CompoundProps) => (
  <div className={`storybook-field ${className}`}>{children}</div>
);
const Left = (props: LabelProps) => (
  <div className="left">
    <Label {...props} />
  </div>
);
const Center = ({ className = '', children }: CompoundProps) => <div className={`center ${className}`}>{children}</div>;
const Right = ({ className = '', children }: CompoundProps) => <div className={`right ${className}`}>{children}</div>;

Field.Wrapper = Wrapper;
Field.Left = Left;
Field.Center = Center;
Field.Right = Right;
