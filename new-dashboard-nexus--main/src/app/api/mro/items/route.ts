import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const progress = searchParams.get('progress');
  
  try {
    let url = `${API_URL}/api/mro/items`;
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (progress) params.append('progress', progress);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching MRO items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MRO items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/api/mro/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating MRO item:', error);
    return NextResponse.json(
      { error: 'Failed to create MRO item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serialNumber = searchParams.get('serialNumber');
    
    if (!serialNumber) {
      return NextResponse.json(
        { error: 'Serial number is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const response = await fetch(`${API_URL}/api/mro/items/${serialNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating MRO item:', error);
    return NextResponse.json(
      { error: 'Failed to update MRO item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serialNumber = searchParams.get('serialNumber');
    
    if (!serialNumber) {
      return NextResponse.json(
        { error: 'Serial number is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/api/mro/items/${serialNumber}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting MRO item:', error);
    return NextResponse.json(
      { error: 'Failed to delete MRO item' },
      { status: 500 }
    );
  }
}
