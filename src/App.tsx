import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { Shipping, Result } from './pages/ShippingAddress';
import Home from '@/pages/Home/Home';
import Signup from '@/pages/Signup';
import queryClient from '@/services/queryClient';
import { ROUTE } from './common';
import Login from './pages/Login';
import Layout from './components/Layout';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/main" element={<Home />} />
          <Route path={ROUTE.SIGN_UP} element={<Signup />} />
          <Route path={ROUTE.LOGIN} element={<Login />} />
          <Route path={ROUTE.SHIPPING} element={<Shipping />} />
          <Route path={ROUTE.SHIPPING_RESULT} element={<Result />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
