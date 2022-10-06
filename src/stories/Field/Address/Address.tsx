import React, { useState } from 'react';
import { Address as AddressArgs } from 'react-daum-postcode';
import { Field } from '../Field';
import Input from '../../Input';
import Postcode from '../../Modal/Postcode';
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
  const [ address, setAddress ] = useState<AddressArgs>();

  return (
    <div className="storybook-field">
      <Field.Left
        label={'주소'}
        isRequired={true}
      />
      {/* 주소 검색 결과가 있어야 표시. */}
      {address && <Field.Center>
        <Input />
        <Input />
      </Field.Center>
      }
      <Field.Right>
        <Button
          label={'주소 검색'}
        />
      </Field.Right>
    </div>
  )
}