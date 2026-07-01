import asyncio
import os
import subprocess
from aiogram import Bot, Dispatcher, Router, types, F
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
import re
import signal
from aiogram.utils.keyboard import InlineKeyboardBuilder
import math

# Вайтлист пользователей
WHITELIST_IDS = {6858870189, 5155111091, 6668269096, 6618132398}

# Создаём бота и диспетчер
bot = Bot(
    token="8374543782:AAEY9pVB39AIZBsDtmfsq4pUlIUP_rqC-jw",
    default=DefaultBotProperties(parse_mode=ParseMode.HTML)
)
dp = Dispatcher()
router = Router()
dp.include_router(router)

# Константы
DOMAIN = "https://tgstat.eu"
LOCAL_FOLDER = "/opt/flare-bypasser/www/channel"
WEBSOCKET_PORT = 8765
ITEMS_PER_PAGE = 10

# 📌 Обработчик SIGINT и SIGTERM
stop_event = asyncio.Event()

def handle_shutdown(signum, frame):
    print("Received shutdown signal. Cleaning up...")
    stop_event.set()

signal.signal(signal.SIGINT, handle_shutdown)
signal.signal(signal.SIGTERM, handle_shutdown)


def escape_markdown(text: str) -> str:
    """Экранирует специальные символы Markdown."""
    return re.sub(r'([_*\[\]()~`>#+\-=|{}.!])', r'\\\1', text)


# Проверка пользователя
def is_user_allowed(user_id: int) -> bool:
    return user_id in WHITELIST_IDS

# Очистка URL
def sanitize_url(url: str) -> str:
    return re.sub(r'[^a-zA-Z0-9_.-/@s:]', '', url)


# Получить список всех страниц, отсортированных по дате создания (новые сначала)
def get_pages_list():
    """Возвращает список всех HTML страниц, отсортированных от новых к старым."""
    if not os.path.exists(LOCAL_FOLDER):
        return []
    
    pages = []
    for file in os.listdir(LOCAL_FOLDER):
        if file.endswith('.html') and file.startswith('@'):
            file_path = os.path.join(LOCAL_FOLDER, file)
            # Получаем время создания файла
            mtime = os.path.getmtime(file_path)
            username = file.replace('.html', '')
            pages.append((username, mtime))
    
    # Сортируем по времени создания (новые сначала)
    pages.sort(key=lambda x: x[1], reverse=True)
    return [username for username, _ in pages]


# Создать клавиатуру со списком страниц
def create_pages_keyboard(page=0):
    """Создает inline клавиатуру с пагинацией для списка страниц."""
    pages_list = get_pages_list()
    total_pages = math.ceil(len(pages_list) / ITEMS_PER_PAGE)
    
    if total_pages == 0:
        builder = InlineKeyboardBuilder()
        builder.row(InlineKeyboardButton(text="Страниц нет", callback_data="noop"))
        return builder.as_markup(), 0
    
    # Ограничиваем номер страницы
    page = max(0, min(page, total_pages - 1))
    
    start_idx = page * ITEMS_PER_PAGE
    end_idx = start_idx + ITEMS_PER_PAGE
    current_pages = pages_list[start_idx:end_idx]
    
    builder = InlineKeyboardBuilder()
    
    # Добавляем кнопки для каждой страницы
    for username in current_pages:
        builder.row(
            InlineKeyboardButton(
                text=username,
                url=f"{DOMAIN}/channel/{username}"
            ),
            InlineKeyboardButton(
                text="🗑",
                callback_data=f"delete:{username}"
            )
        )
    
    # Кнопки навигации
    nav_buttons = []
    if page > 0:
        nav_buttons.append(InlineKeyboardButton(text="◀️ Назад", callback_data=f"page:{page-1}"))
    
    nav_buttons.append(InlineKeyboardButton(text=f"{page+1}/{total_pages}", callback_data="noop"))
    
    if page < total_pages - 1:
        nav_buttons.append(InlineKeyboardButton(text="Вперед ▶️", callback_data=f"page:{page+1}"))
    
    builder.row(*nav_buttons)
    
    # Кнопка обновления
    builder.row(InlineKeyboardButton(text="🔄 Обновить список", callback_data=f"page:{page}"))
    
    return builder.as_markup(), len(pages_list)


# 📌 Команда /start
@router.message(Command("start"))
async def send_welcome(message: types.Message):
    if is_user_allowed(message.from_user.id):
        await message.reply("👋 Привет! Отправь мне username, и я сделаю копию!\n\n"
                          "📋 Используй /pages чтобы посмотреть список созданных страниц")


# 📌 Команда /pages - показать список всех страниц
@router.message(Command("pages"))
async def show_pages_list(message: types.Message):
    if not is_user_allowed(message.from_user.id):
        return
    
    keyboard, total = create_pages_keyboard(0)
    
    if total == 0:
        await message.reply("📭 Сгенерированных страниц пока нет")
    else:
        await message.reply(
            f"📄 Сгенерированные страницы ({total}):\n\n"
            f"• Нажми на username чтобы открыть страницу\n"
            f"• Нажми 🗑 чтобы удалить страницу",
            reply_markup=keyboard
        )


