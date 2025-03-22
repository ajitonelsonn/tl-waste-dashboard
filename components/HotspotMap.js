// components/HotspotMap.js
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// Helper function to safely format numeric values
const formatNumber = (value, decimals = 1) => {
  const num = parseNumeric(value);
  return !isNaN(num) ? num.toFixed(decimals) : "N/A";
};

const HotspotMap = ({ hotspots = [], selectedHotspot, onHotspotSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const circlesRef = useRef({});

  // Initialize map
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
      mapInstanceRef.current = L.map(mapRef.current).setView(
        DEFAULT_CENTER,
        11
      );

      // Add base tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      // Clean up map instance when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update hotspots on the map
  useEffect(() => {
    if (!mapInstanceRef.current || !hotspots) return;

    // Clear previous circles that are no longer in the data
    Object.keys(circlesRef.current).forEach((id) => {
      const hotspotExists = hotspots.some(
        (h) => h.hotspot_id.toString() === id
      );
      if (!hotspotExists) {
        circlesRef.current[id].remove();
        delete circlesRef.current[id];
      }
    });

    // Filter valid hotspots
    const validHotspots = hotspots.filter((hotspot) =>
      isValidCoordinate(hotspot.center_latitude, hotspot.center_longitude)
    );

    // Calculate map center
    let center = DEFAULT_CENTER;
    if (
      selectedHotspot &&
      isValidCoordinate(
        selectedHotspot.center_latitude,
        selectedHotspot.center_longitude
      )
    ) {
      center = [
        parseNumeric(selectedHotspot.center_latitude),
        parseNumeric(selectedHotspot.center_longitude),
      ];
    } else if (validHotspots.length > 0) {
      const totalLat = validHotspots.reduce(
        (sum, h) => sum + parseNumeric(h.center_latitude),
        0
      );
      const totalLng = validHotspots.reduce(
        (sum, h) => sum + parseNumeric(h.center_longitude),
        0
      );
      center = [
        totalLat / validHotspots.length,
        totalLng / validHotspots.length,
      ];
    }

    // Update or add circles for hotspots
    validHotspots.forEach((hotspot) => {
      const hotspotId = hotspot.hotspot_id.toString();
      const position = [
        parseNumeric(hotspot.center_latitude),
        parseNumeric(hotspot.center_longitude),
      ];

      const isSelected = selectedHotspot?.hotspot_id === hotspot.hotspot_id;

      // components/HotspotMap.js (continued)
      const circleOptions = {
        radius: parseNumeric(hotspot.radius_meters) || 500,
        fillColor: isSelected ? "#EF4444" : "#F87171",
        fillOpacity: isSelected ? 0.4 : 0.2,
        color: isSelected ? "#B91C1C" : "#EF4444",
        weight: isSelected ? 2 : 1,
        bubblingMouseEvents: false,
      };

      // Update existing circle or create a new one
      if (circlesRef.current[hotspotId]) {
        // Update existing circle
        circlesRef.current[hotspotId].setLatLng(position);
        circlesRef.current[hotspotId].setRadius(circleOptions.radius);
        circlesRef.current[hotspotId].setStyle({
          fillColor: circleOptions.fillColor,
          fillOpacity: circleOptions.fillOpacity,
          color: circleOptions.color,
          weight: circleOptions.weight,
        });
      } else {
        // Create new circle
        const circle = L.circle(position, circleOptions).addTo(
          mapInstanceRef.current
        );

        // Add popup
        circle.bindPopup(`
          <div class="max-w-xs">
            <div class="font-semibold text-red-700">${hotspot.name}</div>
            <div class="text-sm">
              <div>Reports: ${hotspot.total_reports}</div>
              ${
                hotspot.average_severity
                  ? `<div>Avg. Severity: ${formatNumber(
                      hotspot.average_severity
                    )}/10</div>`
                  : ""
              }
              <div>First reported: ${hotspot.first_reported}</div>
              <div>Radius: ${formatNumber(hotspot.radius_meters / 1000)}km</div>
            </div>
            <button class="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
              View Details
            </button>
          </div>
        `);

        // Add click handler
        circle.on("click", () => {
          if (onHotspotSelect) {
            onHotspotSelect(hotspot);
          }
        });

        // Store the circle reference
        circlesRef.current[hotspotId] = circle;
      }
    });

    // If a hotspot is selected, center the map on it
    if (
      selectedHotspot &&
      isValidCoordinate(
        selectedHotspot.center_latitude,
        selectedHotspot.center_longitude
      )
    ) {
      mapInstanceRef.current.setView(
        [
          parseNumeric(selectedHotspot.center_latitude),
          parseNumeric(selectedHotspot.center_longitude),
        ],
        13
      );
    } else if (validHotspots.length > 0) {
      // Create bounds from all hotspots
      const bounds = L.latLngBounds(
        validHotspots.map((h) => [
          parseNumeric(h.center_latitude),
          parseNumeric(h.center_longitude),
        ])
      );

      // Fit map to bounds
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [hotspots, selectedHotspot, onHotspotSelect]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>;
};

export default HotspotMap;
