import React from 'react';
import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer className={`${styles.footer} w-full bg-lightHeader dark:bg-darkGray rounded-tl-2xl rounded-tr-2xl`}>
      <div className="container mx-auto px-6 lg:px-8 py-10 text-center text-gray-600 dark:text-white">
        Proveryator.<br/>.
      </div>
    </footer>      
  );
};

export default Footer;
