############################################################
# Author:           Tomas Vanagas
# Updated:          2025-10-26
# Version:          1.0
# Description:      Database initialization
############################################################


from .db import get_db_connection





def init_db():
    init_db_tables()
    init_default_data()




def init_db_tables():
    with get_db_connection() as conn:

        ############################ Users tables ###########################
        conn.execute('''
            CREATE TABLE IF NOT EXISTS "USERS_DomainQueries" (
                "Domain"	TEXT NOT NULL,
                "DateChecked"	TEXT NOT NULL
            );
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS "USERS_InformProVersion" (
                "Email"	TEXT NOT NULL UNIQUE,
                "Date"	TEXT NOT NULL
            );
        ''')
        #####################################################################


        ############################ Scans tables ###########################
        conn.execute('''
            CREATE TABLE IF NOT EXISTS "SCANS_Cookies" (
                "DomainNameID"	INTEGER,
                "CookieName"	TEXT NOT NULL,
                UNIQUE("CookieName","DomainNameID")
            );
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS "SCANS_DomainNames" (
                "ID"	INTEGER NOT NULL UNIQUE,
                "DomainName"	TEXT NOT NULL UNIQUE,
                "DateChecked"	TEXT NOT NULL,
                PRIMARY KEY("ID" AUTOINCREMENT)
            );
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS "SCANS_DeletedDomainNames" (
                "DomainName"	TEXT NOT NULL UNIQUE,
                "DateDeleted"	TEXT NOT NULL
            );
        ''')
        #####################################################################


        ############################ Other tables ###########################
        conn.execute('''
            CREATE TABLE IF NOT EXISTS "INFO_OpenCookieDatabase" (
                "ID"	TEXT UNIQUE,
                "Platform"	TEXT,
                "Category"	TEXT,
                "CookieName"	TEXT,
                "Domain"	TEXT,
                "Description"	TEXT,
                "Retentionperiod"	TEXT,
                "DataController"	TEXT,
                "UserPrivacy&GDPRRightsPortals"	TEXT,
                "Wildcardmatch"	INTEGER
            );
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS "GDPR_AllowedCookieCategories" (
                "Category"	TEXT NOT NULL UNIQUE
            );
        ''')
        #####################################################################

            

def init_default_data():
    pass