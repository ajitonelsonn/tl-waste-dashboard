// components/ModernMap.js
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Layers, Info } from "lucide-react";

// Default center coordinates (Dili, Timor-Leste)
const DEFAULT_CENTER = [-8.55, 125.56];

// Helper function to safely parse numeric values
const parseNumeric = (value) => {
  if (value === undefined || value === null) return NaN;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? NaN : num;
};

// Helper function to validate coordinates
const isValidCoordinate = (lat, lng) => {
  const validLat = parseNumeric(lat);
  const validLng = parseNumeric(lng);
  return (
    !isNaN(validLat) &&
    !isNaN(validLng) &&
    validLat >= -90 &&
    validLat <= 90 &&
    validLng >= -180 &&
    validLng <= 180
  );
};

// Create marker icon based on status, severity, and focus state
const createMarkerIcon = (status, severity = 5, isFocused = false) => {
  let color;

  // Determine color based on status and severity
  if (status === "resolved") {
    color = "#10B981"; // Green
  } else if (status === "analyzed") {
    color = severity > 7 ? "#EF4444" : severity > 4 ? "#F59E0B" : "#10B981";
  } else if (status === "analyzing") {
    color = "#8B5CF6"; // Purple
  } else {
    color = "#3B82F6"; // Blue
  }

  // Create different HTML for focused vs regular markers
  const html = isFocused
    ? `<div style="background-color: ${color}; width: 18px; height: 18px; border: 3px solid #FFD700; border-radius: 50%; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>`
    : `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`;

  return L.divIcon({
    html: html,
    className: isFocused ? "custom-marker-icon focused" : "custom-marker-icon",
    iconSize: isFocused ? [18, 18] : [12, 12],
    iconAnchor: isFocused ? [9, 9] : [6, 6],
  });
};

// Helper function to safely format numeric values
const formatNumber = (value, decimals = 1) => {
  const num = parseNumeric(value);
  return !isNaN(num) ? num.toFixed(decimals) : "N/A";
};

