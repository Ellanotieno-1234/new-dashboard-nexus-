import os
import pandas as pd
from supabase import create_client, Client
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def init_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("Missing Supabase credentials")
    return create_client(url, key)

def load_inventory():
    try:
        logger.info("Starting inventory data load")
        supabase = init_supabase()

        # Read sample inventory data
        sample_path = os.path.join('examples', 'sample_inventory.csv')
        if not os.path.exists(sample_path):
            logger.error(f"Sample inventory file not found at {sample_path}")
            return

        df = pd.read_csv(sample_path)
        logger.info(f"Read {len(df)} rows from sample inventory")

        # Process each row
        for _, row in df.iterrows():
            try:
                item = {
                    "part_number": str(row["Part Number"]),
                    "name": str(row["Name"]),
                    "category": str(row["Category"]),
                    "in_stock": int(row["In Stock"]),
                    "min_required": int(row["Min Required"]),
                    "on_order": int(row["On Order"]),
                    "last_updated": str(row["Last Updated"])
                }

                # Check if part already exists
                existing = supabase.table("inventory").select("part_number").eq("part_number", item["part_number"]).execute()
                
                if len(existing.data) > 0:
                    logger.info(f"Updating existing part: {item['part_number']}")
                    result = supabase.table("inventory").update(item).eq("part_number", item["part_number"]).execute()
                else:
                    logger.info(f"Inserting new part: {item['part_number']}")
                    result = supabase.table("inventory").insert(item).execute()

                logger.debug(f"Database operation result: {result}")

            except Exception as e:
                logger.error(f"Error processing inventory item {row['Part Number']}: {str(e)}")
                continue

        logger.info("Finished loading inventory data")

    except Exception as e:
        logger.error(f"Error in load_inventory: {str(e)}")
        raise

def load_orders():
    try:
        logger.info("Starting orders data load")
        supabase = init_supabase()

        # Read sample orders data
        sample_path = os.path.join('examples', 'sample_orders.csv')
        if not os.path.exists(sample_path):
            logger.error(f"Sample orders file not found at {sample_path}")
            return

        df = pd.read_csv(sample_path)
        logger.info(f"Read {len(df)} rows from sample orders")

        # Process each row
        for _, row in df.iterrows():
            try:
                order = {
                    "order_number": str(row["Order Number"]),
                    "part_number": str(row["Part Number"]),
                    "part_name": str(row["Part Name"]),
                    "quantity": int(row["Quantity"]),
                    "status": str(row["Status"]),
                    "order_date": str(row["Order Date"]),
                    "expected_delivery": str(row["Expected Delivery"]),
                    "supplier": str(row["Supplier"])
                }

                # Check if order already exists
                existing = supabase.table("orders").select("order_number").eq("order_number", order["order_number"]).execute()
                
                if len(existing.data) > 0:
                    logger.info(f"Updating existing order: {order['order_number']}")
                    result = supabase.table("orders").update(order).eq("order_number", order["order_number"]).execute()
                else:
                    logger.info(f"Inserting new order: {order['order_number']}")
                    result = supabase.table("orders").insert(order).execute()

                logger.debug(f"Database operation result: {result}")

            except Exception as e:
                logger.error(f"Error processing order {row['Order Number']}: {str(e)}")
                continue

        logger.info("Finished loading orders data")

    except Exception as e:
        logger.error(f"Error in load_orders: {str(e)}")
        raise

def load_mro_data():
    try:
        logger.info("Starting MRO data load")
        supabase = init_supabase()
        
        # Read MRO tracking data from Excel file
        excel_path = os.path.join('data', 'mro_tracking.xlsx')
        if not os.path.exists(excel_path):
            logger.error(f"MRO tracking file not found at {excel_path}")
            return

        xls = pd.ExcelFile(excel_path)
        for sheet_name in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet_name)
            df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]
            
            # Add category from sheet name
            df['category'] = sheet_name
            
            logger.info(f"Read {len(df)} rows from sheet: {sheet_name}")

            # Process each row
            for _, row in df.iterrows():
                try:
                    item = row.to_dict()
                    
                    # Clean and format data
                    for key, value in item.items():
                        if isinstance(value, pd.Timestamp):
                            item[key] = value.strftime('%Y-%m-%d')
                        elif pd.isna(value):
                            item[key] = None
                    
                    # Check if item already exists
                    if 'serial_number' in item and item['serial_number']:
                        existing = supabase.table("mro_items").select("serial_number").eq("serial_number", item["serial_number"]).execute()
                        
                        if len(existing.data) > 0:
                            logger.info(f"Updating existing MRO item: {item['serial_number']}")
                            result = supabase.table("mro_items").update(item).eq("serial_number", item["serial_number"]).execute()
                        else:
                            logger.info(f"Inserting new MRO item: {item['serial_number']}")
                            result = supabase.table("mro_items").insert(item).execute()
                    
                        logger.debug(f"Database operation result: {result}")

                except Exception as e:
                    logger.error(f"Error processing MRO item row: {str(e)}")
                    continue
        
        logger.info("Finished loading MRO data")

    except Exception as e:
        logger.error(f"Error in load_mro_data: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        load_inventory()
        load_orders()
        load_mro_data()
        print("Seed data loaded successfully")
    except Exception as e:
        print(f"Error loading seed data: {str(e)}")
        exit(1)
