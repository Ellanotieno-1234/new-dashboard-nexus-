'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import type { AviationPart, TableColumn, SortOptions } from '@/lib/types/aviation-parts';

interface PartsTableProps {
  parts: AviationPart[];
  onSort?: (options: SortOptions) => void;
}

// Utility function to safely convert any value to a renderable string
const renderValue = (value: AviationPart[keyof AviationPart]): string => {
  if (Array.isArray(value)) {
    return `${value.length} items`;
  }
  return String(value);
};

const PartsTable: React.FC<PartsTableProps> = ({ parts, onSort }) => {
  const [selectedPart, setSelectedPart] = useState<AviationPart | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof AviationPart | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const columns: TableColumn[] = [
    { key: 'requirementNumber', title: 'Req. Number', sortable: true },
    { key: 'worksOrder', title: 'Works Order', sortable: true },
    { key: 'aircraft', title: 'Aircraft', sortable: true },
    { key: 'partNumber', title: 'Part Number', sortable: true },
    { 
      key: 'priority', 
      title: 'Priority', 
      sortable: true,
      render: (value: unknown) => {
        const priorityValue = String(value);
        return (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`px-3 py-1 rounded-full text-sm ${
              priorityValue === 'High' ? 'status-high' :
              priorityValue === 'Medium' ? 'status-medium' :
              'status-low'
            }`}
          >
            {priorityValue}
          </motion.span>
        );
      }
    },
    { key: 'requiredQty', title: 'Required Qty', sortable: true },
  ];

  const handleSort = (column: keyof AviationPart) => {
    const newDirection = column === sortColumn && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.({ field: column, direction: newDirection });
  };

  const DetailsModal: React.FC<{ part: AviationPart }> = ({ part }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setSelectedPart(null)}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold gradient-text">Part Details</h2>
            <div className="flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors glass-input"
              >
                <Download size={20} className="text-white" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPart(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors glass-input"
              >
                <span className="text-white">×</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="glass-panel p-4">
                <h3 className="text-lg font-semibold text-white/90 border-b border-white/10 pb-2">
                  Basic Information
                </h3>
                <div className="space-y-3 mt-3">
                  <p><span className="text-white/60">Requirement Number:</span> <span className="text-white font-medium">{part.requirementNumber}</span></p>
                  <p><span className="text-white/60">Works Order:</span> <span className="text-white font-medium">{part.worksOrder}</span></p>
                  <p><span className="text-white/60">Aircraft:</span> <span className="text-white font-medium">{part.aircraft}</span></p>
                  <p><span className="text-white/60">Part Number:</span> <span className="text-white font-medium">{part.partNumber}</span></p>
                  <p><span className="text-white/60">Description:</span> <span className="text-white font-medium">{part.partDescription}</span></p>
                </div>
              </div>

              <div className="glass-panel p-4">
                <h3 className="text-lg font-semibold text-white/90 border-b border-white/10 pb-2">
                  Quantity Information
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="glass-input p-3 rounded-lg">
                    <p className="text-white/60 text-sm">Required</p>
                    <p className="text-white text-lg font-medium">{part.requiredQty}</p>
                  </div>
                  <div className="glass-input p-3 rounded-lg">
                    <p className="text-white/60 text-sm">Shortage</p>
                    <p className="text-white text-lg font-medium">{part.shortageQty}</p>
                  </div>
                  <div className="glass-input p-3 rounded-lg">
                    <p className="text-white/60 text-sm">On Order</p>
                    <p className="text-white text-lg font-medium">{part.onOrderQty}</p>
                  </div>
                  <div className="glass-input p-3 rounded-lg">
                    <p className="text-white/60 text-sm">On Pick</p>
                    <p className="text-white text-lg font-medium">{part.onPickQty}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="glass-panel p-4">
                <h3 className="text-lg font-semibold text-white/90 border-b border-white/10 pb-2">
                  Allocated Orders
                </h3>
                <div className="space-y-3 mt-3">
                  {part.allocatedOrders.map((order, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-input p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{order.orderNumber}</p>
                          <p className="text-white/60 text-sm">{order.orderSupplier}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{order.allocatedQuantity} units</p>
                          <p className="text-white/60 text-sm">by {order.orderCreatedBy}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-4">
                <h3 className="text-lg font-semibold text-white/90 border-b border-white/10 pb-2">
                  Additional Details
                </h3>
                <div className="space-y-3 mt-3">
                  <div className="glass-input p-3 rounded-lg">
                    <p className="text-white/60 text-sm">Authorization Status</p>
                    <p className={`text-lg font-medium ${
                      part.requirementAuthorised === 'Approved' ? 'text-green-400' :
                      part.requirementAuthorised === 'Pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{part.requirementAuthorised}</p>
                  </div>
                  <div className="glass-input p-3 rounded-lg">
                    <p className="text-white/60 text-sm">Value</p>
                    <p className="text-white text-lg font-medium">{part.value}</p>
                  </div>
                  <div className="glass-input p-3 rounded-lg">
                    <p className="text-white/60 text-sm">Created Date</p>
                    <p className="text-white text-lg font-medium">{part.createdDate}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-sm font-medium text-white/70"
                >
                  <button
                    className={`flex items-center space-x-2 ${column.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span className={`
                        ${sortColumn === column.key ? 'opacity-100' : 'opacity-50'}
                        ${sortColumn === column.key && sortDirection === 'desc' ? 'rotate-180' : ''}
                      `}>
                        {sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {parts.map((part, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-white/5 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-white">
                    {column.render
                      ? column.render(part[column.key], part)
                      : renderValue(part[column.key])
                    }
                  </td>
                ))}
                <td className="px-4 py-3 text-sm">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPart(part)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors glass-input"
                  >
                    <span className="text-white">...</span>
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedPart && <DetailsModal part={selectedPart} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default PartsTable;
