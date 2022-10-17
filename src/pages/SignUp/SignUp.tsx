import React, { useCallback, useEffect, useState } from 'react'
import { openInNewTab } from '@/helper';
import { ROUTE } from '@/common';
import Button from '@/stories/Button';
import './signUp.scss'
import { useLocation, useNavigate } from 'react-router-dom';

interface SignUpProps {}

const SignUp = (props: SignUpProps) => {
  const [ isOpen, setIsOpen ] = useState(false); 
  const navigate = useNavigate(); 
  const location = useLocation();
  
  const handleAddressSearch = useCallback(() => {
    openInNewTab(ROUTE.SHIPPING);    
    setIsOpen(prevState => !prevState);
  }, [ isOpen ]);
  
  return (
    <div>
      회원가입      
      <Button onClick={handleAddressSearch}>
        주소 검색
      </Button>      
    </div>
  )
}

export default SignUp;