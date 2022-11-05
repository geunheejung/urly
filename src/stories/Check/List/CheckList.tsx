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
      {_checkList.map((checkProps) => {
        const _handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
          const { onClick, id, value = '' } = checkProps;
          if (onClick) onClick(e);
          handleClick(checkProps);
        };
        return <Check {...checkProps} key={checkProps.id} onClick={_handleClick} />;
      })}
    </div>
  );
};
