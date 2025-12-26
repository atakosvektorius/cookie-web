############################################################
# Author:           Tomas Vanagas
# Updated:          2025-12-26
# Version:          1.0
# Description:      Export routes for domain data
############################################################


from flask import Blueprint, Response, request, jsonify
import os

from app.database.db import get_db_connection


bp_export = Blueprint('export', __name__)


@bp_export.route('/api/admin/export/<string:export_type>', methods=['GET'])
def export_domains(export_type):
    '''
    Export domains as a plain text file
    Requires API key as query parameter: ?api_key=xxx
    
    Types:
        - domains: All active domains (one per line)
        - deleted: All deleted domains (one per line)
    '''
    
    # STEP1: VALIDATE: Check if the API key is valid
    submitted_api_key = request.args.get('api_key')
    if not submitted_api_key:
        return jsonify({'error': 'API key is required'}), 400
    if submitted_api_key.lower() != os.getenv('API_KEY').lower():
        return jsonify({'error': 'Invalid API key'}), 401
    
    
    # STEP2: Handle different export types
    export_type = export_type.lower()
    
    if export_type == 'domains':
        # Export all active domains
        with get_db_connection() as conn:
            result = conn.execute('''
                SELECT DomainName
                FROM SCANS_DomainNames
                WHERE Deleted = 0
                ORDER BY DomainName ASC
            ''').fetchall()
            
            domains_text = '\n'.join([row[0] for row in result])
            
            return Response(
                domains_text,
                mimetype='text/plain',
                headers={'Content-Disposition': 'attachment; filename=domains.txt'}
            )
    
    
    elif export_type == 'deleted':
        # Export all deleted domains
        with get_db_connection() as conn:
            result = conn.execute('''
                SELECT DomainName
                FROM SCANS_DomainNames
                WHERE Deleted = 1
                ORDER BY DomainName ASC
            ''').fetchall()
            
            domains_text = '\n'.join([row[0] for row in result])
            
            return Response(
                domains_text,
                mimetype='text/plain',
                headers={'Content-Disposition': 'attachment; filename=deleted_domains.txt'}
            )
    
    
    else:
        return jsonify({'error': f'Unknown export type: {export_type}. Valid types: domains, deleted'}), 400

