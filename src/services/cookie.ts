import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export enum Token {
  Refresh = 'refresh_token',
  Access = 'access_token',
}

export const setRefreshToken = (refreshToken: string) => {
  const today = new Date();
  const expiredDate = today.setDate(today.getDate() + 7);

  cookies.set(Token.Refresh, refreshToken, {
    sameSite: 'strict',
    path: '/',
    expires: new Date(expiredDate),
  });
};

export const getRefreshToken = () => cookies.get(Token.Refresh);
export const removeRefreshToken = () => cookies.remove(Token.Refresh, { sameSite: 'strict', path: '/' });
