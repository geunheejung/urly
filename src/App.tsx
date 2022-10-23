import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {Shipping, Result } from "./pages/ShippingAddress";
import Home from "@/pages/Home/Home";
import SignUp from '@/pages/Signup';
import { ROUTE } from './common';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path={ROUTE.SIGN_UP} element={<SignUp />} />
      <Route path={ROUTE.SHIPPING} element={<Shipping />} />
      <Route path={ROUTE.SHIPPING_RESULT} element={<Result />} />                      
    </Routes>
  );
}

export default App;