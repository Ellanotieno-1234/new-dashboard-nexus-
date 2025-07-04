import os
import logging
from typing import List, Dict, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Body, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from datetime import date, datetime

def convert_date_string(value: str) -> Optional[date]:
    """Convert string to date, handling various formats"""
    if not value or value.strip() == "":
        return None
    if isinstance(value, date):
        return value
    try:
        return datetime.strptime(value, '%Y-%m-%d').date()
    except ValueError:
        try:
            return datetime.strptime(value, '%Y/%m/%d').date()
        except ValueError as e:
            raise ValueError(f"Invalid date format. Expected YYYY-MM-DD or YYYY/MM/DD, got {value}")

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

# Add OPTIONS handlers for all endpoints first
@app.options("/{path:path}")
async def options_handler(path: str):
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }
    )

# Then add CORS middleware - moved to be the first middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://new-dashboard-nexus-b5ra.vercel.app",
        "https://*.vercel.app",
        "https://new-dashboard-nexus.onrender.com", 
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600  # Cache preflight response for 10 minutes
)

# Add middleware to ensure CORS headers are added to all responses
@app.middleware("http")
async def add_cors_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

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

@app.options("/api/inventory")
async def inventory_options():
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }
    )

@app.get("/api/inventory")
async def get_inventory():
    try:
        logger.info("Fetching inventory data from Supabase")
        response = supabase.table("inventory").select("*").execute()
        inventory_data = response.data if response and hasattr(response, 'data') else []
        logger.info(f"Retrieved {len(inventory_data)} inventory items")
        logger.debug(f"First inventory item sample: {inventory_data[0] if inventory_data else 'No data'}")
        return JSONResponse(
            content=inventory_data,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        )
    except Exception as e:
        logger.error(f"Error fetching inventory: {str(e)}")
        return []

@app.options("/api/orders")
async def orders_options():
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }
    )

@app.get("/api/orders")
async def get_orders():
    try:
        logger.info("Fetching orders data from Supabase")
        response = supabase.table("orders").select("*").execute()
        orders_data = response.data if response and hasattr(response, 'data') else []
        logger.info(f"Retrieved {len(orders_data)} orders")
        logger.debug(f"First order sample: {orders_data[0] if orders_data else 'No data'}")
        return JSONResponse(
            content=orders_data,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        )
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        return []

@app.options("/api/analytics/summary")
async def analytics_summary_options():
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }
    )

@app.get("/api/analytics/summary")
async def get_analytics_summary():
    try:
        logger.info("Starting analytics summary calculation")
        
        # Fetch data with validation
        inventory = await get_inventory()
        orders = await get_orders()
        
        logger.info("Calculating metrics from {len(inventory)} inventory items and {len(orders)} orders")
        
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
        return JSONResponse(
            content=summary,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        )
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

