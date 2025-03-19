// lib/api.js
import useSWR from 'swr';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004/api';

// Axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global fetcher function for SWR
const fetcher = async (url) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

// Hook for stats overview with caching
export function useStatsOverview() {
  const { data, error, isValidating, mutate } = useSWR('/stats/overview', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
    refreshInterval: 300000, // Refresh data every 5 minutes
  });

  return {
    statsData: data,
    isLoading: isValidating && !data,
    isError: error,
    refresh: () => mutate(),
  };
}

// Hook for map data with caching
export function useMapData(filters = {}) {
  // Create query string from filters
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  const queryString = queryParams.toString();
  const url = `/map/reports${queryString ? `?${queryString}` : ''}`;
  
  const { data, error, isValidating, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
    refreshInterval: 300000,
  });

  return {
    mapData: data,
    isLoading: isValidating && !data,
    isError: error,
    refresh: () => mutate(),
  };
}

// Hook for reports with pagination and filtering
export function useReports(page = 1, perPage = 10, filters = {}) {
  const queryParams = new URLSearchParams({ page, per_page: perPage });
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  const url = `/reports?${queryParams.toString()}`;
  
  const { data, error, isValidating, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
  });

  return {
    reportsData: data,
    isLoading: isValidating && !data,
    isError: error,
    refresh: () => mutate(),
  };
}

// Hook for waste types with long caching
export function useWasteTypes() {
  const { data, error, isValidating, mutate } = useSWR('/waste-types', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 3600000, // Cache for 1 hour (waste types change infrequently)
  });

  return {
    wasteTypes: data,
    isLoading: isValidating && !data,
    isError: error,
    refresh: () => mutate(),
  };
}

// Hook for hotspots
export function useHotspots() {
  const { data, error, isValidating, mutate } = useSWR('/hotspots', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
    refreshInterval: 300000,
  });

  return {
    hotspots: data,
    isLoading: isValidating && !data,
    isError: error,
    refresh: () => mutate(),
  };
}

// Hook for hotspot reports
export function useHotspotReports(hotspotId) {
  const { data, error, isValidating, mutate } = useSWR(
    hotspotId ? `/hotspots/${hotspotId}/reports` : null, // Only fetch if we have an ID
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    hotspotReports: data,
    isLoading: isValidating && !data,
    isError: error,
    refresh: () => mutate(),
  };
}

// Hook for trends
export function useTrends(period = 'daily', days = 30) {
  const url = `/stats/trends?period=${period}&days=${days}`;
  
  const { data, error, isValidating, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
    refreshInterval: 300000,
  });

  return {
    trendData: data,
    isLoading: isValidating && !data,
    isError: error,
    refresh: () => mutate(),
  };
}

// Hook for location stats
export function useLocationStats() {
  const { data, error, isValidating, mutate } = useSWR('/stats/by-location', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
    refreshInterval: 300000,
  });

  return {
    locationStats: data,
    isLoading: isValidating && !data,
    isError: error,
    refresh: () => mutate(),
  };
}

// Function for direct API calls (when hooks aren't suitable)
export async function fetchAPI(endpoint, params = {}) {
  try {
    const queryParams = new URLSearchParams(params);
    const url = `${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(`API error: ${endpoint}`, error);
    throw error;
  }
}