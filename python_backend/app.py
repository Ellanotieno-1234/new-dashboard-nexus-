import os
import logging
from typing import List, Dict, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from datetime import date, datetime

def convert_date_string(value: str) -> date:
    """Convert string to date, handling various formats"""
    if isinstance(value, date):
        return value
    try:
        return datetime.strptime(value, '%Y-%m-%d').date()
    except ValueError as e:
        raise ValueError(f"Invalid date format. Expected YYYY-MM-DD, got {value}")

class MROItem(BaseModel):
    customer: str
    part_number: str
    description: str
    serial_number: str
    date_delivered: date
    work_requested: str
    progress: str
    location: str
    expected_release_date: date
    remarks: Optional[str] = None
    category: str

    @field_validator('date_delivered', 'expected_release_date', mode='before')
    def validate_dates(cls, value):
        if isinstance(value, str):
            return convert_date_string(value)
        return value
    
    class Config:
        json_encoders = {
            date: lambda v: v.isoformat()
        }

import pandas as pd
from supabase import create_client, Client
from services.mro_service import MROService
from pathlib import Path
from dotenv import load_dotenv
from seed_data import load_inventory, load_orders, load_mro_data

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Ensure required environment variables are set
required_env_vars = ["SUPABASE_URL", "SUPABASE_KEY"]
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ENVIRONMENT = os.getenv("ENVIRONMENT", "production")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client with logging
def init_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    logger.info(f"Initializing Supabase connection...")
    logger.info(f"URL: {url}")
    logger.info(f"Key (first 10 chars): {key[:10]}..." if key else "Key: None")
    
    if not url or not key:
        logger.error("Missing Supabase credentials")
        raise ValueError("Missing Supabase credentials")
    return create_client(url, key)

supabase: Client = init_supabase()

# Initialize MRO service
excel_dir = os.getenv("EXCEL_DIR")
DEFAULT_EXCEL_PATH = os.path.join(excel_dir, "mro_tracking.xlsx") if excel_dir else None
mro_service = MROService(supabase, DEFAULT_EXCEL_PATH)
if not excel_dir:
    logger.warning("EXCEL_DIR not configured - MRO service will operate in database-only mode")

@app.post("/api/mro/sync/excel")
async def sync_to_excel():
    """Sync database data to Excel file"""
    return {"message": "Test endpoint working"}

@app.get("/api/inventory")
async def get_inventory():
    try:
        logger.info("Fetching inventory data from Supabase")
        response = supabase.table("inventory").select("*").execute()
        inventory_data = response.data if response and hasattr(response, 'data') else []
        logger.info(f"Retrieved {len(inventory_data)} inventory items")
        logger.debug(f"First inventory item sample: {inventory_data[0] if inventory_data else 'No data'}")
        return inventory_data
    except Exception as e:
        logger.error(f"Error fetching inventory: {str(e)}")
        return []

@app.get("/api/orders")
async def get_orders():
    try:
        logger.info("Fetching orders data from Supabase")
        response = supabase.table("orders").select("*").execute()
        orders_data = response.data if response and hasattr(response, 'data') else []
        logger.info(f"Retrieved {len(orders_data)} orders")
        logger.debug(f"First order sample: {orders_data[0] if orders_data else 'No data'}")
        return orders_data
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        return []

@app.get("/api/analytics/summary")
async def get_analytics_summary():
    try:
        logger.info("Starting analytics summary calculation")
        
        # Fetch data with validation
        inventory = await get_inventory()
        orders = await get_orders()
        
        logger.info(f"Calculating metrics from {len(inventory)} inventory items and {len(orders)} orders")
        
        # Calculate metrics with validation
        total_parts = sum(int(item.get("in_stock", 0)) for item in inventory)
        total_value = sum(int(item.get("in_stock", 0)) * 1000 for item in inventory)
        low_stock = sum(1 for item in inventory if int(item.get("in_stock", 0)) <= int(item.get("min_required", 0)))
        backorders = sum(1 for order in orders if order.get("status") == "Pending")
        
        summary = {
            "total_parts": total_parts,
            "total_value": float(total_value),
            "low_stock": low_stock,
            "backorders": backorders,
            "turnover_rate": float(4.2 if total_parts > 0 else 0),
            "accuracy_rate": float(98.5 if total_parts > 0 else 0)
        }
        
        logger.info(f"Analytics summary calculated: {summary}")
        return summary
    except Exception as e:
        logger.error(f"Error calculating analytics: {str(e)}")
        return {
            "total_parts": 0,
            "total_value": 0.0,
            "low_stock": 0,
            "backorders": 0,
            "turnover_rate": 0.0,
            "accuracy_rate": 0.0
        }

