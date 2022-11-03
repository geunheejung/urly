import React, { useCallback } from 'react';
import Field from '@/stories/Field';
import Input from '@/stories/Input';
import useInput from '@/hooks/useInput';
import './birthInput.scss';
import moment from 'moment';

const BirthInput = () => {
  const [year, , updateYear] = useInput('');
  const [month, , updateMonth] = useInput('');
  const [day, , updateDay] = useInput('');
  const currentYear = moment().format('YYYY');

  const validate = useCallback(() => {
    // 데이터 변화가 없을 경우 표기 X
    if (!(year || month || day)) return '';

    if (year === '0' || year.length !== 4 || moment(year).isBefore(1900))
      return '태어난 년도 4자리를 정확하게 입력해주세요.';

    const m = parseInt(month),
      d = parseInt(day);

    if (moment(year).isAfter(currentYear)) return '생년월일이 미래로 입력 되었습니다.';
    if (!m || m < 0 || m > 12) return '태어난 월을 정확하게 입력해주세요.';
    if (!d || d < 0 || d > 31) return '태어난 일을 정확하게 입력해주세요.';
  }, [year, month, day]);

  return (
    <Field.Wrapper className="birth-field">
      <Field.Left label="생년월일" />
      <Field.Center>
        <div className="input-wrapper">
          <Input type="text" maxLength={4} placeholder="YYYY" onChange={updateYear} />
          <span />
          <Input type="text" maxLength={2} placeholder="MM" onChange={updateMonth} />
          <span />
          <Input type="text" maxLength={2} placeholder="DD" onChange={updateDay} />
        </div>
        <p className="warning">{validate()}</p>
      </Field.Center>
      <Field.Right />
    </Field.Wrapper>
  );
};

export default BirthInput;
