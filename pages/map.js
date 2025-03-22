// pages/map.js
import { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useMapData, useWasteTypes } from "../lib/api";
import {
  RefreshCw,
  Filter,
  ChevronDown,
  Map as MapIcon,
  Layers,
  Calendar,
  Clock,
  AlertTriangle,
  Trash2,
  X,
  Info,
} from "lucide-react";
import ModernLayout from "../components/ModernLayout";

// Dynamically import map component to prevent SSR issues
const DynamicMap = dynamic(() => import("../components/ModernMap"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-[calc(100vh-200px)] bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
      <p className="text-emerald-600 font-medium text-lg">Loading map...</p>
    </div>
  ),
});

export default function ModernMapPage() {
  // State for filters and UI
  const [filters, setFilters] = useState({
    status: "",
    waste_type: "",
    priority: "",
    days: 30,
    showHotspots: true,
    showReports: true,
    severity: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeView, setActiveView] = useState("all"); // 'all', 'reports', 'hotspots'
  const [mapStats, setMapStats] = useState({
    totalReports: 0,
    totalHotspots: 0,
    highSeverity: 0,
  });

  // Get data from API
  const { wasteTypes, isLoading: wasteTypesLoading } = useWasteTypes();
  const {
    mapData,
    isLoading,
    isError,
    refresh: refreshMap,
  } = useMapData(filters);

  // Update map stats when data changes
  useEffect(() => {
    if (mapData) {
      setMapStats({
        totalReports: mapData.reports?.length || 0,
        totalHotspots: mapData.hotspots?.length || 0,
        highSeverity: (mapData.reports || []).filter(
          (r) => r.severity_score > 7
        ).length,
      });
    }
  }, [mapData]);

  // Handle filter changes
  function handleFilterChange(field, value) {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Apply all filters at once
  function applyFilters() {
    // Already done through state
    setShowFilters(false);
  }

  // Clear all filters
  function clearFilters() {
    setFilters({
      status: "",
      waste_type: "",
      priority: "",
      days: 30,
      showHotspots: true,
      showReports: true,
      severity: "",
    });
  }

  // Function to refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshMap();
    } catch (error) {
      console.error("Error refreshing map data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle view toggle
  function handleViewToggle(view) {
    setActiveView(view);

    if (view === "all") {
      handleFilterChange("showReports", true);
      handleFilterChange("showHotspots", true);
    } else if (view === "reports") {
      handleFilterChange("showReports", true);
      handleFilterChange("showHotspots", false);
    } else if (view === "hotspots") {
      handleFilterChange("showReports", false);
      handleFilterChange("showHotspots", true);
    }
  }

  // Helper function to format large numbers
  function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  }

  return (
    <ModernLayout>
      <Head>
        <title>Waste Map | TL Waste Monitoring Dashboard</title>
        <meta
          name="description"
          content="Interactive waste map for Timor-Leste"
        />
      </Head>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <MapIcon className="w-5 h-5 mr-2 text-emerald-600" />
              Waste Map
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Visualize waste reports and hotspots
            </p>
          </div>

          {/* Map Controls */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Map View</h2>
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => handleViewToggle("all")}
                className={`flex-1 py-1.5 px-2 text-sm font-medium rounded-md ${
                  activeView === "all"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-700 hover:text-emerald-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleViewToggle("reports")}
                className={`flex-1 py-1.5 px-2 text-sm font-medium rounded-md ${
                  activeView === "reports"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-700 hover:text-emerald-700"
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => handleViewToggle("hotspots")}
                className={`flex-1 py-1.5 px-2 text-sm font-medium rounded-md ${
                  activeView === "hotspots"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-700 hover:text-emerald-700"
                }`}
              >
                Hotspots
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex w-full items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-4"
            >
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
              className="flex w-full items-center justify-center gap-2 px-3 py-2 bg-emerald-600 border border-transparent rounded-lg text-white hover:bg-emerald-700 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh Map"}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="p-4 border-b border-gray-200 overflow-y-auto">
              <h2 className="text-sm font-medium text-gray-700 mb-3">
                Filter Map Data
              </h2>

              {/* Status Filter */}
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="analyzing">Analyzing</option>
                  <option value="analyzed">Analyzed</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Waste Type Filter */}
              <div className="mb-4">
                <label
                  htmlFor="waste_type"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Waste Type
                </label>
                <select
                  id="waste_type"
                  value={filters.waste_type}
                  onChange={(e) =>
                    handleFilterChange("waste_type", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All Waste Types</option>
                  {wasteTypes &&
                    wasteTypes.map((type) => (
                      <option key={type.waste_type_id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="mb-4">
                <label
                  htmlFor="priority"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div className="mb-4">
                <label
                  htmlFor="severity"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Severity
                </label>
                <select
                  id="severity"
                  value={filters.severity}
                  onChange={(e) =>
                    handleFilterChange("severity", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All Severities</option>
                  <option value="high">High (7-10)</option>
                  <option value="medium">Medium (4-7)</option>
                  <option value="low">Low (1-4)</option>
                </select>
              </div>

              {/* Time Range Filter */}
              <div className="mb-4">
                <label
                  htmlFor="days"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Time Range
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="days"
                    name="days"
                    value={filters.days}
                    onChange={(e) =>
                      handleFilterChange("days", parseInt(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded-lg py-1.5 pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                    <option value="0">All time</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={clearFilters}
                  className="py-1.5 px-3 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="py-1.5 px-3 bg-emerald-600 border border-transparent rounded-lg text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Map Stats */}
          <div className="p-4 mt-auto border-t border-gray-200">
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Map Statistics
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-600">Reports</span>
                </div>
                <span className="text-sm font-semibold">
                  {formatNumber(mapStats.totalReports)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-3">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-600">Hotspots</span>
                </div>
                <span className="text-sm font-semibold">
                  {formatNumber(mapStats.totalHotspots)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mr-3">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-600">High Severity</span>
                </div>
                <span className="text-sm font-semibold">
                  {formatNumber(mapStats.highSeverity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Map Content */}
        <div className="flex-1 relative">
          {/* Refreshing indicator */}
          {refreshing && (
            <div className="absolute top-4 right-4 z-10 bg-white border border-gray-200 rounded-lg p-3 flex items-center shadow-md">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 mr-3"></div>
              <span className="text-sm text-gray-700">
                Refreshing map data...
              </span>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="absolute top-4 right-4 z-10 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center shadow-md max-w-md">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading map data. Please try again.
                </p>
                <button
                  onClick={handleRefresh}
                  className="mt-1 text-xs font-medium text-red-700 hover:text-red-600 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 z-10 bg-white border border-gray-200 rounded-lg p-3 shadow-md">
            <div className="flex items-center mb-1">
              <Info className="w-4 h-4 text-gray-500 mr-1" />
              <h3 className="text-xs font-medium text-gray-700">Map Legend</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-xs text-gray-600">Resolved</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-xs text-gray-600">Pending</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                <span className="text-xs text-gray-600">Analyzing</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                <span className="text-xs text-gray-600">High Severity</span>
              </div>
              <div className="flex items-center col-span-2 mt-1">
                <span className="w-3 h-3 rounded-full border border-dashed border-red-500 mr-2"></span>
                <span className="text-xs text-gray-600">Hotspot Zone</span>
              </div>
            </div>
          </div>

          {/* The Map */}
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-full bg-gray-50">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mb-4"></div>
              <p className="text-emerald-600 font-medium text-lg">
                Loading map data...
              </p>
              <p className="text-gray-500 mt-2">
                Please wait while we fetch the latest reports
              </p>
            </div>
          ) : (
            <DynamicMap data={mapData} />
          )}
        </div>
      </div>
    </ModernLayout>
  );
}
