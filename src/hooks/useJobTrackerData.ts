import { useState, useEffect } from 'react';
import { fetchJobTracker } from '../lib/api';

interface JobTrackerItem {
  id: string;
  job_card_no: string;
  customer: string;
  part_number: string;
  description: string;
  serial_number: string;
  date_delivered: string;
  work_requested: string;
  progress: string; // Maps to database column
  location: string;
  expected_release_date: string;
  remarks: string;
  category: string;
  subcategory?: string;
  created_at: string;
  updated_at: string;
}

interface UseJobTrackerDataParams {
  status?: string;
  customer?: string;
}

interface UseJobTrackerDataReturn {
  items: JobTrackerItem[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export function useJobTrackerData({ 
  status, 
  customer 
}: UseJobTrackerDataParams = {}): UseJobTrackerDataReturn {
  const [items, setItems] = useState<JobTrackerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchJobTracker();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job tracker data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status, customer]);

  const refreshData = async () => {
    await fetchData();
  };

  return {
    items,
    isLoading,
    error,
    refreshData,
  };
}
