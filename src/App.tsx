import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Shipping, Result } from './pages/ShippingAddress';
import Home from '@/pages/Home/Home';
import Signup from '@/pages/Signup';
import { ROUTE } from './common';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={ROUTE.SIGN_UP} element={<Signup />} />
        <Route path={ROUTE.SHIPPING} element={<Shipping />} />
        <Route path={ROUTE.SHIPPING_RESULT} element={<Result />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
