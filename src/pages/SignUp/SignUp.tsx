import React, { useCallback, useState, Dispatch, SetStateAction } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { confirmEmail, confirmId } from '@/api';
import { ROUTE, RULE } from '@/common';
import { openInNewTab, signupValidate } from '@/helper';
import Button from '@/stories/Button';
import Field from '@/stories/Field';
import { InputType } from '@/stories/Input/Input';
import Modal from '@/stories/Modal';
import { useInput } from '@/hooks/useInput';
import './signUp.scss';

const Signup = () => {
  const [id, , handleId] = useInput('');
  const [pw, , handlePw] = useInput('');
  const [confirmPw, , handleConfirmPw] = useInput('');
  const [name, , handleName] = useInput('');
  const [email, , handleEmail] = useInput('');
  const [address] = useLocalStorageState('address');
  const [isOpen, setIsOpen] = useState(false);

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

  const handleAddressSearch = useCallback(() => {
    openInNewTab(ROUTE.SHIPPING);
    setIsOpen((prevState) => !prevState);
  }, [isOpen]);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
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
          button="중복확인"
          inputProps={{
            placeholder: '아이디를 입력해주세요',
            inputType: InputType.Id,
            ignore: RULE.SPECIAL,
          }}
          onChange={handleId}
          modalContent={confirmAgain(InputType.Id)}
        />
        <Field
          label="비밀번호"
          isRequired
          inputProps={{
            type: 'password',
            placeholder: '비밀번호를 입력해주세요',
            inputType: InputType.Pw,
          }}
          onChange={handlePw}
        />
        <Field
          label="비밀번호 확인"
          isRequired
          inputProps={{
            type: 'password',
            placeholder: '비밀번호를 한번 더 입력해주세요',
            inputType: InputType.DoublePw,
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
          button="중복확인"
          inputProps={{
            inputType: InputType.Email,
            placeholder: '예: marketkurly@kurly.com',
            maxLength: 100,
          }}
          onChange={handleEmail}
          modalContent={confirmAgain(InputType.Email)}
        />
      </div>
      {/* <Button onClick={handleAddressSearch}>
        주소 검색
      </Button>       */}
    </div>
  );
};

export default Signup;
