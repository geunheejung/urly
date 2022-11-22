import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Shipping, Result } from './pages/ShippingAddress';
import Home from '@/pages/Home/Home';
import Signup from '@/pages/Signup';
import { ROUTE } from './common';
import { testApi } from './api';

function App() {
  useEffect(() => {
    testApi();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path={ROUTE.SIGN_UP} element={<Signup />} />
      <Route path={ROUTE.SHIPPING} element={<Shipping />} />
      <Route path={ROUTE.SHIPPING_RESULT} element={<Result />} />
    </Routes>
  );
}

export default App;
