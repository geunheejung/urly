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
  const [ isOpen, setIsOpen ] = useState(false);
  const [ firstAddress, setFirstAddress ] = useState('');
  const [ secondAddress, setSecondAddress ] = useState('');

  const open = useDaumPostcodePopup();

  const handleClick = useCallback(() => {
    setIsOpen(prev => !prev);
    open({ onComplete: handleComplete, width: 500 });
  }, [ isOpen, firstAddress, secondAddress ]);

  const handleComplete = useCallback((address: AddressArgs) => {
    const { buildingName, address: address1 } = address
    const firstAddress = `${address1} (${buildingName})`;
    setFirstAddress(firstAddress);
  }, [ firstAddress, secondAddress, isOpen ]);

  const button = (
    <Button
      label={'주소 검색'}
      onClick={handleClick}
    />
  );

  return (
    <div className="storybook-field">
      <Field.Left
        label={'주소'}
        isRequired={true}
      />
      {/* 주소 검색 결과가 있어야 표시. */}
      <Field.Center>
        {
          isOpen ? (
            <>
              <Input
                defaultValue={firstAddress}
                readOnly={true}
              />
              <Input />
              <p className="description">배송지에 따라 상품 정보가 달라질 수 있습니다.</p>
            </>
          ) : button


        }
      </Field.Center>
      <Field.Right>{isOpen && button}</Field.Right>
    </div>
  )
}