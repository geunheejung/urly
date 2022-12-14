import React, { useCallback, useEffect, useState } from 'react';
import _throttle from 'lodash/throttle';
import { ApiError, API_STATUS, IResponse, validatePhoneCode, verifyCode } from '@/services/api/user';
import { RULE } from '@/common';
import useInput from '@/hooks/useInput';
import useTimer from '@/hooks/useTimer';
import Field from '@/stories/Field';
import { InputType } from '@/stories/Input/Input';
import Modal from '@/stories/Modal';

interface IVerifyPhoneProps {
  onChange: (value: string) => void;
  setIsConfirmationCode: (isConfirmationCode: boolean) => void;
}

const VerifyPhone = ({ onChange, setIsConfirmationCode }: IVerifyPhoneProps) => {
  const DEFAULT_MS = 180000;
  const [phone, setPhone, handlePhone] = useInput('');
  const [code, setCode] = useState('');
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
        // ?????? ???, ???????????? ?????? ?????? ????????? ??????
        setIsConfirmationCode(true);
      } catch (err) {
        await setApiStatus(API_STATUS.FAILURE);
        setIsConfirmationCode(false);
        if (err instanceof ApiError) setApiError(err);
      } finally {
        openModal();
      }
    },
    [code, apiStatus, verifyCodeResponse, apiError, ms],
  );

  const handleCode = useCallback(
    (value: string) => {
      setCode(value);
      onChange(value);
    },
    [code],
  );

  const handlePhoneConfirm = useCallback(() => {
    if (apiStatus !== API_STATUS.SUCCESS) return;

    startTimer();
  }, [phone, apiStatus, ms]);

  const handleVerifyCodeConfirm = useCallback(() => {
    /** ???????????? ?????? ????????? ?????? ?????? ?????? ???. */
  }, [apiStatus]);

  const handleReVerifyCode = useCallback(() => {
    setIsConfirmationCode(false);
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
        label="?????????"
        isRequired
        inputProps={{
          inputType: InputType.Phone,
          placeholder: '????????? ??????????????????',
          maxLength: 11,
          ignore: RULE.EXCEPT_NUM,
          readOnly: isReVerifyCode,
          defaultValue: phone,
        }}
        button={isReVerifyCode ? '?????? ??????' : '???????????? ??????'}
        buttonProps={{ disabled: !phone }}
        onChange={handlePhone}
        onClick={_handleVerifyCode}
        onConfirm={handlePhoneConfirm}
        modalMessage={getApiErrorMsg()}
        getLoadingStatus={getLoadingBy}
      />
      {verifyCodeResponse?.status === 200 && (
        <Field
          description="??????????????? ?????? ????????????, ????????? ?????? ?????? ????????? ?????? ????????? ?????? ?????? ????????? ??????????????????. (???????????? 1644-1107)"
          inputProps={{
            maxLength: 6,
            ms,
            ignore: RULE.EXCEPT_NUM,
          }}
          button="???????????? ??????"
          buttonProps={{
            disabled: !code,
          }}
          onChange={handleCode}
          onClick={_handleConfirmCode}
          onConfirm={handleVerifyCodeConfirm}
          modalMessage={getApiErrorMsg()}
          getLoadingStatus={getLoadingBy}
        />
      )}

      <Modal isOpen={isOpen} onConfirm={toggleModal}>
        {!!validatePhoneCodeRes ? (
          '????????? ?????????????????????.'
        ) : (
          <>
            ??????????????? ?????????????????????.
            <br />
            ?????? ????????? ?????????.
          </>
        )}
      </Modal>
    </>
  );
};

export default VerifyPhone;
