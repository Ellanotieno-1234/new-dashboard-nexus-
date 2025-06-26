"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingCard } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Activity,
  Settings,
} from "lucide-react";
import { fetchMROItems } from "@/lib/api";
import { type Progress, type Category, CATEGORIES } from "@/types/mro";

interface MROItem {
  id: string;
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
  subcategory?: string;
  sheet_name?: string;
}

export function MROTable() {
  const [items, setItems] = useState<MROItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortLoading, setSortLoading] = useState(false);
  const [clearingSearch, setClearingSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('[placeholder="Search items..."]');
        if (searchInput) searchInput.focus();
      }
      // Escape to clear search
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof MROItem;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    loadMROItems();
  }, []);

  const sortItems = (items: MROItem[]) => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      if (sortConfig.key === 'date_delivered' || sortConfig.key === 'expected_release_date') {
        const aDate = new Date(a[sortConfig.key]);
        const bDate = new Date(b[sortConfig.key]);
        if (sortConfig.direction === 'asc') {
          return aDate.getTime() - bDate.getTime();
        }
        return bDate.getTime() - aDate.getTime();
      }
      return 0;
    });
  };

  const handleSort = async (key: keyof MROItem) => {
    setSortLoading(true);
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    // Artificial delay to show sorting animation
    await new Promise(resolve => setTimeout(resolve, 300));
    setSortLoading(false);
  };

  const handleClearSearch = async () => {
    setClearingSearch(true);
    // Artificial delay to show clearing animation
    await new Promise(resolve => setTimeout(resolve, 200));
    setSearchQuery('');
    setClearingSearch(false);
  };

  const filteredItems = items.filter(item => {
    // Category filter
    if (selectedCategory && item.category !== selectedCategory) {
      return false;
    }
    
    // Subcategory filter
    if (selectedSubcategory && item.subcategory !== selectedSubcategory) {
      return false;
    }

    // Search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.customer?.toLowerCase() || '').includes(query) ||
      (item.part_number?.toLowerCase() || '').includes(query) ||
      (item.description?.toLowerCase() || '').includes(query) ||
      (item.serial_number?.toLowerCase() || '').includes(query) ||
      (item.progress?.toLowerCase() || '').includes(query) ||
      (item.category?.toLowerCase() || '').includes(query) ||
      (item.subcategory?.toLowerCase() || '').includes(query) ||
      (item.sheet_name?.toLowerCase() || '').includes(query) ||
      (item.work_requested?.toLowerCase() || '').includes(query) ||
      (item.remarks?.toLowerCase() || '').includes(query)
    );
  });

  const sortedItems = sortItems(filteredItems);

  const loadMROItems = async () => {
    try {
      const data = await fetchMROItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching MRO items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const getProgressBadgeStyles = (progress: Progress) => {
    switch (progress) {
      case 'CLOSED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'WIP':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ON PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryStyles = (category: Category) => {
    switch (category) {
      case 'ALL WIP COMP':
        return 'text-gray-600';
      case 'MECHANICAL':
        return 'text-blue-600';
      case 'SAFETY COMPONENTS':
        return 'text-red-600';
      case 'AVIONICS MAIN':
      case 'Avionics Shop':
        return 'text-indigo-600';
      case 'PLANT AND EQUIPMENTS':
        return 'text-green-600';
      case 'BATTERY':
      case 'Battery Shop':
        return 'text-yellow-600';
      case 'CALIBRATION':
      case 'Cal lab':
        return 'text-orange-600';
      case 'UPH Shop':
        return 'text-pink-600';
      case 'Structures Shop':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <div className="flex items-center gap-2 px-2 py-1.5 border rounded-lg bg-white">
            <Activity className={`w-4 h-4 transition-all duration-200 ${loading ? 'text-blue-500 animate-spin' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search items... (Ctrl+F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                className={`p-1 hover:bg-gray-100 rounded-full transition-colors ${clearingSearch ? 'animate-spin' : ''}`}
                title="Clear search (Esc)"
              >
                <AlertTriangle className="w-3 h-3 text-gray-400 rotate-45" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white text-gray-600'}`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value as Category || null)}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-gray-700">Subcategory</label>
            <select
              value={selectedSubcategory || ""}
              onChange={(e) => setSelectedSubcategory(e.target.value || null)}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="">All Subcategories</option>
              <option value="MAIN">Main</option>
              <option value="SHOP">Shop</option>
              <option value="LAB">Lab</option>
            </select>
          </div>

          {(selectedCategory || selectedSubcategory) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
              className="self-end px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <AlertTriangle className="w-4 h-4 rotate-45" />
            </button>
          )}
        </div>
      )}
      
      {searchQuery && (
        <div className="text-sm text-gray-500">
          Found {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </div>
      )}
      
      <div className="w-full overflow-auto">
        {sortedItems.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <Activity className="w-8 h-8 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium">No items found matching "{searchQuery}"</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search term</p>
          </div>
        )}
        
        {sortedItems.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-100/50">
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Part Number</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Serial Number</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort('date_delivered')}
                  >
                    Date Delivered
                    <Activity 
                      className={`w-4 h-4 transition-all ${
                        sortLoading && sortConfig?.key === 'date_delivered' ? 'animate-spin' :
                        sortConfig?.key === 'date_delivered' 
                          ? 'text-blue-600 ' + (sortConfig.direction === 'desc' ? 'rotate-180' : '') 
                          : ''
                      }`}
                    />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Work Requested</TableHead>
                <TableHead className="font-semibold">Progress</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold whitespace-nowrap">
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort('expected_release_date')}
                  >
                    Expected Release
                    <Activity 
                      className={`w-4 h-4 transition-all ${
                        sortLoading && sortConfig?.key === 'expected_release_date' ? 'animate-spin' :
                        sortConfig?.key === 'expected_release_date' 
                          ? 'text-blue-600 ' + (sortConfig.direction === 'desc' ? 'rotate-180' : '') 
                          : ''
                      }`}
                    />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Remarks</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Subcategory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow 
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <TableCell className="font-medium">{item.customer}</TableCell>
                  <TableCell className="font-mono">{item.part_number}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                  <TableCell className="font-mono">{item.serial_number}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.date_delivered}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.work_requested}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-sm border ${getProgressBadgeStyles(item.progress)}`}>
                      {item.progress}
                    </span>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.expected_release_date}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.remarks}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getCategoryStyles(item.category)}`}>
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.subcategory && (
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        {item.subcategory}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
