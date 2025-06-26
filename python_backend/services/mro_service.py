import os
import logging
from datetime import datetime, date
from typing import List, Dict, Any
import pandas as pd
from openpyxl import load_workbook
from openpyxl.styles import NamedStyle
from supabase import Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MROService:
    # Sheet to category mapping
    SHEET_CATEGORIES = {
        'ALL WIP COMP': 'ALL WIP COMP',
        'MECHANICAL': 'MECHANICAL',
        'Mech shop': 'MECHANICAL',
        'SAFETY COMPONENTS': 'SAFETY COMPONENTS',
        'Safety Shop': 'SAFETY COMPONENTS',
        'AVIONICS MAIN': 'AVIONICS MAIN',
        'Avionics Shop': 'Avionics Shop',
        'PLANT AND EQUIPMENTS': 'PLANT AND EQUIPMENTS',
        'BATTERY': 'BATTERY',
        'Battery Shop': 'Battery Shop',
        'CALIBRATION': 'CALIBRATION',
        'Cal lab': 'Cal lab',
        'UPH Shop': 'UPH Shop',
        'Structures Shop': 'Structures Shop'
    }

    def __init__(self, supabase: Client, excel_path: str = None):
        self.supabase = supabase
        self.excel_path = excel_path
        self._setup_date_styles() if excel_path else None

    def _setup_date_styles(self):
        """Setup date styles for Excel"""
        self.date_style = NamedStyle(name='date_style', number_format='YYYY-MM-DD')

    def _get_subcategory(self, sheet_name: str) -> str:
        """Determine subcategory from sheet name"""
        lower_name = sheet_name.lower()
        if 'main' in lower_name:
            return 'MAIN'
        elif 'shop' in lower_name:
            return 'SHOP'
        elif 'lab' in lower_name:
            return 'LAB'
        return None

    def read_excel_data(self, sheet_name: str = None) -> List[Dict[Any, Any]]:
        """Read data from Excel file if available"""
        if not self.excel_path or not os.path.exists(self.excel_path):
            logger.warning("Excel file not available - skipping read operation")
            return []
            
        try:
            if sheet_name:
                sheets_to_read = [sheet_name]
            else:
                # Read all sheets
                sheets_to_read = pd.ExcelFile(self.excel_path).sheet_names

            all_records = []
            for sheet in sheets_to_read:
                try:
                    df = pd.read_excel(self.excel_path, sheet_name=sheet)
                    
                    # Skip empty sheets or sheets without proper headers
                    if df.empty or not any('customer' in col.lower() for col in df.columns):
                        continue

                    # Clean column names
                    df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]
                    
                    # Convert to list of dictionaries
                    records = df.to_dict('records')
                    
                    # Clean and format data
                    for record in records:
                        # Convert dates to string format
                        for key, value in record.items():
                            if isinstance(value, pd.Timestamp):
                                record[key] = value.strftime('%Y-%m-%d')
                            elif pd.isna(value):
                                record[key] = None
                        
                        # Map sheet name to category and add subcategory
                        category = self.SHEET_CATEGORIES.get(sheet, sheet)
                        record['category'] = category
                        record['subcategory'] = self._get_subcategory(sheet)
                        record['sheet_name'] = sheet
                    
                    all_records.extend(records)
                except Exception as e:
                    logger.error(f"Error reading sheet {sheet}: {str(e)}")
                    continue
            
            return all_records
            
        except Exception as e:
            logger.error(f"Error reading Excel file: {str(e)}")
            raise

    def write_excel_data(self, data: List[Dict], sheet_name: str):
        """Write data to Excel file if path is configured"""
        if not self.excel_path:
            logger.info("Excel path not configured - skipping write operation")
            return
            
        try:
            # Create DataFrame from data
            df = pd.DataFrame(data)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(self.excel_path), exist_ok=True)
            
            if not os.path.exists(self.excel_path):
                # Create new Excel file
                df.to_excel(self.excel_path, sheet_name=sheet_name, index=False)
            else:
                # Create temporary file path
                temp_path = f"{self.excel_path}.tmp"
                
                try:
                    # Read existing workbook
                    book = pd.read_excel(self.excel_path, sheet_name=None)
                    
                    # Write to temporary file
                    with pd.ExcelWriter(temp_path, engine='openpyxl') as writer:
                        # Write all existing sheets except the one we're updating
                        for sheet in book.keys():
                            if sheet != sheet_name:
                                book[sheet].to_excel(writer, sheet_name=sheet, index=False)
                        # Write new data
                        df.to_excel(writer, sheet_name=sheet_name, index=False)
                    
                    # Replace original file with temporary file
                    os.replace(temp_path, self.excel_path)
                    
                except Exception as e:
                    # Clean up temp file if something went wrong
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
                    raise
            
            logger.info(f"Successfully wrote data to sheet: {sheet_name}")
            
        except Exception as e:
            logger.error(f"Error writing to Excel file: {str(e)}")
            raise

    async def sync_to_database(self, data: List[Dict]) -> None:
        """Sync data to Supabase database"""
        try:
            for item in data:
                # Skip items without required fields
                if not item.get("serial_number"):
                    logger.warning(f"Skipping item without serial number: {item}")
                    continue

                # Ensure all required fields are present
                required_fields = {
                    "customer", "part_number", "description", "serial_number",
                    "work_requested", "category"
                }
                
                for field in required_fields:
                    if field not in item or not item[field]:
                        item[field] = "N/A"

                # Clean up any empty strings or None values
                for key, value in item.items():
                    if pd.isna(value) or value == "":
                        item[key] = None

                # Check if record exists
                existing = self.supabase.table("mro_items").select("id").eq(
                    "serial_number", item["serial_number"]
                ).execute()

                try:
                    if existing.data:
                        # Update existing record
                        self.supabase.table("mro_items").update(item).eq(
                            "serial_number", item["serial_number"]
                        ).execute()
                        logger.info(f"Updated MRO item: {item['serial_number']}")
                    else:
                        # Insert new record
                        self.supabase.table("mro_items").insert(item).execute()
                        logger.info(f"Inserted new MRO item: {item['serial_number']}")
                except Exception as e:
                    logger.error(f"Error processing item {item['serial_number']}: {str(e)}")
                    continue

        except Exception as e:
            logger.error(f"Error syncing to database: {str(e)}")
            raise

    async def sync_to_excel(self, category: str = None) -> None:
        """Sync data from database to Excel if configured"""
        if not self.excel_path:
            logger.info("Excel path not configured - skipping sync operation")
            return
            
        try:
            # Fetch data from database
            query = self.supabase.table("mro_items").select("*")
            if category:
                query = query.eq("category", category)
            
            response = query.execute()
            data = response.data if response and hasattr(response, 'data') else []

            if category:
                # Write to specific sheet
                self.write_excel_data(data, category)
            else:
                # Group data by category and write to respective sheets
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

    async def update_item(self, serial_number: str, data: Dict) -> Dict:
        """Update MRO item in both database and Excel"""
        try:
            # Convert date fields to ISO format if they are datetime objects
            if isinstance(data.get('date_delivered'), (datetime, pd.Timestamp)):
                data['date_delivered'] = data['date_delivered'].strftime('%Y-%m-%d')
            if isinstance(data.get('expected_release_date'), (datetime, pd.Timestamp)):
                data['expected_release_date'] = data['expected_release_date'].strftime('%Y-%m-%d')
                
            # Update database
            response = self.supabase.table("mro_items").update(data).eq(
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

    async def get_items(self, category: str = None, progress: str = None) -> List[Dict]:
        """Get MRO items with optional filtering"""
        try:
            query = self.supabase.table("mro_items").select("*")
            
            if category:
                query = query.eq("category", category)
            if progress:
                query = query.eq("progress", progress)
            
            response = query.execute()
            items = response.data if response and hasattr(response, 'data') else []
            
            if not items:
                logger.warning(f"No MRO items found for category={category}, progress={progress}")
            else:
                logger.info(f"Successfully retrieved {len(items)} MRO items")
                
            return items

        except Exception as e:
            logger.error(f"Error fetching MRO items from database: {str(e)}")
            logger.error("Supabase connection details: " + 
                      f"URL={'configured' if self.supabase.supabase_url else 'missing'}, " +
                      f"KEY={'configured' if self.supabase.supabase_key else 'missing'}")
            raise
