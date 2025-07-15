import os
import logging

# Set environment variables before importing other modules
os.environ["SUPABASE_URL"] = "https://nbtzgmzzglapgjicjxnk.supabase.co"
os.environ["SUPABASE_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idHpnbXp6Z2xhcGdqaWNqeG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNjg0NjksImV4cCI6MjA2Mzc0NDQ2OX0.sgV7TrUgIQyRNzn25Vv_aeguIK6uUiM_Qe0zaKR0xFc"

from typing import List, Dict, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from supabase import create_client, Client
from services.mro_service import MROService

# Configure logging with more detail
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    app = FastAPI()

    # CORS middleware should be added immediately after app creation
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"https://new-dashboard-nexus-b5ra.*vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    async def root():
        return {"message": "Backend is running!"}

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    # Initialize Supabase client
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

    supabase = init_supabase()
    DEFAULT_EXCEL_PATH = os.path.join("data", "mro_tracking.xlsx")
    mro_service = MROService(supabase, DEFAULT_EXCEL_PATH)

    @app.get("/api/mro/items")
    async def get_mro_items(category: Optional[str] = None, progress: Optional[str] = None):
        """Get MRO items with optional filtering"""
        try:
            items = await mro_service.get_items(category, progress)
            return items
        except Exception as e:
            logger.error(f"Error fetching MRO items: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    @app.post("/api/mro/items")
    async def create_mro_item(request: Request):
        """Create new MRO item"""
        try:
            # Log raw request data
            body = await request.json()
            logger.info("Received raw request data:")
            logger.info(body)

            # Validate and create item
            new_item, error = await mro_service.create_item(body)
            
            if error:
                logger.error(f"Validation error: {error}")
                return HTTPException(status_code=400, detail=error)

            if not new_item:
                error_msg = "Failed to create MRO item"
                logger.error(error_msg)
                raise HTTPException(status_code=500, detail=error_msg)

            logger.info("Successfully created MRO item:")
            logger.info(new_item)
            return new_item
            
        except HTTPException as he:
            raise he
        except Exception as e:
            error_msg = f"Error creating MRO item: {str(e)}"
            logger.error(error_msg)
            logger.exception(e)  # This will log the full stack trace
            raise HTTPException(status_code=500, detail=error_msg)

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

    @app.post("/api/mro/job-tracker/upload")
    async def upload_job_tracker(file: UploadFile = File(...)):
        """Upload job tracker Excel file, parse, and upsert to mro_job_tracker table."""
        try:
            contents = await file.read()
            df = pd.read_excel(pd.io.common.BytesIO(contents))
            # Clean column names for consistency
            df.columns = [str(col).strip().lower().replace(' ', '_') for col in df.columns]
            records = df.to_dict(orient="records")
            # Upsert to Supabase
            result = mro_service.upsert_job_tracker_data(records)
            if not result.get("success"):
                raise HTTPException(status_code=500, detail=result.get("error", "Unknown error"))
            return {"columns": list(df.columns), "data": records}
        except Exception as e:
            logger.error(f"Error uploading job tracker: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    @app.get("/api/mro/job-tracker/items")
    async def get_job_tracker_items():
        """Fetch all job tracker data from mro_job_tracker table."""
        try:
            data = mro_service.fetch_job_tracker_data()
            columns = list(data[0].keys()) if data else []
            return {"columns": columns, "data": data}
        except Exception as e:
            logger.error(f"Error fetching job tracker items: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
