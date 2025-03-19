// pages/reports.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useReports, useWasteTypes } from '../lib/api';
import { 
  RefreshCw, 
  Filter, 
  ChevronDown, 
  Search, 
  X, 
  Calendar, 
  FileText, 
  MapPin,
  Info,
  ArrowUpRight
} from 'lucide-react';
import ModernLayout from '../components/ModernLayout';
import ModernPagination from '../components/ModernPagination';

export default function PublicReportsPage() {
  // State for filters, pagination, and UI states
  const [filters, setFilters] = useState({
    status: '',
    waste_type: '',
    severity: '',
    searchTerm: '',
    fromDate: '',
    toDate: ''
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'report_date', direction: 'desc' });

  // Get waste types and reports with SWR
  const { wasteTypes, isLoading: wasteTypesLoading } = useWasteTypes();
  const { 
    reportsData, 
    isLoading: reportsLoading, 
    isError: reportsError, 
    refresh: refreshReports 
  } = useReports(page, perPage, filters);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Handle filter changes
  function handleFilterChange(field, value) {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }

  // Apply all filters at once
  function applyFilters() {
    // Already applied through the state
    setShowFilters(false);
  }

  // Clear all filters
  function clearFilters() {
    setFilters({
      status: '',
      waste_type: '',
      severity: '',
      searchTerm: '',
      fromDate: '',
      toDate: ''
    });
    setShowFilters(false);
  }

  // Handle page changes
  function handlePageChange(newPage) {
    setPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  }
  
  // Function to refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshReports();
    } catch (error) {
      console.error("Error refreshing reports:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle sorting
  function handleSort(key) {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  // Format date for display
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Compute values from reports data
  const reports = reportsData?.reports || [];
  const total = reportsData?.total || 0;
  const totalPages = reportsData?.total_pages || 1;

  // Generate severity badge
  const getSeverityBadge = (score) => {
    if (!score) return null;
    
    let bgColor, textColor;
    if (score > 7) {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
    } else if (score > 4) {
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
    } else {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {score}/10
      </span>
    );
  };

  // Generate status badge
  const getStatusBadge = (status) => {
    let bgColor, textColor, statusText;
    
    switch (status) {
      case 'resolved':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        statusText = 'Resolved';
        break;
      case 'analyzed':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        statusText = 'Analyzed';
        break;
      case 'analyzing':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        statusText = 'Analyzing';
        break;
      case 'rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        statusText = 'Rejected';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        statusText = 'Pending';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {statusText}
      </span>
    );
  };

  return (
    <ModernLayout>
      <Head>
        <title>Waste Reports | TL Waste Monitoring</title>
        <meta name="description" content="Public waste reports in Timor-Leste" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Waste Reports
            </h1>
            <p className="text-gray-600">
              View waste incident reports from across Timor-Leste
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 border border-transparent rounded-lg text-white hover:bg-emerald-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search box */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Search reports by ID, location, or type..."
            />
            {filters.searchTerm && (
              <button
                onClick={() => handleFilterChange('searchTerm', '')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 transition-all duration-300 ease-in-out">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Status Filter */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
              <div>
                <label htmlFor="waste_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Waste Type
                </label>
                <select
                  id="waste_type"
                  value={filters.waste_type}
                  onChange={(e) => handleFilterChange('waste_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All Waste Types</option>
                  {wasteTypes && wasteTypes.map(type => (
                    <option key={type.waste_type_id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Severity Filter */}
              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  id="severity"
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">All Severities</option>
                  <option value="high">High (7-10)</option>
                  <option value="medium">Medium (4-7)</option>
                  <option value="low">Low (1-4)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Date Range Filters */}
              <div>
                <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="fromDate"
                    value={filters.fromDate}
                    onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <div className="relative rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="toDate"
                    value={filters.toDate}
                    onChange={(e) => handleFilterChange('toDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={clearFilters}
                className="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="py-2 px-4 bg-emerald-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Refreshing indicator */}
        {refreshing && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 flex items-center shadow-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 mr-3"></div>
            <span className="text-sm text-emerald-700">Refreshing reports data...</span>
          </div>
        )}

        {/* Error state */}
        {reportsError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error loading reports data. Please try again.</p>
                <button 
                  onClick={handleRefresh} 
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="text-sm text-gray-600 mb-3 sm:mb-0">
            Showing <span className="font-medium">{reports.length}</span> of <span className="font-medium">{total}</span> total reports
            {Object.values(filters).some(f => f) && (
              <button 
                onClick={clearFilters}
                className="ml-2 text-emerald-600 hover:text-emerald-800 underline text-xs"
              >
                Clear filters
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-lg py-1.5 px-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {/* Reports table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {reportsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : reports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('report_id')}
                    >
                      <div className="flex items-center">
                        ID
                        {sortConfig.key === 'report_id' && (
                          <svg className={`ml-1 w-4 h-4 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('report_date')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortConfig.key === 'report_date' && (
                          <svg className={`ml-1 w-4 h-4 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortConfig.key === 'status' && (
                          <svg className={`ml-1 w-4 h-4 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('waste_type')}
                    >
                      <div className="flex items-center">
                        Waste Type
                        {sortConfig.key === 'waste_type' && (
                          <svg className={`ml-1 w-4 h-4 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('severity_score')}
                    >
                      <div className="flex items-center">
                        Severity
                        {sortConfig.key === 'severity_score' && (
                          <svg className={`ml-1 w-4 h-4 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.report_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                        #{report.report_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(report.report_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.waste_type || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSeverityBadge(report.severity_score)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        {report.latitude && !isNaN(report.latitude) ? (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                            <span>
                              {parseFloat(report.latitude).toFixed(4)}, {parseFloat(report.longitude).toFixed(4)}
                            </span>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          href={`/map?report=${report.report_id}`}
                          className="text-emerald-600 hover:text-emerald-800 inline-flex items-center"
                        >
                          View on Map
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-emerald-500 mb-4">
                <FileText className="w-16 h-16 opacity-20" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
              <p className="text-gray-500 mb-6">
                {Object.values(filters).some(f => f) 
                  ? 'Try adjusting your filters to see more results' 
                  : 'There are no waste reports in the system yet'}
              </p>
              <Link 
                href="/map"
                className="px-4 py-2 bg-emerald-600 border border-transparent rounded-lg text-white hover:bg-emerald-700 transition-colors"
              >
                View Map
              </Link>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <ModernPagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
        
        {/* Reports insights */}
        {reports.length > 0 && (
          <div className="mt-10 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Reports Overview</h2>
              <p className="mt-1 text-sm text-gray-500">Quick summary of waste reports in Timor-Leste</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <h3 className="text-sm font-medium text-emerald-800 mb-1">Status Breakdown</h3>
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Resolved</span>
                    <span className="text-sm font-medium text-gray-900">
                      {reports.filter(r => r.status === 'resolved').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Analyzing</span>
                    <span className="text-sm font-medium text-gray-900">
                      {reports.filter(r => r.status === 'analyzing').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="text-sm font-medium text-gray-900">
                      {reports.filter(r => r.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Average Severity</h3>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-gray-900">
                    {reports
                      .filter(r => r.severity_score)
                      .reduce((avg, r, _, { length }) => {
                        return avg + parseFloat(r.severity_score) / length;
                      }, 0)
                      .toFixed(1)}
                    <span className="text-sm font-normal text-gray-500 ml-1">/10</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Based on {reports.filter(r => r.severity_score).length} reports with severity scores
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <h3 className="text-sm font-medium text-amber-800 mb-1">Report Timeline</h3>
                <div className="mt-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last 7 days</span>
                      <span className="text-sm font-medium text-gray-900">
                        {reports.filter(r => {
                          const reportDate = new Date(r.report_date);
                          const sevenDaysAgo = new Date();
                          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                          return reportDate >= sevenDaysAgo;
                        }).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last 30 days</span>
                      <span className="text-sm font-medium text-gray-900">
                        {reports.filter(r => {
                          const reportDate = new Date(r.report_date);
                          const thirtyDaysAgo = new Date();
                          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                          return reportDate >= thirtyDaysAgo;
                        }).length}
                      </span>
                    </div>
                  </div>
                  <Link 
                    href="/" 
                    className="mt-3 text-sm text-amber-700 hover:text-amber-800 flex items-center"
                  >
                    View dashboard
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Public Information Section */}
        <div className="mt-10 bg-white rounded-xl shadow-sm p-6 border-t-4 border-emerald-500">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About Waste Reporting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Understanding Waste Reports</h3>
              <p className="text-gray-600 mb-4">
                Waste reports are submitted by community members, environmental officers, and partner organizations. 
                Each report documents instances of improper waste disposal, potential environmental hazards, or areas 
                that need attention from waste management authorities.
              </p>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Report Status Explained</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li><span className="font-medium">Pending</span>: Recently submitted and awaiting initial review</li>
                <li><span className="font-medium">Analyzing</span>: Currently being assessed by environmental specialists</li>
                <li><span className="font-medium">Analyzed</span>: Assessment complete with type and severity determined</li>
                <li><span className="font-medium">Resolved</span>: Cleanup or remediation actions have been completed</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How You Can Help</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Report waste incidents you observe using our mobile app or website</li>
                <li>Include detailed location information and photos when possible</li>
                <li>Participate in community cleanup events</li>
                <li>Follow proper waste disposal guidelines to prevent new incidents</li>
              </ul>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <a
                  href="/download"
                  className="inline-flex items-center justify-center py-2.5 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  Download Mobile App
                </a>
                <Link 
                  href="/about"
                  className="inline-flex items-center justify-center py-2.5 px-4 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );}