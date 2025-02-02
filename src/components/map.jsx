import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import useFetchLocations from "../customHooks/useFetchLocations";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function Map({ location, markerName }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!location) return; // do nothing if location is null/undefined

    if (!containerRef.current) return;
    if (!markerName || markerName === "") {
      markerName = "Your Location";
    }

    if (!mapRef.current) {
      // Map is not created yet, so create it
      const { lat, lng } = location;
      const mapInstance = L.map(containerRef.current).setView([lat, lng], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance);

      L.marker([lat, lng])
        .addTo(mapInstance)
        .bindPopup(`Marker at (${lat}, ${lng})`)
        .openPopup();

      mapRef.current = mapInstance;
    } else {
      // Map already exists, so just re-center it
      mapRef.current.setView([location.lat, location.lng], 14);

      // If you want to move an existing marker instead of creating a new one:
      // - store the marker in a ref as well
      // - or remove the old marker and add a new one here
      L.marker([location.lat, location.lng])
        .addTo(mapRef.current)
        .bindPopup(markerName)
        .openPopup();
    }

    // Optional: If you do NOT want to destroy and recreate the map on every update,
    // do NOT remove it in this cleanup. Only remove it on final unmount.
    return () => {
      // If you want to remove the map every time the location changes,
      // you'd do mapRef.current.remove(). But usually, you'd keep the same mapRef
      // for performance reasons. So you might leave this out and only remove on unmount.
    };
  }, [location, markerName]); // <-- add location in the dependency array

  return (
    <>
      <div className="w-[30rem] h-[30rem] border border-black">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </>
  );
}

export default Map;