@app.post("/api/upload/mro")
async def upload_mro(file: UploadFile = File(...)):
    try:
        logger.info(f"Processing MRO upload: {file.filename}")
        file_extension = file.filename.split('.')[-1].lower()
        
        # Read file with validation
        df = pd.read_csv(file.file) if file_extension == 'csv' else pd.read_excel(file.file)
        logger.info(f"Read {len(df)} rows from uploaded file")
        
        # Process MRO data with validation
        mro_data = []
        valid_categories = {
            'ALL WIP COMP', 'MECHANICAL', 'SAFETY COMPONENTS', 
            'AVIONICS MAIN', 'Avionics Shop', 'PLANT AND EQUIPMENTS',
            'BATTERY', 'Battery Shop', 'CALIBRATION', 'Cal lab',
            'UPH Shop', 'Structures Shop'
        }
        
        for idx, row in df.iterrows():
            try:
                # Validate required fields with defaults
                customer = str(row.get("CUSTOMER", "")).strip()
                if not customer:
                    raise ValueError("Customer is required")
                
                # Set default values for optional fields
                part_number = str(row.get("PART NUMBER", "")).strip() or "N/A"
                description = str(row.get("DESCRIPTION", "")).strip() or "No description"
                serial_number = str(row.get("SERIAL NUMBER", "")).strip() or "N/A"
                work_requested = str(row.get("WORK REQUESTED", "")).strip() or "N/A"
                progress = str(row.get("PROGRESS", "")).strip() or "PENDING"
                location = str(row.get("LOCATION", "")).strip() or "Unknown"
                remarks = str(row.get("REMARKS", "")).strip() or "No remarks"
                
                # Validate category with default
                category = str(row.get("CATEGORY", "")).strip()
                if not category:
                    category = "MECHANICAL"
                if category not in valid_categories:
                    raise ValueError(f"Invalid category: {category}")
                
                # Build item with validation
                item = {
                    "customer": str(row.get("CUSTOMER", "")).strip(),
                    "part_number": str(row.get("PART NUMBER", "")).strip(),
                    "description": str(row.get("DESCRIPTION", "")).strip(),
                    "serial_number": str(row.get("SERIAL NUMBER", "")).strip(),
                    "date_delivered": convert_date_string(str(row.get("DATE DELIVERED", ""))),
                    "work_requested": str(row.get("WORK REQUESTED", "")).strip(),
                    "progress": str(row.get("PROGRESS", "")).strip(),
                    "location": str(row.get("LOCATION", "")).strip(),
                    "expected_release_date": convert_date_string(str(row.get("EXPECTED RELEASE DATE", ""))),
                    "remarks": str(row.get("REMARKS", "")).strip(),
                    "category": category
                }
                
                mro_data.append(item)
            except ValueError as e:
                logger.warning(f"Skipping row {idx} due to validation error: {str(e)}")
                continue
        
        # Insert MRO items with validation
        try:
            result = supabase.table("mro_items").insert(mro_data).execute()
            logger.info(f"Successfully uploaded {len(mro_data)} MRO items")
            return {"success": True, "count": len(mro_data)}
        except Exception as e:
            logger.error(f"Error inserting MRO items: {str(e)}")
            raise
            
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error uploading MRO data: {error_msg}")
        return {"success": False, "error": error_msg}

# MRO endpoints
@app.options("/api/mro/items")
async def mro_items_options():
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }
    )

@app.get("/api/mro/items")
async def get_mro_items(category: Optional[str] = None, progress: Optional[str] = None):
    """Get MRO items with optional filtering"""
    logger.info(f"Received GET /api/mro/items with category={category}, progress={progress}")
    try:
        items = await mro_service.get_items(category, progress)
        logger.info(f"Fetched {len(items) if items else 0} MRO items from database.")
        return JSONResponse(
            content=items,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        )
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

