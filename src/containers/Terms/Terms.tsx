import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import _isBoolean from 'lodash/isBoolean';
import Check from '@/stories/Check';

enum TermsKey {
  TermsAgreeAll = 'termsAgreeAll',
  RequiredTermsCondition = 'requiredTermsCondition',
  RequiredTermsOfPrivacy = 'requiredTermsOfPrivacy',
  OptionalTermsOfPrivacy = 'optionalTermsOfPrivacy',
  SignupEventAll = 'signupEventAll',
  OptionalTermsOfSms = 'optionalTermsOfSms',
  OptionalTermsOfMailing = 'optionalTermsOfMailing',
  RequiredSignupAge = 'requiredSignupAge',
}

export type TermsType = {
  requiredTermsCondition: boolean;
  requiredTermsOfPrivacy: boolean;
  optionalTermsOfPrivacy: boolean;
  signupEventAll: boolean;
  optionalTermsOfSms: boolean;
  optionalTermsOfMailing: boolean;
  requiredSignupAge: boolean;
};

interface ITermsProps {
  setRequiredChecked: (isRequiredChecked: boolean, terms: ITerms[]) => void;
}
export interface ITerms {
  id: TermsKey;
  isParent?: boolean;
  content: string;
  isRequired?: boolean;
  after?: ReactNode;
  subTerms?: {
    terms: ITerms[];
    after?: ReactNode;
  };
  isChecked: boolean;
}

const Terms = ({ setRequiredChecked }: ITermsProps) => {
  const data: ITerms[] = [
    {
      id: TermsKey.RequiredTermsCondition,
      isChecked: false,
      content: '이용약관 동의',
      isRequired: true,
    },
    {
      id: TermsKey.RequiredTermsOfPrivacy,
      isChecked: false,
      content: '개인정보 수집∙이용 동의',
      isRequired: true,
    },
    {
      id: TermsKey.OptionalTermsOfPrivacy,
      isChecked: false,
      content: '개인정보 수집∙이용 동의',
      isRequired: false,
    },
    {
      id: TermsKey.SignupEventAll,
      isChecked: false,
      isParent: true,
      content: '무료배송, 할인쿠폰 등 혜택/정보 수신 동의',
      isRequired: false,
      subTerms: {
        terms: [
          {
            id: TermsKey.OptionalTermsOfSms,
            isChecked: false,
            content: 'SMS',
            isRequired: false,
            after: <p className="description">동의 시 한 달간 [5%적립] + [2만원 이상 무료배송] 첫 주문 후 안내</p>,
          },
          {
            id: TermsKey.OptionalTermsOfMailing,
            isChecked: false,
            content: '이메일',
            isRequired: false,
          },
        ],
        after: <p className="description">동의 시 한 달간 [5%적립] + [2만원 이상 무료배송] 첫 주문 후 안내</p>,
      },
    },
    {
      id: TermsKey.RequiredSignupAge,
      isChecked: false,
      content: '본인은 만 14세 이상입니다.',
      isRequired: true,
    },
  ];

  const [termsList, setTermsList] = useState<ITerms[]>(data);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const requiredList = termsList.filter(({ isRequired }) => isRequired);
  const getIsChecked = (terms: ITerms) => terms.isChecked;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const { currentTarget } = e;

      const updateChecked = (item: ITerms) => {
        const { id, isChecked, subTerms, isParent } = item;

        if (subTerms) {
          const { terms } = subTerms;

          const newState = terms.map(updateChecked);

          item.isChecked = newState.every(getIsChecked);
          subTerms.terms = newState;
        }

        if (id === currentTarget.id) {
          item.isChecked = !isChecked;

          if (isParent && subTerms) {
            subTerms.terms = subTerms.terms.map((subItem) => {
              subItem.isChecked = item.isChecked;
              return subItem;
            });
          }
        }

        return item;
      };

      const newTermsList = termsList.map(updateChecked);

      setIsAllChecked(newTermsList.every(getIsChecked));
      setTermsList(newTermsList);
    },
    [termsList, isAllChecked],
  );

  const handleAllCheck = useCallback(() => {
    const updater = (item: ITerms) => {
      const { subTerms } = item;
      if (subTerms) subTerms.terms = subTerms.terms.map(updater);
      item.isChecked = !isAllChecked;
      return item;
    };
    const newTermsList = termsList.map(updater);

    setIsAllChecked((prev) => !prev);
    setTermsList(newTermsList);
  }, [termsList, isAllChecked]);

  useEffect(() => {
    const isRequiredChecked = requiredList.every((terms) => terms.isChecked);
    setRequiredChecked(isRequiredChecked, termsList);
    // 필수 조건 요소를 다 클릭했을 경우 데이터를 전달한다.
  }, [termsList, isAllChecked]);

  return (
    <>
      <div className="field">
        <Check.Box id={TermsKey.TermsAgreeAll} isChecked={isAllChecked} onClick={handleAllCheck}>
          <span>전체 동의합니다.</span>
          <span className="required">(필수)</span>
        </Check.Box>
        <p className="description">선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</p>
      </div>
      {termsList.map(({ id, isChecked, content, isRequired, subTerms, after }) => (
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
      ))}
    </>
  );
};

export default Terms;
