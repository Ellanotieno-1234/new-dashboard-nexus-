# Kenya Airways Inventory Management System

A real-time inventory management system for aviation parts with Excel file processing capabilities.

## System Architecture

- Frontend: Next.js with TypeScript and Tailwind CSS
- Backend: Python FastAPI
- Database: Supabase (PostgreSQL)
- Charts: Recharts

## Features

- Real-time inventory tracking
- Order management
- Excel file upload and processing
- Analytics dashboard
- Low stock alerts
- Automated inventory updates

## Setup Instructions

### Prerequisites

1. Node.js (v16 or higher)
2. Python (v3.8 or higher)
3. Supabase account

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Create a Python virtual environment:
```bash
cd python_backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the python_backend directory:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
```

4. Start the FastAPI server:
```bash
uvicorn app:app --reload
```

### Database Setup

1. Set up a new project in Supabase
2. Execute the SQL migrations in `python_backend/migrations/01_create_tables.sql`
3. (Optional) Seed the database with sample data:
```bash
cd python_backend
python seed_data.py
```

## File Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── analytics/         # Analytics components
│   │   ├── inventory/         # Inventory components
│   │   ├── orders/           # Orders components
│   │   ├── ui/               # Shared UI components
│   │   └── wrappers/         # Component wrappers
│   └── lib/                   # Utility functions
├── python_backend/
│   ├── app.py                # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── migrations/           # Database migrations
└── public/                   # Static assets
```

## Data Files

### Example Files
Sample files are provided in the `python_backend/examples` directory:
- `sample_inventory.csv`: Example inventory data
- `sample_orders.csv`: Example orders data

These files can be used to:
1. Test the file upload functionality
2. Understand the required file format
3. Seed the database with sample data using `seed_data.py`

## File Formats

### Inventory File Format
- Part Number
- Name
- Category
- In Stock
- Min Required
- On Order
- Last Updated

### Orders File Format
- Order Number
- Part Number
- Part Name
- Quantity
- Status
- Order Date
- Expected Delivery
- Supplier

## API Endpoints

- `POST /api/upload/inventory` - Upload inventory data
- `POST /api/upload/orders` - Upload orders data
- `GET /api/inventory` - Get inventory data
- `GET /api/orders` - Get orders data
- `GET /api/analytics/summary` - Get analytics summary

## Development

1. Frontend development:
   - `npm run dev` - Start Next.js development server
   - `npm run build` - Build for production
   - `npm run lint` - Run ESLint

2. Backend development:
   - `uvicorn app:app --reload` - Start FastAPI development server
   - API documentation available at `http://localhost:8000/docs`