@app.post("/api/mro/job-tracker/upload")
@app.options("/api/mro/job-tracker/upload")
async def upload_job_tracker_data(request: Request, file: UploadFile = File(...)):
    """Upload job tracker data from Excel file"""
    # Initialize temp_path right away with a unique name
    temp_path = f"temp_{file.filename}" if file.filename else "temp_upload.xlsx"
    logger.info(f"Starting job tracker upload for file: {file.filename}")
    logger.info(f"File size: {file.size} bytes")
    logger.info(f"Content type: {file.content_type}")
    
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    }
    
    if request.method == 'OPTIONS':
        return JSONResponse(
            status_code=200,
            headers=cors_headers
        )
    
    try:
        # Verify database connection
        try:
            test = supabase.table("mro_job_tracker").select("id").limit(1).execute()
            logger.info("Database connection verified")
        except Exception as db_error:
            logger.error(f"Database connection error: {str(db_error)}")
            return JSONResponse(
                status_code=500,
                content={"detail": "Database connection failed"},
                headers=cors_headers
            )
        # Check file size (max 50MB)
        max_size = 50 * 1024 * 1024  # 50MB
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset pointer
        
        if file_size > max_size:
            return JSONResponse(
                status_code=413,
                content={
                    "detail": f"File too large. Max size is 50MB. Your file is {file_size/1024/1024:.2f}MB"
                },
                headers=cors_headers
            )

        # Save uploaded file
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Read and process file in chunks (CSV) or batches (Excel)
        try:
            chunk_size = 100
            inserted_count = 0
            total_rows = 0
            file_extension = temp_path.split('.')[-1].lower()
            if file_extension == 'csv':
                for chunk in pd.read_csv(temp_path, chunksize=chunk_size):
                    data = chunk.to_dict('records')
                    total_rows += len(data)
                    for item in data:
                        try:
                            existing = supabase.table("mro_job_tracker")\
                                .select("id")\
                                .eq("job_card_no", item.get("job_card_no"))\
                                .execute()
                            if existing.data:
                                try:
                                    supabase.table("mro_job_tracker")\
                                        .update(item)\
                                        .eq("job_card_no", item.get("job_card_no"))\
                                        .execute()
                                except Exception as update_error:
                                    logger.error(f"Error updating job tracker item: {str(update_error)}")
                                    continue
                            else:
                                try:
                                    supabase.table("mro_job_tracker")\
                                        .insert(item)\
                                        .execute()
                                except Exception as insert_error:
                                    logger.error(f"Error inserting job tracker item: {str(insert_error)}")
                                    continue
                            inserted_count += 1
                        except Exception as e:
                            logger.error(f"Error processing job tracker item: {str(e)}")
                            continue
            else:
                    try:
                        logger.info(f"Reading Excel file from {temp_path}")
                        df = pd.read_excel(temp_path)
                        logger.info(f"Excel file read successfully with {len(df)} rows")
                        logger.debug(f"Columns found: {df.columns.tolist()}")
                        logger.debug(f"First row sample: {df.iloc[0].to_dict() if len(df) > 0 else 'No data'}")
                        
                        if len(df) == 0:
                            raise ValueError("Uploaded file contains no data")
                            
                        for i in range(0, len(df), chunk_size):
                            chunk = df.iloc[i:i + chunk_size]
                            data = chunk.to_dict('records')
                            logger.debug(f"Processing chunk {i//chunk_size + 1} with {len(data)} rows")
                            total_rows += len(data)
                            for item in data:
                                try:
                                    existing = supabase.table("mro_job_tracker")\
                                        .select("id")\
                                        .eq("job_card_no", item.get("job_card_no"))\
                                        .execute()
                                    if existing.data:
                                        try:
                                            supabase.table("mro_job_tracker")\
                                                .update(item)\
                                                .eq("job_card_no", item.get("job_card_no"))\
                                                .execute()
                                        except Exception as update_error:
                                            logger.error(f"Error updating job tracker item: {str(update_error)}")
                                            continue
                                    else:
                                        try:
                                            supabase.table("mro_job_tracker")\
                                                .insert(item)\
                                                .execute()
                                        except Exception as insert_error:
                                            logger.error(f"Error inserting job tracker item: {str(insert_error)}")
                                            continue
                                    inserted_count += 1
                                except Exception as e:
                                    logger.error(f"Error processing job tracker item: {str(e)}")
                                    continue
                    except Exception as e:
                        logger.error(f"Error reading Excel file: {str(e)}")
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                        return JSONResponse(
                            status_code=400,
                            content={
                                "message": "Failed to read Excel file",
                                "error": str(e),
                                "success": False
                            },
                            headers=cors_headers
                        )
        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            if os.path.exists(temp_path):
                os.remove(temp_path)
            return JSONResponse(
                status_code=400,
                content={
                    "message": "Failed to read file",
                    "error": str(e),
                    "success": False
                },
                headers=cors_headers
            )
        
        # Clean up temp file
        os.remove(temp_path)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "Upload processed",
                "total_items": total_rows,
                "inserted_count": inserted_count,
                "error_count": total_rows - inserted_count
            },
            headers=cors_headers
        )
    except Exception as e:
        logger.error(f"Error uploading job tracker data: {str(e)}")
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return JSONResponse(
            status_code=500,
            content={
                "message": "Failed to process upload",
                "error": str(e),
                "success": False
            },
            headers=cors_headers
        )

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

@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/health")
async def health_check():
    return JSONResponse(
        content={"status": "ok", "version": "1.0.0"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }
    )

@app.options("/health")
async def health_options():
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }
    )

@app.get("/api/mro/job-tracker")
async def get_job_tracker():
    try:
        response = supabase.table("mro_job_tracker").select("*").execute()
        return response.data if response and hasattr(response, 'data') else []
    except Exception as e:
        logger.error(f"Error fetching job tracker data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 10000))  # Match Render's expected port
    host = "0.0.0.0"
    uvicorn.run(
        app, 
        host=host, 
        port=port, 
        reload=ENVIRONMENT == "development",
        timeout_keep_alive=60,
        timeout_graceful_shutdown=30,
        workers=2,
        limit_max_requests=1000,
        limit_concurrency=100,
        backlog=1000
    )
