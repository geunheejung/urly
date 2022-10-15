import React, {useCallback, useState} from 'react';
import Modal from 'react-modal';
import {Outlet, useNavigate} from "react-router-dom";
import Button from "@/stories/Button";
import Shipping from '@/pages/ShippingAddress/Shipping';
import {ROUTE} from "@/common";



const Home = () => {
  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: 530,
      height: 569,
      padding: 0,
    }
  }
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
      <Modal
        isOpen={isOpen}
        style={modalStyle}
        onRequestClose={closeModal}
        ariaHideApp={false}
        contentLabel="Example Modal"
      >
        <Outlet />
      </Modal>
    </div>
  )
}

export default Home;