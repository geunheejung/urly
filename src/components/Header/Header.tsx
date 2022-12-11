import React, { useCallback, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useMutation } from 'react-query';
import { AiFillCaretDown, AiFillCloseCircle, AiOutlineCloseCircle, AiOutlineSearch } from 'react-icons/ai';
import Button from '@/stories/Button';
import Dropdown from '@/components/Dropdown';
import Quarter from '@/components/Quarter';
import { useAccessToken, useUser } from '@/pages/Login/Login';
import { loggout } from '@/services/api/user';
import { removeRefreshToken, Token } from '@/services/cookie';
import { ROUTE } from '@/common';
import queryClient from '@/services/queryClient';
import logo from '../../images/logo.svg';
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
  const [keyword, setKeyword] = useState('');

  const updateIsOpen = (newIsOpen: boolean) =>
    useCallback(() => {
      setIsOpen(newIsOpen);
    }, [isOpen]);

  const handleLoggout = useCallback(() => {
    loggoutMutate();
  }, [accessToken, user]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    [keyword],
  );

  const handleClear = useCallback(() => {
    setKeyword('');
  }, [keyword]);

  const login = accessToken ? <Button onClick={handleLoggout}>로그아웃</Button> : <Link to={ROUTE.LOGIN}>로그인</Link>;
  const clearBtn = keyword && (
    <button className="clear-btn" onClick={handleClear}>
      <AiFillCloseCircle size={18} />
    </button>
  );

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

      <div className="main-banner-wrapper">
        <div className="title-wrapper">
          <div className="banner">
            <img src={logo} alt="banner" />
          </div>
          <NavLink to="/main" className={(props) => (props.isActive ? 'active' : '')}>
            마켓컬리
          </NavLink>
          <Quarter style={{ height: 14, margin: '0 20px' }} />
          <NavLink to="/main/beauty">뷰티컬리</NavLink>
        </div>
        <div className="search-wrapper">
          <input
            type="text"
            value={keyword}
            className="default-input"
            placeholder="검색어를 입력해주세요."
            onChange={handleSearch}
          />
          {clearBtn}
          <button className="search-btn">
            <AiOutlineSearch size={25} />
          </button>
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
