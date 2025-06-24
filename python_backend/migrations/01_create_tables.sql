-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id BIGSERIAL PRIMARY KEY,
    part_number TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    in_stock INTEGER NOT NULL DEFAULT 0,
    min_required INTEGER NOT NULL DEFAULT 0,
    on_order INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    part_number TEXT NOT NULL,
    part_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery DATE,
    supplier TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (part_number) REFERENCES inventory(part_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_inventory_part_number ON inventory(part_number);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_part_number ON orders(part_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create view for low stock items
CREATE OR REPLACE VIEW low_stock_items AS
SELECT 
    part_number,
    name,
    category,
    in_stock,
    min_required,
    on_order
FROM inventory
WHERE in_stock <= min_required;

-- Create view for pending orders
CREATE OR REPLACE VIEW pending_orders AS
SELECT 
    o.order_number,
    o.part_number,
    o.part_name,
    o.quantity,
    o.expected_delivery,
    o.supplier,
    i.in_stock current_stock
FROM orders o
JOIN inventory i ON o.part_number = i.part_number
WHERE o.status = 'Pending'
ORDER BY o.expected_delivery ASC;

-- Function to update inventory when order status changes
CREATE OR REPLACE FUNCTION update_inventory_on_order_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Completed' AND OLD.status = 'Pending' THEN
        UPDATE inventory
        SET in_stock = in_stock + NEW.quantity,
            on_order = on_order - NEW.quantity,
            last_updated = CURRENT_TIMESTAMP
        WHERE part_number = NEW.part_number;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for order status changes
CREATE TRIGGER order_status_change
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION update_inventory_on_order_status();
