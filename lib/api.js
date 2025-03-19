// lib/api.js
import useSWR from 'swr';
import axios from 'axios';

// When running in development/production, api routes are available at /api
// No need to use port 5004 since we're using built-in Next.js API routes
const API_BASE_URL = '/api';

// Axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to avoid hanging requests
  timeout: 15000,
});

// Global fetcher function for SWR with improved error handling
const fetcher = async (url) => {
  try {
    console.log(`Fetching from: ${API_BASE_URL}${url}`);
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    // Provide more detailed error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API request error (no response):', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API error:', error.message);
    }
    
    // Re-throw the error for the component to handle
    throw error;
  }
};

// Hook for stats overview with caching
export function useStatsOverview() {
  const { data, error, isValidating, mutate } = useSWR('/stats/overview', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
    refreshInterval: 300000, // Refresh data every 5 minutes
    // Add error retry configuration
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    // Add fallback data
    fallbackData: {
      total_reports: 0,
      status_counts: {},
      waste_type_counts: {},
      avg_severity: 0,
      priority_counts: {},
      hotspot_count: 0,
      daily_reports: []
    }
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
    errorRetryCount: 3,
    fallbackData: { reports: [], hotspots: [] }
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
    errorRetryCount: 3,
    fallbackData: { reports: [], total: 0, page: 1, per_page: perPage, total_pages: 1 }
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
    errorRetryCount: 3,
    fallbackData: []
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
    errorRetryCount: 3,
    fallbackData: []
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
      errorRetryCount: 3,
      fallbackData: { hotspot: null, reports: [] }
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
    errorRetryCount: 3,
    fallbackData: { report_trends: [], waste_type_trends: [], priority_trends: [] }
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
    errorRetryCount: 3,
    fallbackData: []
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