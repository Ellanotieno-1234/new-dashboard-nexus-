import { useState, useEffect } from 'react';
import { fetchJobTracker } from '../lib/api';

interface JobTrackerItem {
  id: string;
  date: string;
  customer: string;
  description: string;
  part_number: string;
  serial_number: string;
  lpo_date: string;
  lpo_number: string;
  ro_number: string;
  kq_repair_order_date: string;
  job_card_no: string;
  job_card_date: string;
  kq_works_order_wo_no: string;
  kq_works_order_date: string;
  job_status: string;
  job_status_date: string;
  job_card_shared_with_finance: string;
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
