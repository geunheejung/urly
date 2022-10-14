import React, {useCallback, useState} from 'react';
import classNames from 'classnames';
import './check.scss';

interface CheckProps {
  name: string;
  value: string;
  htmlFor: string;
  text: string;
}

export const Check = ({
  text,
  htmlFor,
  name,
  value,
}: CheckProps) => {
  const [ isChecked, setIsChecked ] = useState(false);

  const handleCheck = useCallback(() => {
    setIsChecked(prev => {
      return !prev;
    });
  }, [ isChecked ]);

  return (
    <div className="storybook-check">
      <label htmlFor={htmlFor}>
        <input
          id={htmlFor}
          type="radio"
          className="checkbox"
          name={name}
          value={value}
          onClick={handleCheck}
        />
        <div className={classNames('outer-radio', { selected: isChecked })}>
          <div className={classNames('inner-radio', { selected: isChecked })} />
        </div>
        <span className="description">{text}</span>
      </label>
    </div>
  )
};