import React, {useState} from 'react';
import { Label, LabelProps } from '../Label/Label';
import { Button } from '../Button/Button';
import {Input, InputProps} from '../Input/Input';
import { Modal } from '../Modal/Modal';
import './field.scss';
import classNames from 'classnames';

interface FieldProps {
  inputProps: InputProps;  
  className?: string;
  label: string;
  isRequired?: boolean;
  button?: string;    
  modalContent?: (value: string) => React.ReactNode | string;    
  handleClick?: () => void;
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
  inputProps,
  handleClick,
}: FieldProps) => {    
  return (
    <div 
    className={classNames('storybook-field', { [`${className}`]: className })}>
      <Left
        label={label}
        isRequired={isRequired}
      />
      <Center>
        <Input {...inputProps} />
      </Center>
      <Right>
        {button && <Button label={button} onClick={handleClick}/>}
      </Right>      
    </div>
  )
}

Field.Wrapper = Wrapper;
Field.Left = Left;
Field.Center = Center;
Field.Right = Right;
