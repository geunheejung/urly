import { RULE } from '@/common';
import { Input, InputType } from '@/stories/Input/Input';

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
      // 6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합
      if (!value.match(RULE.ID)) message = '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
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

interface IVerificationCode {
  phone: string;
}
export interface IVerifyCodeResponse {
  status: number;
  message: string;
  value: string;
}

export const verifyCode = (payload: IVerificationCode): Promise<IVerifyCodeResponse> => {
  // 전화번호를 받는다.
  // 양식을 체크한다.
  // 임의로 타이머 걸고, 그 후에 인증번호 리턴
  const { phone } = payload;

  return new Promise((resolve, reject) => {
    fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) => {
      if (!RULE.PHONE.test(phone)) {
        reject({
          status: 400,
          message: '잘못된 휴대폰 번호 입니다. 확인 후 다시 시도해 주세요.',
        });
      }

      resolve({
        status: 200,
        message: '인증번호가 발송되었습니다.',
        value: '123456',
      });
    });
  });
};
