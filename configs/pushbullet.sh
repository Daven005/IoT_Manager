#!/bin/sh
/usr/bin/curl -u o.076hxD0ngtxtPRPQrWhA824bc0XQFi6a: -X POST https://api.pushbullet.com/v2/pushes --header 'Content-Type: application/json' --data-binary '{"type": "note", "title": "'"$MONIT_HOST"'", "body": "'"$MONIT_SERVICE - $MONIT_DESCRIPTION"'"}'
