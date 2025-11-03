############################################################
# Author:           Tomas Vanagas
# Updated:          2025-06-29
# Version:          1.0
# Description:      Database connection
############################################################


import sqlite3
import os


def get_db_connection(filename=os.getenv('DB_PATH', '/data/slapukai.db')):
    conn = sqlite3.connect(filename, timeout=30.0)
    conn.row_factory = sqlite3.Row
    
    # Performance improvements
    conn.execute('PRAGMA journal_mode=WAL')  # Write-Ahead Logging
    conn.execute('PRAGMA temp_store=MEMORY')  # Store temp tables in memory
    conn.execute('PRAGMA mmap_size=268435456')  # 256MB memory-mapped I/O
    conn.execute('PRAGMA cache_size=-64000')  # 64MB cache
    
    return conn