import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 100MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 413 }
      );
    }

    // Forward the file to the Python backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://new-dashboard-nexus.onrender.com';
    console.log('Proxying upload to:', `${backendUrl}/api/mro/job-tracker/upload`);
    
    try {
      const response = await fetch(`${backendUrl}/api/mro/job-tracker/upload`, {
        method: 'POST',
        body: backendFormData,
        headers: {
          'Accept': 'application/json',
        },
        // Increase timeout for large files
        signal: AbortSignal.timeout(120000), // 2 minutes
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorJson.error || errorJson.message || errorText;
        } catch {
          errorMessage = errorText || `Backend error: ${response.status} ${response.statusText}`;
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status }
        );
      }

      const result = await response.json();
      return NextResponse.json(result);
    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Upload failed';
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          errorMessage = 'Upload timeout - file too large or server busy. Try splitting into smaller files.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}