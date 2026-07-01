#!/usr/bin/env python3
"""
Telegram Bot Launcher - reads env variables and starts bot.py
"""
import os
import sys
import asyncio
from pathlib import Path

# Add the opt folder to Python path
sys.path.insert(0, str(Path(__file__).parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Import and run bot
from bot import dp, bot, stop_event

async def main():
    """Start the bot."""
    print("🤖 Starting Telegram bot...")
    print(f"Bot token: {os.getenv('BOT_TOKEN', 'NOT SET')[:10]}...")
    print(f"Chat ID: {os.getenv('CHAT_ID', 'NOT SET')}")
    
    # Start polling
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n✅ Bot stopped")
        stop_event.set()
