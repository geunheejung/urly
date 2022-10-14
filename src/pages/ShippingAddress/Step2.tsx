import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import Input from '@/stories/Input';
import Field from "@/stories/Field";
import Button from "@/stories/Button";

const Step2 = () => {
  const shippingInfo = {
    arrivalTime: '낮', // 샛별(dawn), 낮(afternoon), 배송불가(impossible),
  }
  return (
    <div className="address-result">
      <header>
        <h1>{shippingInfo.arrivalTime}</h1>
        <h2>오늘 주문하면 다음 날 바로 도착해요. (일요일 휴무)</h2>
      </header>

      <Field.Wrapper>
        <Field.Center>
          <Input
            disabled
            readOnly
            defaultValue="경기 파주시 조리읍"
          />
        </Field.Center>
        <Field.Right>
          <Button>
            <AiOutlineSearch />
            <span>재검색</span>
          </Button>
        </Field.Right>
      </Field.Wrapper>
      <Field.Wrapper>
        <Field.Center>
          <Input />
        </Field.Center>
      </Field.Wrapper>
      <div className="description">
        <p>저장된 배송지는 최대 7일 간 임시 저장 후 자동 삭제됩니다.</p>
        <p>로그인 할 경우, 회원님의 배송지 목록에 추가됩니다.</p>
      </div>
      <div>
        <Button primary label="저장" />
      </div>
    </div>
  )
}

export default Step2;

