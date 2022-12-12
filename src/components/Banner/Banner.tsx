import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import Slider, { Settings, CustomArrowProps } from 'react-slick';
import banner1 from '@/images/banner1.avif';
import banner2 from '@/images/banner2.avif';
import banner3 from '@/images/banner3.avif';
import banner4 from '@/images/banner4.avif';
import banner5 from '@/images/banner5.avif';
import './banner.scss';

const CustomArrow = ({ className, style, onClick }: CustomArrowProps) => {
  return <div className={`${className}`} style={style} onClick={onClick} />;
};

const Banner = () => {
  const images = [
    {
      url: banner1,
      path: '/main',
    },
    {
      url: banner2,
      path: '/main',
    },
    {
      url: banner3,
      path: '/main',
    },
    {
      url: banner4,
      path: '/main',
    },
    {
      url: banner5,
      path: '/main',
    },
  ];

  const [isShow, toggle] = useState(false);

  const handleMouseOver = () => {
    toggle(true);
  };

  const handleMouseOut = () => {
    toggle(false);
  };

  const settings: Settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomArrow />,
    prevArrow: <CustomArrow />,
  };

  return (
    <div
      className={classNames('banner-wrapper', { show: isShow })}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <NavLink to={image.path}>
              <img src={image.url} />
            </NavLink>
          </div>
        ))}
      </Slider>
    </div>
  );
};
export default Banner;
