import json
import os
import hmac
import hashlib
import datetime
import urllib.request
import xml.etree.ElementTree as ET


def sign(key, msg):
    return hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()


def get_signature_key(key, date_stamp, region, service):
    k_date = sign(('AWS4' + key).encode('utf-8'), date_stamp)
    k_region = sign(k_date, region)
    k_service = sign(k_region, service)
    return sign(k_service, 'aws4_request')


def list_s3_objects(access_key, secret_key):
    endpoint = 'bucket.poehali.dev'
    bucket = 'files'
    region = 'us-east-1'
    service = 's3'

    now = datetime.datetime.utcnow()
    amz_date = now.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = now.strftime('%Y%m%d')

    canonical_uri = f'/{bucket}'
    canonical_querystring = 'list-type=2'
    canonical_headers = f'host:{endpoint}\nx-amz-date:{amz_date}\n'
    signed_headers = 'host;x-amz-date'
    payload_hash = hashlib.sha256(b'').hexdigest()

    canonical_request = '\n'.join([
        'GET', canonical_uri, canonical_querystring,
        canonical_headers, signed_headers, payload_hash
    ])

    credential_scope = f'{date_stamp}/{region}/{service}/aws4_request'
    string_to_sign = '\n'.join([
        'AWS4-HMAC-SHA256', amz_date, credential_scope,
        hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()
    ])

    signing_key = get_signature_key(secret_key, date_stamp, region, service)
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()

    authorization = (
        f'AWS4-HMAC-SHA256 Credential={access_key}/{credential_scope}, '
        f'SignedHeaders={signed_headers}, Signature={signature}'
    )

    url = f'https://{endpoint}/{bucket}?{canonical_querystring}'
    req = urllib.request.Request(url, headers={
        'x-amz-date': amz_date,
        'Authorization': authorization,
    })
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.read().decode('utf-8')


def handler(event: dict, context) -> dict:
    """Возвращает список mp3-треков из S3-хранилища проекта."""

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

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    secret_key = os.environ['AWS_SECRET_ACCESS_KEY']
    cdn_base = f"https://cdn.poehali.dev/projects/{access_key}/bucket"

    xml_data = list_s3_objects(access_key, secret_key)

    ns = {'s3': 'http://s3.amazonaws.com/doc/2006-03-01/'}
    root = ET.fromstring(xml_data)

    tracks = []
    for obj in root.findall('s3:Contents', ns):
        key = obj.find('s3:Key', ns).text
        size = int(obj.find('s3:Size', ns).text)
        last_modified = obj.find('s3:LastModified', ns).text

        if key.lower().endswith('.mp3'):
            filename = key.split('/')[-1]
            name = filename.rsplit('.', 1)[0]
            tracks.append({
                'key': key,
                'title': name,
                'url': f"{cdn_base}/{key}",
                'size': size,
                'last_modified': last_modified,
            })

    tracks.sort(key=lambda x: x['last_modified'], reverse=True)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'body': json.dumps({'tracks': tracks, 'total': len(tracks)}, ensure_ascii=False)
    }