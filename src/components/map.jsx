import { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Shows the user's location plus a marker per pantry. Markers are tracked
// and cleared on every update; the old version added a new marker on each
// location change and never removed the old ones.
function Map({ location, markerName, locations = [] }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!location || !containerRef.current) return;

    if (!mapRef.current) {
      const mapInstance = L.map(containerRef.current).setView(
        [location.lat, location.lng],
        14
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance);

      mapRef.current = mapInstance;
    } else {
      mapRef.current.setView([location.lat, location.lng], 14);
    }

    // Clear the previous markers before drawing the new set.
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const youAreHere = L.marker([location.lat, location.lng])
      .addTo(mapRef.current)
      .bindPopup(markerName || "Your Location");
    markersRef.current.push(youAreHere);

    locations.forEach((place) => {
      const placeLoc = place.geometry?.location;
      if (!placeLoc) return;
      const marker = L.marker([placeLoc.lat, placeLoc.lng])
        .addTo(mapRef.current)
        .bindPopup(place.name);
      markersRef.current.push(marker);
    });
    youAreHere.openPopup();
  }, [location, markerName, locations]);

  useEffect(() => {
    // Destroy the map only on unmount.
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-[30rem] h-[30rem] border border-black">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

export default Map;
