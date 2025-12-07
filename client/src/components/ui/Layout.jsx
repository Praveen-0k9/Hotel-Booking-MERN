import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Header } from './Header';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Home page needs more padding for the larger header + search bar
  // Other pages need less padding for the minimal header
  // UPDATE: Home header is now partially static, so we reduce padding significantly
  const paddingTopClass = isHomePage ? 'pt-0' : 'pt-24';

  return (
    <>
      <Header />
      <div className={`mx-auto flex min-h-screen max-w-screen-xl flex-col ${paddingTopClass}`}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
