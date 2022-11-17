import React, { ReactNode, useCallback, useEffect, useState } from 'react';
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

interface ITermsProps {
  setRequiredChecked: (isRequiredChecked: boolean, checkedTermsList: ITerms[]) => void;
}
export interface ITerms {
  id: TermsType;
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
      isParent: true,
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
  const [isAllChecked, setIsAllChecked] = useState(false);
  const requiredList = termsList.filter(({ isRequired }) => isRequired);
  const getIsChecked = (terms: ITerms) => terms.isChecked;
  const getCheckedTerms = (termsList: ITerms[]) => {
    let checkedTermsList: ITerms[] = [];

    for (const terms of termsList) {
      const { isChecked, subTerms } = terms;
      if (subTerms) {
        checkedTermsList = [...checkedTermsList, ...subTerms.terms.filter((subRaw) => subRaw.isChecked)];
      }

      if (isChecked) checkedTermsList.push(terms);
    }
    return checkedTermsList;
  };

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
    const checkedTermsList = getCheckedTerms(termsList);
    setRequiredChecked(isRequiredChecked, checkedTermsList);
    // 필수 조건 요소를 다 클릭했을 경우 데이터를 전달한다.
  }, [termsList, isAllChecked]);

  return (
    <>
      <div className="field">
        <Check.Box id={TermsType.TermsAgreeAll} isChecked={isAllChecked} onClick={handleAllCheck}>
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
