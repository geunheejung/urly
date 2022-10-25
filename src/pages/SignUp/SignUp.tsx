import React, { useCallback, useState, Dispatch, SetStateAction } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import _throttle from 'lodash/throttle';
import { confirmEmail, confirmId } from '@/api';
import { ROUTE, RULE } from '@/common';
import { openInNewTab, signupValidate, verifyCode, IVerifyCodeResponse } from '@/helper';
import Button from '@/stories/Button';
import Field from '@/stories/Field';
import { InputType } from '@/stories/Input/Input';
import Modal from '@/stories/Modal';
import { useInput } from '@/hooks/useInput';
import './signUp.scss';

enum API_STATUS {
  REQUEST = 'REQUEST',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

const Signup = () => {
  const [id, , handleId] = useInput('');
  const [pw, , handlePw] = useInput('');
  const [confirmPw, , handleConfirmPw] = useInput('');
  const [name, , handleName] = useInput('');
  const [email, , handleEmail] = useInput('');
  const [phone, , handlePhone] = useInput('');
  const [verifyCodeResponse, setVerifyCodeResponse] = useState<IVerifyCodeResponse>();
  const [apiStatus, setApiStatus] = useState<API_STATUS>();
  const [address] = useLocalStorageState('address');

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

  const getVerifyMsg = useCallback(() => {
    if (!verifyCodeResponse) return;
    const { message } = verifyCodeResponse;

    return message;
  }, [phone, verifyCodeResponse]);

  const clickVerifyCode = useCallback(
    async (value: string, openModal: () => void) => {
      try {
        await setApiStatus(API_STATUS.REQUEST);
        const response = await verifyCode({ phone });
        await setVerifyCodeResponse(response);
        await setApiStatus(API_STATUS.SUCCESS);
      } catch (error) {
        await setApiStatus(API_STATUS.FAILURE);
      } finally {
        await openModal();
      }
    },
    [phone, verifyCodeResponse, apiStatus],
  );

  /* 
  const handleAddressSearch = useCallback(() => {
    openInNewTab(ROUTE.SHIPPING);
    setIsOpen((prevState) => !prevState);
  }, [isOpen]);
  */

  const isLoading = apiStatus === API_STATUS.REQUEST;

  console.log(apiStatus, isLoading);

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
        <Field
          label="휴대폰"
          isRequired
          inputProps={{
            inputType: InputType.Phone,
            placeholder: '숫자만 입력해주세요',
            maxLength: 11,
            ignore: RULE.EXCEPT_NUM,
          }}
          button="인증번호 받기"
          buttonProps={{
            disabled: !phone,
            isLoading: isLoading,
          }}
          onChange={handlePhone}
          onClick={_throttle(clickVerifyCode, 300)}
          modalContent={getVerifyMsg}
        />
      </div>
      {/* <Button onClick={handleAddressSearch}>
        주소 검색
      </Button>       */}
    </div>
  );
};

export default Signup;
