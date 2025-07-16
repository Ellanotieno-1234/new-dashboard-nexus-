#!/usr/bin/env python3
"""
Complete setup script for MRO job tracker table
"""
import os
import sys
from pathlib import Path
import psycopg2
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

def setup_mro_table():
    """Create or fix the complete mro_job_tracker table structure"""
    
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL not found in environment")
        return False
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("🔧 Setting up MRO job tracker table...")
        
        # Drop existing table if it has issues (be careful with this in production)
        # cur.execute("DROP TABLE IF EXISTS mro_job_tracker CASCADE")
        
        # Create the complete table structure
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS mro_job_tracker (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            job_card_no VARCHAR(100),
            customer VARCHAR(255),
            part_number VARCHAR(255),
            description TEXT,
            serial_number VARCHAR(255),
            date_delivered DATE,
            work_requested VARCHAR(255),
            progress VARCHAR(50),
            location VARCHAR(255),
            expected_release_date DATE,
            remarks TEXT,
            category VARCHAR(50),
            subcategory VARCHAR(50),
            sheet_name VARCHAR(100),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        cur.execute(create_table_sql)
        print("✅ Created mro_job_tracker table")
        
        # Create all indexes
        indexes_sql = [
            "CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_customer ON mro_job_tracker(customer)",
            "CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_part_number ON mro_job_tracker(part_number)",
            "CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_category ON mro_job_tracker(category)",
            "CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_progress ON mro_job_tracker(progress)",
            "CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_serial_number ON mro_job_tracker(serial_number)",
            "CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_job_card_no ON mro_job_tracker(job_card_no)"
        ]
        
        for sql in indexes_sql:
            try:
                cur.execute(sql)
                print(f"✅ Created index: {sql.split('IF NOT EXISTS ')[1].split(' ON')[0]}")
            except Exception as e:
                print(f"⚠️  Index already exists: {str(e)[:50]}...")
        
        # Create trigger for updated_at
        trigger_sql = """
        CREATE OR REPLACE FUNCTION update_mro_job_tracker_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER IF NOT EXISTS update_mro_job_tracker_updated_at
            BEFORE UPDATE ON mro_job_tracker
            FOR EACH ROW
            EXECUTE FUNCTION update_mro_job_tracker_updated_at();
        """
        
        cur.execute(trigger_sql)
        print("✅ Created updated_at trigger")
        
        # Commit all changes
        conn.commit()
        
        # Verify table structure
        cur.execute("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'mro_job_tracker'
            ORDER BY ordinal_position
        """)
        
        columns = cur.fetchall()
        print(f"\n📋 Final table has {len(columns)} columns:")
        for col in columns:
            print(f"   {col[0]}: {col[1]} ({'nullable' if col[2] == 'YES' else 'required'})")
        
        # Test with a simple insert
        try:
            cur.execute("""
                INSERT INTO mro_job_tracker 
                (job_card_no, customer, part_number, description, serial_number, 
                 date_delivered, work_requested, progress, location, 
                 expected_release_date, category) 
                VALUES 
                ('TEST-001', 'Test Customer', 'PART-123', 'Test Description', 'SN-001',
                 '2024-01-01', 'Test Work', 'In Progress', 'Workshop A',
                 '2024-01-15', 'Test Category')
            """)
            conn.commit()
            print("✅ Successfully inserted test record")
            
            # Clean up test record
            cur.execute("DELETE FROM mro_job_tracker WHERE job_card_no = 'TEST-001'")
            conn.commit()
            
        except Exception as e:
            print(f"⚠️  Test insert failed: {str(e)}")
        
        print("🎉 MRO job tracker table setup complete!")
        return True
        
    except Exception as e:
        print(f"❌ Error setting up table: {str(e)}")
        if conn:
            conn.rollback()
        return False
    finally:
        if 'cur' in locals() and cur:
            cur.close()
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    success = setup_mro_table()
    sys.exit(0 if success else 1)