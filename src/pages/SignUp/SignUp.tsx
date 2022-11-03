import React, { useCallback, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import Button from '@/stories/Button';
import Field from '@/stories/Field';
import VerifyPhone from '@/containers/VerifyPhone';
import { InputType } from '@/stories/Input/Input';
import Input from '@/stories/Input';
import useInput from '@/hooks/useInput';
import { confirmEmail, confirmId } from '@/api';
import { ROUTE, RULE } from '@/common';
import { openInNewTab, signupValidate } from '@/helper';
import { IAddress } from '../ShippingAddress/Result';
import { CheckList } from '@/stories/Check/List/CheckList';
import { man, none, woman } from '@/stories/Check/Check.stories';
import './signUp.scss';
import BirthInput from '@/components/BirthInput';

const Signup = () => {
  const [id, , handleId] = useInput('');
  const [pw, , handlePw] = useInput('');
  const [confirmPw, , handleConfirmPw] = useInput('');
  const [name, , handleName] = useInput('');
  const [email, , handleEmail] = useInput('');
  const [isOpen, setIsOpen] = useState(false);
  const [address] = useLocalStorageState<IAddress>('address');

  const confirmAgain = (inputType: InputType) => (value: string) => {
    const message = signupValidate(value, inputType);

    if (message) return message;

    const isValidated = inputType === InputType.Id ? confirmId(value) : confirmEmail(value);

    return isValidated ? '사용 불가능 합니다.' : '사용 가능 합니다.';
  };

  const getConfirmPwMsg = useCallback(() => {
    const message = '';

    if (pw !== confirmPw) return '동일한 비밀번호 입력';

    return message;
  }, [pw, confirmPw]);

  const handleSearchAddress = useCallback(() => {
    openInNewTab(ROUTE.SHIPPING);
  }, [isOpen]);

  return (
    <div className="signup">
      <div className="title">회원가입</div>
      <div className="content">
        <div className="description">
          <span>*</span> 필수입력사항
        </div>

        <Field
          label="아이디"
          isRequired
          inputProps={{
            inputType: InputType.Id,
            placeholder: '아이디를 입력해주세요',
            ignore: RULE.SPECIAL,
          }}
          onChange={handleId}
          button="중복확인"
          modalContent={confirmAgain(InputType.Id)}
        />
        <Field
          label="비밀번호"
          isRequired
          inputProps={{
            type: 'password',
            inputType: InputType.Pw,
            placeholder: '비밀번호를 입력해주세요',
          }}
          onChange={handlePw}
        />
        <Field
          label="비밀번호 확인"
          isRequired
          inputProps={{
            type: 'password',
            inputType: InputType.DoublePw,
            placeholder: '비밀번호를 한번 더 입력해주세요',
            warningMessage: getConfirmPwMsg,
          }}
          onChange={handleConfirmPw}
        />
        <Field
          label="이름"
          isRequired
          inputProps={{
            inputType: InputType.Name,
            placeholder: '이름을 입력해주세요',
            ignore: RULE.SPECIAL,
          }}
          onChange={handleName}
        />
        <Field
          label="이메일"
          isRequired
          inputProps={{
            inputType: InputType.Email,
            placeholder: '예: marketkurly@kurly.com',
            maxLength: 100,
          }}
          onChange={handleEmail}
          button="중복확인"
          modalContent={confirmAgain(InputType.Email)}
        />
        <VerifyPhone />

        <Field.Wrapper className="address-field">
          <Field.Left label="주소" isRequired />
          <Field.Center>
            {address ? (
              <>
                <Input defaultValue={address.mainAddress} readOnly />
                <Input defaultValue={address.detailAddress} placeholder="나머지 주소를 입력해주세요" />
                <div className="description">택배배송</div>
              </>
            ) : (
              <Button label="주소 검색" onClick={handleSearchAddress} />
            )}

            <div className="description">배송지에 따라 상품 정보가 달라질 수 있습니다.</div>
          </Field.Center>
          <Field.Right>{address && <Button label="재검색" onClick={handleSearchAddress} />}</Field.Right>
        </Field.Wrapper>
        <Field.Wrapper>
          <Field.Left label="성별" />
          <Field.Center>
            <CheckList checkList={[man, woman, none]} />
          </Field.Center>
          <Field.Right />
        </Field.Wrapper>
        <BirthInput />
      </div>
    </div>
  );
};

export default Signup;
