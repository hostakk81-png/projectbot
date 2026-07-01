import React, { memo, useEffect } from 'react';

import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useTelegram from '../../hooks/useTelegram';

const Layout = () => {
    const { pathname } = useLocation();
    const { tg } = useTelegram();

    console.log(tg);

    useEffect(() => {
      tg.ready();
      tg.disableVerticalSwipes()
      tg.expand();
    }, []);

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return <Outlet />;
  };
  
export default memo(Layout);