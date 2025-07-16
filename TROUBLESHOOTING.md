# Troubleshooting Large File Uploads

## Common Issues and Solutions

### 1. 502 Bad Gateway Error
**Cause**: Render has a 30-second timeout limit for free plans
**Solutions**:
- Split large Excel files into smaller chunks (under 10MB)
- Use CSV format instead of Excel for better performance
- Consider upgrading to Render's paid plan for longer timeouts

### 2. CORS Policy Error
**Cause**: Cross-origin requests blocked
**Solutions**:
- ✅ Already fixed: Backend now has proper CORS headers
- Use Next.js API routes as proxy (already implemented)

### 3. File Size Limits
**Current Limits**:
- Frontend: 100MB
- Backend: 100MB
- Render: 100MB upload, 30-second timeout

### 4. How to Split Large Files

#### Option 1: Split by Rows
```bash
# For CSV files
# Split into files with 1000 rows each
split -l 1000 large_file.csv part_
```

#### Option 2: Use Excel/Google Sheets
1. Open your Excel file
2. Select a subset of rows (e.g., 5000 at a time)
3. Save as new file
4. Upload each file separately

#### Option 3: Use Python Script
```python
import pandas as pd

# Split Excel into chunks
df = pd.read_excel('large_file.xlsx')
chunk_size = 1000

for i in range(0, len(df), chunk_size):
    chunk = df.iloc[i:i+chunk_size]
    chunk.to_excel(f'chunk_{i//chunk_size + 1}.xlsx', index=False)
```

### 5. Performance Tips
- Use CSV format instead of Excel when possible
- Remove unnecessary columns before uploading
- Ensure consistent column naming
- Check for special characters in data

### 6. Error Messages Guide
- **"File too large"**: Split into smaller files
- **"Server timeout"**: File is too large for current timeout limits
- **"Failed to read file"**: Check file format and corruption
- **"Network error"**: Check internet connection

### 7. Testing Upload
1. Start with a small test file (under 1MB)
2. Verify upload works
3. Gradually increase file size
4. Monitor for timeout issues

### 8. Backend Configuration
The backend has been updated with:
- ✅ Increased file size limit to 100MB
- ✅ Better error handling
- ✅ Streaming file uploads
- ✅ Chunked processing for large datasets
- ✅ Improved timeout handling