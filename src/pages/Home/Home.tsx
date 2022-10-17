import React from 'react';
import {Link} from "react-router-dom";
import {ROUTE} from "@/common";

const Home = () => {
  return (
    <div>
      Home
      <Link to={ROUTE.SIGN_UP}>회원가입</Link>
    </div>
  )
}

export default Home;