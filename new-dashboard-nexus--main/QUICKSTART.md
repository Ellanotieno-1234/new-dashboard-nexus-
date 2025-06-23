# Quick Start Guide

Follow these steps to get the Kenya Airways Inventory Management System up and running quickly:

## 1. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Note down your:
   - Project URL
   - anon/public key
   - service_role key (for backend)
3. Run the SQL migration:
   - Copy contents of `python_backend/migrations/01_create_tables.sql`
   - Execute in Supabase SQL editor

## 2. Backend Setup

```bash
# Navigate to backend directory
cd python_backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "SUPABASE_URL=your_project_url" > .env
echo "SUPABASE_KEY=your_service_role_key" >> .env

# Optional: Seed the database with sample data
python seed_data.py

# Start the server
uvicorn app:app --reload
```

## 3. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_SUPABASE_URL=your_project_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" >> .env.local

# Start the development server
npm run dev
```

## 4. Testing the System

1. Open http://localhost:3000 in your browser
2. Navigate to the Inventory page
3. Try uploading the sample inventory file from `python_backend/examples/sample_inventory.csv`
4. Navigate to the Orders page
5. Try uploading the sample orders file from `python_backend/examples/sample_orders.csv`
6. Check the Analytics page to see the dashboard with your data

## 5. Common Issues

1. If upload fails:
   - Check that the FastAPI server is running
   - Verify your Supabase credentials
   - Check the file format matches the examples

2. If charts don't load:
   - Check browser console for errors
   - Verify Supabase connection
   - Ensure data was properly uploaded

3. If database seeding fails:
   - Verify Supabase service_role key
   - Check that tables were created properly
   - Ensure CSV files are in the correct location
