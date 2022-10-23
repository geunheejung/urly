import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import { AiOutlineSearch } from 'react-icons/ai';
import useLocalStorageState from 'use-local-storage-state';
import Input from '@/stories/Input';
import Field from "@/stories/Field";
import Button from "@/stories/Button";
import {ROUTE} from "@/common";
import './result.scss';
import Modal from '@/stories/Modal';

const Result = () => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ address, setAddress ] = useLocalStorageState('address', {
    defaultValue: { mainAddress: '', detailAddress: '' }
  });
  const navigate = useNavigate();  
  const { state: { mainAddress } } = useLocation();
  const [ detailAddress, setDetailAddress ] = useState('');
  const shippingInfo = {
    arrivalTime: '낮', // 샛별(dawn), 낮(afternoon), 배송불가(impossible),
  }

  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

  const handleChange = useCallback(
    (value: string) => setDetailAddress(value), 
    [ setDetailAddress ]
  );

  const handleResearch = useCallback(
    () => navigate(ROUTE.SHIPPING), 
    [ navigate ]
  );
  

  const submit = useCallback(() => {
    window.close();  
    navigate(ROUTE.SIGN_UP);    
    setAddress({ mainAddress, detailAddress });
  }, [ detailAddress, navigate, mainAddress, setAddress ]);

  const handleConfirm = useCallback(() => {       
    if (!detailAddress) return toggleModal();  
    submit();
  }, [ detailAddress, toggleModal, submit ]);

  return (
    <div className="address-result">
      <header>
        <h1><strong>{`${shippingInfo.arrivalTime}배송`}</strong>지역입니다.</h1>
        <h2>오늘 주문하면 다음 날 바로 도착해요. (일요일 휴무)</h2>
      </header>

      <Field.Wrapper className="input-field">
        <Field.Center>
          <Input
            disabled
            readOnly
            defaultValue={mainAddress}
          />
        </Field.Center>
        <Field.Right>
          <Button onClick={handleResearch}>
            <AiOutlineSearch />
            <span>재검색</span>
          </Button>
        </Field.Right>
      </Field.Wrapper>
      <Field.Wrapper className="input-field">
        <Field.Center>
          <Input
            placeholder="나머지 주소를 입력해 주세요"
            onChange={handleChange}
          />
        </Field.Center>
      </Field.Wrapper>
      <div className="description">
        <p>저장된 배송지는 최대 7일 간 임시 저장 후 자동 삭제됩니다.</p>
        <p>로그인 할 경우, 회원님의 배송지 목록에 추가됩니다.</p>
      </div>
      <Button
        primary
        label="저장"
        size="large"
        onClick={handleConfirm}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        onConfirm={submit}
      >    
        <p>나머지 주소를 입력하지 않으셨습니다. 이대로 저장하시겠습니까?</p>  
      </Modal>
    </div>
  )
}

export default Result;

