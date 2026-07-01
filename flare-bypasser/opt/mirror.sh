#!/bin/bash
# Полный скрипт для зеркалирования с кастомной структурой, заменяя все домены и поддомены на tgstat.eu
OLD_DOMAIN="tgstat.ru"
NEW_DOMAIN="tgstat.eu"
FLARESOLVERR_URL="http://localhost:8080"
BASE_DIR="/opt/flare-bypasser/www"
USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."

# Извлекаем путь из URL
url="$1"
path_with_query="${url#https://*/}"
path="${path_with_query%%\?*}"
filename=$(basename "$path" || echo "index")  # Если URL заканчивается на /
html_path="${BASE_DIR}/${path%.*}.html"      # Удаляем расширение, если есть

# Создаем структуру директорий
mkdir -p "$(dirname "$html_path")"
mkdir -p "${BASE_DIR}/static"
mkdir -p "${BASE_DIR}/img"
mkdir -p "${BASE_DIR}/fonts"
chown -R $USER "${BASE_DIR}"

# Получаем данные через FlareSolverr
echo "[1/5] Получаем основной контент..."
response=$(curl -s -X POST "${FLARESOLVERR_URL}/v1" \
  -H "Content-Type: application/json" \
  --data-raw "{
    \"cmd\": \"collect-resources\",
    \"url\": \"$1\",
    \"maxTimeout\": 60000
}")

# Сохраняем основной HTML
main_html=$(echo "$response" | jq -r '.solution.response.dom')
echo "$main_html" | tee "$html_path" > /dev/null

# Извлекаем и фильтруем URL
echo "[2/5] Анализируем ресурсы..."
urls=$(echo "$response" | jq -r '.solution.response.content_urls[]' | sort -u | grep -E '/static/|/img/|/fonts/|\.(css|js|png|jpg|jpeg|gif|ico|webp|woff2?|ttf|svg)$')

# Скачиваем статику
echo "[3/5] Скачиваем ресурсы..."
echo "$urls" | while read -r url; do
  clean_url="${url%%\?*}"  # Убираем версионность
  if [[ "$clean_url" == *"${OLD_DOMAIN}"* ]]; then
    # Определяем путь для сохранения
    save_path="${BASE_DIR}$(echo "$clean_url" | sed -E "s|https?://[^/]+||")"

    # Проверяем существование файла
    if [[ -f "$save_path" ]]; then
      echo "Файл существует: ${save_path}"
      continue
    fi

    # Скачиваем и сохраняем
    echo "Скачиваем: ${clean_url}"
    mkdir -p "$(dirname "$save_path")"
    curl -s -A "${USER_AGENT}" "$clean_url" | tee "$save_path" > /dev/null
  fi
done

# Обновляем ссылки в HTML и CSS
echo "[4/5] Обновляем пути в файлах..."
# Заменяем все старые домены (su, pro, ru) на новый домен pw только в текущем файле
sed -i \
  -e "s|https://tgstat\.su|https://${NEW_DOMAIN}|gI" \
  -e "s|https://tgstat\.pro|https://${NEW_DOMAIN}|gI" \
  -e "s|https://tgstat\.ru|https://${NEW_DOMAIN}|gI" \
  -e "s|http://tgstat\.su|https://${NEW_DOMAIN}|gI" \
  -e "s|http://tgstat\.pro|https://${NEW_DOMAIN}|gI" \
  -e "s|http://tgstat\.ru|https://${NEW_DOMAIN}|gI" \
  "$html_path"

# Обновляем только те статические файлы, которые были скачаны в этой сессии
# (новые файлы, измененные менее 1 минуты назад)
find "${BASE_DIR}/static" "${BASE_DIR}/img" "${BASE_DIR}/fonts" -type f \( -name "*.css" -o -name "*.js" -o -name "*.woff" -o -name "*.woff2" -o -name "*.ttf" \) -mmin -1 -exec sed -i \
  -e "s|https://tgstat\.su|https://${NEW_DOMAIN}|gI" \
  -e "s|https://tgstat\.pro|https://${NEW_DOMAIN}|gI" \
  -e "s|https://tgstat\.ru|https://${NEW_DOMAIN}|gI" \
  -e "s|http://tgstat\.su|https://${NEW_DOMAIN}|gI" \
  -e "s|http://tgstat\.pro|https://${NEW_DOMAIN}|gI" \
  -e "s|http://tgstat\.ru|https://${NEW_DOMAIN}|gI" \
  {} \;

echo "Готово! Результат:"
echo "• Основной файл: ${html_path}"
echo "• Статика: ${BASE_DIR}/static/"
echo "• Картинки: ${BASE_DIR}/img/"
echo "• Шрифты: ${BASE_DIR}/fonts/"
