-- Create MRO job tracker table
CREATE TABLE IF NOT EXISTS mro_job_tracker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_card_no VARCHAR(100) UNIQUE,
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

-- Create indexes for job tracker
CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_customer ON mro_job_tracker(customer);
CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_part_number ON mro_job_tracker(part_number);
CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_category ON mro_job_tracker(category);
CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_progress ON mro_job_tracker(progress);
CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_serial_number ON mro_job_tracker(serial_number);
CREATE INDEX IF NOT EXISTS idx_mro_job_tracker_job_card_no ON mro_job_tracker(job_card_no);

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_mro_job_tracker_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mro_job_tracker_updated_at
    BEFORE UPDATE ON mro_job_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_mro_job_tracker_updated_at();