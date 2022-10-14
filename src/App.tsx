import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {Step1, Step2} from "@/pages/ShippingAddress";

function App() {
  return (
    <Routes>
      <Route path="address/shipping-address" element={<Step1 />} />
      <Route path="address/shipping-address/result" element={<Step2 />} />
    </Routes>
  );
}

export default App;