import React, { useCallback, useState } from 'react'
import useLocalStorageState from 'use-local-storage-state';
import { openInNewTab, signupValidate } from '@/helper';
import { ROUTE } from '@/common';
import Button from '@/stories/Button';
import Field from '@/stories/Field';
import { InputType } from '@/stories/Input/Input';
import './signup.scss'
import { confirmEmail, confirmId } from '@/api';

interface SignUpProps {}

const SignUp = (props: SignUpProps) => {
  const [ id, setId ] = useState('');
  const [ pw, setPw ] = useState('');
  const [ pwWarnMsg, setPwWarnMsg ] = useState('');
  const [ address ] = useLocalStorageState('address');
  const [ isOpen, setIsOpen ] = useState(false);     

  const handleId = useCallback((value: string) => {
    setId(value);
  }, [id]);
  const handlePw = useCallback((value: string) => {
    setPw(value);
  }, [pw]);
  const handlePwConfirm = useCallback((value: string) => {
    
  }, [[pw, pwWarnMsg]]);

  // 아이디, 이메일 - 중복 확인
  const doubleCheck = (inputType: InputType) => (value: string) => {
    const message = signupValidate(value, inputType);
    if (message) return message;
    const isExisted = inputType === InputType.Id ? confirmId(value) : confirmEmail(value);

    return isExisted ? '사용 불가능 합니다.' : '사용 가능 합니다.';
  }
  
  const handleAddressSearch = useCallback(() => {
    openInNewTab(ROUTE.SHIPPING);    
    setIsOpen(prevState => !prevState);
  }, [ isOpen ]);
    
  return (
    <div className='signup'>
      <div className='title'>회원가입</div>
      <div className='content'>
        <div className='description'>
          <span>*</span> 필수입력사항
        </div> 
        <Field 
          label='아이디' 
          isRequired 
          button='중복확인' 
          inputProps={{   
            placeholder: '아이디를 입력해주세요',
            inputType: InputType.Id,
            onChange: handleId 
          }} 
          modalContent={doubleCheck(InputType.Id)}
        />
        <Field 
          label='비밀번호' 
          isRequired           
          inputProps={{ 
            placeholder: '비밀번호를 입력해주세요',
            inputType: InputType.Pw,
            onChange: handlePw 
          }} 
        />
        <Field 
          label='비밀번호 확인' 
          isRequired           
          inputProps={{ 
            placeholder: '비밀번호를 한번 더 입력해주세요',
            inputType: InputType.Pw,
            onChange: handlePwConfirm 
          }} 
        />        
      </div>
      {/* <Button onClick={handleAddressSearch}>
        주소 검색
      </Button>       */}
    </div>
  )
}

export default SignUp;