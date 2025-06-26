-- Add new columns for subcategory and sheet_name
ALTER TABLE mro_items
ADD COLUMN IF NOT EXISTS subcategory VARCHAR(10),
ADD COLUMN IF NOT EXISTS sheet_name VARCHAR(100);

-- First, update existing records to have proper categories
UPDATE mro_items
SET category = 
    CASE 
        WHEN category = 'STRUCTURAL' THEN 'Structures Shop'
        WHEN category = 'AVIONICS' THEN 'AVIONICS MAIN'
        WHEN category NOT IN (
            'ALL WIP COMP',
            'MECHANICAL',
            'SAFETY COMPONENTS',
            'AVIONICS MAIN',
            'Avionics Shop',
            'PLANT AND EQUIPMENTS',
            'BATTERY',
            'Battery Shop',
            'CALIBRATION',
            'Cal lab',
            'UPH Shop',
            'Structures Shop'
        ) THEN 'ALL WIP COMP'
        ELSE category 
    END;

-- Add check constraint for subcategory values
ALTER TABLE mro_items
ADD CONSTRAINT check_subcategory 
CHECK (subcategory IN ('MAIN', 'SHOP', 'LAB') OR subcategory IS NULL);

-- Update category type to include all possible values
ALTER TABLE mro_items
DROP CONSTRAINT IF EXISTS mro_items_category_check;

ALTER TABLE mro_items
ADD CONSTRAINT mro_items_category_check
CHECK (category IN (
    'ALL WIP COMP',
    'MECHANICAL',
    'SAFETY COMPONENTS',
    'AVIONICS MAIN',
    'Avionics Shop',
    'PLANT AND EQUIPMENTS',
    'BATTERY',
    'Battery Shop',
    'CALIBRATION',
    'Cal lab',
    'UPH Shop',
    'Structures Shop'
));

-- Add indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_mro_items_category ON mro_items(category);
CREATE INDEX IF NOT EXISTS idx_mro_items_subcategory ON mro_items(subcategory);
CREATE INDEX IF NOT EXISTS idx_mro_items_sheet_name ON mro_items(sheet_name);

-- Set initial subcategories based on category names
UPDATE mro_items
SET subcategory = 
    CASE 
        WHEN category IN ('AVIONICS MAIN', 'SAFETY COMPONENTS', 'MECHANICAL', 'BATTERY', 'CALIBRATION') THEN 'MAIN'
        WHEN category IN ('Avionics Shop', 'Battery Shop', 'UPH Shop', 'Structures Shop') THEN 'SHOP'
        WHEN category IN ('Cal lab') THEN 'LAB'
        ELSE NULL
    END;

COMMENT ON COLUMN mro_items.subcategory IS 'Indicates if the item belongs to MAIN, SHOP, or LAB subcategory';
COMMENT ON COLUMN mro_items.sheet_name IS 'Original Excel sheet name the item came from';

-- Update sheet names based on categories for existing records
UPDATE mro_items
SET sheet_name = category
WHERE sheet_name IS NULL;
