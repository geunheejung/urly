import { RULE } from "@/common";
import { InputType } from "@/stories/Input/Input";

export const openInNewTab = (url: string) => {
  const W = 540, H = 569;  
  const xPos = (window.screen.width / 2) - (W / 2);
  const yPos = (window.screen.height / 2) - (H / 2);  
  const windowFeatures = `width=${W}, height=${H}, left=${xPos}, top=${yPos}`
  window.open(url, '_blank', windowFeatures);
};

export const signupValidate = (value: string, inputType?: InputType) => {
  let message = '';
  switch (inputType) {
    case InputType.Id:
      // 6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합
      if (!value.match(RULE.ID)) message = '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
      break;
    case InputType.Pw:
      // 10글자
      if (value.length < 10) return '최소 10자 이상 입력';
      if (!value.match(RULE.PW)) message = '영문/숫자/특수문자(공백 제외)만 허용하며, 2개 이상 조합';
      break;
    case InputType.Email:
      if (!value.length) return '이메일을 입력해주세요.';
      if (!value.match(RULE.EMAIL)) message = '이메일 형식으로 입력해주세요.'
      break;
    case InputType.Name:
      break;
    default:
      break;
  }

  return message;
}