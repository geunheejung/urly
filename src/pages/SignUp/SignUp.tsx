import React, { useCallback, useState } from 'react';
import _isBoolean from 'lodash/isBoolean';
import { useMutation } from 'react-query';
import useLocalStorageState from 'use-local-storage-state';
import useInput from '@/hooks/useInput';
import Button from '@/stories/Button';
import Field from '@/stories/Field';
import VerifyPhone from '@/containers/VerifyPhone';
import BirthInput from '@/components/BirthInput';
import Terms from '@/containers/Terms';
import Modal from '@/stories/Modal';
import Input from '@/stories/Input';
import { CheckList } from '@/stories/Check/List/CheckList';
import { IAddress } from '../ShippingAddress/Result';
import { InputType } from '@/stories/Input/Input';
import { GENDER, ROUTE, RULE } from '@/common';
import { openInNewTab, signupValidate } from '@/services/helper';
import { man, none, woman } from '@/stories/Check/Check.stories';
import { ITerms, TermsType } from '@/containers/Terms/Terms';
import { createUser, existsUser } from '@/services/api/user';
import { IUser, UserInfoType } from '../../../../types/api';
import './signUp.scss';

enum CheckValue {
  Recommend = 'RECOMMEND',
  Event = 'EVENT',
}

interface ValidatedData {
  id: InputType;
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
  const [phone, , handlePhone] = useInput('');
  const [address] = useLocalStorageState<IAddress>('address');
  const [_detailAddress, , handleDetailAddress] = useInput('');
  const [gender, setGender] = useState(GENDER.MALE);
  const [additionalType, setAdditionalType] = useState('');
  const [birth, setBirth] = useState('');
  const [joinExtra, setJoinExtra, updateJoinExtra] = useInput('');
  const [terms, setTerms] = useState<ITerms[]>();
  const [isRequiredTermsChecked, setIsRequiredTermsChecked] = useState(false);
  const [isConfirmationCode, setIsConfirmationCode] = useState(false); // 인증번호 확인 완료 시 true / 재인증 시 초기화
  const [notValidated, setNotValidated] = useState<{ id: InputType; message: string }>();
  const [modalValue, setModalValue] = useState('');

  const { mutate: createUserMutate } = useMutation(createUser, {});

  const { mutate: existsUserMutate } = useMutation(existsUser, {
    onSuccess: ({ isExists, message }, { field }) => {
      updateCheckedBy(field, isExists);
      setModalValue(message);
    },
  });

  const updateCheckedBy = (inputType: string, value: boolean) =>
    inputType === InputType.Id ? setIsIdChecked(value) : setIsEmailChecked(value);

