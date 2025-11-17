############################################################
# Author:           Tomas Vanagas
# Updated:          2025-10-26
# Version:          1.0
# Description:      Cookies flask routes
############################################################



from flask import Blueprint
from datetime import datetime
import json
from flask import Response, request, jsonify
import os

from app.database.db import get_db_connection






bp_cookies = Blueprint('cookies', __name__)



@bp_cookies.route('/api/getresults/<string:domain>', methods=['GET'])
def results_HTTPGET(domain):
    '''
    Get results for clients that want to check if a website is compliant with BDAR
    '''
    domain = domain.lower()
    with get_db_connection() as conn:

        dateNow = datetime.now().strftime("%Y-%m-%d")
        conn.execute(' INSERT INTO USERS_DomainQueries VALUES (?,?) ', [domain, dateNow])
        conn.commit()


        sqlFetchData = conn.execute('''
            WITH GetWebsiteCookies AS (
                SELECT
                    SC.CookieName,
                    SD.CookiesScanned
                FROM
                    SCANS_DomainNames SD
                INNER JOIN SCANS_Cookies SC ON SD.ID = SC.DomainNameID
                WHERE
                    SD.DomainName = ?
                    AND SD.Deleted = 0
            ),
            GetCookiesJoinedWithOpenCookie AS (
                SELECT
                    GetWebsiteCookies.*,
                    INFO_OpenCookieDatabase.Category,
                    IIF(GDPR_AllowedCookieCategories.Category IS NULL, 0, 1) AS IsAllowedBDAR
                FROM
                    GetWebsiteCookies
                LEFT JOIN INFO_OpenCookieDatabase
                    ON (GetWebsiteCookies.CookieName = INFO_OpenCookieDatabase.CookieName AND INFO_OpenCookieDatabase.Wildcardmatch == 0) 
                    OR
                    (GetWebsiteCookies.CookieName LIKE INFO_OpenCookieDatabase.CookieName || '%' AND INFO_OpenCookieDatabase.Wildcardmatch == 1)
                LEFT JOIN GDPR_AllowedCookieCategories
                    ON INFO_OpenCookieDatabase.Category = GDPR_AllowedCookieCategories.Category
            )

                                
            SELECT
                json_object(
                                
                    'isscanned',    IIF( EXISTS(SELECT 1 FROM SCANS_DomainNames WHERE DomainName = ? AND Deleted = 0),
                        1,
                        0           
                    ),

                    'cookies',      json_group_array(
                        json_object(
                            'cookiename',           CookieName,
                            'category',             IFNULL(Category, "?"),
                            'datechecked',          CookiesScanned,
                            'isallowedbdar',        IsAllowedBDAR
                        )
                    )

                )
            FROM 
                GetCookiesJoinedWithOpenCookie
        ''', [domain, domain])
        return Response(json.dumps(json.loads(sqlFetchData.fetchone()[0]), indent=4), mimetype='application/json')
    


@bp_cookies.route('/api/getcheckeddistribution', methods=['GET'])
def getcheckeddistribution():
    '''
    Get checked distribution for the admin
    '''
    with get_db_connection() as conn:
        sqlFetchData = conn.execute('''
            WITH GetDomainsDistribution AS (
                SELECT 
                    json_group_object(CookiesScanned, domain_count) AS domains_distribution
                FROM (
                    SELECT 
                        CookiesScanned,
                        COUNT(*) as domain_count
                    FROM 
                        SCANS_DomainNames
                    WHERE
                        Deleted = 0
                    GROUP BY 
                        CookiesScanned
                    ORDER BY 
                        CookiesScanned DESC
                )
            ),
            GetDeletedDomainsDistribution AS (
                SELECT 
                    json_group_object(CookiesScanned, domain_count) AS deleted_domains_distribution
                FROM (
                    SELECT 
                        CookiesScanned,
                        COUNT(*) as domain_count
                    FROM 
                        SCANS_DomainNames
                    WHERE
                        Deleted = 1
                    GROUP BY 
                        CookiesScanned
                    ORDER BY 
                        CookiesScanned DESC
                )
            )

            SELECT 
                json_object(
                    'total_domains', (SELECT COUNT(*) FROM SCANS_DomainNames WHERE Deleted = 0),
                    'total_deleted_domains', (SELECT COUNT(*) FROM SCANS_DomainNames WHERE Deleted = 1),
                    'domains', (SELECT JSON(domains_distribution) from GetDomainsDistribution),
                    'deleted_domains', (SELECT JSON(deleted_domains_distribution) from GetDeletedDomainsDistribution)
                )
        ''')
        jsonResult = json.loads(sqlFetchData.fetchone()[0])
        return Response(json.dumps(jsonResult, indent=4), mimetype='application/json')




