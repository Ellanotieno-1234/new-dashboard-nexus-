import os
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
import pandas as pd
from openpyxl import load_workbook
from openpyxl.styles import NamedStyle
from supabase import Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MROService:
    def __init__(self, supabase: Client, excel_path: str):
        self.supabase = supabase
        self.excel_path = excel_path
        self._setup_date_styles()

    def _setup_date_styles(self):
        """Setup date styles for Excel"""
        self.date_style = NamedStyle(name='date_style', number_format='YYYY-MM-DD')

    def format_date(self, date_str: str) -> Optional[str]:
        """Format date string to database compatible format"""
        if not date_str:
            return None
        try:
            # Handle ISO format dates (from frontend)
            date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            return date_obj.strftime('%Y-%m-%d')
        except ValueError:
            try:
                # Try parsing other common formats
                date_obj = pd.to_datetime(date_str)
                return date_obj.strftime('%Y-%m-%d')
            except:
                logger.error(f"Invalid date format: {date_str}")
                return None

    def validate_mro_item(self, item: Dict) -> tuple[bool, str]:
        """Validate MRO item data"""
        required_fields = [
            'serial_number', 'customer', 'part_number', 'description',
            'date_delivered', 'work_requested', 'progress', 'location',
            'expected_release_date', 'category'
        ]

        # Check required fields
        for field in required_fields:
            if not item.get(field):
                return False, f"Missing required field: {field}"

        # Format dates
        item['date_delivered'] = self.format_date(item['date_delivered'])
        item['expected_release_date'] = self.format_date(item['expected_release_date'])

        if not item['date_delivered'] or not item['expected_release_date']:
            return False, "Invalid date format"

        return True, ""

    def clean_mro_record(self, record: Dict) -> Dict:
        """Clean and standardize MRO record fields for safe DB insertion and frontend display."""
        # Define default values
        defaults = {
            'customer': 'Unknown',
            'part_number': 'N/A',
            'description': 'N/A',
            'serial_number': 'N/A',
            'date_delivered': None,
            'work_requested': 'N/A',
            'progress': 'Unknown',
            'location': 'Unknown',
            'expected_release_date': None,
            'remarks': 'None',
            'category': 'Uncategorized',
        }
        cleaned = {}
        for key in defaults:
            value = record.get(key, None)
            if key in ['date_delivered', 'expected_release_date']:
                # Convert to string date or None
                if isinstance(value, pd.Timestamp):
                    cleaned[key] = value.strftime('%Y-%m-%d')
                elif pd.isna(value) or value in [None, '', 'NaT', 'nan', 'NaN']:
                    cleaned[key] = None
                else:
                    try:
                        cleaned[key] = pd.to_datetime(value, errors='coerce')
                        if pd.isna(cleaned[key]):
                            cleaned[key] = None
                        else:
                            cleaned[key] = cleaned[key].strftime('%Y-%m-%d')
                    except Exception:
                        cleaned[key] = None
            else:
                if pd.isna(value) or value in [None, '', 'NaT', 'nan', 'NaN']:
                    cleaned[key] = defaults[key]
                else:
                    cleaned[key] = str(value).strip()
        # Copy over any extra fields (like sheet_name, subcategory, etc.)
        for k, v in record.items():
            if k not in cleaned:
                cleaned[k] = v
        return cleaned

    def read_excel_data(self, sheet_name: str = None) -> List[Dict[Any, Any]]:
        """Read data from Excel file"""
        try:
            if not os.path.exists(self.excel_path):
                return []

            if sheet_name:
                df = pd.read_excel(self.excel_path, sheet_name=sheet_name)
            else:
                df_dict = pd.read_excel(self.excel_path, sheet_name=None)
                df = pd.concat(df_dict.values(), ignore_index=True)
            
            df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]
            records = df.to_dict('records')
            cleaned_records = []
            for record in records:
                cleaned = self.clean_mro_record(record)
                if sheet_name:
                    cleaned['category'] = sheet_name
                cleaned_records.append(cleaned)
            return cleaned_records
        except Exception as e:
            logger.error(f"Error reading Excel file: {str(e)}")
            return []

    async def create_item(self, item: Dict) -> tuple[Dict, str]:
        """Create new MRO item with validation and cleaning"""
        try:
            # Clean and validate item data
            cleaned_item = self.clean_mro_record(item)
            is_valid, error_message = self.validate_mro_item(cleaned_item)
            if not is_valid:
                return None, error_message

            # Insert into database
            response = self.supabase.table("mro_items").insert(cleaned_item).execute()
            
            if not response.data:
                return None, "Failed to create item in database"

            new_item = response.data[0]
            
            # Sync to Excel
            await self.sync_to_excel(new_item.get('category'))
            
            return new_item, ""

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Error creating MRO item: {error_msg}")
            return None, error_msg

    async def sync_to_excel(self, category: str = None) -> None:
        """Sync data from database to Excel"""
        try:
            query = self.supabase.table("mro_items").select("*")
            if category:
                query = query.eq("category", category)
            
            response = query.execute()
            data = response.data if response and hasattr(response, 'data') else []

            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(self.excel_path), exist_ok=True)

            if category:
                self.write_excel_data(data, category)
            else:
                categories = {}
                for item in data:
                    cat = item.get('category', 'Uncategorized')
                    if cat not in categories:
                        categories[cat] = []
                    categories[cat].append(item)
                
                for cat, items in categories.items():
                    self.write_excel_data(items, cat)

            logger.info("Successfully synced database to Excel")

        except Exception as e:
            logger.error(f"Error syncing to Excel: {str(e)}")
            raise

    def write_excel_data(self, data: List[Dict], sheet_name: str):
        """Write data to Excel file"""
        try:
            df = pd.DataFrame(data)
            
            mode = 'a' if os.path.exists(self.excel_path) else 'w'
            with pd.ExcelWriter(self.excel_path, engine='openpyxl', mode=mode) as writer:
                df.to_excel(writer, sheet_name=sheet_name, index=False)
                
                sheet = writer.sheets[sheet_name]
                for row in sheet.iter_rows(min_row=2):
                    for cell in row:
                        if isinstance(cell.value, datetime):
                            cell.style = self.date_style
            
            logger.info(f"Successfully wrote data to sheet: {sheet_name}")
            
        except Exception as e:
            logger.error(f"Error writing to Excel file: {str(e)}")
            raise

    async def get_items(self, category: str = None, progress: str = None) -> List[Dict]:
        """Get MRO items with optional filtering"""
        try:
            query = self.supabase.table("mro_items").select("*")
            
            if category:
                query = query.eq("category", category)
            if progress:
                query = query.eq("progress", progress)
            
            response = query.execute()
            return response.data if response and hasattr(response, 'data') else []
            
        except Exception as e:
            logger.error(f"Error fetching MRO items: {str(e)}")
            return []

    async def update_item(self, serial_number: str, data: Dict) -> Dict:
        """Update MRO item in both database and Excel"""
        try:
            # Clean and format data
            cleaned_data = self.clean_mro_record(data)
            if 'date_delivered' in cleaned_data:
                cleaned_data['date_delivered'] = self.format_date(cleaned_data['date_delivered'])
            if 'expected_release_date' in cleaned_data:
                cleaned_data['expected_release_date'] = self.format_date(cleaned_data['expected_release_date'])

            response = self.supabase.table("mro_items").update(cleaned_data).eq(
                "serial_number", serial_number
            ).execute()
            
            updated_item = response.data[0] if response.data else None
            
            if updated_item:
                # Sync changes to Excel
                await self.sync_to_excel(updated_item.get('category'))
                return updated_item
            
            return None

        except Exception as e:
            logger.error(f"Error updating MRO item: {str(e)}")
            raise

    def upsert_job_tracker_data(self, records: list[dict]) -> dict:
        """Insert or upsert job tracker data into the mro_job_tracker table."""
        try:
            response = self.supabase.table("mro_job_tracker").upsert(records).execute()
            return {"success": True, "inserted": len(records), "response": response.data}
        except Exception as e:
            logger.error(f"Error upserting job tracker data: {str(e)}")
            return {"success": False, "error": str(e)}

    def fetch_job_tracker_data(self) -> list[dict]:
        """Fetch all job tracker data from the mro_job_tracker table."""
        try:
            response = self.supabase.table("mro_job_tracker").select("*").execute()
            return response.data if response and hasattr(response, 'data') else []
        except Exception as e:
            logger.error(f"Error fetching job tracker data: {str(e)}")
            return []
