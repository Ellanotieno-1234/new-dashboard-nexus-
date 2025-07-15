# Deploying to Render

This guide explains how to properly deploy the backend service to Render.

## Prerequisites

1. A Render account
2. A Supabase project with the required tables set up
3. Your Supabase URL and API key

## Environment Variables

Configure the following environment variables in your Render service:

### Required Variables
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/public API key

### Optional Variables
- `ENVIRONMENT`: Set to "production" for production deployments (default)
- `PORT`: Port number for the server (Render will set this automatically)
- `EXCEL_DIR`: Directory for Excel files (not recommended for Render as the filesystem is ephemeral)

## Deployment Steps

1. Create a new Web Service in Render
2. Connect your repository
3. Configure the service:
   - Name: Choose a name for your service
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd python_backend && python app.py`
   
4. Set environment variables:
   - Go to "Environment" section
   - Add SUPABASE_URL and SUPABASE_KEY
   - DO NOT configure EXCEL_DIR as Render's filesystem is ephemeral

## Important Notes

1. **File System Limitations**: 
   - Render's filesystem is ephemeral
   - Any files written to disk will be lost when the service restarts
   - The MRO service has been configured to work without Excel files in this environment

2. **Database-Only Mode**:
   - The MRO service will automatically operate in database-only mode on Render
   - Excel operations are disabled when EXCEL_DIR is not configured
   - All MRO data is stored and retrieved from Supabase

3. **Troubleshooting**:
   - Check Render logs for any error messages
   - Verify environment variables are correctly set
   - Ensure Supabase connection is working
   - Monitor the application logs for detailed error messages

## Testing the Deployment

After deploying:

1. Test the health endpoint:
   ```
   curl https://your-service.onrender.com/
   ```

2. Test the MRO endpoint:
   ```
   curl https://your-service.onrender.com/api/mro/items
   ```

3. Check Render logs for any error messages

If you encounter issues:
1. Verify environment variables in Render dashboard
2. Check Supabase connection details
3. Review application logs for specific error messages
4. Ensure all required tables exist in your Supabase database
