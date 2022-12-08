import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { ROUTE } from '@/common';
import { useAccessToken, useUser } from '../Login/Login';
import Button from '@/stories/Button';
import { loggout } from '@/services/api/user';
import queryClient from '@/services/queryClient';
import { useMutation } from 'react-query';
import { removeRefreshToken, Token } from '@/services/cookie';

const Home = () => {
  const { mutate: loggoutMutate } = useMutation(loggout, {
    onSuccess: () => {
      localStorage.removeItem(Token.Access);
      removeRefreshToken();
      queryClient.setQueryData(Token.Access, '');
    },
  });
  const accessToken = useAccessToken();

  const { data: user } = useUser(accessToken);

  const handleLoggout = () => {
    loggoutMutate();
  };

  return (
    <div>
      {!!accessToken ? <Button onClick={handleLoggout}>로그아웃</Button> : <Link to={ROUTE.LOGIN}>로그인</Link>}
      <Link to={ROUTE.SIGN_UP}>회원가입</Link>
    </div>
  );
};

export default Home;
