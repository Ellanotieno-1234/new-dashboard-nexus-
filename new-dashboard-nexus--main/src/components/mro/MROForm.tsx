"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Category, Progress, CATEGORIES, PROGRESS_STATUSES } from "../../types/mro";
import { useMROData } from "../../hooks/useMROData";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface FormData {
  customer: string;
  part_number: string;
  description: string;
  serial_number: string;
  date_delivered: string;
  work_requested: string;
  progress: Progress;
  location: string;
  expected_release_date: string;
  remarks: string;
  category: Category;
}

const initialFormData: FormData = {
  customer: "",
  part_number: "",
  description: "",
  serial_number: "",
  date_delivered: new Date().toISOString().split('T')[0],
  work_requested: "",
  progress: "PENDING",
  location: "",
  expected_release_date: new Date().toISOString().split('T')[0],
  remarks: "",
  category: "MECHANICAL"
};

export function MROForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { createItem } = useMROData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrorMessage("");

      await createItem(formData);
      setSubmitStatus('success');
      setFormData(initialFormData);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create MRO item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-100">Create MRO Item</CardTitle>
      </CardHeader>
      <CardContent>
        {submitStatus && (
          <div className={`mb-4 p-4 rounded-md ${
            submitStatus === 'success' 
              ? 'bg-green-900/10 border border-green-500/50 text-green-200'
              : 'bg-red-900/10 border border-red-500/50 text-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {submitStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <p>
                {submitStatus === 'success'
                  ? 'MRO item created successfully'
                  : errorMessage || 'Failed to create MRO item'}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Customer
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Part Number
              </label>
              <input
                type="text"
                name="part_number"
                value={formData.part_number}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date Delivered
              </label>
              <input
                type="date"
                name="date_delivered"
                value={formData.date_delivered}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Expected Release Date
              </label>
              <input
                type="date"
                name="expected_release_date"
                value={formData.expected_release_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Progress
              </label>
              <select
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
              >
                {PROGRESS_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Work Requested
            </label>
            <textarea
              name="work_requested"
              value={formData.work_requested}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md text-gray-200"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 rounded-md text-white font-medium
                ${isSubmitting 
                  ? 'bg-blue-600/50 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 transition-colors'}
              `}
            >
              {isSubmitting ? 'Creating...' : 'Create MRO Item'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
