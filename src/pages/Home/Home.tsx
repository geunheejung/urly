import React, {useCallback, useState} from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import Button from "@/stories/Button";
import {ROUTE} from "@/common";
import Default, { ThemeKey } from '@/components/Modal/Default';

const Home = () => {
  const [ isOpen, setIsOpen ] = useState(false);
  const navigate = useNavigate();
  const handleAddressSearch = useCallback(() => {
    navigate(ROUTE.SHIPPING);
    setIsOpen(prevState => !prevState);
  }, [ isOpen ]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [ isOpen ])

  return (
    <div>
      Home
      <Button onClick={handleAddressSearch}>
        주소 검색
      </Button>
      <Default
        isOpen={isOpen}
        themeKey={ThemeKey.Popup}
        onRequestClose={closeModal}
      >
        <Outlet />
      </Default>
    </div>
  )
}

export default Home;