"use client"

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadJobTrackerFile } from '@/lib/api';

interface JobTrackerUploaderProps {
  onUploadSuccess: (data: any) => void;
}

const JobTrackerUploader: React.FC<JobTrackerUploaderProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setError(null);
    setSuccess(null);
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      setError('Please upload an Excel or CSV file (.xlsx, .xls, .csv)');
      return;
    }
    try {
      setUploading(true);
      const result = await uploadJobTrackerFile(file);
      setSuccess('Successfully uploaded job tracker file');
      onUploadSuccess(result);
    } catch (err) {
      setError('Failed to upload job tracker file. Please ensure the file format is correct and try again.');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-gray-600">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the file here</p>
        ) : (
          <div>
            <p className="text-gray-600">Drag and drop a file here, or click to select</p>
            <p className="text-sm text-gray-500 mt-2">Supported formats: .xlsx, .xls, .csv</p>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-500">{success}</p>}
    </div>
  );
};

export default JobTrackerUploader; 