# 🤖 Запуск Telegram Bot на Railway

## 📋 Что нужно для запуска бота

### Локально (для тестирования)

```bash
# 1. Перейди в папку бота
cd flare-bypasser/opt

# 2. Создай .env файл с переменными
cat > .env << EOF
BOT_TOKEN=твой_токен_бота
CHAT_ID=твой_chat_id
EOF

# 3. Установи зависимости
pip install -r requirements.txt

# 4. Запусти бота
python run_bot.py
```

---

## 🚀 Запуск на Railway

### Шаг 1: Создай новый сервис (Bot) в Railway

В Dashboard Railway:
1. Нажми **+ New** → **GitHub Repo**
2. Выбери `projectbot` репозиторий
3. Нажми **Deploy**

### Шаг 2: Настрой переменные окружения

В панели сервиса Bot → **Variables**:

```
BOT_TOKEN = 8379607939:AAEXgHunA820-9b1cQxzUstc-e3FCVeKpZw
CHAT_ID = -1002833281333
```

> ⚠️ **Вместо значений выше используй СВОИ!**

### Шаг 3: Установи точку входа (Start Command)

В **Deploy** → **Settings**:

```
Start Command (Proc File или в настройках сервиса):
python /opt/bot/run_bot.py
```

Или создай файл `Procfile` в корне репозитория:

```
bot: cd flare-bypasser/opt && python run_bot.py
```

---

## 📦 Файлы для Railway

Убедись что коммитил:

```bash
git add flare-bypasser/opt/requirements.txt
git add flare-bypasser/opt/run_bot.py
git add flare-bypasser/opt/bot.py
git commit -m "feat: add bot launcher for railway"
git push
```

---

## 🔍 Переменные окружения (Environment Variables)

| Переменная | Значение | Описание |
|-----------|---------|---------|
| `BOT_TOKEN` | `8379607939:AAEXgHunA820-9b1cQxzUstc-e3FCVeKpZw` | Токен Telegram бота от @BotFather |
| `CHAT_ID` | `-1002833281333` | Chat ID канала для логов (начинается с `-100` для групп) |

### Где найти CHAT_ID?

1. Добавь бота в группу
2. Отправь сообщение
3. Отправь этот URL в браузер: `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
4. Найди `"chat":{"id":-100...}` 

---

## ⚡ Быстрая проверка

После развёртывания на Railway:

1. Отправь боту `/start` в Telegram
2. Отправь `/pages` для просмотра списка страниц

Если бот ответит → всё работает ✅

---

## ❓ Проблемы?

### Бот не запускается
- Проверь что `BOT_TOKEN` правильный
- Посмотри логи: Railway → Bot → Logs
- Запусти локально: `python run_bot.py`

### Permission Denied на скрипте
```bash
git update-index --chmod=+x flare-bypasser/opt/run_bot.py
git commit -m "fix: executable permissions"
git push
```

---

**Готово!** 🎉 Бот должен запуститься автоматически на Railway.
