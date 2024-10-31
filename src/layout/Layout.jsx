import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';

const Layout = () => {
    return (
      <div className="dark:bg-darkGray">
        <Header />
        <main className="flex justify-center min-h-screen w-full pt-20">
          <div className="w-full max-w-[1550px] pl-5 pr-5">
            <Outlet /> 
          </div>
        </main>
        <Footer />
      </div>
    )
}

export default Layout;
