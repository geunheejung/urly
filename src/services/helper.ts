import { RULE } from '@/common';
import { InputType } from '@/stories/Input/Input';

export const openInNewTab = (url: string) => {
  const W = 540,
    H = 569;
  const xPos = window.screen.width / 2 - W / 2;
  const yPos = window.screen.height / 2 - H / 2;
  const windowFeatures = `width=${W}, height=${H}, left=${xPos}, top=${yPos}`;
  window.open(url, '_blank', windowFeatures);
};

export const signupValidate = (value: string, inputType?: InputType) => {
  let message = '';

  const validatePW = () => {
    const matched = value.match(RULE.REPEAT_NUM);
    if (matched && matched[0].length >= 3) return (message = '동일한 숫자 3개이상 금지');
    if (value && value.length < 10) return (message = '최소 10자 이상 입력');
    if (!value.match(RULE.PW)) message = '영문/숫자/특수문자(공백 제외)만 허용하며, 2개 이상 조합';
  };

  const validateEmail = () => {
    if (!value) return (message = '이메일을 입력해주세요.');
    if (!value.match(RULE.EMAIL)) message = '이메일 형식으로 입력해주세요.';
  };

  switch (inputType) {
    case InputType.Id:
      if (!value.match(RULE.ID)) return '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
      break;
    case InputType.Pw:
      validatePW();
      break;
    case InputType.DoublePw:
      if (!value) return '비밀번호를 한번 더 입력해 주세요.';
      break;
    case InputType.Email:
      validateEmail();
      break;
    case InputType.Name:
      if (!value) return '이름을 입력해주세요.';
      break;
    case InputType.Phone:
      if (!value) return '휴대폰 번호를 입력해주세요.';
      break;
    default:
      break;
  }

  return message;
};

export const code = () => {
  let num = '';
  for (let i = 0; i < 6; i++) {
    const n = Math.floor(Math.random() * (10 - 1) + 1) + '';

    if (n) num += n;
  }

  return num;
};
