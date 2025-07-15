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

    // Forward the file to the Python backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://new-dashboard-nexus.onrender.com'}/api/mro/job-tracker/upload`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Backend upload failed: ${error}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
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