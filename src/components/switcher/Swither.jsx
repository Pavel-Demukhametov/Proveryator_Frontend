import React, { useState, useEffect } from 'react';
import './Switch.css';

const Switcher12 = () => {
  const storedDarkMode = localStorage.getItem('darkMode');
  const [isChecked, setIsChecked] = useState(storedDarkMode === 'true');
  const [imageSrc, setImageSrc] = useState(isChecked ? '/moon.png' : '/sun2.png');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isChecked);
    localStorage.setItem('darkMode', isChecked);
  }, [isChecked]);

  const handleImageClick = () => {
    setIsChecked(!isChecked);
    setImageSrc(isChecked ? '/sun2.png' : '/moon.png');
  };

  return (
    <>
      <div
        className={`themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center ${
          isChecked ? 'dark' : ''
        }`}
        onClick={handleImageClick}
      >
        <img
          src={imageSrc}
          alt={isChecked ? 'Moon' : 'Sun'}
          className={`icon ${isChecked ? 'invert' : ''}`}
          style={{ width: isChecked ? '30px' : '32px' }}
        />
      </div>
    </>
  );
};

export default Switcher12;
