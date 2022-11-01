import React, { useCallback, useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import _throttle from 'lodash/throttle';
import Button from '@/stories/Button';
import Field from '@/stories/Field';
import Modal from '@/stories/Modal';
import { InputType } from '@/stories/Input/Input';
import useInput from '@/hooks/useInput';
import useTimer from '@/hooks/useTimer';
import { ApiError, API_STATUS, confirmEmail, confirmId, IVerifyCodeResponse, verifyCode } from '@/api';
import { ROUTE, RULE } from '@/common';
import { openInNewTab, signupValidate } from '@/helper';
import './signUp.scss';

const Signup = () => {
  const DEFAULT_MS = 11113000;
  const [id, , handleId] = useInput('');
  const [pw, , handlePw] = useInput('');
  const [confirmPw, , handleConfirmPw] = useInput('');
  const [name, , handleName] = useInput('');
  const [email, , handleEmail] = useInput('');
  const [phone, , handlePhone] = useInput('');
  const [code, , handleCode] = useInput('');
  const [verifyCodeResponse, setVerifyCodeResponse] = useState<IVerifyCodeResponse>();
  const [apiError, setApiError] = useState<ApiError>();
  const [apiStatus, setApiStatus] = useState<API_STATUS>();
  const [ms, setMs, startTimer, clearTimer] = useTimer(DEFAULT_MS);
  const [isOpen, setIsOpen] = useState(false);
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
    const { SUCCESS, FAILURE } = API_STATUS;

    switch (apiStatus) {
      case FAILURE:
        return apiError?.message;
      case SUCCESS:
        return verifyCodeResponse?.message;
      default:
        return;
    }
  }, [phone, apiStatus, verifyCodeResponse, apiError]);

  const clickVerifyCode = useCallback(
    async (value: string, openModal: () => void) => {
      try {
        await setMs(DEFAULT_MS);
        await setApiStatus(API_STATUS.REQUEST);
        const response = await verifyCode({ phone });
        setVerifyCodeResponse(response);
        setApiStatus(API_STATUS.SUCCESS);
      } catch (error) {
        setApiStatus(API_STATUS.FAILURE);
        clearVerifyCode();
        if (error instanceof ApiError) setApiError(error);
      } finally {
        openModal();
      }
    },
    [phone, verifyCodeResponse, apiStatus],
  );

  const handlePhoneConfirm = useCallback(() => {
    if (apiStatus !== API_STATUS.SUCCESS) return;

    startTimer();
  }, [phone, apiStatus, ms]);

  const handleVerifyCodeConfirm = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  const getVerifyLoading = (value: string, isOpen: boolean) => isOpen;

  // confirmVerifyCode

  /* 
  const handleAddressSearch = useCallback(() => {
    openInNewTab(ROUTE.SHIPPING);
    setIsOpen((prevState) => !prevState);
  }, [isOpen]);
  */

  const clearVerifyCode = useCallback(() => {
    setVerifyCodeResponse(undefined);
    clearTimer();
  }, [ms, verifyCodeResponse]);

  useEffect(() => {
    if (ms === 0) {
      clearVerifyCode();
      setIsOpen(true);
    }
  }, [ms]);
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
          label="이메일˜"
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
          buttonProps={{ disabled: !phone }}
          onChange={handlePhone}
          onClick={_throttle(clickVerifyCode, 300)}
          onConfirm={handlePhoneConfirm}
          modalContent={getVerifyMsg}
          getLoadingStatus={getVerifyLoading}
        />
        {verifyCodeResponse?.status === 200 && (
          <Field
            description="인증번호가 오지 않는다면, 통신사 스팸 차단 서비스 혹은 휴대폰 번호 차단 여부를 확인해주세요. (마켓컬리 1644-1107)"
            inputProps={{
              maxLength: 6,
              ms,
              ignore: RULE.EXCEPT_NUM,
            }}
            button="인증번호 확인"
            buttonProps={{
              disabled: !code,
            }}
            onChange={handleCode}
            // onClick={confirmVerifyCode}
          />
        )}
      </div>

      <Modal isOpen={isOpen} onConfirm={handleVerifyCodeConfirm}>
        유효시간이 만료되었습니다.
        <br />
        다시 시도해 주세요.
      </Modal>
    </div>
  );
};

export default Signup;