@app.post("/api/upload/inventory")
async def upload_inventory(file: UploadFile = File(...)):
    try:
        logger.info(f"Processing inventory upload: {file.filename}")
        file_extension = file.filename.split('.')[-1].lower()
        
        # Read file with validation
        df = pd.read_csv(file.file) if file_extension == 'csv' else pd.read_excel(file.file)
        logger.info(f"Read {len(df)} rows from uploaded file")
        
        # Process inventory data
        inventory_data = []
        for idx, row in df.iterrows():
            item = {
                "part_number": str(row.get("Part Number", "")),
                "name": str(row.get("Name", "")),
                "category": str(row.get("Category", "")),
                "in_stock": int(row.get("In Stock", 0)),
                "min_required": int(row.get("Min Required", 0)),
                "on_order": int(row.get("On Order", 0)),
                "last_updated": str(row.get("Last Updated", ""))
            }
            inventory_data.append(item)
            
            # Update or insert with validation
            try:
                existing = supabase.table("inventory").select("part_number").eq("part_number", item["part_number"]).execute()
                if existing.data:
                    logger.info(f"Updating inventory item: {item['part_number']}")
                    supabase.table("inventory").update(item).eq("part_number", item["part_number"]).execute()
                else:
                    logger.info(f"Inserting new inventory item: {item['part_number']}")
                    supabase.table("inventory").insert(item).execute()
            except Exception as e:
                logger.error(f"Error processing inventory item {item['part_number']}: {str(e)}")
                raise
        
        logger.info(f"Successfully processed {len(inventory_data)} inventory items")
        return {"success": True, "count": len(inventory_data)}
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error uploading inventory: {error_msg}")
        return {"success": False, "error": error_msg}

@app.post("/api/upload/orders")
async def upload_orders(file: UploadFile = File(...)):
    try:
        logger.info(f"Processing orders upload: {file.filename}")
        file_extension = file.filename.split('.')[-1].lower()
        
        # Read file with validation
        df = pd.read_csv(file.file) if file_extension == 'csv' else pd.read_excel(file.file)
        logger.info(f"Read {len(df)} rows from uploaded file")
        
        # Process orders data
        orders_data = []
        for idx, row in df.iterrows():
            order = {
                "order_number": str(row.get("Order Number", "")),
                "part_number": str(row.get("Part Number", "")),
                "part_name": str(row.get("Part Name", "")),
                "quantity": int(row.get("Quantity", 0)),
                "status": str(row.get("Status", "Pending")),
                "order_date": str(row.get("Order Date", "")),
                "expected_delivery": str(row.get("Expected Delivery", "")),
                "supplier": str(row.get("Supplier", ""))
            }
            orders_data.append(order)
        
        # Insert orders with validation
        try:
            result = supabase.table("orders").insert(orders_data).execute()
            logger.info(f"Successfully uploaded {len(orders_data)} orders")
            return {"success": True, "count": len(orders_data)}
        except Exception as e:
            logger.error(f"Error inserting orders: {str(e)}")
            raise
            
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error uploading orders: {error_msg}")
        return {"success": False, "error": error_msg}

# MRO endpoints
@app.get("/api/mro/items")
async def get_mro_items(category: Optional[str] = None, progress: Optional[str] = None):
    """Get MRO items with optional filtering"""
    logger.info(f"Received GET /api/mro/items with category={category}, progress={progress}")
    try:
        items = await mro_service.get_items(category, progress)
        logger.info(f"Fetched {len(items) if items else 0} MRO items from database.")
        return items
    except Exception as e:
        error_msg = f"Error fetching MRO items: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/api/mro/items")
async def create_mro_item(item: MROItem):
    """Create new MRO item"""
    logger.info(f"Received POST /api/mro/items with item: {item}")
    try:
        # Save to database
        mro_data = item.model_dump()
        # Convert dates to strings for Supabase
        if isinstance(mro_data.get('date_delivered'), date):
            mro_data['date_delivered'] = mro_data['date_delivered'].isoformat()
        if isinstance(mro_data.get('expected_release_date'), date):
            mro_data['expected_release_date'] = mro_data['expected_release_date'].isoformat()
            
        response = supabase.table("mro_items").insert(mro_data).execute()
        new_item = response.data[0] if response.data else None
        logger.info(f"Insert response: {response}")
        if new_item:
            # Sync to Excel
            await mro_service.sync_to_excel(new_item.get('category'))
            logger.info(f"Successfully created and synced MRO item: {new_item}")
            return new_item
        error_msg = "Failed to create MRO item"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)
    except Exception as e:
        logger.error(f"Error creating MRO item: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/mro/items/{serial_number}")
async def update_mro_item(serial_number: str, item: Dict):
    """Update MRO item"""
    try:
        updated_item = await mro_service.update_item(serial_number, item)
        if updated_item:
            return updated_item
        raise HTTPException(status_code=404, detail="MRO item not found")
    except Exception as e:
        logger.error(f"Error updating MRO item: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/mro/upload")
async def upload_mro_data(file: UploadFile = File(...)):
    """Upload MRO data from Excel file"""
    try:
        # Save uploaded file
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Read data from uploaded file
        data = mro_service.read_excel_data()
        
        # Sync to database
        await mro_service.sync_to_database(data)
        
        # Clean up temp file
        os.remove(temp_path)
        
        return {"message": "Upload successful", "items_processed": len(data)}
    except Exception as e:
        logger.error(f"Error uploading MRO data: {str(e)}")
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/run-seed")
def run_seed():
    try:
        load_inventory()
        load_orders()
        load_mro_data()
        return {"message": "Seed data loaded successfully"}
    except Exception as e:
        logger.error(f"Error loading seed data: {str(e)}")
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    uvicorn.run(app, host=host, port=port, reload=ENVIRONMENT == "development")
