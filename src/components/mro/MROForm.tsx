"use client";

import { useState } from "react";
import { Card } from "../../components/ui/card";
import { createMROItem } from "../../lib/api";

interface MROFormProps {
  onSuccess: () => void;
}

interface FormData {
  [key: string]: string;
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

export function MROForm({ onSuccess }: MROFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    customer: "",
    part_number: "",
    description: "",
    serial_number: "",
    date_delivered: "",
    work_requested: "",
    progress: "PENDING",
    location: "",
    expected_release_date: "",
    remarks: "",
    category: "MECHANICAL"
  });

  const categoryOptions = [
    "MECHANICAL",
    "SAFETY COMPONENTS",
    "AVIONICS",
    "PLANT AND EQUIPMENT",
    "BATTERY",
    "CALIBRATION",
    "STRUCTURAL"
  ];

  const progressOptions = [
    "PENDING",
    "WIP",
    "CLOSED",
    "ON PROGRESS",
    "ASSEMBLED",
    "AWAITING PAINTING",
    "AWAITING ASSY"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0];
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate required fields with better error messages
    if (!formData.customer.trim()) {
      setError("Customer is required");
      return;
    }
    
    // Set default values for optional fields
    const apiFormData = {
      ...formData,
      part_number: formData.part_number.trim() || "N/A",
      description: formData.description.trim() || "No description",
      serial_number: formData.serial_number.trim() || "N/A",
      work_requested: formData.work_requested.trim() || "N/A",
      progress: formData.progress.trim() || "PENDING",
      location: formData.location.trim() || "Unknown",
      remarks: formData.remarks.trim() || "No remarks",
      category: formData.category.trim() || "MECHANICAL"
    };

    try {
      // Format dates before sending to API
      const apiFormData = {
        ...formData,
        date_delivered: formatDateForAPI(formData.date_delivered),
        expected_release_date: formatDateForAPI(formData.expected_release_date)
      };
      
      const result = await createMROItem(apiFormData);
      if (result) {
        setFormData({
          customer: "",
          part_number: "",
          description: "",
          serial_number: "",
          date_delivered: "",
          work_requested: "",
          progress: "PENDING",
          location: "",
          expected_release_date: "",
          remarks: "",
          category: "MECHANICAL"
        });
        onSuccess();
      } else {
        setError("Failed to create MRO item");
      }
    } catch (error) {
      console.error("Error creating MRO item:", error);
      setError(error instanceof Error ? error.message : "Failed to create MRO item");
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="customer">Customer</label>
          <input
            type="text"
            id="customer"
            name="customer"
            value={formData.customer}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="part_number">Part Number</label>
          <input
            type="text"
            id="part_number"
            name="part_number"
            value={formData.part_number}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="serial_number">Serial Number</label>
          <input
            type="text"
            id="serial_number"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="date_delivered">Date Delivered</label>
          <input
            type="date"
            id="date_delivered"
            name="date_delivered"
            value={formData.date_delivered}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="work_requested">Work Requested</label>
          <input
            type="text"
            id="work_requested"
            name="work_requested"
            value={formData.work_requested}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="progress">Progress</label>
          <select
            id="progress"
            name="progress"
            value={formData.progress}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          >
            {progressOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="expected_release_date">Expected Release Date</label>
          <input
            type="date"
            id="expected_release_date"
            name="expected_release_date"
            value={formData.expected_release_date}
            onChange={handleInputChange}
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          >
            {categoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="remarks">Remarks</label>
        <textarea
          id="remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          className="border rounded p-2 h-24"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add MRO Item
        </button>
      </div>
      </form>
    </>
  );
}
