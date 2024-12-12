import React from 'react';
import Switcher12 from '../../components/switcher/Swither';
import { Link } from 'react-router-dom';
import "./Header.css"
import ProfileButton from '../../components/profileButton/ProfileButton';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full shadow-xl dark:bg-darkGray z-1000">
      <div className="bg-lightHeader dark:bg-darkGray  py-3 px-7 rounded-bl-xl rounded-br-xl">
        <nav className="flex justify-between max-w-[1500px] mx-auto text-gray-900 dark:text-white">
        <Link to="/" className="flex no-underline">
          <p className="text-3xl font-normal text-gray-800 dark:text-white">

          </p>
          <p className="text-3xl font-normal flex items-center">
          <span className="font-bold text-transparent bg-clip-text gradient-text">Проверятор</span>
          </p>
        </Link> 
        <div className="flex items-center gap-2">
            <Switcher12 />

            <ProfileButton/>

          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