@bp_cookies.route('/api/admin/cookies/push', methods=['POST'])
def cookies_push():
    '''
    Push cookies to the database
    {
        "action": "update",
        "api_key": "abcdef0123456789abcdef0123456789",
        "domain_name": "example.com",
        "cookies": [
            "_ga",
            "_gat",
            "_gid",
            "_ga_1234567890",
            "_ga_9876543210",
            "_ga_0987654321",
            "_ga_1234567890",
            "_ga_9876543210",
            "_ga_0987654321",
            "_ga_1234567890",
            "_ga_9876543210"
        ]
    }
    '''

    # POST request data
    data = request.get_json()
    if not data:
        ERROR = 'No data provided'
        print(f'ERROR: {ERROR}')
        return jsonify({'error': ERROR}), 400


    # STEP1: VALIDATE: Check if the API key is valid
    submitted_api_key = data.get('api_key')
    if not submitted_api_key:
        ERROR = 'API key is required'
        print(f'ERROR: {ERROR}')
        return jsonify({'error': ERROR}), 400
    if submitted_api_key.lower() != os.getenv('API_KEY').lower():
        ERROR = 'Invalid API key'
        print(f'ERROR: {ERROR}')
        return jsonify({'error': ERROR}), 401
    


    # STEP2: VALIDATE: Validate the domain name
    submitted_domain_name = data.get('domain_name')
    if not submitted_domain_name:
        ERROR = 'Domain name is required'
        print(f'ERROR: {ERROR}')
        return jsonify({'error': ERROR}), 400
    submitted_domain_name = submitted_domain_name.lower()
    for forbidenChar in [' ', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '[', ']', '{', '}', '|', '\'', '"', ':', ';', '<', '>', ',', '?', '/', '\\', '`', '~']:
        if forbidenChar in submitted_domain_name:
            ERROR = 'Domain name contains forbidden characters'
            print(f'ERROR: {ERROR}: {submitted_domain_name}')
            return jsonify({'error': ERROR}), 400



    # STEP3: Validate action
    submit_action = data.get('action')
    if not submit_action:
        return jsonify({'error': 'Action is required'}), 400
    submit_action = submit_action.lower()

    

    # STEP4: Push to the database
    if submit_action == 'update':
        # Step 1: Validate cookies list
        submitted_cookies = data.get('cookies')
        if submitted_cookies is None:
            submitted_cookies = []
        elif not isinstance(submitted_cookies, list):
            ERROR = 'Cookies must be an array'
            print(f'ERROR: {ERROR}')
            return jsonify({'error': ERROR}), 400
        
        with get_db_connection() as conn:
            dateNow = datetime.now().strftime("%Y-%m-%d")
            
            # Step 2: Insert or update the domain in SCANS_DomainNames
            conn.execute(' INSERT OR IGNORE INTO SCANS_DomainNames (DomainName, CookiesScanned, Deleted) VALUES (?, ?, 0) ', [submitted_domain_name, dateNow])
            conn.execute(' UPDATE SCANS_DomainNames SET CookiesScanned = ? WHERE DomainName = ? ', [dateNow, submitted_domain_name])
            conn.execute(' UPDATE SCANS_DomainNames SET Deleted = 0 WHERE DomainName = ? ', [submitted_domain_name])
            
            # Step 3: Get the domain ID
            domain_id_result = conn.execute(' SELECT ID FROM SCANS_DomainNames WHERE DomainName = ? ', [submitted_domain_name]).fetchone()
            domain_id = domain_id_result[0]
            
            # Step 4: Delete all previous cookies for this domain
            conn.execute(' DELETE FROM SCANS_Cookies WHERE DomainNameID = ? ', [domain_id])
            
            # Step 5: Insert new cookies
            for cookie_name in submitted_cookies:
                if cookie_name:  # Skip empty cookie names
                    conn.execute(' INSERT OR IGNORE INTO SCANS_Cookies (DomainNameID, CookieName) VALUES (?, ?) ', 
                        [domain_id, cookie_name]
                    )
            
            conn.commit()
            return jsonify({'message': 'Cookies pushed successfully'}), 200


    elif submit_action == 'delete':
        with get_db_connection() as conn:
            dateNow = datetime.now().strftime("%Y-%m-%d")
            
            # Get the domain ID first
            domain_id_result = conn.execute(' SELECT ID FROM SCANS_DomainNames WHERE DomainName = ? ', [submitted_domain_name]).fetchone()
            if domain_id_result:
                domain_id = domain_id_result[0]

                # Delete cookies and the domain
                conn.execute(' DELETE FROM SCANS_Cookies WHERE DomainNameID = ? ', [domain_id])
                conn.execute(' UPDATE SCANS_DomainNames SET Deleted = 1 WHERE ID = ? ', [domain_id])
                conn.execute(' UPDATE SCANS_DomainNames SET CookiesScanned = ? WHERE ID = ? ', [dateNow, domain_id])

            conn.commit()

            return jsonify({'message': 'Domain deleted successfully'}), 200


    else:
        ERROR = 'Invalid submit action'
        print(f'ERROR: {ERROR}')
        return jsonify({'error': ERROR}), 400




