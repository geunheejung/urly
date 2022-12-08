import React, { useCallback } from 'react';
import classNames from 'classnames';
import './dropdown.scss';

interface IDrondownProps {
  isOpen: boolean;
  toggle: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const Dropdown = ({ isOpen, toggle, children }: IDrondownProps) => {
  const handleMouseOver = useCallback(() => {
    toggle(true);
  }, [isOpen]);

  const handleMouseOut = useCallback(() => {
    toggle(false);
  }, [isOpen]);

  return (
    <div
      className={classNames('drop-down-menu', { show: isOpen })}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
    </div>
  );
};

export default Dropdown;
