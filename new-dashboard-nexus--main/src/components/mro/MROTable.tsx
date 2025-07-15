"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingCard } from "@/components/ui/loading-card";
import { CheckCircle, Clock, AlertTriangle, Wrench } from "lucide-react";
import { type Progress, type Category, type MROItem, CATEGORIES, getCategoryColor } from "../../../src/types/mro";
import { useMROData } from "@/hooks/useMROData";

type FilterCategory = Category | "ALL";
type SortField = keyof MROItem;
type SortDirection = 'asc' | 'desc';

export function MROTable() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("ALL");
  const [sortField, setSortField] = useState<SortField>('date_delivered');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { items, isLoading, error } = useMROData({
    category: selectedCategory === "ALL" ? undefined : selectedCategory
  });

  const sortedItems = [...items].sort((a, b) => {
    // Only allow sortField to be a key that exists on MROItem and is not subcategory
    let aValue: string = '';
    let bValue: string = '';
    switch (sortField) {
      case 'customer':
      case 'part_number':
      case 'description':
      case 'serial_number':
      case 'date_delivered':
      case 'work_requested':
      case 'progress':
      case 'location':
      case 'expected_release_date':
      case 'remarks':
      case 'category':
        aValue = a[sortField] ?? '';
        bValue = b[sortField] ?? '';
        break;
      default:
        aValue = '';
        bValue = '';
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (sortField === 'date_delivered' || sortField === 'expected_release_date') {
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    }
    return sortDirection === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const getStatusIcon = (progress: Progress) => {
    switch (progress) {
      case 'CLOSED':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'WIP':
      case 'ON PROGRESS':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'PENDING':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Wrench className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return <LoadingCard className="w-full" />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-900/10 rounded-md border border-red-500/50">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-300">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as FilterCategory)}
          className="px-3 py-1 bg-gray-900/50 border border-gray-700/50 rounded-md text-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Categories</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-md border border-gray-700/50 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('serial_number')}>
                Serial Number {getSortIndicator('serial_number')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('customer')}>
                Customer {getSortIndicator('customer')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('part_number')}>
                Part Number {getSortIndicator('part_number')}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                Category {getSortIndicator('category')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('progress')}>
                Status {getSortIndicator('progress')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('date_delivered')}>
                Delivered {getSortIndicator('date_delivered')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('expected_release_date')}>
                Expected Release {getSortIndicator('expected_release_date')}
              </TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-900/40 transition-colors">
                  <TableCell className="text-gray-300">{item.serial_number}</TableCell>
                  <TableCell className="text-gray-300">{item.customer}</TableCell>
                  <TableCell className="text-gray-300">{item.part_number}</TableCell>
                  <TableCell className="text-gray-300">
                    <div className="max-w-[200px] truncate" title={item.description}>
                      {item.description}
                    </div>
                  </TableCell>
                  <TableCell className={`font-medium ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.progress)}
                      <span className="text-gray-300">{item.progress}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(item.date_delivered).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(item.expected_release_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-300">{item.location}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-400 py-8">
                  No MRO items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
