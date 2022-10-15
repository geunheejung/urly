import React, {useCallback, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import { AiOutlineSearch } from 'react-icons/ai';
import Input from '@/stories/Input';
import Field from "@/stories/Field";
import Button from "@/stories/Button";
import {ROUTE} from "@/common";
import './result.scss';

const Result = () => {
  const navigate = useNavigate();
  const { state: { mainAddress } } = useLocation();
  const [ detailAddress, setDetailAddress ] = useState('');
  const shippingInfo = {
    arrivalTime: '낮', // 샛별(dawn), 낮(afternoon), 배송불가(impossible),
  }

  const handleChange = useCallback((value: string) => {
    setDetailAddress(value);
  }, [ detailAddress ]);

  const handleResearch = useCallback(() => {
    navigate(ROUTE.SHIPPING);
  }, []);

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
      />
    </div>
  )
}

export default Result;

