"use client";

import { useState, useEffect } from "react";
import { Table } from "../../components/ui/table";

interface MROItem {
  id: string;
  customer: string;
  part_number: string;
  description: string;
  serial_number: string;
  date_delivered: string;
  work_requested: string;
  progress: string;
  location: string;
  expected_release_date: string;
  remarks: string;
  category: string;
}

export function MROTable() {
  const [items, setItems] = useState<MROItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMROItems();
  }, []);

  const fetchMROItems = async () => {
    try {
      const response = await fetch("/api/mro/items");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching MRO items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Part Number</th>
            <th>Description</th>
            <th>Serial Number</th>
            <th>Date Delivered</th>
            <th>Work Requested</th>
            <th>Progress</th>
            <th>Location</th>
            <th>Expected Release</th>
            <th>Remarks</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.customer}</td>
              <td>{item.part_number}</td>
              <td>{item.description}</td>
              <td>{item.serial_number}</td>
              <td>{item.date_delivered}</td>
              <td>{item.work_requested}</td>
              <td>
                <span className={`px-2 py-1 rounded text-sm ${
                  item.progress === 'CLOSED' ? 'bg-green-100 text-green-800' :
                  item.progress === 'WIP' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.progress}
                </span>
              </td>
              <td>{item.location}</td>
              <td>{item.expected_release_date}</td>
              <td>{item.remarks}</td>
              <td>{item.category}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
