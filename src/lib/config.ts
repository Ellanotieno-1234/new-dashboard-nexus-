export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://new-dashboard-nexus.onrender.com';

// Only warn in development if the environment variable is not set
if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn('NEXT_PUBLIC_API_URL environment variable is not set, using default: https://new-dashboard-nexus.onrender.com');
}
