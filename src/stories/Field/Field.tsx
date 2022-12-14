import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Label, LabelProps } from '../Label/Label';
import { Button, ButtonProps } from '../Button/Button';
import Input, { InputProps } from '../Input/Input';
import { Modal } from '../Modal/Modal';
import './field.scss';

interface FieldProps {
  description?: string;
  disabled?: boolean;
  inputProps: InputProps;
  buttonProps?: ButtonProps;
  className?: string;
  label?: string;
  isRequired?: boolean;
  button?: string;
  onChange?: (value: string) => void;
  onClick?: (value: string, openModal: () => void) => void;
  modalMessage?: string;
  onConfirm?: () => void;
  getLoadingStatus?: (isOpen: boolean) => boolean;
}

const Field = ({
  description,
  inputProps,
  buttonProps,
  onClick,
  label = '',
  className,
  isRequired = false,
  disabled,
  button,
  modalMessage,
  onChange,
  onConfirm,
  getLoadingStatus,
}: FieldProps) => {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (onClick) return onClick(value, toggle);
    toggle();
  }, [value, isOpen]);

  const toggleModal = useCallback(() => {
    if (onConfirm) onConfirm();
    toggle();
  }, [isOpen]);

  const handleChange = useCallback(
    (value: string) => {
      setValue(value);
      if (onChange) onChange(value);
    },
    [value],
  );

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  const _buttonProps = { ...buttonProps };

  if (getLoadingStatus) _buttonProps.isLoading = getLoadingStatus(isOpen);

  return (
    <div className={classNames('storybook-field', { [`${className}`]: className })}>
      <Left label={label} isRequired={isRequired} />
      <Center>
        <Input onChange={handleChange} {...inputProps} />
        {description && <div className="description">{description}</div>}
      </Center>
      <Right>{button && <Button disabled={disabled} label={button} onClick={handleClick} {..._buttonProps} />}</Right>

      {modalMessage && (
        <Modal isOpen={isOpen} onConfirm={toggleModal}>
          {modalMessage}
        </Modal>
      )}
    </div>
  );
};

interface CompoundProps {
  children?: React.ReactNode;
  className?: string;
}

const Wrapper = ({ className = '', children }: CompoundProps) => (
  <div className={classNames('storybook-field', { [className]: !!className })}>{children}</div>
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

export default Field;
