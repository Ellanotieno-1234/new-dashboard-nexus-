-- Create MRO items table
CREATE TABLE IF NOT EXISTS mro_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    category VARCHAR(50),  -- For different sheet categories (Mechanical, Safety, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_mro_customer ON mro_items(customer);
CREATE INDEX IF NOT EXISTS idx_mro_part_number ON mro_items(part_number);
CREATE INDEX IF NOT EXISTS idx_mro_category ON mro_items(category);
CREATE INDEX IF NOT EXISTS idx_mro_progress ON mro_items(progress);

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_mro_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mro_items_updated_at
    BEFORE UPDATE ON mro_items
    FOR EACH ROW
    EXECUTE FUNCTION update_mro_updated_at();
