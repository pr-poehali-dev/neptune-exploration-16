import json
import re
import urllib.request
import urllib.error

def handler(event: dict, context) -> dict:
    """Парсит стихи Дмитрия Рудака со stihi.ru и возвращает список или текст одного стихотворения."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    params = event.get('queryStringParameters') or {}
    poem_url = params.get('url')

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ru-RU,ru;q=0.9',
    }

    if poem_url:
        # Загружаем текст одного стихотворения
        result = fetch_poem(poem_url, headers)
    else:
        # Загружаем список стихов автора
        result = fetch_poem_list(headers)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'body': json.dumps(result, ensure_ascii=False)
    }


def fetch_poem_list(headers):
    url = 'https://stihi.ru/avtor/dimarus'
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('windows-1251', errors='replace')

    poems = []
    # Ищем ссылки вида /YYYY/MM/DD/NNNN с названием
    pattern = r'<a href="(/\d{4}/\d{2}/\d{2}/\d+)"[^>]*>([^<]+)</a>'
    matches = re.findall(pattern, html)

    seen = set()
    for path, title in matches:
        title = title.strip()
        if path not in seen and title and len(title) > 2:
            seen.add(path)
            poems.append({
                'title': title,
                'url': 'https://stihi.ru' + path,
                'path': path,
            })

    return {'poems': poems, 'total': len(poems)}


def fetch_poem(poem_url, headers):
    if not poem_url.startswith('https://stihi.ru/'):
        return {'error': 'Invalid URL'}

    req = urllib.request.Request(poem_url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('windows-1251', errors='replace')

    # Заголовок стихотворения
    title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
    title = title_match.group(1).strip() if title_match else ''

    # Текст стихотворения — в div с классом текста
    text_match = re.search(r'<div\s+class="text"[^>]*>(.*?)</div>', html, re.DOTALL)
    if not text_match:
        # Альтернативный вариант разметки
        text_match = re.search(r'<!--\s*text\s*-->(.*?)<!--', html, re.DOTALL)

    text = ''
    if text_match:
        raw = text_match.group(1)
        # Убираем HTML-теги, сохраняем переносы строк
        text = re.sub(r'<br\s*/?>', '\n', raw)
        text = re.sub(r'<[^>]+>', '', text)
        text = re.sub(r'&nbsp;', ' ', text)
        text = re.sub(r'&amp;', '&', text)
        text = re.sub(r'&#\d+;', '', text)
        text = text.strip()

    return {'title': title, 'text': text, 'url': poem_url}