@bp_cookies.route('/api/admin/domains/push', methods=['POST'])
def domains_push():
    '''
    Push new domains to the database
    '''

    # POST request data
    data = request.get_json()
    if not data:
        ERROR = 'No data provided'
        print(f'ERROR: {ERROR}')
        return jsonify({'error': ERROR}), 400


    # STEP1: VALIDATE: Check if the API key is valid
    submitted_api_key = data.get('api_key')
    if not submitted_api_key:
        ERROR = 'API key is required'
        print(f'ERROR: {ERROR}')
        return jsonify({'error': ERROR}), 400
    if submitted_api_key.lower() != os.getenv('API_KEY').lower():
        ERROR = 'Invalid API key'
        print(f'ERROR: {ERROR}')
        return jsonify({'error': ERROR}), 401
    


    # STEP2: VALIDATE: Validate the domain name
    submitted_domain_names = data.get('domains')
    for submitted_domain_name in submitted_domain_names:
        submitted_domain_name = submitted_domain_name

        # STEP2.1: Validate the domain name characters
        for forbidenChar in [' ', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '[', ']', '{', '}', '|', '\'', '"', ':', ';', '<', '>', ',', '?', '/', '\\', '`', '~']:
            if forbidenChar in submitted_domain_name:
                ERROR = 'Domain name contains forbidden characters'
                print(f'ERROR: {ERROR}: {submitted_domain_name}')
                submitted_domain_names.remove(submitted_domain_name)
                continue
        

        
    # STEP3: Push new domains to the database
    with get_db_connection() as conn:
        for submitted_domain_name in submitted_domain_names:
            submitted_domain_name = submitted_domain_name.lower()
            conn.execute(' INSERT OR IGNORE INTO SCANS_DomainNames (DomainName, CookiesScanned, Deleted) VALUES (?, ?, 0) ', [submitted_domain_name, "0000-00-00"])
        conn.commit()


    return jsonify({'message': 'Domains pushed successfully'}), 200






