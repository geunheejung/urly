import React, {useCallback, useState} from 'react';
import DaumPostcodeEmbed, { Address as AddressArgs } from 'react-daum-postcode';
import {useNavigate} from "react-router-dom";

const Step1 = () => {
  const [ mainAddress, setMainAddress ] = useState('');
  const navigate = useNavigate();

  const handleComplete = useCallback((searchedAddress: AddressArgs) => {
    const { buildingName, address } = searchedAddress
    const mainAddress = `${address} (${buildingName})`;
    setMainAddress(mainAddress);
    navigate('/address/shipping-address/result');
    // Link로 Step2로 이동 시키면서, 주소 정보 같이 전달.
  }, [ mainAddress ]);

  return (
    <div>
      <DaumPostcodeEmbed
        onComplete={handleComplete}
      />
    </div>
  )
}

export default Step1;