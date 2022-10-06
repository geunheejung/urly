import React from 'react';
import DaumPostcodeEmbed, {Address} from 'react-daum-postcode';
import classNames from 'classnames';
import './postcode.scss';

interface IProps {
  primary: boolean;
  onComplete: (address: Address) => void;
}

export const Postcode = ({ primary, onComplete }: IProps) => {
  return (
    <DaumPostcodeEmbed
      style={{ width: 500 }}
      className={classNames('storybook-postcode', { primary })}
      onComplete={onComplete}
    />
  )
};

