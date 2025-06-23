// Mock data for demonstration
const mockInventory = [
  {
    id: "1",
    name: "Hydraulic Pump",
    quantity: 15,
    status: "In Stock",
    lastUpdated: "2025-06-21T10:00:00Z"
  },
  {
    id: "2",
    name: "Filter Assembly",
    quantity: 5,
    status: "Low Stock",
    lastUpdated: "2025-06-20T15:30:00Z"
  },
  {
    id: "3",
    name: "Control Valve",
    quantity: 0,
    status: "Out of Stock",
    lastUpdated: "2025-06-19T09:15:00Z"
  }
];

// Simulating an API call with a delay
export async function fetchInventory() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockInventory;
}

export async function fetchOrders() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockInventory; // Using same data for now
}

export async function fetchAnalytics() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    totalItems: mockInventory.length,
    lowStockItems: mockInventory.filter(item => item.status === "Low Stock").length,
    outOfStock: mockInventory.filter(item => item.status === "Out of Stock").length
  };
}