const ModernMap = ({
  data,
  simplified = false,
  selectedHotspot = null,
  onHotspotSelect,
  focusedReportId = null, // New parameter for focused report
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [showLegend, setShowLegend] = useState(true);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);

  useEffect(() => {
    // Fix for Leaflet's default icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current && mapRef.current) {
      // Use a better tile layer for a more modern look
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: !simplified, // Hide zoom controls in simplified mode
        attributionControl: !simplified, // Hide attribution in simplified mode
        scrollWheelZoom: false, // Disable scroll wheel zoom to prevent interfering with page scroll
      }).setView(DEFAULT_CENTER, 11);

      // Add scroll wheel zoom only on map focus
      mapInstanceRef.current.on("focus", () => {
        mapInstanceRef.current.scrollWheelZoom.enable();
      });

      // Disable scroll wheel zoom when map loses focus
      mapInstanceRef.current.on("blur", () => {
        mapInstanceRef.current.scrollWheelZoom.disable();
      });

      // Add a modern tile layer (Stamen Terrain or CartoDB)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(mapInstanceRef.current);

      // Add custom controls for the simplified view
      if (simplified) {
        // Add a minimalist zoom control in the top right corner
        L.control
          .zoom({
            position: "topright",
          })
          .addTo(mapInstanceRef.current);
      }

      // Add a legend control
      if (!simplified) {
        const legendControl = L.control({ position: "bottomright" });
        legendControl.onAdd = function () {
          const div = L.DomUtil.create(
            "div",
            "legend bg-white p-3 rounded-lg shadow-md text-sm"
          );
          div.innerHTML = `
            <h4 class="font-medium mb-2">Map Legend</h4>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span style="background-color: #10B981; width: 10px; height: 10px; border-radius: 50%; display: inline-block"></span>
                <span>Resolved</span>
              </div>
              <div class="flex items-center gap-2">
                <span style="background-color: #F59E0B; width: 10px; height: 10px; border-radius: 50%; display: inline-block"></span>
                <span>Medium Severity</span>
              </div>
              <div class="flex items-center gap-2">
                <span style="background-color: #EF4444; width: 10px; height: 10px; border-radius: 50%; display: inline-block"></span>
                <span>High Severity</span>
              </div>
              <div class="flex items-center gap-2">
                <span style="background-color: #8B5CF6; width: 10px; height: 10px; border-radius: 50%; display: inline-block"></span>
                <span>Analyzing</span>
              </div>
              ${
                focusedReportId
                  ? `
              <div class="flex items-center gap-2">
                <span style="background-color: gold; width: 10px; height: 10px; border: 2px solid #fff; border-radius: 50%; display: inline-block; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></span>
                <span>Focused Report</span>
              </div>
              `
                  : ""
              }
            </div>
          `;
          return div;
        };
        legendControl.addTo(mapInstanceRef.current);
      }
    }

    return () => {
      // Clean up map instance when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [simplified, focusedReportId]);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !data) return;

    // Extract reports and hotspots
    const { reports = [], hotspots = [] } = data;

    // Clear previous markers and circles
    markersRef.current.forEach((marker) => marker.remove());
    circlesRef.current.forEach((circle) => circle.remove());
    markersRef.current = [];
    circlesRef.current = [];

    // Filter valid reports
    const validReports = reports.filter((report) =>
      isValidCoordinate(report.latitude, report.longitude)
    );

    // Add report markers
    validReports.forEach((report) => {
      const position = [
        parseNumeric(report.latitude),
        parseNumeric(report.longitude),
      ];

      const isFocused = report.report_id === focusedReportId;

      const marker = L.marker(position, {
        icon: createMarkerIcon(
          report.status,
          parseNumeric(report.severity_score),
          isFocused
        ),
        zIndexOffset: isFocused ? 1000 : 0, // Make focused marker appear on top
      }).addTo(mapInstanceRef.current);

      // Add modern styled popup with image if available
      const popupContent = `
        <div class="max-w-xs">
          <div class="font-semibold text-emerald-700 mb-1">Report #${
            report.report_id
          }</div>
          <div class="text-xs text-gray-500 mb-2">${new Date(
            report.report_date
          ).toLocaleDateString()}</div>
          
          ${
            report.image_url
              ? `
            <div class="mb-3">
              <img src="${report.image_url}" alt="Report image" class="w-full h-32 object-cover rounded-md shadow-sm" />
            </div>
          `
              : ""
          }
          
          <div class="text-sm">
            ${
              report.waste_type
                ? `<div class="mb-1"><span class="font-medium">Type:</span> ${report.waste_type}</div>`
                : '<div class="mb-1 text-gray-500 italic">Not yet analyzed</div>'
            }
            
            ${
              report.severity_score
                ? `<div class="mb-1">
                <span class="font-medium">Severity:</span> 
                <span class="${
                  report.severity_score > 7
                    ? "text-red-600"
                    : report.severity_score > 4
                    ? "text-amber-600"
                    : "text-green-600"
                } font-medium">${report.severity_score}/10</span>
              </div>`
                : ""
            }
            
            ${
              report.description
                ? `
              <div class="mb-1 mt-2">
                <span class="font-medium">Description:</span>
                <p class="text-gray-600 text-xs mt-1">${report.description}</p>
              </div>
            `
                : ""
            }
          </div>
          
          <div class="mt-2">
            <span class="inline-block px-2 py-1 text-xs rounded-full ${
              report.status === "resolved"
                ? "bg-green-100 text-green-800"
                : report.status === "analyzed"
                ? "bg-blue-100 text-blue-800"
                : report.status === "analyzing"
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-100 text-gray-800"
            }">
              ${report.status}
            </span>
          </div>
        </div>
      `;

      // Create a more modern popup with custom styling
      const popup = L.popup({
        className: "modern-popup",
        closeButton: true,
        autoClose: true,
        closeOnEscapeKey: true,
        closeOnClick: true,
        maxWidth: 300,
      }).setContent(popupContent);

      marker.bindPopup(popup);

      // If this is the focused report, add a highlight and open the popup
      if (isFocused) {
        // Add a highlight circle around the marker
        const highlightCircle = L.circle(position, {
          radius: 50,
          fillColor: "#FFD700",
          fillOpacity: 0.3,
          color: "#FFD700",
          weight: 2,
          className: "pulse-circle", // Add a CSS class for pulsing animation
        }).addTo(mapInstanceRef.current);

        markersRef.current.push(highlightCircle);

        // Automatically open the popup for the focused report
        marker.openPopup();
      }

      markersRef.current.push(marker);
    });

    // Filter valid hotspots
    const validHotspots = hotspots.filter((hotspot) =>
      isValidCoordinate(hotspot.center_latitude, hotspot.center_longitude)
    );

    // Add hotspot circles with modern styling
    validHotspots.forEach((hotspot) => {
      const position = [
        parseNumeric(hotspot.center_latitude),
        parseNumeric(hotspot.center_longitude),
      ];

      // Determine if this hotspot is selected
      const isSelected =
        selectedHotspot && hotspot.hotspot_id === selectedHotspot.hotspot_id;

      // Create a more visually appealing hotspot visualization
      const circle = L.circle(position, {
        radius: parseNumeric(hotspot.radius_meters) || 500,
        fillColor: "#ef4444",
        fillOpacity: isSelected ? 0.25 : 0.15,
        color: "#ef4444",
        weight: isSelected ? 2 : 1.5,
        dashArray: "5, 5",
      }).addTo(mapInstanceRef.current);

      // Add modern hotspot popup
      const hotspotPopupContent = `
        <div class="max-w-xs">
          <div class="font-semibold text-red-700 mb-1">${hotspot.name}</div>
          <div class="text-xs text-gray-500 mb-2">First reported: ${
            hotspot.first_reported
          }</div>
          
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="font-medium">Reports:</span> ${hotspot.total_reports}
            </div>
            
            ${
              hotspot.average_severity
                ? `<div>
                <span class="font-medium">Severity:</span> 
                <span class="${
                  parseNumeric(hotspot.average_severity) > 7
                    ? "text-red-600"
                    : parseNumeric(hotspot.average_severity) > 4
                    ? "text-amber-600"
                    : "text-green-600"
                } font-medium">${formatNumber(
                    hotspot.average_severity
                  )}/10</span>
              </div>`
                : ""
            }
            
            <div>
              <span class="font-medium">Radius:</span> ${formatNumber(
                hotspot.radius_meters / 1000
              )}km
            </div>
          </div>
          
          <div class="mt-3 text-center">
            <a href="/hotspots?id=${
              hotspot.hotspot_id
            }" class="inline-block px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
              View Details
            </a>
          </div>
        </div>
      `;

      const hotspotPopup = L.popup({
        className: "modern-popup",
        closeButton: true,
        maxWidth: 300,
      }).setContent(hotspotPopupContent);

      circle.bindPopup(hotspotPopup);

      // Add click handler if onHotspotSelect function is provided
      if (onHotspotSelect) {
        circle.on("click", () => {
          onHotspotSelect(hotspot);
        });
      }

      circlesRef.current.push(circle);
    });

    // Handle map view positioning based on focused content

    // If there's a focused report, center on it with higher zoom level
    const focusedReport = focusedReportId
      ? validReports.find((r) => r.report_id === focusedReportId)
      : null;

    if (
      focusedReport &&
      isValidCoordinate(focusedReport.latitude, focusedReport.longitude)
    ) {
      mapInstanceRef.current.setView(
        [
          parseNumeric(focusedReport.latitude),
          parseNumeric(focusedReport.longitude),
        ],
        15 // Higher zoom level for focused reports
      );
    }
    // If a hotspot is selected, focus on it
    else if (
      selectedHotspot &&
      isValidCoordinate(
        selectedHotspot.center_latitude,
        selectedHotspot.center_longitude
      )
    ) {
      const position = [
        parseNumeric(selectedHotspot.center_latitude),
        parseNumeric(selectedHotspot.center_longitude),
      ];
      mapInstanceRef.current.setView(position, 13);
    }
    // Otherwise adjust map view to fit all points if we have valid points
    else if (validReports.length > 0 || validHotspots.length > 0) {
      const allPoints = [
        ...validReports.map((r) => [
          parseNumeric(r.latitude),
          parseNumeric(r.longitude),
        ]),
        ...validHotspots.map((h) => [
          parseNumeric(h.center_latitude),
          parseNumeric(h.center_longitude),
        ]),
      ];

      try {
        const bounds = L.latLngBounds(allPoints);
        // Add some padding to bounds
        mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
      } catch (e) {
        // Fallback to default view if bounds calculation fails
        mapInstanceRef.current.setView(DEFAULT_CENTER, 11);
      }
    }
  }, [data, selectedHotspot, onHotspotSelect, focusedReportId]);

  // UI controls for the map
  const mapControls = simplified ? null : (
    <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2 pointer-events-auto">
      <button
        onClick={() => setShowLegend((prev) => !prev)}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
        title="Toggle legend"
      >
        <Info className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );

  return (
    <div className="map-container relative h-full w-full">
      <div
        ref={mapRef}
        className="h-full w-full rounded-lg overflow-hidden"
      ></div>
      {mapControls}

      {/* Map interaction instruction */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white px-3 py-1.5 rounded-lg shadow-md text-xs text-gray-600 pointer-events-none opacity-80">
        Click to enable scroll zoom
      </div>

      {/* Overlay showing count of data points for simplified view */}
      {simplified && data && (
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 pointer-events-auto">
          <div className="bg-white py-1.5 px-3 rounded-lg shadow-md flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">
              {data.reports ? data.reports.length : 0} Reports
            </span>
          </div>
          <div className="bg-white py-1.5 px-3 rounded-lg shadow-md flex items-center gap-2">
            <Layers className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">
              {data.hotspots ? data.hotspots.length : 0} Hotspots
            </span>
          </div>
        </div>
      )}

      {/* Indicator for focused report */}
      {focusedReportId && (
        <div className="absolute top-4 left-4 z-[1000] bg-yellow-50 border border-yellow-200 rounded-lg py-1.5 px-3 shadow-md">
          <span className="text-sm font-medium text-yellow-800">
            Viewing Report #{focusedReportId}
          </span>
        </div>
      )}
    </div>
  );
};

export default ModernMap;
