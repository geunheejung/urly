import axios from 'axios';
import { RULE } from '@/common';
import { code } from '@/services/helper';
import { customAxios } from '@/services/customAxios';
import { ICreateUserPayload } from '../../../../types/api';

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

export const getUser = async () => {
  try {
    const res = await customAxios.get('/user');
    return res;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (payload: ICreateUserPayload) => {
  try {
    const res = await customAxios.post('/user', payload);
    return res;
  } catch (error) {
    throw error;
  }
};
