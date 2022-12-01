import React, { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { ROUTE } from '@/common';
import { useAccessToken, useUser } from '../Login/Login';

const Home = () => {
  const accessToken = useAccessToken();

  const { data: user } = useUser(accessToken);

  console.log(accessToken);
  console.log(user);

  return (
    <div>
      {!accessToken && <Link to={ROUTE.LOGIN}>로그인</Link>}
      <Link to={ROUTE.SIGN_UP}>회원가입</Link>
    </div>
  );
};

export default Home;
