import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {Shipping, Result } from "@/pages/ShippingAddress";
import Home from "@/pages/Home/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="address/*">
          <Route path="shipping-address" element={<Shipping />} />
          <Route path="shipping-address/result" element={<Result />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;