import React, { useCallback, useEffect, useState } from 'react';
import _throttle from 'lodash/throttle';
import { ApiError, API_STATUS, IResponse, validatePhoneCode, verifyCode } from '@/api';
import { RULE } from '@/common';
import useInput from '@/hooks/useInput';
import useTimer from '@/hooks/useTimer';
import Field from '@/stories/Field';
import { InputType } from '@/stories/Input/Input';
import Modal from '@/stories/Modal';

const VerifyPhone = () => {
  const DEFAULT_MS = 180000;
  const [phone, setPhone, handlePhone] = useInput('');
  const [code, , handleCode] = useInput('');
  const [verifyCodeResponse, setVerifyCodeResponse] = useState<IResponse>();
  const [validatePhoneCodeRes, setValidatePhoneCodeRes] = useState<IResponse>();
  const [apiError, setApiError] = useState<ApiError>();
  const [apiStatus, setApiStatus] = useState<API_STATUS>();
  const [ms, setMs, startTimer, clearTimer] = useTimer(DEFAULT_MS);
  const [isOpen, setIsOpen] = useState(false);

  const handleVerifyCode = useCallback(
    async (value: string, openModal: () => void) => {
      try {
        await setApiStatus(API_STATUS.REQUEST);
        await setMs(DEFAULT_MS);
        const response = await verifyCode({ phone });
        await setVerifyCodeResponse(response);
        await setApiStatus(API_STATUS.SUCCESS);
      } catch (err) {
        await setApiStatus(API_STATUS.FAILURE);
        if (err instanceof ApiError) setApiError(err);
      } finally {
        openModal();
      }
    },
    [phone, verifyCodeResponse, apiStatus],
  );

  const handleConfirmCode = useCallback(
    async (value: string, openModal: () => void) => {
      try {
        await setApiStatus(API_STATUS.REQUEST);
        const res = await validatePhoneCode({ phone, code });
        await clearVerifyCode();
        await setValidatePhoneCodeRes(res);
        await setApiStatus(API_STATUS.SUCCESS);
        await toggleModal();
      } catch (err) {
        await setApiStatus(API_STATUS.FAILURE);
        if (err instanceof ApiError) setApiError(err);
      } finally {
        openModal();
      }
    },
    [code, apiStatus, verifyCodeResponse, apiError, ms],
  );

  const handlePhoneConfirm = useCallback(() => {
    if (apiStatus !== API_STATUS.SUCCESS) return;

    startTimer();
  }, [phone, apiStatus, ms]);

  const handleVerifyCodeConfirm = useCallback(() => {
    /** 인증번호 확인 모달의 확인 버튼 누를 시. */
  }, [apiStatus]);

  const handleReVerifyCode = useCallback(() => {
    setPhone('');
    clearVerifyCode();
    clearValidatePhoneCode();
  }, [setPhone]);

  const clearVerifyCode = useCallback(() => {
    setVerifyCodeResponse(undefined);
    clearTimer();
  }, [ms, verifyCodeResponse]);

  const clearValidatePhoneCode = useCallback(() => {
    setValidatePhoneCodeRes(undefined);
  }, [validatePhoneCodeRes]);

  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), [isOpen]);

  const getLoadingBy = (isPhoneModalOpen: boolean) => isOpen || isPhoneModalOpen;

  const getApiErrorMsg = useCallback(() => {
    if (apiStatus === API_STATUS.FAILURE) return apiError?.message;

    const res = validatePhoneCodeRes || verifyCodeResponse;

    return res?.message;
  }, [phone, apiStatus, verifyCodeResponse, apiError, validatePhoneCodeRes]);

  useEffect(() => {
    if (ms === 0) {
      clearVerifyCode();
      setIsOpen(true);
    }
  }, [ms]);

  const isReVerifyCode = !!(verifyCodeResponse || validatePhoneCodeRes);
  const _handleVerifyCode = _throttle(isReVerifyCode ? handleReVerifyCode : handleVerifyCode, 300);
  const _handleConfirmCode = _throttle(handleConfirmCode, 300);

  return (
    <>
      <Field
        label="휴대폰"
        isRequired
        inputProps={{
          inputType: InputType.Phone,
          placeholder: '숫자만 입력해주세요',
          maxLength: 11,
          ignore: RULE.EXCEPT_NUM,
          readOnly: isReVerifyCode,
          defaultValue: phone,
        }}
        button={isReVerifyCode ? '다시 인증' : '인증번호 받기'}
        buttonProps={{ disabled: !phone }}
        onChange={handlePhone}
        onClick={_handleVerifyCode}
        onConfirm={handlePhoneConfirm}
        modalContent={getApiErrorMsg}
        getLoadingStatus={getLoadingBy}
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
          onClick={_handleConfirmCode}
          onConfirm={handleVerifyCodeConfirm}
          modalContent={getApiErrorMsg}
          getLoadingStatus={getLoadingBy}
        />
      )}

      <Modal isOpen={isOpen} onConfirm={toggleModal}>
        {!!validatePhoneCodeRes ? (
          '인증에 성공하였습니다.'
        ) : (
          <>
            유효시간이 만료되었습니다.
            <br />
            다시 시도해 주세요.
          </>
        )}
      </Modal>
    </>
  );
};

export default VerifyPhone;
