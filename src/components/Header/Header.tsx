import React, { useCallback, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useMutation } from 'react-query';
import { AiFillCaretDown } from 'react-icons/ai';
import Button from '@/stories/Button';
import Dropdown from '@/components/Dropdown';
import Quarter from '@/components/Quarter';
import { useAccessToken, useUser } from '@/pages/Login/Login';
import { loggout } from '@/services/api/user';
import { removeRefreshToken, Token } from '@/services/cookie';
import { ROUTE } from '@/common';
import queryClient from '@/services/queryClient';

import './header.scss';

const Header = () => {
  const accessToken = useAccessToken();
  const { data: user } = useUser(accessToken);

  const { mutate: loggoutMutate } = useMutation(loggout, {
    onSuccess: () => {
      localStorage.removeItem(Token.Access);
      removeRefreshToken();
      queryClient.setQueryData(Token.Access, '');
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const updateIsOpen = (newIsOpen: boolean) =>
    useCallback(() => {
      setIsOpen(newIsOpen);
    }, [isOpen]);

  const handleLoggout = useCallback(() => {
    loggoutMutate();
  }, [accessToken, user]);

  const login = accessToken ? <Button onClick={handleLoggout}>로그아웃</Button> : <Link to={ROUTE.LOGIN}>로그인</Link>;

  const quarter = <Quarter style={{ height: '13px', margin: '0 12px' }} />;
  return (
    <header className="header-wrapper">
      <div className="member-wrapper">
        <Link to={ROUTE.SIGN_UP} className="signup">
          회원가입
        </Link>
        {quarter}
        {login}
        {quarter}
        <div className="notice-wrapper" onMouseOver={updateIsOpen(true)} onMouseOut={updateIsOpen(false)}>
          <Link to={ROUTE.SIGN_UP}>고객센터</Link>
          <AiFillCaretDown style={{ margin: '0 0 1px 5px' }} />
          <Dropdown isOpen={isOpen} toggle={setIsOpen}>
            <NavLink to="/">공지사항</NavLink>
            <NavLink to="/">자주하는 질문</NavLink>
            <NavLink to="/">1:1 문의</NavLink>
            <NavLink to="/">대량주문 문의</NavLink>
          </Dropdown>
        </div>
      </div>

      <div className="wrapper">
        <div className="banner-wrapper">
          <div className="banner">
            <img src="/" alt="banner" />
          </div>
          <div className="title-wrapper">
            <button>마켓컬리</button>
            <span />
            <button>뷰티컬리</button>
          </div>
        </div>
        <div className="search-wrapper">
          <input type="text" />
        </div>
        <div className="support-wrapper">
          <div>배송지 등록</div>
          <div>찜 목록</div>
          <div>장바구니</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
