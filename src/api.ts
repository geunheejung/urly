import { RULE } from './common';

export enum API_STATUS {
  REQUEST = 'REQUEST',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

interface User {
  index: number;
  id: string;
  email: string;
}
interface Mock {
  users: User[];
}

export const mock: Mock = {
  users: [
    {
      index: 0,
      id: 'hijs12345',
      email: 'hijs12345@gmail.com',
    },
    {
      index: 1,
      id: 'hits12345',
      email: 'hits12345@gmail.com',
    },
    {
      index: 2,
      id: 'hijava12345',
      email: 'hijava12345@gmail.com',
    },
    {
      index: 3,
      id: 'hipython12345',
      email: 'hipython12345@gmail.com',
    },
  ],
};

export const confirmId = (id: string) => mock.users.some((raw) => raw.id === id);
export const confirmEmail = (email: string) => mock.users.some((raw) => raw.email === email);

export class ApiError extends Error {
  public status: string;
  constructor(message: string, status: string) {
    super(message);
    this.status = status;
  }
}

interface IVerificationCode {
  phone: string;
}
export interface IVerifyCodeResponse {
  status: number;
  message: string;
  value?: string;
}

export const verifyCode = (payload: IVerificationCode): Promise<IVerifyCodeResponse> => {
  // 전화번호를 받는다.
  // 양식을 체크한다.
  // 임의로 타이머 걸고, 그 후에 인증번호 리턴
  const { phone } = payload;

  return new Promise((resolve, reject) => {
    try {
      fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) => {
        const isValidate = Array.isArray(phone.match(RULE.PHONE));

        if (isValidate) {
          resolve({
            status: 200,
            message: '인증번호가 발송되었습니다.',
            value: '123456',
          });
        }

        reject(new ApiError('잘못된 휴대폰 번호 입니다. 확인 후 다시 시도해 주세요.', '400'));
      });
    } catch (err) {
      throw new ApiError('다시 시도해주세요.', '400');
    }
  });
};
