import React, { useCallback, useState } from 'react';
import { ICheckProps, Check } from '../Check';
import './checkList.scss';

interface ICheckListProps {
  checkList: Array<ICheckProps>;
}

export const CheckList = ({ checkList }: ICheckListProps) => {
  const [_checkList, setCheckList] = useState(checkList);

  const handleClick = useCallback(
    ({ id }: ICheckProps) => {
      setCheckList((prev) =>
        prev.map((raw) => {
          raw.isChecked = raw.id === id;

          return raw;
        }),
      );
    },
    [_checkList],
  );

  return (
    <div className="checkList-wrapper">
      {_checkList.map((checkProps) => (
        <Check key={checkProps.id} onClick={() => handleClick(checkProps)} {...checkProps} />
      ))}
    </div>
  );
};
