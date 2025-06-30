import React, { useState } from 'react';
import JobTrackerUploader from '../../../components/mro/JobTrackerUploader';

const JobTrackerPage = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const handleUploadSuccess = (result: any) => {
    // Expecting result to have { columns: string[], data: any[] }
    setColumns(result.columns || []);
    setTableData(result.data || []);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">MRO Job Tracker</h1>
      <div className="mb-6">
        <p>Upload your job tracker Excel file to view and manage job data.</p>
        <JobTrackerUploader onUploadSuccess={handleUploadSuccess} />
      </div>
      <div>
        {tableData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-2 py-1 border-b border-r text-xs font-semibold bg-gray-100">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col} className="px-2 py-1 border-b border-r text-xs">{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No data loaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default JobTrackerPage; 