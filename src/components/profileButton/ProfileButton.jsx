import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileButton = ({ buttonColor }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    setIsDarkMode(localStorage.getItem('darkMode') === 'true');
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsDarkMode(false);
    setIsDropdownOpen(false);
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  const handleLogin = () => {
    navigate('/Login');
  };

  const handleRegistration = () => {
    navigate('/SignUp');
  };

  return (
    <div className="relative ml-4">
      <button className={`text-gray-800 ${isDarkMode ? 'dark:text-white' : ''}`} onClick={handleDropdownToggle}>
        <img
          src="profile2.png"
          alt="Профиль"
          className="h-8 w-8"
          style={{ filter: isDarkMode ? 'invert(1)' : 'none' }}
        />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg rounded-lg">
          {accessToken ? (
            <button className={`block w-full py-2 px-4 ${buttonColor}`} onClick={handleLogout}>
              Выйти
            </button>
          ) : (
            <>
              <button className={`block w-full py-2 px-4 ${buttonColor}`} onClick={handleLogin}>
                Войти
              </button>
              <button className={`block w-full py-2 px-4 ${buttonColor}`} onClick={handleRegistration}>
                Зарегистрироваться
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileButton;