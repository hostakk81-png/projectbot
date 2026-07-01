import React, { useState, useEffect, useCallback, useRef } from "react"

const tg = window.Telegram.WebApp;

const useTelegram = () => {

    return { tg }
}

export default useTelegram;

