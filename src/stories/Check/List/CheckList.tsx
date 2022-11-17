import React, { useCallback, useState } from 'react';
import { ICheckProps, Check } from '../Check';
import './checkList.scss';

interface ICheckListProps {
  checkList: Array<ICheckProps>;
  onClick: (id: string) => void;
}

export const CheckList = ({ checkList, onClick }: ICheckListProps) => {
  const [_checkList, setCheckList] = useState(checkList);

  const handleClick = useCallback(
    ({ id, value }: ICheckProps) => {
      onClick(value || id);
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
      {_checkList.map((checkProps) => {
        const _handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
          const { onClick: _onClick } = checkProps;
          if (_onClick) _onClick(e);
          handleClick(checkProps);
        };
        return <Check key={checkProps.id} onClick={_handleClick} {...checkProps} />;
      })}
    </div>
  );
};
