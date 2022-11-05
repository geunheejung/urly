import React, { ReactNode, useCallback, useState } from 'react';
import _isBoolean from 'lodash/isBoolean';
import Check from '@/stories/Check';

enum TermsType {
  TermsAgreeAll = 'TermsAgreeAll',
  RequiredTermsCondition = 'RequiredTermsCondition',
  RequiredTermsOfPrivacy = 'RequiredTermsOfPrivacy',
  OptionalTermsOfPrivacy = 'OptionalTermsOfPrivacy',
  SignupEventAll = 'SignupEventAll',
  OptionalTermsOfSms = 'OptionalTermsOfSms',
  OptionalTermsOfMailing = 'OptionalTermsOfMailing',
  RequiredSignupAge = 'RequiredSignupAge',
}

interface ITerms {
  id: TermsType;
  content: string;
  isRequired?: boolean;
  after?: ReactNode;
  subTerms?: {
    terms: ITerms[];
    after?: ReactNode;
  };
  isChecked: boolean;
}

const Terms = () => {
  const data: ITerms[] = [
    {
      id: TermsType.TermsAgreeAll,
      isChecked: false,
      content: '전체 동의합니다.',
      after: (
        <p className="description">선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</p>
      ),
    },
    {
      id: TermsType.RequiredTermsCondition,
      isChecked: false,
      content: '이용약관 동의',
      isRequired: true,
    },
    {
      id: TermsType.RequiredTermsOfPrivacy,
      isChecked: false,
      content: '개인정보 수집∙이용 동의',
      isRequired: true,
    },
    {
      id: TermsType.OptionalTermsOfPrivacy,
      isChecked: false,
      content: '개인정보 수집∙이용 동의',
      isRequired: false,
    },
    {
      id: TermsType.SignupEventAll,
      isChecked: false,
      content: '무료배송, 할인쿠폰 등 혜택/정보 수신 동의',
      isRequired: false,
      subTerms: {
        terms: [
          {
            id: TermsType.OptionalTermsOfSms,
            isChecked: false,
            content: 'SMS',
            isRequired: false,
            after: <p className="description">동의 시 한 달간 [5%적립] + [2만원 이상 무료배송] 첫 주문 후 안내</p>,
          },
          {
            id: TermsType.OptionalTermsOfMailing,
            isChecked: false,
            content: '이메일',
            isRequired: false,
          },
        ],
        after: <p className="description">동의 시 한 달간 [5%적립] + [2만원 이상 무료배송] 첫 주문 후 안내</p>,
      },
    },
    {
      id: TermsType.RequiredSignupAge,
      isChecked: false,
      content: '본인은 만 14세 이상입니다.',
      isRequired: true,
    },
  ];

  const [termsList, setTermsList] = useState<ITerms[]>(data);

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const { currentTarget } = e;
    const updateChecked = (raw: ITerms) => {
      const { id, isChecked, subTerms } = raw;

      if (raw.subTerms && raw.subTerms.terms) {
        const newSubState = raw.subTerms.terms.map(updateChecked);

        // newSubState를 update해준다.

        raw.subTerms.terms = newSubState;
      }

      if (id === currentTarget.id) raw.isChecked = !isChecked;
      return raw;
    };

    const newState = termsList.map(updateChecked);

    debugger;

    setTermsList(newState);
  };

  return (
    <>
      {termsList.map(({ id, isChecked, content, isRequired, subTerms, after }) => {
        return (
          <div key={id} className="field">
            <Check.Box id={id} isChecked={isChecked} onClick={handleClick}>
              <span>{content}</span>
              {_isBoolean(isRequired) && <span className="required">({isRequired ? '필수' : '선택'})</span>}
            </Check.Box>
            {after}
            {subTerms && (
              <div className="sub-agree field">
                {subTerms.terms.map(({ id, content, isChecked }) => (
                  <Check.Box
                    key={id}
                    id={id}
                    className="field"
                    isChecked={isChecked}
                    text={content}
                    onClick={handleClick}
                  />
                ))}
                {subTerms.after}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Terms;
