// pages/map.js
import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMapData, useWasteTypes, fetchAPI } from "../lib/api";
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
  Menu,
  ChevronLeft,
  Crosshair,
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
  const router = useRouter();
  const { report: reportId } = router.query;

  // State for single report focus
  const [focusedReport, setFocusedReport] = useState(null);
  const [isFetchingReport, setIsFetchingReport] = useState(false);

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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
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

  // Fetch specific report if ID is provided in URL
  useEffect(() => {
    if (reportId && !isLoading) {
      setIsFetchingReport(true);
      fetchAPI(`/reports/${reportId}`)
        .then((data) => {
          setFocusedReport(data);
          setIsFetchingReport(false);
        })
        .catch((err) => {
          console.error("Error fetching report:", err);
          setIsFetchingReport(false);
        });
    }
  }, [reportId, isLoading]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const sidebar = document.getElementById("mobile-sidebar");
      if (
        showMobileSidebar &&
        sidebar &&
        !sidebar.contains(e.target) &&
        !e.target.closest(".mobile-menu-button")
      ) {
        setShowMobileSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileSidebar]);

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
    // Close mobile sidebar on small screens
    if (window.innerWidth < 768) {
      setShowMobileSidebar(false);
    }
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

      // Re-fetch focused report if needed
      if (reportId) {
        try {
          const data = await fetchAPI(`/reports/${reportId}`);
          setFocusedReport(data);
        } catch (err) {
          console.error("Error re-fetching report:", err);
        }
      }
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

  // Clear focused report
  function clearFocusedReport() {
    setFocusedReport(null);
    // Remove report param from URL without page refresh
    router.push("/map", undefined, { shallow: true });
  }

  // Helper function to format large numbers
  function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  }

  // Prepare map data with focused report highlighted
  const enhancedMapData = React.useMemo(() => {
    if (!mapData) return null;

    if (!focusedReport) return mapData;

    // For highlighting the specific report, we need to ensure it's in the dataset
    // First, check if the focused report is already in the reports list
    const reportExists = mapData.reports.some(
      (r) => r.report_id === parseInt(reportId)
    );

    if (reportExists) {
      // Mark the focused report
      return {
        ...mapData,
        reports: mapData.reports.map((report) => ({
          ...report,
          isFocused: report.report_id === parseInt(reportId),
        })),
      };
    } else if (focusedReport) {
      // Add the focused report to the map data
      return {
        ...mapData,
        reports: [...mapData.reports, { ...focusedReport, isFocused: true }],
      };
    }

    return mapData;
  }, [mapData, focusedReport, reportId]);

  // Sidebar content component to reuse in both desktop and mobile views
  const SidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <MapIcon className="w-5 h-5 mr-2 text-emerald-600" />
            Waste Map
          </h1>
          {showMobileSidebar && (
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="md:hidden p-1 rounded-full hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Visualize waste reports and hotspots
        </p>
      </div>

      {/* Focused Report Notice */}
      {focusedReport && (
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-blue-800 mb-1">
                Viewing Report #{reportId}
              </h2>
              <p className="text-xs text-blue-600">
                {focusedReport.waste_type || "Unknown waste type"} -{" "}
                {focusedReport.status}
              </p>
            </div>
            <button
              onClick={clearFocusedReport}
              className="text-blue-600 hover:text-blue-800 p-1"
              aria-label="Clear focused report"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
              onChange={(e) => handleFilterChange("waste_type", e.target.value)}
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
              onChange={(e) => handleFilterChange("priority", e.target.value)}
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
              onChange={(e) => handleFilterChange("severity", e.target.value)}
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
    </>
  );

  return (
    <ModernLayout>
      <Head>
        <title>
          {focusedReport
            ? `Report #${reportId} | Waste Map`
            : `Waste Map | TL Waste Monitoring Dashboard`}
        </title>
        <meta
          name="description"
          content="Interactive waste map for Timor-Leste"
        />
      </Head>

      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center p-3 border-b border-gray-200 bg-white">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="mobile-menu-button flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
            aria-label="Open map controls"
          >
            <Menu className="w-5 h-5" />
            <span>Map Controls</span>
          </button>

          {/* Show focused report info on mobile */}
          {focusedReport && (
            <div className="ml-3 flex-1 flex items-center">
              <div className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-full">
                Report #{reportId}
              </div>
              <button
                onClick={clearFocusedReport}
                className="ml-2 text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div
            className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-20"
            onClick={() => setShowMobileSidebar(false)}
          ></div>
        )}

        {/* Sidebar - Desktop (always visible) and Mobile (slide in) */}
        <div
          id="mobile-sidebar"
          className={`${
            showMobileSidebar
              ? "fixed inset-y-0 left-0 translate-x-0"
              : "fixed inset-y-0 left-0 -translate-x-full md:translate-x-0 md:relative"
          } md:w-72 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm z-30 transition-transform duration-300 ease-in-out w-3/4 max-w-xs`}
        >
          <SidebarContent />
        </div>

        {/* Main Map Content */}
        <div className="flex-1 relative">
          {/* Refreshing indicator */}
          {(refreshing || isFetchingReport) && (
            <div className="absolute top-4 right-4 z-10 bg-white border border-gray-200 rounded-lg p-3 flex items-center shadow-md">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 mr-3"></div>
              <span className="text-sm text-gray-700">
                {refreshing ? "Refreshing map data..." : "Loading report..."}
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

          {/* Focused Report Indicator - for desktop */}
          {focusedReport && !isLoading && (
            <div className="hidden md:block absolute top-4 left-4 z-10 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-md max-w-xs">
              <div className="flex items-start">
                <Crosshair className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">
                    Report #{reportId}
                  </h3>
                  <p className="text-xs text-blue-600 mt-1">
                    {focusedReport.waste_type || "Unknown waste type"} -{" "}
                    {focusedReport.status}
                  </p>
                  <button
                    onClick={clearFocusedReport}
                    className="mt-2 text-xs text-blue-700 hover:text-blue-900 font-medium"
                  >
                    Clear Focus
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Quick Stats - Visible only on mobile */}
          <div className="md:hidden absolute top-4 left-4 z-10 bg-white border border-gray-200 rounded-lg p-2 shadow-md">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="px-2 py-1">
                <div className="font-semibold">
                  {formatNumber(mapStats.totalReports)}
                </div>
                <div className="text-gray-500">Reports</div>
              </div>
              <div className="px-2 py-1 border-l border-r border-gray-200">
                <div className="font-semibold">
                  {formatNumber(mapStats.totalHotspots)}
                </div>
                <div className="text-gray-500">Hotspots</div>
              </div>
              <div className="px-2 py-1">
                <div className="font-semibold">
                  {formatNumber(mapStats.highSeverity)}
                </div>
                <div className="text-gray-500">High Sev.</div>
              </div>
            </div>
          </div>

          {/* Map Legend - Repositioned for mobile */}
          <div className="absolute bottom-4 right-4 z-10 bg-white border border-gray-200 rounded-lg p-3 shadow-md max-w-[150px] md:max-w-none">
            <div className="flex items-center mb-1">
              <Info className="w-4 h-4 text-gray-500 mr-1" />
              <h3 className="text-xs font-medium text-gray-700">Map Legend</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-2">
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
              {focusedReport && (
                <div className="flex items-center col-span-1 md:col-span-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-white shadow-md mr-2"></span>
                  <span className="text-xs text-gray-600">Focused Report</span>
                </div>
              )}
              <div className="flex items-center col-span-1 md:col-span-2 mt-1">
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
            <DynamicMap
              data={enhancedMapData}
              focusedReportId={reportId ? parseInt(reportId) : null}
            />
          )}
        </div>
      </div>
    </ModernLayout>
  );
}