  const validatedList: ValidatedData[] = [
    { id: InputType.Id, message: '아이디 중복체크 해주세요.', condition: isIdChecked },
    { id: InputType.Email, message: '이메일 중복체크 해주세요.', condition: isEmailChecked },
    { id: InputType.Phone, message: '휴대폰 인증 해주세요.', condition: isConfirmationCode },
    { id: InputType.Pw, message: '비밀번호를 입력해주세요', condition: !signupValidate(pw, InputType.Pw) }, // (1)비밀번호를 입력해주세요 (2) 비밀번호를 한번 더 입력해주세요
    {
      id: InputType.DoublePw,
      message: '비밀번호를 한번 더 입력해주세요',
      condition: !signupValidate(confirmPw, InputType.DoublePw),
    },
    {
      id: InputType.Terms,
      message: '필수인증약관 동의 해주세요.',
      condition: isRequiredTermsChecked,
    },
    { id: InputType.Name, message: '이름 입력 해주세요.', condition: !!name },
    {
      id: InputType.Address,
      message: '주소 입력 해주세요.',
      condition: !!(address && address.mainAddress),
    },
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

  const getConfirmPwMsg = useCallback(() => {
    const message = '';

    if (pw !== confirmPw) return '동일한 비밀번호 입력';

    return message;
  }, [pw, confirmPw]);

  const handleSearchAddress = useCallback(() => {
    openInNewTab(ROUTE.SHIPPING);
  }, []);

  const handleAdditional = useCallback(
    (value: string) => {
      setAdditionalType(value);
      setJoinExtra('');
    },
    [additionalType],
  );

  const validate = (): boolean => {
    const notValidated = validatedList.find((raw) => _isBoolean(raw.condition) && !raw.condition);

    if (notValidated) {
      toggle();
      setModalValue(notValidated.message);
    }

    setNotValidated(notValidated);

    return !!notValidated;
  };

  const handleSubmit = useCallback(async () => {
    if (validate() || !address || !terms) return;

    const { mainAddress, detailAddress } = address;

    const _terms = terms.reduce((prev: { [id: string]: boolean }, { id, isChecked, subTerms }) => {
      if (subTerms) subTerms.terms.forEach((sub) => (prev[sub.id] = sub.isChecked));

      prev[id] = isChecked;
      return prev;
    }, {}) as TermsType;

    // createUser 라는 hook을 만들고, 이 hook은 데이터를 받으면

    const data: IUser = {
      id,
      password: pw,
      name,
      phone,
      address: mainAddress,
      detailAddress: _detailAddress || detailAddress,
      gender,
      birth,
      additionalType,
      additionalValue: joinExtra,
      ..._terms,
    };

    await createUserMutate(data);
  }, [
    id,
    isIdChecked,
    isEmailChecked,
    isConfirmationCode,
    email,
    phone,
    pw,
    confirmPw,
    isRequiredTermsChecked,
    name,
    address,
  ]);

  const handleDoubleCheck = (inputType: InputType) =>
    useCallback(
      async (value: string) => {
        // 1. 양식 체크
        const warningMessage = signupValidate(value, inputType);
        const isValidated = !warningMessage;

        if (isValidated)
          // 2. 중복 체크
          await existsUserMutate({
            value,
            field: inputType === InputType.Id ? InputType.Id : InputType.Email,
          });

        updateCheckedBy(inputType, isValidated);
        setModalValue(warningMessage);
        toggle();
      },
      [id, email, isIdChecked, isEmailChecked, modalValue, isOpen],
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
    (isRequiredChecked: boolean, terms: ITerms[]) => {
      if (isRequiredChecked) setTerms(terms);
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

  const handleGender = useCallback(
    (gender: string) => {
      setGender(gender);
    },
    [gender],
  );

  const handleBirth = useCallback(
    (y: string, m: string, d: string) => {
      setBirth(`${y},${m},${d}`);
    },
    [birth],
  );

  const toggle = () => setIsOpen((prev) => !prev);

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
          disabled={isIdChecked}
          onClick={handleDoubleCheck(InputType.Id)}
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
          disabled={isEmailChecked}
          onClick={handleDoubleCheck(InputType.Email)}
        />
        <VerifyPhone onChange={handlePhone} setIsConfirmationCode={changeIsConfirmationCode} />
        <Field.Wrapper className="address-field">
          <Field.Left label="주소" isRequired />
          <Field.Center>
            {address ? (
              <>
                <Input defaultValue={address.mainAddress} readOnly />
                <Input
                  defaultValue={address.detailAddress}
                  placeholder="나머지 주소를 입력해주세요"
                  onChange={handleDetailAddress}
                />
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
            <CheckList checkList={[man, woman, none]} onClick={handleGender} />
          </Field.Center>
          <Field.Right />
        </Field.Wrapper>
        <Field.Wrapper className="birth-field">
          <Field.Left label="생년월일" />
          <Field.Center>
            <BirthInput setBirth={handleBirth} />
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
                },
                {
                  isChecked: false,
                  text: '참여 이벤트명',
                  id: 'additional-event',
                  name: 'joinExtraInputType',
                  value: CheckValue.Event,
                },
              ]}
              onClick={handleAdditional}
            />
          </Field.Center>
          <Field.Right />
        </Field.Wrapper>
        {additionalType && (
          <Field.Wrapper>
            <Field.Left />
            <Field.Center>
              <Input
                onChange={updateJoinExtra}
                placeholder={
                  additionalType === CheckValue.Recommend
                    ? '추천인 아이디를 입력해주세요.'
                    : '참여 이벤트명을 입력해 주세요.'
                }
                defaultValue={joinExtra}
              />
              <p className="description">
                {additionalType === CheckValue.Recommend ? (
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
        {modalValue}
      </Modal>
    </div>
  );
};

export default Signup;
