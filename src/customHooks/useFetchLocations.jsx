import { useState } from "react";

const useFetchLocations = () => {
  const [isPending, setIsPending] = useState(false);
  const [locations, setLocations] = useState(null);

  const fetchLocations = async (query, lat, lng) => {
    try {
      setIsPending(true);

      const url = `http://localhost:3000/maps?lat=${encodeURIComponent(
        lat
      )}&lng=${encodeURIComponent(lng)}&query=${encodeURIComponent(query)}`;

      console.log(url);
      const response = await fetch(url, {
        method: "GET", // Changed to GET for sending query params in URL
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Google Places API response:", data);
      setLocations(data.results);
    } catch (error) {
      console.error("Error fetching locations:", error);
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