# 📌 Обработчик callback-запросов (пагинация и удаление)
@router.callback_query(F.data.startswith("page:"))
async def paginate_pages(callback: CallbackQuery):
    if not is_user_allowed(callback.from_user.id):
        await callback.answer("❌ Доступ запрещен")
        return
    
    page = int(callback.data.split(":")[1])
    keyboard, total = create_pages_keyboard(page)
    
    await callback.message.edit_text(
        f"📄 Сгенерированные страницы ({total}):\n\n"
        f"• Нажми на username чтобы открыть страницу\n"
        f"• Нажми 🗑 чтобы удалить страницу",
        reply_markup=keyboard
    )
    await callback.answer()


# 📌 Подтверждение удаления
@router.callback_query(F.data.startswith("delete:"))
async def confirm_delete(callback: CallbackQuery):
    if not is_user_allowed(callback.from_user.id):
        await callback.answer("❌ Доступ запрещен")
        return
    
    username = callback.data.split(":", 1)[1]
    
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text="✅ Да, удалить", callback_data=f"confirm_delete:{username}"),
        InlineKeyboardButton(text="❌ Отмена", callback_data="cancel_delete")
    )
    
    await callback.message.edit_text(
        f"⚠️ Вы уверены, что хотите удалить страницу {username}?",
        reply_markup=builder.as_markup()
    )
    await callback.answer()


# 📌 Отмена удаления
@router.callback_query(F.data == "cancel_delete")
async def cancel_delete(callback: CallbackQuery):
    if not is_user_allowed(callback.from_user.id):
        await callback.answer("❌ Доступ запрещен")
        return
    
    keyboard, total = create_pages_keyboard(0)
    
    await callback.message.edit_text(
        f"📄 Сгенерированные страницы ({total}):\n\n"
        f"• Нажми на username чтобы открыть страницу\n"
        f"• Нажми 🗑 чтобы удалить страницу",
        reply_markup=keyboard
    )
    await callback.answer("✅ Отменено")


# 📌 Подтвержденное удаление
@router.callback_query(F.data.startswith("confirm_delete:"))
async def delete_page(callback: CallbackQuery):
    if not is_user_allowed(callback.from_user.id):
        await callback.answer("❌ Доступ запрещен")
        return
    
    username = callback.data.split(":", 1)[1]
    file_path = os.path.join(LOCAL_FOLDER, f"{username}.html")
    
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            await callback.answer(f"✅ Страница {username} удалена")
            
            # Возвращаемся в меню
            keyboard, total = create_pages_keyboard(0)
            await callback.message.edit_text(
                f"📄 Сгенерированные страницы ({total}):\n\n"
                f"• Нажми на username чтобы открыть страницу\n"
                f"• Нажми 🗑 чтобы удалить страницу",
                reply_markup=keyboard
            )
        except Exception as e:
            await callback.answer(f"❌ Ошибка при удалении: {str(e)}")
    else:
        await callback.answer("❌ Файл не найден")


# 📌 Заглушка для неактивных кнопок
@router.callback_query(F.data == "noop")
async def noop_callback(callback: CallbackQuery):
    await callback.answer()


# 📌 Обрабатываем ссылки
@router.message(lambda message: message.text)
async def process_link(message: types.Message):
    if is_user_allowed(message.from_user.id):
        url = message.text.strip()
        
        if not url.startswith("@"):
            await message.reply("❌ Ошибка: отправь мне корректный username!")
            return

        USERNAME = url.replace("@", "")

        builder = InlineKeyboardBuilder()
        builder.row(types.InlineKeyboardButton(
            text="tgstat.ru",
            url=f"https://tgstat.ru/channel/@{USERNAME}")
        )
        builder.row(types.InlineKeyboardButton(
            text="tgstat.eu",
            url=f"https://tgstat.eu/channel/@{USERNAME}")
        )

        if os.path.exists(f"/opt/flare-bypasser/www/channel/@{USERNAME}.html"):
            await message.reply(f"⚠️ Этот username уже обработан! Вот твоя страница:", reply_markup=builder.as_markup())
            return

        await message.reply(f"🔍 Обрабатываю username: @{USERNAME}")

        process = await asyncio.create_subprocess_shell(
            f"bash /opt/flare-bypasser/opt/mirror.sh https://tgstat.ru/channel/@{USERNAME}",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        stdout, stderr = await process.communicate()

        print("stdout", stdout.decode())
        print("stderr", stderr.decode())

        if process.returncode != 0:
            error_output = stderr.decode()
            # Ограничиваем длину сообщения об ошибке
            if len(error_output) > 300:
                error_message = escape_markdown(error_output[:300]) + "..."
            else:
                error_message = escape_markdown(error_output)
            await message.reply(f"❌ Ошибка! Проверьте что канал существует на tgstat.ru", parse_mode=ParseMode.MARKDOWN)
            return

        if os.path.exists(f"/opt/flare-bypasser/www/channel/@{USERNAME}.html"):
            await message.reply(f"✅ Готово! Вот твоя страница:", reply_markup=builder.as_markup())
        else:
            await message.reply("❌ Не удалось найти обработанную страницу.")


# 📌 Запускаем бота
async def main():
    await asyncio.gather(
        dp.start_polling(bot, skip_updates=True)
    )

if __name__ == '__main__':
    asyncio.run(main())
