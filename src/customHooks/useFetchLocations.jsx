import { useState } from "react";
import API_BASE from "../config";
import {
  demoPantries,
  markDemoMode,
  clearDemoMode,
} from "../data/demoCatalog";

const useFetchLocations = () => {
  const [isPending, setIsPending] = useState(false);
  const [locations, setLocations] = useState(null);

  const fetchLocations = async (query, lat, lng) => {
    try {
      setIsPending(true);

      const url = `${API_BASE}/maps?lat=${encodeURIComponent(
        lat
      )}&lng=${encodeURIComponent(lng)}&query=${encodeURIComponent(query)}`;

      const response = await fetch(url, {
        method: "GET", // Changed to GET for sending query params in URL
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("application/json")
      ) {
        // Live backend unreachable: show the sample pantries near the
        // demo location instead of an empty map.
        setLocations(demoPantries);
        markDemoMode();
        setIsPending(false);
        return;
      }

      const data = await response.json();
      clearDemoMode();
      setLocations(data.results);
    } catch (error) {
      setLocations(demoPantries);
      markDemoMode();
      console.warn("Live backend unreachable, serving demo pantries:", error);
    } finally {
      setIsPending(false);
    }
  };

  const refetchLocations = (query, lat, lng) => {
    if (
      query &&
      query.length > 0 &&
      typeof lat === "number" &&
      typeof lng === "number"
    ) {
      fetchLocations(query, lat, lng);
    }
  };

  return { locations, isPending, refetchLocations };
};

export default useFetchLocations;
