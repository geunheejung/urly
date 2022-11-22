import axios from 'axios';
import { RULE } from './common';
import { code } from './helper';

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
export interface IResponse {
  status: number;
  message: string;
  value?: string;
}

const user: { [phone: string]: string } = {};

export const verifyCode = (payload: IVerificationCode): Promise<IResponse> => {
  // 전화번호를 받는다.
  // 양식을 체크한다.
  // 임의로 타이머 걸고, 그 후에 인증번호 리턴
  const { phone } = payload;

  return new Promise((resolve, reject) => {
    try {
      fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) => {
        const isValidate = Array.isArray(phone.match(RULE.PHONE));

        if (!isValidate) reject(new ApiError('잘못된 휴대폰 번호 입니다. 확인 후 다시 시도해 주세요.', '400'));

        const value = code();

        user[phone] = value;
        console.log(value);
        resolve({
          status: 200,
          message: '인증번호가 발송되었습니다.',
          value,
        });
      });
    } catch (err) {
      throw new ApiError('다시 시도해주세요.', '400');
    }
  });
};

export interface IValidatePhoneCode {
  phone: string;
  code: string;
}
export const validatePhoneCode = (payload: IValidatePhoneCode): Promise<IResponse> => {
  // 1. 전화번호, 인증번호를 받는다.
  // 2. user 객체에서 전화번호로 접근한다.
  // 3. 전달받은 인증번호와 전송한 인증번호가 서로 맞는지 확인한다.

  return new Promise((resolve, reject) => {
    try {
      fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) => {
        const { phone, code } = payload;
        const originalCode = user[phone];

        if (code !== originalCode) reject(new ApiError('잘못된 인증 코드 입니다.', '400'));

        resolve({
          status: 200,
          message: '인증 완료 됐습니다.',
        });
      });
    } catch (err) {
      throw new ApiError('다시 시도해주세요.', '400');
    }
  });
};

export const testApi = async () => {
  const res = await axios.get('/api');

  console.log(res);
};
