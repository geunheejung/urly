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
  const [isConfirmationCode, setIsConfirmationCode] = useState(false); // ???????????? ?????? ?????? ??? true / ????????? ??? ?????????
  const [notValidated, setNotValidated] = useState<{ id: InputType; message: string }>();
  const [modalValue, setModalValue] = useState('');

  const { mutate: createUserMutate } = useMutation(createUser, {});

  const { mutate: existsUserMutate } = useMutation(existsUser, {
    onSuccess: ({ isExists, message }, { field }) => {
      updateCheckedBy(field, !isExists);
      setModalValue(message);
    },
  });

  const updateCheckedBy = (inputType: string, value: boolean) =>
    inputType === InputType.Id ? setIsIdChecked(value) : setIsEmailChecked(value);

  const validatedList: ValidatedData[] = [
    { id: InputType.Id, message: '????????? ???????????? ????????????.', condition: isIdChecked },
    { id: InputType.Email, message: '????????? ???????????? ????????????.', condition: isEmailChecked },
    { id: InputType.Phone, message: '????????? ?????? ????????????.', condition: isConfirmationCode },
    { id: InputType.Pw, message: '??????????????? ??????????????????', condition: !signupValidate(pw, InputType.Pw) }, // (1)??????????????? ?????????????????? (2) ??????????????? ?????? ??? ??????????????????
    {
      id: InputType.DoublePw,
      message: '??????????????? ?????? ??? ??????????????????',
      condition: !signupValidate(confirmPw, InputType.DoublePw),
    },
    {
      id: InputType.Terms,
      message: '?????????????????? ?????? ????????????.',
      condition: isRequiredTermsChecked,
    },
    { id: InputType.Name, message: '?????? ?????? ????????????.', condition: !!name },
    {
      id: InputType.Address,
      message: '?????? ?????? ????????????.',
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

    if (pw !== confirmPw) return '????????? ???????????? ??????';

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
    const notValidated = validatedList.find((raw) => !raw.condition);

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

    // createUser ?????? hook??? ?????????, ??? hook??? ???????????? ?????????

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
        // 1. ?????? ??????
        const warningMessage = signupValidate(value, inputType);
        const isValidated = !warningMessage;

        if (isValidated)
          // 2. ?????? ??????
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
      <div className="title">????????????</div>
      <div className="content">
        <div className="description">
          <span>*</span> ??????????????????
        </div>

        <Field
          label="?????????"
          isRequired
          inputProps={{
            inputType: InputType.Id,
            placeholder: '???????????? ??????????????????',
            ignore: RULE.SPECIAL,
          }}
          onChange={handleId}
          button="????????????"
          disabled={isIdChecked}
          onClick={handleDoubleCheck(InputType.Id)}
        />
        <Field
          label="????????????"
          isRequired
          inputProps={{
            type: 'password',
            inputType: InputType.Pw,
            placeholder: '??????????????? ??????????????????',
          }}
          onChange={handlePw}
        />
        <Field
          label="???????????? ??????"
          isRequired
          inputProps={{
            type: 'password',
            inputType: InputType.DoublePw,
            placeholder: '??????????????? ?????? ??? ??????????????????',
            warningMessage: getConfirmPwMsg,
          }}
          onChange={handleConfirmPw}
        />
        <Field
          label="??????"
          isRequired
          inputProps={{
            inputType: InputType.Name,
            placeholder: '????????? ??????????????????',
            ignore: RULE.SPECIAL,
          }}
          onChange={handleName}
        />
        <Field
          label="?????????"
          isRequired
          inputProps={{
            inputType: InputType.Email,
            placeholder: '???: marketkurly@kurly.com',
            maxLength: 100,
          }}
          onChange={handleEmail}
          button="????????????"
          disabled={isEmailChecked}
          onClick={handleDoubleCheck(InputType.Email)}
        />
        <VerifyPhone onChange={handlePhone} setIsConfirmationCode={changeIsConfirmationCode} />
        <Field.Wrapper className="address-field">
          <Field.Left label="??????" isRequired />
          <Field.Center>
            {address ? (
              <>
                <Input defaultValue={address.mainAddress} readOnly />
                <Input
                  defaultValue={address.detailAddress}
                  placeholder="????????? ????????? ??????????????????"
                  onChange={handleDetailAddress}
                />
                <div className="description">????????????</div>
              </>
            ) : (
              <Button label="?????? ??????" onClick={handleSearchAddress} />
            )}

            <div className="description">???????????? ?????? ?????? ????????? ????????? ??? ????????????.</div>
          </Field.Center>
          <Field.Right>{address && <Button label="?????????" onClick={handleSearchAddress} />}</Field.Right>
        </Field.Wrapper>
        <Field.Wrapper>
          <Field.Left label="??????" />
          <Field.Center>
            <CheckList checkList={[man, woman, none]} onClick={handleGender} />
          </Field.Center>
          <Field.Right />
        </Field.Wrapper>
        <Field.Wrapper className="birth-field">
          <Field.Left label="????????????" />
          <Field.Center>
            <BirthInput setBirth={handleBirth} />
          </Field.Center>
          <Field.Right />
        </Field.Wrapper>
        <Field.Wrapper>
          <Field.Left label="???????????? ??????" />
          <Field.Center>
            <CheckList
              checkList={[
                {
                  isChecked: false,
                  text: '???????????? ????????? ?????????',
                  id: 'additional-recommender',
                  name: 'joinExtraInputType',
                  value: CheckValue.Recommend,
                },
                {
                  isChecked: false,
                  text: '?????? ????????????',
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
                    ? '????????? ???????????? ??????????????????.'
                    : '?????? ??????????????? ????????? ?????????.'
                }
                defaultValue={joinExtra}
              />
              <p className="description">
                {additionalType === CheckValue.Recommend ? (
                  '?????? ??? 7??? ??? ??? ?????? ???????????? ???, ???????????? ????????? ???????????? ???????????????.'
                ) : (
                  <>
                    '????????? ???????????? ?????? ???????????? ??? ????????? ?????? ???????????????.
                    <br />
                    ?????? ????????? ????????? ????????? ?????????.
                    <br />
                    ???????????? ??? ??????????????? ??????????????????.'
                  </>
                )}
              </p>
            </Field.Center>
            <Field.Right />
          </Field.Wrapper>
        )}
        <div className="line" />
        <Field.Wrapper className="all-agree-field">
          <Field.Left label="??????????????????" isRequired />
          <Field.Center>
            <Terms setRequiredChecked={setRequiredChecked} />
          </Field.Center>
        </Field.Wrapper>
        <div className="submit">
          <Button primary size="large" onClick={handleSubmit}>
            ????????????
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
