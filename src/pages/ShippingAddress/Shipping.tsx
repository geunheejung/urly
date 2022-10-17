import React, {useCallback, useEffect, useState} from 'react';
import DaumPostcodeEmbed, { Address as AddressArgs } from 'react-daum-postcode';
import {useNavigate} from "react-router-dom";
import {ROUTE} from "@/common";

const Shipping = () => {
  const [ mainAddress, setMainAddress ] = useState('');
  const navigate = useNavigate();

  const handleComplete = useCallback((searchedAddress: AddressArgs) => {
    const { buildingName, address } = searchedAddress
    const mainAddress = `${address} (${buildingName})`;
    setMainAddress(mainAddress);
    navigate(ROUTE.SHIPPING_RESULT, { state: { mainAddress } });
    // Link로 Step2로 이동 시키면서, 주소 정보 같이 전달.
  }, [ mainAddress ]);

  useEffect(() => {
    document.title = `마켓컬리 :: 내일의 장보기, 마켓컬리`;
  })
  

  return (
    <div>
      <DaumPostcodeEmbed
        className="daumPostCode-wrapper"
        onComplete={handleComplete}
        style={{
          height: '569px'
        }}
      />
    </div>
  )
}

export default Shipping;