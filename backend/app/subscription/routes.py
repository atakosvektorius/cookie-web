############################################################
# Author:           Tomas Vanagas
# Updated:          2025-10-26
# Version:          1.0
# Description:      Subscription flask routes
############################################################



from flask import Blueprint
from datetime import datetime
from flask import request, jsonify

from app.database.db import get_db_connection






bp_subscription = Blueprint('subscription', __name__)




@bp_subscription.route('/api/subscribe', methods=['POST'])
def subscribe_http_post():
    data = request.get_json()
    email = data.get('email').lower()
    dateNow = datetime.now().strftime("%Y-%m-%d")

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    with get_db_connection() as conn:
        conn.execute("INSERT OR IGNORE INTO USERS_InformProVersion VALUES (?,?)", [email, dateNow])
        conn.commit()
    return jsonify({'message': 'Subscription successful'}), 200

