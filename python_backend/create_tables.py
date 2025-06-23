import os
from supabase import create_client
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

def init_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("Missing Supabase credentials")
    return create_client(url, key)

def read_migration_file(filename):
    with open(filename, 'r') as f:
        return f.read()

def main():
    try:
        # Initialize Supabase client
        supabase = init_supabase()
        logger.info("Connected to Supabase")

        # Read and execute MRO table migration
        script_dir = os.path.dirname(os.path.abspath(__file__))
        migration_path = os.path.join(script_dir, 'migrations', '02_create_mro_table.sql')
        migration_sql = read_migration_file(migration_path)
        
        # Execute migration
        logger.info("Executing MRO table migration...")
        try:
            # Execute SQL migration directly
            supabase.table('rest').execute(migration_sql)
            logger.info("MRO table created successfully")
        except Exception as e:
            if 'already exists' not in str(e).lower():
                logger.error(f"Error: {str(e)}")
                raise
            logger.info("Some objects already exist, continuing...")

    except Exception as e:
        logger.error(f"Error creating tables: {str(e)}")
        raise

if __name__ == "__main__":
    main()
