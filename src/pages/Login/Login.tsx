import React, { useCallback, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { ROUTE } from '@/common';
import useInput from '@/hooks/useInput';
import { getUser, login } from '@/services/api/user';
import { Token } from '@/services/cookie';
import { decoded } from '@/services/helper';
import queryClient from '@/services/queryClient';
import Button from '@/stories/Button';
import Input from '@/stories/Input';
import { InputType } from '@/stories/Input/Input';
import Field from '@/stories/Field';
import Modal from '@/stories/Modal';
import './login.scss';

export const useAccessToken = () => {
  const { data } = useQuery(Token.Access, {
    initialData: '',
    staleTime: Infinity,
  });

  const accessToken = localStorage.getItem(Token.Access);

  if (accessToken) return accessToken;

  return data;
};

export const useUser = (accessToken?: string) => {
  return useQuery(
    ['user', accessToken],
    ({ queryKey }) => {
      const accessToken = queryKey[1] as string;

      const { id } = decoded(accessToken);

      return getUser({ userId: id });
    },
    {
      enabled: !!accessToken,
    },
  );
};

const Login = () => {
  const [id, , handleId] = useInput('');
  const [pw, , handlePw] = useInput('');
  const [message, setMessage] = useState('');
  const [isOpen, toggle] = useState(false);

  const navigate = useNavigate();

  const updateErrorMsg = () => setMessage('아이디, 비밀번호를 확인해주세요.');

  const { mutate: loginMutate, isLoading } = useMutation(login, {
    onSuccess: async (res) => {
      const { accessToken } = res;
      localStorage.setItem(Token.Access, accessToken);
      queryClient.setQueryData(Token.Access, accessToken);
      navigate(ROUTE.HOME);
    },
    onError: (error) => {
      toggle(true);
      updateErrorMsg();
    },
  });

  const handleLogin = useCallback(async () => {
    if (!(id && pw)) {
      updateErrorMsg();
      toggle(true);
      return;
    }
    const res = await loginMutate({ id, password: pw });
  }, [id, pw]);

  const handleConfirm = useCallback(() => {
    toggle((prev) => !prev);
  }, [isOpen]);

  const handleSignup = useCallback(() => {
    navigate('/member/signup');
  }, []);

  return (
    <div className="login-page">
      <div className="title">로그인</div>
      <form>
        <Input type="text" onChange={handleId} placeholder="아이디를 입력해주세요." />
        <Input type="password" onChange={handlePw} placeholder="비밀번호를 입력해주세요." />
        <div className="find">
          <Link to="/">아이디찾기</Link>
          <span className="quarter" />
          <Link to="/">비밀번호 찾기</Link>
        </div>
        <div className="submit">
          <Button onClick={handleLogin} size="large" primary>
            로그인
          </Button>
          <Button size="large" onClick={handleSignup}>
            회원가입
          </Button>
        </div>
      </form>
      <Modal isOpen={isOpen} isLoading={isLoading} onConfirm={handleConfirm}>
        {message}
      </Modal>
    </div>
  );
};

export default Login;
