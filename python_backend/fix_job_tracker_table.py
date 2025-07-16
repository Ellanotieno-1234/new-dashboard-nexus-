#!/usr/bin/env python3
"""
Script to fix the job tracker table structure
"""
import os
import sys
from pathlib import Path
import psycopg2
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

def fix_job_tracker_table():
    """Fix all missing columns in mro_job_tracker table"""
    
    # Get database connection details from environment
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL not found in environment")
        return False
    
    try:
        # Connect to database
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🔧 Fixing job tracker table structure...")
        
        # Define all required columns
        required_columns = {
            'job_card_no': "VARCHAR(100) UNIQUE",
            'customer': "VARCHAR(255)",
            'part_number': "VARCHAR(255)",
            'description': "TEXT",
            'serial_number': "VARCHAR(255)",
            'date_delivered': "DATE",
            'work_requested': "VARCHAR(255)",
            'progress': "VARCHAR(50)",
            'location': "VARCHAR(255)",
            'expected_release_date': "DATE",
            'remarks': "TEXT",
            'category': "VARCHAR(50)",
            'subcategory': "VARCHAR(50)",
            'sheet_name': "VARCHAR(100)"
        }
        
        # Check current table structure
        cur.execute("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'mro_job_tracker'
        """)
        
        existing_columns = {row[0] for row in cur.fetchall()}
        print(f"📊 Found columns: {sorted(existing_columns)}")
        
        # Add missing columns
        added_columns = []
        for col_name, col_type in required_columns.items():
            if col_name not in existing_columns:
                cur.execute(f"""
                    ALTER TABLE mro_job_tracker
                    ADD COLUMN IF NOT EXISTS {col_name} {col_type}
                """)
                added_columns.append(col_name)
                print(f"✅ Added column: {col_name} ({col_type})")
        
        # Create all required indexes
        indexes = [
            'idx_mro_job_tracker_customer',
            'idx_mro_job_tracker_part_number',
            'idx_mro_job_tracker_category',
            'idx_mro_job_tracker_progress',
            'idx_mro_job_tracker_serial_number',
            'idx_mro_job_tracker_job_card_no'
        ]
        
        for index_name in indexes:
            try:
                cur.execute(f"CREATE INDEX IF NOT EXISTS {index_name} ON mro_job_tracker({index_name.replace('idx_mro_job_tracker_', '')})")
                print(f"✅ Created index: {index_name}")
            except Exception as e:
                print(f"⚠️  Index {index_name} already exists or error: {str(e)}")
        
        # Commit changes
        conn.commit()
        
        if added_columns:
            print(f"🎉 Added {len(added_columns)} missing columns: {added_columns}")
        else:
            print("✅ All required columns already exist")
        
        # Show final table structure
        cur.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'mro_job_tracker'
            ORDER BY ordinal_position
        """)
        
        print("\n📋 Final table structure:")
        for col in cur.fetchall():
            print(f"   {col[0]}: {col[1]} ({'nullable' if col[2] == 'YES' else 'required'})")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing table: {str(e)}")
        if conn:
            conn.rollback()
        return False
    finally:
        if 'cur' in locals() and cur:
            cur.close()
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    success = fix_job_tracker_table()
    sys.exit(0 if success else 1)