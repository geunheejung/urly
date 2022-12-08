import axios from 'axios';
import { RULE } from '@/common';
import { code } from '@/services/helper';
import { customAxios } from '@/services/customAxios';
import { ICheckExistsPayload, IUser, IApiResponse, ILoginPayload, IUserSchema } from '../../../../types/api';
import { removeRefreshToken, setRefreshToken, Token } from '@/services/cookie';

export enum API_STATUS {
  REQUEST = 'REQUEST',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

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

interface IGetUserPayload {
  userId: number;
}
export const getUser = async <T = IUserSchema>(payload?: IGetUserPayload) => {
  try {
    const url = `/user`;
    const path = payload ? `/${payload.userId}` : '';
    const res = await customAxios.get<T>(`${url}${path}`);

    return res;
  } catch (error) {
    throw error;
  }
};

export const getUserList = () => getUser<IUserSchema[]>();

export const createUser = async (payload: IUser) => {
  try {
    const res = await customAxios.post('/user', payload);
    return res;
  } catch (error) {
    throw error;
  }
};
export const existsUser = async (payload: ICheckExistsPayload) => {
  try {
    const {
      data: { data: isExists, message },
    } = await customAxios.post<IApiResponse<boolean>>('/user/exists-check', payload);
    return { isExists, message };
  } catch (error) {
    throw error;
  }
};

export const login = async (payload: ILoginPayload) => {
  try {
    const res = await customAxios.post<IApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/user/login',
      payload,
    );
    const {
      data: { data, status },
    } = res;

    if (status === 401) {
      throw 'invalid password';
    }

    const { accessToken, refreshToken } = data;

    /**
     * 1. refreshToken을 Cookie에 저장한다.
     * 2. accessToken은 react-query로 저장한다.
     * 3. accessToken을 디코딩해서 userId를 얻는다.
     * 4. userId로 user 정보를 요청한다.
     */

    setRefreshToken(refreshToken);

    // request header에 토큰 설정. (1) 로그인 시, (2) 토큰 갱신 시
    customAxios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return data;
  } catch (error) {
    throw error;
  }
};

export const loggout = async () => {
  try {
    const res = await customAxios.post('/user/loggout');
    return res;
  } catch (error) {
    throw error;
  }
};

export const refresh = async () => {
  try {
    const res = await customAxios.post('/user/refresh');

    return res;
  } catch (error) {
    throw error;
  }
};
