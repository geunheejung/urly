import React, { useCallback, useState } from 'react';
import _isBoolean from 'lodash/isBoolean';
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
import BirthInput from '@/components/BirthInput';
import './signUp.scss';
import Terms from '@/containers/Terms';
import Modal from '@/stories/Modal';

enum CheckValue {
  Recommend = 'RECOMMEND',
  Event = 'EVENT',
}

interface ValidatedData {
  id: InputType;
  data: any;
  message: string;
  condition?: boolean;
}

const Signup = () => {
  const [id, setId] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [pw, , handlePw] = useInput('');
  const [confirmPw, , handleConfirmPw] = useInput('');
  const [name, , handleName] = useInput('');
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [verifyCode, , handleVerifyCode] = useInput('');
  const [address] = useLocalStorageState<IAddress>('address');
  const [additionalValue, setAdditionalValue] = useState('');
  const [joinExtra, setJoinExtra, updateJoinExtra] = useInput('');
  const [isRequiredTermsChecked, setIsRequiredTermsChecked] = useState(false);
  const [isConfirmationCode, setIsConfirmationCode] = useState(false); // 인증번호 확인 완료 시 true / 재인증 시 초기화
  const [notValidated, setNotValidated] = useState<{ id: InputType; message: string }>();
  const validatedList: ValidatedData[] = [
    { id: InputType.Id, data: id, message: '아이디 중복체크 해주세요.', condition: isIdChecked },
    { id: InputType.Email, data: email, message: '이메일 중복체크 해주세요.', condition: isEmailChecked },
    { id: InputType.Phone, data: verifyCode, message: '휴대폰 인증 해주세요.', condition: isConfirmationCode },
    { id: InputType.Pw, data: pw, message: '비밀번호를 입력해주세요', condition: !signupValidate(pw, InputType.Pw) }, // (1)비밀번호를 입력해주세요 (2) 비밀번호를 한번 더 입력해주세요
    {
      id: InputType.DoublePw,
      data: pw,
      message: '비밀번호를 한번 더 입력해주세요',
      condition: !signupValidate(confirmPw, InputType.DoublePw),
    },
    {
      id: InputType.Terms,
      data: isRequiredTermsChecked,
      message: '필수인증약관 동의 해주세요.',
      condition: isRequiredTermsChecked,
    },
    { id: InputType.Name, data: name, message: '이름 입력 해주세요.' },
    { id: InputType.Address, data: address, message: '주소 입력 해주세요.' },
  ];

  const handleId = useCallback(
    (value: string) => {
      setId(value);
      setIsIdChecked(false);
    },
    [id],
  );

  const handleEmail = useCallback(
    (value: string) => {
      setEmail(value);
      setIsEmailChecked(false);
    },
    [email],
  );

  const confirmAgain = useCallback(
    (inputType: InputType, value: string) => {
      const message = signupValidate(value, inputType);

      if (message) return message;

      const isId = inputType === InputType.Id;
      const isValidated = isId ? confirmId(value) : confirmEmail(value);

      return isValidated ? '사용 불가능 합니다.' : '사용 가능 합니다.';
    },
    [notValidated, id, email],
  );

  const getConfirmPwMsg = useCallback(() => {
    const message = '';

    if (pw !== confirmPw) return '동일한 비밀번호 입력';

    return message;
  }, [pw, confirmPw]);

  const handleSearchAddress = useCallback(() => {
    openInNewTab(ROUTE.SHIPPING);
  }, []);

  const clickAdditional = useCallback(
    ({ currentTarget: { value } }: React.MouseEvent<HTMLInputElement>) => {
      setAdditionalValue(value);
      setJoinExtra('');
    },
    [additionalValue],
  );

  const handleSubmit = useCallback(() => {
    const notValidated = validatedList.find((raw) => {
      debugger;
      return _isBoolean(raw.condition) && !raw.condition;
    });

    if (notValidated) toggle();

    setNotValidated(notValidated);
  }, [
    id,
    isIdChecked,
    isEmailChecked,
    isConfirmationCode,
    email,
    verifyCode,
    pw,
    confirmPw,
    isRequiredTermsChecked,
    name,
    address,
  ]);

  const handleDoubleCheck = (id: InputType) =>
    useCallback(
      (value: string, toggle: () => void) => {
        const isValidated = !signupValidate(value, id);
        if (id === InputType.Id) setIsIdChecked(isValidated);
        else setIsEmailChecked(isValidated);
        toggle();
      },
      [isIdChecked, isEmailChecked, id, email],
    );

  const handleConfirm = useCallback(() => {
    toggle();
  }, [notValidated, isOpen]);

  const handleAfterClose = () => {
    if (!notValidated) return;

    const key = `member${notValidated.id}`;

    const input = document.getElementById(key);

    if (!input) return;

    input.focus();
  };

  const setRequiredChecked = useCallback(
    (isRequiredChecked: boolean) => {
      setIsRequiredTermsChecked(isRequiredChecked);
    },
    [isRequiredTermsChecked],
  );

  const changeIsConfirmationCode = useCallback(
    (isConfirmationCode: boolean) => {
      setIsConfirmationCode(isConfirmationCode);
    },
    [isConfirmationCode],
  );

  const toggle = () => setIsOpen((prev) => !prev);

  console.log(isConfirmationCode);

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
          onClick={handleDoubleCheck(InputType.Id)}
          modalMessage={confirmAgain(InputType.Id, id)}
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
          onClick={handleDoubleCheck(InputType.Email)}
          modalMessage={confirmAgain(InputType.Email, email)}
        />
        <VerifyPhone
          onChange={handleVerifyCode}
          setIsConfirmationCode={changeIsConfirmationCode}
          //
        />

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
        <Field.Wrapper className="birth-field">
          <Field.Left label="생년월일" />
          <Field.Center>
            <BirthInput />
          </Field.Center>
          <Field.Right />
        </Field.Wrapper>
        <Field.Wrapper>
          <Field.Left label="추가입력 사항" />
          <Field.Center>
            <CheckList
              checkList={[
                {
                  isChecked: false,
                  text: '친구초대 추천인 아이디',
                  id: 'additional-recommender',
                  name: 'joinExtraInputType',
                  value: CheckValue.Recommend,
                  onClick: clickAdditional,
                },
                {
                  isChecked: false,
                  text: '참여 이벤트명',
                  id: 'additional-event',
                  name: 'joinExtraInputType',
                  value: CheckValue.Event,
                  onClick: clickAdditional,
                },
              ]}
            />
          </Field.Center>
          <Field.Right />
        </Field.Wrapper>
        {additionalValue && (
          <Field.Wrapper>
            <Field.Left />
            <Field.Center>
              <Input
                onChange={updateJoinExtra}
                placeholder={
                  additionalValue === CheckValue.Recommend
                    ? '추천인 아이디를 입력해주세요.'
                    : '참여 이벤트명을 입력해 주세요.'
                }
                defaultValue={joinExtra}
              />
              <p className="description">
                {additionalValue === CheckValue.Recommend ? (
                  '가입 후 7일 내 첫 주문 배송완료 시, 친구초대 이벤트 적립금이 지급됩니다.'
                ) : (
                  <>
                    '추천인 아이디와 참여 이벤트명 중 하나만 선택 가능합니다.
                    <br />
                    가입 이후는 수정이 불가능 합니다.
                    <br />
                    대소문자 및 띄어쓰기에 유의해주세요.'
                  </>
                )}
              </p>
            </Field.Center>
            <Field.Right />
          </Field.Wrapper>
        )}
        <div className="line" />
        <Field.Wrapper className="all-agree-field">
          <Field.Left label="이용약관동의" isRequired />
          <Field.Center>
            <Terms setRequiredChecked={setRequiredChecked} />
          </Field.Center>
        </Field.Wrapper>
        <div className="submit">
          <Button primary size="large" onClick={handleSubmit}>
            가입하기
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onConfirm={handleConfirm} onAfterClose={handleAfterClose}>
        {notValidated && notValidated.message}
      </Modal>
    </div>
  );
};

export default Signup;
