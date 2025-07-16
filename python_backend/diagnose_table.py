#!/usr/bin/env python3
"""
Diagnostic script to check actual database structure
"""
import os
import sys
from pathlib import Path
import psycopg2
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

def diagnose_table():
    """Check actual table structure and fix missing columns"""
    
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL not found in environment")
        return False
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🔍 Diagnosing MRO job tracker table...")
        
        # Check if table exists
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'mro_job_tracker'
        """)
        
        if not cur.fetchone():
            print("❌ Table 'mro_job_tracker' does not exist")
            return False
        
        print("✅ Table 'mro_job_tracker' exists")
        
        # Get actual column structure
        cur.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'mro_job_tracker'
            ORDER BY ordinal_position
        """)
        
        actual_columns = cur.fetchall()
        print(f"\n📊 Found {len(actual_columns)} columns:")
        for col in actual_columns:
            print(f"   {col[0]}: {col[1]} (nullable: {col[2]}, default: {col[3]})")
        
        # Check for missing columns
        required_columns = [
            'job_card_no', 'customer', 'part_number', 'description', 
            'serial_number', 'date_delivered', 'work_requested', 
            'progress', 'location', 'expected_release_date', 
            'remarks', 'category', 'subcategory', 'sheet_name'
        ]
        
        existing_column_names = [col[0] for col in actual_columns]
        missing_columns = [col for col in required_columns if col not in existing_column_names]
        
        if missing_columns:
            print(f"\n❌ Missing columns: {missing_columns}")
            
            # Add missing columns
            column_definitions = {
                'job_card_no': 'VARCHAR(100)',
                'customer': 'VARCHAR(255)',
                'part_number': 'VARCHAR(255)',
                'description': 'TEXT',
                'serial_number': 'VARCHAR(255)',
                'date_delivered': 'DATE',
                'work_requested': 'VARCHAR(255)',
                'progress': 'VARCHAR(50)',
                'location': 'VARCHAR(255)',
                'expected_release_date': 'DATE',
                'remarks': 'TEXT',
                'category': 'VARCHAR(50)',
                'subcategory': 'VARCHAR(50)',
                'sheet_name': 'VARCHAR(100)'
            }
            
            print("\n🔧 Adding missing columns...")
            for col in missing_columns:
                sql = f"ALTER TABLE mro_job_tracker ADD COLUMN IF NOT EXISTS {col} {column_definitions[col]}"
                try:
                    cur.execute(sql)
                    print(f"   ✅ Added {col}")
                except Exception as e:
                    print(f"   ❌ Failed to add {col}: {str(e)}")
            
            conn.commit()
            print("🎉 All missing columns added!")
            
        else:
            print("\n✅ All required columns exist")
        
        # Verify final structure
        cur.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'mro_job_tracker'
            ORDER BY ordinal_position
        """)
        
        final_columns = [row[0] for row in cur.fetchall()]
        print(f"\n📋 Final columns: {final_columns}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error diagnosing table: {str(e)}")
        if conn:
            conn.rollback()
        return False
    finally:
        if 'cur' in locals() and cur:
            cur.close()
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    success = diagnose_table()
    sys.exit(0 if success else 1)