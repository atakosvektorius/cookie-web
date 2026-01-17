############################################################
# Author:           Tomas Vanagas
# Updated:          2025-10-26
# Version:          1.0
# Description:      Main file for the backend
############################################################

import os
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix



app = Flask(__name__)




if __name__ == '__main__':
    APP_DEBUG = os.getenv('APP_DEBUG', 'false').lower() == 'true'

    # Initialize database
    from app.database.db_init import init_db
    init_db()


    # Trust X-Forwarded-For headers from reverse proxy
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)


    # Register blueprints
    from app.cookies.routes import bp_cookies
    app.register_blueprint(bp_cookies, url_prefix='')

    from app.subscription.routes import bp_subscription
    app.register_blueprint(bp_subscription, url_prefix='')

    from app.export.routes import bp_export
    app.register_blueprint(bp_export, url_prefix='')


    # Run backend
    app.run(host='0.0.0.0', port=8000, debug=APP_DEBUG)