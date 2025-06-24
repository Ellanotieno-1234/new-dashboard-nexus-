// API utility functions for interacting with the Python backend
import { API_BASE_URL } from './config';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

async function fetchWithCORS(url: string, options: RequestInit = {}) {
  try {
    console.debug('Making API request to:', url);
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error(`API request failed: ${response.statusText}`);
      console.debug('Response:', await response.text());
      return [];
    }

    const data = await response.json();
    console.debug('API response:', data);
    return Array.isArray(data) ? data : (data?.data || []);
  } catch (error) {
    console.error('API request error:', error);
    console.debug('Request details:', { url, options });
    return [];
  }
}

export async function uploadInventoryFile(file: File) {
  try {
    console.debug('Uploading inventory file:', file.name);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/inventory`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.debug('Upload response:', result);
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function uploadOrdersFile(file: File) {
  try {
    console.debug('Uploading orders file:', file.name);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/orders`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.debug('Upload response:', result);
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function fetchInventory() {
  try {
    console.debug('Fetching inventory data');
    const response = await fetchWithCORS(`${API_BASE_URL}/api/inventory`);
    console.debug('Inventory response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}

export async function fetchOrders() {
  try {
    console.debug('Fetching orders data');
    const response = await fetchWithCORS(`${API_BASE_URL}/api/orders`);
    console.debug('Orders response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function createMROItem(item: any) {
  try {
    console.debug('Creating MRO item:', item);
    const response = await fetch(`${API_BASE_URL}/api/mro/items`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(item)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.detail || 'Failed to create MRO item');
    }

    console.debug('Create MRO item response:', data);
    return data;
  } catch (error) {
    console.error('Error creating MRO item:', error);
    throw error instanceof Error ? error : new Error('Failed to create MRO item');
  }
}

export async function fetchMROItems() {
  try {
    console.debug('Fetching MRO items');
    const response = await fetchWithCORS(`${API_BASE_URL}/api/mro/items`);
    console.debug('MRO items response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching MRO items:', error);
    return [];
  }
}

export async function fetchAnalyticsSummary() {
  try {
    console.debug('Fetching analytics summary');
    const response = await fetch(`${API_BASE_URL}/api/analytics/summary`, {
      mode: 'cors',
      credentials: 'omit',
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.debug('Analytics summary response:', data);
    return {
      total_parts: Number(data.total_parts || 0),
      total_value: Number(data.total_value || 0),
      low_stock: Number(data.low_stock || 0),
      backorders: Number(data.backorders || 0),
      turnover_rate: Number(data.turnover_rate || 0),
      accuracy_rate: Number(data.accuracy_rate || 0)
    };
  } catch (error) {
    console.error('Failed to fetch analytics summary:', error);
    return null;
  }
}
