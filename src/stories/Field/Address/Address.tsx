import React, {useCallback, useState} from 'react';
import { Address as AddressArgs, useDaumPostcodePopup } from 'react-daum-postcode';
import { Field } from '../Field';
import Input from '../../Input';
import Button from '../../Button';

interface AddressProps {
}
/*
* 1. 주소 검색 버튼 클릭
* 2. 카카오 주소 검색 api 모달에서 주소 검색 후 반환
* 3. 주소 검색 모달 닫힘
* 4. 검색 결과 Input에 표시.
* */
export const Address = (props: AddressProps) => {
  const open = useDaumPostcodePopup();
  const [ mainAddress, setMainAddress ] = useState('');
  const [ subAddress, setSubAddress ] = useState('');

  const searchPopupOpen = () => {
    setIsOpen(prev => !prev);
    open({ onComplete: handleComplete, width: 500 }); 
  }

  const handleClick = useCallback(() => {
    searchPopupOpen();
  }, [ mainAddress, subAddress, searchPopupOpen ]);

  const handleComplete = useCallback((searchedAddress: AddressArgs) => {
    const { buildingName, address } = searchedAddress
    const mainAddress = `${address} (${buildingName})`;
    setMainAddress(mainAddress);
  }, [ mainAddress, subAddress ]);

  // 모든 데이터가 충족될 시 입력된 데이터를 표기한다.
  const isComplete = !!mainAddress;

  return (
    <div className="storybook-field">
      <Field.Left
        label={'주소'}
        isRequired={true}
      />
      {/* 주소 검색 결과가 있어야 표시. */}
      <Field.Center>
        {
          isComplete ? (
            // 주소 표기
            <div className='address-wrapper'>
              <Input defaultValue={mainAddress} readOnly={true} />
              <Input />
              <p className="description">배송지에 따라 상품 정보가 달라질 수 있습니다.</p>
            </div>
          ) : (
            <Button label="주소 검색" onClick={handleClick} />
          )m
        }
      </Field.Center>
      <Field.Right>{isComplete && <Button label="재검색" onClick={handleClick} />}</Field.Right>
    </div>
  )
}