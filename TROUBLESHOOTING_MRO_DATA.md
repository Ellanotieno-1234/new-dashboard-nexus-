# MRO Job Tracker Data Issue - Troubleshooting Guide

## Problem Summary
The MRO job tracker data is not appearing in the frontend due to database schema mismatches and data insertion failures.

## Root Cause Analysis
1. **Database Schema Issue**: The `mro_job_tracker` table is missing the `job_card_no` column
2. **Column Name Mismatch**: Frontend expects `job_status` but database uses `progress`
3. **Data Type Issues**: Datetime objects not being properly serialized

## Solution Steps

### 1. Fix Database Schema
Run the complete database setup to ensure all columns exist:

```bash
cd new-dashboard-nexus--main/python_backend
python setup_mro_table.py
```

If you want to just fix missing columns:
```bash
python fix_job_tracker_table.py
```

### 2. Verify Database Connection
Check your `.env` file has the correct database credentials:
```bash
# Check if DATABASE_URL is set
cat .env | grep DATABASE_URL

# Check if Supabase credentials are set
cat .env | grep SUPABASE
```

### 3. Test Data Upload
Upload a test Excel file to verify the fix:

1. Go to the MRO Job Tracker page
2. Upload a simple Excel file with these columns:
   - JOB CARD NO
   - CUSTOMER
   - PART NUMBER
   - DESCRIPTION
   - SERIAL NUMBER
   - DATE DELIVERED
   - WORK REQUESTED
   - PROGRESS
   - LOCATION
   - EXPECTED RELEASE DATE
   - REMARKS
   - CATEGORY

### 4. Verify Data Flow
Check the data flow:

1. **Backend logs**: Check Python backend logs for successful data insertion
2. **Database**: Query the table directly to verify data exists
3. **Frontend**: Check browser network tab for API responses

### 5. Manual Database Check
If needed, manually check the database:

```sql
-- Connect to your database
-- Check if data exists
SELECT COUNT(*) FROM mro_job_tracker;

-- Check table structure
\d mro_job_tracker

-- Check sample data
SELECT * FROM mro_job_tracker LIMIT 5;
```

## Common Issues & Solutions

### Issue: "keys must be str, int, float, bool or None, not datetime.datetime"
**Solution**: This is already fixed in the backend code (lines 704-710 in app.py)

### Issue: "column job_card_no does not exist"
**Solution**: Run the database migration script above

### Issue: "column job_status does not exist"
**Solution**: Frontend now uses `progress` instead of `job_status`

### Issue: Data not showing in frontend
**Solution**: 
1. Check browser console for errors
2. Verify API endpoint returns data: `GET /api/mro/job-tracker`
3. Check network tab for 200 responses

## Testing Checklist

- [ ] Database has `job_card_no` column
- [ ] Backend can insert data without datetime errors
- [ ] Frontend displays data correctly
- [ ] Upload functionality works
- [ ] Data persists after refresh

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:10000/health

# Test job tracker API
curl http://localhost:10000/api/mro/job-tracker

# Test database connection
python -c "from new-dashboard-nexus--main.python_backend.app import supabase; print('Connected' if supabase else 'Failed')"
```

## Next Steps
1. Run the database fix script
2. Upload test data
3. Verify frontend displays data
4. Test the complete workflow