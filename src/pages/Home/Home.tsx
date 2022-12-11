import React, { useState } from 'react';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import './home.scss';

const Home = () => {
  return (
    <div className="home-wrapper">
      <Header />
      <main>
        <Banner />
      </main>
    </div>
  );
};
export default Home;