@bp_cookies.route('/api/admin/cookies/getwork', methods=['POST'])
def cookies_getwork():
    '''
    Get work for the scanner worker - returns oldest domains that need rescanning
    Request body:
    {
        "api_key": "abcdef0123456789abcdef0123456789",
        "limit": 10  // optional, defaults to 50
    }
    '''
    
    # POST request data
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    

    # STEP1: VALIDATE: Check if the API key is valid
    submitted_api_key = data.get('api_key')
    if not submitted_api_key:
        return jsonify({'error': 'API key is required'}), 400
    if submitted_api_key.lower() != os.getenv('API_KEY').lower():
        return jsonify({'error': 'Invalid API key'}), 401
    

    # STEP2: Get limit parameter (default to 50)
    limit = int(data.get('limit', 50))
    if not isinstance(limit, int) or limit < 1 or limit > 100:
        return jsonify({'error': 'Limit must be an integer between 1 and 100'}), 400
    

    # STEP3: Query database for oldest domains (randomized from top 500 oldest)
    with get_db_connection() as conn:
        result = conn.execute('''
            SELECT 
                json_object(
                    'domains', json_group_array(
                        json_object(
                            'domain_name', DomainName,
                            'date_checked', CookiesScanned
                        )
                    )
                )
            FROM (
                SELECT 
                    DomainName,
                    CookiesScanned
                FROM (
                    SELECT 
                        DomainName,
                        CookiesScanned
                    FROM 
                        SCANS_DomainNames
                    WHERE
                        Deleted = 0
                    ORDER BY 
                        CookiesScanned ASC
                    LIMIT 500
                )
                ORDER BY RANDOM()
                LIMIT ?
            )
        ''', [limit]).fetchone()
        
        return Response(json.dumps(json.loads(result[0]), indent=4), mimetype='application/json')
        



@bp_cookies.route('/api/admin/deletedcookies/getwork', methods=['POST'])
def deletedcookies_getwork():
    '''
    Get work for the scanner worker - returns oldest domains that were deleted
    Request body:
    {
        "api_key": "abcdef0123456789abcdef0123456789",
        "limit": 10  // optional, defaults to 50
    }
    '''
    
    # POST request data
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    

    # STEP1: VALIDATE: Check if the API key is valid
    submitted_api_key = data.get('api_key')
    if not submitted_api_key:
        return jsonify({'error': 'API key is required'}), 400
    if submitted_api_key.lower() != os.getenv('API_KEY').lower():
        return jsonify({'error': 'Invalid API key'}), 401
    

    # STEP2: Get limit parameter (default to 50)
    limit = int(data.get('limit', 50))
    if limit < 1 or limit > 100:
        return jsonify({'error': 'Limit must be an integer between 1 and 100'}), 400
    

    # STEP3: Query database for oldest domains that were deleted (randomized from top 500 oldest)
    with get_db_connection() as conn:
        result = conn.execute('''
            SELECT 
                json_object(
                    'domains', json_group_array(
                        json_object(
                            'domain_name', DomainName,
                            'cookies_scanned', CookiesScanned
                        )
                    )
                )
            FROM (
                SELECT 
                    DomainName,
                    CookiesScanned
                FROM (
                    SELECT 
                        DomainName,
                        CookiesScanned
                    FROM 
                        SCANS_DomainNames
                    WHERE
                        Deleted = 1
                    ORDER BY 
                        CookiesScanned ASC
                    LIMIT 500
                )
                ORDER BY RANDOM()
                LIMIT ?
            )
        ''', [limit]).fetchone()
        
        return Response(json.dumps(json.loads(result[0]), indent=4), mimetype='application/json')
        