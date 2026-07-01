import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p35572628_neptune_exploration_')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', '')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def check_auth(event):
    headers = event.get('headers') or {}
    token = headers.get('x-admin-token') or headers.get('X-Admin-Token') or ''
    return token == ADMIN_TOKEN and ADMIN_TOKEN != ''

def row_to_dict(row):
    return {
        'id': row[0],
        'title': row[1],
        'album': row[2],
        'year': row[3],
        'cover_url': row[4],
        'audio_url': row[5],
        'sort_order': row[6],
    }

def handler(event: dict, context) -> dict:
    """CRUD для управления треками: GET — список, POST — создать, PUT — обновить, DELETE — удалить."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}

    # GET — публичный список треков
    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f'SELECT id, title, album, year, cover_url, audio_url, sort_order '
            f'FROM {SCHEMA}.tracks ORDER BY sort_order ASC, id ASC'
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        tracks = [row_to_dict(r) for r in rows]
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'tracks': tracks, 'total': len(tracks)}, ensure_ascii=False)
        }

    # Все остальные методы — требуют авторизации
    if not check_auth(event):
        return {
            'statusCode': 401,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Unauthorized'})
        }

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    conn = get_conn()
    cur = conn.cursor()

    # POST — создать трек
    if method == 'POST':
        cur.execute(
            f'INSERT INTO {SCHEMA}.tracks (title, album, year, cover_url, audio_url, sort_order) '
            f'VALUES (%s, %s, %s, %s, %s, %s) RETURNING id',
            (
                body.get('title', 'Без названия'),
                body.get('album', 'Сингл'),
                body.get('year', ''),
                body.get('cover_url'),
                body.get('audio_url'),
                body.get('sort_order', 0),
            )
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'id': new_id, 'ok': True})
        }

    # PUT — обновить трек
    if method == 'PUT':
        track_id = params.get('id') or body.get('id')
        cur.execute(
            f'UPDATE {SCHEMA}.tracks SET title=%s, album=%s, year=%s, cover_url=%s, audio_url=%s, sort_order=%s '
            f'WHERE id=%s',
            (
                body.get('title'),
                body.get('album'),
                body.get('year'),
                body.get('cover_url'),
                body.get('audio_url'),
                body.get('sort_order', 0),
                track_id,
            )
        )
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }

    # DELETE — удалить трек
    if method == 'DELETE':
        track_id = params.get('id')
        cur.execute(f'DELETE FROM {SCHEMA}.tracks WHERE id=%s', (track_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }

    return {'statusCode': 405, 'headers': CORS, 'body': ''}
