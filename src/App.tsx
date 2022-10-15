import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {Shipping, Step2} from "@/pages/ShippingAddress";

function App() {
  return (
    <Routes>
      <Route path="address/shipping-address" element={<Shipping />} />
      <Route path="address/shipping-address/result" element={<Step2 />} />
    </Routes>
  );
}

export default App;