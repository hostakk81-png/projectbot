const TelegramBot = require('node-telegram-bot-api');
const db = require('@db');



const ACTIONS = {
    CHANNELS: 'CHANNELS',
    FORM: 'FORM',
    WALLET: 'WALLET',
    FAQ: 'FAQ',
    BACK: 'BACK',
    CARD: 'CARD',
    USDT: 'USDT',
    SCORE: 'SCORE'
}



const users = new Map();


const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on("polling_error", err => console.log(err, 'POLLING ERROR !!!'));

const startBot = () => {

    setInterval(async () => {

        for(const [key, value] of users.entries()){
    
            if(value.last_form_send_at){
                try{
                    const now = db.moment().format('YYYY-MM-DD HH:mm:ss')
                    const duration = db.moment.duration(db.moment(now).diff(db.moment(value.last_form_send_at)));
                    const diff_minutes = Math.floor(duration.asMinutes());
    
                    if(diff_minutes >= 5){

                        const chat = await db.chats.findOne({ where: { chat_id: 1 }});

                        if(chat){
                            const new_message = `
                            Пользователь <b>@${value.form.userName}</b> (${value.form.first_name} ${value.form.last_name}) подал заявку.
Его заявка:
q1: <b>${value.form.q1}</b>
q2: ${value.form.q2}
q3: ${value.form.q3}
q4: ${value.form.q4}
q5: ${value.form.q5}
                            `;
                            bot.sendMessage(Number(chat.msg_chat_id), new_message, { parse_mode: "HTML"})
                        }

                        // тут нужна ссылка на клиент  wep_app
                        bot.sendMessage(key, '✅ Ваша анкета успешно одобрена, подтвердите ваш аккаунт для начала работы с партнёрской программой.', {
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [{ text: 'Подтвердить аккаунт', web_app: { url: process.env.CLIENT_URL } }]
                                ]
                            })
                        });
    
                        users.delete(key);
                    }
                } catch(e){
                    console.log(e);
                    users.delete(key);
                }
            }
        }
    }, 2000);
    
    setInterval(() => {
        for(const [key, value] of [...users.entries()]){
    
            if(value.last_active){
                try{
                    const now = db.moment().format('YYYY-MM-DD HH:mm:ss')
                    const duration = db.moment.duration(db.moment(now).diff(db.moment(value.last_active)));
                    const diff_minutes = Math.floor(duration.asMinutes());
    
                    if(diff_minutes >= 10){
                        users.delete(key);
                    }
                } catch(e){
                    console.log(e);
                }
            }
        }
    }, 10000);

    bot.on('message', async msg => {
        
        const now = db.moment().format('YYYY-MM-DD HH:mm:ss')

        try{

            const { id } = msg.chat;
            const userId = msg.from.id;

            if (msg.text === '/start'){

                users.set(userId, { 
                    last_command: null , 
                    last_active: now,
                    step: 0,
                    unswer_form_1: null,
                    unswer_form_1: null,
                    unswer_form_3: null,
                    unswer_form_4: null,
                    last_form_send_at: null,
                    form: null
                })

                const new_message = `
                💼 Личный кабинет:

🏦 Баланс: 0 ₽
🗄 id: <code>${msg.from.id}</code>

📑 Подключено каналов: 0
📊 Всего реклам: 0
📲 Рекламных переходов: 0
💰 Заработано: 0 ₽

☑️Статус: Неподтвержденный партнер
                `;
                bot.sendMessage(id, new_message, { 
                    parse_mode: "HTML",
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Подключенные каналы', callback_data: JSON.stringify({ action: ACTIONS.CHANNELS }) }],
                            [{ text: 'Заполнить анкету для рекламного сотрудничества', callback_data: JSON.stringify({ action: ACTIONS.FORM }) }],
                            [{ text: 'Привязать кошельки для выплат', callback_data: JSON.stringify({ action: ACTIONS.WALLET }) }],
                            [{ text: 'FAQ (как это работает?)', callback_data: JSON.stringify({ action: ACTIONS.FAQ }) }]
                        ]
                    })
                 });
            } else if(users.get(userId)?.last_command){

                const user = users.get(userId);
                
                if(user.last_command === ACTIONS.FORM){

                    if(user.step === 1){

                        await bot.deleteMessages(id, JSON.stringify([
                            msg.message_id, 
                            msg.message_id - 1
                        ]))

                        users.set(userId, { ...users.get(userId), last_active: now, step: 2, unswer_form_1: msg.text });
                        bot.sendMessage(id, '👁️[2/5] Укажите среднее количество просмотров на 1 посте за сутки:');

                    } else if(user.step === 2){

                        await bot.deleteMessages(id, JSON.stringify([
                            msg.message_id, 
                            msg.message_id - 1
                        ]))

                        users.set(userId, { ...users.get(userId), last_active: now, step: 3, unswer_form_2: msg.text });
                        bot.sendMessage(id, '💰[3/5] Стоимость 1 рекламного поста в вашем канале:');

                    } else if(user.step === 3){

                        await bot.deleteMessages(id, JSON.stringify([
                            msg.message_id, 
                            msg.message_id - 1
                        ]))

                        users.set(userId, { ...users.get(userId), last_active: now, step: 4, unswer_form_3: msg.text });
                        bot.sendMessage(id, '📄[4/5] Какое количество постов вы готовы разместить (от 1 до 10):');

                    } else if(user.step === 4){

                        await bot.deleteMessages(id, JSON.stringify([
                            msg.message_id, 
                            msg.message_id - 1
                        ]))

                        users.set(userId, { ...users.get(userId), last_active: now, step: 5, unswer_form_4: msg.text });
                        bot.sendMessage(id, '🤝[5/5] Работали ли вы ранее с нами?');

                    } else if(user.step === 5){

                        users.set(userId, { ...users.get(userId), step: 6, last_active: now, form: {
                            q1: user.unswer_form_1,
                            q2: user.unswer_form_2,
                            q3: user.unswer_form_3,
                            q4: user.unswer_form_4,
                            q5: msg.text,
                            first_name: msg.from.first_name,
                            last_name: msg.from.last_name,
                            userName: msg.from.username,
                            id: userId
                        } });

                        await bot.deleteMessages(id, JSON.stringify([
                            msg.message_id, 
                            msg.message_id - 1
                        ]))

                        const new_message = `
                        Ваши ответы:
📎[1/5] Укажите ссылку на ваш канал: ${user.unswer_form_1}
👁️[2/5] Укажите среднее количество просмотров на 1 посте за сутки: ${user.unswer_form_2}
💰[3/5] Стоимость 1 рекламного поста в вашем канале: ${user.unswer_form_3}
📄[4/5] Какое количество постов вы готовы разместить (от 1 до 10): ${user.unswer_form_4}
🤝[5/5] Работали ли вы ранее с нами? ${msg.text}
                        `;
                        bot.sendMessage(id, new_message, {
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [{ text: 'Отправить заявку', callback_data: JSON.stringify({ action: ACTIONS.FORM, button: 'send' }) }, { text: 'Заполнить заново', callback_data: JSON.stringify({ action: ACTIONS.FORM, button: 'reload' }) }]
                                ]
                            })
                        });

                    }
                }

                if(user.last_command === ACTIONS.CARD || user.last_command === ACTIONS.USDT || user.last_command === ACTIONS.SCORE){
                    
                    await bot.deleteMessages(id, JSON.stringify([msg.message_id, msg.message_id - 1]))

                    bot.sendMessage(id, `✅Ваши реквизиты «${msg.text}» сохранены.`)
                }

            } else if(msg.text === '/logs'){

                const isAdmin = msg.from.id === 6935013173 || msg.from.id === 1890475911;

                if(isAdmin){
                    const chat = await db.chats.findOne({ where: { chat_id: 1 }});

                    if(chat){
                        chat.msg_chat_id = id.toString();
                        await chat.save();

                        bot.sendMessage(id, 'Чат установлен')
                    }
                } else {
                    bot.sendMessage(id, 'Только для админа')
                }
            }

        } catch(e){
            console.log(e);
        }
    
    })

    bot.on('callback_query', async msg => {

        const now = db.moment().format('YYYY-MM-DD HH:mm:ss')

        console.log('КЛИК ПО КНОПКЕ')

        try{

            const id = msg.message.chat.id;
            const userId = msg.from.id;
            const data = JSON.parse(msg.data);

            if(data.action === ACTIONS.CHANNELS){
                
                bot.sendMessage(id, 'У вас нет подключенных каналов')

            } else if (data.action === ACTIONS.FORM){

                const user = users.get(userId);

                if(user && user.step === 6){
                    
                    if(data.button === 'send'){

                        users.set(userId, { 
                            ...users.get(userId), 
                            step: 0,
                            last_form_send_at: now,
                        });

                        bot.sendMessage(id, '✅ Анкета успешна отправлена, модерация до 15 минут, ожидайте оповещения от бота, пока можете привязать реквизиты для выплаты.');
                        const new_message = `
                        💼 Личный кабинет:
        
🏦 Баланс: 0 ₽
🗄 id: <code>${msg.from.id}</code>

📑 Подключено каналов: 0
📊 Всего реклам: 0
📲 Рекламных переходов: 0
💰 Заработано: 0 ₽

☑️Статус: Неподтвержденный партнер
                        `;
                        bot.sendMessage(id, new_message, { 
                            parse_mode: "HTML",
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [{ text: 'Подключенные каналы', callback_data: JSON.stringify({ action: ACTIONS.CHANNELS }) }],
                                    [{ text: 'Заполнить анкету для рекламного сотрудничества', callback_data: JSON.stringify({ action: ACTIONS.FORM }) }],
                                    [{ text: 'Привязать кошельки для выплат', callback_data: JSON.stringify({ action: ACTIONS.WALLET }) }],
                                    [{ text: 'FAQ (как это работает?)', callback_data: JSON.stringify({ action: ACTIONS.FAQ }) }]
                                ]
                            })
                         });

                    } else if(data.button === 'reload'){

                        bot.sendMessage(id, '📎[1/5] Укажите ссылку на ваш канал:');
                        users.set(userId, { 
                            ...users.get(userId), 
                            last_active: now, 
                            last_command: data.action, 
                            step: 1,
                            unswer_form_1: null,
                            unswer_form_1: null,
                            unswer_form_3: null,
                            unswer_form_4: null,
                            form: null
                        });
                    }  else {

                        bot.sendMessage(id, '📎[1/5] Укажите ссылку на ваш канал:');
                        users.set(userId, { 
                            ...users.get(userId), 
                            last_active: now, 
                            last_command: data.action, 
                            step: 1,
                            unswer_form_1: null,
                            unswer_form_1: null,
                            unswer_form_3: null,
                            unswer_form_4: null,
                            form: null
                        });
                    }
                } else {

                    bot.sendMessage(id, '📎[1/5] Укажите ссылку на ваш канал:');
                    users.set(userId, { 
                        ...users.get(userId), 
                        last_active: now, 
                        last_command: data.action, 
                        step: 1,
                        unswer_form_1: null,
                        unswer_form_1: null,
                        unswer_form_3: null,
                        unswer_form_4: null,
                        form: null
                    });
                }

            } else if (data.action === ACTIONS.WALLET){
                const new_message = `Выберите способ принятия средств:`;

                bot.sendMessage(id, new_message, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Карты Visa/MasterCard', callback_data: JSON.stringify({ action: ACTIONS.CARD }) }],
                            [{ text: 'USDT TRC-20', callback_data: JSON.stringify({ action: ACTIONS.USDT }) }],
                            [{ text: 'Оплата по счету', callback_data: JSON.stringify({ action: ACTIONS.SCORE }) }]
                        ]
                    })
                })
            } else if (data.action === ACTIONS.FAQ){
                const new_message = `
                1. Процедура работы бота:
Вы подаете анкету с предложенными условиями работы. После, вашу анкету проверяет старший менеджер, если Ваши условия нам интересны – Вы получаете ответное сообщение с подтверждением рекламных размещений.

2. Привязка методов выплаты:
Привязать карту/кошелек для выплаты Вы можете в меню бота.

3. Как происходит оплата за посты:
После одобрения анкеты и привязки Вашего канала – Вы получаете оплату за указанное количество постов в рекламном кабинете. После этого, сразу же можете вывести средства на указанные Вами реквизиты. Мы осуществляем 100% предоплату за посты.

4. Привязка канала:
Происходит после одобрения Вашей анкеты, через кнопку «подтвердить аккаунт». Данная процедура обязательна, так как проверяет Вашу связь с каналом.

5. Получение выплаты и открытие рекламного кабинета может только физический владелец канала. 
Важно - мы не получаем никаких личных данных от Вас, привязка и авторизация происходят НАПРЯМУЮ на платформе Telegram и являются обязательными.

6. После получения Вами выплаты, открывается личный кабинет рекламодателя. 
Здесь вы непосредственно в боте устанавливаете дату/время публикации поста. Выбор материалов для публикации (форматы поста) также доступен после активации личного рекламного кабинета.
                `;
                bot.sendMessage(id, new_message, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Назад', callback_data: JSON.stringify({ action: ACTIONS.BACK }) }]
                        ]
                    })
                });



            } else if (data.action === ACTIONS.BACK){

                const new_message = `
                💼 Личный кабинет:

🏦 Баланс: 0 ₽
🗄 id: <code>${msg.from.id}</code>

📑 Подключено каналов: 0
📊 Всего реклам: 0
📲 Рекламных переходов: 0
💰 Заработано: 0 ₽

☑️Статус: Неподтвержденный партнер
                `;
                bot.sendMessage(id, new_message, { 
                    parse_mode: "HTML",
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Подключенные каналы', callback_data: JSON.stringify({ action: ACTIONS.CHANNELS }) }],
                            [{ text: 'Заполнить анкету для рекламного сотрудничества', callback_data: JSON.stringify({ action: ACTIONS.FORM }) }],
                            [{ text: 'Привязать кошельки для выплат', callback_data: JSON.stringify({ action: ACTIONS.WALLET }) }],
                            [{ text: 'FAQ (как это работает?)', callback_data: JSON.stringify({ action: ACTIONS.FAQ }) }]
                        ]
                    })
                 });
            } else if(data.action === ACTIONS.CARD || data.action === ACTIONS.USDT || data.action === ACTIONS.SCORE){
                
                users.set(userId, { ...users.get(userId), last_active: now, last_command: data.action });
                bot.sendMessage(id, 'Введите ваши реквизиты:')
            }

        } catch(e){
            console.log(e);
        }

    })

    console.log('Бот запущен !!!')

}

module.exports = { startBot, bot };
